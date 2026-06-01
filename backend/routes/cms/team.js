import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const teamPath = path.join(__dirname, '../../data/team.json');

// Initialize team.json
const initTeamData = async () => {
  try {
    await fs.access(teamPath);
  } catch {
    const defaultTeam = [
      {
        id: "1",
        name: "Mr. Amit Goyal",
        role: "Managing Director, AGRPL",
        bio: "Leading strategic operations and business development with over 20 years of experience in the secondary lead industry.",
        photo: "",
        category: "Directors",
        displayOrder: 1,
        linkedinUrl: "",
        createdAt: new Date().toISOString()
      }
    ];
    await fs.writeFile(teamPath, JSON.stringify(defaultTeam, null, 2));
  }
};

await initTeamData();

// GET /api/admin/cms/team
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(teamPath, 'utf-8');
    const team = JSON.parse(data);
    team.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    res.json(team);
  } catch (error) {
    console.error('Error reading team:', error);
    res.status(500).json({ error: 'Failed to load team members' });
  }
});

// POST /api/admin/cms/team
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(teamPath, 'utf-8');
    const team = JSON.parse(data);
    
    const newMember = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    team.push(newMember);
    await fs.writeFile(teamPath, JSON.stringify(team, null, 2));
    res.json({ success: true, data: newMember });
  } catch (error) {
    console.error('Error adding team member:', error);
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

// PUT /api/admin/cms/team/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(teamPath, 'utf-8');
    const team = JSON.parse(data);
    const index = team.findIndex(member => member.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    team[index] = {
      ...team[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fs.writeFile(teamPath, JSON.stringify(team, null, 2));
    res.json({ success: true, data: team[index] });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// DELETE /api/admin/cms/team/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(teamPath, 'utf-8');
    const team = JSON.parse(data);
    const filtered = team.filter(member => member.id !== req.params.id);
    
    if (filtered.length === team.length) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    await fs.writeFile(teamPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
