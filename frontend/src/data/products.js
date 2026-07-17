import { ASSETS } from "../assets/assetMap";

export const productsData = [
  {
    key: "pure-lead-ingots",
    num: "01",
    name: "Refined / Pure Lead Ingots",
    grade: "IS 27 : 1992 / BS 334 : 1982",
    purity: "99.97% – 99.985% Pb",
    img: ASSETS.products.pureLead,
    overview:
      "Aadishakti manufactures Refined Lead Ingots utilising high-temperature secondary refining kettles. Ideal for battery cell grids, acid-storage structures, radiation shields, and high-pressure extrusion sheaths.",
    specs: [
      { elem: "Lead (Pb)",      val: "99.970% min" },
      { elem: "Antimony (Sb)",  val: "0.001% max" },
      { elem: "Arsenic (As)",   val: "0.001% max" },
      { elem: "Tin (Sn)",       val: "0.001% max" },
      { elem: "Copper (Cu)",    val: "0.001% max" },
      { elem: "Dimensions",     val: "Custom / Approx 25kg Ingots" },
    ],
    packaging: "Bound with steel bands into 42 ingots per striped bundle (approx 1,000 Kg).",
    applications: [
      "Lead Acid Batteries",
      "Power Cables",
      "Radiation Shielding",
      "Chemical Plant Equipment"
    ]
  },
  {
    key: "lead-antimony-alloys",
    num: "02",
    name: "Lead Antimony Alloys",
    grade: "CUSTOM COMPONENT SPEC",
    purity: "Antimony: 1.5% to 12.0% Sb",
    img: ASSETS.products.leadAlloys,
    overview:
      "Compounded alloys utilising hard antimonial components to enhance tensile strength and grid hardness of soft pure lead. Primarily manufactured for automotive grid plates and wheel ballast counterweights.",
    specs: [
      { elem: "Antimonial Grade 2.5%", val: "2.3% – 2.7% Sb" },
      { elem: "Antimonial Grade 3.0%", val: "2.8% – 3.2% Sb" },
      { elem: "Antimonial Grade 4.5%", val: "4.2% – 4.8% Sb" },
      { elem: "Lead (Pb) Balance",      val: "Remaining %" },
      { elem: "Dimensions",             val: "Custom / Approx 25kg Ingots" },
    ],
    packaging: "Heavy-duty metallurgical bundles strapped with carbon steel bands.",
    applications: [
      "Automotive Battery Grids",
      "Wheel Weights",
      "Ammunition",
      "Heavy Machinery Ballast"
    ]
  },
  {
    key: "red-lead-oxide",
    num: "03",
    name: "Red Lead Oxide",
    grade: "Pb₃O₄ / BATTERY & GLASS GRADE",
    purity: "Formula: Pb₃O₄ | Soft Orange-Red Powder",
    img: ASSETS.products.redLead,
    overview:
      "Fine orange-red lead oxide powder produced from high-purity ingots. Advanced cyclone baghouse filtration ensures exceptional chemical consistency for backup power batteries and crystal glass flux.",
    specs: [
      { elem: "Lead Dioxide (PbO₂)", val: "25% – 34%" },
      { elem: "Free Metallic Lead",  val: "0.05% max" },
      { elem: "Moisture Content",    val: "0.1% max" },
      { elem: "Dimensions / Mesh",   val: "300 Mesh / 10-15 µm" },
    ],
    packaging: "25 Kg double-layer Polyethylene bags within woven HDPE outer sacks.",
    applications: [
      "Tubular Battery Positive Plates",
      "Crystal Glass Manufacturing",
      "Anti-corrosive Paints",
      "Ceramic Glazes"
    ]
  },
  {
    key: "grey-lead-oxide",
    num: "04",
    name: "Grey Lead Oxide",
    grade: "2PbO·Pb / LEAD SUB-OXIDE",
    purity: "Formula: 2PbO·Pb | Grey Monoxide Powder",
    img: ASSETS.products.greyOxide,
    overview:
      "Electrochemical sub-monoxide powder manufactured by dry ball mill process. Essential active plate chemical forming negative electrodes inside automotive battery cell grids.",
    specs: [
      { elem: "Free Metallic Lead (Pb)", val: "28% – 32%" },
      { elem: "Lead Monoxide (PbO)",     val: "68% – 72%" },
      { elem: "Apparent Density",        val: "1.2 – 1.4 g/cc" },
      { elem: "Dimensions / Mesh",       val: "300 Mesh / 10-15 µm" },
    ],
    packaging: "Hermetically sealed 25 Kg net Polyethylene bags within woven HDPE outer sacks.",
    applications: [
      "Automotive Battery Negative Plates",
      "Industrial Battery Grids",
      "Pigments",
      "Glass Manufacturing"
    ]
  },
  {
    key: "lead-sheet-plate",
    num: "05",
    name: "Lead Sheet & Lead Plate",
    grade: "RADIATION SHIELDING & INDUSTRIAL",
    purity: "99.97% Pb / Alloy Options Available",
    img: ASSETS.megaMenuPhoto || "", 
    overview:
      "Highly malleable lead sheets and thick lead plates designed for acoustic insulation, medical radiation shielding, chemical tank linings, and roofing applications.",
    specs: [
      { elem: "Purity",             val: "99.97% min Pb" },
      { elem: "Sheet Dimensions",   val: "Thickness: 0.5mm - 10mm" },
      { elem: "Plate Dimensions",   val: "Thickness: 10mm - 50mm" },
      { elem: "Customization",      val: "Cut-to-size available" },
    ],
    packaging: "Rolled on wooden cores or flat-packed on heavy duty pallets depending on thickness.",
    applications: [
      "X-Ray / MRI Room Shielding",
      "Acoustic Soundproofing",
      "Acid Tank Lining",
      "Roofing and Flashing"
    ]
  },
  {
    key: "lead-balls-anodes",
    num: "06",
    name: "Lead Balls & Lead Anodes",
    grade: "MILLING & ELECTROWINNING",
    purity: "Pure / Alloy Variants",
    img: ASSETS.mundraPlant ? ASSETS.mundraPlant[0] : "",
    overview:
      "Precision-cast lead balls used in fine chemical grinding ball mills, alongside high-performance extruded/cast lead anodes for electroplating and electrowinning cells.",
    specs: [
      { elem: "Ball Dimensions",    val: "12mm to 50mm Diameter" },
      { elem: "Anode Dimensions",   val: "Custom Lengths & Profiles" },
      { elem: "Alloys Available",   val: "Tin, Silver, Antimony" },
    ],
    packaging: "Drums for lead balls; strapped wooden crates for anodes.",
    applications: [
      "Electroplating",
      "Metal Refining",
      "Milling Processes",
      "Corrosion Protection"
    ]
  },
  {
    key: "alloy-dust",
    num: "07",
    name: "Alloy Dust (Customised Product)",
    grade: "SPECIALTY LEAD DUST",
    purity: "As per Client Specification",
    img: ASSETS.roorkeeOffice ? ASSETS.roorkeeOffice[0] : "",
    overview:
      "Customised lead alloy dust tailored for specialized chemical reactions, powder metallurgy, and proprietary industrial friction formulations. Engineered to precise particle size distributions.",
    specs: [
      { elem: "Particle Size",      val: "Custom (10 µm to 500 µm)" },
      { elem: "Composition",        val: "Custom Alloy Formula" },
      { elem: "Dimensions / Mesh",  val: "As per client requirement" },
    ],
    packaging: "Sealed nitrogen-purged UN-rated steel drums or bulk bags.",
    applications: [
      "Specialty Chemicals",
      "Friction Materials",
      "Powder Metallurgy",
      "Nuclear Shielding Putty"
    ]
  },
  {
    key: "plastic-granules",
    num: "08",
    name: "Plastic Granules",
    grade: "PP COPOLYMER GRANULES",
    purity: "High Impact Battery Grade",
    img: ASSETS.mundraPlant ? ASSETS.mundraPlant[4] : "",
    overview:
      "Recycled and compounded Polypropylene (PP) copolymer granules derived from battery casings. Extruded and pelletized for high-impact strength, suitable for molding new battery containers and automotive components.",
    specs: [
      { elem: "Melt Flow Index (MFI)", val: "2.0 - 5.0 g/10min" },
      { elem: "Impact Strength",       val: "High / Customisable" },
      { elem: "Dimensions",            val: "Standard Pellet Size (3mm)" },
      { elem: "Color",                 val: "Black / Grey / Custom" },
    ],
    packaging: "25 Kg bags or 1 MT Jumbo Bags.",
    applications: [
      "Battery Containers",
      "Automotive Plastics",
      "Injection Molding",
      "Industrial Packaging"
    ]
  }
];
