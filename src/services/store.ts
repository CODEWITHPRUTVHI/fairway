import { useState, useEffect } from 'react';
import {
  AuditLogEvent,
  FareLedgerEntry,
  LocationPoint,
  MatchProposal,
  PastRideHistoryItem,
  PassengerAllocation,
  RideRequest,
  RouteStop,
  SafetyIncident,
  SystemConfig,
  Trip,
  TripState,
  TrustedContact,
  UserProfile,
  VehicleOption,
} from '../types';
import {
  DEFAULT_SYSTEM_CONFIG,
  NASHIK_LOCATIONS,
  INITIAL_AUDIT_LOGS,
  PAST_RIDES,
  SEEDED_DRIVERS,
  SEEDED_PASSENGERS,
  VEHICLE_OPTIONS,
} from '../data/mockData';
import { generateMatchProposal } from '../algorithms/matching';
import {
  calculateUrbanRoadDistanceKm,
  calculateUrbanTravelTimeMin,
} from '../algorithms/routing';

export interface AppState {
  language: 'en' | 'mr' | 'hi';
  currentRole: 'CUSTOMER' | 'DRIVER' | 'ADMIN' | 'TESTS';
  viewportMode: 'PHONE_SIMULATOR' | 'DUAL_SIMULATOR' | 'RESPONSIVE_CANVAS';
  isCustomerAuthenticated: boolean;
  isDriverAuthenticated: boolean;
  currentUser: UserProfile;
  driverUser: typeof SEEDED_DRIVERS[0];
  isAdminAuthenticated: boolean;
  matchingSecondsLeft: number;
  matchingTimedOut: boolean;
  demandTier: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
  demandMultiplier: number;
  selectedVehicle: VehicleOption;
  pickupLocation: LocationPoint;
  destinationLocation: LocationPoint;
  womenOnlyPreference: boolean;
  passengerCount: number;
  paymentMethod: 'CASH' | 'CAPAY';
  isSearchingPartners: boolean;
  matchingSearchStep: string;
  activeRequest: RideRequest | null;
  activeProposal: MatchProposal | null;
  activeTrip: Trip | null;
  incomingAssignment: MatchProposal | null;
  showDriverRidePopup: boolean;
  pendingDriverRide: MatchProposal | null;
  driverOnline: boolean;
  driverLocation: { lat: number; lng: number };
  ledgerEntries: FareLedgerEntry[];
  trustedContacts: TrustedContact[];
  safetyIncidents: SafetyIncident[];
  simulatedNotification: string | null;
  systemConfig: SystemConfig;
  auditLogs: AuditLogEvent[];
  pastRides: PastRideHistoryItem[];
  realTimeSpeedKmh: number;
}

// Initial state configured for Nashik District Auto Rickshaw Pooling
const INITIAL_STATE: AppState = {
  language: 'en',
  currentRole: 'CUSTOMER',
  viewportMode: 'PHONE_SIMULATOR',
  isCustomerAuthenticated: false, // Prompts user login window first as requested
  isDriverAuthenticated: false,
  isAdminAuthenticated: false,
  matchingSecondsLeft: 300,
  matchingTimedOut: false,
  demandTier: 'NORMAL',
  demandMultiplier: 1.0,
  currentUser: SEEDED_PASSENGERS[0], // Pooja Sharma
  driverUser: SEEDED_DRIVERS[0], // Ramesh Shinde Kaka (MH-15 Auto)
  selectedVehicle: VEHICLE_OPTIONS[0], // Share-Auto 3-Seater
  pickupLocation: NASHIK_LOCATIONS[0], // CBS Central Bus Stand
  destinationLocation: NASHIK_LOCATIONS[1], // College Road BYK Chowk
  womenOnlyPreference: true,
  passengerCount: 1,
  paymentMethod: 'CASH',
  isSearchingPartners: false,
  matchingSearchStep: '',
  activeRequest: null,
  activeProposal: null,
  activeTrip: null,
  incomingAssignment: null,
  showDriverRidePopup: false,
  pendingDriverRide: null,
  driverOnline: true,
  driverLocation: { lat: 19.9980, lng: 73.7890 }, // Near CBS Auto Stand
  ledgerEntries: [
    {
      id: 'led-nashik-init-1',
      tripId: 'trip-prev-nashik-1',
      driverId: 'driver-ramesh',
      grossPooledFare: 88.00,
      platformCommissionPercent: 10,
      platformCommissionAmount: 8.80,
      driverNetPayout: 79.20,
      passengersCount: 3,
      timestamp: Date.now() - 7200000,
      status: 'SETTLED',
    },
  ],
  trustedContacts: [
    {
      id: 'tc-1',
      name: 'Aai (Sunita Sharma)',
      phone: '+91 98229 11223',
      relationship: 'Mother',
    },
    {
      id: 'tc-2',
      name: 'Friend (Snehal Patil)',
      phone: '+91 98233 77889',
      relationship: 'Friend',
    },
  ],
  safetyIncidents: [],
  simulatedNotification: null,
  systemConfig: DEFAULT_SYSTEM_CONFIG,
  auditLogs: INITIAL_AUDIT_LOGS,
  pastRides: PAST_RIDES,
  realTimeSpeedKmh: 28,
};

let globalState: AppState = { ...INITIAL_STATE };
const listeners = new Set<(state: AppState) => void>();

function notify() {
  listeners.forEach((l) => l({ ...globalState }));
}

// REAL-TIME GPS MOVEMENT & DISPATCH TIMER
let simInterval: any = null;

