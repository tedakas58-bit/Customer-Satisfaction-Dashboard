# 🚀 Deployment Instructions

Deploy your Customer Satisfaction Survey application to production using Vercel (frontend) and Render (backend).

## 📋 Prerequisites

- GitHub repository with your code
- Supabase project set up
- Vercel account
- Render account

## 🎯 **Step 1: Deploy Backend to Render**

### 1.1 Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```yaml
Name: csat-backend
Environment: Node
Region: Choose closest to your users
Branch: main (or your main branch)
Build Command: cd backend && npm install && npm run build
Start Command: cd backend && npm start
```

### 1.2 Set Environment Variables

In Render dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=10000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 1.3 Get Backend URL

After deployment, note your backend URL:
```
https://your-app-name.onrender.com
```

## 🎯 **Step 2: Deploy Frontend to Vercel**

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:

```yaml
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.2 Set Environment Variables

In Vercel dashboard, add these environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://your-backend-app.onrender.com/api
VITE_APP_NAME=Customer Satisfaction Survey
VITE_APP_VERSION=1.0.0
```

### 2.3 Update CORS in Backend

After frontend deployment, update the `CORS_ORIGIN` environment variable in Render:

```bash
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## 🎯 **Step 3: Configure Supabase**

### 3.1 Update Supabase Settings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Add your frontend domain to **Site URL**:
   ```
   https://your-frontend-domain.vercel.app
   ```

### 3.2 Update RLS Policies (if needed)

If you have Row Level Security enabled, ensure your policies allow access from the production domains.

## 🎯 **Step 4: Test Deployment**

### 4.1 Health Checks

1. **Backend Health**: Visit `https://your-backend-app.onrender.com/api/health`
2. **Frontend**: Visit `https://your-frontend-domain.vercel.app`

### 4.2 Test Core Features

- [ ] Survey form submission
- [ ] Admin dashboard access
- [ ] Data export functionality
- [ ] Amharic text display
- [ ] Language switching

## 🔧 **Troubleshooting**

### Common Issues

#### Backend Issues
```bash
# Check Render logs
# Go to Render Dashboard → Your Service → Logs

# Common fixes:
# 1. Ensure all environment variables are set
# 2. Check build command includes 'cd backend'
# 3. Verify start command is correct
```

#### Frontend Issues
```bash
# Check Vercel deployment logs
# Go to Vercel Dashboard → Your Project → Deployments

# Common fixes:
# 1. Ensure build command is 'npm run build'
# 2. Check environment variables are prefixed with VITE_
# 3. Verify API_BASE_URL points to Render backend
```

#### CORS Issues
```bash
# Update backend CORS_ORIGIN to match frontend domain
CORS_ORIGIN=https://your-actual-frontend-domain.vercel.app
```

## 📊 **Environment Variables Summary**

### Backend (Render)
```bash
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=Customer Satisfaction Survey
VITE_APP_VERSION=1.0.0
```

## 🎉 **Success!**

Your application should now be live at:
- **Frontend**: `https://your-frontend-domain.vercel.app`
- **Backend**: `https://your-backend-app.onrender.com`

## 🔄 **Continuous Deployment**

Both Vercel and Render will automatically redeploy when you push changes to your main branch.

### Manual Redeployment
- **Vercel**: Go to Deployments → Redeploy
- **Render**: Go to your service → Manual Deploy

## 📈 **Monitoring**

### Render Monitoring
- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring
- View deployment logs
- Monitor function execution
- Check performance metrics

## 🔐 **Security Checklist**

- [ ] Environment variables are set correctly
- [ ] Supabase RLS policies are configured
- [ ] CORS is properly configured
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced (automatic on both platforms)

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs
3. Verify environment variables
4. Test locally first

Your Customer Satisfaction Survey application is now ready for production use! 🎊