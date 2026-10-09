import {
  LocationPoint,
  MatchProposal,
  PassengerAllocation,
  RideRequest,
  RouteStop,
} from '../types';
import {
  calculateHaversineDistanceKm,
  calculateUrbanRoadDistanceKm,
  calculateUrbanTravelTimeMin,
  validatePassengerDetour,
  verifyPickupBeforeDropoffPrecedence,
} from './routing';
import { computeShapleyAllocations } from './shapley';

export interface CompatibilityCheck {
  compatible: boolean;
  reason?: string;
}

/**
 * Calculates heading cosine similarity between two request trajectories
 */
export function calculateTrajectorySimilarity(
  req1: RideRequest,
  req2: RideRequest
): number {
  const v1Lat = req1.destination.lat - req1.origin.lat;
  const v1Lng = req1.destination.lng - req1.origin.lng;
  const v2Lat = req2.destination.lat - req2.origin.lat;
  const v2Lng = req2.destination.lng - req2.origin.lng;

  const dot = v1Lat * v2Lat + v1Lng * v2Lng;
  const mag1 = Math.sqrt(v1Lat * v1Lat + v1Lng * v1Lng);
  const mag2 = Math.sqrt(v2Lat * v2Lat + v2Lng * v2Lng);

  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (mag1 * mag2);
}

/**
 * Checks compatibility between candidate requests
 */
export function checkPassengerCompatibility(
  requests: RideRequest[],
  maxCapacity: number = 4
): CompatibilityCheck {
  if (requests.length === 0) {
    return { compatible: false, reason: 'Empty candidate list' };
  }

  // 1. Capacity check
  const totalPassengers = requests.reduce((sum, r) => sum + r.passengerCount, 0);
  if (totalPassengers > maxCapacity) {
    return {
      compatible: false,
      reason: `Group exceeds vehicle capacity (${totalPassengers} > ${maxCapacity})`,
    };
  }

  // 2. Women-only filter rule
  const anyWantsWomenOnly = requests.some((r) => r.womenOnlyPreference);
  if (anyWantsWomenOnly) {
    const hasIneligibleGender = requests.some(
      (r) => r.passengerGender !== 'female'
    );
    if (hasIneligibleGender) {
      return {
        compatible: false,
        reason: 'Women-only preference violation: all group members must identify as female',
      };
    }
  }

  // 3. Directional compatibility
  if (requests.length > 1) {
    for (let i = 0; i < requests.length; i++) {
      for (let j = i + 1; j < requests.length; j++) {
        const similarity = calculateTrajectorySimilarity(requests[i], requests[j]);
        if (similarity < 0.35) {
          return {
            compatible: false,
            reason: `Opposing or divergent travel directions (vector similarity: ${similarity.toFixed(2)})`,
          };
        }
      }
    }
  }

  // 4. Pickup spatial proximity (< 2.2 km)
  if (requests.length > 1) {
    for (let i = 0; i < requests.length; i++) {
      for (let j = i + 1; j < requests.length; j++) {
        const distKm = calculateHaversineDistanceKm(
          requests[i].origin.lat,
          requests[i].origin.lng,
          requests[j].origin.lat,
          requests[j].origin.lng
        );
        if (distKm > 2.5) {
          return {
            compatible: false,
            reason: `Pickups too dispersed (${distKm.toFixed(1)} km apart, max 2.5 km)`,
          };
        }
      }
    }
  }

  return { compatible: true };
}

/**
 * Computes an optimal meeting point for candidate passengers
 */
export function computeOptimalMeetingPoint(requests: RideRequest[]): {
  meetingPoint: LocationPoint;
  walkingMeters: number;
  walkingTimeMin: number;
} {
  if (requests.length === 1) {
    return {
      meetingPoint: requests[0].origin,
      walkingMeters: 0,
      walkingTimeMin: 0,
    };
  }

  // Calculate geometric centroid
  const avgLat =
    requests.reduce((sum, r) => sum + r.origin.lat, 0) / requests.length;
  const avgLng =
    requests.reduce((sum, r) => sum + r.origin.lng, 0) / requests.length;

  const nearestOrigin = requests[0].origin;
  const standName = nearestOrigin.name.includes('Stand') || nearestOrigin.name.includes('Chowk')
    ? `${nearestOrigin.name} Stand`
    : `${nearestOrigin.name} Auto Stand`;

  const meetingPoint: LocationPoint = {
    id: `meet-${Date.now()}`,
    name: standName,
    address: nearestOrigin.address,
    lat: Number(avgLat.toFixed(5)),
    lng: Number(avgLng.toFixed(5)),
  };

  // Compute walking distance for the passenger farthest from centroid
  let maxWalkKm = 0;
  requests.forEach((r) => {
    const d = calculateHaversineDistanceKm(
      r.origin.lat,
      r.origin.lng,
      meetingPoint.lat,
      meetingPoint.lng
    );
    if (d > maxWalkKm) maxWalkKm = d;
  });

  const walkingMeters = Math.min(200, Math.max(30, Math.round(maxWalkKm * 1000)));
  const walkingTimeMin = Math.max(1, Math.round(walkingMeters / 75)); // 4.5 km/h walk speed

  return { meetingPoint, walkingMeters, walkingTimeMin };
}

/**
 * Creates and evaluates a MatchProposal for candidate requests
 */
