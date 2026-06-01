import React, { useState } from "react";
import { buildApiUrl } from "../config/api";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { MapPin, Phone, Mail, Check, Loader2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    workEmail: "",
    phone: "",
    inquiryType: "Product Inquiry",
    products: [],
    additionalDetails: "",
    country: "India", // added default for server satisfaction
    estimatedQuantity: "Not decided yet",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductToggle = (product) => {
    setFormData((prev) => {
      const isSelected = prev.products.includes(product);
      const newProducts = isSelected
        ? prev.products.filter((p) => p !== product)
        : [...prev.products, product];
      return { ...prev, products: newProducts };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(buildApiUrl("/api/enquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resJson = await response.json();
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
        phone: "",
        inquiryType: "Product Inquiry",
        products: [],
        additionalDetails: "",
        country: "India",
        estimatedQuantity: "Not decided yet",
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

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="ENGAGE INFRASTRUCTURE" activePage="CONTACT" />

      <section className="section-padding" style={{ background: "var(--bg-secondary)" }}>
        <div className="container">
          <ScrollReveal>
            <div className="grid-2" style={{ gridTemplateColumns: "0.8fr 1.2fr", gap: "60px", alignItems: "start" }}>
              
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
                        HQ Desk: +91-8743000299, +91-8743000799
                      </p>
                      <p style={{ color: "var(--silver)", fontSize: "13px", fontFamily: "var(--font-mono)", marginBottom: "0.25rem" }}>
                        Mundra Unit: +91-8743000779
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
                        <a href="mailto:marketing@aadishakti.com" style={{ color: "var(--text-primary)", textDecoration: "underline" }}>marketing@aadishakti.com</a>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "2rem" }}>
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
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
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

                  {/* Custom Checkboxes: Products of Interest */}
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
                      PRODUCTS OF INTEREST
                    </label>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {productOptions.map((prod) => {
                        const isChecked = formData.products.includes(prod);
                        return (
                          <div
                            key={prod}
                            onClick={() => handleProductToggle(prod)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              cursor: "pointer",
                              padding: "8px",
                              userSelect: "none",
                            }}
                          >
                            {/* Custom Red Checkbox Frame */}
                            <div
                              style={{
                                width: "18px",
                                height: "18px",
                                border: `1.5px solid ${isChecked ? "var(--red-core)" : "var(--ash)"}`,
                                background: isChecked ? "var(--red-core)" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.25s ease",
                              }}
                            >
                              {isChecked && <Check size={12} strokeWidth={3} style={{ color: "var(--text-primary)" }} />}
                            </div>
                            <span style={{ fontSize: "13px", color: isChecked ? "var(--white)" : "var(--silver)", transition: "color 0.25s" }}>
                              {prod}
                            </span>
                          </div>
                        );
                      })}
                    </div>
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




