# docs/API_CONTRACTS.md — Data Contracts & Service Interfaces

## 1. Ride Request Schema
```typescript
interface RideRequest {
  id: string;
  passengerId: string;
  passengerName: string;
  passengerGender: 'female' | 'male' | 'other';
  origin: LocationPoint;
  destination: LocationPoint;
  soloBaselineDistanceKm: number;
  soloBaselineDurationMin: number;
  soloBaselineCost: number;
  passengerCount: number;
  womenOnlyPreference: boolean;
  maxWaitTimeMin: number;
  requestedAt: string;
  status: 'PENDING' | 'BATCHED' | 'MATCHED' | 'CONFIRMED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}
```

## 2. Match Proposal Schema
```typescript
interface MatchProposal {
  id: string;
  requestIds: string[];
  vehicleId: string;
  driverId: string;
  meetingPoint: LocationPoint;
  walkingDistanceMeters: number;
  walkingTimeMin: number;
  orderedStops: RouteStop[];
  totalPooledDistanceKm: number;
  totalPooledDurationMin: number;
  totalPooledCost: number;
  passengerAllocations: Record<string, {
    soloFare: number;
    pooledFare: number;
    savingsAmount: number;
    savingsPercent: number;
    detourMin: number;
    detourPercent: number; // Guaranteed <= 15.0%
    shapleyValue: number;
  }>;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  expiresAt: string;
}
```

## 3. Trip & State Transitions
```typescript
type TripState =
  | 'REQUESTED'
  | 'MATCHING'
  | 'PROPOSAL_PENDING'
  | 'CONFIRMED'
  | 'DRIVER_ASSIGNED'
  | 'EN_ROUTE_TO_MEETUP'
  | 'AT_MEETUP'
  | 'PIN_VERIFIED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';
```
