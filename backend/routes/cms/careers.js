import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const careersPath = path.join(__dirname, '../../data/careers.json');

// Initialize careers.json
const initCareersData = async () => {
  try {
    await fs.access(careersPath);
  } catch {
    await fs.writeFile(careersPath, JSON.stringify([], null, 2));
  }
};

await initCareersData();

// GET /api/admin/cms/careers
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(careersPath, 'utf-8');
    const careers = JSON.parse(data);
    
    const { status } = req.query;
    if (status && status !== 'All') {
      const filtered = careers.filter(job => job.status === status);
      return res.json(filtered);
    }
    
    res.json(careers);
  } catch (error) {
    console.error('Error reading careers:', error);
    res.status(500).json({ error: 'Failed to load job postings' });
  }
});

// POST /api/admin/cms/careers
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(careersPath, 'utf-8');
    const careers = JSON.parse(data);
    
    const newJob = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    careers.unshift(newJob);
    await fs.writeFile(careersPath, JSON.stringify(careers, null, 2));
    res.json({ success: true, data: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// PUT /api/admin/cms/careers/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(careersPath, 'utf-8');
    const careers = JSON.parse(data);
    const index = careers.findIndex(job => job.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    careers[index] = {
      ...careers[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(careersPath, JSON.stringify(careers, null, 2));
    res.json({ success: true, data: careers[index] });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

// DELETE /api/admin/cms/careers/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(careersPath, 'utf-8');
    const careers = JSON.parse(data);
    const filtered = careers.filter(job => job.id !== req.params.id);
    
    if (filtered.length === careers.length) {
      return res.status(404).json({ error: 'Job posting not found' });
    }

    await fs.writeFile(careersPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

export default router;
