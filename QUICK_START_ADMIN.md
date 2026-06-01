# Quick Start Guide - Admin Panel

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend
```bash
cd backend
npm start
```
✅ Backend running at: http://localhost:5000

### Step 2: Start the Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

### Step 3: Access Admin Panel
Open your browser and navigate to:
```
http://localhost:5173/admin
```

## 🔐 Login Credentials

- **Username**: `admin@aadishakti`
- **Password**: `admin123`

> ⚠️ **Security Note**: Change these credentials in production by updating `backend/.env`

## 📍 Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Redirects to dashboard |
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Main dashboard |
| `/admin/cms/hero` | Edit homepage hero section |
| `/admin/cms/products` | Manage products |
| `/admin/crm/enquiries` | View & manage enquiries |

## ✨ Features

### Dashboard
- View total enquiries and applications
- See recent enquiries
- Quick action buttons

### Hero Editor
- Edit homepage hero content
- Update headlines and subtext
- Manage CTA buttons
- Upload background images

### Products Manager
- Add new products
- Edit existing products
- Upload product images
- Delete products

### Enquiries Manager
- View all customer enquiries
- Filter by status (New, In Progress, Replied, Archived)
- Search by name, company, or email
- View detailed enquiry information
- Add internal notes
- Update enquiry status
- Export to CSV

## 🎨 UI Features

- **Toast Notifications**: Success/error messages
- **Confirm Modals**: Confirmation before delete actions
- **Image Uploader**: Drag & drop or click to upload
- **Responsive Tables**: Sortable and filterable data
- **Status Badges**: Visual status indicators
- **Mobile Warning**: Desktop-only notification

## 🔧 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm start
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Can't login
1. Check backend is running (http://localhost:5000/health should return OK)
2. Verify credentials in `backend/.env`
3. Clear browser cache and try again

### API errors
1. Check backend console for errors
2. Verify CORS is configured correctly
3. Ensure backend port 5000 is not in use

## 📝 Making Changes

### Add a New Admin Page

1. Create the page component in `frontend/src/admin/pages/`
2. Add the route in `frontend/src/admin/AdminApp.jsx`
3. Add navigation link in `frontend/src/admin/components/Sidebar.jsx`

Example:
```jsx
// In AdminApp.jsx
<Route path="/cms/gallery" element={<GalleryManager />} />

// In Sidebar.jsx
{ to: '/admin/cms/gallery', icon: Image, label: 'Gallery' }
```

### Update Admin Styles

Edit `frontend/src/admin/admin.css` to customize:
- Colors (CSS variables at top)
- Layout dimensions
- Component styles

## 🌐 Main Website

The main website is still accessible at:
```
http://localhost:5173/
```

All main site routes work normally:
- `/` - Home
- `/about` - About Us
- `/businesses` - Our Businesses
- `/products` - Products
- `/sustainability` - Sustainability
- `/investors` - Investors
- `/careers` - Careers
- `/contact` - Contact Us
- `/sourcing` - Sourcing

## 📦 Tech Stack

### Frontend
- React 19
- React Router DOM 7
- Axios
- Lucide React (icons)
- Date-fns
- Framer Motion

### Backend
- Node.js
- Express
- JWT for authentication
- Multer for file uploads
- CORS enabled

## 🎯 Next Steps

1. ✅ Admin panel is integrated and functional
2. 📝 Add more admin pages (Gallery, News, Team, etc.)
3. 🔒 Change default credentials
4. 🚀 Deploy to production
5. 📊 Add analytics and monitoring

## 💡 Tips

- Use Chrome DevTools to debug
- Check browser console for errors
- Monitor backend console for API logs
- Use the "View Website" link in admin to preview changes
- Save frequently when editing content

## 🆘 Need Help?

Check these files for more information:
- `ADMIN_INTEGRATION_COMPLETE.md` - Full integration details
- `backend/server.js` - API endpoints
- `frontend/src/admin/AdminApp.jsx` - Admin routing
- `frontend/src/admin/utils/api.js` - API client

---

**Happy Managing! 🎉**
