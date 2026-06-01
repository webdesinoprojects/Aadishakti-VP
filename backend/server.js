import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USER = process.env.ADMIN_USERNAME || process.env.ADMIN_USER || "admin@aadishakti";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const adminSessions = new Map();

// Allow CORS from configured frontend origins (comma-separated in FRONTEND_URL)
const allowedOrigins = (
  process.env.FRONTEND_URL ||
  "http://localhost:5174,http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploads as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create data and uploads directories if they don't exist
const initializeStorage = async () => {
  const dataDir = path.join(__dirname, "data");
  const uploadsDir = path.join(__dirname, "uploads");

  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });

  const enquiriesFile = path.join(dataDir, "enquiries.json");
  const applicationsFile = path.join(dataDir, "applications.json");
  const cmsFile = path.join(dataDir, "cms.json");

  if (!existsSync(enquiriesFile)) {
    await fs.writeFile(enquiriesFile, JSON.stringify([], null, 2));
  }
  if (!existsSync(applicationsFile)) {
    await fs.writeFile(applicationsFile, JSON.stringify([], null, 2));
  }
  if (!existsSync(cmsFile)) {
    const defaultCms = {
      updatedAt: new Date().toISOString(),
      home: {
        heroSlides: [
          {
            image: "/plant/Plant Pic 02.jpeg",
            eyebrow: "// EST. 2004 · MUNDRA · ROORKEE",
            titleA: "India's",
            titleB: "Sovereign",
            titleC: "of Secondary Lead",
            subtitle: "Two state-of-the-art refineries. One unwavering standard of purity.",
          },
          {
            image: "/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg",
            eyebrow: "// PROCESS DISCIPLINE · GLOBAL BENCHMARKS",
            titleA: "Engineered",
            titleB: "Precision",
            titleC: "in Lead Recycling",
            subtitle: "Consistent metallurgy backed by quality systems, safety culture, and export-grade reliability.",
          },
          {
            image: "/office/WhatsApp Image 2026-03-11 at 16.03.43.jpeg",
            eyebrow: "// CIRCULAR ECONOMY · RESPONSIBLE GROWTH",
            titleA: "Building",
            titleB: "Sustainable",
            titleC: "Industrial Value",
            subtitle: "From battery scrap recovery to high-purity output, every step is built for long-term partnerships.",
          },
        ],
      },
      global: {
        contactEmail: "marketing@aadishakti.com",
        contactPhone: "+91-8743000299",
        address: "30, Third Floor, Shivaji Marg, Block C, Moti Nagar, New Delhi - 110015",
      },
      pageHeroImages: {
        "ABOUT US": "/images/PMUD5812.JPG",
        BUSINESSES: "/plant/Plant Pic 02.jpeg",
        PRODUCTS: "/product-lead-alloy.jpg",
        SUSTAINABILITY: "/plant/Rotary 1.jpeg",
        INVESTORS: "/plant/IMG_20251228_113451171_HDR_AE.jpg",
        CAREERS: "/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg",
        CONTACT: "/office/WhatsApp Image 2026-03-11 at 16.03.43.jpeg",
        SOURCING: "/plant/14 (18).jpg",
      },
      nav: {
        ctaText: "GET IN TOUCH",
      },
    };
    await fs.writeFile(cmsFile, JSON.stringify(defaultCms, null, 2));
  }
};

await initializeStorage();

const cmsPath = path.join(__dirname, "data", "cms.json");

const readCms = async () => {
  const content = await fs.readFile(cmsPath, "utf-8");
  return JSON.parse(content);
};

const writeCms = async (payload) => {
  const next = {
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(cmsPath, JSON.stringify(next, null, 2));
  return next;
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized admin access." });
  }
  req.admin = adminSessions.get(token);
  next();
};

// Multer Storage Configuration for Resume Uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc and .docx files are allowed"));
    }
  },
});

// GET /api/financials - Mock Financial data for Investor's Corner
app.get("/api/financials", (req, res) => {
  const financialData = {
    revenue: [
      { year: "2021-22", value: 340, unit: "Cr INR" },
      { year: "2022-23", value: 520, unit: "Cr INR" },
      { year: "2023-24", value: 780, unit: "Cr INR" },
      { year: "2024-25 (Est)", value: 980, unit: "Cr INR" },
      { year: "2025-26 (Proj)", value: 1200, unit: "Cr INR" },
    ],
    production: [
      { year: "2021-22", value: 30000, unit: "MT" },
      { year: "2022-23", value: 45000, unit: "MT" },
      { year: "2023-24", value: 60000, unit: "MT" },
      { year: "2024-25 (Est)", value: 70000, unit: "MT" },
      { year: "2025-26 (Proj)", value: 120000, unit: "MT" },
    ],
    growthRate: {
      salesIncreasePercent: "54%",
      exportIncreasePercent: "48%",
    },
  };
  res.json(financialData);
});

