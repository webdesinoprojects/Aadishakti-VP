import React, { useState } from "react";
import { buildApiUrl } from "../config/api";
import { Loader2 } from "lucide-react";

export default function Careers() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleCategory: "Office",
    experience: "",
    description: "",
  });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const factoryJobs = [
    {
      title: "Lead Smelting Plant Operator",
      location: "Mundra Plant, Gujarat",
      exp: "3–5 Years in Smelting",
      desc: "Supervise furnace operations, manage molten metal pouring, monitor draft systems, and maintain strict industrial safety standards.",
    },
    {
      title: "Metallurgical Laboratory Chemist",
      location: "Roorkee Plant, Uttarakhand",
      exp: "2–4 Years in Non-Ferrous Lab",
      desc: "Conduct high-precision sample analysis on raw lead feed and refined ingots using Optical Emission Spectrometers (OES) to verify purity.",
    },
  ];

  const officeJobs = [
    {
      title: "Senior Industrial Accountant",
      location: "Corporate Office, New Delhi",
      exp: "4–6 Years in Manufacturing Accounts",
      desc: "Manage GST documentation, customs clearance reports for scrap vessels, vendor reconciliations, and routine ledger audits.",
    },
    {
      title: "Logistics & Customs Coordinator",
      location: "Corporate Office, New Delhi",
      exp: "2–4 Years in Import/Export Operations",
      desc: "Coordinate with shipping lines, manage transboundary container tracking, prepare customs files, and ensure prompt Mundra Port clearance.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    if (!resume) {
      setSubmitStatus({ type: "error", msg: "Please attach your resume document (.pdf, .doc, .docx)." });
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("roleCategory", formData.roleCategory);
      data.append("experience", formData.experience);
      data.append("description", formData.description);
      data.append("resume", resume);

      const response = await fetch(buildApiUrl("/api/careers"), {
        method: "POST",
        body: data,
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Could not log career request.");
      }

      setSubmitStatus({
        type: "success",
        msg: "Application submitted successfully! Our HR team will contact you shortly.",
      });
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        roleCategory: "Office",
        experience: "",
        description: "",
      });
      setResume(null);
    } catch (err) {
      console.error(err);
      setSubmitStatus({ type: "error", msg: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="careers" className="section-padding" style={{ position: "relative" }}>
      <div className="container">
        
        {/* Section Meta Tag */}
        <div className="section-meta-label">// HUMAN RESOURCES</div>
        <h2 className="section-title-large">JOIN THE METALLURGICAL UNION</h2>

        {/* Intro */}
        <div className="dominance-card" style={{ marginBottom: "4rem", borderLeft: "3px solid var(--color-scarlet)", background: "rgba(139,0,0,0.02)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-scarlet)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              TALENT RECRUITMENT FEED
            </span>
            <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "24px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase" }}>
              FORGING INDUSTRIAL CAREERS
            </h3>
            <p style={{ color: "var(--color-silver)", fontSize: "15px", lineHeight: "1.7", maxWidth: "800px" }}>
              AadiShakti Group provides stable, safe-compliance careers with competitive packages, rigorous safety checks, and professional advancement pipelines.
            </p>
            <button onClick={() => setShowModal(true)} className="btn-spark" style={{ marginTop: "1rem" }}>
              SPONTANEOUS APPLICATION
            </button>
          </div>
        </div>

        {/* Jobs split */}
        <div className="grid-2" style={{ gap: "4rem" }}>
          
          {/* Plant roles */}
          <div>
            <h3 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "16px", letterSpacing: "0.15em", color: "var(--color-scarlet)", marginBottom: "1.5rem" }}>
              FACTORY & PROCESSING OPENINGS
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {factoryJobs.map((j, idx) => (
                <div key={idx} className="dominance-card" style={{ borderLeft: "3px solid var(--color-scarlet)" }}>
                  <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "18px", fontWeight: "700", color: "var(--color-white)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{j.title}</h4>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-ash)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                    {j.location} | {j.exp}
                  </div>
                  <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.5", marginBottom: "1.5rem" }}>{j.desc}</p>
                  <button onClick={() => {
                    setFormData(prev => ({ ...prev, roleCategory: "Factory", description: `Applying for ${j.title}` }));
                    setShowModal(true);
                  }} className="btn-spark" style={{ padding: "0.4rem 1rem", fontSize: "11px" }}>
                    APPLY FOR ROLE
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Office roles */}
          <div>
            <h3 style={{ fontFamily: "var(--font-subheading)", fontWeight: "700", textTransform: "uppercase", fontSize: "16px", letterSpacing: "0.15em", color: "var(--color-white)", marginBottom: "1.5rem" }}>
              ADMINISTRATIVE & DESK OPENINGS
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {officeJobs.map((j, idx) => (
                <div key={idx} className="dominance-card" style={{ borderLeft: "3px solid var(--color-steel)" }}>
                  <h4 style={{ fontFamily: "var(--font-subheading)", fontSize: "18px", fontWeight: "700", color: "var(--color-white)", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{j.title}</h4>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-ash)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                    {j.location} | {j.exp}
                  </div>
                  <p style={{ color: "var(--color-silver)", fontSize: "14px", lineHeight: "1.5", marginBottom: "1.5rem" }}>{j.desc}</p>
                  <button onClick={() => {
                    setFormData(prev => ({ ...prev, roleCategory: "Office", description: `Applying for ${j.title}` }));
                    setShowModal(true);
                  }} className="btn-spark" style={{ padding: "0.4rem 1rem", fontSize: "11px" }}>
                    APPLY FOR ROLE
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Career Modal (styled in dark theme with label float) */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(12px)",
              zIndex: 3000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "540px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--color-iron)",
                border: "1px solid var(--color-steel)",
                borderLeft: "3px solid var(--color-scarlet)",
                padding: "2.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ fontFamily: "var(--font-subheading)", fontSize: "20px", fontWeight: "700", color: "var(--color-white)", textTransform: "uppercase" }}>
                  CAREER SUBMISSION DESK
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSubmitStatus(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-white)",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                  }}
                >
                  ✕
                </button>
              </div>

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
                    name="email"
                    required
                    placeholder=" "
                    value={formData.email}
                    onChange={handleInputChange}
                    className="dark-form-control"
                  />
                  <label className="dark-form-label">Work Email*</label>
                </div>

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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="dark-form-group">
                    <select
                      name="roleCategory"
                      value={formData.roleCategory}
                      onChange={handleInputChange}
                      className="dark-form-control"
                      style={{ background: "var(--color-iron)" }}
                    >
                      <option value="Office">Office / Corporate</option>
                      <option value="Factory">Factory / Plant</option>
                    </select>
                    <label className="dark-form-label" style={{ top: "-10px", fontSize: "12px", color: "var(--color-scarlet)", textTransform: "uppercase", fontWeight: "700" }}>Role Category*</label>
                  </div>

                  <div className="dark-form-group">
                    <input
                      type="number"
                      name="experience"
                      required
                      placeholder=" "
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="dark-form-control"
                    />
                    <label className="dark-form-label">Experience (Years)*</label>
                  </div>
                </div>

                <div className="dark-form-group">
                  <textarea
                    name="description"
                    rows="2"
                    placeholder=" "
                    value={formData.description}
                    onChange={handleInputChange}
                    className="dark-form-control"
                    style={{ resize: "none" }}
                  />
                  <label className="dark-form-label">Spontaneous Cover Pitch (Optional)</label>
                </div>

                <div className="dark-form-group" style={{ marginBottom: "2.5rem" }}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                    className="dark-form-control"
                    style={{ border: "1px dashed var(--color-steel)", padding: "0.5rem" }}
                  />
                  <label className="dark-form-label" style={{ top: "-10px", fontSize: "12px", color: "var(--color-scarlet)", textTransform: "uppercase", fontWeight: "700" }}>Upload Resume (.pdf, .doc, .docx)*</label>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSubmitStatus(null);
                    }}
                    className="btn-spark"
                    style={{ flex: 1, backgroundColor: "var(--color-iron)", border: "1px solid var(--color-steel)", transform: "none" }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-forge-submit"
                    style={{ flex: 2, height: "46px", fontSize: "13px" }}
                  >
                    {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}


