import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const enquiriesPath = path.join(__dirname, '../../data/enquiries.json');

// GET /api/admin/crm/enquiries
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(enquiriesPath, 'utf-8');
    const enquiries = JSON.parse(data);
    
    const { status, search } = req.query;
    let filtered = enquiries;
    
    if (status && status !== 'All') {
      filtered = filtered.filter(enq => enq.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(enq => 
        enq.fullName?.toLowerCase().includes(searchLower) ||
        enq.companyName?.toLowerCase().includes(searchLower) ||
        enq.workEmail?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date, newest first
    filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    res.json(filtered);
  } catch (error) {
    console.error('Error reading enquiries:', error);
    res.status(500).json({ error: 'Failed to load enquiries' });
  }
});

// PUT /api/admin/crm/enquiries/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(enquiriesPath, 'utf-8');
    const enquiries = JSON.parse(data);
    const index = enquiries.findIndex(enq => enq.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    enquiries[index] = {
      ...enquiries[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(enquiriesPath, JSON.stringify(enquiries, null, 2));
    res.json({ success: true, data: enquiries[index] });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// DELETE /api/admin/crm/enquiries/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(enquiriesPath, 'utf-8');
    const enquiries = JSON.parse(data);
    const filtered = enquiries.filter(enq => enq.id !== req.params.id);
    
    if (filtered.length === enquiries.length) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    await fs.writeFile(enquiriesPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
