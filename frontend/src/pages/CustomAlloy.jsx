import { useEffect, useMemo, useRef, useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { Send, CheckCircle2, Loader2, Paperclip, X } from "lucide-react";
import { buildApiUrl } from "../config/api";
import CountrySelect from "../components/CountrySelect";
import { useCms } from "../context/CmsContext";
import { DEFAULT_CUSTOM_ALLOY_CONTENT, normalizeCustomAlloyContent } from "../data/customAlloyContent";

export default function CustomAlloy() {
  const { cms } = useCms();
  const content = useMemo(() => normalizeCustomAlloyContent(cms?.customAlloy), [cms?.customAlloy]);
  const specsTouched = useRef(false);
  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    phoneCode: "+91",
    phone: "",
    companyName: "",
    estimatedQuantity: "",
    packagingType: "",
    notes: "",
  });

  const [specs, setSpecs] = useState(
    DEFAULT_CUSTOM_ALLOY_CONTENT.alloyElements.reduce((acc, el) => ({ ...acc, [el.key]: el.defaultVal }), {})
  );

  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!specsTouched.current) {
      setSpecs(content.alloyElements.reduce((acc, element) => ({ ...acc, [element.key]: element.defaultVal }), {}));
    }
  }, [content.alloyElements]);

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
    if (name === "phone" || name === "whatsapp") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecChange = (key, value) => {
    specsTouched.current = true;
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 10485760) {
      setUploadedFile(file);
      setErrorMsg("");
    } else if (file) {
      setErrorMsg("File must be under 10MB");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("workEmail", formData.workEmail);
      data.append("phone", `${formData.phoneCode} ${formData.phone}`);
      data.append("companyName", formData.companyName);
      data.append("country", "Not Specified"); // to satisfy backend validation
      data.append("inquiryType", "Custom Alloy Quote");
      data.append("products", JSON.stringify(["Custom Alloy"]));
      data.append("estimatedQuantity", formData.estimatedQuantity);
      data.append("packagingRequirement", formData.packagingType);
      data.append("additionalDetails", `Custom Specification Request:\n${JSON.stringify(specs, null, 2)}\n\nNotes: ${formData.notes}`);

      if (uploadedFile) {
        data.append("attachment", uploadedFile);
      }

      const response = await fetch(buildApiUrl("/api/enquiries"), {
        method: "POST",
        body: data,
      });
      
      const resJson = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(resJson.error || "Failed to submit");
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submit error:", error);
      setErrorMsg(error.message || "Failed to submit quote request. Please try again or contact us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title={content.heroTitle} activePage={content.breadcrumbLabel} image={content.heroImage} />

      <section className="section-padding bg-light">
        <div className="container">
          <ScrollReveal>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <SectionLabel text={content.sectionLabel} />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, marginBottom: "16px" }}>
                  {content.heading}
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-lead)" }}>
                  {content.introduction}
                </p>
              </div>

              {success ? (
                <div className="corporate-card" style={{ padding: "60px 40px", textAlign: "center", background: "#FFFFFF" }}>
                  <CheckCircle2 size={64} color="var(--admin-green)" style={{ margin: "0 auto 24px" }} />
                  <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>{content.successTitle}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "32px", maxWidth: "500px", margin: "0 auto" }}>
                    {content.successMessage}
                  </p>
                  <button onClick={() => window.location.reload()} className="btn-primary">
                    {content.successButton}
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
                      <div style={{ display: "flex", gap: "8px" }}>
                        <CountrySelect
                          name="phoneCode"
                          value={formData.phoneCode}
                          onChange={handleFormChange}
                          className="form-input"
                          style={{ width: "120px", cursor: "pointer", paddingLeft: "8px" }}
                        />
                        <input
                          type="tel"
                          name="phone"
                          className="form-input"
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder="XXXXX XXXXX"
                          pattern="[0-9]{10,15}"
                          minLength={10}
                          style={{ flex: 1 }}
                        />
                      </div>
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
                        {content.packagingOptions.map((option, index) => (
                          <option key={`${option.value}-${index}`} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-light)" }}>
                    {content.metallurgicalHeading}
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
                        {content.alloyElements.map((el) => (
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
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>{content.notesLabel}</label>
                    <textarea name="notes" className="form-input" value={formData.notes} onChange={handleFormChange} placeholder={content.notesPlaceholder} rows={4}></textarea>
                  </div>

                  {/* PDF / Document Upload */}
                  <div style={{ marginTop: "24px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>{content.uploadLabel}</label>
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
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
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
                        <div style={{ width: "100%", textAlign: "center" }}>
                          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                            <span style={{ fontWeight: 700, color: "var(--red-core)" }}>{content.uploadPrompt}</span>
                          </p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0" }}>{content.uploadHint}</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="alloy-file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>

                  <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-solid-red" disabled={loading} style={{ width: "240px", height: "46px", whiteSpace: "nowrap" }}>
                      {loading ? <Loader2 className="spinner" size={18} /> : (
                        <>
                          {content.submitButton} <Send size={18} />
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
