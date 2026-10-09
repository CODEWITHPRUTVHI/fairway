# docs/ARCHITECTURE.md — System Architecture

## 1. System Topology
FAIRWAY is organized into modular decoupled layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION LAYER                      │
│   [ Customer App ]      [ Driver App ]      [ Operations Hub ]  │
│   (Touch Viewport)     (Turn Navigation)    (Live Telemetry)    │
└────────────────┬─────────────────┬──────────────────┬───────────┘
                 │                 │                  │
┌────────────────▼─────────────────▼──────────────────▼───────────┐
│                    CENTRAL DISPATCH STATE STORE                 │
│  - Ride Requests & Baselines   - Trip Lifecycle State Machine    │
│  - Drivers & Fleet State       - Ledger & Safety Incidents       │
└────────────────┬────────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    ALGORITHMIC CORE ENGINES                     │
│  ├── 1. Dynamic Sliding-Window Batcher (Direction & Time Filters)│
│  ├── 2. VRPTW Precedence Router & 15% Detour Bound Validator    │
│  ├── 3. Meeting Point Optimizer (Walk < 250m approach)          │
│  └── 4. Shapley Value Game Cost Allocation Engine               │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Mathematical Formulations
### A. Detour Bound Constraint
For each passenger $i \in N$:
$$\text{Detour}_i = \frac{T_i^{\text{pooled}} - T_i^{\text{solo}}}{T_i^{\text{solo}}} \times 100 \le 15.0\%$$
If $\exists i \in N$ such that $\text{Detour}_i > 15.0\%$, the candidate group is rejected.

### B. Shapley Value Cost Allocation
Let $N$ be the set of pooled passengers. The characteristic cost function $c(S)$ represents the total travel cost for any subset $S \subseteq N$:
$$\phi_i(v) = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N| - |S| - 1)!}{|N|!} \left( c(S \cup \{i\}) - c(S) \right)$$
Properties guaranteed:
1. **Efficiency / Budget Balance**: $\sum_{i \in N} \phi_i = c(N)$
2. **Symmetry**: Equal contributors pay identical shares.
3. **Dummy Player**: A passenger adding exactly their solo cost pays their solo cost.
4. **Individual Rationality**: $\phi_i \le c(\{i\})$, meaning pooling is strictly cheaper than solo travel.
