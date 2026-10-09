# FAIRWAY — System Architecture v1.0

**Intelligent Shared-Ride Matching & Dispatch · Hackathon MVP · October 2026**

FAIRWAY is a mobile-first shared-mobility application that matches passengers travelling in similar directions, optimizes vehicle routes, enforces a strict 15% detour limit, calculates transparent Shapley-based cost allocations, and manages the journey from ride request to trip completion.

The architecture separates the mobile interfaces, backend business logic, optimization algorithms, persistent data and external services. This allows the team to build and test each part independently.

---

## 1. High-level system architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│   [ Customer App ]      [ Driver App ]      [ Admin / Ops Hub ] │
│   Book, match, track    Assignments, stops  Dispatch, telemetry │
└────────────────┬─────────────────┬──────────────────┬───────────┘
                 │                 │                  │
┌────────────────▼─────────────────▼──────────────────▼───────────┐
│                    API AND ACCESS LAYER                         │
│   FastAPI / State Store · Authentication · Role Permissions     │
│   Request Validation · WebSockets / Reactive Event Bus          │
└────────────────┬────────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    BACKEND SERVICES CORE                        │
│  ├── Identity & Profiles         ├── Routing & VRPTW            │
│  ├── Ride Request Service        ├── 15% Detour Validator       │
│  ├── Matching & Dynamic Batching ├── Shapley Fare Engine        │
│  ├── Meeting-Point Optimizer     ├── Driver & Trip Dispatch     │
│  └── Safety & Incidents          └── Live Location Tracking     │
└────────────────┬────────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    PERSISTENT & ALGORITHMIC DATA                │
│  - PostgreSQL + PostGIS (Spatial queries, trips, ledger)        │
│  - Optimization Engine (OR-Tools, Shapley game, Benchmarks)     │
└─────────────────────────────────────────────────────────────────┘
```

Important architecture choice: The customer and driver products are genuine mobile applications. An optional web-based admin dashboard is for dispatch and operations staff; it is not the customer-facing product.

---

## 2. Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Customer and driver apps | React 19, TypeScript, Mobile Viewport | Mobile screens, navigation, forms and trip actions |
| UI and icons | Vanilla CSS / Tailwind, Lucide Icons | Reusable touch mobile UI with `#FCC016` palette |
| Maps | MapCanvas (SVG/Geospatial) | Real-time map visualization and coordinates |
| Admin interface | React + TypeScript | Dispatch, operations and benchmark analytics |
| State & Dispatch Store | Reactive Event Store (store.ts) | Business logic and lifecycle state transitions |
| Optimization & Routing | TypeScript Mathematical Modules | VRPTW and pickup/drop-off ordering |
| Batching Engine | Dynamic Sliding-Window (matching.ts) | Rolling window candidate grouping |
| Fare Allocation | Shapley Game Engine (shapley.ts) | Cooperative game theory cost allocation |
| Testing | Automated Verification Runner (tests) | In-browser test runner verifying 9 criteria |
| Version Control | Git + GitHub | Collaboration and reproducible deployments |

---

## 3. How Each Feature Works

### A. Authentication and User Roles
There are three roles: customer, driver and administrator.
1. A user registers or signs in.
2. The system authenticates the user and retrieves their role.
3. The app opens the appropriate customer or driver interface.
4. Permissions are checked on every protected operation.
5. Session expiration, logout and account recovery follow documented rules.

### B. Ride Request Service
The customer enters an origin, destination, requested time, passenger count and preferences.
The system validates the request, stores it, and calculates the passenger's solo-route baseline.
Each request retains its own baseline and source so later detour calculations are reproducible.

### C. Dynamic Sliding-Window Batching
The batching service keeps a rolling collection of eligible unmatched requests.
It filters candidates using:
- Origin and destination proximity (< 2.5 km).
- Direction and route compatibility (cosine similarity > 0.35).
- Requested time and pickup windows.
- Passenger count and vehicle capacity (maximum 3 riders for Auto).
- Women-only matching preferences.
- Maximum permitted waiting time (5-minute countdown).

### D. VRPTW Route Optimization
The routing component determines a valid order for pickups and drop-offs.
It enforces:
- Vehicle capacity (max 3).
- Pickup-before-drop-off precedence.
- Passenger pickup time windows.
- Feasible route sequence.
- Waiting-time constraints.
- The per-passenger 15% detour rule.

### E. Detour Validation
For a time-based detour:
$$\text{Detour \%} = \frac{\text{Pooled travel time} - \text{Solo baseline time}}{\text{Solo baseline time}} \times 100 \le 15.0\%$$

The validator evaluates every passenger separately. If even one passenger exceeds 15.0%, the candidate group is strictly rejected.

### F. Meeting-Point Optimization
For a valid group, the system proposes a meeting point that considers passenger convenience, route feasibility and additional travel (centroid snapped to named Nashik Auto Stand with walking distance < 250m).

### G. Shapley Value Fare Allocation
The fare engine calculates each passenger's marginal contribution:
$$\phi_i(v) = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N| - |S| - 1)!}{|N|!} \left( c(S \cup \{i\}) - c(S) \right)$$

Guaranteed mathematical properties:
1. Vehicle operating cost.
2. Shapley cost allocation.
3. Budget balance: $\sum \phi_i = c(N)$.
4. Platform commission (10%).
5. Driver net payout.

### H. Driver Assignment
After passengers accept the proposal, the dispatch service selects an available driver. It checks capacity, availability, and assignment conflicts.

### I. Trip Tracking
Driver sends location updates while trip is active. The customer sees driver location, meeting point, sequential dropoffs, and arrival ETA.

### J. Women-Only Matching & Safety
Women-only preference is enforced server-side. Male riders cannot view or join the Women-Only pool. Additional safety functions include:
- Trip-start PIN / Group OTP.
- Trusted contacts management.
- Live trip sharing link.
- 1-tap Emergency Police SOS (Nashik 112).
- Route-deviation alerts.

---

## 4. Trip State Machine

```
[REQUESTED] ──► [MATCHING] ──► [PROPOSAL_PENDING]
                    │                  │
                    │                  ├─► [NO_MATCH] / [RETRY]
                    │                  └─► [CANCELLED]
                    ▼
               [CONFIRMED]
                    │
                    ▼
             [DRIVER_PENDING]
                    │
                    ▼
             [DRIVER_ASSIGNED]
                    │
                    ▼
          [EN_ROUTE_TO_MEETUP]
                    │
                    ▼
               [AT_MEETUP]
                    │ (Verify 4-digit PIN)
                    ▼
             [PIN_VERIFIED]
                    │
                    ▼
              [IN_PROGRESS] (Sequential 1-by-1 dropoffs)
                    │
                    ▼
               [COMPLETED] (Fare settled in driver ledger)
```
