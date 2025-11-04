# Railway Deployment Guide - Mandate Wizard Monorepo

## Overview

This monorepo contains both the backend (Python Flask) and frontend (React + Vite) for the Mandate Wizard application. Railway will deploy them as two separate services from the same repository.

## Repository Structure

```
mandate-wizard/
├── backend/              # Python Flask API
│   ├── app.py
│   ├── requirements.txt
│   ├── gunicorn_config.py
│   ├── railway.json
│   ├── railway.toml
│   └── nixpacks.toml
├── frontend/             # React frontend
│   ├── client/
│   ├── server/
│   ├── package.json
│   ├── railway.json
│   └── railway.toml
└── DEPLOYMENT_GUIDE.md
```

## Deployment Steps

### Step 1: Push Monorepo to GitHub

First, create a new GitHub repository or use an existing one:

```bash
# If creating a new repo, go to GitHub and create it first
# Then push the monorepo

cd /path/to/mandate-wizard-monorepo
git add .
git commit -m "Initial monorepo setup"
git remote add origin https://github.com/bradleyhope/mandate-wizard.git
git push -u origin master
```

### Step 2: Deploy Backend Service

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your monorepo: `bradleyhope/mandate-wizard`
4. Railway will detect it's a monorepo
5. Click **"Add Service"**
6. Configure the service:
   - **Service Name**: `mandate-wizard-backend`
   - **Root Directory**: `backend`
   - Railway will auto-detect Python and use the backend configuration

7. Add environment variables:
   ```
   PINECONE_API_KEY=<your-pinecone-key>
   PINECONE_INDEX_NAME=netflix-mandate-wizard
   NEO4J_URI=<your-neo4j-uri>
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=<your-neo4j-password>
   ```

8. Deploy and wait for completion
9. **Copy the backend URL** (e.g., `https://mandate-wizard-backend-production.up.railway.app`)

### Step 3: Deploy Frontend Service

1. In the same Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"**
3. Select the same repo: `bradleyhope/mandate-wizard`
4. Configure the service:
   - **Service Name**: `mandate-wizard-frontend`
   - **Root Directory**: `frontend`
   - Railway will auto-detect Node.js

5. Add environment variables:
   ```
   VITE_API_URL=<backend-url-from-step-2>
   NODE_ENV=production
   ```

6. Deploy and wait for completion
7. **Copy the frontend URL** (e.g., `https://mandate-wizard-frontend-production.up.railway.app`)

### Step 4: Update Backend CORS

1. Go back to the **backend service** in Railway
2. Add/update environment variable:
   ```
   FRONTEND_URL=<frontend-url-from-step-3>
   ```
3. The service will automatically redeploy

## Railway Service Configuration

### Backend Service Settings

**Root Directory**: `backend`

**Environment Variables**:
| Variable | Required | Example |
|----------|----------|---------|
| PINECONE_API_KEY | ✅ | `pcsk_...` |
| PINECONE_INDEX_NAME | No | `netflix-mandate-wizard` |
| NEO4J_URI | ✅ | `neo4j+s://xxx.databases.neo4j.io` |
| NEO4J_USER | No | `neo4j` |
| NEO4J_PASSWORD | ✅ | `your-password` |
| FRONTEND_URL | ✅ | `https://your-frontend.railway.app` |
| PRODUCTION_DOMAIN | No | `mandatewizard.com` |

**Build Command**: Auto-detected by nixpacks
**Start Command**: `gunicorn --config gunicorn_config.py app:app`

### Frontend Service Settings

**Root Directory**: `frontend`

**Environment Variables**:
| Variable | Required | Example |
|----------|----------|---------|
| VITE_API_URL | ✅ | `https://your-backend.railway.app` |
| NODE_ENV | ✅ | `production` |

**Build Command**: `pnpm install && pnpm run build`
**Start Command**: `pnpm run start`

## How Railway Detects Services

Railway uses the **Root Directory** setting to determine which part of the monorepo to deploy:

- **Backend**: Points to `backend/` directory, uses Python nixpacks
- **Frontend**: Points to `frontend/` directory, uses Node.js nixpacks

Each service has its own:
- Configuration files (`railway.json`, `railway.toml`)
- Environment variables
- Build and deployment process
- Public URL

## Verification Checklist

After deployment, verify:

- [ ] Backend service is running (check Railway logs)
- [ ] Backend shows "Mandate Wizard ready!" in logs
- [ ] Frontend service is running
- [ ] Frontend is accessible at its URL
- [ ] Can load the login page
- [ ] No CORS errors in browser console
- [ ] Can authenticate
- [ ] Can submit queries and get results

## Troubleshooting

### Backend Issues

**Service won't start:**
- Check Railway logs for Python errors
- Verify all required environment variables are set
- Ensure Root Directory is set to `backend`

**Database connection errors:**
- Verify Neo4j URI format: `neo4j+s://xxx.databases.neo4j.io`
- Check Pinecone API key is valid
- Ensure databases allow Railway IP addresses

### Frontend Issues

**Build fails:**
- Check that Root Directory is set to `frontend`
- Verify `pnpm` is being used (should be auto-detected)

**Can't connect to backend:**
- Verify `VITE_API_URL` matches backend URL exactly
- Check browser console for CORS errors
- Ensure backend has `FRONTEND_URL` set correctly

**404 errors:**
- Check that the Express server is serving static files correctly
- Verify the build completed successfully

### CORS Issues

If you see CORS errors:
1. Verify `FRONTEND_URL` is set in backend environment variables
2. Ensure it matches the frontend URL exactly (including https://)
3. Check backend logs for CORS configuration
4. Redeploy backend after updating `FRONTEND_URL`

## Updating the Application

### Update Backend Code
```bash
# Make changes in backend/
git add backend/
git commit -m "Update backend"
git push
```
Railway will automatically redeploy the backend service.

### Update Frontend Code
```bash
# Make changes in frontend/
git add frontend/
git commit -m "Update frontend"
git push
```
Railway will automatically redeploy the frontend service.

### Update Both
```bash
git add .
git commit -m "Update both services"
git push
```
Railway will redeploy both services.

## Alternative: Separate Repositories

If you prefer to keep separate repositories instead of a monorepo:

1. Keep `mandate-wizard-backend` and `mandate-wizard-frontend` as separate repos
2. Deploy each as a separate Railway project
3. Set Root Directory to `.` (root) for each
4. Follow the same environment variable configuration

The monorepo approach is recommended for easier version control and coordinated deployments.

## Custom Domains

To add custom domains:

1. Go to Railway project settings
2. Select the service (backend or frontend)
3. Go to "Settings" → "Domains"
4. Add your custom domain
5. Update DNS records as instructed by Railway
6. Update environment variables to reflect new domains

## Monitoring and Logs

**View Logs:**
- Go to Railway dashboard
- Select the service
- Click "Deployments" → View logs

**Monitor Performance:**
- Railway provides metrics for CPU, memory, and network usage
- Check the "Metrics" tab for each service

## Cost Optimization

- Railway charges based on usage
- Backend uses Gunicorn with gevent workers (efficient)
- Frontend serves static files (minimal resources)
- Consider using Railway's sleep feature for development environments

## Support

For Railway-specific issues:
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)

For application issues:
- Check the application logs in Railway
- Review the code in the monorepo
- Verify environment variables are set correctly
