# 🏗️ System Architecture - Aadishakti Admin Panel

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                              │
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────┐        │
│  │   PUBLIC WEBSITE     │         │    ADMIN PANEL       │        │
│  │   :5173              │         │    :5174             │        │
│  │                      │         │                      │        │
│  │  • Homepage          │         │  • Login             │        │
│  │  • About             │         │  • Dashboard         │        │
│  │  • Products          │         │  • CMS Editors       │        │
│  │  • Contact           │         │  • CRM Managers      │        │
│  │  • Careers           │         │  • Settings          │        │
│  └──────────────────────┘         └──────────────────────┘        │
│           │                                    │                    │
│           │ GET /api/*                         │ POST/PUT/DELETE   │
│           │ (Read-only)                        │ /api/admin/*      │
│           │                                    │ (JWT Required)    │
└───────────┼────────────────────────────────────┼───────────────────┘
            │                                    │
            └────────────────┬───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER (:5000)                         │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    EXPRESS.JS SERVER                         │ │
│  │                                                              │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │ │
│  │  │  PUBLIC ROUTES │  │  ADMIN ROUTES  │  │  AUTH ROUTES  │ │ │
│  │  │  (No Auth)     │  │  (JWT Auth)    │  │  (Login)      │ │ │
│  │  │                │  │                │  │               │ │ │
│  │  │  GET /api/*    │  │  /api/admin/*  │  │  /api/auth/*  │ │ │
│  │  └────────────────┘  └────────────────┘  └───────────────┘ │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │              MIDDLEWARE LAYER                          │ │ │
│  │  │                                                        │ │ │
│  │  │  • CORS                                               │ │ │
│  │  │  • Body Parser                                        │ │ │
│  │  │  • Cookie Parser                                      │ │ │
│  │  │  • JWT Verification (requireAdmin)                   │ │ │
│  │  │  • File Upload (Multer)                              │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                             │                                      │
│                             ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    DATA LAYER                                │ │
│  │                                                              │ │
│  │  backend/data/                    backend/uploads/          │ │
│  │  ├── hero.json                    ├── image-123.jpg         │ │
│  │  ├── products.json                ├── resume-456.pdf        │ │
│  │  ├── gallery.json                 └── datasheet-789.pdf     │ │
│  │  ├── news.json                                              │ │
│  │  ├── careers.json                                           │ │
│  │  ├── team.json                                              │ │
│  │  ├── investors.json                                         │ │
│  │  ├── enquiries.json                                         │ │
│  │  └── applications.json                                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌──────────────┐
│   ADMIN      │
│   BROWSER    │
└──────┬───────┘
       │
       │ 1. POST /api/auth/login
       │    { username, password }
       ▼
┌──────────────────────────────────┐
│   BACKEND                        │
│                                  │
│   1. Verify username             │
│   2. Compare password (bcrypt)   │
│   3. Generate JWT token          │
│   4. Set httpOnly cookie         │
│                                  │
└──────┬───────────────────────────┘
       │
       │ 2. Response
       │    { token, username }
       ▼
┌──────────────────────────────────┐
│   ADMIN BROWSER                  │
│                                  │
│   1. Store token in localStorage │
│   2. Redirect to /dashboard      │
│   3. Add token to all requests   │
│                                  │
└──────┬───────────────────────────┘
       │
       │ 3. GET /api/admin/cms/hero
       │    Authorization: Bearer <token>
       ▼
┌──────────────────────────────────┐
│   BACKEND                        │
│                                  │
│   1. Extract token from header   │
│   2. Verify JWT signature        │
│   3. Check expiry (8 hours)      │
│   4. Allow request if valid      │
│   5. Return 401 if invalid       │
│                                  │
└──────────────────────────────────┘
```

---

## Data Flow: Editing Hero Content

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: ADMIN OPENS HERO EDITOR                                │
└─────────────────────────────────────────────────────────────────┘

Admin Browser                Backend                  Data Storage
     │                          │                          │
     │  GET /api/admin/cms/hero │                          │
     │  (with JWT token)        │                          │
     ├─────────────────────────>│                          │
     │                          │  Read hero.json          │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │  Return JSON data        │
     │                          │<─────────────────────────┤
     │  Response: hero data     │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  Display form with       │                          │
     │  current values          │                          │
     │                          │                          │

┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: ADMIN EDITS AND SAVES                                  │
└─────────────────────────────────────────────────────────────────┘

Admin Browser                Backend                  Data Storage
     │                          │                          │
     │  PUT /api/admin/cms/hero │                          │
     │  (with JWT + new data)   │                          │
     ├─────────────────────────>│                          │
     │                          │  Verify JWT              │
     │                          │  Validate data           │
     │                          │                          │
     │                          │  Write hero.json         │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │  Success                 │
     │                          │<─────────────────────────┤
     │  Response: success       │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  Show toast:             │                          │
     │  "Changes saved!"        │                          │
     │                          │                          │

┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: PUBLIC WEBSITE DISPLAYS NEW CONTENT                    │
└─────────────────────────────────────────────────────────────────┘

Public Website              Backend                  Data Storage
     │                          │                          │
     │  GET /api/hero           │                          │
     │  (no auth required)      │                          │
     ├─────────────────────────>│                          │
     │                          │  Read hero.json          │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │  Return JSON data        │
     │                          │<─────────────────────────┤
     │  Response: hero data     │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  Render updated hero     │                          │
     │  section on homepage     │                          │
     │                          │                          │
```

---

## File Upload Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN UPLOADS AN IMAGE                                         │
└─────────────────────────────────────────────────────────────────┘

Admin Browser                Backend                  File System
     │                          │                          │
     │  1. User drops image     │                          │
     │     in upload zone       │                          │
     │                          │                          │
     │  2. POST /api/admin/upload                          │
     │     (multipart/form-data)│                          │
     ├─────────────────────────>│                          │
     │                          │  3. Verify JWT           │
     │                          │  4. Validate file type   │
     │                          │  5. Check file size      │
     │                          │  6. Generate unique name │
     │                          │                          │
     │                          │  7. Save to uploads/     │
     │                          ├─────────────────────────>│
     │                          │                          │
     │                          │  8. File saved           │
     │                          │<─────────────────────────┤
     │  9. Response:            │                          │
     │     { url: "/uploads/... }                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  10. Update form field   │                          │
     │      with new URL        │                          │
     │  11. Show preview        │                          │
     │                          │                          │
```

---

## Component Hierarchy

```
App.jsx
│
├── AuthProvider (Context)
│   └── ToastProvider (Context)
│       │
│       ├── Login.jsx (Public Route)
│       │
│       └── ProtectedRoute
│           └── AdminLayout
│               │
│               ├── Sidebar
│               │   ├── Logo
│               │   ├── Navigation Groups
│               │   │   ├── Content Management
│               │   │   ├── Operations
│               │   │   ├── CRM
│               │   │   └── Settings
│               │   └── User Info + Logout
│               │
│               └── Main Content Area
│                   │
│                   ├── TopBar
│                   │   ├── Breadcrumb
│                   │   └── Actions (View Website)
│                   │
│                   └── Page Content
│                       │
│                       ├── Dashboard
│                       │   ├── KPI Cards
│                       │   ├── Recent Enquiries Table
│                       │   └── Quick Actions
│                       │
│                       ├── HeroEditor
│                       │   ├── Form Fields
│                       │   ├── ImageUploader
│                       │   └── Save Button
│                       │
│                       ├── EnquiriesManager
│                       │   ├── Filter Bar
│                       │   ├── Enquiries Table
│                       │   ├── EnquiryDrawer
│                       │   └── ConfirmModal
│                       │
│                       └── [Other Pages...]
│
└── ToastContainer (Global)
    └── Toast Components
```

---

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      GLOBAL STATE                               │
│                                                                 │
│  AuthContext                                                    │
│  ├── user: { username, role }                                  │
│  ├── loading: boolean                                           │
│  ├── login(credentials)                                         │
│  ├── logout()                                                   │
│  └── checkAuth()                                                │
│                                                                 │
│  ToastContext                                                   │
│  ├── toasts: Array<Toast>                                      │
│  ├── success(message)                                           │
│  ├── error(message)                                             │
│  ├── warning(message)                                           │
│  └── info(message)                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      LOCAL STATE (Per Page)                     │
│                                                                 │
│  HeroEditor                                                     │
│  ├── data: HeroData                                             │
│  ├── loading: boolean                                           │
│  ├── saving: boolean                                            │
│  └── loadData(), handleSave()                                   │
│                                                                 │
│  EnquiriesManager                                               │
│  ├── enquiries: Array<Enquiry>                                 │
│  ├── filteredEnquiries: Array<Enquiry>                         │
│  ├── filters: { status, search }                               │
│  ├── selectedEnquiry: Enquiry | null                           │
│  ├── deleteModal: Enquiry | null                               │
│  └── loadEnquiries(), updateStatus(), handleDelete()           │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Client Structure

```javascript
// utils/api.js

axios instance
├── baseURL: http://localhost:5000
├── withCredentials: true
├── Request Interceptor
│   └── Add JWT token to Authorization header
└── Response Interceptor
    └── Handle 401 errors (redirect to login)

authAPI
├── login(credentials)
├── logout()
└── verify()

uploadAPI
├── single(file)
└── multiple(files)

cmsAPI
├── getHero()
├── updateHero(data)
├── getProducts()
├── updateProduct(id, data)
├── getGallery(category)
├── addImage(data)
├── updateImage(id, data)
├── deleteImage(id)
├── getNews(status)
├── createNews(data)
├── updateNews(id, data)
├── deleteNews(id)
├── getCareers(status)
├── createCareer(data)
├── updateCareer(id, data)
├── deleteCareer(id)
├── getTeam()
├── createTeamMember(data)
├── updateTeamMember(id, data)
├── deleteTeamMember(id)
├── getInvestors()
└── updateInvestors(data)

crmAPI
├── getEnquiries(params)
├── updateEnquiry(id, data)
├── deleteEnquiry(id)
├── getApplications(params)
├── updateApplication(id, data)
├── deleteApplication(id)
└── downloadCV(id)
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: FRONTEND PROTECTION                                   │
│                                                                 │
│  • Protected Routes (React Router)                              │
│  • Auto-redirect to login if no token                           │
│  • Token stored in localStorage                                 │
│  • Token added to all API requests                              │
│  • Auto-logout on 401 response                                  │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: NETWORK SECURITY                                      │
│                                                                 │
│  • HTTPS (in production)                                        │
│  • CORS configuration                                           │
│  • httpOnly cookies (optional)                                  │
│  • Secure cookie flag (production)                              │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: BACKEND AUTHENTICATION                                │
│                                                                 │
│  • JWT verification middleware                                  │
│  • Token signature validation                                   │
│  • Token expiry check (8 hours)                                 │
│  • Bcrypt password hashing (10 rounds)                          │
│  • Protected route middleware                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: INPUT VALIDATION                                      │
│                                                                 │
│  • File type validation                                         │
│  • File size limits (5MB)                                       │
│  • Required field validation                                    │
│  • Data type validation                                         │
│  • Sanitization (prevent XSS)                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: ERROR HANDLING                                        │
│                                                                 │
│  • No sensitive data in error messages                          │
│  • Generic error responses                                      │
│  • Logging (server-side only)                                   │
│  • Graceful degradation                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOAD BALANCER / CDN                        │
│                      (Cloudflare, AWS)                          │
└─────────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   PUBLIC WEBSITE         │  │   ADMIN PANEL            │
│   (Static Hosting)       │  │   (Static Hosting)       │
│                          │  │                          │
│   • Vercel / Netlify     │  │   • Vercel / Netlify     │
│   • S3 + CloudFront      │  │   • S3 + CloudFront      │
│   • GitHub Pages         │  │   • Password Protected   │
└──────────────────────────┘  └──────────────────────────┘
                │                         │
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                         │
│                      (Node.js + Express)                        │
│                                                                 │
│   • VPS (DigitalOcean, Linode)                                 │
│   • AWS EC2                                                     │
│   • Heroku / Railway                                            │
│   • PM2 for process management                                  │
│   • Nginx reverse proxy                                         │
│   • SSL certificate (Let's Encrypt)                             │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                               │
│                                                                 │
│   • JSON files on server                                        │
│   • Regular backups to S3                                       │
│   • Uploaded files on server or S3                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                                                                 │
│  Admin Panel:                                                   │
│  ├── React 18                                                   │
│  ├── React Router 6                                             │
│  ├── Axios                                                      │
│  ├── Lucide React (icons)                                       │
│  ├── date-fns                                                   │
│  └── Vite                                                       │
│                                                                 │
│  Public Website:                                                │
│  ├── React 19                                                   │
│  ├── React Router 7                                             │
│  ├── Framer Motion                                              │
│  ├── Recharts                                                   │
│  └── Vite                                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│                                                                 │
│  ├── Node.js                                                    │
│  ├── Express.js                                                 │
│  ├── JWT (jsonwebtoken)                                         │
│  ├── Bcrypt.js                                                  │
│  ├── Multer (file upload)                                       │
│  ├── CORS                                                       │
│  ├── Cookie Parser                                              │
│  └── date-fns                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                               │
│                                                                 │
│  ├── JSON files (no database)                                   │
│  ├── File system (uploads)                                      │
│  └── Environment variables (.env)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ **Separation of Concerns**: Admin, public, and backend are independent
- ✅ **Security**: Multiple layers of protection
- ✅ **Scalability**: Easy to add new features
- ✅ **Maintainability**: Clean code structure
- ✅ **Performance**: Optimized for speed
- ✅ **Simplicity**: No database complexity

---

**Last Updated**: June 1, 2026
