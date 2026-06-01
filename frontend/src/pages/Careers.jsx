import React, { useState } from "react";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { Loader2 } from "lucide-react";

export default function Careers() {
  const [activeTab, setActiveTab] = useState("factory");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    description: "",
  });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const factoryJobs = [
    {
      title: "Lead Smelting Plant Operator",
      location: "MUNDRA PLANT, GUJARAT",
      dept: "Operations",
      exp: "3–5 Years in Smelting",
      desc: "Supervise furnace operations, manage molten metal pouring, monitor draft systems, and maintain strict industrial safety standards.",
    },
    {
      title: "Metallurgical Laboratory Chemist",
      location: "ROORKEE PLANT, UTTARAKHAND",
      dept: "Quality Control",
      exp: "2–4 Years in Non-Ferrous Lab",
      desc: "Conduct high-precision sample analysis on raw lead feed and refined ingots using Optical Emission Spectrometers (OES) to verify purity.",
    },
  ];

  const officeJobs = [
    {
      title: "Senior Industrial Accountant",
      location: "NEW DELHI CORPORATE OFFICE",
      dept: "Finance",
      exp: "4–6 Years in Manufacturing Accounts",
      desc: "Manage GST documentation, customs clearance reports for scrap vessels, vendor reconciliations, and routine ledger audits.",
    },
    {
      title: "Logistics & Customs Coordinator",
      location: "NEW DELHI CORPORATE OFFICE",
      dept: "Exim Operations",
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
      data.append("roleCategory", activeTab === "factory" ? "Factory" : "Office");
      data.append("experience", formData.experience);
      data.append("description", `Applying for ${selectedRole}. ${formData.description}`);
      data.append("resume", resume);

      const response = await fetch("http://localhost:5000/api/careers", {
        method: "POST",
        body: data,
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Failed to submit career request.");
      }

      setSubmitStatus({
        type: "success",
        msg: "Application submitted successfully! Our HR desk will connect shortly.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
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

  const currentJobs = activeTab === "factory" ? factoryJobs : officeJobs;

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="JOIN OUR TEAM" activePage="CAREERS" />

      <section className="section-padding" style={{ background: "var(--obsidian)" }}>
        <div className="container">
          
          <SectionLabel text="// HUMAN RESOURCES" />
          <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>CAREER PIPELINES</h2>

          {/* Two Tab Layout Switches */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem" }}>
            <button
              onClick={() => setActiveTab("factory")}
              className="btn-spark"
              style={{
                backgroundColor: activeTab === "factory" ? "var(--red-core)" : "var(--iron)",
                border: "1px solid var(--steel)",
                transform: "none",
              }}
            >
              FACTORY ROLES
            </button>
            <button
              onClick={() => setActiveTab("office")}
              className="btn-spark"
              style={{
                backgroundColor: activeTab === "office" ? "var(--red-core)" : "var(--iron)",
                border: "1px solid var(--steel)",
                transform: "none",
              }}
            >
              OFFICE / CORPORATE
            </button>
          </div>

          {/* Jobs Listing grid */}
          <div className="grid-2" style={{ gap: "32px" }}>
            {currentJobs.map((job, idx) => (
              <div key={idx} className="corporate-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "800", fontSize: "20px", color: "var(--white)", textTransform: "uppercase" }}>
                      {job.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        background: "rgba(231,76,60,0.1)",
                        border: "1px solid rgba(231,76,60,0.2)",
                        padding: "2px 8px",
                        color: "var(--red-core)",
                        borderRadius: "2px",
                      }}
                    >
                      {job.location}
                    </span>
                  </div>

                  <div style={{ fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--silver)", marginBottom: "1rem" }}>
                    <strong>Department:</strong> {job.dept} | <strong>Experience:</strong> {job.exp}
                  </div>
                  
                  <p style={{ color: "var(--light)", fontSize: "14px", lineHeight: "1.5" }}>
                    {job.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRole(job.title);
                    setShowModal(true);
                  }}
                  className="btn-ghost-steel"
                  style={{ alignSelf: "start", marginTop: "1.5rem", height: "38px", color: "var(--red-core)", borderColor: "var(--red-core)" }}
                >
                  APPLY NOW →
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Careers modal */}
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
            className="reveal-item reveal-visible"
            style={{
              width: "100%",
              maxWidth: "640px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "var(--iron)",
              border: "1px solid var(--steel)",
              borderTop: "3px solid var(--red-core)",
              padding: "40px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "20px", fontWeight: "700", color: "var(--white)", textTransform: "uppercase" }}>
                APPLICATION: {selectedRole}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSubmitStatus(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--white)",
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
                  color: submitStatus.type === "success" ? "var(--white)" : "#ef4444",
                }}
              >
                {submitStatus.msg}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="float-form-group">
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder=" "
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="float-form-control"
                />
                <label className="float-form-label">Full Name*</label>
              </div>

              <div className="float-form-group">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder=" "
                  value={formData.email}
                  onChange={handleInputChange}
                  className="float-form-control"
                />
                <label className="float-form-label">Email Address*</label>
              </div>

              <div className="float-form-group">
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="float-form-control"
                />
                <label className="float-form-label">Phone / WhatsApp Number*</label>
              </div>

              <div className="float-form-group">
                <input
                  type="number"
                  name="experience"
                  required
                  placeholder=" "
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="float-form-control"
                />
                <label className="float-form-label">Relevant Experience (Years)*</label>
              </div>

              {/* Drag Area styled with dashed red border */}
              <div
                style={{
                  border: "2px dashed var(--red-core)",
                  padding: "24px",
                  textAlign: "center",
                  background: "var(--obsidian)",
                  marginBottom: "2rem",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <div style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--light)" }}>
                  {resume ? `Attached: ${resume.name}` : "DRAG & DROP RESUME OR CLICK TO ATTACH (.PDF, .DOC)*"}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSubmitStatus(null);
                  }}
                  className="btn-ghost-steel"
                  style={{ flex: 1, height: "52px" }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-solid-red"
                  style={{ flex: 2, height: "52px" }}
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "SUBMIT APPLICATION"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
