# Hero Editor - Fixed and Functional ✅

## Issues Fixed

### 1. ✅ Added `shareable` folder to .gitignore
Both `Shareable` and `shareable` are now ignored.

### 2. ✅ Fixed Hero Editor Route and Functionality

#### Backend Changes
**File**: `backend/server.js`

- Updated `GET /api/admin/cms/hero` to return the entire `home` object with `heroSlides` array
- Updated `PUT /api/admin/cms/hero` to properly merge and save hero data
- Added better error logging

#### Frontend Changes
**File**: `frontend/src/admin/pages/cms/HeroEditor.jsx`

Completely rebuilt the Hero Editor to work with the actual CMS data structure:

**Features:**
- ✅ Manages multiple hero slides (carousel)
- ✅ Add new slides
- ✅ Delete slides with confirmation
- ✅ Reorder slides (move up/down)
- ✅ Edit all slide properties:
  - Eyebrow text (small text above headline)
  - Title Part A, B (highlighted), C
  - Subtitle
  - Background image with uploader
- ✅ Save all changes at once
- ✅ Preview on website link
- ✅ Loading states
- ✅ Toast notifications
- ✅ Proper error handling

## How to Access

### Correct URL
```
http://localhost:5173/admin/cms/hero
```

**Note**: The URL is `/admin/cms/hero` NOT `/cms/hero`

### Steps to Test

1. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login to Admin**
   - Go to: http://localhost:5173/admin
   - Login with credentials from `backend/.env`
   - Default: `admin@aadishakti` / `admin123`

4. **Navigate to Hero Editor**
   - Click "Home / Hero" in the sidebar
   - OR go directly to: http://localhost:5173/admin/cms/hero

## Current Hero Data Structure

The CMS stores hero slides in this format:

```json
{
  "home": {
    "heroSlides": [
      {
        "image": "/plant/Plant Pic 02.jpeg",
        "eyebrow": "// EST. 2004 · MUNDRA · ROORKEE",
        "titleA": "India's",
        "titleB": "Sovereign",
        "titleC": "of Secondary Lead",
        "subtitle": "Two state-of-the-art refineries..."
      },
      {
        "image": "/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg",
        "eyebrow": "// PROCESS DISCIPLINE · GLOBAL BENCHMARKS",
        "titleA": "Engineered",
        "titleB": "Precision",
        "titleC": "in Lead Recycling",
        "subtitle": "Consistent metallurgy backed by quality systems..."
      }
    ]
  }
}
```

## Hero Editor Features

### Slide Management
- **Add Slide**: Click "Add New Slide" button
- **Delete Slide**: Click trash icon on any slide
- **Reorder Slides**: Use up/down arrows to change slide order
- **Edit Content**: All fields are editable inline

### Field Descriptions

| Field | Description | Example |
|-------|-------------|---------|
| **Eyebrow Text** | Small text above headline | `// EST. 2004 · MUNDRA · ROORKEE` |
| **Title Part A** | First part of headline | `India's` |
| **Title Part B** | Highlighted word (red) | `Sovereign` |
| **Title Part C** | Last part of headline | `of Secondary Lead` |
| **Subtitle** | Description below headline | `Two state-of-the-art refineries...` |
| **Background Image** | Slide background | Upload or paste URL |

### Image Upload
- Drag & drop images
- Or click to browse
- Supports: JPG, PNG, WEBP
- Max size: 5MB
- Images are uploaded to backend `/uploads` folder

### Save Changes
- Click "Save All Changes" button
- All slides are saved at once
- Toast notification confirms success
- Changes are immediately reflected on the website

## Testing Checklist

- [x] Route `/admin/cms/hero` opens correctly
- [x] Existing slides load from CMS data
- [x] Can add new slides
- [x] Can edit slide content
- [x] Can upload images
- [x] Can delete slides (with confirmation)
- [x] Can reorder slides
- [x] Save button works
- [x] Toast notifications appear
- [x] Preview link opens website
- [x] Changes persist after page refresh

## API Endpoints Used

### GET Hero Data
```
GET /api/admin/cms/hero
Authorization: Bearer {token}

Response:
{
  "heroSlides": [...]
}
```

### UPDATE Hero Data
```
PUT /api/admin/cms/hero
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "heroSlides": [...]
}

Response:
{
  "success": true,
  "data": {...}
}
```

### Upload Image
```
POST /api/admin/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: FormData with 'file' field

Response:
{
  "success": true,
  "url": "http://localhost:5000/uploads/img-123456.jpg"
}
```

## Troubleshooting

### Issue: Page shows "Loading..." forever
**Solution**: 
- Check backend is running
- Check browser console for errors
- Verify authentication token is valid

### Issue: "Failed to load hero content"
**Solution**:
- Check backend console for errors
- Verify `backend/data/cms.json` exists
- Check file permissions

### Issue: Can't save changes
**Solution**:
- Check authentication token
- Verify backend is running
- Check backend console for errors
- Ensure `cms.json` is writable

### Issue: Images won't upload
**Solution**:
- Check `backend/uploads` folder exists
- Verify folder has write permissions
- Check file size (max 5MB)
- Ensure file is an image (JPG, PNG, WEBP)

## Next Steps

The Hero Editor is now fully functional! You can:

1. ✅ Edit existing hero slides
2. ✅ Add new slides for the carousel
3. ✅ Reorder slides
4. ✅ Upload custom images
5. ✅ Preview changes on the website

All changes are saved to `backend/data/cms.json` and immediately reflected on the frontend.

---

**Status**: ✅ Complete and Functional
**Last Updated**: June 1, 2026
