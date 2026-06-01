import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const galleryPath = path.join(__dirname, '../../data/gallery.json');

// Initialize gallery.json
const initGalleryData = async () => {
  try {
    await fs.access(galleryPath);
  } catch {
    await fs.writeFile(galleryPath, JSON.stringify([], null, 2));
  }
};

await initGalleryData();

// GET /api/admin/cms/gallery
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(galleryPath, 'utf-8');
    const gallery = JSON.parse(data);
    
    // Filter by category if provided
    const { category } = req.query;
    if (category && category !== 'All') {
      const filtered = gallery.filter(img => img.category === category);
      return res.json(filtered);
    }
    
    res.json(gallery);
  } catch (error) {
    console.error('Error reading gallery:', error);
    res.status(500).json({ error: 'Failed to load gallery' });
  }
});

// POST /api/admin/cms/gallery
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(galleryPath, 'utf-8');
    const gallery = JSON.parse(data);
    
    const newImage = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    gallery.push(newImage);
    await fs.writeFile(galleryPath, JSON.stringify(gallery, null, 2));
    res.json({ success: true, data: newImage });
  } catch (error) {
    console.error('Error adding image:', error);
    res.status(500).json({ error: 'Failed to add image' });
  }
});

// PUT /api/admin/cms/gallery/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(galleryPath, 'utf-8');
    const gallery = JSON.parse(data);
    const index = gallery.findIndex(img => img.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Image not found' });
    }

    gallery[index] = {
      ...gallery[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(galleryPath, JSON.stringify(gallery, null, 2));
    res.json({ success: true, data: gallery[index] });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// DELETE /api/admin/cms/gallery/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(galleryPath, 'utf-8');
    const gallery = JSON.parse(data);
    const filtered = gallery.filter(img => img.id !== req.params.id);
    
    if (filtered.length === gallery.length) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await fs.writeFile(galleryPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
