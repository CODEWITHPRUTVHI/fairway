# docs/DATABASE_SCHEMA.md — Entity-Relationship Schema

## Primary Entities
1. `users`:
   - `id`: UUID (PK)
   - `role`: 'CUSTOMER' | 'DRIVER' | 'ADMIN'
   - `name`: VARCHAR
   - `phone`: VARCHAR
   - `gender`: 'female' | 'male' | 'other'
   - `rating`: NUMERIC(3,2)
2. `drivers`:
   - `id`: UUID (PK, FK users.id)
   - `vehicle_model`: VARCHAR
   - `plate_number`: VARCHAR
   - `capacity`: INTEGER (Default 4)
   - `is_online`: BOOLEAN
   - `current_lat`: FLOAT
   - `current_lng`: FLOAT
3. `ride_requests`:
   - `id`: UUID (PK)
   - `user_id`: UUID (FK users.id)
   - `origin_lat`, `origin_lng`, `origin_name`: FLOAT, VARCHAR
   - `dest_lat`, `dest_lng`, `dest_name`: FLOAT, VARCHAR
   - `solo_baseline_km`, `solo_baseline_min`, `solo_baseline_cost`: FLOAT, FLOAT, NUMERIC(10,2)
   - `women_only_filter`: BOOLEAN
   - `status`: VARCHAR
4. `trips`:
   - `id`: UUID (PK)
   - `driver_id`: UUID (FK drivers.id)
   - `status`: TripState
   - `pin_code`: VARCHAR(4)
   - `total_distance_km`: FLOAT
   - `total_cost`: NUMERIC(10,2)
   - `started_at`, `completed_at`: TIMESTAMP
5. `fare_ledger_entries`:
   - `id`: UUID (PK)
   - `trip_id`: UUID (FK trips.id)
   - `gross_pooled_fare`: NUMERIC(10,2)
   - `platform_commission`: NUMERIC(10,2) (12%)
   - `driver_net_payout`: NUMERIC(10,2) (88%)
   - `timestamp`: TIMESTAMP
6. `safety_incidents`:
   - `id`: UUID (PK)
   - `trip_id`: UUID (FK trips.id)
   - `reporter_id`: UUID (FK users.id)
   - `type`: 'SOS' | 'ROUTE_DEVIATION' | 'UNEXPECTED_STOP'
   - `status`: 'ACTIVE' | 'RESOLVED'
