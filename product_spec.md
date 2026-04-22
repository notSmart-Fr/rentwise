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

## 4. Implementation Status & Roadmap

### ✅ Completed: Foundation & Phase 1
- **Robust Exception System**: Custom domain exceptions with a global backend handler and frontend interceptor.
- **Global Alert System**: Premium toast notification system (`AlertProvider`) integrated with the API client.
- **User Profiles**: Profile settings page with phone verification and name updates.
- **Media Engine (v1)**: Local storage provider for multi-file property uploads and user avatars.
- **Universal Accounts**: Single-account dual-role (Owner/Tenant) logic with mode switching.
- **Messaging & Ledgers**: Core real-time chat and simulated payment ledger.

### 🚀 Phase 2: Analytics & Reporting (Current)
- **Financial Dashboard**: Interactive charts (Recharts) for owners to track monthly income and occupancy rates.
- **Automated Receipts**: Server-side PDF generation for digital payment receipts.
- **Data Export**: Export payment ledgers and maintenance logs to CSV/Excel for accounting.
- **Verification Badges (Advanced)**: Implement a "Verify Identity" flow (simulated) to unlock "Verified" badges for properties.

### 🏗️ Phase 3: Automation & Cloud Scale
- **Cloud Asset Management**: Transition from Local Storage to Cloudinary/S3 for production scalability.
- **Real Notifications**: Integration with SendGrid (Email) and Twilio (SMS) for automated alerts.
- **Advanced Search**: PostgreSQL full-text search implementation and Map-based discovery (Leaflet/Mapbox).
- **Calendar Integration**: Google Calendar sync for property viewings and payment reminders.

---

## 5. Technical Standards (Ground Truth)
- **Backend**: FastAPI | SQLAlchemy 2.0 | PostgreSQL | Pydantic v2.
- **Frontend**: React | Vite | Tailwind CSS v4 (Glassmorphism) | Context API.
- **API**: Domain-Driven exceptions (`NotFoundException`, `ForbiddenException`).
- **Files**: Modular storage provider (`LocalStorage` -> `StorageProvider` interface).

---

## 6. Test Credentials Dictionary
*Standard dev accounts for rapid local testing.*
- **Universal Account**: `owner@test.com` / `password123`
- **Alt Account**: `tenant_real@test.com` / `password123`

