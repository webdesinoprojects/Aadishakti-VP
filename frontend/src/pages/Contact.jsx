import { useState } from "react";
import { buildApiUrl } from "../config/api";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { MapPin, Phone, Mail, Check, Loader2, Paperclip, X } from "lucide-react";
import { allCountryOptions } from "../utils/countries";
import CountrySelect from "../components/CountrySelect";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    workEmail: "",
    phoneCode: "+91",
    phone: "",
    inquiryType: "Product Inquiry",
    productsOfInterest: [],
    additionalDetails: "",
    country: "India",
    estimatedQuantity: "Not decided yet",
    materialTypes: [],
    packagingRequirement: "",
    specFile: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "whatsapp") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 10485760) {
      setFormData(prev => ({ ...prev, specFile: file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleProductSelect = (product) => {
    setFormData((prev) => {
      const currentProducts = prev.productsOfInterest || [];
      const isSelected = currentProducts.includes(product);
      const newProducts = isSelected
        ? currentProducts.filter(p => p !== product)
        : [...currentProducts, product];
      return { ...prev, productsOfInterest: newProducts };
    });
  };

  const handleMaterialSelect = (material) => {
    setFormData((prev) => {
      const currentMaterials = prev.materialTypes || [];
      const isSelected = currentMaterials.includes(material);
      const newMaterials = isSelected
        ? currentMaterials.filter(m => m !== material)
        : [...currentMaterials, material];
      return { ...prev, materialTypes: newMaterials };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    if (!formData.productsOfInterest || formData.productsOfInterest.length === 0) {
      setSubmitStatus({ type: "error", msg: "PLEASE SELECT AT LEAST ONE PRODUCT OF INTEREST." });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        phone: `${formData.phoneCode} ${formData.phone}`,
        products: formData.productsOfInterest,
        materials: formData.materialTypes
      };
      const response = await fetch(buildApiUrl("/api/enquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let resJson = {};
      try {
        resJson = await response.json();
      } catch (e) {
        // Safely ignore empty responses
      }

      if (!response.ok) {
        throw new Error(resJson.error || "Failed to transmit enquiry.");
      }

      setSubmitStatus({
        type: "success",
        msg: "TRANSBOUNDARY ENQUIRY TRANSMITTED SUCCESSFULLY. OUR METALLURGICAL CORNER WILL BE IN TOUCH SHORTLY.",
      });

      // Clear Form
      setFormData({
        fullName: "",
        companyName: "",
        workEmail: "",
        phoneCode: "+91",
        phone: "",
        inquiryType: "Product Inquiry",
        productsOfInterest: [],
        additionalDetails: "",
        country: "India",
        estimatedQuantity: "Not decided yet",
        materialTypes: [],
        packagingRequirement: "",
        specFile: null,
      });
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        type: "error",
        msg: err.message || "COULD NOT LOG ENQUIRY METRICS. PLEASE TRY AGAIN.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const productOptions = [
    "Refined Lead Ingots",
    "Lead Alloys",
    "Red Lead Oxide",
    "Lead Sub Oxide (Grey Oxide)",
  ];

  const materialOptionsByProduct = {
    "Refined Lead Ingots": ["Ingots (25 kg)", "Jumbo Ingots (1 MT)"],
    "Lead Alloys": ["Ingots (25 kg)", "Jumbo Ingots (1 MT)"],
    "Red Lead Oxide": ["Powder", "Jumbo Bag / FIBC", "HDPE Drum"],
    "Lead Sub Oxide (Grey Oxide)": ["Powder", "Jumbo Bag / FIBC", "HDPE Drum"],
  };

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="CONTACT" activePage="CONTACT" />

      <section className="section-padding" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <ScrollReveal>
            <div className="contact-layout-grid">
              
              {/* LEFT COLUMN: 40% */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                <div>
                  <SectionLabel text="// CONNECT WITH US" />
                  <h2
                    style={{
                      fontFamily: "var(--font-primary)",
                      fontWeight: "900",
                      fontSize: "var(--fs-h2)",
                      color: "var(--text-primary)",
                      textTransform: "uppercase",
                      lineHeight: "0.95",
                      marginBottom: "1.5rem",
                    }}
                  >
                    LET'S TALK BUSINESS
                  </h2>
                  <p style={{ color: "var(--silver)", fontSize: "var(--fs-body)", lineHeight: "1.6" }}>
                    Engage with India's premier metallurgical refining conglomerate. Reach out to our plants or corporate headquarters directly.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* Plant Locations Row */}
                  <div
                    style={{
                      padding: "24px 0",
                      borderBottom: "1px solid var(--border-light)",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ padding: "8px", background: "var(--red-glow)", border: "1px solid var(--red-core)" }}>
                      <MapPin size={20} style={{ color: "var(--red-core)" }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-primary)", fontWeight: "700", fontSize: "14px", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        Plant Coordinates
                      </h4>
                      <p style={{ color: "var(--silver)", fontSize: "13px", lineHeight: "1.6", marginBottom: "0.5rem" }}>
                        <strong>Corporate Office:</strong> 30, Third Floor, Shivaji Marg, Block C, Moti Nagar, New Delhi - 110015
                      </p>
                      <p style={{ color: "var(--silver)", fontSize: "13px", lineHeight: "1.6", marginBottom: "0.5rem" }}>
                        <strong>AGRPL (Mundra Smelter):</strong> Special Economic Zone (SEZ) Corridor, Mundra Port, Kutch, Gujarat - 370421
                      </p>
                      <p style={{ color: "var(--silver)", fontSize: "13px", lineHeight: "1.6" }}>
                        <strong>AMRPL (Roorkee Unit):</strong> Industrial Estate Zone, Roorkee, Haridwar District, Uttarakhand - 247667
                      </p>
                    </div>
                  </div>

                  {/* Phone Numbers Row */}
                  <div
                    style={{
                      padding: "24px 0",
                      borderBottom: "1px solid var(--border-light)",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ padding: "8px", background: "var(--red-glow)", border: "1px solid var(--red-core)" }}>
                      <Phone size={20} style={{ color: "var(--red-core)" }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-primary)", fontWeight: "700", fontSize: "14px", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        Direct Refineries Phone
                      </h4>
                      <p style={{ color: "var(--silver)", fontSize: "13px", fontFamily: "var(--font-mono)", marginBottom: "0.25rem" }}>
                        Lead Sales: +91-8743000799
                      </p>
                      <p style={{ color: "var(--silver)", fontSize: "13px", fontFamily: "var(--font-mono)", marginBottom: "0.25rem" }}>
                        Pipe & Coil Division: +91-8743000779
                      </p>
                      <p style={{ color: "var(--silver)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
                        Roorkee Unit: +91-9045585676
                      </p>
                    </div>
                  </div>

                  {/* Emails Row */}
                  <div
                    style={{
                      padding: "24px 0",
                      borderBottom: "1px solid var(--border-light)",
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ padding: "8px", background: "var(--red-glow)", border: "1px solid var(--red-core)" }}>
                      <Mail size={20} style={{ color: "var(--red-core)" }} />
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-primary)", fontWeight: "700", fontSize: "14px", color: "var(--text-primary)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        Transmission Channels
                      </h4>
                      <p style={{ fontSize: "13px", fontFamily: "var(--font-mono)", marginBottom: "0.25rem" }}>
                        <a href="mailto:gourav.sharma@aadishakti.com" style={{ color: "var(--text-primary)", textDecoration: "underline" }}>gourav.sharma@aadishakti.com</a>
                        <span style={{ color: "var(--text-muted)", fontSize: "11px", marginLeft: "8px" }}>(Lead Sales)</span>
                      </p>
                      <p style={{ fontSize: "13px", fontFamily: "var(--font-mono)", marginBottom: "0.25rem" }}>
                        <a href="mailto:mundra.smelter@aadishakti.com" style={{ color: "var(--silver)" }}>mundra.smelter@aadishakti.com</a>
                      </p>
                      <p style={{ fontSize: "13px", fontFamily: "var(--font-mono)" }}>
                        <a href="mailto:roorkee.smelter@aadishakti.com" style={{ color: "var(--silver)" }}>roorkee.smelter@aadishakti.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 60% */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid var(--border-light)",
                  borderLeft: "3px solid var(--red-core)",
                  padding: "40px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontWeight: "800",
                    fontSize: "20px",
                    color: "var(--text-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "2rem",
                  }}
                >
                  TRANSMIT AN INQUIRY
                </h3>

                {submitStatus && (
                  <div
                    style={{
                      background: submitStatus.type === "success" ? "rgba(46, 204, 113, 0.08)" : "rgba(231, 76, 60, 0.08)",
                      border: `1px solid ${submitStatus.type === "success" ? "#2ECC71" : "var(--red-core)"}`,
                      padding: "16px",
                      marginBottom: "2rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: submitStatus.type === "success" ? "#2ECC71" : "var(--red-bright)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {submitStatus.msg}
                  </div>
                )}

                <form onSubmit={handleFormSubmit}>
                  {/* Name Input */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      FULL NAME*
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Director of Procurement"
                      style={{
                        width: "100%",
                        minWidth: 0,
                        background: "transparent",
                        border: "none",
                        borderBottom: "1.5px solid var(--steel)",
                        color: "var(--text-primary)",
                        padding: "10px 0",
                        fontFamily: "var(--font-primary)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-bottom 0.3s ease",
                      }}
                      className="custom-contact-input white-contact-input"
                    />
                  </div>

                  {/* Company Name Input */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      COMPANY NAME*
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Mahindra Automotive Ltd."
                      style={{
                        width: "100%",
                        minWidth: 0,
                        background: "transparent",
                        border: "none",
                        borderBottom: "1.5px solid var(--steel)",
                        color: "var(--text-primary)",
                        padding: "10px 0",
                        fontFamily: "var(--font-primary)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-bottom 0.3s ease",
                      }}
                      className="custom-contact-input white-contact-input"
                    />
                  </div>

                  {/* Two Column Grid */}
                  <div className="grid-2" style={{ gap: "24px", marginBottom: "2rem" }}>
                    {/* Work Email */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-primary)",
                          fontWeight: "600",
                          fontSize: "11px",
                          letterSpacing: "0.15em",
                          color: "var(--silver)",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        WORK EMAIL*
                      </label>
                      <input
                        type="email"
                        name="workEmail"
                        required
                        value={formData.workEmail}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        style={{
                          width: "100%",
                          minWidth: 0,
                          background: "transparent",
                          border: "none",
                          borderBottom: "1.5px solid var(--steel)",
                          color: "var(--text-primary)",
                          padding: "10px 0",
                          fontFamily: "var(--font-primary)",
                          fontSize: "14px",
                          outline: "none",
                          transition: "border-bottom 0.3s ease",
                        }}
                        className="custom-contact-input white-contact-input"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-primary)",
                          fontWeight: "600",
                          fontSize: "11px",
                          letterSpacing: "0.15em",
                          color: "var(--silver)",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        PHONE NUMBER*
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <CountrySelect
                          name="phoneCode"
                          value={formData.phoneCode}
                          onChange={handleInputChange}
                          style={{
                            width: "120px",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1.5px solid var(--steel)",
                            color: "var(--text-primary)",
                            padding: "10px 0",
                            fontFamily: "var(--font-primary)",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-bottom 0.3s ease",
                            cursor: "pointer",
                          }}
                          className="custom-contact-input white-contact-input"
                        />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="XXXXX XXXXX"
                          pattern="[0-9]{10,15}"
                          minLength={10}
                          style={{
                            flex: 1,
                            width: "100%",
                            minWidth: 0,
                            background: "transparent",
                            border: "none",
                            borderBottom: "1.5px solid var(--steel)",
                            color: "var(--text-primary)",
                            padding: "10px 0",
                            fontFamily: "var(--font-primary)",
                            fontSize: "14px",
                            outline: "none",
                            transition: "border-bottom 0.3s ease",
                          }}
                          className="custom-contact-input white-contact-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Type Dropdown */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      INQUIRY TYPE*
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      style={{
                        width: "100%",
                        background: "var(--iron)",
                        border: "1px solid var(--border-light)",
                        color: "var(--text-primary)",
                        padding: "12px 16px",
                        fontFamily: "var(--font-primary)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.3s",
                      }}
                      className="custom-contact-select"
                    >
                      <option value="Product Inquiry">Product Inquiry (Domestic)</option>
                      <option value="International Export">International Export Desk</option>
                      <option value="Price / Quotation Request">Price / Quotation Request</option>
                      <option value="Bulk Purchase Agreement">Bulk Purchase Agreement</option>
                      <option value="Battery Scrap Supply">Battery Scrap Supply Partner</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                      }}
                    >
                      PRODUCT OF INTEREST*
                    </label>
                    
                    <div className="grid-2" style={{ gap: "12px" }}>
                      {productOptions.map((prod) => {
                        const isChecked = formData.productsOfInterest.includes(prod);
                        return (
                          <div
                            key={prod}
                            onClick={() => handleProductSelect(prod)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              cursor: "pointer",
                              padding: "12px",
                              background: isChecked ? "rgba(231, 76, 60, 0.1)" : "var(--bg-primary)",
                              border: `1px solid ${isChecked ? "var(--red-core)" : "var(--border-light)"}`,
                              borderRadius: "4px",
                              userSelect: "none",
                              transition: "all 0.2s ease"
                            }}
                          >
                            <div
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                border: `2px solid ${isChecked ? "var(--red-core)" : "var(--ash)"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.25s ease",
                              }}
                            >
                              {isChecked && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--red-core)" }} />}
                            </div>
                            <span style={{ fontSize: "13px", color: isChecked ? "var(--white)" : "var(--silver)", fontWeight: isChecked ? "600" : "400", transition: "color 0.25s" }}>
                              {prod}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Material Type Dropdown */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      TYPE OF MATERIAL*
                    </label>
                    <div className="grid-2" style={{
                      gap: "12px",
                      opacity: formData.productsOfInterest.length === 0 ? 0.5 : 1,
                      pointerEvents: formData.productsOfInterest.length === 0 ? "none" : "auto"
                    }}>
                      {formData.productsOfInterest.length === 0 ? (
                        <div style={{ gridColumn: "span 2", fontSize: "13px", color: "var(--silver)", padding: "12px", background: "var(--iron)", border: "1px solid var(--border-light)" }}>
                          Select at least one product first
                        </div>
                      ) : (
                        Array.from(new Set(
                          formData.productsOfInterest.flatMap(p => materialOptionsByProduct[p] || [])
                        )).map((mat) => {
                          const isChecked = formData.materialTypes.includes(mat);
                          return (
                            <div
                              key={mat}
                              onClick={() => handleMaterialSelect(mat)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                cursor: "pointer",
                                padding: "12px",
                                background: isChecked ? "rgba(231, 76, 60, 0.1)" : "var(--bg-primary)",
                                border: `1px solid ${isChecked ? "var(--red-core)" : "var(--border-light)"}`,
                                borderRadius: "4px",
                                userSelect: "none",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <div
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  borderRadius: "50%",
                                  border: `2px solid ${isChecked ? "var(--red-core)" : "var(--ash)"}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "all 0.25s ease",
                                }}
                              >
                                {isChecked && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--red-core)" }} />}
                              </div>
                              <span style={{ fontSize: "13px", color: isChecked ? "var(--white)" : "var(--silver)", fontWeight: isChecked ? "600" : "400", transition: "color 0.25s" }}>
                                {mat}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Packaging Requirement Input */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      PACKAGING REQUIREMENT
                    </label>
                    <input
                      type="text"
                      name="packagingRequirement"
                      value={formData.packagingRequirement}
                      onChange={handleInputChange}
                      placeholder="e.g. 25kg bags, 1MT Jumbo Bags, Wooden Pallets"
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1.5px solid var(--steel)",
                        color: "var(--text-primary)",
                        padding: "10px 0",
                        fontFamily: "var(--font-primary)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-bottom 0.3s ease",
                      }}
                      className="custom-contact-input white-contact-input"
                    />
                  </div>

                  {/* Upload Specifications */}
                  <div style={{ marginBottom: "2rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                      }}
                    >
                      UPLOAD SPECIFICATION / RFQ DOCUMENT (Optional)
                    </label>
                    
                    <div
                      style={{
                        border: "2px dashed var(--steel)",
                        borderRadius: "4px",
                        padding: "20px 24px",
                        background: "transparent",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => document.getElementById("contact-file-upload").click()}
                    >
                      <Paperclip size={20} color="var(--red-core)" style={{ flexShrink: 0 }} />
                      {formData.specFile ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", wordBreak: "break-all" }}>{formData.specFile.name}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>({(formData.specFile.size / 1024).toFixed(1)} KB)</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setFormData(prev => ({...prev, specFile: null})); }}
                            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: "13px", color: "var(--text-primary)", margin: 0, fontFamily: "var(--font-primary)" }}>
                            <span style={{ fontWeight: 700, color: "var(--red-core)" }}>Drag & drop</span> document or <span style={{ fontWeight: 700, color: "var(--red-core)" }}>click to attach</span>
                          </p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-primary)" }}>Max 10MB file size</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="contact-file-upload"
                      type="file"
                      name="specFile"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.size <= 10485760) {
                          setFormData(prev => ({...prev, specFile: file}));
                        }
                      }}
                    />
                  </div>

                  {/* Message Input */}
                  <div style={{ marginBottom: "2.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "var(--font-primary)",
                        fontWeight: "600",
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        color: "var(--silver)",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      MESSAGE / SPECIFICATIONS
                    </label>
                    <textarea
                      name="additionalDetails"
                      rows="4"
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                      placeholder="Specify metallurgical standards, desired volumes, or compliance mandates..."
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1.5px solid var(--steel)",
                        color: "var(--text-primary)",
                        padding: "10px 0",
                        fontFamily: "var(--font-primary)",
                        fontSize: "14px",
                        outline: "none",
                        resize: "none",
                        transition: "border-bottom 0.3s ease",
                      }}
                      className="custom-contact-input white-contact-input"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      background: "var(--red-core)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-primary)",
                      fontWeight: "700",
                      fontSize: "13px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      border: "none",
                      height: "52px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                      borderRadius: "2px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 16px rgba(231,76,60,0.3)",
                    }}
                    className="custom-contact-submit-btn"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        TRANSMITTING...
                      </>
                    ) : (
                      "TRANSMIT BUSINESS ENQUIRY"
                    )}
                  </button>
                </form>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Embedded CSS for form effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-contact-input::placeholder {
          color: var(--muted);
          opacity: 0.7;
        }
        .custom-contact-input:focus {
          border-bottom-color: var(--red-core) !important;
        }
        .custom-contact-select:focus {
          border-color: var(--red-core) !important;
        }
        .custom-contact-submit-btn:hover:not(:disabled) {
          background-color: var(--red-bright) !important;
          box-shadow: 0 6px 24px rgba(231, 76, 60, 0.45) !important;
          transform: translateY(-1px);
        }
        .custom-contact-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}




