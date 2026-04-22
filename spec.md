# RentWise Unified Architecture Specification (spec.md)

This document serves as the "Ground Truth" for all development on the RentWise platform. It ensures consistency, scalability, and developer sanity.

### 📜 Documentation Integrity
1. **Spec-First Development:** The `spec.md` is the source of truth. Any change to architecture, dependencies, or project structure MUST be reflected here immediately.
2. **Agent Responsibility:** AI Agents are required to update this document whenever they introduce a legacy technology, a new dependency, or restructure a module.

## ☁️ Cloud Infrastructure & Hosting
RentWise is designed for cloud-native scalability using Google Cloud Platform (GCP).

### 🚀 Compute & Hosting
- **Backend (API):** Deployed on **Google Cloud Run**. Containerized via `api/Dockerfile`.
- **Frontend (UI):** Deployed on **Google Cloud Run**. Containerized via `frontend/Dockerfile` using an Nginx multi-stage build.

### 🗄️ Persistence & Storage
- **Database:** Managed **Supabase PostgreSQL**. 
    - **Connection Strategy:** Use the **Supabase Session Pooler** (`aws-1-...pooler.supabase.com:5432`) for IPv4 compatibility and connection resilience.
- **File Storage:** **Google Cloud Storage (GCS)**.
    - **Implementation:** Abstracted via `app.utils.storage.CloudStorage`.
    - **Credentials:** Uses Cloud Run's Service Account Identity (no manual keys in production).

### ⚙️ Production Environment Variables
To maintain security and flexibility, environment variables are managed at runtime.
- **Frontend Strategy:** Uses a **Placeholder Replacement Strategy**.
    - JS files are built with `VITE_API_URL_PLACEHOLDER`.
    - At container startup, `sed` replaces these with real values from Cloud Run.
