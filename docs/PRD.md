# FAIRWAY — PRODUCT REQUIREMENTS DOCUMENT

**Product name:** FAIRWAY  
**Tagline:** Fair Fares. Smarter Routes.  
**Product type:** Intelligent shared-mobility mobile application  
**Document version:** 1.0  
**Status:** MVP specification  
**Primary platforms:** Android first, with an architecture that can support iOS / Mobile Web  
**Target:** Functional hackathon prototype with reproducible tests and a documented path to production

---

## 1. Product vision

FAIRWAY is a mobile application that helps passengers travelling in similar directions find compatible travel partners before a vehicle is assigned.

The platform proposes a convenient meeting point, optimizes the pickup and drop-off sequence, enforces a maximum 15% detour for every passenger, calculates transparent fare allocations using Shapley Value, assigns a suitable driver and provides trip tracking and safety workflows.

FAIRWAY has separate customer and driver experiences with role-based access. Its backend controls matching, route validation, fares, assignments and trip states.

The objective is to make shared journeys practical, transparent and more efficient without allowing route optimization to violate passenger constraints.

## 2. Problem statement

Passengers travelling alone may face high transport costs. Other passengers travelling along similar routes may be able to share a vehicle, but finding compatible people, coordinating pickup points and dividing the cost fairly can be difficult.

Existing manual coordination can lead to excessive waiting, inconvenient meeting points, unnecessary detours and unclear fare splits.

FAIRWAY aims to solve these challenges through algorithmic passenger matching, route optimization, individual detour validation and transparent cost allocation.

## 3. Product goals

1. Allow customers to create and manage ride requests.
2. Identify compatible passengers travelling in similar directions.
3. Propose feasible meeting points and shared routes.
4. Enforce the problem statement's 15% detour limit for every passenger.
5. Calculate explainable fare allocations using the defined Shapley cost model.
6. Support women-only travel-partner matching.
7. Allow customers to review and accept proposed groups.
8. Assign suitable drivers and manage the trip lifecycle.
9. Provide live or clearly labeled simulated trip tracking.
10. Include essential safety workflows.
11. Give operators tools to inspect matching, route and fare decisions.
12. Benchmark the matching algorithm against a defined baseline.
13. Maintain project documentation so development can resume on a different computer.

## 4. Non-goals for the MVP

The initial release will not attempt to provide:

- An entire production-scale ride-hailing business.
- Direct booking through Uber, Ola or other third-party fleets.
- Guaranteed real-world driver availability.
- Real payment collection or bank payouts without a payment integration.
- Guaranteed emergency-service dispatch without a configured integration.
- Fully autonomous, large-scale traffic prediction.
- Advanced machine-learning demand forecasting.
- Native applications for every platform simultaneously.
- A separate public marketing website as a substitute for the mobile app.

## 5. User roles

### 5.1 Customer

Can register, sign in, create ride requests, find travel partners, review matching proposals, accept or reject meeting points, view fares, track assigned trips, use available safety tools and view ride history.

### 5.2 Driver

Can sign in, manage availability, receive and respond to assignments, view passenger and meeting-point details, confirm arrival, verify the trip-start PIN, follow the assigned stop sequence, complete trips and view recorded earnings.

### 5.3 Administrator or dispatcher

Can inspect ride requests, review proposals and routing decisions, monitor eligible drivers and trips, inspect detour calculations, review fare allocations, manage reported incidents and view benchmark results.

**MVP interface requirement:** Customer and driver must have distinct authorized navigation, screens and dashboards. The admin role may initially use a protected operations module, but it must not gain access merely by changing a client-side setting.

## 6. Functional requirements and priorities

Priority definitions:

- P0: Mandatory for the end-to-end MVP.
- P1: Important safety or operational enhancement.
- P2: Deferred production or future feature.

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Customer registration, login, logout and session management | P0 |
| FR-02 | Driver login and role-protected driver interface | P0 |
| FR-03 | Customer and driver profiles | P0 |
| FR-04 | Ride request creation and persistence | P0 |
| FR-05 | Solo-route baseline and source tracking | P0 |
| FR-06 | Dynamic sliding-window passenger batching | P0 |
| FR-07 | Compatible-group generation and capacity validation | P0 |
| FR-08 | VRPTW routing with pickup/drop-off precedence and time windows | P0 |
| FR-09 | Hard 15% per-passenger detour validation | P0 |
| FR-10 | Meeting-point proposal | P0 |
| FR-11 | Women-only travel-partner matching | P0 |
| FR-12 | Group proposal, acceptance, rejection and expiry | P0 |
| FR-13 | Shapley-based cost allocation and fare explanation | P0 |
| FR-14 | Driver assignment and reassignment | P0 |
| FR-15 | Trip state management and trip-start PIN | P0 |
| FR-16 | Customer trip status and available location updates | P0 |
| FR-17 | Fare receipt and trip history | P0 |
| FR-18 | Dispatcher monitoring and decision inspection | P0 |
| FR-19 | Reproducible benchmark against a defined baseline | P0 |
| FR-20 | Trusted contacts, trip sharing and SOS incident workflow | P1 |
| FR-21 | Route-deviation alerts using reliable location information | P1 |
| FR-22 | Detailed driver earnings and platform commission ledger | P1 |
| FR-23 | Real payment gateway and driver payouts | P2 |
| FR-24 | Advanced demand prediction and large-scale dispatch | P2 |

