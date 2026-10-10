# MIND.md — FAIRWAY Project Memory

## 1. Product Description
**FAIRWAY Nashik** is a production-grade, real-time intelligent shared mobility platform engineered specifically for **Nashik District Auto Rickshaws (MH-15)**. It groups commuters traveling along major congested corridors (CBS, College Road, Gangapur Road, Nashik Road Railway Station, Panchavati, CIDCO, Satpur MIDC) into high-efficiency shared Auto Rickshaws (maximum capacity: 3 passengers). 

It dynamically selects designated Nashik Auto Stands as meeting points, optimizes multi-stop routes with a **strict maximum 15% detour limit per passenger**, and computes mathematically fair passenger fares (in ₹ INR) and driver earnings using **Cooperative Game Theory (Shapley Value cost allocation)**.

Key capabilities include:
- **Cinematic Launch & Splash Experience**: Animated Auto Rickshaw with headlamp glow projection, sound/speed trails, and smooth entry into the app.
- **Real Leaflet OpenStreetMap Engine**: Real tile rendering centered on Nashik coordinates with user GPS location, auto rickshaw movement, and corridor routing.
- **Scrollable Native Booking Sheet**: Cleanly scrollable "Where to in Nashik" bottom sheet with zero cutoff on mobile viewports.
- **3-Phase Stranger Matching Radar Scanner**: 5-minute sliding window (Phase 1: 1.0 km anchor, Phase 2: +200m expansion, Phase 3: max 1.4 km corridor) with radar sweep animation and candidate commuter blips.
- **Midpoint Meeting Algorithm**: Automatically computes optimal gathering centroid snapped to recognized Nashik auto stands with walking times and distance.
- **Swiggy/Ola Style Live Vehicle Movement**: Smooth real-time breadcrumb animation of approaching Auto Rickshaw.
- **Cross-Device Real-Time Sync**: Realtime mesh service supporting multi-device operation (1 Driver + 3 Passengers across multiple phones or tabs).
- **Persistent Header & Clean Navigation**: Aligned top bar with zero name overflow and full functional drawer menu.
- **Top Bar Multi-Language Switcher**: English, Marathi (मराठी), and Hindi (हिंदी).
- **Strict Gender Privacy Protection**: Male commuters cannot view or select Women Sakhi mode; female commuters get verified female-only pooling.
- **Shapley Value Fair Fare Split & Payment Reminders**: Transparent cooperative game cost allocations and split payment reminders.

---

## 2. Architecture & Technology Stack
- **Mobile Frontend**: React 19 + TypeScript, Tailwind CSS v4, Lucide React icons.
- **Form Factors**:
  - **Edge-to-Edge Native Mobile Experience**: On mobile devices and installed PWA mode, the app takes 100% full screen with no fake phone bezels, no fake notch, and no nested scrollbars. Features a floating role-switch capsule for quick testing.
  - **Clean Pro App Card (Desktop)**: On desktop viewports, displays as a sleek, modern app container without fake hardware buttons or plastic frames.
  - **Dual Simulator**: Side-by-side Rider & Driver view for seamless dual interaction.
  - **PWA Installation**: Production-grade Progressive Web App with manifest.json (192px/512px icons), service worker cache (sw.js), and native OS install trigger.
- **Role Experiences**:
  - **Customer Mobile App**: Ola/Uber style booking, route comparison, live grouping, stand navigation, Ride OTP, in-trip tracking, safety SOS.
  - **Driver Mobile App**: Standalone dispatch console, audio ride popup, navigation, OTP validation, 1-by-1 dropoffs, earnings wallet.
  - **Operations & Admin Console**: Detour compliance auditor (15% cap), Shapley game coalition sandbox, 100-request batching benchmark.
- **Algorithmic Modules**:
  - `matching.ts`: Dynamic sliding-window batching (1 km anchor radius, 5 min window, max 3 riders).
  - `routing.ts`: VRPTW stop ordering, distance calculation, strict 15% detour validator.
  - `shapley.ts`: Exact cooperative game coalition cost function $c(S)$, marginal contribution $\phi_i(v)$, budget balance $\sum \phi_i = c(N)$.
  - `benchmark.ts`: Reproducible 100-request empirical benchmark engine.
  - `i18n.ts`: Tri-lingual localization system (EN, MR, HI).
- **State Store**:
  - `store.ts`: Reactive singleton store managing auth, active proposals, active trips, driver state, live simulation events, and persistent ride history.

---

## 3. Comprehensive Feature Catalog

### 3.1 Multi-Language Support (Top Bar & Menus)
- **Persistent Header Switcher**: Accessible at the top of the device screen allowing instant toggling between **EN (English)**, **MR (मराठी)**, and **HI (हिंदी)**.
- **Dynamic Localization**: All labels, auto stand names, fare breakdowns, driver instructions, and emergency prompts update dynamically.

