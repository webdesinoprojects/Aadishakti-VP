# Aadishakti Admin Panel

Professional CMS admin panel for managing the Aadishakti Group website.

## Features

- **Authentication**: Secure JWT-based login with 8-hour sessions
- **Content Management**: Edit hero, products, gallery, news, team, and investor data
- **CRM**: Manage customer enquiries and job applications
- **File Upload**: Drag-and-drop image and document uploads
- **Real-time Updates**: Toast notifications for all actions
- **Responsive Design**: Desktop-optimized interface

## Setup Instructions

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Configure Backend

Make sure the backend server is running on `http://localhost:5000`.

The admin panel will proxy API requests to the backend automatically.

### 3. Start Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5174`

### 4. Default Login Credentials

**Username**: `aadishakti_admin`  
**Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production by updating the backend `.env` file.

## Project Structure

```
admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── ImageUploader.jsx
│   │   └── ConfirmModal.jsx
│   ├── context/             # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── cms/             # CMS editors
│   │   └── crm/             # CRM managers
│   ├── utils/
│   │   └── api.js           # API client
│   ├── admin.css            # Admin design system
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Design System

### Colors

- **Background**: `#F4F5F7` (Light grey)
- **Surface**: `#FFFFFF` (White cards)
- **Primary**: `#CC2200` (Aadishakti Red)
- **Success**: `#16A34A` (Green)
- **Warning**: `#D97706` (Amber)
- **Info**: `#2563EB` (Blue)

### Typography

- **Primary Font**: Montserrat (400, 500, 600, 700, 800)
- **Monospace**: JetBrains Mono (for IDs, dates, codes)

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## API Endpoints

All API calls go through `/api/admin/*` and require authentication.

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify token

### CMS
- `GET/PUT /api/admin/cms/hero` - Hero content
- `GET/PUT /api/admin/cms/products/:id` - Products
- `GET/POST/PUT/DELETE /api/admin/cms/gallery` - Gallery
- `GET/POST/PUT/DELETE /api/admin/cms/news` - News
- `GET/POST/PUT/DELETE /api/admin/cms/careers` - Careers
- `GET/POST/PUT/DELETE /api/admin/cms/team` - Team
- `GET/PUT /api/admin/cms/investors` - Investors

### CRM
- `GET/PUT/DELETE /api/admin/crm/enquiries` - Enquiries
- `GET/PUT/DELETE /api/admin/crm/applications` - Applications

### Upload
- `POST /api/admin/upload` - Single file upload
- `POST /api/admin/upload/multiple` - Multiple files upload

## Security

- JWT tokens stored in localStorage
- 8-hour session expiry
- Auto-logout on token expiration
- Protected routes with authentication middleware
- HTTPS recommended for production

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Note**: Mobile devices will see a "Desktop Required" message.