// PUBLIC CMS endpoint for frontend pages
app.get("/api/cms/public", async (req, res) => {
  try {
    const cms = await readCms();
    res.json(cms);
  } catch (error) {
    console.error("Error loading CMS data:", error);
    res.status(500).json({ error: "Failed to fetch CMS content." });
  }
});

// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin credentials." });
  }

  const token = crypto.randomUUID();
  adminSessions.set(token, { username, createdAt: Date.now() });
  res.json({ token, username });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  adminSessions.delete(token);
  res.json({ success: true });
});

// ADMIN AUTH aliases for newer admin panel
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials. Please try again." });
  }

  const token = crypto.randomUUID();
  adminSessions.set(token, { username, createdAt: Date.now() });
  res.json({ success: true, token, username, expiresIn: "8h" });
});

app.post("/api/auth/logout", requireAdmin, (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  adminSessions.delete(token);
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/verify", requireAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// ADMIN CMS CRUD
app.get("/api/admin/cms", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    res.json(cms);
  } catch (error) {
    console.error("Error loading admin CMS:", error);
    res.status(500).json({ error: "Failed to load CMS for admin." });
  }
});

app.put("/api/admin/cms", requireAdmin, async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Invalid CMS payload." });
    }
    const updated = await writeCms(req.body);
    res.json({ success: true, cms: updated });
  } catch (error) {
    console.error("Error updating CMS:", error);
    res.status(500).json({ error: "Failed to save CMS content." });
  }
});

// ─── HERO ────────────────────────────────────────────────────────────────────
app.get("/api/admin/cms/hero", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    // Return the entire home object which includes heroSlides
    res.json(cms.home || { heroSlides: [] });
  } catch (e) {
    console.error("Error loading hero:", e);
    res.status(500).json({ error: "Failed to load hero content." });
  }
});

app.put("/api/admin/cms/hero", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    if (!cms.home) cms.home = {};
    // Update the home object with the new data
    cms.home = { ...cms.home, ...req.body };
    await writeCms(cms);
    res.json({ success: true, data: cms.home });
  } catch (e) {
    console.error("Error updating hero:", e);
    res.status(500).json({ error: "Failed to save hero content." });
  }
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
app.get("/api/admin/cms/products", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    res.json(cms.products || []);
  } catch (e) {
    res.status(500).json({ error: "Failed to load products." });
  }
});

app.post("/api/admin/cms/products", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    if (!cms.products) cms.products = [];
    const item = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    cms.products.push(item);
    await writeCms(cms);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: "Failed to create product." });
  }
});

app.put("/api/admin/cms/products/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    const idx = (cms.products || []).findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Product not found." });
    cms.products[idx] = { ...cms.products[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeCms(cms);
    res.json(cms.products[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update product." });
  }
});

app.delete("/api/admin/cms/products/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    cms.products = (cms.products || []).filter((p) => p.id !== req.params.id);
    await writeCms(cms);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

// ─── GALLERY ─────────────────────────────────────────────────────────────────
app.get("/api/admin/cms/gallery", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    let items = cms.gallery || [];
    if (req.query.category) items = items.filter((i) => i.category === req.query.category);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to load gallery." });
  }
});

app.post("/api/admin/cms/gallery", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    if (!cms.gallery) cms.gallery = [];
    const item = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    cms.gallery.push(item);
    await writeCms(cms);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: "Failed to add gallery image." });
  }
});

app.put("/api/admin/cms/gallery/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    const idx = (cms.gallery || []).findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Image not found." });
    cms.gallery[idx] = { ...cms.gallery[idx], ...req.body };
    await writeCms(cms);
    res.json(cms.gallery[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update gallery image." });
  }
});

app.delete("/api/admin/cms/gallery/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    cms.gallery = (cms.gallery || []).filter((i) => i.id !== req.params.id);
    await writeCms(cms);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete gallery image." });
  }
});

// ─── NEWS / ANNOUNCEMENTS ────────────────────────────────────────────────────
app.get("/api/admin/cms/news", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    let items = cms.news || [];
    if (req.query.status) items = items.filter((i) => i.status === req.query.status);
    res.json(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (e) {
    res.status(500).json({ error: "Failed to load news." });
  }
});

app.post("/api/admin/cms/news", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    if (!cms.news) cms.news = [];
    const item = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    cms.news.push(item);
    await writeCms(cms);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: "Failed to create news." });
  }
});

