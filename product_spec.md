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
- **Dual-Mode Identity**: Every user account has both **Tenant** and **Owner** capabilities enabled by default.
- **Google Social Login**: Integrated Google One Tap and button authentication for seamless onboarding.
- **Toggle System**: A global switcher allows users to flip between **"Renting"** and **"Hosting"** modes instantly, changing the dashboard and messaging context.
- **Smart Validation**: In-depth backend verification of email existence and password strength.

### 🏠 Property Discovery
- **Dedicated "How It Works"**: A high-fidelity, multi-step guide explaining the platform journey for both parties.
- **Responsive Discovery**: Masonry grid with modern property cards and parent-controlled width constraints.
- **Real-time Search**: Refined search and filter logic (City, Area, Price, Keywords) with a flexible, global SearchBar.
- **Detail View**: Full-screen property details with image carousels and instant "Rent Now" applications.

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

### ✅ Completed: Foundation, Phase 1 & 2
- **Robust Exception System**: Custom domain exceptions with global backend handlers.
- **Global Alert System**: Premium toast notification system (`AlertProvider`).
- **Financial Dashboard**: Interactive charts (Recharts) for income tracking.
- **Dual-Mode Identity**: Single-account architecture with instant mode switching.
- **Cloud Infrastructure (V2.0)**: Fully automated CI/CD pipeline on Google Cloud Run.
- **Production Persistence**: Supabase PostgreSQL with session pooling.

### 🚀 Phase 3: Automation & Future Scale (Current)
- **Cloud Asset Management**: Integration of Google Cloud Storage (GCS) for production media.
- **Real Notifications**: Integration with SendGrid (Email) and Twilio (SMS) for automated alerts.
- **Advanced Search**: Map-based discovery (Leaflet/Mapbox) for local areas.
- **Calendar Integration**: Google Calendar sync for property viewings and payment reminders.

---

## 5. Technical Standards (Ground Truth)
- **Backend**: FastAPI | SQLAlchemy 2.0 | PostgreSQL | Pydantic v2.
- **Frontend**: React | Vite | Tailwind CSS v4 (Production Nginx) | Context API.
- **Cloud**: Google Cloud Run | Cloud Build | GCS | Supabase.
- **API**: Domain-Driven exceptions (`NotFoundException`, `ForbiddenException`).
- **Files**: Modular storage provider (`LocalStorage` -> `CloudStorage`).

---

## 6. Deployment Endpoints
- **Frontend**: [https://rentwise-frontend-724618883283.asia-northeast1.run.app](https://rentwise-frontend-724618883283.asia-northeast1.run.app)
- **Backend**: [https://rentwise-api-724618883283.asia-northeast1.run.app](https://rentwise-api-724618883283.asia-northeast1.run.app)

---

## 7. Test Credentials Dictionary
*Standard dev accounts for rapid local testing.*
- **Universal Account**: `owner@test.com` / `password123`
- **Alt Account**: `tenant_real@test.com` / `password123`

