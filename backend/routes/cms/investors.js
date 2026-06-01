import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const investorsPath = path.join(__dirname, '../../data/investors.json');

// Initialize investors.json
const initInvestorsData = async () => {
  try {
    await fs.access(investorsPath);
  } catch {
    const defaultData = {
      metrics: {
        revenue: { value: "780", year: "2023-24", unit: "₹ Crore" },
        production: { value: "60000", unit: "MT" },
        ebitdaMargin: { value: "18.5", unit: "%" },
        yoyGrowth: { value: "54", unit: "%" }
      },
      revenueChart: [
        { year: "2019-20", revenue: 240 },
        { year: "2020-21", revenue: 310 },
        { year: "2021-22", revenue: 340 },
        { year: "2022-23", revenue: 520 },
        { year: "2023-24", revenue: 780 }
      ],
      productionChart: [
        { year: "2019-20", production: 22000 },
        { year: "2020-21", production: 28000 },
        { year: "2021-22", production: 30000 },
        { year: "2022-23", production: 45000 },
        { year: "2023-24", production: 60000 }
      ],
      documents: {
        annualReport: { filename: "", url: "", uploadDate: "" },
        investorDeck: { filename: "", url: "", uploadDate: "" },
        financialSummary: { filename: "", url: "", uploadDate: "" }
      },
      updatedAt: new Date().toISOString()
    };
    await fs.writeFile(investorsPath, JSON.stringify(defaultData, null, 2));
  }
};

await initInvestorsData();

// GET /api/admin/cms/investors
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(investorsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading investors data:', error);
    res.status(500).json({ error: 'Failed to load investors data' });
  }
});

// PUT /api/admin/cms/investors
router.put('/', requireAdmin, async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await fs.writeFile(investorsPath, JSON.stringify(updatedData, null, 2));
    res.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Error updating investors data:', error);
    res.status(500).json({ error: 'Failed to save investors data' });
  }
});

export default router;
