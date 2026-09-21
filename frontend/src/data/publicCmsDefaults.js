import { ASSETS } from '../assets/assetMap';

export const DEFAULT_SITE_NAVIGATION = {
  ctaText: 'GET IN TOUCH',
  companyPreviewImage: ASSETS.megaMenuPhoto,
  companyPreviewEyebrow: 'Est. 2004 · ISO 9001:2015',
  companyPreviewText: 'Two world-class plants. One standard of excellence.',
  companyLinks: [
    { to: '/about', label: 'About Us', sub: false },
    { to: '/businesses', label: 'Businesses', sub: false },
    { to: '/businesses?plant=mundra', label: 'AGRPL — Mundra Plant', sub: true },
    { to: '/businesses?plant=roorkee', label: 'AMRPL — Roorkee Plant', sub: true },
  ],
  esgLinks: [
    { to: '/sustainability?tab=environment', label: 'Environment & Climate', previewImage: ASSETS.mundraPlant[4], previewEyebrow: 'ZERO LIQUID DISCHARGE', previewText: 'Minimizing our environmental footprint through advanced recycling.' },
    { to: '/sustainability?tab=social', label: 'Corporate Social Responsibility', previewImage: ASSETS.gallery[3], previewEyebrow: 'COMMUNITY FIRST', previewText: 'Empowering local communities around our Mundra and Roorkee facilities.' },
    { to: '/sustainability?tab=governance', label: 'Governance & Policies', previewImage: ASSETS.roorkeeOffice[1], previewEyebrow: 'TRANSPARENCY', previewText: 'Upholding the highest standards of ethics and compliance.' },
    { to: '/sustainability?tab=reports', label: 'Sustainability Reports', previewImage: ASSETS.heroBg3, previewEyebrow: 'ESG REPORTING', previewText: 'Detailed disclosures of our environmental and social performance.' },
  ],
  mediaLinks: [
    { to: '/media?type=blogs', label: 'Blogs', previewImage: ASSETS.gallery[0], previewEyebrow: 'LATEST INSIGHTS', previewText: 'Read our latest technical blogs on lead recycling.' },
    { to: '/media?type=news', label: 'News', previewImage: ASSETS.gallery[1], previewEyebrow: 'COMPANY NEWS', previewText: "Stay updated with Aadishakti's latest announcements." },
  ],
  galleryLinks: [
    { to: '/gallery?category=office', label: 'Office', previewImage: ASSETS.roorkeeOffice[0], previewEyebrow: 'CORPORATE HUB', previewText: 'A glimpse inside our modern corporate headquarters.' },
    { to: '/gallery?category=plants', label: 'Plants', previewImage: ASSETS.mundraPlant[0], previewEyebrow: 'REFINING INFRASTRUCTURE', previewText: 'State-of-the-art lead smelting and refining facilities.' },
    { to: '/gallery?category=events', label: 'Events', previewImage: ASSETS.gallery[3], previewEyebrow: 'TEAM ENGAGEMENT', previewText: 'Highlights from our recent team building and conferences.' },
    { to: '/gallery?category=celebration', label: 'Celebration', previewImage: ASSETS.gallery[0], previewEyebrow: 'FESTIVITIES', previewText: 'Celebrating success and culture at Aadishakti.' },
  ],
  careerLinks: [
    { to: '/careers?category=factory', label: 'Factory', previewImage: ASSETS.mundraPlant[4], previewEyebrow: 'PLANT OPERATIONS', previewText: 'Drive industrial excellence at our Mundra and Roorkee plants.' },
    { to: '/careers?category=office', label: 'Office', previewImage: ASSETS.roorkeeOffice[1], previewEyebrow: 'CORPORATE ROLES', previewText: 'Shape the future of sustainable recycling from our HQ.' },
  ],
};

