# Aadishakti Admin Panel - Complete Setup Guide

## Overview

This is a complete, professional CMS admin panel for the Aadishakti Group website. It's a separate React application that runs independently from the public website.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ADMIN PANEL                          │
│              (React + Vite on :5174)                    │
│  Login → Dashboard → CMS Editors → CRM Managers         │
└─────────────────────────────────────────────────────────┘
                          ↓ API Calls
┌─────────────────────────────────────────────────────────┐
│                  BACKEND SERVER                         │
│              (Express on :5000)                         │
│  JWT Auth → CMS Routes → CRM Routes → File Upload      │
└─────────────────────────────────────────────────────────┘
                          ↓ Reads/Writes
┌─────────────────────────────────────────────────────────┐
│                   JSON DATA STORE                       │
│  hero.json, products.json, gallery.json, etc.          │
└─────────────────────────────────────────────────────────┘
                          ↑ Reads
┌─────────────────────────────────────────────────────────┐
│                 PUBLIC WEBSITE                          │
│              (React + Vite on :5173)                    │
│  Displays content from backend API (read-only)         │
└─────────────────────────────────────────────────────────┘
```

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend

# Install new dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and set:
```env
PORT=5000
ADMIN_USERNAME=aadishakti_admin
ADMIN_PASSWORD=$2a$10$rKZJQXxGxGxGxGxGxGxGxOeK7vKxGxGxGxGxGxGxGxGxGxGxGxGxG
JWT_SECRET=your-super-secret-jwt-key-min-64-characters-long-random-string-here
JWT_EXPIRY=8h
```

**Generate a hashed password:**
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

Replace the `ADMIN_PASSWORD` value with the output.

**Replace the old server.js:**
```bash
mv server.js server-old.js
mv server-new.js server.js
```

**Start the backend:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Admin Panel Setup

```bash
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

Admin panel will run on `http://localhost:5174`

### 3. Access the Admin Panel

1. Open `http://localhost:5174`
2. Login with:
   - **Username**: `aadishakti_admin`
   - **Password**: `admin123` (or whatever you set in .env)

### 4. Public Website

The existing public website continues to run on `http://localhost:5173` and reads data from the backend API.

## Default Credentials

**⚠️ CHANGE THESE IN PRODUCTION!**

- Username: `aadishakti_admin`
- Password: `admin123`

## What's Included

### ✅ Backend (Complete)

- JWT authentication with bcrypt password hashing
- All CMS routes (hero, products, gallery, news, careers, team, investors)
- All CRM routes (enquiries, applications)
- File upload with Multer (images + PDFs, 5MB limit)
- Public read-only API for frontend
- JSON file storage (no database needed)

### ✅ Admin Panel (Core Features)

- **Login Page**: Professional design with validation
- **Dashboard**: KPI cards, recent enquiries, quick actions
- **Sidebar Navigation**: Organized by content type
- **Hero Editor**: Complete form for homepage hero section
- **Image Uploader**: Drag-and-drop with preview
- **Toast Notifications**: Success/error messages
- **Confirm Modals**: For destructive actions
- **Auth Context**: JWT token management
- **Protected Routes**: Auto-redirect to login

### 🚧 To Be Completed

You'll need to create these additional pages following the same pattern as HeroEditor:

1. **CMS Pages**:
   - `ProductsEditor.jsx` - Edit product specifications
   - `GalleryEditor.jsx` - Upload and manage gallery images
   - `NewsEditor.jsx` - Create/edit announcements
   - `CareersEditor.jsx` - Post and manage job listings
   - `TeamEditor.jsx` - Add/edit team members
   - `InvestorsEditor.jsx` - Update financial data

2. **CRM Pages**:
   - `EnquiriesManager.jsx` - View and manage customer enquiries
   - `ApplicationsManager.jsx` - Review job applications

3. **Settings**:
   - `AdminSettings.jsx` - Change password, company info

## File Structure Created

```
backend/
├── middleware/
│   ├── authMiddleware.js       ✅ JWT verification
│   └── uploadMiddleware.js     ✅ Multer config
├── routes/
│   ├── auth.js                 ✅ Login/logout
│   ├── upload.js               ✅ File uploads
│   ├── cms/
│   │   ├── hero.js             ✅
│   │   ├── products.js         ✅
│   │   ├── gallery.js          ✅
│   │   ├── news.js             ✅
│   │   ├── careers.js          ✅
│   │   ├── team.js             ✅
│   │   └── investors.js        ✅
│   └── crm/
│       ├── enquiries.js        ✅
│       └── applications.js     ✅
├── data/                       (Auto-created)
│   ├── hero.json
│   ├── products.json
│   ├── gallery.json
│   ├── news.json
│   ├── careers.json
│   ├── team.json
│   ├── investors.json
│   ├── enquiries.json
│   └── applications.json
├── uploads/                    (Auto-created)
├── server-new.js               ✅ New server
└── .env.example                ✅

admin/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         ✅
│   │   ├── TopBar.jsx          ✅
│   │   ├── ImageUploader.jsx   ✅
│   │   └── ConfirmModal.jsx    ✅
│   ├── context/
│   │   ├── AuthContext.jsx     ✅
│   │   └── ToastContext.jsx    ✅
│   ├── pages/
│   │   ├── Login.jsx           ✅
│   │   ├── Dashboard.jsx       ✅
│   │   └── cms/
│   │       └── HeroEditor.jsx  ✅
│   ├── utils/
│   │   └── api.js              ✅ Complete API client
│   ├── admin.css               ✅ Full design system
│   ├── App.jsx                 ✅
│   └── main.jsx                ✅
├── index.html                  ✅
├── package.json                ✅
├── vite.config.js              ✅
└── README.md                   ✅
```

## Next Steps

1. **Test the setup**:
   - Start backend: `cd backend && npm run dev`
   - Start admin: `cd admin && npm run dev`
   - Login and test Hero Editor

2. **Create remaining CMS pages** using HeroEditor.jsx as a template

3. **Create CRM pages** for managing enquiries and applications

4. **Add rich text editor** for news content (optional: install react-quill)

5. **Production deployment**:
   - Build admin: `cd admin && npm run build`
   - Serve admin build from backend or separate hosting
   - Update CORS settings
   - Use HTTPS
   - Change default credentials

## Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT secret (64+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags in production
- [ ] Update CORS origin to production domain
- [ ] Add rate limiting to login endpoint
- [ ] Regular security audits

## Support

The admin panel is fully functional with:
- ✅ Authentication
- ✅ Dashboard
- ✅ Hero Editor (example CMS page)
- ✅ Complete API client
- ✅ All backend routes
- ✅ File upload system
- ✅ Toast notifications
- ✅ Design system

Follow the HeroEditor.jsx pattern to create the remaining pages!
