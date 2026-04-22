# RentWise - Property Management Platform
**A full-stack rental ecosystem with automated ledgers and visual discovery.**

## 🤖 Agentic Directions
If you are an AI assistant or human developer working on this repository, **you MUST follow the architectural standards defined in [spec.md](./spec.md).**
- **Architecture:** Layered Backend (Router/Service/Repository) + Feature-Based Frontend (FBS).
- **Shared Logic:** Use `api/app/db/base_repo.py` for backend CRUD and `frontend/src/shared` for frontend reusability.
- **Consistency:** Any new module MUST adhere to the layers defined in the specification.

---

## 🚀 Quick Start (Docker - Recommended)
The fastest way to run the entire stack (Backend, Frontend, and Database) is using Docker Compose.

1. **Ensure Docker Desktop is running.**
2. **Launch the stack:**
   ```bash
   docker-compose up -d --build
   ```
3. **Access the platform:**
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   - **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠 Tech Stack
* **Frontend**: React + Vite (Production-optimized Nginx)
* **Backend**: FastAPI (Python 3.12)
* **Database**: Supabase (Cloud PostgreSQL)
* **Storage**: Google Cloud Storage (GCS)
* **Infrastructure**: Google Cloud Run (Serverless)
* **CI/CD**: GitHub Actions + Cloud Build

---

## 🚀 Deployment Status
The platform is fully automated via CI/CD. Pushing to the `main` branch triggers an automatic build and deployment to Google Cloud.

- **Production Frontend**: [https://rentwise-frontend-724618883283.asia-northeast1.run.app](https://rentwise-frontend-724618883283.asia-northeast1.run.app)
- **Production API**: [https://rentwise-api-724618883283.asia-northeast1.run.app/docs](https://rentwise-api-724618883283.asia-northeast1.run.app/docs)

---

## ✨ Key Features (V2.0 - Cloud Native)
* **Cloud Infrastructure**: Scalable backend and frontend services running on Google Cloud Run.
* **Persistent Storage**: Media assets are stored in Google Cloud Storage buckets for infinite scalability.
* **Production Database**: Managed Supabase PostgreSQL with IPv4-compatible session pooling.
* **Visual Discovery**: Property listings with high-res image galleries.
* **Smart Search**: Real-time filtering by keyword, city, and area.
* **Advanced Dashboards**: Distinct, data-driven experiences for Owners and Tenants.

---

## ⚙️ Development Setup (Local)
For local development, you can still use Docker Compose or manual setup.

### Quick Start (Docker)
1. Ensure Docker is running.
2. Run: `docker-compose up -d --build`
3. Access at `http://localhost:5173`.

---

## 🔒 Security
- **Google OAuth 2.0**: Integrated secure login for a seamless user experience.
- **JWT Authentication**: Secure token-based access control for all internal API routes.
- **Role-based RBAC**: Strictly partitioned features for `OWNER` and `TENANT` roles.
