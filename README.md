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
1. Clone the repository
2. Run `docker-compose up` for local development
3. Access dashboard at `http://localhost:3000`
4. API available at `http://localhost:5000`