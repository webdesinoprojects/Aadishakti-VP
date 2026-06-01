import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const applicationsPath = path.join(__dirname, '../../data/applications.json');

// GET /api/admin/crm/applications
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(applicationsPath, 'utf-8');
    const applications = JSON.parse(data);
    
    const { status, position, search } = req.query;
    let filtered = applications;
    
    if (status && status !== 'All') {
      filtered = filtered.filter(app => app.status === status);
    }
    
    if (position && position !== 'All') {
      filtered = filtered.filter(app => app.roleCategory === position);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(app => 
        app.fullName?.toLowerCase().includes(searchLower) ||
        app.email?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json(filtered);
  } catch (error) {
    console.error('Error reading applications:', error);
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// PUT /api/admin/crm/applications/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(applicationsPath, 'utf-8');
    const applications = JSON.parse(data);
    const index = applications.findIndex(app => app.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Application not found' });
    }

    applications[index] = {
      ...applications[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(applicationsPath, JSON.stringify(applications, null, 2));
    res.json({ success: true, data: applications[index] });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// DELETE /api/admin/crm/applications/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(applicationsPath, 'utf-8');
    const applications = JSON.parse(data);
    const filtered = applications.filter(app => app.id !== req.params.id);
    
    if (filtered.length === applications.length) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await fs.writeFile(applicationsPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// GET /api/admin/crm/applications/:id/cv - Download CV
router.get('/:id/cv', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(applicationsPath, 'utf-8');
    const applications = JSON.parse(data);
    const application = applications.find(app => app.id === req.params.id);
    
    if (!application || !application.resumePath) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvPath = path.join(__dirname, '../..', application.resumePath);
    res.download(cvPath, application.resumeOriginalName || 'resume.pdf');
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ error: 'Failed to download CV' });
  }
});

export default router;
