# ✅ Deployment Checklist

## Pre-Deployment Setup

### 📋 **Required Information**
Gather these before starting:

- [ ] Supabase Project URL: `https://your-project.supabase.co`
- [ ] Supabase Anon Key: `eyJ...`
- [ ] Supabase Service Role Key: `eyJ...`
- [ ] GitHub repository URL

### 🔧 **Local Testing**
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] Backend builds successfully (`cd backend && npm run build`)
- [ ] All environment variables are documented
- [ ] Amharic export functionality works

## 🚀 **Backend Deployment (Render)**

### Setup
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service

### Configuration
- [ ] **Name**: `csat-backend`
- [ ] **Environment**: Node
- [ ] **Build Command**: `cd backend && npm install && npm run build`
- [ ] **Start Command**: `cd backend && npm start`

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `SUPABASE_URL=your_supabase_project_url`
- [ ] `SUPABASE_ANON_KEY=your_supabase_anon_key`
- [ ] `SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key`
- [ ] `CORS_ORIGIN=https://your-frontend-domain.vercel.app` (update after frontend deployment)

### Testing
- [ ] Deployment successful
- [ ] Health check works: `https://your-backend.onrender.com/api/health`
- [ ] Note backend URL for frontend configuration

## 🎨 **Frontend Deployment (Vercel)**

### Setup
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure project settings

### Configuration
- [ ] **Framework**: Vite
- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: `npm install`

### Environment Variables
- [ ] `VITE_SUPABASE_URL=your_supabase_project_url`
- [ ] `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
- [ ] `VITE_API_BASE_URL=https://your-backend.onrender.com/api`
- [ ] `VITE_APP_NAME=Customer Satisfaction Survey`
- [ ] `VITE_APP_VERSION=1.0.0`

### Testing
- [ ] Deployment successful
- [ ] Application loads: `https://your-frontend.vercel.app`
- [ ] Note frontend URL for backend CORS configuration

## 🔄 **Post-Deployment Configuration**

### Update Backend CORS
- [ ] Go to Render dashboard
- [ ] Update `CORS_ORIGIN` environment variable with actual frontend URL
- [ ] Redeploy backend service

### Update Supabase Settings
- [ ] Go to Supabase project dashboard
- [ ] Settings → API → Site URL
- [ ] Add frontend URL: `https://your-frontend.vercel.app`

## 🧪 **Final Testing**

### Core Functionality
- [ ] Survey form loads and submits successfully
- [ ] Admin dashboard displays data correctly
- [ ] Language switching (English ↔ Amharic) works
- [ ] Data export functionality works
- [ ] Amharic text displays correctly in exports

### Performance
- [ ] Frontend loads quickly
- [ ] API responses are fast
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

### Security
- [ ] HTTPS is enforced (automatic)
- [ ] Environment variables are secure
- [ ] No sensitive data in client-side code
- [ ] CORS is properly configured

## 📊 **Monitoring Setup**

### Render Monitoring
- [ ] Check deployment logs
- [ ] Set up log alerts (optional)
- [ ] Monitor resource usage

### Vercel Monitoring
- [ ] Check function logs
- [ ] Monitor performance metrics
- [ ] Set up error tracking (optional)

## 🎉 **Deployment Complete!**

### URLs
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/api/health`

### Next Steps
- [ ] Share URLs with stakeholders
- [ ] Document any custom configurations
- [ ] Set up monitoring/alerts
- [ ] Plan for future updates

## 🔧 **Troubleshooting**

### Common Issues
- **Build Failures**: Check package.json scripts and dependencies
- **Environment Variables**: Ensure all required vars are set
- **CORS Errors**: Verify CORS_ORIGIN matches frontend URL exactly
- **API Errors**: Check backend logs in Render dashboard
- **Font Issues**: Verify Amharic fonts are loading correctly

### Quick Fixes
- **Redeploy**: Both platforms support manual redeployment
- **Logs**: Check deployment logs for specific error messages
- **Environment**: Double-check all environment variable names and values

---

**🎊 Congratulations! Your Customer Satisfaction Survey application is now live in production!**