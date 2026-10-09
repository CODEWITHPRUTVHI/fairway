export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export type Gender = 'female' | 'male' | 'other';
export type UserRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  gender: Gender;
  rating: number;
  avatarUrl?: string;
}

export interface VehicleOption {
  id: string;
  name: string;
  seats: number;
  soloPrice: number;
  pooledEstimate: number;
  iconType: 'car4' | 'car7' | 'taxi4';
  description: string;
  discountTag?: string;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerGender: Gender;
  origin: LocationPoint;
  destination: LocationPoint;
  vehicleOptionId: string;
  soloBaselineDistanceKm: number;
  soloBaselineDurationMin: number;
  soloBaselineCost: number;
  passengerCount: number;
  womenOnlyPreference: boolean;
  maxWaitTimeMin: number;
  createdAt: number;
  status: 'PENDING' | 'BATCHED' | 'MATCHED' | 'CONFIRMED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}

export interface RouteStop {
  id: string;
  type: 'PICKUP' | 'DROPOFF';
  requestId: string;
  passengerName: string;
  location: LocationPoint;
  sequenceOrder: number;
  etaMin: number;
  completed: boolean;
}

export interface PassengerAllocation {
  requestId: string;
  passengerName: string;
  passengerGender: Gender;
  soloFare: number;
  pooledFare: number;
  savingsAmount: number;
  savingsPercent: number;
  soloTimeMin: number;
  pooledTimeMin: number;
  detourMin: number;
  detourPercent: number; // Strictly <= 15.0%
  shapleyValue: number;
  explanation: string;
}

export interface MatchProposal {
  id: string;
  groupId: string; // e.g. 'NSK-AUTO-4821'
  groupOtp: string; // 4-digit code e.g. '4821' acting as ride OTP
  groupReadyStates?: Record<string, boolean>; // Passenger readiness states
  requestIds: string[];
  vehicleId: string;
  meetingPoint: LocationPoint;
  walkingDistanceMeters: number;
  walkingTimeMin: number;
  orderedStops: RouteStop[];
  totalPooledDistanceKm: number;
  totalPooledDurationMin: number;
  totalPooledCost: number;
  allocations: Record<string, PassengerAllocation>;
  maxDetourPercent: number; // Must be <= 15.0%
  detourCompliant: boolean;
  status: 'PROPOSAL_PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  expiresAt: number;
}

export type TripState =
  | 'REQUESTED'
  | 'MATCHING'
  | 'PROPOSAL_PENDING'
  | 'CONFIRMED'
  | 'DRIVER_PENDING'
  | 'DRIVER_ASSIGNED'
  | 'EN_ROUTE_TO_MEETUP'
  | 'AT_MEETUP'
  | 'PIN_VERIFIED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Trip {
  id: string;
  proposalId: string;
  groupId: string; // e.g. 'NSK-AUTO-4821'
  groupOtp: string; // 4-digit code e.g. '4821'
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleModel: string;
  plateNumber: string;
  vehicleColor: string;
  state: TripState;
  pinCode: string; // 4-digit verification PIN (matches groupOtp)
  meetingPoint: LocationPoint;
  stops: RouteStop[];
  currentStopIndex: number;
  allocations: Record<string, PassengerAllocation>;
  totalCost: number;
  driverLocation: { lat: number; lng: number };
  etaToNextStopMin: number;
  startedAt?: number;
  completedAt?: number;
}

export interface FareLedgerEntry {
  id: string;
  tripId: string;
  driverId: string;
  grossPooledFare: number;
  platformCommissionPercent: number;
  platformCommissionAmount: number;
  driverNetPayout: number;
  passengersCount: number;
  timestamp: number;
  status: 'SETTLED' | 'PENDING';
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SafetyIncident {
  id: string;
  tripId: string;
  reporterId: string;
  reporterName: string;
  type: 'SOS' | 'ROUTE_DEVIATION' | 'UNEXPECTED_STOP' | 'HARASSMENT';
  description: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED';
  simulatedNotificationSent: boolean;
}

export interface VoucherPromotion {
  id: string;
  title: string;
  subtitle: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  expiryDate: string;
  code: string;
  vehicleTier: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: number;
  actor: string;
  action: string;
  category: 'DISPATCH' | 'SECURITY' | 'FINANCE' | 'ROUTING';
  details: string;
}

export interface SystemConfig {
  maxAllowedDetourPercent: number; // 15.0%
  maxWalkingRadiusMeters: number; // 250m
  maxWaitTimeWindowMin: number; // 8 min
  platformCommissionPercent: number; // 10%
  trafficCongestionFactor: number; // 1.28
  demandMultiplier: number; // 0.9, 1.0, 1.2, 1.4
  demandTier: 'LOW' | 'NORMAL' | 'HIGH' | 'VERY_HIGH';
}

export interface PastRideHistoryItem {
  id: string;
  date: string;
  originName: string;
  destName: string;
  vehicleName: string;
  soloFare: number;
  actualPaidFare: number;
  savings: number;
  detourPercent: number;
  isPooled: boolean;
  coPassengers: string[];
  driverName: string;
  ratingGiven: number;
}

