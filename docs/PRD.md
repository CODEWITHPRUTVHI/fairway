# docs/PRD.md — Product Requirements Document

## 1. Product Summary
**FAIRWAY** (Fair Fares. Smarter Routes.) solves urban ride-pooling inefficiency by combining dynamic sliding-window batching, VRPTW route scheduling with a hard $\le 15\%$ individual passenger detour cap, and Shapley Value cost allocation to guarantee fair passenger discounts and driver wages.

## 2. Core User Personas & Use Cases
1. **Passenger (Customer)**:
   - Book pooled rides with guaranteed maximal 15% detour over solo travel time.
   - Transparent Shapley breakdown comparing solo baseline vs pooled savings.
   - Women-only travel partner filter for safety and comfort.
   - Boarding security with 4-digit PIN verified by driver.
   - Emergency SOS and trusted contact trip sharing.
2. **Driver**:
   - High-yield pooled assignments with transparent platform commission (10%).
   - Optimized stop order (pickups before dropoffs).
   - Meetup arrival check and PIN entry before trip start.
   - Transparent ledger recording net earnings per completed trip.
3. **Dispatcher / City Operator**:
   - Inspect candidate matching and rejection reasons.
   - Audit 15% detour compliance across all active routes.
   - Run reproducible 100-request benchmarks showing fleet distance savings and pooling rate.
   - Manage safety reports and dispatch audits.
