import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');

const defaultData = {
  'hero.json': {
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
  },

  'products.json': [
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
    },
    {
      id: "lead-alloy",
      name: "Lead Alloy",
      code: "Custom Grades",
      purity: "99.85% Pb Minimum",
      description: "Specialized lead alloys for specific industrial applications.",
      specifications: [
        { parameter: "Lead (Pb) Min", value: "99.85%" },
        { parameter: "Antimony (Sb)", value: "0.10% Max" },
        { parameter: "Tin (Sn)", value: "0.05% Max" }
      ],
      image: "/product-lead-alloy.jpg",
      datasheet: "",
      lastEdited: new Date().toISOString()
    }
  ],

  'gallery.json': [],

  'news.json': [
    {
      id: Date.now().toString(),
      title: "ISO 9001:2015 Certification Achieved",
      category: "Award",
      status: "Published",
      publishDate: new Date().toISOString(),
      content: "<p>Aadishakti Group has successfully achieved ISO 9001:2015 certification, demonstrating our commitment to quality management systems.</p>",
      featuredImage: "",
      displayOnHome: true,
      displayOnNews: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  'careers.json': [
    {
      id: Date.now().toString(),
      title: "Production Manager",
      department: "Factory",
      location: "Mundra",
      type: "Full-time",
      experience: "5-8 years",
      salaryRange: "Negotiable",
      description: "<p>We are looking for an experienced Production Manager to oversee our Mundra facility operations.</p>",
      requirements: [
        "Bachelor's degree in Engineering",
        "5+ years in manufacturing",
        "Strong leadership skills"
      ],
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  'team.json': [
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
  ],

  'investors.json': {
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
  },

  'enquiries.json': [],
  'applications.json': []
};

async function initializeData() {
  console.log('\n🚀 Initializing Admin Panel Data...\n');

  try {
    // Create data directory
    await fs.mkdir(dataDir, { recursive: true });
    console.log('✅ Created data directory');

    // Create each data file
    for (const [filename, data] of Object.entries(defaultData)) {
      const filePath = path.join(dataDir, filename);
      
      try {
        // Check if file exists
        await fs.access(filePath);
        console.log(`⏭️  Skipped ${filename} (already exists)`);
      } catch {
        // File doesn't exist, create it
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Created ${filename}`);
      }
    }

    console.log('\n✨ Data initialization complete!\n');
    console.log('You can now start the backend server with: npm run dev\n');
  } catch (error) {
    console.error('\n❌ Error initializing data:', error);
    process.exit(1);
  }
}

initializeData();
