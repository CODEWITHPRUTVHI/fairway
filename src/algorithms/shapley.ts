/**
 * Shapley Value Cost Allocation Engine for Shared Mobility
 * Mathematically allocates total pooled vehicle trip costs among riders.
 */

export interface ShapleyPlayer {
  id: string;
  name: string;
  soloCost: number;
}

export interface ShapleyCoalitionCost {
  coalition: string[];
  key: string;
  cost: number;
}

export interface ShapleyResult {
  allocations: Record<
    string,
    {
      playerId: string;
      name: string;
      soloCost: number;
      shapleyFare: number;
      savingsAmount: number;
      savingsPercent: number;
      marginalContributions: Array<{
        coalition: string;
        marginalCost: number;
        weight: number;
      }>;
    }
  >;
  totalPooledCost: number;
  totalSoloCost: number;
  totalSavings: number;
  budgetBalanced: boolean;
  budgetVariance: number;
}

/**
 * Calculates factorial n!
 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/**
 * Characteristic cost function c(S) for urban pooled route
 * Models vehicle operating expense with subadditive shared synergy.
 */
export function defaultCoalitionCostFunction(
  coalition: ShapleyPlayer[],
  baseTripFlagDrop: number = 3.50,
  costPerKm: number = 2.40
): number {
  if (coalition.length === 0) return 0;
  if (coalition.length === 1) return coalition[0].soloCost;

  // For multi-passenger pooled routes, there is shared trunk synergy:
  // Operating cost is base flag drop + shared distance discount
  const sumSoloCosts = coalition.reduce((acc, p) => acc + p.soloCost, 0);
  const maxSolo = Math.max(...coalition.map((p) => p.soloCost));
  
  // Subadditive pooling cost formulation:
  // c(S) = max(solo) + 0.35 * (sum of remaining solo costs) + flagDrop discount
  const pooledCost = maxSolo + 0.40 * (sumSoloCosts - maxSolo);
  return Number(pooledCost.toFixed(2));
}

/**
 * Computes exact Shapley Value allocations for players N
 */
export function computeShapleyAllocations(
  players: ShapleyPlayer[],
  costFunction: (coalition: ShapleyPlayer[]) => number = defaultCoalitionCostFunction
): ShapleyResult {
  const n = players.length;
  if (n === 0) {
    return {
      allocations: {},
      totalPooledCost: 0,
      totalSoloCost: 0,
      totalSavings: 0,
      budgetBalanced: true,
      budgetVariance: 0,
    };
  }

  const totalPooledCost = costFunction(players);
  const totalSoloCost = players.reduce((sum, p) => sum + p.soloCost, 0);

  // Generate all 2^n subsets
  const playerMap = new Map<string, ShapleyPlayer>();
  players.forEach((p) => playerMap.set(p.id, p));

  const rawShapley: Record<string, number> = {};
  const marginalRecords: Record<
    string,
    Array<{ coalition: string; marginalCost: number; weight: number }>
  > = {};

  players.forEach((p) => {
    rawShapley[p.id] = 0;
    marginalRecords[p.id] = [];
  });

  // For each player i, calculate:
  // phi_i = sum_{S subset N \ {i}} [ |S|! (n - |S| - 1)! / n! ] * (c(S U {i}) - c(S))
  for (const player of players) {
    const otherPlayers = players.filter((p) => p.id !== player.id);
    const numOthers = otherPlayers.length;
    const numSubsets = 1 << numOthers;

    for (let mask = 0; mask < numSubsets; mask++) {
      const subset: ShapleyPlayer[] = [];
      for (let j = 0; j < numOthers; j++) {
        if ((mask & (1 << j)) !== 0) {
          subset.push(otherPlayers[j]);
        }
      }

      const sSize = subset.length;
      const weight =
        (factorial(sSize) * factorial(n - sSize - 1)) / factorial(n);

      const costWithout = costFunction(subset);
      const costWith = costFunction([...subset, player]);
      const marginalCost = costWith - costWithout;

      rawShapley[player.id] += weight * marginalCost;

      const coalitionLabel =
        subset.length === 0
          ? '∅'
          : `{${subset.map((s) => s.name).join(', ')}}`;

      marginalRecords[player.id].push({
        coalition: coalitionLabel,
        marginalCost: Number(marginalCost.toFixed(2)),
        weight: Number(weight.toFixed(4)),
      });
    }
  }

  // Deterministic currency rounding & budget balance reconciliation
  const roundedAllocations: Record<string, number> = {};
  let currentSum = 0;

  players.forEach((p) => {
    const rounded = Number(rawShapley[p.id].toFixed(2));
    roundedAllocations[p.id] = rounded;
    currentSum += rounded;
  });

  currentSum = Number(currentSum.toFixed(2));
  const variance = Number((totalPooledCost - currentSum).toFixed(2));

  // Reconcile residual cent variance onto the largest fare to preserve strict budget balance
  if (Math.abs(variance) > 0.001) {
    const highestPlayer = [...players].sort(
      (a, b) => roundedAllocations[b.id] - roundedAllocations[a.id]
    )[0];
    roundedAllocations[highestPlayer.id] = Number(
      (roundedAllocations[highestPlayer.id] + variance).toFixed(2)
    );
  }

  const resultAllocations: ShapleyResult['allocations'] = {};

  players.forEach((p) => {
    const fare = roundedAllocations[p.id];
    const savings = Math.max(0, Number((p.soloCost - fare).toFixed(2)));
    const savingsPercent =
      p.soloCost > 0 ? Number(((savings / p.soloCost) * 100).toFixed(1)) : 0;

    resultAllocations[p.id] = {
      playerId: p.id,
      name: p.name,
      soloCost: p.soloCost,
      shapleyFare: fare,
      savingsAmount: savings,
      savingsPercent,
      marginalContributions: marginalRecords[p.id],
    };
  });

  const finalAllocatedSum = Object.values(resultAllocations).reduce(
    (acc, a) => acc + a.shapleyFare,
    0
  );

  return {
    allocations: resultAllocations,
    totalPooledCost,
    totalSoloCost,
    totalSavings: Number((totalSoloCost - totalPooledCost).toFixed(2)),
    budgetBalanced: Math.abs(finalAllocatedSum - totalPooledCost) < 0.01,
    budgetVariance: Number((totalPooledCost - finalAllocatedSum).toFixed(2)),
  };
}
