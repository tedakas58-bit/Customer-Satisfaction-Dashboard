# Deployment Guide

## Production Deployment Strategy

### Overview
The CSAT Dashboard uses a modern deployment approach with separate hosting for frontend and backend services, ensuring scalability and reliability.

### Architecture
- **Frontend**: Deployed on Vercel (CDN + Static hosting)
- **Backend**: Deployed on Render (Container-based hosting)
- **Database**: MongoDB Atlas (Cloud database)
- **Monitoring**: Sentry for error tracking, DataDog for performance

## Prerequisites

### Required Accounts
1. **Vercel Account** (for frontend deployment)
2. **Render Account** (for backend deployment)
3. **MongoDB Atlas Account** (for database hosting)
4. **GitHub Repository** (for CI/CD integration)

### Environment Variables

#### Backend Environment Variables (.env)
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/csat_dashboard

# Server Configuration
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-key

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Optional: Redis for caching
REDIS_URL=redis://username:password@host:port
```

#### Frontend Environment Variables (.env.production)
```bash
REACT_APP_API_URL=https://your-backend-api.render.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

## Step-by-Step Deployment

### 1. Database Setup (MongoDB Atlas)

#### Create MongoDB Cluster
1. Sign up for MongoDB Atlas
2. Create a new cluster (M0 free tier for development)
3. Configure network access (add your IP addresses)
4. Create database user with read/write permissions
5. Get connection string

#### Database Initialization
```javascript
// Run this script to initialize collections and indexes
use csat_dashboard;

// Create collections
db.createCollection("responses");
db.createCollection("questions");
db.createCollection("analytics");

// Create indexes for performance
db.responses.createIndex({ "demographics.gender": 1, "demographics.age": 1 });
db.responses.createIndex({ "demographics.educationLevel": 1, "submittedAt": -1 });
db.responses.createIndex({ "computed.overallScore": -1 });
db.responses.createIndex({ "submittedAt": -1 });

// Insert sample questions data
db.questions.insertMany([
  {
    questionId: "q1_facilities",
    dimension: "tangibility",
    textAmharic: "ቢሮው ዘመናዊ መሳሪያዎችና ቴክኖሎጂ አለው",
    textEnglish: "The office has modern equipment and technology",
    order: 1,
    isActive: true
  }
  // ... add all 15 questions
]);
```

### 2. Backend Deployment (Render)

#### Prepare Backend for Deployment
1. Create `Dockerfile` in backend directory:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

2. Create `render.yaml` for configuration:
```yaml
services:
  - type: web
    name: csat-backend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: csat-mongodb
          property: connectionString
```

#### Deploy to Render
1. Connect GitHub repository to Render
2. Create new Web Service
3. Configure environment variables
4. Deploy from main branch
5. Configure custom domain (optional)

### 3. Frontend Deployment (Vercel)

#### Prepare Frontend for Deployment
1. Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000
  }
})
```

2. Create `vercel.json`:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard
5. Set up custom domain (optional)

### 4. CI/CD Pipeline Setup

#### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy CSAT Dashboard

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd backend && npm ci
      
      - name: Install frontend dependencies
        run: cd frontend && npm ci
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Run frontend tests
        run: cd frontend && npm test
      
      - name: Lint code
        run: npm run lint

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Post-Deployment Configuration

### 1. Domain Setup
- Configure custom domain in Vercel dashboard
- Set up SSL certificates (automatic with Vercel)
- Configure DNS records

### 2. Monitoring Setup
```javascript
// Add to backend server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. Performance Optimization
- Enable Vercel Analytics
- Configure CDN caching headers
- Set up database connection pooling
- Implement Redis caching (optional)

### 4. Security Configuration
- Configure CORS for production domains
- Set up rate limiting
- Enable security headers
- Configure CSP (Content Security Policy)

## Maintenance & Updates

### Regular Tasks
1. **Database Backups**: Configure automated backups in MongoDB Atlas
2. **Security Updates**: Regular dependency updates
3. **Performance Monitoring**: Monitor response times and error rates
4. **Log Analysis**: Regular review of application logs

### Update Deployment
1. Push changes to main branch
2. Automatic deployment via CI/CD
3. Monitor deployment status
4. Verify functionality in production

### Rollback Procedure
1. Identify problematic deployment
2. Revert to previous Git commit
3. Redeploy via CI/CD pipeline
4. Verify system stability

## Cost Estimation

### Monthly Costs (USD)
- **Vercel Pro**: $20/month (includes analytics)
- **Render**: $7-25/month (depending on usage)
- **MongoDB Atlas**: $0-57/month (M0 free, M2 $9, M5 $57)
- **Total**: $27-102/month

### Cost Optimization
- Use free tiers for development/testing
- Monitor usage and scale appropriately
- Implement caching to reduce database queries
- Optimize bundle sizes for faster loading