function ensureSimulationLoop() {
  if (simInterval) return;

  simInterval = setInterval(() => {
    let stateChanged = false;

    // Movement Case 1: Driver approaching meetup point
    if (
      globalState.activeTrip &&
      globalState.activeTrip.state === 'DRIVER_ASSIGNED' &&
      globalState.driverOnline
    ) {
      const trip = globalState.activeTrip;
      const target = trip.meetingPoint;
      const dLat = target.lat - trip.driverLocation.lat;
      const dLng = target.lng - trip.driverLocation.lng;
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);

      if (dist < 0.001) {
        // Driver arrived at meetup point!
        trip.state = 'AT_MEETUP';
        trip.driverLocation = { lat: target.lat, lng: target.lng };
        globalState.driverLocation = { lat: target.lat, lng: target.lng };
        globalState.simulatedNotification = `🛺 Auto Rickshaw (${trip.plateNumber}) has arrived at ${target.name}! Show your 4-digit PIN to board.`;
        stateChanged = true;
      } else {
        // Move towards meetup point smoothly
        const step = 0.0015;
        const newLat = trip.driverLocation.lat + (dLat / dist) * Math.min(step, dist);
        const newLng = trip.driverLocation.lng + (dLng / dist) * Math.min(step, dist);
        trip.driverLocation = { lat: Number(newLat.toFixed(5)), lng: Number(newLng.toFixed(5)) };
        globalState.driverLocation = trip.driverLocation;
        stateChanged = true;
      }
    }

    // Movement Case 2: Trip In Progress (moving towards dropoff)
    if (
      globalState.activeTrip &&
      globalState.activeTrip.state === 'IN_PROGRESS' &&
      globalState.driverOnline
    ) {
      const trip = globalState.activeTrip;
      const currentStop = trip.stops[trip.currentStopIndex];
      if (currentStop) {
        const target = currentStop.location;
        const dLat = target.lat - trip.driverLocation.lat;
        const dLng = target.lng - trip.driverLocation.lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);

        if (dist > 0.0012) {
          const step = 0.0018;
          const newLat = trip.driverLocation.lat + (dLat / dist) * Math.min(step, dist);
          const newLng = trip.driverLocation.lng + (dLng / dist) * Math.min(step, dist);
          trip.driverLocation = { lat: Number(newLat.toFixed(5)), lng: Number(newLng.toFixed(5)) };
          globalState.driverLocation = trip.driverLocation;
          stateChanged = true;
        }
      }
    }

    if (stateChanged) {
      notify();
    }
  }, 1200);
}

// Start simulation ticker
ensureSimulationLoop();