The algorithmic requirements explicitly defined by the hackathon problem statement remain mandatory even if their implementation is challenging.

## 7. Customer application requirements

### 7.1 Onboarding and authentication

The customer can create an account, sign in, recover access where supported, manage their profile and sign out.

Acceptance criteria:
- Invalid credentials do not create a session.
- Protected customer features require authentication.
- Session handling is documented.
- Private profile information is not visible to unrelated passengers.

### 7.2 Ride request

The customer enters:
- Origin.
- Destination.
- Requested time.
- Passenger count.
- Relevant matching preferences.
- Women-only travel-partner preference where applicable.

Acceptance criteria:
- The form validates required inputs.
- The request is saved to persistent storage.
- Invalid locations and passenger counts are rejected.
- The customer can see request status and cancel eligible requests.

### 7.3 Partner search

The matching engine filters candidates using spatial proximity, direction compatibility, time compatibility, capacity and required preferences.

Acceptance criteria:
- Incompatible candidates are not presented as valid matches.
- The engine respects the configured maximum waiting time.
- A request can expire even when no new passenger submits a request.
- The customer sees a clear searching, matched, expired, cancelled or no-match state.
- A no-match result does not silently bypass hard constraints.

### 7.4 Meeting-point proposal

The system provides a proposed meeting point, an estimated route and a summary of the passenger group.

The customer can inspect the details and accept or reject the proposal.

Acceptance criteria:
- The proposal displays passenger-specific fare and detour information.
- The meeting point is represented on the map when map support is available.
- The group does not become confirmed until all required passengers accept.
- Declined or expired proposals follow a documented recovery path.

### 7.5 Fare and trip confirmation

The customer can inspect their allocation and the defined fare breakdown before accepting.

Acceptance criteria:
- The displayed fare originates from the fare service.
- The allocation method is identified correctly.
- Rounding and reconciliation are consistent.
- Shapley allocation is not mislabeled as an equal split.
- The confirmed proposal cannot be modified silently after acceptance.

### 7.6 Assigned driver and active trip

The customer sees relevant driver and vehicle information, the meetup point, trip status and available location information.

Acceptance criteria:
- Only the assigned driver's information is shown.
- Stale location updates are identified.
- The trip-start PIN is handled by a validated backend operation.
- Trip status follows the backend state machine.
- Completion results in a saved trip record and fare receipt.

### 7.7 Customer safety and account

The app provides supported trip sharing, trusted contacts, SOS and incident reporting.

Acceptance criteria:
- A safety action creates an incident or invokes a configured integration.
- The UI reports the actual delivery state.
- Simulated actions are labeled.
- Safety-related data is protected by role permissions.
- Privacy policy, terms, safety information, help and account settings are accessible in the app.

## 8. Driver application requirements

### 8.1 Driver profile and availability

The driver can sign in, review their profile, select availability where permitted and access eligible assignments.

Acceptance criteria:
- Driver identity is resolved on the backend.
- Unavailable drivers cannot be assigned new trips.
- Unauthorized users cannot access driver-only operations.
- Vehicle capacity and assignment compatibility are verified.

### 8.2 Incoming assignment

The driver sees:
- Assignment identifier.
- Passenger count.
- Meeting point.
- Pickup/drop-off sequence.
- Route summary.
- Relevant timing information.
- Assignment expiry where implemented.

Acceptance criteria:
- Drivers can accept or reject valid assignments.
- Rejection or timeout triggers a visible reassignment process.
- A driver cannot accept conflicting active assignments.
- Duplicate assignment requests do not produce multiple active bookings.

### 8.3 Meetup and trip start

The driver can navigate to the meetup, mark arrival and verify the configured trip-start PIN.

Acceptance criteria:
- Arrival and PIN verification are validated by the backend.
- A trip cannot enter the in-progress state before required checks succeed.
- Incorrect PIN attempts produce a clear failure state.
- Invalid or duplicate trip-start requests are rejected.

### 8.4 Active trip and completion

The driver follows the assigned stops and marks trip completion.

