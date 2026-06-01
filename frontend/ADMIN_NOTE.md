# Admin Panel Note

The admin panel has been moved to a **separate application** located in the `/admin` folder at the root of the project.

## Why Separate?

The admin panel is now a completely independent React application with:
- Its own dependencies
- Its own build process
- Its own port (5174)
- Complete isolation from the public website

## Accessing the Admin Panel

1. **Start the admin panel**:
   ```bash
   cd admin
   npm install
   npm run dev
   ```

2. **Access at**: `http://localhost:5174`

3. **Login with**:
   - Username: `aadishakti_admin`
   - Password: `admin123` (or your configured password)

## Public Website

This frontend folder (`/frontend`) contains only the **public-facing website** that customers see.

The public website:
- Runs on port 5173
- Reads content from the backend API
- Has no admin features
- Is completely separate from the admin panel

## Architecture

```
/admin          → Admin Panel (React app on :5174)
/frontend       → Public Website (React app on :5173)
/backend        → API Server (Express on :5000)
```

For more information, see:
- `/ADMIN_SETUP.md` - Setup instructions
- `/START_ADMIN.md` - Quick start guide
- `/README_ADMIN.md` - Complete documentation
