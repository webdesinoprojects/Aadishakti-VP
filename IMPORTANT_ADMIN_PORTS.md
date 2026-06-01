# ⚠️ IMPORTANT: Which Admin Panel to Use?

## Two Admin Panels Exist

### ❌ OLD Standalone Admin (DON'T USE)
- **Location**: `/admin` folder
- **Port**: 5174
- **URL**: http://localhost:5174
- **Status**: Deprecated, not integrated with main site
- **Issues**: Old code, not updated, separate from main app

### ✅ NEW Integrated Admin (USE THIS ONE)
- **Location**: `/frontend/src/admin` folder
- **Port**: 5173 (same as main site)
- **URL**: http://localhost:5173/admin
- **Status**: Fully integrated, updated, functional
- **Benefits**: 
  - Same app as main website
  - All routes work together
  - Latest fixes applied
  - Proper data structure

## How to Access the CORRECT Admin Panel

### Step 1: Start Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

This will start on **port 5173** (the correct one)

### Step 2: Access Admin
Go to: **http://localhost:5173/admin**

### Step 3: Navigate to Hero Editor
- Click "Home / Hero" in sidebar
- OR go directly to: **http://localhost:5173/admin/cms/hero**

## ⚠️ STOP Using Port 5174

If you have the old admin running on port 5174, **stop it**:

1. Find the terminal running the old admin
2. Press `Ctrl+C` to stop it
3. Close that terminal

## Quick Reference

| Feature | Old Admin (5174) ❌ | New Admin (5173) ✅ |
|---------|---------------------|---------------------|
| **URL** | http://localhost:5174 | http://localhost:5173/admin |
| **Location** | `/admin` folder | `/frontend/src/admin` |
| **Status** | Deprecated | Active |
| **Hero Editor** | Broken | Fixed & Working |
| **Integration** | Separate app | Part of main site |
| **Updates** | None | All latest fixes |

## What to Do Now

1. ✅ **STOP** the old admin on port 5174 (if running)
2. ✅ **START** frontend on port 5173: `cd frontend && npm run dev`
3. ✅ **ACCESS** admin at: http://localhost:5173/admin
4. ✅ **LOGIN** with your credentials
5. ✅ **USE** Hero Editor at: http://localhost:5173/admin/cms/hero

## Verify You're on the Correct Admin

Look at the browser URL:
- ❌ If it shows `localhost:5174` → WRONG, close this
- ✅ If it shows `localhost:5173/admin` → CORRECT, use this

## Optional: Remove Old Admin Folder

Since the admin is now integrated into the frontend, you can optionally remove the old `/admin` folder:

```bash
# Optional - only if you're sure you don't need it
rm -rf admin
```

Or keep it as a backup, but **don't use it**.

---

## Summary

**USE THIS URL**: http://localhost:5173/admin/cms/hero ✅

**NOT THIS URL**: http://localhost:5174/cms/hero ❌

The new integrated admin panel is fully functional and has all the latest fixes!
