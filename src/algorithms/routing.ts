import { LocationPoint, RouteStop } from '../types';

export const MAX_ALLOWED_DETOUR_PERCENT = 15.0; // Hard business rule

/**
 * Great-circle distance between two GPS coordinates in kilometers
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Urban road network distance approximation (1.28 winding factor in dense city)
 */
export function calculateUrbanRoadDistanceKm(
  origin: LocationPoint,
  dest: LocationPoint
): number {
  const straightLine = calculateHaversineDistanceKm(
    origin.lat,
    origin.lng,
    dest.lat,
    dest.lng
  );
  // Apply urban road network coefficient
  return Math.max(0.6, Number((straightLine * 1.28).toFixed(2)));
}

/**
 * Travel time in minutes based on urban traffic speed (avg 24 km/h) + pickup buffers
 */
export function calculateUrbanTravelTimeMin(distanceKm: number): number {
  const avgSpeedKmH = 24.0;
  const transitTimeMin = (distanceKm / avgSpeedKmH) * 60;
  const trafficBuffer = 2.0; // 2 min traffic / signal buffer
  return Math.max(3.0, Number((transitTimeMin + trafficBuffer).toFixed(1)));
}

export interface DetourValidationResult {
  requestId: string;
  passengerName: string;
  soloBaselineTimeMin: number;
  pooledTravelTimeMin: number;
  detourTimeMin: number;
  detourPercentage: number;
  isCompliant: boolean;
  rejectionReason?: string;
}

/**
 * Validates the hard 15% detour constraint for an individual passenger
 * Formula: ((pooled_travel_time - solo_baseline_time) / solo_baseline_time) * 100
 */
export function validatePassengerDetour(
  requestId: string,
  passengerName: string,
  soloBaselineTimeMin: number,
  pooledTravelTimeMin: number
): DetourValidationResult {
  if (soloBaselineTimeMin <= 0) {
    throw new Error('Solo baseline time must be greater than zero');
  }

  const detourTimeMin = Math.max(0, pooledTravelTimeMin - soloBaselineTimeMin);
  const detourPercentage = Number(
    (((pooledTravelTimeMin - soloBaselineTimeMin) / soloBaselineTimeMin) * 100).toFixed(2)
  );

  const isCompliant = detourPercentage <= MAX_ALLOWED_DETOUR_PERCENT;

  return {
    requestId,
    passengerName,
    soloBaselineTimeMin,
    pooledTravelTimeMin,
    detourTimeMin: Number(detourTimeMin.toFixed(1)),
    detourPercentage,
    isCompliant,
    rejectionReason: isCompliant
      ? undefined
      : `Detour of ${detourPercentage}% exceeds the strict 15.0% maximum threshold (limit is +${(
          soloBaselineTimeMin * 0.15
        ).toFixed(1)} min)`,
  };
}

/**
 * Verifies pickup-before-dropoff precedence for VRPTW
 */
export function verifyPickupBeforeDropoffPrecedence(stops: RouteStop[]): boolean {
  const pickupIndices = new Map<string, number>();
  const dropoffIndices = new Map<string, number>();

  stops.forEach((stop, idx) => {
    if (stop.type === 'PICKUP') {
      pickupIndices.set(stop.requestId, idx);
    } else if (stop.type === 'DROPOFF') {
      dropoffIndices.set(stop.requestId, idx);
    }
  });

  for (const [reqId, dropIdx] of dropoffIndices.entries()) {
    const pickIdx = pickupIndices.get(reqId);
    if (pickIdx === undefined || pickIdx >= dropIdx) {
      return false; // Pickup MUST strictly precede dropoff
    }
  }

  return true;
}
