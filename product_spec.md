# RentWise Product Specification & Roadmap

## 1. Product Overview
RentWise is a modern, full-stack rental ecosystem designed to bridge the gap between property owners and tenants. It replaces manual paperwork and disjointed communication with a central hub for visual discovery, digital lease applications, and integrated (simulated) payment ledgers.

---

## 2. Testing Protocol (User-Driven QA)
To preserve AI processing tokens and ensure human-approved design aesthetics:
- **Development**: The AI will write, compile, and structure the code functionality.
- **Verification**: The **Technical Product Owner (You)** will be solely responsible for testing the application in the browser. 
- **Restriction**: The AI must NOT automate testing using the browser subagent tool; debugging and visual verification are reserved for the user.
- **Feedback Loop**: If you encounter an error, simply paste the visual behavior or the console error into the chat, and the AI will provide a hotfix.

---

## 3. Current Capabilities (Core Engine)

### 🔑 Secure Authentication (Airbnb Style)
- **Universal Accounts**: Every user is both a **Tenant** and an **Owner** registered via a single email.
- **Google Social Login**: Integrated Google One Tap and button authentication for seamless onboarding.
- **Toggle Mode**: A global switcher allows users to flip between "Renting" and "Hosting" modes instantly.
- **Smart Validation**: In-depth backend verification of email existence and password strength.

### 🏠 Property Discovery
- Responsive masonry grid with modern property cards.
- Real-time search and filter logic (City, Area, Price, Keywords).
- Detail view for properties with image carousels.

### 📝 Lease & Maintenance Lifecycle
- **Lease Applications**: PENDING -> APPROVED -> SUCCESS flow.
- **Maintenance Portal**: Tenants can submit repair tickets; Owners can update status (Open -> Work in Progress -> Resolved).
- **Automated Notifications**: Real-time alerts for lease status changes, incoming messages, and payment confirmations.

### 💬 Unified Communication
- **Contextual Messaging**: Dedicated chat threads for each property inquiry, rental request, and maintenance ticket.
- **Real-time Engine**: Powered by WebSockets and a global **Messaging Context** for instant delivery, global unread count sync, and optimistic UI updates (e.g., instant badge clearing).

### 💳 Payment & Ledger System
- **Checkout Simulation**: Interactive overlay for bKash/Nagad and Bank Transfers.
- **Ledger Tracking**: Every transaction is recorded in a unified ledger for both parties.
- **Print-Optimized Receipts**: High-fidelity digital receipts with transaction IDs.

---

## 4. Proposed Future Roadmap (Next Phases)

### Phase 1: UX Polish & Asset Management
- **Rich Media Uploads**: Implement actual file uploads for property images (transitioning away from external Unsplash URLs).
- **User Profiles**: Interactive profile settings including avatar uploads and phone number verification.
- **Verification Badges**: Add "Verified" status for properties/users to increase trust.

### Phase 2: Analytics & Reporting
- **In-App Analytics**: Charts (Recharts) showing monthly income trends and occupancy rates for owners.
- **PDF Generation**: Real server-side PDF generation for receipts and lease agreements.
- **Financial Export**: Export income ledgers to CSV or Excel.

### Phase 3: Advanced Automation & Scale
- **Google Calendar Integration**: Sync property viewings-appointments with user calendars.
- **Email/SMS Service Integration**: Move from console-logged notifications to actual SendGrid/Twilio integration.
- **Global Search Optimization**: Full-text search implementation for scaling to thousands of listings.

---

## 5. Test Credentials Dictionary
*Standard dev accounts for rapid local testing.*
- **Universal Account**: `owner@test.com` / `password123` (Can switch roles via UI)
- **Alt Account**: `tenant_real@test.com` / `password123`
