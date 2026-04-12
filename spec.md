# RentWise API — V1 Spec (Assumptions-Driven, Owner-First)

## 1) Purpose
Build an owner-first rental backend API that helps landlords list properties, manage tenant requests, and record payments.
V1 is designed for **local reality**: manual payments are **recorded**, not processed via gateway.

## 2) Primary User & Market
- **Primary user:** Owner / Landlord (drives adoption; controls supply)
- **Secondary user:** Tenant / Renter (creates demand; submits requests)
- **Market fit:** Local (Bangladesh-like) reality first; keep future upgrade path to global.
## 3) V1.5 Scope (Current State)
### 3.1 Authentication & Roles
- Register: OWNER or TENANT
- Login: JWT access token
- Invisible role verification for UX

### 3.2 Owner: Property Management & Ledger
- Create/Update property listings
- **Visuals**: Attach multiple image URLs to listings
- Approve/Reject tenant lease requests
- **Financials**: Record manual payments and track revenue stats

### 3.3 Tenant/Public: Discovery & Tracking
- Browse available properties with visual previews
- Advanced search/filter (keyword & city)
- Request leases and view payment receipts (read-only)

## 4) Tech Stack (Production-Ready)
- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: FastAPI (Python 3.12)
- **Database**: PostgreSQL (Dockerized)
- **Environment**: Docker & Docker Compose for full-stack orchestration

## 4.1 Frontend Architecture (Feature-Based Layered) 🧭
To ensure scalability and maintainability, the frontend follows a feature-based layered pattern:

### 1. Feature-First Structure
All code related to a specific domain (e.g., `requests`, `properties`, `auth`) is encapsulated within `src/features/[feature_name]`.

### 2. Architectural Layers
Each feature is divided into three distinct layers:
- **Data Layer (Services)**: `services/` contains raw API calls. These should be extracted from the global `api.js`.
- **Logic Layer (Hooks)**: `hooks/` contains Custom Hooks that manage state, side effects, and business logic.
- **UI Layer (Components)**: UI-specific components that consume hooks. They should be "purely visual" where possible.

### 3. Styling Standards
- **Tailwind CSS v4**: All new styling must use utility-first CSS. legacy `.css` files are to be deleted during refactoring.
- **Design Tokens**: Use CSS variables defined in `@theme` in `index.css` (e.g., `var(--color-primary)`).
- **Glassmorphism**: Use the `.glass-panel` utility for cards and overlays.

## 5) Data Model
### User
- id (uuid), role, full_name, email, password_hash

### Property
- id (uuid), owner_id, title, city, area, rent_amount, bedrooms, bathrooms, is_available
- **images**: Relationship to PropertyImage

### PropertyImage
- id (uuid), property_id (fk), url

### RentalRequest
- id (uuid), property_id, tenant_id, status (PENDING | APPROVED | REJECTED)

### Payment
- id (uuid), rental_request_id, amount, method (CASH | BKASH | NAGAD | BANK), status (PENDING | COMPLETED)

## 6) API Endpoints
- **Auth**: `/auth/register`, `/auth/login`, `/me`
- **Owner**: `/owner/properties`, `/owner/requests`, `/owner/payments` (for stats)
- **Public**: `/properties`, `/properties/{id}`
- **Tenant**: `/tenant/requests`, `/tenant/payments` (for receipts)

## 7) Non-Goals (Future ideas)
- Payment gateway integration
- In-app messaging
- Real file upload to S3/Cloudinary
- Notifications (email/push)
in moderation
- Reporting dashboard