export const DEFAULT_SUSTAINABILITY_PAGE = {
  heroTitle: 'SUSTAINABILITY',
  heroImage: '',
  pillarsLabel: '// SUSTAINABILITY PILLARS',
  pillarsHeading: 'Environmental, Social & Governance',
  pillarsBackground: ASSETS.mundraPlant[16],
  pillars: [
    { title: 'Environmental', points: ['Zero Liquid Discharge — 100% wastewater recycled', 'Cyclone baghouse filtration on all smelting furnaces', 'Lead dust suppression to sub-micron standards'] },
    { title: 'Social', points: ['Occupational health & safety for all plant workers', 'Skill development and technical training programmes', 'Community welfare initiatives near operating sites'] },
    { title: 'Governance', points: ['ISO 9001:2015 & ISO 14001:2015 certified systems', 'Basel Convention compliance for all imports', 'Transparent regulatory reporting to PCB authorities'] },
  ],
  highlightLabel: '// ZERO LIQUID DISCHARGE',
  highlightHeading: '100% of wastewater recycled within plant premises — nothing reaches municipal drains.',
  highlightText: 'Our closed-circuit neutralisation systems convert battery acid into inert waste on-site. A commitment backed by Pollution Control Board authorisation at both facilities.',
  circularLabel: '// CIRCULAR ECONOMY',
  circularHeading: 'Zero Metallurgical Leakage',
  circularLead: 'Lead acid battery recovery protects delicate natural ecosystems by preventing raw mining extractions and transboundary hazard leaks. Aadishakti Group utilises closed-circuit smelting processes that return every atom of recoverable lead to productive use.',
  circularBody: 'By capturing battery acid and neutralising it inside secure chemical reaction wells, we yield pure secondary lead ingots with zero hazard leaks. Our refineries operate under absolute environmental permit approvals from state Pollution Control Boards.',
  circularFootnote: "Secondary lead refining consumes 35–40% less energy than primary lead production from ore — making Aadishakti's operations inherently lower-carbon than mining-based alternatives.",
  circularStats: [
    { value: '100%', label: 'Recycling Focus', description: 'Every tonne of battery scrap returned as refined product.' },
    { value: '35–40%', label: 'Less Energy', description: 'vs. primary lead production from mined ore.' },
    { value: 'ZLD', label: 'Zero Discharge', description: 'Closed-circuit wastewater management at both sites.' },
  ],
  activitiesLabel: '// CSR ACTIVITIES',
  activitiesHeading: 'Environmental Initiatives',
  activities: [
    { image: ASSETS.mundraPlant[6], title: 'Clean Air Initiative', description: 'Investment in multi-stage baghouse filtration systems that capture particulate matter before release, maintaining air quality standards around both plants.' },
    { image: ASSETS.mundraPlant[10], title: 'Wastewater Neutralisation', description: 'Sulphuric acid from battery electrolyte is neutralised in on-site chemical reaction chambers. Zero untreated effluent leaves our premises.' },
    { image: ASSETS.mundraPlant[7], title: 'Worker Safety Systems', description: 'Personal protective equipment, regular blood lead monitoring for all staff, enclosed material handling, and documented emergency response protocols.' },
    { image: ASSETS.mundraPlant[3], title: 'Circular Recovery Model', description: 'Every tonne of processed battery scrap returns fully to industrial supply chains as refined lead — preventing hazardous waste reaching landfills.' },
  ],
  certificationsLabel: '// CERTIFICATIONS',
  certificationsHeading: 'ESG Compliance Framework',
  certifications: [
    { name: 'ISO 14001:2015', description: 'Environmental Management System' },
    { name: 'PCB Compliance', description: 'Pollution Control Board Authorisation' },
    { name: 'ZLD Certified', description: 'Zero Liquid Discharge Operations' },
    { name: 'Basel Convention', description: 'Hazardous Waste Import Compliance' },
  ],
  ctaLabel: '// PARTNER WITH PURPOSE',
  ctaHeading: 'Work with an ISO-certified, ESG-committed lead recycler',
  ctaText: "Whether you're a buyer, seller, investor, or regulator — we welcome conversations about responsible industrial metal recovery.",
  ctaButton: 'Get In Touch →',
  ctaBackground: ASSETS.mundraPlant[15],
};

