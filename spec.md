# RentWise Unified Architecture Specification (spec.md)

This document serves as the "Ground Truth" for all development on the RentWise platform. It ensures consistency, scalability, and developer sanity.

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

---

## ⚛️ Frontend: Feature-Based Slicing (FBS)
The project is organized by business domains to prevent the "folder-by-type" anti-pattern.

### 🏠 Features (`src/features/`)
Self-contained modules representing a single business domain (e.g., `messaging`, `auth`).
- `components/`: UI components exclusive to this feature.
- `hooks/`: Domain-specific state management (e.g., `useConversations`).
- `services/`: API wrapper functions for this domain.
- `context/`: (Optional) Feature-specific contexts (e.g., `AuthContext`).
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

---

## 🏎️ Execution Workflow
When adding a new feature:

**1. Backend Development**
- Define the **Model** & **Schema**.
- Implement the **Repository** for data access.
- Implement the **Service** for logic.
- Expose via the **Router**.

**2. Frontend Development**
- Implement the **Service** (API match).
- Create the **Hook** (React State wrapper).
- Build the **Components** (UI).

---
*Failure to follow these standards will result in broken builds and awkward PR reviews.*