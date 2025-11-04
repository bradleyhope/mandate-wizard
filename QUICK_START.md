# Quick Start - Railway Deployment

## ✅ Repository Ready

Your monorepo has been created and pushed to GitHub:
**https://github.com/bradleyhope/mandate-wizard**

## 🚀 Deploy in 3 Steps

### Step 1: Deploy Backend Service

1. Go to **[railway.app](https://railway.app)** and login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select: **`bradleyhope/mandate-wizard`**
4. Railway will create a project
5. Click **"Add Service"** or configure the auto-detected service
6. **Important**: Set **Root Directory** to `backend`
7. Add these environment variables:
   ```
   PINECONE_API_KEY=<your-key>
   PINECONE_INDEX_NAME=netflix-mandate-wizard
   NEO4J_URI=<your-uri>
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=<your-password>
   ```
8. Deploy and copy the backend URL

### Step 2: Deploy Frontend Service

1. In the same Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"** → **`bradleyhope/mandate-wizard`**
3. **Important**: Set **Root Directory** to `frontend`
4. Add these environment variables:
   ```
   VITE_API_URL=<backend-url-from-step-1>
   NODE_ENV=production
   ```
5. Deploy and copy the frontend URL

### Step 3: Update Backend CORS

1. Go back to **backend service**
2. Add environment variable:
   ```
   FRONTEND_URL=<frontend-url-from-step-2>
   ```
3. Service will auto-redeploy

## ✅ Done!

Visit your frontend URL to use the application.

## 📚 Need Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

## 🔑 Environment Variables Summary

**Backend (7 variables):**
- `PINECONE_API_KEY` ✅ Required
- `PINECONE_INDEX_NAME` (default: netflix-mandate-wizard)
- `NEO4J_URI` ✅ Required
- `NEO4J_USER` (default: neo4j)
- `NEO4J_PASSWORD` ✅ Required
- `FRONTEND_URL` ✅ Required (add after frontend deployment)
- `PRODUCTION_DOMAIN` (optional)

**Frontend (2 variables):**
- `VITE_API_URL` ✅ Required (backend URL)
- `NODE_ENV=production` ✅ Required

## 🎯 Critical Settings

**For Backend Service:**
- Root Directory: `backend`
- Builder: NIXPACKS (auto-detected)

**For Frontend Service:**
- Root Directory: `frontend`
- Builder: NIXPACKS (auto-detected)

## 🔍 Verification

After deployment, check:
- [ ] Backend logs show "Mandate Wizard ready!"
- [ ] Frontend loads without errors
- [ ] No CORS errors in browser console
- [ ] Can login and submit queries

## 🆘 Troubleshooting

**Backend won't start:**
- Check all environment variables are set
- Verify database credentials
- Check Railway logs for errors

**Frontend can't connect:**
- Verify `VITE_API_URL` matches backend URL
- Check backend has `FRONTEND_URL` set
- Look for CORS errors in browser console

**Still stuck?**
See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