export const DEFAULT_INVESTORS_PAGE = {
  heroTitle: 'INVESTOR RELATION DESK',
  heroImage: '',
  metricsLabel: '// FINANCIAL METRICS',
  metricsHeading: 'KEY PERFORMANCE INDICATORS',
  kpis: [
    { label: 'Revenue Target FY26', value: '₹1,200 Cr', trend: '↑ 54%', highlighted: true },
    { label: 'Smelting Target FY26', value: '120,000 MT', trend: '↑ 71%', highlighted: true },
    { label: 'Active Revenue FY24', value: '₹780 Cr', trend: '↑ 50%', highlighted: false },
    { label: 'Operating EBITDA FY24', value: '₹118 Cr', trend: '→ Stable', highlighted: false },
  ],
  revenueChartTitle: 'PROJECTIONS REVENUE GROWTH',
  productionChartTitle: 'SMELTER PRODUCTION TREND',
  governanceLabel: '// COMPLIANCE AUDIT',
  governanceHeading: 'CORPORATE GOVERNANCE & TRANSPARENCY',
  governanceText: 'Aadishakti Group operates in full integration with Central and State Pollution Control Board mandates. Our smelters maintain zero hazardous emissions and Basel convention clearing certificates. Financial projections are audited routinely by third-party accounting networks, ensuring transparent capital growth.',
  certifications: ['ISO 9001:2015 REGISTERED', 'ISO 14001:2015 REGISTERED', 'ISO 45001:2018 REGISTERED', 'BASEL COMPLIANT'],
};

export const DEFAULT_SOURCING_PAGE = {
  heroTitle: 'SOURCING',
  heroImage: '',
  buyLabel: '// WE BUY',
  buyHeading: 'Procuring Lead-Rich Scrap Nationwide',
  buyIntroduction: "Aadishakti Group is one of India's largest secondary lead processors. We actively procure used lead-acid batteries and scrap materials from dismantlers, dealers, and industrial generators across India and internationally through Mundra Port.",
  materials: [
    { title: 'Used Lead Acid Batteries (ULAB)', description: 'Automotive, industrial, and telecom batteries — VRLA, tubular, and flat plate types accepted.' },
    { title: 'Battery Plates & Paste', description: 'Separated positive and negative plates, battery paste, and active material from dismantling operations.' },
    { title: 'Lead Dross & Slag', description: 'Smelting by-products including dross, slag, and other secondary lead-bearing materials.' },
    { title: 'Scrap Lead Cable Sheathing', description: 'Lead cable sheathing, pipes, and other lead-containing industrial scrap in bulk quantities.' },
  ],
  criteriaLabel: '// QUALITY STANDARDS',
  criteriaHeading: 'Acceptance Criteria',
  criteria: [
    { grade: 'Grade A', lead: '≥ 60% Pb', form: 'Whole batteries, intact', minimum: '5 MT', pricing: 'Premium pricing' },
    { grade: 'Grade B', lead: '50–60% Pb', form: 'Drained, cracked cases', minimum: '10 MT', pricing: 'Standard pricing' },
    { grade: 'Grade C', lead: '40–50% Pb', form: 'Mixed, plates only', minimum: '20 MT', pricing: 'Negotiated pricing' },
    { grade: 'Dross/Slag', lead: '25–45% Pb', form: 'Loose material, bags', minimum: '5 MT', pricing: 'Assay required' },
  ],
  importLabel: '// IMPORT CAPABILITY',
  importHeading: 'International Scrap Procurement',
  importLead: "Our Mundra facility (AGRPL) operates adjacent to Adani Port — one of India's largest private ports — enabling efficient customs clearance for international ULAB and lead scrap consignments under the Basel Convention framework.",
  importBody: 'We handle complete documentation: Pre-Shipment Inspection (PSI), Import NOC from Central Pollution Control Board, CDSCO clearances, and all statutory compliance for hazardous waste imports under Schedule IV of Hazardous Waste Rules.',
  importFacts: [
    { label: 'Import Port', value: 'Mundra, Gujarat' },
    { label: 'Port Code', value: 'INMUN' },
    { label: 'Compliance', value: 'Basel Convention' },
    { label: 'Turnaround', value: '48–72 hrs clearance' },
  ],
  contactHeading: 'Import & Procurement Desk',
  contactText: 'For bulk international procurement enquiries and pre-shipment discussions.',
  contactDetails: 'gourav.sharma@aadishakti.com · +91-8743000799',
  formLabel: '// GET IN TOUCH',
  formHeading: 'Start a Sourcing Conversation',
  formIntroduction: 'Whether you are a battery dismantler, scrap dealer, municipal collector, or overseas exporter — we invite you to connect. We offer competitive pricing, timely payment, and complete documentation support.',
  formSubmitButton: 'Submit Sourcing Enquiry →',
  formSuccessMessage: 'Your enquiry has been received. Our sourcing team will contact you within 24 hours.',
  sellerImage: ASSETS.mundraPlant[0],
  benefitsHeading: 'Why sell to Aadishakti?',
  benefits: ['Competitive market-linked pricing', 'Immediate payment terms available', 'Complete documentation support', 'ISO-certified processing facility', 'Basel Convention compliant import', 'Pan-India pickup network'],
  directContactLabel: 'Direct Sourcing Contact',
  directContactName: 'Rajesh Mehta',
  directContactRole: 'Head of Sourcing & Import',
  directContactPhone: '+91 8743 000 799',
  directContactPhoneHref: '+918743000799',
  directContactEmail: 'rajesh.mehta@aadishakti.com',
};

