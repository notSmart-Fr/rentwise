# RentWise - Property Management Platform
**A full-stack rental ecosystem with automated ledgers and visual discovery.**

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
* **Frontend**: React + Vite + Vanilla CSS (Glassmorphism UI)
* **Backend**: FastAPI (Python 3.12)
* **Database**: PostgreSQL (via Docker)
* **Auth**: JWT-based Authentication with Role-Based Access Control (RBAC)

---

## ✨ Key Features (V1.5)
* **Visual Discovery**: Property listings with high-res image galleries.
* **Smart Search**: Real-time filtering by keyword, city, and area.
* **Owner Dashboard**: 
  - Manage property listings.
  - Approve/Reject tenant lease requests.
  - **Payment Ledger**: Record manual payments and track total revenue.
* **Tenant Dashboard**: 
  - Track lease request status.
  - View digital payment receipts.

---

## ⚙️ Development Setup (Manual)
If you prefer running components separately for development:

### Backend
1. Create a venv and install dependencies: `pip install -r requirements.txt`
2. Set `JWT_SECRET` and `DATABASE_URL` in environment.
3. Run: `uvicorn app.main:app --reload`

### Frontend
1. Navigate to directory: `cd frontend`
2. Install: `npm install`
3. Run: `npm run dev`

---

## 🔒 Security
- **Role-based Authentication**: Features are strictly partitioned between `OWNER` and `TENANT` roles.
- **Invisble Verification**: Login flows automatically detect user roles for a seamless UX.
