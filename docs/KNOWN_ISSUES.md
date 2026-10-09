# docs/KNOWN_ISSUES.md — Known Limitations & Next Steps

1. **Simulated Telemetry**: GPS location tracking and push notifications use high-fidelity browser timers and simulation rather than physical hardware push tokens.
2. **Deterministic Routing**: Street network routing uses real Nashik District coordinate geometry with Manhattan/road-factor corrections (1.28x factor), approximating real-world road networks with millimeter reproducibility.
3. **Emergency Dispatch**: Real emergency police calls (112) are mocked with simulated emergency dispatch confirmations as mandated by safety regulations.
