import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const newsPath = path.join(__dirname, '../../data/news.json');

// Initialize news.json
const initNewsData = async () => {
  try {
    await fs.access(newsPath);
  } catch {
    await fs.writeFile(newsPath, JSON.stringify([], null, 2));
  }
};

await initNewsData();

// GET /api/admin/cms/news
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    const news = JSON.parse(data);
    
    const { status } = req.query;
    if (status && status !== 'All') {
      const filtered = news.filter(item => item.status === status);
      return res.json(filtered);
    }
    
    res.json(news);
  } catch (error) {
    console.error('Error reading news:', error);
    res.status(500).json({ error: 'Failed to load news' });
  }
});

// POST /api/admin/cms/news
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    const news = JSON.parse(data);
    
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    news.unshift(newItem);
    await fs.writeFile(newsPath, JSON.stringify(news, null, 2));
    res.json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// PUT /api/admin/cms/news/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    const news = JSON.parse(data);
    const index = news.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    news[index] = {
      ...news[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(newsPath, JSON.stringify(news, null, 2));
    res.json({ success: true, data: news[index] });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// DELETE /api/admin/cms/news/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(newsPath, 'utf-8');
    const news = JSON.parse(data);
    const filtered = news.filter(item => item.id !== req.params.id);
    
    if (filtered.length === news.length) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await fs.writeFile(newsPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
