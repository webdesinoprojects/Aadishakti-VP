import React, { useState } from "react";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    phone: "",
    companyName: "",
    country: "",
    inquiryType: "Product Inquiry",
    products: [],
    estimatedQuantity: "Not decided yet",
    additionalDetails: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const products = checked
        ? [...prev.products, value]
        : prev.products.filter((p) => p !== value);
      return { ...prev, products };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    if (formData.products.length === 0) {
      setSubmitStatus({ type: "error", msg: "Please select at least one metal of interest." });
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Could not log enquiry metrics.");
      }

      setSubmitStatus({
        type: "success",
        msg: "Enquiry logged successfully! Our domestic/export desk will connect with a quote shortly.",
      });
      setFormData({
        fullName: "",
        workEmail: "",
        phone: "",
        companyName: "",
        country: "",
        inquiryType: "Product Inquiry",
        products: [],
        estimatedQuantity: "Not decided yet",
        additionalDetails: "",
      });
    } catch (err) {
      console.error(err);
      setSubmitStatus({ type: "error", msg: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// ENQUIRY PORTAL</div>
        <h2 className="section-title-large">LOG TRANSBOUNDARY INQUIRY</h2>

        <div className="grid-2" style={{ gap: "4rem", alignItems: "start" }}>
          
          {/* Left: Smelter coordinates */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* New Delhi HQ */}
            <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
              <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "18px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={20} style={{ color: "var(--color-scarlet)" }} /> Corporate Headquarters
              </h3>
              <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1rem" }}>
                30, Third Floor, Shivaji Marg, Block C, Adjacent to Jaguar Amp Motors, Moti Nagar, New Delhi - 110015
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "13px", color: "var(--color-platinum)", fontFamily: "var(--font-mono)" }}>
                <span><strong>Phone:</strong> +91-8743000299, +91-8743000799</span>
                <span><strong>Email:</strong> <a href="mailto:marketing@aadishakti.com" style={{ textDecoration: "underline", color: "var(--color-scarlet)" }}>marketing@aadishakti.com</a></span>
              </div>
            </div>

            {/* Mundra Smelter */}
            <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
              <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "18px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={20} style={{ color: "var(--color-scarlet)" }} /> Mundra Smelter (AGRPL)
              </h3>
              <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1rem" }}>
                Aadishakti Green Recycling Pvt. Ltd., Special Economic Zone (SEZ) Corridor, Mundra Port, Kutch, Gujarat - 370421
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "13px", color: "var(--color-platinum)", fontFamily: "var(--font-mono)" }}>
                <span><strong>Phone:</strong> +91-8743000779</span>
                <span><strong>Email:</strong> <a href="mailto:mundra.smelter@aadishakti.com" style={{ textDecoration: "underline", color: "var(--color-scarlet)" }}>mundra.smelter@aadishakti.com</a></span>
              </div>
            </div>

            {/* Roorkee Smelter */}
            <div className="dominance-card" style={{ borderLeft: "3px solid var(--color-steel)" }}>
              <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "18px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={20} style={{ color: "var(--color-silver)" }} /> Roorkee Processing Unit (AMRPL)
              </h3>
              <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.6", marginBottom: "1rem" }}>
                Aadishakti Metal Recycling Pvt. Ltd., Industrial Estate Zone, Roorkee, Haridwar District, Uttarakhand - 247667
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "13px", color: "var(--color-platinum)", fontFamily: "var(--font-mono)" }}>
                <span><strong>Phone:</strong> +91-9045585676</span>
                <span><strong>Email:</strong> <a href="mailto:roorkee.smelter@aadishakti.com" style={{ textDecoration: "underline", color: "var(--color-scarlet)" }}>roorkee.smelter@aadishakti.com</a></span>
              </div>
            </div>

          </div>

          {/* Right: Floating Label Dark form */}
          <div
            style={{
              background: "var(--color-iron)",
              border: "1px solid var(--color-steel)",
              borderLeft: "3px solid var(--color-scarlet)",
              padding: "3rem",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "20px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase", marginBottom: "2rem" }}>
              ENGAGE MARKETING DESK
            </h3>

            {submitStatus && (
              <div
                style={{
                  background: submitStatus.type === "success" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                  border: `1px solid ${submitStatus.type === "success" ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  fontSize: "14px",
                  color: submitStatus.type === "success" ? "var(--color-white)" : "#ef4444",
                }}
              >
                {submitStatus.msg}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="dark-form-group">
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder=" "
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="dark-form-control"
                  />
                  <label className="dark-form-label">Full Name*</label>
                </div>

                <div className="dark-form-group">
                  <input
                    type="email"
                    name="workEmail"
                    required
                    placeholder=" "
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    className="dark-form-control"
                  />
                  <label className="dark-form-label">Work Email*</label>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="dark-form-group">
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="dark-form-control"
                  />
                  <label className="dark-form-label">Phone / WhatsApp Number*</label>
                </div>

                <div className="dark-form-group">
                  <input
                    type="text"
                    name="companyName"
                    required
                    placeholder=" "
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="dark-form-control"
                  />
                  <label className="dark-form-label">Company Name*</label>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="dark-form-group">
                  <input
                    type="text"
                    name="country"
                    required
                    placeholder=" "
                    value={formData.country}
                    onChange={handleInputChange}
                    className="dark-form-control"
                  />
                  <label className="dark-form-label">Country / Region*</label>
                </div>

                <div className="dark-form-group">
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="dark-form-control"
                    style={{ background: "var(--color-iron)" }}
                  >
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Price / Quotation Request">Price / Quotation Request</option>
                    <option value="Bulk Purchase">Bulk Purchase</option>
                    <option value="Distribution / Partnership">Distribution / Partnership</option>
                    <option value="Vendor / Supply">Vendor / Supply</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                  <label className="dark-form-label" style={{ top: "-10px", fontSize: "12px", color: "var(--color-scarlet)", textTransform: "uppercase", fontWeight: "700" }}>Inquiry Type*</label>
                </div>
              </div>

              <div className="dark-form-group" style={{ marginBottom: "2rem" }}>
                <label className="dark-form-label" style={{ top: "-10px", fontSize: "12px", color: "var(--color-scarlet)", textTransform: "uppercase", fontWeight: "700" }}>
                  Product(s) Interested In*
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1.5rem" }}>
                  {[
                    "Refined Lead Ingots",
                    "Lead Alloys",
                    "Red Lead Oxide",
                    "Lead Sub Oxide (Grey Oxide)",
                    "Other",
                  ].map((p) => (
                    <label key={p} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px", color: "var(--color-silver)", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        value={p}
                        checked={formData.products.includes(p)}
                        onChange={handleCheckboxChange}
                        style={{ accentColor: "var(--color-scarlet)", width: "15px", height: "15px" }}
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="dark-form-group">
                <select
                  name="estimatedQuantity"
                  value={formData.estimatedQuantity}
                  onChange={handleInputChange}
                  className="dark-form-control"
                  style={{ background: "var(--color-iron)" }}
                >
                  <option value="Less than 5 MT">Less than 5 MT</option>
                  <option value="5–25 MT">5–25 MT</option>
                  <option value="25–100 MT">25–100 MT</option>
                  <option value="100+ MT">100+ MT</option>
                  <option value="Not decided yet">Not decided yet</option>
                </select>
                <label className="dark-form-label" style={{ top: "-10px", fontSize: "12px", color: "var(--color-scarlet)", textTransform: "uppercase", fontWeight: "700" }}>Estimated Quantity Required</label>
              </div>

              <div className="dark-form-group" style={{ marginBottom: "2.5rem" }}>
                <textarea
                  name="additionalDetails"
                  rows="2"
                  placeholder=" "
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  className="dark-form-control"
                  style={{ resize: "none" }}
                />
                <label className="dark-form-label">Bespoke Specifications / Metal Details</label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-forge-submit"
              >
                {submitting ? "LOGGING INQUIRY METRICS..." : "TRANSMIT BUSINESS INQUIRY"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