export function generateMatchProposal(
  requests: RideRequest[],
  vehicleTier: string = 'car-4'
): MatchProposal | { error: string } {
  // Check compatibility
  const compat = checkPassengerCompatibility(requests);
  if (!compat.compatible) {
    return { error: compat.reason || 'Candidate requests are incompatible' };
  }

  const { meetingPoint, walkingMeters, walkingTimeMin } =
    computeOptimalMeetingPoint(requests);

  // Build VRPTW stops with precedence:
  // Pickup at meeting point -> Dropoffs ordered by proximity
  const orderedStops: RouteStop[] = [];
  let seq = 1;

  // Single consolidated pickup at meetup point
  requests.forEach((req) => {
    orderedStops.push({
      id: `stop-pick-${req.id}`,
      type: 'PICKUP',
      requestId: req.id,
      passengerName: req.passengerName,
      location: meetingPoint,
      sequenceOrder: seq++,
      etaMin: walkingTimeMin + 2,
      completed: false,
    });
  });

  // Sort dropoffs by distance from meeting point (nearest dropoff first)
  const sortedDropoffs = [...requests].sort((a, b) => {
    const distA = calculateUrbanRoadDistanceKm(meetingPoint, a.destination);
    const distB = calculateUrbanRoadDistanceKm(meetingPoint, b.destination);
    return distA - distB;
  });

  // Route starts from meeting point and sequentially visits sorted dropoffs
  let runningTravelTime = walkingTimeMin + 2; // initial boarding
  let prevLocation: LocationPoint = meetingPoint;

  sortedDropoffs.forEach((req, idx) => {
    // Travel time between consecutive stops
    const legDist = calculateUrbanRoadDistanceKm(prevLocation, req.destination);
    const legTime = calculateUrbanTravelTimeMin(legDist);
    // Add leg transit time and 1 minute dropoff pause for earlier stops
    runningTravelTime += (idx === 0 ? legTime : legTime + 1);
    prevLocation = req.destination;

    orderedStops.push({
      id: `stop-drop-${req.id}`,
      type: 'DROPOFF',
      requestId: req.id,
      passengerName: req.passengerName,
      location: req.destination,
      sequenceOrder: seq++,
      etaMin: Math.max(1, Math.round(runningTravelTime)),
      completed: false,
    });
  });

  // Validate pickup before dropoff precedence
  if (!verifyPickupBeforeDropoffPrecedence(orderedStops)) {
    return { error: 'Route stops violate pickup-before-dropoff precedence' };
  }

  // Calculate pooled travel times and detour percentages for each passenger
  const allocations: Record<string, PassengerAllocation> = {};
  let maxDetourPercent = 0;
  let detourCompliant = true;

  // Shapley allocation inputs
  const shapleyPlayers = requests.map((r) => ({
    id: r.id,
    name: r.passengerName,
    soloCost: r.soloBaselineCost,
  }));

  const shapleyResult = computeShapleyAllocations(shapleyPlayers);

  for (const req of requests) {
    const dropStop = orderedStops.find(
      (s) => s.requestId === req.id && s.type === 'DROPOFF'
    );
    const pooledTravelTime = dropStop
      ? dropStop.etaMin
      : req.soloBaselineDurationMin;

    const detourCheck = validatePassengerDetour(
      req.id,
      req.passengerName,
      req.soloBaselineDurationMin,
      pooledTravelTime
    );

    if (detourCheck.detourPercentage > maxDetourPercent) {
      maxDetourPercent = detourCheck.detourPercentage;
    }

    if (!detourCheck.isCompliant) {
      detourCompliant = false;
      return {
        error: `Route rejected: ${req.passengerName}'s detour (${detourCheck.detourPercentage}%) exceeds strict 15.0% bound!`,
      };
    }

    const sPlayer = shapleyResult.allocations[req.id];
    allocations[req.id] = {
      requestId: req.id,
      passengerName: req.passengerName,
      passengerGender: req.passengerGender,
      soloFare: req.soloBaselineCost,
      pooledFare: sPlayer.shapleyFare,
      savingsAmount: sPlayer.savingsAmount,
      savingsPercent: sPlayer.savingsPercent,
      soloTimeMin: req.soloBaselineDurationMin,
      pooledTimeMin: pooledTravelTime,
      detourMin: detourCheck.detourTimeMin,
      detourPercent: detourCheck.detourPercentage,
      shapleyValue: sPlayer.shapleyFare,
      explanation: `Allocated based on ${sPlayer.marginalContributions.length} game permutations: saved ₹${sPlayer.savingsAmount.toFixed(
        2
      )} (${sPlayer.savingsPercent}%) with +${detourCheck.detourPercentage}% detour.`,
    };
  }

  const totalPooledDistanceKm = Number(
    (
      requests.reduce((sum, r) => sum + r.soloBaselineDistanceKm, 0) * 0.72
    ).toFixed(2)
  );

  const otpDigits = Math.floor(1000 + Math.random() * 9000).toString();
  const groupId = `NSK-AUTO-${otpDigits}`;
  const initialReadyStates: Record<string, boolean> = {};
  requests.forEach((r, idx) => {
    // Co-passengers simulate ready when group forms, user can click ready
    initialReadyStates[r.passengerId] = idx !== 0;
    initialReadyStates[r.id] = idx !== 0;
  });

  return {
    id: `prop-${Date.now()}`,
    groupId,
    groupOtp: otpDigits,
    groupReadyStates: initialReadyStates,
    requestIds: requests.map((r) => r.id),
    vehicleId: vehicleTier,
    meetingPoint,
    walkingDistanceMeters: walkingMeters,
    walkingTimeMin,
    orderedStops,
    totalPooledDistanceKm,
    totalPooledDurationMin: Math.max(...orderedStops.map((s) => s.etaMin)),
    totalPooledCost: shapleyResult.totalPooledCost,
    allocations,
    maxDetourPercent,
    detourCompliant: true,
    status: 'PROPOSAL_PENDING',
    expiresAt: Date.now() + 180000, // 3 minutes expiration
  };
}
