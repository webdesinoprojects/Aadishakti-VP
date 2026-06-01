import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const productsPath = path.join(__dirname, '../../data/products.json');

// Initialize products.json
const initProductsData = async () => {
  try {
    await fs.access(productsPath);
  } catch {
    const defaultProducts = [
      {
        id: "pure-lead",
        name: "Pure Lead",
        code: "IS:27 / BS:334",
        purity: "99.97% Pb Minimum",
        description: "High-purity refined lead meeting international standards for battery manufacturing and industrial applications.",
        specifications: [
          { parameter: "Lead (Pb) Min", value: "99.97%" },
          { parameter: "Bismuth (Bi)", value: "0.010% Max" },
          { parameter: "Copper (Cu)", value: "0.001% Max" },
          { parameter: "Silver (Ag)", value: "0.002% Max" },
          { parameter: "Arsenic (As)", value: "0.001% Max" }
        ],
        image: "/product-pure-lead.png",
        datasheet: "",
        lastEdited: new Date().toISOString()
      }
    ];
    await fs.writeFile(productsPath, JSON.stringify(defaultProducts, null, 2));
  }
};

await initProductsData();

// GET /api/admin/cms/products
router.get('/', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(productsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// PUT /api/admin/cms/products/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const data = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = {
      ...req.body,
      id: req.params.id,
      lastEdited: new Date().toISOString()
    };

    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
    res.json({ success: true, data: products[index] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

export default router;
