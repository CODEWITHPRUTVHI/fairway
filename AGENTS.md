# AGENTS.md — Agent Collaboration & Engineering Standards

## 1. Operating Rules for AI Agents
1. **Never Hallucinate Completion**: A feature is only complete when its logic, UI affordances, state transitions, and tests are genuinely implemented.
2. **Follow the Design References**: Adhere to the provided palette (`#FCC016` taxi gold, `#1E1E1E` dark, `#D1D5DB` grey, `#FFFFFF` white) and clean touch mobile interface patterns.
3. **No Unwired Affordances**: Every button, input, toggle, and tab must execute functional code or state updates.
4. **Preserve Algorithmic Rigor**:
   - Detour validator must compute `((pooled - solo) / solo) * 100` and reject violations exceeding 15%.
   - Shapley calculations must follow cooperative game theory with $c(S)$, marginal contribution, and balance checks.
5. **Always Update MIND.md & docs/DEVICE_HANDOVER.md**: Keep the session handover state clean for cross-device development.