app.put("/api/admin/cms/news/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    const idx = (cms.news || []).findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "News item not found." });
    cms.news[idx] = { ...cms.news[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeCms(cms);
    res.json(cms.news[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update news." });
  }
});

app.delete("/api/admin/cms/news/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    cms.news = (cms.news || []).filter((i) => i.id !== req.params.id);
    await writeCms(cms);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete news." });
  }
});

// ─── CAREERS / JOB LISTINGS ──────────────────────────────────────────────────
app.get("/api/admin/cms/careers", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    let items = cms.jobListings || [];
    if (req.query.status) items = items.filter((i) => i.status === req.query.status);
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to load careers." });
  }
});

app.post("/api/admin/cms/careers", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    if (!cms.jobListings) cms.jobListings = [];
    const item = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    cms.jobListings.push(item);
    await writeCms(cms);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: "Failed to create job listing." });
  }
});

app.put("/api/admin/cms/careers/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    const idx = (cms.jobListings || []).findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Job listing not found." });
    cms.jobListings[idx] = { ...cms.jobListings[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeCms(cms);
    res.json(cms.jobListings[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update job listing." });
  }
});

app.delete("/api/admin/cms/careers/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    cms.jobListings = (cms.jobListings || []).filter((i) => i.id !== req.params.id);
    await writeCms(cms);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete job listing." });
  }
});

// ─── TEAM ────────────────────────────────────────────────────────────────────
app.get("/api/admin/cms/team", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    res.json(cms.team || []);
  } catch (e) {
    res.status(500).json({ error: "Failed to load team." });
  }
});

app.post("/api/admin/cms/team", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    if (!cms.team) cms.team = [];
    const item = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
    cms.team.push(item);
    await writeCms(cms);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: "Failed to add team member." });
  }
});

app.put("/api/admin/cms/team/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    const idx = (cms.team || []).findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Team member not found." });
    cms.team[idx] = { ...cms.team[idx], ...req.body, updatedAt: new Date().toISOString() };
    await writeCms(cms);
    res.json(cms.team[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update team member." });
  }
});

app.delete("/api/admin/cms/team/:id", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    cms.team = (cms.team || []).filter((i) => i.id !== req.params.id);
    await writeCms(cms);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete team member." });
  }
});

// ─── INVESTORS ───────────────────────────────────────────────────────────────
app.get("/api/admin/cms/investors", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    res.json(cms.investors || {});
  } catch (e) {
    res.status(500).json({ error: "Failed to load investors content." });
  }
});

app.put("/api/admin/cms/investors", requireAdmin, async (req, res) => {
  try {
    const cms = await readCms();
    cms.investors = { ...req.body, updatedAt: new Date().toISOString() };
    await writeCms(cms);
    res.json({ success: true, data: cms.investors });
  } catch (e) {
    res.status(500).json({ error: "Failed to update investors content." });
  }
});

// ─── FILE UPLOAD ─────────────────────────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

app.post("/api/admin/upload", requireAdmin, imageUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });
  res.json({ success: true, url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

app.post("/api/admin/upload/multiple", requireAdmin, imageUpload.array("files", 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: "No files uploaded." });
  const urls = req.files.map((f) => `http://localhost:${PORT}/uploads/${f.filename}`);
  res.json({ success: true, urls });
});

// ─── CRM: ENQUIRIES ──────────────────────────────────────────────────────────
app.get("/api/admin/crm/enquiries", requireAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    const dataPath = path.join(__dirname, "data", "enquiries.json");
    let items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    if (status && status !== "All") items = items.filter((e) => (e.status || "New") === status);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (e) =>
          e.fullName?.toLowerCase().includes(s) ||
          e.companyName?.toLowerCase().includes(s) ||
          e.workEmail?.toLowerCase().includes(s)
      );
    }
    res.json(items.reverse());
  } catch (e) {
    res.status(500).json({ error: "Failed to load enquiries." });
  }
});

app.put("/api/admin/crm/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "enquiries.json");
    const items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const idx = items.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Enquiry not found." });
    items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
    await fs.writeFile(dataPath, JSON.stringify(items, null, 2));
    res.json(items[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update enquiry." });
  }
});

app.delete("/api/admin/crm/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "enquiries.json");
    const items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const filtered = items.filter((e) => e.id !== req.params.id);
    await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete enquiry." });
  }
});

