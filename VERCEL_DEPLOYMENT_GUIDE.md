# Vercel Deployment Guide - Customer Satisfaction Dashboard

## Prerequisites

Before starting, ensure you have:
- A GitHub account with your code repository
- A Vercel account (sign up at vercel.com)
- Your Supabase project URL and anon key
- Your backend API URL (if deployed separately)

## Step 1: Prepare Your Repository

### 1.1 Commit and Push Latest Changes
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify vercel.json Configuration
Your `vercel.json` should already be configured correctly:
```json
{
  "buildCommand": "npm run frontend:build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm run setup:frontend"
}
```

## Step 2: Set Up Vercel Project

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### 2.2 Import Your Project
1. Click "New Project" on your Vercel dashboard
2. Find your repository: `Customer-Satisfaction-Dashboard`
3. Click "Import"

### 2.3 Configure Project Settings
1. **Project Name**: `customer-satisfaction-dashboard` (or your preferred name)
2. **Framework Preset**: Vite (should auto-detect)
3. **Root Directory**: Leave as `.` (root)
4. **Build and Output Settings**: Should auto-populate from vercel.json

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables in Vercel
In the project configuration screen, add these environment variables:

**Required Variables:**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

**Optional Variables:**
```
VITE_APP_NAME=Customer Satisfaction Survey
VITE_APP_VERSION=1.0.0
```

### 3.2 Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy your Project URL and anon/public key
4. Paste them into Vercel environment variables

## Step 4: Deploy

### 4.1 Initial Deployment
1. Click "Deploy" in Vercel
2. Wait for the build process to complete (usually 2-5 minutes)
3. Vercel will show build logs in real-time

### 4.2 Monitor Build Process
Watch for these stages:
- ✅ Cloning repository
- ✅ Installing dependencies (`npm run setup:frontend`)
- ✅ Building application (`npm run frontend:build`)
- ✅ Deploying to CDN

## Step 5: Configure Domain and Settings

### 5.1 Custom Domain (Optional)
1. Go to your project dashboard in Vercel
2. Click "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions

### 5.2 Configure Redirects for SPA
Add this to your `vercel.json` for proper React Router handling:
```json
{
  "buildCommand": "npm run frontend:build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm run setup:frontend",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Step 6: Update Backend CORS Settings

### 6.1 Update Your Backend
If you have a separate backend, update CORS settings to allow your Vercel domain:
```javascript
// In your backend CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app',
    'https://your-custom-domain.com'
  ]
};
```

### 6.2 Update Environment Variables
Update your backend's `CORS_ORIGIN` environment variable to include your Vercel URL.

## Step 7: Test Your Deployment

### 7.1 Basic Functionality Test
1. Visit your deployed URL
2. Test role selection page
3. Try customer dashboard
4. Test admin sign-in
5. Verify survey form works

### 7.2 Database Connection Test
1. Submit a test survey response
2. Check if data appears in Supabase
3. Test admin dashboard data display

## Step 8: Set Up Automatic Deployments

### 8.1 Configure Git Integration
Vercel automatically deploys when you push to your main branch:
- Push to `main` → Production deployment
- Push to other branches → Preview deployments

### 8.2 Branch Protection (Optional)
1. Go to GitHub repository settings
2. Set up branch protection rules
3. Require pull request reviews before merging

## Troubleshooting Common Issues

### Build Failures
```bash
# If build fails, check these:
1. Environment variables are set correctly
2. All dependencies are in package.json
3. Build command works locally: npm run frontend:build
```

### Runtime Errors
```bash
# Check browser console for:
1. CORS errors (update backend settings)
2. Environment variable issues (check Vercel dashboard)
3. API connection problems (verify backend URL)
```

### Performance Issues
```bash
# Optimize bundle size:
1. Enable code splitting in Vite config
2. Lazy load routes with React.lazy()
3. Optimize images and assets
```

## Step 9: Monitor and Maintain

### 9.1 Set Up Analytics
1. Enable Vercel Analytics in project settings
2. Monitor page views and performance
3. Set up error tracking

### 9.2 Regular Updates
1. Keep dependencies updated
2. Monitor build times
3. Check for security vulnerabilities

## Environment Variables Reference

Create these in Vercel dashboard under Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Production |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Production |
| `VITE_API_BASE_URL` | Your backend API URL | Production |
| `VITE_APP_NAME` | Customer Satisfaction Survey | All |
| `VITE_APP_VERSION` | 1.0.0 | All |

## Success Checklist

- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] Application loads without errors
- [ ] Database connection works
- [ ] All routes accessible
- [ ] Forms submit correctly
- [ ] Admin dashboard displays data
- [ ] Mobile responsive design works
- [ ] Custom domain configured (if applicable)

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure backup strategies
3. Plan for scaling if needed
4. Set up staging environment
5. Document deployment process for team

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review browser console errors
3. Verify environment variables
4. Test locally first
5. Check Supabase connection

Your Customer Satisfaction Dashboard should now be live and accessible to users!