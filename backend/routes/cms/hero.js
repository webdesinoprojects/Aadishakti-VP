import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const heroPath = path.join(__dirname, '../../data/hero.json');

// Initialize hero.json if it doesn't exist
const initHeroData = async () => {
  try {
    await fs.access(heroPath);
  } catch {
    const defaultHero = {
      aboveHeadline: "// EST. 2004 · MUNDRA · ROORKEE",
      headlineLine1: "India's",
      highlightedWord: "Sovereign",
      headlineLine2: "of Secondary Lead",
      subtext: "Two state-of-the-art refineries. One unwavering standard of purity.",
      cta1Text: "Explore Operations",
      cta1Link: "/businesses",
      cta2Text: "Investor Relations →",
      cta2Link: "/investors",
      stats: [
        { number: "50,000+", label: "Metric Tonnes" },
        { number: "20+", label: "Years" },
        { number: "2", label: "Plants" }
      ],
      backgroundImage: "/plant/Plant Pic 02.jpeg",
      backgroundVideo: "",
      announcementText: "ISO 9001:2015 Certified · BIS Approved · Export Quality Standards",
      announcementEnabled: true,
      updatedAt: new Date().toISOString()
    };
    await fs.writeFile(heroPath, JSON.stringify(defaultHero, null, 2));
  }
};

await initHeroData();

// GET /api/admin/cms/hero - Get hero content
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(heroPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading hero data:', error);
    res.status(500).json({ error: 'Failed to load hero content' });
  }
});

// PUT /api/admin/cms/hero - Update hero content
router.put('/', requireAdmin, async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await fs.writeFile(heroPath, JSON.stringify(updatedData, null, 2));
    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating hero data:', error);
    res.status(500).json({ error: 'Failed to save hero content' });
  }
});

export default router;
