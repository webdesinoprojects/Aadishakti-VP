import { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { Send, CheckCircle2, Loader2, Paperclip, X } from "lucide-react";
import { buildApiUrl } from "../config/api";

const ALLOY_ELEMENTS = [
  { key: "antimony", name: "Antimony (Sb)", defaultVal: "0.001% max" },
  { key: "arsenic", name: "Arsenic (As)", defaultVal: "0.001% max" },
  { key: "tin", name: "Tin (Sn)", defaultVal: "0.001% max" },
  { key: "copper", name: "Copper (Cu)", defaultVal: "0.001% max" },
  { key: "bismuth", name: "Bismuth (Bi)", defaultVal: "0.015% max" },
  { key: "silver", name: "Silver (Ag)", defaultVal: "0.003% max" },
  { key: "iron", name: "Iron (Fe)", defaultVal: "0.001% max" },
  { key: "lead", name: "Lead (Pb)", defaultVal: "99.970% min" },
];

export default function CustomAlloy() {
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    phone: "",
    companyName: "",
    estimatedQuantity: "",
    packagingType: "",
    notes: "",
  });

  const [specs, setSpecs] = useState(
    ALLOY_ELEMENTS.reduce((acc, el) => ({ ...acc, [el.key]: el.defaultVal }), {})
  );

  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    document.getElementById("alloy-file-upload").value = "";
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (key, value) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        ...formData,
        inquiryType: "Custom Alloy Quote",
        products: ["Custom Alloy"],
        additionalDetails: `Custom Specification Request:\n${JSON.stringify(specs, null, 2)}\n\nNotes: ${formData.notes}`,
      };

      const response = await fetch(buildApiUrl("/api/enquiries"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit");
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMsg("Failed to submit quote request. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="CUSTOM ALLOY QUOTE" activePage="ALLOY QUOTE" />

      <section className="section-padding bg-light">
        <div className="container">
          <ScrollReveal>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <SectionLabel text="// ENGINEERING SPECIFICATIONS" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "16px" }}>
                  Request a Custom Alloy Quote
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-lead)" }}>
                  Define your required metallurgical composition. Our technical team will review your specifications and return a formal analysis and quotation.
                </p>
              </div>

              {success ? (
                <div className="corporate-card" style={{ padding: "60px 40px", textAlign: "center", background: "#FFFFFF" }}>
                  <CheckCircle2 size={64} color="var(--admin-green)" style={{ margin: "0 auto 24px" }} />
                  <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>Request Submitted Successfully</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px", maxWidth: "500px", margin: "0 auto" }}>
                    Thank you for your request. Our metallurgy team will review your specifications and get back to you with a quotation shortly.
                  </p>
                  <button onClick={() => window.location.reload()} className="btn-primary">
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="corporate-card" style={{ padding: "40px", background: "#FFFFFF" }}>
                  {errorMsg && (
                    <div style={{ padding: "16px", background: "#FFF0F0", color: "var(--red-core)", borderRadius: "4px", marginBottom: "24px", fontSize: "14px" }}>
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid-2" style={{ gap: "24px", marginBottom: "32px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Full Name *</label>
                      <input type="text" name="fullName" required className="form-input" value={formData.fullName} onChange={handleFormChange} placeholder="John Doe" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Work Email *</label>
                      <input type="email" name="workEmail" required className="form-input" value={formData.workEmail} onChange={handleFormChange} placeholder="john@company.com" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Phone Number</label>
                      <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleFormChange} placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Company Name *</label>
                      <input type="text" name="companyName" required className="form-input" value={formData.companyName} onChange={handleFormChange} placeholder="Metal Corp Ltd" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Quantity Required (MT) *</label>
                      <input type="text" name="estimatedQuantity" required className="form-input" value={formData.estimatedQuantity} onChange={handleFormChange} placeholder="e.g. 50 MT" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Packaging Preference</label>
                      <select name="packagingType" className="form-input" value={formData.packagingType} onChange={handleFormChange} style={{ background: "var(--bg-secondary)" }}>
                        <option value="">Select packaging type</option>
                        <option value="Wooden Pallet (Strapped Ingots)">Wooden Pallet — Strapped Ingots (Standard)</option>
                        <option value="Jumbo Bag / FIBC">Jumbo Bag / FIBC (Bulk Granules, Oxide, Powder)</option>
                        <option value="HDPE Drum">HDPE Drum (Oxide, Powder, Small Parts)</option>
                        <option value="Loose / Bulk">Loose / Bulk (Large Volume Orders)</option>
                        <option value="Custom / As Discussed">Custom / As Per Requirement</option>
                      </select>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                    Metallurgical Specification
                  </h3>
                  <div style={{ overflowX: "auto", marginBottom: "32px" }}>
                    <table className="spec-terminal-table" style={{ width: "100%", minWidth: "400px" }}>
                      <thead>
                        <tr>
                          <th>Element / Property</th>
                          <th>Target Value (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALLOY_ELEMENTS.map((el) => (
                          <tr key={el.key}>
                            <td className="property-name" style={{ verticalAlign: "middle" }}>{el.name}</td>
                            <td style={{ padding: "8px" }}>
                              <input
                                type="text"
                                className="form-input"
                                value={specs[el.key]}
                                onChange={(e) => handleSpecChange(el.key, e.target.value)}
                                style={{ margin: 0, padding: "8px 12px", background: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Additional Notes / Specific Requirements</label>
                    <textarea name="notes" className="form-input" value={formData.notes} onChange={handleFormChange} placeholder="Any packaging requirements, delivery timelines, etc." rows={4}></textarea>
                  </div>

                  {/* PDF / Document Upload */}
                  <div style={{ marginTop: "24px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Upload Specification / Custom Requirement (Optional)</label>
                    <div
                      style={{
                        border: "2px dashed var(--border-light)",
                        borderRadius: "4px",
                        padding: "20px 24px",
                        background: "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                      onClick={() => document.getElementById("alloy-file-upload").click()}
                    >
                      <Paperclip size={20} color="var(--red-core)" style={{ flexShrink: 0 }} />
                      {uploadedFile ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", wordBreak: "break-all" }}>{uploadedFile.name}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeFile(); }}
                            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                            <span style={{ fontWeight: 700, color: "var(--red-core)" }}>Click to upload</span> your specification sheet, RFQ, or custom requirement document
                          </p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0" }}>PDF, DOC, DOCX, XLS, XLSX — Max 10MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="alloy-file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>

                  <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-solid-red" disabled={loading} style={{ width: "240px", height: "46px", whiteSpace: "nowrap" }}>
                      {loading ? <Loader2 className="spinner" size={18} /> : (
                        <>
                          Submit Request <Send size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
