# 🚀 LearnHub LMS — Complete Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas)
4. [Deploy Backend to Render](#deploy-backend)
5. [Deploy Frontend to Vercel](#deploy-frontend)
6. [Connect Frontend to Backend](#connect)
7. [Create Admin Account](#admin)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Install these tools before starting:

| Tool | Download Link |
|------|--------------|
| Node.js (v18+) | https://nodejs.org |
| Git | https://git-scm.com |
| VS Code | https://code.visualstudio.com |

Verify installation:
```bash
node --version    # should show v18+
npm --version     # should show 9+
git --version
```

---

## 2. Local Setup

### Step 1 — Install dependencies
```bash
# Open terminal in project root folder
cd backend
npm install

cd ../frontend
npm install
```

### Step 2 — Configure backend `.env`
Open `backend/.env` and fill in your values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lms_db?retryWrites=true&w=majority
JWT_SECRET=pick_a_long_random_string_here_32chars
NODE_ENV=development
```

### Step 3 — Run locally
Open **two terminals**:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## 3. MongoDB Atlas Setup

1. Go to **https://cloud.mongodb.com** and create a free account
2. Click **"Build a Database"** → Choose **Free M0 tier**
3. Choose a cloud provider (AWS) and region closest to you
4. Set **Username** and **Password** (save these!)
5. Under **Network Access** → Click **"Add IP Address"** → Select **"Allow Access from Anywhere"** (`0.0.0.0/0`)
6. Under **Database** → Click **Connect** → **Connect your application**
7. Copy the connection string — it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Add your database name: replace `?retryWrites` with `/lms_db?retryWrites`
9. Paste it as `MONGO_URI` in `backend/.env`

---

## 4. Deploy Backend to Render (Free)

### Step 1 — Push to GitHub
```bash
# In project root
git init
git add .
git commit -m "Initial commit - LMS project"

# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/lms-project.git
git push -u origin main
```

### Step 2 — Deploy on Render
1. Go to **https://render.com** → Sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your **GitHub** account and select your repo
4. Configure:
   - **Name:** `learnhub-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
5. Under **Environment Variables**, add:
   ```
   MONGO_URI = your_mongodb_atlas_uri
   JWT_SECRET = your_secret_key
   NODE_ENV = production
   PORT = 5000
   ```
6. Click **"Create Web Service"**
7. Wait 2-3 minutes — your backend URL will be:
   `https://learnhub-backend.onrender.com`

---

## 5. Deploy Frontend to Vercel (Free)

### Step 1 — Update API URL
Before deploying, update `frontend/src/services/api.js`:

Change:
```js
const API = axios.create({ baseURL: '/api' });
```
To:
```js
const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || '/api' 
});
```

### Step 2 — Deploy on Vercel
1. Go to **https://vercel.com** → Sign up with GitHub (free)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
5. Under **Environment Variables**, add:
   ```
   REACT_APP_API_URL = https://learnhub-backend.onrender.com/api
   ```
6. Click **"Deploy"**
7. Your app will be live at: `https://learnhub.vercel.app`

---

## 6. Connect Frontend to Backend

After deploying both:

1. Go to **Render dashboard** → Your backend service → **Environment**
2. Add CORS environment variable if needed:
   ```
   FRONTEND_URL = https://learnhub.vercel.app
   ```
3. Update `backend/server.js` CORS:
   ```js
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true
   }));
   ```
4. Redeploy backend on Render.

---

## 7. Create Admin Account

After deployment, seed an admin via MongoDB Atlas:

1. Go to **MongoDB Atlas** → Browse Collections → `users` collection
2. Click **"Insert Document"** with:
   ```json
   {
     "name": "Admin User",
     "email": "admin@lms.com",
     "password": "$2a$12$HASHED_PASSWORD",
     "role": "admin"
   }
   ```

> **Easier way:** Register normally then change role in Atlas UI from `student` → `admin`.

---

## 8. Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot connect to MongoDB` | Check MONGO_URI is correct, IP whitelist is `0.0.0.0/0` |
| `JWT error` | Make sure JWT_SECRET is same in .env |
| `CORS error` | Add your Vercel URL to backend CORS config |
| `Render goes to sleep` | Free tier sleeps after 15 min inactivity — first request may be slow |
| `npm install fails` | Delete `node_modules` and `package-lock.json`, then retry |
| `Frontend blank page` | Check browser console for errors, verify REACT_APP_API_URL |

---

## 📁 Project Structure Summary

```
Learning management system/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & role guards
│   ├── .env               # Environment variables ⚠️ never commit
│   └── server.js          # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/    # Reusable components
│       ├── context/       # Auth context
│       ├── pages/         # All page components
│       │   ├── student/
│       │   ├── instructor/
│       │   └── admin/
│       ├── services/      # API calls (axios)
│       └── App.js         # Routes
│
├── .gitignore
├── package.json
└── DEPLOYMENT.md          # This file
```

---

## 🎉 You're Done!

Your LMS is now live with:
- ✅ Student registration & course enrollment
- ✅ Instructor course creation & lesson management  
- ✅ Admin user & course management with analytics
- ✅ JWT authentication with role-based access
- ✅ MongoDB Atlas cloud database

**Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`
