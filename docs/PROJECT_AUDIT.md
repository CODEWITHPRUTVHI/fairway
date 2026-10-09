# docs/PROJECT_AUDIT.md — Initial Audit & Assessment

## 1. Initial State Assessment
- **Workspace**: Vite 8 + React 19 + TypeScript + Tailwind CSS v4 environment.
- **Reference Assets Analyzed**:
  - `WhatsApp Image 2026-10-09 at 19.30.49.jpeg`: Color palette defined with primary brand yellow `#FCC016`, `#D1D5DB` cool grey, `#1E1E1E` black/dark slate, `#FFFFFF` white.
  - `WhatsApp Image 2026-10-09 at 19.26.26.jpeg`: Three high-fidelity mobile screens showing iOS status bar, clean top greetings ("Hello, Linh!"), destination inputs ("Hai Ba Trung, Ha Noi, Viet Nam", "43 Hang Bai"), route map, vehicle selector (#Car 4-seater, #Car 7-seater, Taxi 4-seater), cash/pay options, and rewards/promotions cards.
- **Discrepancy / Architecture Decision**:
  - The master brief instructs building an actual mobile app experience for Customer, Driver, and Operations interfaces.
  - In web environments (browser/preview), we implement a mobile-first responsive architecture featuring a realistic smartphone device emulator mode (with notch, safe areas, tactile bottom navigation, swipeable sheets) and fullscreen responsive view, ensuring native touch ergonomics ($44\text{px}+$ tap targets, thumb-zone primary CTAs).

## 2. Plan of Action
1. Implement the mathematical algorithms in pure, rigorously typed TypeScript modules:
   - Dynamic sliding-window candidate batching & matching
   - VRPTW route stop ordering & per-passenger detour check ($\le 15.0\%$)
   - Exact Shapley value game cost allocation engine
   - Reproducible automated benchmark suite
2. Implement backend-like state store with full lifecycle state machine:
   - `REQUESTED` -> `MATCHING` -> `PROPOSAL_PENDING` -> `CONFIRMED` -> `DRIVER_ASSIGNED` -> `EN_ROUTE_TO_MEETUP` -> `AT_MEETUP` -> `PIN_VERIFIED` -> `IN_PROGRESS` -> `COMPLETED`
3. Implement Customer Mobile Experience matching the reference UI (Linh persona, map routes, meeting points, Shapley breakdown, PIN, tracking, SOS).
4. Implement Driver Mobile Experience (availability, assignments, meetup navigation, PIN verification, earnings ledger).
5. Implement Operations Admin Console (batch inspector, detour validator, Shapley calculator, benchmark runner, incident manager).
6. Provide in-app Automated Test Suite validating all Section 18 criteria with green assertions.
