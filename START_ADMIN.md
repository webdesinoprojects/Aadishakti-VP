# 🚀 Quick Start Guide - Aadishakti Admin Panel

## Prerequisites

- Node.js installed (v18 or higher)
- npm installed
- Backend and Admin folders in your project

## Step 1: Backend Setup (5 minutes)

### 1.1 Install Dependencies

Open a terminal and run:

```bash
cd backend
npm install
```

This will install:
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- cookie-parser (cookie handling)
- date-fns (date formatting)
- All existing dependencies

### 1.2 Generate Password Hash

```bash
node generate-password.js YourSecurePassword123
```

Copy the hashed output.

### 1.3 Create .env File

```bash
cp .env.example .env
```

Edit `.env` and update:

```env
PORT=5000
ADMIN_USERNAME=aadishakti_admin
ADMIN_PASSWORD=<paste-the-hashed-password-here>
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_EXPIRY=8h
```

### 1.4 Replace Server File

```bash
# Backup old server
mv server.js server-old-backup.js

# Use new server
mv server-new.js server.js
```

### 1.5 Start Backend

```bash
npm run dev
```

You should see:
```
===============================================
Aadishakti Backend Running on http://localhost:5000
Admin API: http://localhost:5000/api/admin
Public API: http://localhost:5000/api
===============================================
```

✅ **Backend is ready!** Keep this terminal open.

---

## Step 2: Admin Panel Setup (3 minutes)

### 2.1 Install Dependencies

Open a **new terminal** and run:

```bash
cd admin
npm install
```

This will install:
- React 18
- React Router
- Axios
- Lucide React (icons)
- date-fns
- Vite

### 2.2 Start Admin Panel

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

✅ **Admin panel is ready!** Keep this terminal open.

---

## Step 3: Login & Test (2 minutes)

### 3.1 Open Admin Panel

Open your browser and go to:
```
http://localhost:5174
```

### 3.2 Login

Use these credentials:
- **Username**: `aadishakti_admin`
- **Password**: `admin123` (or whatever you set in .env)

### 3.3 Explore

You should see:
- ✅ Dashboard with KPI cards
- ✅ Sidebar navigation
- ✅ Recent enquiries (if any)
- ✅ Quick action buttons

### 3.4 Test Hero Editor

1. Click **"Home / Hero"** in the sidebar
2. Edit any field
3. Click **"Save Changes"**
4. You should see a green success toast: "Changes saved successfully"

### 3.5 Test Enquiries Manager

1. Click **"Enquiries"** in the sidebar
2. You'll see any existing enquiries
3. Click the eye icon to view details
4. Try changing the status
5. Try adding notes

---

## Step 4: Public Website (Optional)

If you want to test the public website reading from the new backend:

### 4.1 Start Public Website

Open a **third terminal**:

```bash
cd frontend
npm run dev
```

### 4.2 View Website

Open:
```
http://localhost:5173
```

The public website will now read content from the backend API.

---

## 🎉 You're All Set!

You now have:
- ✅ Backend running on port 5000
- ✅ Admin panel running on port 5174
- ✅ Public website running on port 5173 (optional)

## 🔍 Troubleshooting

### Problem: "Cannot find module 'bcryptjs'"

**Solution**: Make sure you ran `npm install` in the backend folder.

### Problem: "Port 5000 already in use"

**Solution**: 
1. Stop any other process using port 5000
2. Or change PORT in backend/.env to 5001

### Problem: "Invalid credentials" when logging in

**Solution**:
1. Make sure you copied the hashed password correctly to .env
2. Make sure there are no extra spaces
3. Try generating a new hash: `node generate-password.js admin123`

### Problem: "Network Error" in admin panel

**Solution**:
1. Make sure backend is running on port 5000
2. Check backend terminal for errors
3. Try accessing http://localhost:5000/health in browser

### Problem: Admin panel shows blank page

**Solution**:
1. Check browser console for errors (F12)
2. Make sure you ran `npm install` in admin folder
3. Try clearing browser cache and reload

---

## 📁 What's Running Where

```
┌─────────────────────────────────────────┐
│  Backend (Express)                      │
│  http://localhost:5000                  │
│  - API endpoints                        │
│  - File uploads                         │
│  - JSON data storage                    │
└─────────────────────────────────────────┘
              ↑
              │ API Calls
              │
┌─────────────────────────────────────────┐
│  Admin Panel (React)                    │
│  http://localhost:5174                  │
│  - Login                                │
│  - Dashboard                            │
│  - CMS Editors                          │
│  - CRM Managers                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Public Website (React)                 │
│  http://localhost:5173                  │
│  - Homepage                             │
│  - About, Products, etc.                │
│  - Reads from backend API               │
└─────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. **Explore the admin panel**:
   - Try editing hero content
   - View enquiries
   - Check the dashboard

2. **Create more pages**:
   - Follow HeroEditor.jsx pattern
   - Use EnquiriesManager.jsx for CRM pages
   - All API endpoints are ready

3. **Customize**:
   - Update colors in admin/src/admin.css
   - Add your logo to admin/public/
   - Modify forms as needed

4. **Production**:
   - Build admin: `cd admin && npm run build`
   - Deploy backend to your server
   - Update environment variables
   - Enable HTTPS

---

## 📞 Need Help?

Check these files:
- **ADMIN_PANEL_COMPLETE.md** - Full feature list
- **ADMIN_SETUP.md** - Detailed setup guide
- **admin/README.md** - Admin panel documentation

---

**Happy building! 🚀**
