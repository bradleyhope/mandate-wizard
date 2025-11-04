# Mandate Wizard - Full Stack Application

A full-stack AI-powered mandate wizard application with Python Flask backend and React frontend.

## Project Structure

```
mandate-wizard/
├── backend/          # Python Flask API
│   ├── app.py
│   ├── requirements.txt
│   ├── gunicorn_config.py
│   └── railway.json
├── frontend/         # React + Vite frontend
│   ├── client/
│   ├── server/
│   ├── package.json
│   └── railway.json
└── README.md
```

## Railway Deployment

This monorepo is configured for Railway deployment with two separate services:

### Backend Service
- **Root Directory**: `backend/`
- **Start Command**: Defined in `backend/railway.json`
- **Environment Variables**: See backend deployment guide

### Frontend Service
- **Root Directory**: `frontend/`
- **Start Command**: Defined in `frontend/railway.json`
- **Environment Variables**: See frontend deployment guide

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
pnpm install
pnpm run dev
```

## Deployment Instructions

See `DEPLOYMENT_GUIDE.md` for detailed Railway deployment instructions.
