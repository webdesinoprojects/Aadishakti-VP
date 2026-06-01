import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend developer server and production
app.use(cors());
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

  if (!existsSync(enquiriesFile)) {
    await fs.writeFile(enquiriesFile, JSON.stringify([], null, 2));
  }
  if (!existsSync(applicationsFile)) {
    await fs.writeFile(applicationsFile, JSON.stringify([], null, 2));
  }
};

await initializeStorage();

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
