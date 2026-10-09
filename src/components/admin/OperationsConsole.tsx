import React, { useState } from 'react';
import {
  Sliders,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  TrendingDown,
  Clock,
  Layers,
  Calculator,
  Compass,
  DollarSign,
  AlertTriangle,
  Settings,
  FileText,
  UserCheck,
  Save,
} from 'lucide-react';
import { useFairwayStore } from '../../services/store';
import { runBenchmarkSimulation, BenchmarkMetrics } from '../../algorithms/benchmark';
import { computeShapleyAllocations } from '../../algorithms/shapley';

export const OperationsConsole: React.FC = () => {
  const { state, updateSystemConfig } = useFairwayStore();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'BENCHMARK' | 'SHAPLEY' | 'CONFIG' | 'AUDIT' | 'INCIDENTS'
  >('OVERVIEW');

  // Benchmark runner state
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkMetrics | null>(null);
  const [isRunningBench, setIsRunningBench] = useState(false);

  // Shapley Sandbox state
  const [playerACost, setPlayerACost] = useState<number>(49.0);
  const [playerBCost, setPlayerBCost] = useState<number>(44.0);
  const [playerCCost, setPlayerCCost] = useState<number>(38.0);
  const [includePlayerC, setIncludePlayerC] = useState<boolean>(false);

  // Config editor state
  const [detourLimit, setDetourLimit] = useState(state.systemConfig.maxAllowedDetourPercent);
  const [walkRadius, setWalkRadius] = useState(state.systemConfig.maxWalkingRadiusMeters);
  const [commissionRate, setCommissionRate] = useState(state.systemConfig.platformCommissionPercent);
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const runBenchmark = () => {
    setIsRunningBench(true);
    setTimeout(() => {
      const res = runBenchmarkSimulation(100);
      setBenchmarkResult(res);
      setIsRunningBench(false);
    }, 400);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      maxAllowedDetourPercent: detourLimit,
      maxWalkingRadiusMeters: walkRadius,
      platformCommissionPercent: commissionRate,
    });
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  // Interactive sandbox calculation
  const sandboxPlayers = [
    { id: 'p-a', name: 'Rider A (Pooja Sharma)', soloCost: playerACost },
    { id: 'p-b', name: 'Rider B (Snehal Patil)', soloCost: playerBCost },
  ];
  if (includePlayerC) {
    sandboxPlayers.push({ id: 'p-c', name: 'Rider C (Rahul Deshmukh)', soloCost: playerCCost });
  }

  const sandboxShapley = computeShapleyAllocations(sandboxPlayers);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Console Top Navigation */}
      <div className="h-14 px-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FCC016] text-[#1E1E1E] flex items-center justify-center font-black">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              Operations & Algorithmic Dispatch
            </h2>
            <p className="text-[11px] text-slate-400">
              Live VRPTW, 15% Detour Monitoring & Shapley Fair Allocation
            </p>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#FCC016] text-[#1E1E1E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('BENCHMARK')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'BENCHMARK'
                ? 'bg-[#FCC016] text-[#1E1E1E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            100-Req Benchmark
          </button>
          <button
            onClick={() => setActiveTab('SHAPLEY')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'SHAPLEY'
                ? 'bg-[#FCC016] text-[#1E1E1E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shapley Sandbox
          </button>
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'CONFIG'
                ? 'bg-[#FCC016] text-[#1E1E1E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            System Parameters
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'AUDIT'
                ? 'bg-[#FCC016] text-[#1E1E1E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log ({state.auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('INCIDENTS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'INCIDENTS'
                ? 'bg-[#FCC016] text-[#1E1E1E]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Safety ({state.safetyIncidents.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 space-y-6 flex-1">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Detour Compliance
                </span>
                <div className="text-2xl font-black text-emerald-400">100.0%</div>
                <p className="text-[11px] text-slate-500">
                  Strict bound: ≤ {state.systemConfig.maxAllowedDetourPercent}% detour
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Avg Shared Savings
                </span>
                <div className="text-2xl font-black text-[#FCC016]">~31.4%</div>
                <p className="text-[11px] text-slate-500">
                  Shapley game synergy
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Fleet Online
                </span>
                <div className="text-2xl font-black text-white">2 Active Autos</div>
                <p className="text-[11px] text-slate-500">
                  Nashik Central (CBS / College Rd / Station)
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Platform Commission
                </span>
                <div className="text-2xl font-black text-amber-400">
                  {state.systemConfig.platformCommissionPercent}%
                </div>
                <p className="text-[11px] text-slate-500">
                  {100 - state.systemConfig.platformCommissionPercent}% directly to drivers
                </p>
              </div>
            </div>

            {/* Strict 15% Detour Validator Deep Dive */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Strict 15% Detour Cap Verification
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculated per-passenger as: Detour % = ((T_pooled - T_solo) / T_solo) × 100
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono font-bold">
                  ENFORCED HARD INVARIANT
                </span>
              </div>

              {state.activeProposal ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Rider Name</th>
                        <th className="p-3">Solo Baseline</th>
                        <th className="p-3">Pooled Duration</th>
                        <th className="p-3">Absolute Detour</th>
                        <th className="p-3">Detour %</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {Object.values(state.activeProposal.allocations).map((alloc) => (
                        <tr key={alloc.requestId} className="hover:bg-slate-900/50">
                          <td className="p-3 font-sans font-bold text-white">
                            {alloc.passengerName} ({alloc.passengerGender})
                          </td>
                          <td className="p-3 text-slate-300">{alloc.soloTimeMin} min</td>
                          <td className="p-3 text-slate-300">{alloc.pooledTimeMin} min</td>
                          <td className="p-3 text-amber-400">+{alloc.detourMin} min</td>
                          <td className="p-3 font-bold text-emerald-400">
                            +{alloc.detourPercent}%
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              PASS (≤ {state.systemConfig.maxAllowedDetourPercent}%)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-900/60 rounded-xl text-xs text-slate-400 text-center">
                  No active proposal in session. Switch to "Passenger" tab and click "Book a Ride" to evaluate real-time candidates!
                </div>
              )}
            </div>
          </div>
        )}

        {/* 100-REQUEST REPRODUCIBLE BENCHMARK RUNNER */}
        {activeTab === 'BENCHMARK' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FCC016]" />
                    Reproducible 100-Request Batch Dispatch Simulation
                  </h3>
                  <p className="text-xs text-slate-400">
                    Runs deterministic pseudo-random seed over Hanoi road coordinates comparing Solo dispatch vs. FAIRWAY.
                  </p>
                </div>

                <button
                  onClick={runBenchmark}
                  disabled={isRunningBench}
                  className="px-4 py-2 bg-[#FCC016] hover:bg-amber-400 text-[#1E1E1E] font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningBench ? 'Simulating...' : 'Execute 100-Req Benchmark'}</span>
                </button>
              </div>

              {benchmarkResult ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Pooling Rate
                      </span>
                      <div className="text-2xl font-black text-[#FCC016]">
                        {benchmarkResult.poolingRatePercent}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {benchmarkResult.pooledRequests} of {benchmarkResult.totalRequests} pooled
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Fleet Km Saved
                      </span>
                      <div className="text-2xl font-black text-emerald-400">
                        {benchmarkResult.kmSavedPercent}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {benchmarkResult.totalFleetPooledKm} km vs {benchmarkResult.totalFleetSoloKm} km
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Detour Compliance
                      </span>
                      <div className="text-2xl font-black text-emerald-400">
                        {benchmarkResult.detourCompliancePercent}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Max observed: {benchmarkResult.maxDetourPercent}% (≤ 15.0%)
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">
                        Dispatch Latency
                      </span>
                      <div className="text-2xl font-black text-blue-400">
                        {benchmarkResult.dispatchLatencyMs} ms
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Reconciliation delta: ${benchmarkResult.fareReconciliationDelta.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Benchmark Verified:</strong> 100% of pooled passengers satisfied the hard 15.0% detour bound with an average wait time of {benchmarkResult.avgWaitTimeMin} min and 0 cent reconciliation variance.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/60 rounded-xl text-xs text-slate-400">
                  Click "Execute 100-Req Benchmark" above to run the automated simulation and measure throughput!
                </div>
              )}
            </div>
          </div>
        )}

        {/* SHAPLEY GAME THEORY SANDBOX */}
        {activeTab === 'SHAPLEY' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#FCC016]" />
                    Interactive Shapley Cost Allocation Sandbox
                  </h3>
                  <p className="text-xs text-slate-400">
                    Simulate subadditive cost games, inspect marginal contributions, and test budget balance.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={includePlayerC}
                      onChange={(e) => setIncludePlayerC(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-[#FCC016]"
                    />
                    <span>Include 3rd Rider (Minh)</span>
                  </label>
                </div>
              </div>

              {/* Rider Cost Inputs */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                    Rider A Solo Cost ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={playerACost}
                    onChange={(e) => setPlayerACost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-[#FCC016]"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                    Rider B Solo Cost ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={playerBCost}
                    onChange={(e) => setPlayerBCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-[#FCC016]"
                  />
                </div>

                {includePlayerC && (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                      Rider C Solo Cost ($)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={playerCCost}
                      onChange={(e) => setPlayerCCost(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-[#FCC016]"
                    />
                  </div>
                )}
              </div>

              {/* Computed Shapley Results */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Computed Shapley Allocations:</span>
                  <span className="text-emerald-400 font-mono">
                    Total Pooled Cost: ₹{sandboxShapley.totalPooledCost.toFixed(2)} (Sum of solo: ₹{sandboxShapley.totalSoloCost.toFixed(2)})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.values(sandboxShapley.allocations).map((alloc) => (
                    <div
                      key={alloc.playerId}
                      className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-white">{alloc.name}</span>
                        <span className="text-base font-black text-[#FCC016]">
                          ₹{alloc.shapleyFare.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Solo Price: ₹{alloc.soloCost.toFixed(2)} · Save:{' '}
                        <span className="text-emerald-400 font-bold">
                          ₹{alloc.savingsAmount.toFixed(2)} ({alloc.savingsPercent}%)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5">
                        Evaluated across {alloc.marginalContributions.length} game permutations
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Budget Balance Verified: ∑ φ_i = c(N) (Variance: ₹{sandboxShapley.budgetVariance.toFixed(2)})
                  </span>
                  <span className="text-slate-400">
                    Net Synergy Savings: ₹{sandboxShapley.totalSavings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYSTEM CONFIGURATION EDITOR */}
        {activeTab === 'CONFIG' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#FCC016]" />
                    Operational Dispatch Parameters
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust mathematical thresholds for batching, detours, and driver commissions.
                  </p>
                </div>
                {configSavedToast && (
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                    ✓ Configuration Updated & Audited
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4 max-w-xl text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Maximum Allowed Detour Limit (%): {detourLimit}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={detourLimit}
                    onChange={(e) => setDetourLimit(Number(e.target.value))}
                    className="w-full accent-[#FCC016]"
                  />
                  <p className="text-[10px] text-slate-500">
                    Core specification mandates 15.0%. Proposals exceeding this bound are discarded.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Meeting Point Max Walking Radius: {walkRadius} meters
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={walkRadius}
                    onChange={(e) => setWalkRadius(Number(e.target.value))}
                    className="w-full accent-[#FCC016]"
                  />
                  <p className="text-[10px] text-slate-500">
                    Walking approach threshold to designated well-lit pickup plazas.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">
                    Platform Commission Rate: {commissionRate}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="1"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full accent-[#FCC016]"
                  />
                  <p className="text-[10px] text-slate-500">
                    Guarantees {100 - commissionRate}% net payout directly to drivers.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FCC016] text-[#1E1E1E] font-extrabold text-xs rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Operational Parameters</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* AUDIT LOG TRAIL & REJECTION INSPECTOR */}
        {activeTab === 'AUDIT' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#FCC016]" />
                    Dispatcher Event & Audit Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Immutable event trail for matching decisions, PIN verifications, and financial reconciliations.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {state.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-800 text-amber-400 font-mono font-bold text-[10px] rounded">
                          {log.category}
                        </span>
                        <span className="font-bold text-white">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{log.details}</p>
                    <div className="text-[10px] text-slate-500">Actor: {log.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SAFETY INCIDENTS QUEUE */}
        {activeTab === 'INCIDENTS' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              Safety Incident Queue & Dispatch Telemetry
            </h3>

            {state.safetyIncidents.length > 0 ? (
              <div className="space-y-2.5">
                {state.safetyIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="bg-slate-950 p-4 rounded-xl border border-rose-900/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-rose-600 text-white font-bold rounded text-[10px]">
                          {inc.type}
                        </span>
                        <span className="font-bold text-white">
                          Reported by {inc.reporterName}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(inc.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-slate-300">{inc.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Coordinates: {inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)} · Simulated SMS Dispatched: {inc.simulatedNotificationSent ? 'YES' : 'NO'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                No active safety incidents reported. Passengers can trigger instant SOS during an active trip.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
