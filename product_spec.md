# RentWise Product Specification & Roadmap

## 1. Product Overview
RentWise is a modern, full-stack rental ecosystem designed to bridge the gap between property owners and tenants. It replaces manual paperwork and disjointed communication with a central hub for visual discovery, digital lease applications, and integrated (simulated) payment legders.

---

## 2. Testing Protocol (User-Driven QA)
To preserve AI processing tokens and ensure human-approved design aesthetics:
- **Development**: The AI will write, compile, and structure the code functionality.
- **Verification**: The **Technical Product Owner (You)** will be solely responsible for testing the application in the browser. 
- **Feedback Loop**: If you encounter an error, simply paste the visual behavior or the console error into the chat, and the AI will provide a hotfix.

---

## 3. Current Capabilities (Version 1.0 Core)

### 👤 Role-Based Architecture
- **Tenant**: Can browse listings, apply for leases, track request status, securely pay rent via simulated gateways, and download digital receipts.
- **Owner**: Can list new properties with image URLs, manage incoming requests (Approve/Reject), view their unified income ledger, and manually record cash/off-platform payments.

### 🏠 Property Discovery
- Responsive masonry grid displaying modern property cards.
- Real-time search and filter logic (by city, area, price range, and keyword).
- Detail view for properties to see extended descriptions.

### 📝 Lease Lifecycle
- Tenants can submit a formal application message to the owner.
- Owners review applicants across all their properties from a unified dashboard.
- State machine: `PENDING` -> `APPROVED` -> `SUCCESS` (Payment).

### 💳 Payment & Ledger System
- **Checkout Simulation**: Interactive overlay mimicking mobile finance (bKash/Nagad) and Bank Transfers.
- **Digital Receipts**: Print-optimized, auto-generated PDFs showing Transaction IDs and timestamps.

---

## 4. Proposed Future Roadmap (Version 2.0 & Beyond)
Now that the core engine is stable, here are the logical next steps you can choose to pursue.

### Phase 1: Communication & Operations
- **Maintenance Portal**: Tenants can submit repair tickets (e.g., "Leaky Faucet") with photos, which show up in the Owner's dashboard.
- **Messaging System**: Simple socket-based or polled messaging between an owner and a tenant within an approved lease context.

### Phase 2: Refined UX & Profiles
- **User Profiles**: Allow users to upload avatars, change contact information, and reset passwords.
- **Rich Media**: Allow actual image file uploads (to S3 or local storage) instead of relying on external URLs for property listings.
- **Animated Onboarding**: A beautiful step-by-step tutorial overlay the first time a user registers.

### Phase 3: Analytics & Deployment
- **Owner Analytics**: Introduce charts (using Chart.js or Recharts) in the Owner Dashboard showing month-over-month rental income, occupancy rates, etc.
- **Cloud Deployment**: Containerize the app perfectly for a cloud provider (like Render, DigitalOcean, or AWS) and set up actual SSL.

---

## 5. Test Credentials Dictionary
*Always available for rapid local testing.*
- **Owner Account**: `owner@test.com` / `password123`
- **Tenant Account**: `tenant_real@test.com` / `password123`