- **Key Variables:**
    - `DATABASE_URL`: Full PostgreSQL connection string.
    - `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs.
    - `VITE_API_URL`: URL of the deployed API service.
    - `VITE_GOOGLE_CLIENT_ID`: Google OAuth 2.0 Client ID.

---

## 🐍 Backend: Layered & Shared Standards
Every module in `api/app/modules/` MUST adhere to the **Router -> Service -> Repository** hierarchy. Global reusable logic is partitioned by its role:

### 🏠 Domain Modules (`app/modules/`)
Vertical slices of business logic (e.g., `payments`, `tickets`).

### ⚙️ Core Infrastructure (`app/core/`)
Cross-cutting infrastructure services.
- **WebSocket:** Connection and broadcasting manager.
- **Security:** JWT, Hashing, and Authentication logic.
- **Communication:** Email/SMS templates and configurations.

### 🛠️ Common Utilities (`app/utils/`)
Pure, stateless helper functions (e.g., `date_formatters`, `uuid_helpers`).

### 🗄️ Persistence Foundation (`app/persistence/`)
Shared persistence logic and session management.
- **Base Model:** Shared SQLAlchemy columns (ID, Timestamps).
- **Base Repository:** Generic CRUD operations (Get, Create, Update, Delete).
- **Migrations:** Alembic is used for all schema changes. Direct `metadata.create_all()` calls are forbidden.

---

## 🏗️ Backend Layers Detail
| Layer | File | Responsibility | Allowed Imports |
| :--- | :--- | :--- | :--- |
| **Router** | `router.py` | FastAPI entry point, dependency injection (`get_db`), input validation (Pydantic), and HTTP response status mapping. | Services, Schemas, Auth Deps (app.persistence). |
| **Service** | `service.py` | **The Brain.** Business logic, authorization, permission checks, orchestration, and inter-repository calls. | Repositories, Other Services, Models. |
| **Repository** | `repository.py` | Pure Data Persistence. Raw SQLAlchemy queries. CRUD operations. No business logic. | Models, DB Session (app.persistence). |
| **Model** | `model.py` | Declarative SQLAlchemy Table definitions. | - |
| **Schema** | `schemas.py` | Pydantic Request/Response models. | - |

### 🛠️ Backend Rules of Engagement
1. **No Logic in Routers:** Routers must only call service methods and handle high-level exceptions.
2. **Permission Checks in Services:** Always verify "Can user X perform action Y on resource Z?" inside the Service layer.
3. **Repository Purity:** Repositories should not know about "Users" or "Permissions"—they just know about "Data".
4. **Error Handling:** Services should raise standard Python exceptions (e.g., `ValueError`, `PermissionError`). Routers translate these to `HTTPException`.
5. **Migrations First:** Never manually modify the database schema. Always generate an Alembic revision for any Model changes.

---

## ⚛️ Frontend: Feature-Based Slicing (FBS)
The project is organized by business domains to prevent the "folder-by-type" anti-pattern.

### 🏠 Features (`src/features/`)
Self-contained modules representing a single business domain (e.g., `messaging`, `auth`).
- `components/`: UI components exclusive to this feature.
- `hooks/`: Domain-specific state management (e.g., `useConversations`).
- `services/`: API wrapper functions for this domain.
- `context/`: Feature-wide shared state. For example, `ChatContext` handles the entire messaging ecosystem (inbox, unread counts, and active chat).
- `utils/`: Logic or formatters specific to this domain.

### 🌐 Shared (`src/shared/`)
Global assets used by two or more features.
- `components/`: Generic UI units (Cards, Inputs, Modals, Navbar).
- `hooks/`: Utility hooks (WebSockets, Notifications, UI helpers).
- `services/`: Global API configurations and base services.
- `context/`: App-wide providers (Theme, Global WebSocket, Global Notifications).

### ⚙️ Core (`src/core/`)
Singletons and project-level bootstrapping (API client configuration, Global Router).

## 🗃️ Frontend: Unified Export Standard
To prevent "SyntaxError: Missing export" and ensure predictable imports, all frontend modules MUST follow these export rules:

### 1. Named Singleton Exports (Services & Hooks)
Services and Hooks must primarily use **Named Exports**. This provides strict naming and better IDE support.
- **Service Pattern:** `export const myService = new MyService();`
- **Hook Pattern:** `export const useMyHook = () => { ... };`
*Note: Default exports are allowed only as fallback secondary exports.*

### 2. Barrel Policy (`index.js`)
Every feature and shared directory MUST contain an `index.js` file that acts as the "Public API" for that module.
- **Rule:** Hooks, Services, and Main Components must be re-exported through the feature's `index.js`.
- **Usage:** Developers/Agents should import from the feature root (e.g., `import { requestsService } from '@/features/requests'`) rather than deep-nesting.

## 🔒 Security & Identity
- **Dual-Mode Identity**: RentWise follows an Airbnb-style identity model. Every user account has both `is_owner` and `is_tenant` capabilities.
- **Active Role State**: The frontend manages an `activeRole` (persisted in local storage) to toggle between Tenant and Owner dashboards without logging out.
- **Role-Based Access Control (RBAC)**: Backend endpoints verify permissions based on the user's boolean flags (`is_owner`/`is_tenant`).
- **Social Integration (Google)**: 
    - Google One Tap and standard login are supported.
    - **Origin Rule**: All frontend URLs (e.g., `http://localhost:5173`) MUST be added to the Google Cloud Console's "Authorized JavaScript origins."
    - **Auto-Provisioning**: Google logins automatically provision dual-mode accounts with `is_owner=True` and `is_tenant=True`.

---

## 🏎️ Execution Workflow
When adding a new feature:

**1. Backend Development**
- Define the **Model** & **Schema**.
- **Migrations:** Run `alembic revision --autogenerate -m "description"` to detect changes.
- **Upgrade:** Apply changes using `alembic upgrade head`.
- Implement the **Repository** for data access.
- Implement the **Service** for logic.
- Expose via the **Router**.

**2. Frontend Development**
- Implement the **Service** (API match).
- Create the **Hook** (React State wrapper).
- Build the **Components** (UI).

---
*Failure to follow these standards will result in broken builds and awkward PR reviews.*