export const DEFAULT_MEDIA_PAGE = {
  heroTitle: 'MEDIA & UPDATES',
  heroImage: '',
  types: [{ id: 'blogs', label: 'BLOGS' }, { id: 'news', label: 'NEWS' }],
};

export const DEFAULT_GALLERY_PAGE = {
  heroTitle: 'OUR GALLERY',
  heroImage: '',
  categories: [
    { id: 'office', title: 'Corporate Office' },
    { id: 'plants', title: 'Manufacturing Plants' },
    { id: 'events', title: 'Corporate Events' },
    { id: 'celebration', title: 'Celebrations & Festivals' },
  ],
  emptyText: 'No images found for this category.',
};

export const DEFAULT_CAREERS_PAGE = {
  heroTitle: 'CAREERS',
  heroImage: '',
  sectionLabel: '// HUMAN RESOURCES',
  heading: 'CAREER PIPELINES',
  categories: [{ id: 'factory', name: 'Factory' }, { id: 'office', name: 'Office' }],
  emptyText: 'No roles available in this category currently.',
  applyButton: 'APPLY NOW →',
};

export const DEFAULT_HOME_PAGE = {
  heroPrimaryButton: 'Explore Operations',
  heroSecondaryButton: 'Investor Relations →',
  heroFacts: [
    { label: 'ISO 9001:2015', value: 'Quality Certified' },
    { label: 'LME Grade Lead', value: '99.97% Pb Min.' },
    { label: 'Est. 2004', value: 'Mundra · Roorkee' },
  ],
  heroStats: [
    { value: '50000', suffix: '+', label: 'Metric Tonnes PA' },
    { value: '20', suffix: '+', label: 'Years of Excellence' },
    { value: '2', suffix: '', label: 'World-Class Plants' },
  ],
  clientsLabel: 'Trusted by',
  clients: [
    { name: 'Exide Industries', image: '/trusted-logo/exide.png', height: '45px' },
    { name: 'Luminous Power Technologies', image: '/trusted-logo/luminous.jpg', height: '55px' },
    { name: 'Su-Kam Power Systems', image: '/trusted-logo/sukam.jpg', height: '55px' },
    { name: 'HBL Power Systems', image: '/trusted-logo/hbl.png', height: '40px' },
    { name: 'Okaya Power Group', image: '/trusted-logo/okaya.png', height: '55px' },
    { name: 'Rocket Electric', image: '/trusted-logo/rocket.jpeg', height: '50px' },
    { name: 'Genus Power Infrastructure', image: '/trusted-logo/genus.jpg', height: '45px' },
    { name: 'Livguard Energy', image: '/trusted-logo/livguard.png', height: '40px' },
  ],
  overviewLabel: '// WHO WE ARE',
  overviewHeading: 'With Over 20 Years of Operations',
  overviewLead: 'Aadishakti Group transforms used lead-acid battery scrap into high-purity refined products for energy storage and industrial applications. Through strategic smelting facilities in Mundra and Roorkee, we combine process discipline, scale, and supply consistency.',
  overviewBody: "Our Mundra facility (AGRPL) operates in Kutch, Gujarat, adjacent to Adani Port — giving us unmatched access to international battery scrap. Our Roorkee division (AMRPL) serves North India's major battery manufacturers with domestic supply consistency.",
  overviewFootnote: 'Committed to BIS standards, Basel Convention compliance, and zero-liquid-discharge operations, we deliver certified quality with environmental responsibility built in.',
  overviewStats: [
    { value: '50,000+', label: 'MT Annual Capacity' },
    { value: '₹1000+', label: 'Crore Group Turnover' },
    { value: '4+', label: 'Active Certifications' },
  ],
  overviewImages: [
    { image: ASSETS.mundraPlant[0], alt: 'Mundra plant exterior' },
    { image: ASSETS.mundraPlant[11], alt: 'Production floor' },
    { image: ASSETS.mundraPlant[4], alt: 'Plant overview' },
  ],
  entities: [
    { code: 'AGRPL', subtitle: 'Mundra Smelter Division', description: 'Export-oriented processing hub — 30,000 MT active, 120,000 MT by 2026. Port-adjacent logistics.', image: ASSETS.mundraPlant[0], tags: ['Mundra SEZ', 'ISO 9001:2015', 'Basel Compliant'], link: '/businesses?plant=mundra', button: 'Explore AGRPL →' },
    { code: 'AMRPL', subtitle: 'Roorkee Domestic Division', description: 'Domestic supply hub — 40,000 MT capacity. OES spectrograph quality lab. North India distribution.', image: ASSETS.roorkeeOffice[0], tags: ['Haridwar, UK', 'ISO 14001:2015', 'Hazardous Permit'], link: '/businesses?plant=roorkee', button: 'Explore AMRPL →' },
  ],
  strengthsLabel: '// WHY AADISHAKTI', strengthsHeading: 'Our Core Strengths', strengthsButton: 'Company Overview →',
  strengths: [
    { title: 'BIS Certified Quality', description: 'IS 27:1992 certified pure lead meeting Bureau of Indian Standards for battery and industrial use.' },
    { title: '20+ Years of Operations', description: 'Deep process knowledge and market relationships built over two decades in secondary lead refining.' },
    { title: 'LME Grade Purity', description: '99.97-99.985% Pb minimum — LME-registered quality accepted by global battery manufacturers.' },
    { title: 'Zero Liquid Discharge', description: '100% wastewater recycled within plant premises. Closed-circuit processes with PCB compliance.' },
    { title: 'ISO 9001:2015 Certified', description: 'Systematic quality management across procurement, smelting, refining, and dispatch operations.' },
    { title: 'Pan-India Distribution', description: 'Supply network reaching major battery manufacturers across North, West, and South India.' },
  ],
  productsLabel: '// PRODUCTS', productsHeading: 'Core Product Portfolio', productsButton: 'Full Product Catalog', productApplicationsLabel: 'Industry Applications',
  stats: [
    { value: '50000', suffix: '+', label: 'Metric Tonnes PA' },
    { value: '20', suffix: '+', label: 'Years of Operations' },
    { value: '2', suffix: '', label: 'World-Class Plants' },
    { value: '4', suffix: '+', label: 'Certifications' },
  ],
  sustainabilityLabel: '// SUSTAINABILITY', sustainabilityHeading: 'Responsible Circular Economy Practices',
  sustainabilityQuote: 'Lead recycling is the most efficient form of circular economy — returning full industrial value while protecting the environment from raw mining hazards.',
  sustainabilityButton: 'Our Sustainability Commitment →', sustainabilityImage: ASSETS.sustainabilityBg,
  sustainabilityStats: [
    { value: '100%', label: 'Battery Scrap Recycled — Nothing to Landfill' },
    { value: 'ZLD', label: 'Zero Liquid Discharge — All Water Recycled In-Plant' },
    { value: 'ISO', label: 'ISO 14001:2015 Environmental Management System' },
  ],
  investorsLabel: '// INVESTORS', investorsHeading: 'Performance & Growth Visibility', investorsTopButton: 'Open Investor Desk →', investorsBottomButton: 'Access Full Investor Dashboard →',
  investorCards: [
    { label: 'Revenue Growth', value: '↑ Consistent YoY', description: 'Multi-year track record of volume and revenue expansion.' },
    { label: 'Capacity Pipeline', value: '120,000 MT', description: 'Expansion to 120,000 MTPA by April 2026 at Mundra facility.' },
    { label: 'Export Share', value: '48% Volume', description: 'Nearly half of output serves international battery manufacturers.' },
  ],
};

