export const DEFAULT_CUSTOM_ALLOY_CONTENT = {
  heroTitle: "CUSTOM ALLOY",
  breadcrumbLabel: "CUSTOM ALLOY",
  heroImage: "",
  sectionLabel: "// ENGINEERING SPECIFICATIONS",
  heading: "Request a Custom Alloy Quote",
  introduction:
    "Define your required metallurgical composition. Our technical team will review your specifications and return a formal analysis and quotation.",
  metallurgicalHeading: "Metallurgical Specification",
  notesLabel: "Additional Notes / Specific Requirements",
  notesPlaceholder: "Any packaging requirements, delivery timelines, etc.",
  uploadLabel: "Upload Specification / Custom Requirement (Optional)",
  uploadPrompt:
    "Drag & drop or click to upload your specification sheet, RFQ, or custom requirement document",
  uploadHint: "PDF, DOC, DOCX — Max 10MB",
  submitButton: "Submit Request",
  successTitle: "Request Submitted Successfully",
  successMessage:
    "Thank you for your request. Our metallurgy team will review your specifications and get back to you with a quotation shortly.",
  successButton: "Submit Another Request",
  packagingOptions: [
    { value: "Wooden Pallet (Strapped Ingots)", label: "Wooden Pallet — Strapped Ingots (Standard)" },
    { value: "Jumbo Bag / FIBC", label: "Jumbo Bag / FIBC (Bulk Granules, Oxide, Powder)" },
    { value: "HDPE Drum", label: "HDPE Drum (Oxide, Powder, Small Parts)" },
    { value: "Loose / Bulk", label: "Loose / Bulk (Large Volume Orders)" },
    { value: "Custom / As Discussed", label: "Custom / As Per Requirement" },
  ],
  alloyElements: [
    { key: "antimony", name: "Antimony (Sb)", defaultVal: "0.001% max" },
    { key: "arsenic", name: "Arsenic (As)", defaultVal: "0.001% max" },
    { key: "tin", name: "Tin (Sn)", defaultVal: "0.001% max" },
    { key: "copper", name: "Copper (Cu)", defaultVal: "0.001% max" },
    { key: "bismuth", name: "Bismuth (Bi)", defaultVal: "0.015% max" },
    { key: "silver", name: "Silver (Ag)", defaultVal: "0.003% max" },
    { key: "iron", name: "Iron (Fe)", defaultVal: "0.001% max" },
    { key: "lead", name: "Lead (Pb)", defaultVal: "99.970% min" },
  ],
};

export function normalizeCustomAlloyContent(value = {}) {
  return {
    ...DEFAULT_CUSTOM_ALLOY_CONTENT,
    ...value,
    packagingOptions:
      Array.isArray(value.packagingOptions)
        ? value.packagingOptions
        : DEFAULT_CUSTOM_ALLOY_CONTENT.packagingOptions,
    alloyElements:
      Array.isArray(value.alloyElements)
        ? value.alloyElements
        : DEFAULT_CUSTOM_ALLOY_CONTENT.alloyElements,
  };
}
