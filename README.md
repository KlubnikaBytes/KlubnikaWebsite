# Klubnika Bytes Web Platform

Corporate website, careers portal, and internal HR/CMS management system for Klubnika Bytes.

## Project Structure

```
.
├── backend/                # Node.js + Express REST API & MongoDB models
│   ├── controllers/        # Route handlers for auth, HR, CMS, leaves, documents
│   ├── middleware/         # JWT authentication & role authorization guards
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers (public & admin endpoints)
│   ├── uploads/            # Temporary disk cache for uploaded resumes
│   ├── utils/              # Mailer utilities (Nodemailer)
│   ├── seedAdmin.js        # Initial CEO/HR account bootstrap script
│   └── server.js           # Application entry point
└── frontend/               # React + Vite SPA
    ├── public/             # Static assets & compliance badges
    └── src/
        ├── admin/          # Protected HR, Employee, CEO, and CMS portal
        ├── components/     # Landing page & shared UI components
        ├── config/         # Environment-aware API base helper
        ├── data/           # Static vertical, location, and compliance data
        ├── pages/          # Public pages (Careers, Apply, Contact, Policies, Auth)
        └── styles/         # Theme tokens & base styles
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB instance
- SMTP / Gmail credentials (for contact inquiries, OTPs, and application notifications)

## Setup & Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `backend/.env` with your MongoDB connection string, `JWT_SECRET`, and mail server credentials.

Optionally initialize default CEO and HR accounts:

```bash
node seedAdmin.js
```

Start the API server:

```bash
npm start
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Update `frontend/.env` (`VITE_API_URL=http://localhost:5000` for local development).

Start the Vite dev server:

```bash
npm run dev
```

To generate a production bundle:

```bash
npm run build
```

## Notes

- Environment files (`backend/.env`, `frontend/.env`), `node_modules/`, `frontend/dist/`, and local resume uploads under `backend/uploads/` are excluded via `.gitignore`.
- In production builds served from `klubnikabytes.com`, `frontend/src/config/api.js` resolves requests to relative `/api/...` paths handled by the reverse proxy.
