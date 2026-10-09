import { NASHIK_LOCATIONS } from '../data/mockData';
import { RideRequest } from '../types';
import { generateMatchProposal } from './matching';
import { calculateUrbanRoadDistanceKm, calculateUrbanTravelTimeMin } from './routing';

export interface BenchmarkMetrics {
  totalRequests: number;
  pooledRequests: number;
  soloRequests: number;
  unmatchedRequests: number;
  poolingRatePercent: number;
  totalFleetSoloKm: number;
  totalFleetPooledKm: number;
  kmSavedPercent: number;
  avgWaitTimeMin: number;
  detourCompliancePercent: number; // Target 100.0%
  avgDetourPercent: number;
  maxDetourPercent: number;
  dispatchLatencyMs: number;
  fareReconciliationDelta: number; // Must be 0.00
}

/**
 * Deterministic pseudo-random number generator for reproducible benchmarks
 */
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generates a reproducible dataset of 100 realistic requests
 */
export function generateBenchmarkRequests(count: number = 100): RideRequest[] {
  const rng = seededRandom(42);
  const requests: RideRequest[] = [];
  const femaleNames = ['Pooja', 'Snehal', 'Anjali', 'Kavita', 'Priyanka', 'Neha', 'Rupali', 'Shraddha', 'Tanvi', 'Sonali'];
  const maleNames = ['Rahul', 'Swapnil', 'Sachin', 'Amol', 'Kiran', 'Nitin', 'Prasad', 'Manoj', 'Rohit', 'Ganesh'];

  for (let i = 0; i < count; i++) {
    const isFemale = rng() > 0.45;
    const name = isFemale
      ? femaleNames[Math.floor(rng() * femaleNames.length)]
      : maleNames[Math.floor(rng() * maleNames.length)];

    const originIdx = Math.floor(rng() * NASHIK_LOCATIONS.length);
    let destIdx = Math.floor(rng() * NASHIK_LOCATIONS.length);
    if (destIdx === originIdx) {
      destIdx = (originIdx + 1) % NASHIK_LOCATIONS.length;
    }

    const origin = NASHIK_LOCATIONS[originIdx];
    const destination = NASHIK_LOCATIONS[destIdx];

    const distKm = calculateUrbanRoadDistanceKm(origin, destination);
    const durationMin = calculateUrbanTravelTimeMin(distKm);
    const cost = Number((20.0 + distKm * 12.0).toFixed(2)); // Auto fare baseline ₹

    requests.push({
      id: `bench-req-${i + 1}`,
      passengerId: `p-${i + 1}`,
      passengerName: `${name} (${i + 1})`,
      passengerGender: isFemale ? 'female' : 'male',
      origin,
      destination,
      vehicleOptionId: 'auto-share-3',
      soloBaselineDistanceKm: distKm,
      soloBaselineDurationMin: durationMin,
      soloBaselineCost: cost,
      passengerCount: 1,
      womenOnlyPreference: isFemale && rng() > 0.6,
      maxWaitTimeMin: 8,
      createdAt: Date.now() + i * 30000,
      status: 'PENDING',
    });
  }

  return requests;
}

/**
 * Executes full dispatch benchmark
 */
export function runBenchmarkSimulation(requestCount: number = 100): BenchmarkMetrics {
  const startTime = performance.now();
  const requests = generateBenchmarkRequests(requestCount);

  let pooledCount = 0;
  let soloCount = 0;
  let unmatchedCount = 0;
  let totalFleetSoloKm = 0;
  let totalFleetPooledKm = 0;
  let totalWaitTimeMin = 0;
  let totalDetourPercent = 0;
  let maxDetourPercent = 0;
  let nonCompliantDetourCount = 0;
  let totalFareDelta = 0;

  // Process requests through sliding-window batching
  const processed = new Set<string>();

  for (let i = 0; i < requests.length; i++) {
    const current = requests[i];
    if (processed.has(current.id)) continue;

    // Solo distance baseline
    totalFleetSoloKm += current.soloBaselineDistanceKm;

    // Search window for compatible partner
    let foundPartner: RideRequest | null = null;
    for (let j = i + 1; j < Math.min(requests.length, i + 8); j++) {
      const candidate = requests[j];
      if (processed.has(candidate.id)) continue;

      const proposal = generateMatchProposal([current, candidate]);
      if ('id' in proposal && proposal.detourCompliant) {
        foundPartner = candidate;
        
        // Record pooled metrics
        processed.add(current.id);
        processed.add(candidate.id);
        pooledCount += 2;

        totalFleetSoloKm += candidate.soloBaselineDistanceKm;
        totalFleetPooledKm += proposal.totalPooledDistanceKm;

        totalWaitTimeMin += proposal.walkingTimeMin * 2 + 3.5;

        // Check detour compliance
        Object.values(proposal.allocations).forEach((alloc) => {
          totalDetourPercent += alloc.detourPercent;
          if (alloc.detourPercent > maxDetourPercent) {
            maxDetourPercent = alloc.detourPercent;
          }
          if (alloc.detourPercent > 15.0) {
            nonCompliantDetourCount++;
          }
        });

        // Check Shapley balance
        const allocSum = Object.values(proposal.allocations).reduce(
          (acc, a) => acc + a.pooledFare,
          0
        );
        totalFareDelta += Math.abs(proposal.totalPooledCost - allocSum);

        break;
      }
    }

    if (!foundPartner) {
      processed.add(current.id);
      soloCount++;
      totalFleetPooledKm += current.soloBaselineDistanceKm;
      totalWaitTimeMin += 2.0;
    }
  }

  const endTime = performance.now();
  const latency = Number((endTime - startTime).toFixed(1));

  const totalEvaluated = pooledCount + soloCount;
  const poolingRate = totalEvaluated > 0 ? (pooledCount / totalEvaluated) * 100 : 0;
  const kmSaved =
    totalFleetSoloKm > 0
      ? ((totalFleetSoloKm - totalFleetPooledKm) / totalFleetSoloKm) * 100
      : 0;

  const avgDetour = pooledCount > 0 ? totalDetourPercent / pooledCount : 0;
  const detourCompliance =
    pooledCount > 0
      ? ((pooledCount - nonCompliantDetourCount) / pooledCount) * 100
      : 100.0;

  return {
    totalRequests: requestCount,
    pooledRequests: pooledCount,
    soloRequests: soloCount,
    unmatchedRequests: unmatchedCount,
    poolingRatePercent: Number(poolingRate.toFixed(1)),
    totalFleetSoloKm: Number(totalFleetSoloKm.toFixed(1)),
    totalFleetPooledKm: Number(totalFleetPooledKm.toFixed(1)),
    kmSavedPercent: Number(kmSaved.toFixed(1)),
    avgWaitTimeMin: Number((totalWaitTimeMin / totalEvaluated).toFixed(1)),
    detourCompliancePercent: Number(detourCompliance.toFixed(1)),
    avgDetourPercent: Number(avgDetour.toFixed(1)),
    maxDetourPercent: Number(maxDetourPercent.toFixed(1)),
    dispatchLatencyMs: latency,
    fareReconciliationDelta: Number(totalFareDelta.toFixed(2)),
  };
}