Acceptance criteria:
- Pickup/drop-off ordering comes from the assigned route.
- Unauthorized trip transitions are rejected.
- Location updates are associated with the correct trip.
- Completion is persisted and does not create duplicate ledger entries.
- Driver earnings show recorded calculations rather than invented payouts.

### 8.5 Driver support and privacy

The driver has access to settings, trip history, earnings information, support, incident reporting, privacy policy, terms and logout.

The application must not expose unrelated passengers' personal or location information.

## 9. Matching and optimization requirements

### 9.1 Dynamic batching

The batching engine maintains a rolling window of unmatched requests and produces compatible candidate groups.

Requirements:
- Configurable batching window.
- Maximum passenger capacity.
- Maximum waiting time.
- Time-compatible requests.
- Candidate grouping and a documented scoring method.
- Duplicate-proposal protection.
- Correct timeout behavior without new requests.

### 9.2 VRPTW optimization

The routing engine must respect:
- Pickup-before-drop-off ordering.
- Vehicle capacity.
- Passenger time windows.
- Routing feasibility.
- Maximum waiting limits.
- The defined detour constraint.

### 9.3 Strict detour validation

The system must use the exact metric required by the hackathon statement.

For a travel-time definition:

$$\text{Detour \%} = \frac{\text{Pooled travel time} - \text{Solo baseline time}}{\text{Solo baseline time}} \times 100$$

Acceptance criteria:
- Each passenger has a preserved solo baseline.
- Every passenger is validated individually.
- Any violation above the permitted 15% bound makes the group infeasible.
- Missing or zero baselines are handled explicitly.
- The rejected route and reason are inspectable.
- Boundary tests cover the permitted limit and values beyond it.

### 9.4 Meeting-point selection

The optimizer evaluates meeting-point candidates using route feasibility, passenger convenience and their effects on the route.

Acceptance criteria:
- The selected point is part of the validated proposal.
- A change to the meeting point triggers the necessary route and detour revalidation.
- No feasible point results in a no-match or retry state, not a false success.

## 10. Shapley fare allocation requirements

The fare engine defines a coalition-cost function $c(S)$, with $c(\emptyset) = 0$, and calculates passenger allocations using Shapley Value:

$$\phi_i(v) = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N| - |S| - 1)!}{|N|!} \left( c(S \cup \{i\}) - c(S) \right)$$

Requirements:
- Define the cost model and its inputs.
- Calculate marginal contributions across supported feasible coalitions.
- Handle infeasible coalitions under a documented policy.
- Apply deterministic currency rounding.
- Reconcile the allocation with the defined cost pool ($\sum \phi_i = c(N)$).
- Expose an explanation for every passenger.
- Test small known examples and relevant mathematical properties.

The product distinguishes:
1. Vehicle operating cost.
2. Shapley cost allocation.
3. Customer-facing fare.
4. Platform commission (10%).
5. Driver net payout.

## 11. Women-only matching requirements

Women-only travel-partner matching is a mandatory feature.

Requirements:
- The preference is stored and enforced by the system.
- Candidate filtering excludes incompatible requests.
- Eligibility is rechecked before group confirmation.
- No silent fallback to a mixed group is allowed.
- Unmatched customers can retry or use a clearly separate supported option.
- Eligibility must not be inferred from names or profile photos.
- Sensitive verification data must be minimized and access-controlled.

## 12. Dispatch and trip state management

Use a backend-controlled state machine:

REQUESTED → MATCHING → PROPOSAL_PENDING → CONFIRMED → DRIVER_PENDING → DRIVER_ASSIGNED → EN_ROUTE_TO_MEETUP → AT_MEETUP → PIN_VERIFIED → IN_PROGRESS → COMPLETED

Also support appropriate cancellation, expiry, rejection, no-match and reassignment states.

## 13. Administration and operations

The protected operations module provides:
- Overview of requests, groups, trips and available vehicles.
- Ride request inspection.
- Proposal details and acceptance state.
- Map and route visualization.
- Individual detour checks and rejection explanations.
- Fare allocation inspection.
- Driver assignment management.
- Active-trip monitoring.
- Safety incident review.
- Benchmark execution and comparison.
- Permitted operational configuration.

## 14. Safety, privacy and legal information

The MVP includes:
- Driver and vehicle details.
- Trip-start PIN.
- Trip-sharing workflow.
- Trusted-contact management.
- SOS incident record and status.
- Safety issue reporting.
- Privacy policy.
- Terms and conditions.
- About FAIRWAY.
- Help and support.

## 15. Benchmark requirements

Compare FAIRWAY with a documented baseline on identical request datasets:
- Pooling rate.
- Passenger waiting time.
- Total fleet distance.
- Detour compliance (100% target).
- Dispatch latency.
- Match failure rate.
- Fare reconciliation.