export const DEFAULT_BUSINESSES_PAGE = {
  heroTitle: 'BUSINESSES', heroImage: '',
  divisions: [
    { id: 'mundra', label: '// AGRPL DIVISION', heading: 'MUNDRA SMELTER DIVISION', company: 'AADISHAKTI GREEN RECYCLING PVT. LTD.', lead: 'Located in the maritime economic corridor of Mundra Port Special Economic Zone (SEZ), Kutch, Gujarat. Serves as our sovereign gateway to transboundary logistics.', body: 'Launched in 2023, AGRPL operates high-capacity smelting and refining furnaces. Close port-proximity secures immediate transboundary vessel clearance within 48 hours of docking. Incorporates modern, baghouse air filtration units matching stringent international ecological guidelines.', image: '/plant/Plant Pic 02.jpeg', badges: ['ISO 9001:2015 CERTIFIED', 'BASEL COMPLIANT SMELTER'], contactLines: [], metrics: [{ value: '30,000 MT', label: 'Active Capacity' }, { value: '120,000 MT', label: 'Capacity by Apr 26' }, { value: '48% Export', label: 'Volume Share' }, { value: 'Mundra Port', label: 'Primary Node' }] },
    { id: 'roorkee', label: '// AMRPL DIVISION', heading: 'ROORKEE DOMESTIC DIVISION', company: 'AADISHAKTI METAL RECYCLING PVT. LTD.', lead: 'Located in the key industrial estate zone of Roorkee, Haridwar district, Uttarakhand. Serves as our primary domestic distribution division.', body: "Acquired in 2014 and restructured in 2023, AMRPL is a fully licensed recycler of hazardous battery wastes under strict regulatory authorization. Outfitted with comprehensive metallurgical pots, casting grids, and high-performance OES spectrographs. Delivers refined ingots directly to North India's major automotive grid manufacturers.", image: '/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg', badges: ['ISO 14001:2015 REGISTERED', 'HAZARDOUS RECYCLING PERMIT'], contactLines: [], metrics: [{ value: '40,000 MT', label: 'Active Capacity' }, { value: '100% Audit', label: 'Safety Compliant' }, { value: '2014 Acq.', label: 'Group Legacy' }, { value: 'OES Testing', label: 'Lab Analysis' }] },
    { id: 'pipe-coil', label: '// PIPE & COIL DIVISION', heading: 'METAL WORLD DIVISION', company: 'AADISHAKTI METAL WORLD LLP', lead: "Delhi-based wholesale trading and distribution entity specialising in high-precision Stainless Steel Pipes and Coils for India's industrial and infrastructure sectors.", body: "Incorporated in 2025, Aadishakti Metal World LLP supplies SS Pipes (0.23mm–0.55mm thickness) and SS Coils (0.25mm–1.45mm thickness) as per customer specifications. The entity extends the Aadishakti Group's footprint into stainless steel distribution, supported by the group's logistics network and industrial relationships.", image: '/plant/R1 (1).jpg', badges: ['SS PIPES & COILS', 'WHOLESALE DISTRIBUTOR'], contactLines: ['Sales: Mr. Sunil Pathak — DM Sales', '+91-8743000779 | sales.delhi@aadishakti.com'], metrics: [{ value: 'SS Pipes', label: '0.23–0.55mm' }, { value: 'SS Coils', label: '0.25–1.45mm' }, { value: '2025', label: 'Incorporated' }, { value: 'New Delhi', label: 'HQ Location' }] },
    { id: 'oxide', label: '// OXIDE DIVISION', heading: 'OXIDE MANUFACTURING DIVISION', company: 'AADISHAKTI METALS', lead: "Located at the Raipur Sahkari Industrial Area, Bhagwanpur, Roorkee — India's dedicated lead oxide manufacturing facility within the Aadishakti Group ecosystem.", body: 'Aadishakti Metals specialises in high-purity Lead Oxides — Red Lead (Pb₃O₄), Grey Lead Oxide / Lead Sub-Oxide (2PbO·Pb), and Litharge — produced using Pure Lead with a minimum purity of 99.98%. Advanced furnace systems, ball mill oxidation, filtration, and automated packing ensure consistent quality.', image: '/plant/Rotary 1.jpeg', badges: ['RED LEAD (Pb₃O₄)', 'GREY OXIDE', 'LITHARGE'], contactLines: [], metrics: [{ value: '99.98%', label: 'Lead Purity Input' }, { value: '3 Grades', label: 'Oxide Products' }, { value: 'Roorkee', label: 'Uttarakhand' }, { value: 'Ball Mill', label: 'Oxidation Process' }] },
  ],
};

