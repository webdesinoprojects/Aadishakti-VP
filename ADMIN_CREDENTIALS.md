# 🔐 Admin Panel Credentials

## Current Admin Credentials

**Username**: `admin@aadishakti`  
**Password**: `admin123`

---

## Login URL

**Admin Panel**: `http://localhost:5174`

---

## How to Login

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the Admin Panel**:
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel will run on `http://localhost:5174`

3. **Open Browser**:
   - Go to `http://localhost:5174`
   - Enter username: `admin@aadishakti`
   - Enter password: `admin123`
   - Click "Sign In"

---

## Configuration File

The credentials are stored in `backend/.env`:

```env
ADMIN_USERNAME=admin@aadishakti
ADMIN_PASSWORD=$2a$10$N9qo8uLOickgx2ZtsYvAeOv3cy3pjzZXrKUIkI7mXJuEH7qQbZqm6
```

**Note**: The password is hashed with bcrypt for security.

---

## Changing Credentials

### To Change Password:

1. Generate a new hash:
   ```bash
   cd backend
   node generate-password.js YourNewPassword
   ```

2. Copy the hashed output

3. Update `backend/.env`:
   ```env
   ADMIN_PASSWORD=<paste-hashed-password-here>
   ```

4. Restart backend:
   ```bash
   npm run dev
   ```

### To Change Username:

1. Edit `backend/.env`:
   ```env
   ADMIN_USERNAME=your-new-username
   ```

2. Restart backend:
   ```bash
   npm run dev
   ```

---

## Security Notes

- ✅ Password is hashed with bcrypt (10 rounds)
- ✅ JWT tokens expire after 8 hours
- ✅ Sessions are secure with JWT authentication
- ⚠️ **Change these credentials in production!**
- ⚠️ **Use a strong password in production!**
- ⚠️ **Enable HTTPS in production!**

---

## Troubleshooting

### "Invalid credentials" error?
- Make sure backend is running
- Check that .env file exists in backend folder
- Verify username is exactly: `admin@aadishakti`
- Verify password is exactly: `admin123`
- Try restarting the backend server

### Can't access admin panel?
- Make sure admin panel is running on port 5174
- Check browser console for errors (F12)
- Verify backend is running on port 5000
- Try clearing browser cache and cookies

---

## Quick Reference

| Item | Value |
|------|-------|
| **Username** | `admin@aadishakti` |
| **Password** | `admin123` |
| **Admin URL** | `http://localhost:5174` |
| **Backend URL** | `http://localhost:5000` |
| **Session Duration** | 8 hours |
| **Config File** | `backend/.env` |

---

**Last Updated**: June 1, 2026  
**Status**: ✅ Configured and Ready
