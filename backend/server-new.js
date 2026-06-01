import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import heroRoutes from './routes/cms/hero.js';
import productsRoutes from './routes/cms/products.js';
import galleryRoutes from './routes/cms/gallery.js';
import newsRoutes from './routes/cms/news.js';
import careersRoutes from './routes/cms/careers.js';
import teamRoutes from './routes/cms/team.js';
import investorsRoutes from './routes/cms/investors.js';
import enquiriesRoutes from './routes/crm/enquiries.js';
import applicationsRoutes from './routes/crm/applications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploads as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize storage directories
const initializeStorage = async () => {
  const dataDir = path.join(__dirname, 'data');
  const uploadsDir = path.join(__dirname, 'uploads');

  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });

  // Initialize enquiries.json if it doesn't exist
  const enquiriesFile = path.join(dataDir, 'enquiries.json');
  if (!existsSync(enquiriesFile)) {
    await fs.writeFile(enquiriesFile, JSON.stringify([], null, 2));
  }

  // Initialize applications.json if it doesn't exist
  const applicationsFile = path.join(dataDir, 'applications.json');
  if (!existsSync(applicationsFile)) {
    await fs.writeFile(applicationsFile, JSON.stringify([], null, 2));
  }
};

await initializeStorage();

// ============================================
// PUBLIC API ROUTES (No authentication)
// ============================================

// Public CMS endpoints for frontend
app.get('/api/hero', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/hero.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load hero content' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/products.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/gallery.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load gallery' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/news.json'), 'utf-8');
    const news = JSON.parse(data);
    // Only return published news for public
    const published = news.filter(item => item.status === 'Published');
    res.json(published);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load news' });
  }
});

app.get('/api/careers', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/careers.json'), 'utf-8');
    const careers = JSON.parse(data);
    // Only return active jobs for public
    const active = careers.filter(job => job.status === 'Active');
    res.json(active);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load careers' });
  }
});

app.get('/api/team', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/team.json'), 'utf-8');
    const team = JSON.parse(data);
    team.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load team' });
  }
});

app.get('/api/investors', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data/investors.json'), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load investors data' });
  }
});

// Public form submissions
app.post('/api/enquiries', async (req, res) => {
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

    if (!fullName || !workEmail || !phone || !companyName || !country || !inquiryType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dataPath = path.join(__dirname, 'data', 'enquiries.json');
    const dataContent = await fs.readFile(dataPath, 'utf-8');
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
      estimatedQuantity: estimatedQuantity || 'Not specified',
      additionalDetails: additionalDetails || '',
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString(),
    };

    enquiries.push(newEnquiry);
    await fs.writeFile(dataPath, JSON.stringify(enquiries, null, 2));

    console.log(`[Enquiry Received] from ${fullName} (${companyName})`);
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!' });
  } catch (error) {
    console.error('Error processing enquiry:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

// Keep the existing career application endpoint with multer
import multer from 'multer';
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .doc and .docx files are allowed'));
    }
  },
});

app.post('/api/careers/apply', uploadResume.single('resume'), async (req, res) => {
  try {
    const { fullName, email, phone, roleCategory, experience, description } = req.body;
    const resumeFile = req.file;

    if (!fullName || !email || !phone || !roleCategory || !experience || !resumeFile) {
      return res.status(400).json({ error: 'Missing required fields or resume file' });
    }

    const dataPath = path.join(__dirname, 'data', 'applications.json');
    const dataContent = await fs.readFile(dataPath, 'utf-8');
    const applications = JSON.parse(dataContent);

    const newApplication = {
      id: Date.now().toString(),
      fullName,
      email,
      phone,
      roleCategory,
      experience,
      description: description || '',
      resumePath: `/uploads/${resumeFile.filename}`,
      resumeOriginalName: resumeFile.originalname,
      status: 'New',
      notes: '',
      submittedAt: new Date().toISOString(),
    };

    applications.push(newApplication);
    await fs.writeFile(dataPath, JSON.stringify(applications, null, 2));

    console.log(`[Job Application] from ${fullName} for ${roleCategory}`);
    res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error processing application:', error);
    res.status(500).json({ error: error.message || 'Failed to submit application' });
  }
});

// ============================================
// ADMIN API ROUTES (Authentication required)
// ============================================

// Auth routes
app.use('/api/auth', authRoutes);

// Upload routes
app.use('/api/admin/upload', uploadRoutes);

// CMS routes
app.use('/api/admin/cms/hero', heroRoutes);
app.use('/api/admin/cms/products', productsRoutes);
app.use('/api/admin/cms/gallery', galleryRoutes);
app.use('/api/admin/cms/news', newsRoutes);
app.use('/api/admin/cms/careers', careersRoutes);
app.use('/api/admin/cms/team', teamRoutes);
app.use('/api/admin/cms/investors', investorsRoutes);

// CRM routes
app.use('/api/admin/crm/enquiries', enquiriesRoutes);
app.use('/api/admin/crm/applications', applicationsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`Aadishakti Backend Running on http://localhost:${PORT}`);
  console.log(`Admin API: http://localhost:${PORT}/api/admin`);
  console.log(`Public API: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