export const DEFAULT_ABOUT_PAGE = {
  heroTitle: 'ABOUT US', heroImage: '',
  overviewLabel: '// WHO WE ARE', overviewHeading: 'A ₹1000+ Crore Industrial Conglomerate',
  overviewLead: 'Through strategic smelting facilities in Mundra (AGRPL) and Roorkee (AMRPL), Aadishakti Group has constructed a sovereign non-ferrous lead recycling ecosystem across India.',
  overviewBody: 'We import bulk battery waste residues (ISRI codes), refining them into 99.97%+ purified Refined Lead Ingots, Calcium-Antimony Alloys, and Lead Monoxides. We serve domestic automobile battery manufacturers and transboundary exporters with certified compliance.',
  overviewImage: ASSETS.mundraPlant[0], overviewImageCaption: 'MUNDRA PROCESSING HUB (AGRPL)',
  principlesLabel: '// OUR PHILOSOPHY', principlesHeading: 'The Metallurgical Principles',
  principles: [
    { title: 'Chemical Accuracy', description: 'Rigid laboratory analytics via OES spectrometers to deliver lead ingots of certified purity up to 99.985% Pb.' },
    { title: 'Safe Compliance', description: 'Complete Basel Convention alignment. Safe recycling of hazardous wastes under regulatory authorisation.' },
    { title: 'Sovereign Volume', description: 'Smelting capacity scaling up to 120,000 MTPA by April 2026 to capture domestic and export dominance.' },
  ],
  leadershipLabel: '// BOARD OF DIRECTORS', leadershipHeading: 'Leadership Team',
  leadership: [
    { name: 'Amit Goyal', image: ASSETS.founders.amitGoyal, role: 'CO-FOUNDER & DIRECTOR', bio: '“We engineered Aadishakti to finalise the loop of industrial metal recovery. Our secondary refineries deliver premium lead elements while protecting ecological grids from raw mining hazards.”' },
    { name: 'Anil Goel', image: ASSETS.founders.anilGoel, role: 'CO-FOUNDER & DIRECTOR', bio: '“Accuracy and volume are not contradictory metrics. Our upcoming automated smelting expansion in Mundra sets India’s modern benchmark for clean metallurgical production.”' },
  ],
  timelineLabel: '// COMPANY HISTORY', timelineHeading: 'The Chronological Roadmap', timelineIntroduction: 'Critical milestones that scaled Aadishakti into a top secondary metallurgical group.',
  timeline: [
    { year: '2004', title: 'First Operations', description: 'Established administrative and sourcing desk in New Delhi.' },
    { year: '2014', title: 'AMRPL — Roorkee', description: 'Acquired first secondary processing plant to service domestic battery manufacturers.' },
    { year: '2023', title: 'AGRPL — Mundra Flagship', description: 'Launched major smelting hub at Mundra SEZ for transboundary scrap intake.' },
    { year: '2026', title: '120,000 MT Scale-Up', description: 'Automated smelter complex expansion slated for April 2026 completion.' },
  ],
  certificationsLabel: '// QUALITY ASSURANCE', certificationsHeading: 'Our Certifications',
  certifications: [
    { name: 'ISO 9001:2015', description: 'Quality Management System', scope: 'Full manufacturing & dispatch cycle' },
    { name: 'ISO 14001:2015', description: 'Environmental Management System', scope: 'Mundra & Roorkee facilities' },
    { name: 'BIS Certified', description: 'Bureau of Indian Standards', scope: 'IS 27:1992 — Pure Lead Grade' },
    { name: 'Basel Convention', description: 'Transboundary Hazardous Waste', scope: 'International compliance certified' },
  ],
};