// ─── CRM: JOB APPLICATIONS ───────────────────────────────────────────────────
app.get("/api/admin/crm/applications", requireAdmin, async (req, res) => {
  try {
    const { status, search, role } = req.query;
    const dataPath = path.join(__dirname, "data", "applications.json");
    let items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    if (status && status !== "All") items = items.filter((a) => (a.status || "New") === status);
    if (role) items = items.filter((a) => a.roleCategory === role);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.fullName?.toLowerCase().includes(s) ||
          a.email?.toLowerCase().includes(s) ||
          a.roleCategory?.toLowerCase().includes(s)
      );
    }
    res.json(items.reverse());
  } catch (e) {
    res.status(500).json({ error: "Failed to load applications." });
  }
});

app.put("/api/admin/crm/applications/:id", requireAdmin, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "applications.json");
    const items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const idx = items.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Application not found." });
    items[idx] = { ...items[idx], ...req.body, updatedAt: new Date().toISOString() };
    await fs.writeFile(dataPath, JSON.stringify(items, null, 2));
    res.json(items[idx]);
  } catch (e) {
    res.status(500).json({ error: "Failed to update application." });
  }
});

app.delete("/api/admin/crm/applications/:id", requireAdmin, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "applications.json");
    const items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const filtered = items.filter((a) => a.id !== req.params.id);
    await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete application." });
  }
});

app.get("/api/admin/crm/applications/:id/cv", requireAdmin, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "data", "applications.json");
    const items = JSON.parse(await fs.readFile(dataPath, "utf-8"));
    const item = items.find((a) => a.id === req.params.id);
    if (!item?.resumePath) return res.status(404).json({ error: "CV not found." });
    const filePath = path.join(__dirname, item.resumePath);
    if (!existsSync(filePath)) return res.status(404).json({ error: "CV file not found on disk." });
    res.download(filePath, item.resumeOriginalName || "resume.pdf");
  } catch (e) {
    res.status(500).json({ error: "Failed to download CV." });
  }
});

// POST /api/enquiries - Receive customer / lead inquiries
app.post("/api/enquiries", async (req, res) => {
  try {
    const {
      fullName,
      workEmail,
      phone,
      companyName,
      country,
      inquiryType,
      products,
      estimatedQuantity,
      additionalDetails,
    } = req.body;

    // Simple validation
    if (!fullName || !workEmail || !phone || !companyName || !country || !inquiryType) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const dataPath = path.join(__dirname, "data", "enquiries.json");
    const dataContent = await fs.readFile(dataPath, "utf-8");
    const enquiries = JSON.parse(dataContent);

    const newEnquiry = {
      id: Date.now().toString(),
      fullName,
      workEmail,
      phone,
      companyName,
      country,
      inquiryType,
      products: products || [],
      estimatedQuantity: estimatedQuantity || "Not specified",
      additionalDetails: additionalDetails || "",
      submittedAt: new Date().toISOString(),
    };

    enquiries.push(newEnquiry);
    await fs.writeFile(dataPath, JSON.stringify(enquiries, null, 2));

    console.log(`[Enquiry Received] from ${fullName} (${companyName}) - Type: ${inquiryType}`);
    res.status(201).json({ success: true, message: "Enquiry submitted successfully!", id: newEnquiry.id });
  } catch (error) {
    console.error("Error processing enquiry:", error);
    res.status(500).json({ error: "Server error. Failed to submit enquiry." });
  }
});

// POST /api/careers - Submit job application with resume
app.post("/api/careers", upload.single("resume"), async (req, res) => {
  try {
    const { fullName, email, phone, roleCategory, experience, description } = req.body;
    const resumeFile = req.file;

    // Validation
    if (!fullName || !email || !phone || !roleCategory || !experience || !resumeFile) {
      return res.status(400).json({ error: "Missing required fields or resume file." });
    }

    const dataPath = path.join(__dirname, "data", "applications.json");
    const dataContent = await fs.readFile(dataPath, "utf-8");
    const applications = JSON.parse(dataContent);

    const newApplication = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      roleCategory,
      experience,
      description: description || "",
      resumePath: `/uploads/${resumeFile.filename}`,
      resumeOriginalName: resumeFile.originalname,
      submittedAt: new Date().toISOString(),
    };

    applications.push(newApplication);
    await fs.writeFile(dataPath, JSON.stringify(applications, null, 2));

    console.log(`[Job Application] from ${fullName} for ${roleCategory} role`);
    res.status(201).json({ success: true, message: "Application submitted successfully!", id: newApplication.id });
  } catch (error) {
    console.error("Error processing career application:", error);
    res.status(500).json({ error: error.message || "Server error. Failed to submit application." });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Aadishakti Backend Running on http://localhost:${PORT}`);
  console.log(`===============================================`);
});
