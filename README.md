# AJTraders Grocery Store Website

A full-stack e-commerce website built with React.js, Node.js, Express, and SQLite3. Features a customized dark theme, WhatsApp checkout integration, and an admin dashboard for product and order management.

## Project Structure
- `/frontend` - React.js (Vite) frontend with Tailwind CSS
- `/backend` - Node.js + Express backend with SQLite3

## Prerequisites
- Node.js v16+
- npm

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Allow pending sqlite3 script if needed (npm approve-scripts)
# Initialize the database (Seeds 10 products + Users + Categories)
node initDb.js
# Start the development server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Copy `.env.example` to `.env` in both `frontend` and `backend` directories. The default values work out of the box for local development.

### Test Credentials
**Admin User**
- Email: `admin@ajtraders.pk`
- Password: `admin123`

**Customer User**
- Email: `customer@ajtraders.pk`
- Password: `customer123`

## Known Issues / What's not done
- Product images currently use placeholders (upload integration not part of Phase 1 MVP)
- Multi-location/analytics/loyalty features skipped as requested for Phase 1.