export const DEFAULT_CONTACT_PAGE = {
  heroTitle: 'CONTACT', heroImage: '', sectionLabel: '// CONNECT WITH US', heading: "LET'S TALK BUSINESS",
  introduction: "Engage with India's premier metallurgical refining conglomerate. Reach out to our plants or corporate headquarters directly.",
  locationsHeading: 'Plant Coordinates',
  locations: [
    { label: 'Corporate Office', value: '30, Third Floor, Shivaji Marg, Block C, Moti Nagar, New Delhi - 110015' },
    { label: 'AGRPL (Mundra Smelter)', value: 'Special Economic Zone (SEZ) Corridor, Mundra Port, Kutch, Gujarat - 370421' },
    { label: 'AMRPL (Roorkee Unit)', value: 'Industrial Estate Zone, Roorkee, Haridwar District, Uttarakhand - 247667' },
  ],
  phoneHeading: 'Direct Refineries Phone', phoneLines: ['Lead Sales: +91-8743000799', 'Pipe & Coil Division: +91-8743000779', 'Roorkee Unit: +91-9045585676'],
  emailHeading: 'Transmission Channels', emails: ['gourav.sharma@aadishakti.com', 'mundra.smelter@aadishakti.com', 'roorkee.smelter@aadishakti.com'],
  formLabel: '// BUSINESS ENQUIRY', formHeading: 'TRANSMIT AN INQUIRY', submitButton: 'TRANSMIT BUSINESS ENQUIRY',
  successMessage: 'TRANSBOUNDARY ENQUIRY TRANSMITTED SUCCESSFULLY. OUR METALLURGICAL TEAM WILL BE IN TOUCH SHORTLY.',
};

