# Customer Satisfaction Data Dashboard (CSAT)

A modern full-stack web application for analyzing and visualizing Ethiopian-language customer satisfaction survey data for the Lemi Kura Sub-City Peace and Security Office.

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Material-UI (MUI) + Chart.js/React-Chartjs-2
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Deployment**: Vercel (Frontend) + Render (Backend)
- **Development**: Docker for local development

### Key Features
- Interactive dashboard with real-time data visualization
- Demographic analysis and filtering
- Service quality dimension scoring
- Multi-language support (Amharic/English)
- Responsive design for all devices

## Project Structure
```
csat-dashboard/
├── frontend/          # React application
├── backend/           # Node.js API server
├── shared/            # Shared types and utilities
├── docker-compose.yml # Local development setup
└── docs/              # Documentation
```

## Quick Start

### Local Development
1. Clone the repository
2. Run `docker-compose up` for local development
3. Access dashboard at `http://localhost:3000`
4. API available at `http://localhost:5000`

### Production Deployment
1. **Backend**: Deploy to Render using `render.yaml`
2. **Frontend**: Deploy to Vercel using `vercel.json`
3. **Database**: Uses Supabase for production data

📋 **See [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md) for detailed deployment steps**

## 🚀 Deployment

### Production URLs
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render
- **Database**: Supabase (PostgreSQL)

### Environment Variables
- **Frontend**: See `frontend/.env.example`
- **Backend**: See `backend/.env.example`

### Deployment Files
- `vercel.json` - Vercel configuration
- `render.yaml` - Render configuration
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment guide