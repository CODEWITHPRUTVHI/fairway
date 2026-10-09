# docs/DECISIONS.md — Key Architectural Decisions

1. **Color Palette Alignment**:
   - Primary: `#FCC016` (Warm taxi gold / amber)
   - Secondary / Surface Dark: `#1E1E1E` (Obsidian slate)
   - Neutral Border / Card Accent: `#D1D5DB` (Cool silver grey)
   - Canvas: `#FFFFFF` (Clean daylight white)
2. **Dual-Mode Simulator**:
   - Provide an authentic mobile phone simulator with dynamic island, notch, and home bar, plus a toggle for fullscreen view.
   - Ensures both mobile touch ergonomics and high-density operational inspection.
3. **Deterministic Shapley Calculations**:
   - Calculated in exact float precision, rounded to 2 decimal places using largest remainder method to guarantee 100% budget balance $\sum \phi_i = c(N)$.
4. **Detour Bound Strictness**:
   - Evaluated per individual passenger. Any route with `max(detour_i) > 15.0%` is discarded.