### 3.2 Gender Privacy & Women-Only Auto Pool (महिला सखी)
- **Role-Based Visibility Guard**: When a passenger is registered or logged in as **Male (पुरुष)**, the Women-Only Auto Pool toggle and card are **completely hidden from the UI**.
- **Female Commuter Access**: Only verified **Female (महिला)** commuters can see and select the "Mahila Sakhi Auto" pool.
- **Backend Exclusion**: The matching algorithm rejects any pool proposal with mixed genders when the women-only preference is set.

### 3.3 Ola & Uber-Style Booking & Fare Comparison
- **Upfront Pricing Comparison**: Side-by-side display of:
  - **Solo Private Auto**: ₹60 (Direct, 4.2 km, 15 mins).
  - **Fairway Share-Auto**: ₹24 (Pooled, 60% savings badge).
- **Dynamic Cost-Split Timeline (A to C via B)**:
  - Visual route breakdown showing how money splits when intermediate drops occur:
    - **Stop A (CBS Auto Stand)**: Group boards.
    - **Stop B (Dongre Vasti)**: Passenger 2 drops off & pays ₹18.
    - **Stop C (College Road BYK)**: Passenger 1 drops off & pays ₹24.
    - **Stop D (Gangapur Road)**: Passenger 3 drops off & pays ₹26.
    - **Total Auto Meter**: ₹68 gross earnings.
- **Shapley Value Pricing**: Guarantees mathematical fairness where every passenger pays strictly less than their solo baseline and in proportion to their distance and detour.

### 3.4 Group Matching, Stand Selection & Ride OTP
- **Nashik Auto Capacity Limit**: Maximum of 3 passengers per auto rickshaw.
- **5-Minute Matching Countdown**: Real-time timer searches for compatible commuters along the corridor.
- **Temporary Group ID**: Generates unique group identifier (e.g., `NSK-AUTO-4821`).
- **Boarding Ride OTP**: The 4-digit numeric code acts as the Ride OTP for driver verification before boarding.
- **Designated Pickup Auto Stand**: Automatically calculated centroid/stand pickup point (e.g., CBS Auto Stand, BYK College Road Stand) with walking distance and ETA.
- **"I am Ready at Stand" Flow**: Commuters confirm their arrival; once all members are ready, the auto rickshaw is instantly auto-booked.

### 3.5 Standalone Driver Dashboard & Interactive Workflow
- **Standalone Operation**: Drivers can operate and test independently without requiring manual passenger booking steps first.
- **Simulated Incoming Ride Triggers**:
  - One-tap buttons: **"Trigger Incoming Ride Pop-Up (3 Passengers)"** and **"Peak Hour Station Request"**.
- **Full Driver Workflow States**:
  1. **Incoming Ride Pop-Up**: Audio ring alert, route preview, passenger count, pickup auto stand, gross fare (₹68), net payout (₹61.20 after 10% platform fee), and Accept / Decline options.
  2. **Navigation to Stand**: Turn-by-turn guidance to the auto stand with an **"Arrived at Auto Stand"** button.
  3. **Group ID / Ride OTP Verification**: 4-digit input field with a quick 1-tap testing helper to authorize passenger boarding and start the digital meter.
  4. **Sequential 1-by-1 Drop-Offs**: Driver navigates to each stop in order, taps to drop off individual passengers, and confirms collected cash/UPI fare.
  5. **Settled Auto Ledger**: Full trip summary with gross fare, 10% platform fee, and net driver payout credited to the wallet.
  6. **"Ready for Next Auto Ride 🛺"**: Resets the driver console to idle/radar mode to immediately take another ride.

### 3.6 Route Optimization & Detour Constraint
- **15% Detour Hard Bound**: Enforced strictly:
  $$\text{Detour \%} = \frac{\text{Pooled Travel Time} - \text{Solo Travel Time}}{\text{Solo Travel Time}} \times 100 \le 15.0\%$$
- **Precedence Constraints**: Every passenger's pickup must strictly precede their drop-off.
- **Rejection of Infeasible Groups**: Any grouping exceeding the 15% threshold is rejected.

### 3.7 Authentication & Role Switching
- **Role-Based Auth Screens (`AuthScreen.tsx` & `AuthModal.tsx`)**:
  - **Passenger**: Sign up / Log in with name, mobile, gender, emergency contact, and 4-digit PIN. Quick 1-tap fills for seeded commuters.
  - **Auto Driver**: Register / Log in with driver name, mobile number, Nashik Auto RTO number (MH-15), home auto stand, and PIN. Quick 1-tap driver profiles.
  - **Dispatcher / Admin**: Security PIN (default: `9999`) for operations and audit console.
- **Role Navigation**: Strict separation ensures commuters stay in the passenger experience and drivers operate the driver console.

---

