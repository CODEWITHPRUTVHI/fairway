# docs/IMPLEMENTATION_PLAN.md — Engineering Phases & Gateways

## Phase 0: Repository Audit & Core Documentation [COMPLETED]
- Audit existing files, extract colors (`#FCC016`, `#1E1E1E`, `#D1D5DB`, `#FFFFFF`), inspect UI mockups.
- Setup `MIND.md`, `AGENTS.md`, and `docs/` specifications.

## Phase 1: Algorithmic Foundation [COMPLETED]
- Implement Dynamic Sliding-Window Batcher (`src/algorithms/matching.ts`).
- Implement VRPTW & 15% Detour Validator (`src/algorithms/routing.ts`).
- Implement Shapley Value Allocation Engine (`src/algorithms/shapley.ts`).
- Implement 100-request Benchmark Suite (`src/algorithms/benchmark.ts`).

## Phase 2: State Store & Life Cycle State Machine [COMPLETED]
- Seeded accounts (Linh, Mai, Minh, Driver An, Driver Duc).
- State transitions: `REQUESTED` -> `MATCHING` -> `PROPOSAL_PENDING` -> `CONFIRMED` -> `DRIVER_ASSIGNED` -> `EN_ROUTE_TO_MEETUP` -> `AT_MEETUP` -> `PIN_VERIFIED` -> `IN_PROGRESS` -> `COMPLETED`.
- Women-only preference enforcement and PIN validation.

## Phase 3: Mobile Interfaces [COMPLETED]
- Dual Viewport: iPhone Touch Device Simulator (390x844 with physical frame, notch, safe-areas) + Full Responsive View.
- Customer App matching Reference Screenshot (Hanoi waypoints, vehicle cards, fare breakdown, tracking, SOS).
- Driver App (availability, turn-by-turn meeting navigation, PIN entry, ledger).
- Operations Console (telemetry, detour inspector, Shapley sandbox, live benchmark runner).

## Phase 4: Automated Verification Suite [COMPLETED]
- Automated in-browser test runner verifying all 9 criteria from Section 18 of prompt.