export const DEFAULT_FOOTER_CONTENT = {
  ctaLabel: '// PARTNER WITH US', ctaHeading: "Ready to source from India’s leading secondary lead group?", ctaText: 'Two world-class refineries. LME-grade purity. ISO 9001:2015 certified. Built for partnership.',
  primaryButton: 'Get In Touch →', secondaryButton: 'Sell Scrap →', brandStatement: '“Forging geological weight, absolute metallurgy, and ecological circular recovery.”',
  certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'BIS Certified', 'Basel Compliant'],
  quickLinks: [
    { to: '/', label: 'Home' }, { to: '/about', label: 'Corporate Overview' }, { to: '/products', label: 'Products Catalog' },
    { to: '/sustainability', label: 'Sustainability' }, { to: '/investors', label: 'Investor Relations' }, { to: '/careers', label: 'Careers' },
  ],
  entities: [
    { to: '/businesses?plant=mundra', code: 'AGRPL', name: 'Mundra Plant', location: 'Kutch, Gujarat' },
    { to: '/businesses?plant=roorkee', code: 'AMRPL', name: 'Roorkee Plant', location: 'Haridwar, Uttarakhand' },
    { to: '/sourcing', code: 'IMP', name: 'Sourcing Desk', location: 'Battery Scrap Procurement' },
    { to: '/about', code: 'HQ', name: 'Corporate HQ', location: 'New Delhi 110015' },
  ],
  address: '30, Third Floor, Shivaji Marg, Moti Nagar, New Delhi 110015', phone: '+91 87430 00799', email: 'gourav.sharma@aadishakti.com', cin: 'L27109DL1994PTC058925', established: 'Established 2004 · New Delhi, India',
  linkedinUrl: 'https://www.linkedin.com/company/aadishakti-group-aadishakti-metal-recycling-pvt-ltd',
  xUrl: 'https://twitter.com',
  bottomBadges: ['ISO 9001:2015', 'ISO 14001:2015', 'BIS IS 27:1992', 'Made in India'],
};

export const DEFAULT_PAGE_HERO_IMAGES = {
  'ABOUT US': ASSETS.founders.anilGoel,
  BUSINESSES: ASSETS.mundraPlant[0],
  PRODUCTS: ASSETS.products.leadAlloys,
  SUSTAINABILITY: ASSETS.sustainabilityBg,
  INVESTORS: ASSETS.mundraPlant[2],
  CAREERS: ASSETS.roorkeeOffice[0],
  CONTACT: ASSETS.roorkeeOffice[1],
  SOURCING: ASSETS.mundraPlant[8],
  MEDIA: ASSETS.heroFallback,
  GALLERY: ASSETS.heroFallback,
  'CUSTOM ALLOY': ASSETS.heroFallback,
};

export const mergeCmsContent = (defaults, value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;
  return { ...defaults, ...value };
};