## 4. Repository Structure
```
/
├── MIND.md                    # Single-source-of-truth project memory
├── AGENTS.md                  # Protocol for multi-agent engineering workflows
├── README.md                  # Overview & quickstart
├── metadata.json              # Applet metadata
├── index.html                 # HTML shell with viewport and title
├── docs/                      # Core architectural & audit documentation
│   ├── PROJECT_AUDIT.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── DECISIONS.md
│   ├── SETUP.md
│   ├── API_CONTRACTS.md
│   ├── DATABASE_SCHEMA.md
│   ├── TESTING.md
│   ├── KNOWN_ISSUES.md
│   └── DEVICE_HANDOVER.md
├── src/
│   ├── algorithms/            # Core mathematical & dispatch engines
│   │   ├── matching.ts        # Sliding-window & candidate compatibility (max 3, 5-min timer)
│   │   ├── routing.ts         # VRPTW stops, distances, 15% detour check
│   │   ├── shapley.ts         # Coalition game & Shapley allocation
│   │   └── benchmark.ts       # Reproducible 100-request benchmark engine
│   ├── components/
│   │   ├── common/            # DeviceFrame, TopBar, BottomNav, MapCanvas
│   │   ├── customer/          # Passenger booking, proposal, live tracking, history, profile
│   │   ├── driver/            # Driver assignments, navigation, OTP verification, ledger
│   │   ├── admin/             # Operations monitor, detour audit, Shapley sandbox
│   │   ├── auth/              # AuthScreen full-screen & AuthModal
│   │   └── safety/            # SOS, trusted contacts, live sharing modal
│   ├── data/                  # City coordinates, demo users, preset routes
│   ├── types/                 # Strict TypeScript contracts for rides, trips, ledgers
│   ├── services/              # Reactive backend store & i18n localization
│   ├── App.tsx                # Master container with role switching & device frame
│   └── main.tsx               # Application entry point
```

---

## 5. Critical Business Rules & Invariants
1. **Capacity Limit**: An auto rickshaw cannot carry more than 3 pooled passengers at any given point in time.
2. **Hard 15% Detour Bound**: Any pooled route where any passenger incurs $> 15.0\%$ extra travel time or distance compared to their direct solo trip is strictly rejected.
3. **Shapley Budget Balance**: Sum of allocated passenger fares equals the total pooled trip cost ($\sum_{i \in N} \phi_i = c(N)$). Platform commission (10%) is accounted for separately.
4. **Women-Only Privacy & Eligibility**:
   - Only female commuters see the Women-Only Auto Pool option.
   - Male commuters can neither see nor join women-only groups.
5. **OTP Boarding Security**: Driver cannot start the trip meter without verifying the passenger's 4-digit Ride OTP / Group ID.
6. **Sequential Drop-Offs**: Passengers must be dropped off in designated topological order, and each passenger's individual fare must be confirmed at their respective stop.

---

## 6. Build, Deployment & Verification
- **GitHub Repository**: [https://github.com/CODEWITHPRUTVHI/fairway](https://github.com/CODEWITHPRUTVHI/fairway)
- **Production Live URL**: [https://fairway-auto.netlify.app](https://fairway-auto.netlify.app)
- **App Install Prompt & PWA Integration**: Auto popup modal `InstallAppModal` on platform open with PWA manifest, OS detection (Android, iOS Safari, Desktop), home-screen installation progress, and persistent `Install App` header trigger.
- **Dual Device Simulation**: Added `DUAL_SIMULATOR` mode alongside `PHONE_SIMULATOR` and `RESPONSIVE_CANVAS` for simultaneous side-by-side execution of Passenger and Driver mobile apps.
- **Trip State Machine (PRD Section 12)**:
  - `REQUESTED` -> `MATCHING` -> `PROPOSAL_PENDING` -> `CONFIRMED` -> `DRIVER_PENDING` -> `EN_ROUTE_TO_MEETUP` -> `AT_MEETUP` -> `PIN_VERIFIED` -> `IN_PROGRESS` -> `COMPLETED`.
  - Reassignment workflow (FR-14) implemented on driver decline.
  - 1-tap instant demo access for Passenger (Pooja Sharma), Driver (Ramesh Kaka), and Dual-Mode login.
- **Lint Check**: `npm run lint` (runs `tsc --noEmit` — 0 errors)
- **Production Build**: `npm run build` (built in 610ms — 0 errors)
- **Dev Server**: `npm run dev` (running on port 3000)
- **Authoritative Docs**: `docs/PRD.md` v1.0 & `docs/ARCHITECTURE.md` v1.0 aligned with system implementation.
- **Three-Phase Mobile & Production Fixes**:
  - **Phase 1 (Draggable Bottom Sheet & Viewport Fix)**: Created 3-snap draggable bottom sheet (Collapsed 32%, Intermediate 58%, Expanded 88%) with upward/downward touch and mouse gestures, flick velocity detection, handle tap toggle, full background Leaflet map layer, independent scroll container, and 0 clipping of booking buttons.
  - **Phase 2**: Real-time RTO meter fare calculations based on pickup/drop locations; Driver app upgraded from SVG to Leaflet `LiveMap`.
  - **Phase 3**: Stranger matching modal elevated to `z-[10000]`, fallback ride request generation, dynamic co-rider fare breakdown, and smooth transition to main map with live moving auto.