export function useFairwayStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const setLanguage = (lang: 'en' | 'mr' | 'hi') => {
    globalState.language = lang;
    notify();
  };

  const setRole = (role: AppState['currentRole']) => {
    globalState.currentRole = role;
    notify();
  };

  const setViewportMode = (mode: AppState['viewportMode']) => {
    globalState.viewportMode = mode;
    notify();
  };

  const setPickup = (loc: LocationPoint) => {
    globalState.pickupLocation = loc;
    notify();
  };

  const setDestination = (loc: LocationPoint) => {
    globalState.destinationLocation = loc;
    notify();
  };

  const setSelectedVehicle = (veh: VehicleOption) => {
    globalState.selectedVehicle = veh;
    notify();
  };

  const setWomenOnly = (val: boolean) => {
    globalState.womenOnlyPreference = val;
    notify();
  };

  const setPaymentMethod = (pm: 'CASH' | 'CAPAY') => {
    globalState.paymentMethod = pm;
    notify();
  };

  const setDriverOnline = (online: boolean) => {
    globalState.driverOnline = online;
    notify();
  };

  /**
   * Action: User or Driver Login / Logout
   */
  const loginCustomer = (
    name: string,
    phone: string,
    gender: 'female' | 'male' | 'other' = 'female'
  ) => {
    globalState.currentUser = {
      id: `user-${Date.now()}`,
      name,
      phone,
      gender,
      role: 'CUSTOMER',
      rating: 5.0,
    };
    globalState.womenOnlyPreference = gender === 'female';
    globalState.isCustomerAuthenticated = true;
    notify();
  };

  const logoutCustomer = () => {
    globalState.isCustomerAuthenticated = false;
    notify();
  };

  const loginDriver = (name: string, plateNumber: string, autoModel: string) => {
    globalState.driverUser = {
      ...globalState.driverUser,
      id: `driver-${Date.now()}`,
      name,
      plateNumber,
      vehicleModel: autoModel,
    };
    globalState.isDriverAuthenticated = true;
    notify();
  };

  const logoutDriver = () => {
    globalState.isDriverAuthenticated = false;
    notify();
  };

  const quickDemoLoginBoth = () => {
    globalState.isCustomerAuthenticated = true;
    globalState.isDriverAuthenticated = true;
    globalState.simulatedNotification = '⚡ Logged in as both Pooja Sharma (Passenger) & Ramesh Kaka (Auto Driver)! Ready for Dual/Split testing.';
    notify();
  };

  /**
   * Action: Set Peak-Hour Demand Tier (0.9x to 1.4x)
   */
  const setDemandTier = (tier: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH') => {
    globalState.demandTier = tier;
    globalState.demandMultiplier = tier === 'LOW' ? 0.9 : tier === 'NORMAL' ? 1.0 : tier === 'HIGH' ? 1.2 : 1.4;
    globalState.systemConfig.demandTier = tier;
    globalState.systemConfig.demandMultiplier = globalState.demandMultiplier;
    globalState.simulatedNotification = `⚡ Demand Tier set to ${tier} (${globalState.demandMultiplier}× Multiplier).`;
    notify();
  };

  /**
   * Action: Admin / Dispatcher Login
   */
  const loginAdmin = (pin: string = '9999'): boolean => {
    if (pin.trim() === '9999' || pin.trim() === '1234' || pin.trim() === '') {
      globalState.isAdminAuthenticated = true;
      globalState.currentRole = 'ADMIN';
      globalState.simulatedNotification = '👮 Authenticated as Nashik Operations Dispatcher.';
      notify();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    globalState.isAdminAuthenticated = false;
    globalState.currentRole = 'CUSTOMER';
    notify();
  };

  let searchTimerTimeout: any = null;

  /**
   * Create Matched Group Proposal (Max 3 auto capacity, 1 km anchor radius)
   */
  const createMatchedGroupProposal = () => {
    if (!globalState.activeRequest) return;
    const req = globalState.activeRequest;

    // Pick dummy co-passengers that strictly adhere to gender rules
    const partner1 = globalState.womenOnlyPreference
      ? SEEDED_PASSENGERS[1] // Snehal Patil (female)
      : SEEDED_PASSENGERS[2]; // Rahul Deshmukh (male)

    const partner2 = globalState.womenOnlyPreference
      ? SEEDED_PASSENGERS[3] // Neha Kulkarni (female)
      : SEEDED_PASSENGERS[1]; // Snehal Patil (female)

    // Partner 1: Waiting at the same Nashik Auto Stand, destination slightly beyond
    const p1Origin: LocationPoint = {
      id: `origin-p1-${Date.now()}`,
      name: `${globalState.pickupLocation.name.split('(')[0].trim()} Auto Stand`,
      address: globalState.pickupLocation.address,
      lat: Number((globalState.pickupLocation.lat + 0.0006).toFixed(4)),
      lng: Number((globalState.pickupLocation.lng + 0.0004).toFixed(4)),
    };

    const p1Dest: LocationPoint = {
      id: `dest-p1-${Date.now()}`,
      name: `${globalState.destinationLocation.name} (Corridor North)`,
      address: globalState.destinationLocation.address,
      lat: Number((globalState.destinationLocation.lat + 0.0018).toFixed(4)),
      lng: Number((globalState.destinationLocation.lng + 0.0012).toFixed(4)),
    };

    const p1Dist = calculateUrbanRoadDistanceKm(p1Origin, p1Dest);
    const p1Duration = calculateUrbanTravelTimeMin(p1Dist);
    const p1Cost = Math.max(30, Math.round(globalState.selectedVehicle.soloPrice * 1.08 * globalState.demandMultiplier));

    const partnerReq1: RideRequest = {
      id: `req-partner1-${Date.now()}`,
      passengerId: partner1.id,
      passengerName: partner1.name,
      passengerGender: partner1.gender,
      origin: p1Origin,
      destination: p1Dest,
      vehicleOptionId: globalState.selectedVehicle.id,
      soloBaselineDistanceKm: p1Dist,
      soloBaselineDurationMin: p1Duration,
      soloBaselineCost: p1Cost,
      passengerCount: 1,
      womenOnlyPreference: globalState.womenOnlyPreference,
      maxWaitTimeMin: 5,
      createdAt: Date.now() - 45000,
      status: 'PENDING',
    };

    // Partner 2: Also at auto stand, intermediate dropoff stop
    const p2Origin: LocationPoint = {
      id: `origin-p2-${Date.now()}`,
      name: `${globalState.pickupLocation.name.split('(')[0].trim()} Stand Platform 2`,
      address: globalState.pickupLocation.address,
      lat: Number((globalState.pickupLocation.lat + 0.0003).toFixed(4)),
      lng: Number((globalState.pickupLocation.lng + 0.0002).toFixed(4)),
    };

    const p2Dest: LocationPoint = {
      id: `dest-p2-${Date.now()}`,
      name: `Midway Stop (${globalState.pickupLocation.name.split(' ')[0]} - ${globalState.destinationLocation.name.split(' ')[0]})`,
      address: `Midway Road Junction, Nashik`,
      lat: Number(((globalState.pickupLocation.lat * 0.45) + (globalState.destinationLocation.lat * 0.55)).toFixed(4)),
      lng: Number(((globalState.pickupLocation.lng * 0.45) + (globalState.destinationLocation.lng * 0.55)).toFixed(4)),
    };

    const p2Dist = calculateUrbanRoadDistanceKm(p2Origin, p2Dest);
    const p2Duration = calculateUrbanTravelTimeMin(p2Dist);
    const p2Cost = Math.max(25, Math.round(globalState.selectedVehicle.soloPrice * 0.78 * globalState.demandMultiplier));

    const partnerReq2: RideRequest = {
      id: `req-partner2-${Date.now()}`,
      passengerId: partner2.id,
      passengerName: partner2.name,
      passengerGender: partner2.gender,
      origin: p2Origin,
      destination: p2Dest,
      vehicleOptionId: globalState.selectedVehicle.id,
      soloBaselineDistanceKm: p2Dist,
      soloBaselineDurationMin: p2Duration,
      soloBaselineCost: p2Cost,
      passengerCount: 1,
      womenOnlyPreference: globalState.womenOnlyPreference,
      maxWaitTimeMin: 5,
      createdAt: Date.now() - 90000,
      status: 'PENDING',
    };

    const proposal = generateMatchProposal(
      [req, partnerReq1, partnerReq2],
      globalState.selectedVehicle.id
    );

    if ('id' in proposal) {
      // Apply demand multiplier
      const mult = globalState.demandMultiplier;
      proposal.totalPooledCost = Math.round(proposal.totalPooledCost * mult);
      Object.values(proposal.allocations).forEach((a) => {
        a.soloFare = Math.round(a.soloFare * mult);
        a.pooledFare = Math.round(a.pooledFare * mult);
        a.savingsAmount = Math.max(0, a.soloFare - a.pooledFare);
      });

      globalState.activeProposal = proposal;
      if (globalState.activeRequest) {
        globalState.activeRequest.status = 'MATCHED';
      }
      globalState.simulatedNotification = `🛺 Auto Pool Group created with ${partner1.name} and ${partner2.name}! 15% Detour bound satisfied.`;
    }

    globalState.isSearchingPartners = false;
    globalState.matchingSearchStep = '';
    globalState.matchingTimedOut = false;
    notify();
  };

  /**
   * Action: Book a Ride (Real-time Sliding Window Matching with 5-minute timer)
   */
  const bookRide = () => {
    const dist = calculateUrbanRoadDistanceKm(
      globalState.pickupLocation,
      globalState.destinationLocation
    );
    const duration = calculateUrbanTravelTimeMin(dist);
    const mult = globalState.demandMultiplier;
    const soloCost = Math.round(globalState.selectedVehicle.soloPrice * mult);

    const req: RideRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      passengerId: globalState.currentUser.id,
      passengerName: globalState.currentUser.name,
      passengerGender: globalState.currentUser.gender,
      origin: globalState.pickupLocation,
      destination: globalState.destinationLocation,
      vehicleOptionId: globalState.selectedVehicle.id,
      soloBaselineDistanceKm: dist,
      soloBaselineDurationMin: duration,
      soloBaselineCost: soloCost,
      passengerCount: globalState.passengerCount,
      womenOnlyPreference: globalState.womenOnlyPreference,
      maxWaitTimeMin: 5,
      createdAt: Date.now(),
      status: 'PENDING',
    };

    globalState.activeRequest = req;
    globalState.isSearchingPartners = true;
    globalState.matchingTimedOut = false;
    globalState.matchingSecondsLeft = 300; // 5-minute countdown
    globalState.matchingSearchStep = `Scanning 1.0 km anchor radius around ${globalState.pickupLocation.name.split('(')[0].trim()}...`;
    notify();

    // Step 1: Direction compatibility check
    setTimeout(() => {
      if (!globalState.isSearchingPartners) return;
      globalState.matchingSearchStep = globalState.womenOnlyPreference
        ? 'Filtering verified female commuters heading along your corridor...'
        : 'Evaluating candidate commuters heading towards College Rd / Gangapur Rd...';
      notify();
    }, 700);

    // Step 2: Detour and Shapley evaluation
    setTimeout(() => {
      if (!globalState.isSearchingPartners) return;
      globalState.matchingSearchStep = 'Verifying ≤ 15.0% detour bound & calculating Shapley cost splits...';
      notify();
    }, 1400);

    // Step 3: By default in demo, completes match after 2.4s unless user tests 5-min timeout!
    if (searchTimerTimeout) clearTimeout(searchTimerTimeout);
    searchTimerTimeout = setTimeout(() => {
      if (globalState.isSearchingPartners && !globalState.matchingTimedOut) {
        createMatchedGroupProposal();
      }
    }, 2400);
  };

  /**
   * Action: Simulate 5-Minute Timer Timeout (No Match)
   */
  const triggerMatchingTimeout = () => {
    if (searchTimerTimeout) clearTimeout(searchTimerTimeout);
    globalState.isSearchingPartners = false;
    globalState.matchingTimedOut = true;
    globalState.matchingSecondsLeft = 0;
    if (globalState.activeRequest) {
      globalState.activeRequest.status = 'CANCELLED';
    }
    globalState.simulatedNotification = '⏱️ 5-minute matching window expired. No compatible partners within 1 km anchor radius.';
    notify();
  };

  /**
   * Action: Simulate Instant Match
   */
  const simulateInstantMatch = () => {
    if (searchTimerTimeout) clearTimeout(searchTimerTimeout);
    createMatchedGroupProposal();
  };

  /**
   * Action: Retry Matching Search
   */
  const retryMatchingSearch = () => {
    globalState.matchingTimedOut = false;
    bookRide();
  };

  /**
   * Action: Fallback to Solo Auto (Direct booking without detour/sharing)
   */
  const bookSoloDirect = () => {
    if (searchTimerTimeout) clearTimeout(searchTimerTimeout);
    globalState.matchingTimedOut = false;
    globalState.isSearchingPartners = false;
    const baseCost = Math.round(globalState.selectedVehicle.soloPrice * globalState.demandMultiplier);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const groupId = `NSK-SOLO-${otp}`;

    const trip: Trip = {
      id: `trip-solo-${Date.now()}`,
      proposalId: `prop-solo-${Date.now()}`,
      groupId,
      groupOtp: otp,
      driverId: globalState.driverUser.id,
      driverName: globalState.driverUser.name,
      driverPhone: globalState.driverUser.phone,
      driverRating: globalState.driverUser.rating,
      vehicleModel: globalState.driverUser.vehicleModel,
      plateNumber: globalState.driverUser.plateNumber,
      vehicleColor: globalState.driverUser.vehicleColor,
      state: 'DRIVER_ASSIGNED',
      pinCode: otp,
      meetingPoint: globalState.pickupLocation,
      stops: [
        {
          id: `stop-solo-drop-${Date.now()}`,
          type: 'DROPOFF',
          requestId: `req-solo-${Date.now()}`,
          passengerName: globalState.currentUser.name,
          location: globalState.destinationLocation,
          sequenceOrder: 1,
          etaMin: 14,
          completed: false,
        },
      ],
      currentStopIndex: 0,
      allocations: {
        [globalState.currentUser.id]: {
          requestId: `req-solo-${Date.now()}`,
          passengerName: globalState.currentUser.name,
          passengerGender: globalState.currentUser.gender,
          soloFare: baseCost,
          pooledFare: baseCost,
          savingsAmount: 0,
          savingsPercent: 0,
          soloTimeMin: 14,
          pooledTimeMin: 14,
          detourMin: 0,
          detourPercent: 0,
          shapleyValue: baseCost,
          explanation: 'Direct Solo Auto booking without detour or cost split.',
        },
      },
      totalCost: baseCost,
      driverLocation: { lat: 19.9985, lng: 73.7885 },
      etaToNextStopMin: 3,
      startedAt: Date.now(),
    };

    globalState.activeTrip = trip;
    globalState.simulatedNotification = `🛺 Direct Solo Auto Booked! Driver ${trip.driverName} is arriving. PIN: ${otp}`;
    notify();
  };

  /**
   * Action: Passenger marks ready at stand
   */
  const markPassengerReady = (passengerId: string) => {
    if (!globalState.activeProposal) return;
    const readyStates = {
      ...(globalState.activeProposal.groupReadyStates || {}),
      [passengerId]: true,
      [globalState.currentUser.id]: true,
    };
    if (globalState.activeProposal.requestIds?.[0]) {
      readyStates[globalState.activeProposal.requestIds[0]] = true;
    }
    globalState.activeProposal.groupReadyStates = readyStates;

    // Check if all group members are ready
    const isReady = Object.values(readyStates).length >= 2 && Object.values(readyStates).every(Boolean);

    if (isReady) {
      globalState.simulatedNotification = `✅ All 3 passengers ready at ${globalState.activeProposal.meetingPoint.name}! Auto auto-booked.`;
      acceptProposal();
    } else {
      notify();
    }
  };

  let driverAutoAcceptTimeout: any = null;

  /**
   * Action: Accept Proposal & Send Assignment to Driver
   */
  const acceptProposal = () => {
    if (!globalState.activeProposal) return;

    // Use proposal's generated groupOtp as the boarding PIN
    const otp = globalState.activeProposal.groupOtp || Math.floor(1000 + Math.random() * 9000).toString();
    const groupId = globalState.activeProposal.groupId || `NSK-AUTO-${otp}`;

    const trip: Trip = {
      id: `trip-nashik-${Date.now()}`,
      proposalId: globalState.activeProposal.id,
      groupId,
      groupOtp: otp,
      driverId: globalState.driverUser.id,
      driverName: globalState.driverUser.name,
      driverPhone: globalState.driverUser.phone,
      driverRating: globalState.driverUser.rating,
      vehicleModel: globalState.driverUser.vehicleModel,
      plateNumber: globalState.driverUser.plateNumber,
      vehicleColor: globalState.driverUser.vehicleColor,
      state: 'DRIVER_PENDING',
      pinCode: otp,
      meetingPoint: globalState.activeProposal.meetingPoint,
      stops: globalState.activeProposal.orderedStops,
      currentStopIndex: 0,
      allocations: globalState.activeProposal.allocations,
      totalCost: globalState.activeProposal.totalPooledCost,
      driverLocation: { lat: 19.9985, lng: 73.7885 }, // Near CBS
      etaToNextStopMin: 3,
      startedAt: Date.now(),
    };

    globalState.activeTrip = trip;
    globalState.incomingAssignment = globalState.activeProposal;
    globalState.pendingDriverRide = globalState.activeProposal;
    globalState.showDriverRidePopup = true; // Alerts driver app with incoming ride popup!

    globalState.simulatedNotification = `🛺 Auto Booked! Group ID: ${groupId} (Ride OTP: ${otp}). Assignment dispatched to Auto Kaka ${trip.driverName}!`;
    notify();

    // Auto-accept fallback after 4.5s for seamless single-view testing
    if (driverAutoAcceptTimeout) clearTimeout(driverAutoAcceptTimeout);
    driverAutoAcceptTimeout = setTimeout(() => {
      if (globalState.activeTrip && globalState.activeTrip.state === 'DRIVER_PENDING') {
        globalState.showDriverRidePopup = false;
        globalState.activeTrip.state = 'EN_ROUTE_TO_MEETUP';
        globalState.simulatedNotification = `🛺 Auto Kaka ${globalState.activeTrip.driverName} confirmed ride! Heading to ${globalState.activeTrip.meetingPoint.name}.`;
        notify();
      }
    }, 4500);
  };

  /**
   * Driver Action: Driver accepts incoming ride popup
   */
  const driverAcceptRide = () => {
    if (driverAutoAcceptTimeout) clearTimeout(driverAutoAcceptTimeout);
    globalState.showDriverRidePopup = false;
    if (!globalState.activeTrip && globalState.pendingDriverRide) {
      const p = globalState.pendingDriverRide;
      globalState.activeTrip = {
        id: `trip-nashik-${Date.now()}`,
        proposalId: p.id,
        groupId: p.groupId,
        groupOtp: p.groupOtp,
        driverId: globalState.driverUser.id,
        driverName: globalState.driverUser.name,
        driverPhone: globalState.driverUser.phone,
        driverRating: globalState.driverUser.rating,
        vehicleModel: globalState.driverUser.vehicleModel,
        plateNumber: globalState.driverUser.plateNumber,
        vehicleColor: globalState.driverUser.vehicleColor,
        state: 'EN_ROUTE_TO_MEETUP',
        pinCode: p.groupOtp,
        meetingPoint: p.meetingPoint,
        stops: p.orderedStops,
        currentStopIndex: 0,
        allocations: p.allocations,
        totalCost: p.totalPooledCost,
        driverLocation: { lat: 19.9985, lng: 73.7885 },
        etaToNextStopMin: 3,
        startedAt: Date.now(),
      };
    } else if (globalState.activeTrip) {
      globalState.activeTrip.state = 'EN_ROUTE_TO_MEETUP';
    }
    if (globalState.activeTrip) {
      globalState.simulatedNotification = `🛺 Ride Accepted! Proceed to ${globalState.activeTrip.meetingPoint.name} to pick up 3 passengers.`;
    }
    notify();
  };

  /**
   * Driver Action: Driver declines incoming ride popup
   */
  const driverDeclineRide = () => {
    if (driverAutoAcceptTimeout) clearTimeout(driverAutoAcceptTimeout);
    globalState.showDriverRidePopup = false;
    globalState.pendingDriverRide = null;

    if (globalState.activeTrip) {
      globalState.activeTrip.state = 'DRIVER_PENDING';
      globalState.simulatedNotification = `Auto driver passed. Auto searching next available Nashik driver...`;
      notify();

      setTimeout(() => {
        if (globalState.activeTrip && globalState.activeTrip.state === 'DRIVER_PENDING') {
          const nextDriver = SEEDED_DRIVERS[1] || {
            id: 'driver-sunil',
            name: 'Sunil Jadhav (Kaka)',
            phone: '+91 98223 99881',
            plateNumber: 'MH-15 AK 9876',
            vehicleModel: 'Bajaj RE Maxima (Share Auto)',
            rating: 4.85,
            vehicleColor: 'Yellow-Black',
          };
          globalState.activeTrip.driverId = nextDriver.id;
          globalState.activeTrip.driverName = nextDriver.name;
          globalState.activeTrip.driverPhone = nextDriver.phone;
          globalState.activeTrip.driverRating = nextDriver.rating;
          globalState.activeTrip.vehicleModel = nextDriver.vehicleModel;
          globalState.activeTrip.plateNumber = nextDriver.plateNumber;
          globalState.activeTrip.state = 'EN_ROUTE_TO_MEETUP';
          globalState.simulatedNotification = `🛺 Reassigned to nearby Auto: ${nextDriver.name} (${nextDriver.plateNumber})! Heading to stand.`;
          notify();
        }
      }, 1500);
    } else {
      globalState.simulatedNotification = `Auto driver passed on ride. Online & ready for new assignments.`;
      notify();
    }
  };

  /**
   * Action: Simulate incoming ride on Driver Dashboard
   */
  const simulateDriverIncomingRide = (variant: 'standard' | 'cbs_college' | 'rush_hour' = 'cbs_college') => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const groupId = `NSK-AUTO-${otp}`;

    const pickupStand: LocationPoint = {
      id: 'stand-cbs',
      name: 'CBS (Central Bus Stand) Auto Stand',
      address: 'CBS Chowk, Old Nashik, Nashik 422001',
      lat: 19.9975,
      lng: 73.7898,
    };

    const stop1Loc: LocationPoint = {
      id: 'stop-dongre',
      name: 'Dongre Vasti / Mumbai Naka',
      address: 'Mumbai Naka Highway Chowk, Nashik 422009',
      lat: 19.9880,
      lng: 73.7820,
    };

    const stop2Loc: LocationPoint = {
      id: 'stop-college',
      name: 'College Road (BYK Chowk)',
      address: 'Near Big Bazaar, College Road, Nashik 422005',
      lat: 20.0065,
      lng: 73.7650,
    };

    const stop3Loc: LocationPoint = {
      id: 'stop-gangapur',
      name: 'Gangapur Road (Jehan Circle)',
      address: 'Jehan Circle, Gangapur Road, Nashik 422013',
      lat: 20.0150,
      lng: 73.7680,
    };

    const orderedStops: RouteStop[] = [
      {
        id: `stop-1-${Date.now()}`,
        type: 'DROPOFF',
        requestId: 'req-sim-1',
        passengerName: 'Rahul Deshmukh',
        location: stop1Loc,
        sequenceOrder: 1,
        etaMin: 5,
        completed: false,
      },
      {
        id: `stop-2-${Date.now()}`,
        type: 'DROPOFF',
        requestId: 'req-sim-2',
        passengerName: 'Pooja Sharma',
        location: stop2Loc,
        sequenceOrder: 2,
        etaMin: 11,
        completed: false,
      },
      {
        id: `stop-3-${Date.now()}`,
        type: 'DROPOFF',
        requestId: 'req-sim-3',
        passengerName: 'Amit Patil',
        location: stop3Loc,
        sequenceOrder: 3,
        etaMin: 16,
        completed: false,
      },
    ];

    const allocations: Record<string, PassengerAllocation> = {
      'user-rahul': {
        requestId: 'req-sim-1',
        passengerName: 'Rahul Deshmukh',
        passengerGender: 'male',
        soloFare: 45.0,
        pooledFare: 18.0,
        savingsAmount: 27.0,
        savingsPercent: 60,
        soloTimeMin: 12,
        pooledTimeMin: 14,
        detourMin: 2,
        detourPercent: 3.5,
        shapleyValue: 18.0,
        explanation: 'Dropped at Stop B (Mumbai Naka). Split fare ₹18 vs Solo ₹45.',
      },
      'user-pooja': {
        requestId: 'req-sim-2',
        passengerName: 'Pooja Sharma',
        passengerGender: 'female',
        soloFare: 60.0,
        pooledFare: 24.0,
        savingsAmount: 36.0,
        savingsPercent: 60,
        soloTimeMin: 18,
        pooledTimeMin: 20,
        detourMin: 2,
        detourPercent: 4.8,
        shapleyValue: 24.0,
        explanation: 'Dropped at Stop C (College Road). Split fare ₹24 vs Solo ₹60.',
      },
      'user-amit': {
        requestId: 'req-sim-3',
        passengerName: 'Amit Patil',
        passengerGender: 'male',
        soloFare: 65.0,
        pooledFare: 26.0,
        savingsAmount: 39.0,
        savingsPercent: 60,
        soloTimeMin: 22,
        pooledTimeMin: 24,
        detourMin: 2,
        detourPercent: 5.2,
        shapleyValue: 26.0,
        explanation: 'Dropped at Stop D (Gangapur Road). Split fare ₹26 vs Solo ₹65.',
      },
    };

    const simulatedProposal: MatchProposal = {
      id: `prop-sim-${Date.now()}`,
      groupId,
      groupOtp: otp,
      groupReadyStates: {
        'user-rahul': true,
        'user-pooja': true,
        'user-amit': true,
      },
      requestIds: ['req-sim-1', 'req-sim-2', 'req-sim-3'],
      vehicleId: 'veh-share-auto',
      meetingPoint: pickupStand,
      walkingDistanceMeters: 140,
      walkingTimeMin: 2,
      orderedStops,
      totalPooledDistanceKm: 6.8,
      totalPooledDurationMin: 16,
      totalPooledCost: 68.0,
      allocations,
      maxDetourPercent: 5.2,
      detourCompliant: true,
      status: 'PROPOSAL_PENDING',
      expiresAt: Date.now() + 180000,
    };

    globalState.pendingDriverRide = simulatedProposal;
    globalState.showDriverRidePopup = true;
    globalState.simulatedNotification = `🚨 New 3-Passenger Auto Pool Ride Request! Group ID: ${groupId} (OTP: ${otp})`;
    notify();
  };

  /**
   * Action: Reset Driver Trip (Ready for Next Ride)
   */
  const resetDriverRide = () => {
    globalState.activeTrip = null;
    globalState.pendingDriverRide = null;
    globalState.showDriverRidePopup = false;
    globalState.simulatedNotification = `🛺 Auto is Online and patrolling for next Nashik ride request.`;
    notify();
  };

  /**
   * Driver Action: Drop passenger 1 by 1 at their stop
   */
  const dropPassengerAtStop = (stopIdx: number) => {
    if (!globalState.activeTrip) return;
    const trip = globalState.activeTrip;
    if (trip.stops[stopIdx]) {
      trip.stops[stopIdx].completed = true;
      const passengerName = trip.stops[stopIdx].passengerName;
      const passengerAlloc = Object.values(trip.allocations).find(
        (a) => a.passengerName === passengerName
      );
      const fareCollected = passengerAlloc ? passengerAlloc.pooledFare : 24;

      globalState.simulatedNotification = `📍 Passenger ${passengerName} dropped off at ${trip.stops[stopIdx].location.name}! Collected ₹${fareCollected.toFixed(2)}.`;

      // Find next uncompleted stop
      const nextUncompleted = trip.stops.findIndex((s) => !s.completed);
      if (nextUncompleted !== -1) {
        trip.currentStopIndex = nextUncompleted;
        trip.etaToNextStopMin = 3;
      } else {
        // All stops completed! Settle ride
        trip.state = 'COMPLETED';
        trip.completedAt = Date.now();

        const gross = trip.totalCost;
        const commissionPercent = globalState.systemConfig.platformCommissionPercent;
        const commissionAmount = Number(((gross * commissionPercent) / 100).toFixed(2));
        const netPayout = Number((gross - commissionAmount).toFixed(2));

        const entry: FareLedgerEntry = {
          id: `led-${Date.now()}`,
          tripId: trip.id,
          driverId: trip.driverId,
          grossPooledFare: gross,
          platformCommissionPercent: commissionPercent,
          platformCommissionAmount: commissionAmount,
          driverNetPayout: netPayout,
          passengersCount: Object.keys(trip.allocations).length,
          timestamp: Date.now(),
          status: 'SETTLED',
        };

        globalState.ledgerEntries = [entry, ...globalState.ledgerEntries];
        globalState.simulatedNotification = `🏁 All 3 passengers dropped off! Net ₹${netPayout.toFixed(2)} added to driver ledger.`;
      }
      notify();
    }
  };

  /**
   * Action: Reject proposal (returns to solo/retry)
   */
  const rejectProposal = () => {
    globalState.activeProposal = null;
    if (globalState.activeRequest) {
      globalState.activeRequest.status = 'CANCELLED';
    }
    notify();
  };

  /**
   * Driver Action: Driver arrived at meetup point
   */
  const driverArrivedAtMeetup = () => {
    if (!globalState.activeTrip) return;
    globalState.activeTrip.state = 'AT_MEETUP';
    globalState.simulatedNotification = `🛺 Auto Rickshaw ${globalState.activeTrip.plateNumber} has arrived at the designated Auto Stand!`;
    notify();
  };

  /**
   * Driver Action: Verify 4-digit PIN to start trip
   */
  const verifyTripPin = (inputPin: string): boolean => {
    if (!globalState.activeTrip) return false;
    if (inputPin.trim() === globalState.activeTrip.pinCode) {
      globalState.activeTrip.state = 'IN_PROGRESS';
      globalState.simulatedNotification = `✅ Boarding PIN Verified! Auto trip to College Road started.`;
      notify();
      return true;
    }
    return false;
  };

  /**
   * Complete next stop or complete trip
   */
  const advanceStopOrCompleteTrip = () => {
    if (!globalState.activeTrip) return;

    const trip = globalState.activeTrip;
    const nextIdx = trip.currentStopIndex + 1;

    if (nextIdx < trip.stops.length) {
      trip.stops[trip.currentStopIndex].completed = true;
      trip.currentStopIndex = nextIdx;
      trip.etaToNextStopMin = 4;
    } else {
      // Complete entire trip
      trip.stops.forEach((s) => (s.completed = true));
      trip.state = 'COMPLETED';
      trip.completedAt = Date.now();

      // Create ledger entry
      const gross = trip.totalCost;
      const commissionPercent = globalState.systemConfig.platformCommissionPercent;
      const commissionAmount = Number(((gross * commissionPercent) / 100).toFixed(2));
      const netPayout = Number((gross - commissionAmount).toFixed(2));

      const entry: FareLedgerEntry = {
        id: `led-${Date.now()}`,
        tripId: trip.id,
        driverId: trip.driverId,
        grossPooledFare: gross,
        platformCommissionPercent: commissionPercent,
        platformCommissionAmount: commissionAmount,
        driverNetPayout: netPayout,
        passengersCount: Object.keys(trip.allocations).length,
        timestamp: Date.now(),
        status: 'SETTLED',
      };

      globalState.ledgerEntries = [entry, ...globalState.ledgerEntries];
      globalState.simulatedNotification = `🏁 Trip Completed! Net Payout ₹${netPayout.toFixed(2)} credited to Auto Driver's balance.`;
    }
    notify();
  };

  /**
   * Trigger SOS emergency incident
   */
  const triggerSOS = (description: string = 'Passenger triggered instant SOS in Nashik Auto') => {
    if (!globalState.activeTrip) return;
    const incident: SafetyIncident = {
      id: `sos-${Date.now()}`,
      tripId: globalState.activeTrip.id,
      reporterId: globalState.currentUser.id,
      reporterName: globalState.currentUser.name,
      type: 'SOS',
      description,
      latitude: globalState.activeTrip.driverLocation.lat,
      longitude: globalState.activeTrip.driverLocation.lng,
      timestamp: Date.now(),
      status: 'ACTIVE',
      simulatedNotificationSent: true,
    };

    globalState.safetyIncidents = [incident, ...globalState.safetyIncidents];
    globalState.simulatedNotification = `🚨 EMERGENCY ALERT: Nashik Police Control Room & Trusted Contacts alerted for Auto ${globalState.activeTrip.plateNumber} near ${globalState.activeTrip.meetingPoint.name}.`;
    notify();

    setTimeout(() => {
      globalState.simulatedNotification = null;
      notify();
    }, 7000);
  };

  /**
   * Cancel active ride
   */
  const cancelActiveRide = (reason: string = 'Passenger requested cancellation') => {
    if (globalState.activeTrip) {
      globalState.activeTrip.state = 'CANCELLED';
    }
    if (globalState.activeRequest) {
      globalState.activeRequest.status = 'CANCELLED';
    }
    globalState.activeProposal = null;

    const log: AuditLogEvent = {
      id: `aud-${Date.now()}`,
      timestamp: Date.now(),
      actor: globalState.currentUser.name,
      action: 'RIDE_CANCELLED',
      category: 'DISPATCH',
      details: reason,
    };
    globalState.auditLogs = [log, ...globalState.auditLogs];
    notify();
  };

  /**
   * Rate driver and close completed trip
   */
  const rateAndCloseTrip = (rating: number) => {
    if (globalState.activeTrip) {
      const trip = globalState.activeTrip;
      const historyItem: PastRideHistoryItem = {
        id: `past-${Date.now()}`,
        date: 'Just now',
        originName: trip.meetingPoint.name,
        destName: trip.stops[trip.stops.length - 1]?.location.name || 'Nashik Road Station',
        vehicleName: trip.vehicleModel,
        soloFare: globalState.selectedVehicle.soloPrice,
        actualPaidFare: trip.allocations[globalState.currentUser.id]?.pooledFare || trip.totalCost / 2,
        savings: (globalState.selectedVehicle.soloPrice - (trip.allocations[globalState.currentUser.id]?.pooledFare || trip.totalCost / 2)),
        detourPercent: trip.allocations[globalState.currentUser.id]?.detourPercent || 7.8,
        isPooled: true,
        coPassengers: Object.values(trip.allocations).filter(a => a.requestId !== globalState.currentUser.id).map(a => a.passengerName),
        driverName: trip.driverName,
        ratingGiven: rating,
      };

      globalState.pastRides = [historyItem, ...globalState.pastRides];
      globalState.activeTrip = null;
      globalState.activeProposal = null;
      globalState.activeRequest = null;
    }
    notify();
  };

  /**
   * Update system configuration
   */
  const updateSystemConfig = (newConfig: Partial<SystemConfig>) => {
    globalState.systemConfig = {
      ...globalState.systemConfig,
      ...newConfig,
    };
    const log: AuditLogEvent = {
      id: `aud-${Date.now()}`,
      timestamp: Date.now(),
      actor: 'ADMIN_OPERATOR',
      action: 'SYSTEM_CONFIG_UPDATED',
      category: 'ROUTING',
      details: `Updated config: ${JSON.stringify(newConfig)}`,
    };
    globalState.auditLogs = [log, ...globalState.auditLogs];
    notify();
  };

  /**
   * Switch logged-in user profile
   */
  const switchUser = (user: UserProfile) => {
    globalState.currentUser = user;
    notify();
  };

  /**
   * Add trusted contact
   */
  const addTrustedContact = (name: string, phone: string, relationship: string) => {
    const newContact: TrustedContact = {
      id: `tc-${Date.now()}`,
      name,
      phone,
      relationship,
    };
    globalState.trustedContacts = [...globalState.trustedContacts, newContact];
    notify();
  };

  /**
   * Remove trusted contact
   */
  const removeTrustedContact = (id: string) => {
    globalState.trustedContacts = globalState.trustedContacts.filter((c) => c.id !== id);
    notify();
  };

  /**
   * Reset to initial state for demo retry
   */
  const resetDemoState = () => {
    globalState = {
      ...INITIAL_STATE,
      currentRole: globalState.currentRole,
      viewportMode: globalState.viewportMode,
    };
    notify();
  };

  return {
    state,
    setLanguage,
    setRole,
    setViewportMode,
    setPickup,
    setDestination,
    setSelectedVehicle,
    setWomenOnly,
    setPaymentMethod,
    setDriverOnline,
    bookRide,
    markPassengerReady,
    acceptProposal,
    rejectProposal,
    driverAcceptRide,
    driverDeclineRide,
    driverArrivedAtMeetup,
    verifyTripPin,
    advanceStopOrCompleteTrip,
    dropPassengerAtStop,
    triggerSOS,
    cancelActiveRide,
    rateAndCloseTrip,
    updateSystemConfig,
    switchUser,
    addTrustedContact,
    removeTrustedContact,
    loginCustomer,
    logoutCustomer,
    loginDriver,
    logoutDriver,
    quickDemoLoginBoth,
    loginAdmin,
    logoutAdmin,
    setDemandTier,
    triggerMatchingTimeout,
    simulateInstantMatch,
    retryMatchingSearch,
    bookSoloDirect,
    simulateDriverIncomingRide,
    resetDriverRide,
    resetDemoState,
  };
}
