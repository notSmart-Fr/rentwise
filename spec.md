# RentWise API — V1 Spec (Assumptions-Driven, Owner-First)

## 1) Purpose
Build an owner-first rental backend API that helps landlords list properties, manage tenant requests, and record payments.
V1 is designed for **local reality**: manual payments are **recorded**, not processed via gateway.

## 2) Primary User & Market
- **Primary user:** Owner / Landlord (drives adoption; controls supply)
- **Secondary user:** Tenant / Renter (creates demand; submits requests)
- **Market fit:** Local (Bangladesh-like) reality first; keep future upgrade path to global.

## 3) V1 Scope (What we will build)
### 3.1 Authentication & Roles
- Register: OWNER or TENANT
- Login: JWT access token
- `/me` endpoint to fetch current user

### 3.2 Owner: Property Management
- Owner creates property listing
- Owner updates property details
- Owner marks availability (available/unavailable)
- Owner can list only their own properties

### 3.3 Tenant/Public: Property Discovery
- Browse available properties
- Filter/search by: city, area, rent range, bedrooms (basic V1 filters)
- View property details

### 3.4 Rental Requests
- Tenant creates rental request for a property
- Owner views incoming requests for their properties
- Owner approves/rejects requests

### 3.5 Payments (Record-only)
- Owner records a payment for an approved request
- Payment includes:
  - method: CASH / BKASH / NAGAD / BANK
  - reference note (optional): trx id / memo
  - status: PENDING / PAID

## 4) Non-Goals (Explicitly NOT in V1)
To avoid scope creep, we will NOT build these in V1:
- Payment gateway integration (bKash API, Stripe, etc.)
- In-app messaging/chat
- File uploads (NID, images, documents)
- Admin panel
- Notifications (email/SMS/Push)
- Advanced ranking/recommendations
- Dispute resolution system

## 5) Assumptions (The “bets” we are making)
Each assumption has a risk level and a V1 test.

### A1 — Owners will adopt if it reduces coordination overhead
- **Why we believe it:** owners currently handle calls/brokers/messages manually
- **Risk:** High (if false, product dies)
- **V1 test:** owner onboarding + property creation + request inbox
- **Metric:** % owners who create ≥1 property; avg time from request → decision

### A2 — Trust signals matter more than fancy UI
- **Why we believe it:** owners fear unreliable tenants
- **Risk:** High
- **V1 test:** simple tenant profile + verification flag (true/false for now)
- **Metric:** approval rate; rejection rate; reasons (later)

### A3 — Manual payment recording is sufficient for V1
- **Why we believe it:** local payments often happen outside platforms
- **Risk:** Medium
- **V1 test:** record payment with method + reference note
- **Metric:** % approved requests with payment recorded; disputes/cancellations

### A4 — Messaging can be deferred
- **Why we believe it:** WhatsApp/phone is common; platform just needs structure
- **Risk:** Medium
- **V1 test:** no chat; just request + status + contact reveal later (future)
- **Metric:** request completion rate; cancellation rate

## 6) Architecture (Backend Design)
We use a layered modular structure:

- **Router (API layer):** HTTP endpoints, auth dependencies, request/response
- **Schemas (DTOs):** Pydantic models for validation
- **Service (Business rules):** “owner can approve only their property’s requests”
- **Repository (Data access):** database queries
- **Models:** SQLAlchemy ORM models
- **DB:** engine + session setup
- **Core:** settings, security (JWT, password hashing)

## 7) Tech Stack (V1)
- Python 3.11+ (or your installed version)
- FastAPI + Uvicorn
- SQLite (first)
- SQLAlchemy ORM
- Alembic migrations (add when models begin)
- JWT auth (python-jose)
- Password hashing (passlib + bcrypt)
- Pytest (minimal V1)

## 8) Data Model (V1)
### User
- id (uuid)
- role: OWNER | TENANT
- full_name
- phone (optional)
- email (unique)
- password_hash
- is_verified (bool, default false)
- created_at

### Property
- id (uuid)
- owner_id (fk user)
- title
- description (optional)
- city
- area
- address_text (optional)
- rent_amount
- bedrooms (optional)
- bathrooms (optional)
- is_available (bool)
- created_at

### RentalRequest
- id (uuid)
- property_id (fk property)
- tenant_id (fk user)
- status: PENDING | APPROVED | REJECTED | CANCELLED
- move_in_date (optional)
- message (optional)
- created_at, updated_at

### Payment
- id (uuid)
- rental_request_id (fk rental_request)
- amount
- method: CASH | BKASH | NAGAD | BANK
- reference (optional)
- status: PENDING | PAID
- created_at

## 9) API Endpoints (V1)
### Auth
- POST `/auth/register`
- POST `/auth/login`
- GET  `/me`

### Owner: Properties
- POST  `/owner/properties`
- GET   `/owner/properties`
- PATCH `/owner/properties/{property_id}`
- PATCH `/owner/properties/{property_id}/availability`

### Public/Tenant: Browse
- GET `/properties` (filters)
- GET `/properties/{property_id}`

### Requests
- POST  `/properties/{property_id}/requests`
- GET   `/owner/requests`
- PATCH `/owner/requests/{request_id}/approve`
- PATCH `/owner/requests/{request_id}/reject`

### Payments
- POST `/owner/requests/{request_id}/payments`
- GET  `/owner/requests/{request_id}/payments`

## 10) Definition of Done (V1)
A “done” V1 means:
- API boots locally and `/docs` works
- Happy-path works end-to-end:
  - Owner registers → creates property
  - Tenant registers → browses → requests
  - Owner approves → records payment
- Basic authorization rules enforced (owner only touches their data)
- Repo contains this `spec.md` and a basic README with run steps

## 11) Future (V2+ ideas, not now)
- Phone/email verification (OTP)
- Property images upload
- Messaging
- Payment gateway integration
- Admin moderation
- Reporting dashboard