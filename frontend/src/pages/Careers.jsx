import { useState } from "react";
import { buildApiUrl } from "../config/api";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import ScrollReveal from "../components/ScrollReveal";
import { Search, MapPin, Building2, ChevronRight, Loader2, Paperclip, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCms } from "../context/CmsContext";
import { allCountryOptions } from "../utils/countries";
import CountrySelect from "../components/CountrySelect";

export default function Careers() {
  const { cms } = useCms();
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const activeJobId = searchParams.get("job");
  const activeCategory = searchParams.get("category") || "factory";

  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneCode: "+91",
    phone: "",
    experience: "",
    description: "",
  });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fallback Mock Data
  const defaultCareersData = {
    categories: [
      { id: "factory", name: "Factory" },
      { id: "office", name: "Office" }
    ],
    jobs: [
      {
        id: "lead-smelting-operator",
        category: "factory",
        title: "Lead Smelting Plant Operator",
        location: "MUNDRA PLANT, GUJARAT",
        dept: "Operations",
        exp: "3–5 Years in Smelting",
        desc: "Supervise furnace operations, manage molten metal pouring, monitor draft systems, and maintain strict industrial safety standards.",
        whyWorkHere: "Working at our Mundra plant gives you hands-on experience with world-class rotary furnaces. We prioritize safety and continuous skill development.",
        img: "/gallery/plants/Mundra/Rotary_1.jpeg"
      },
      {
        id: "senior-industrial-accountant",
        category: "office",
        title: "Senior Industrial Accountant",
        location: "NEW DELHI CORPORATE OFFICE",
        dept: "Finance",
        exp: "4–6 Years in Manufacturing Accounts",
        desc: "Manage GST documentation, customs clearance reports for scrap vessels, vendor reconciliations, and routine ledger audits.",
        whyWorkHere: "Join a dynamic finance team at our New Delhi headquarters with exposure to international trade and bulk commodity accounting.",
        img: "/gallery/office/Roorkee/WhatsApp_Image_2026-03-11_at_16.03.15.jpeg"
      }
    ]
  };

  const careersData = cms?.careersData || defaultCareersData;
  const currentJobs = careersData.jobs.filter(j => j.category === activeCategory);
  
  // Detail View Active Job
  const activeJob = activeJobId ? careersData.jobs.find(j => j.id === activeJobId) : null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "whatsapp") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (file && file.size <= 10485760) {
      setResume(file);
    } else if (file) {
      alert("File must be under 10MB");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
      data.append("phone", `${formData.phoneCode} ${formData.phone}`);
      data.append("roleCategory", activeJob ? activeJob.category : activeCategory);
      data.append("experience", formData.experience);
      data.append("description", `Applying for ${selectedRole}. ${formData.description}`);
      data.append("resume", resume);

      const response = await fetch(buildApiUrl("/api/careers"), {
        method: "POST",
        body: data,
      });

      let resJson = {};
      try {
        resJson = await response.json();
      } catch (e) {
        // Safely ignore empty responses
      }
      
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
        phoneCode: "+91",
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

  const renderJobDetails = () => {
    if (!activeJob) return null;
    return (
      <div className="reveal-item reveal-visible" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <button 
          onClick={() => navigate(`/careers?category=${activeJob.category}`)}
          className="btn-ghost-steel"
          style={{ marginBottom: "2rem", border: "none", color: "var(--red-core)", padding: "0" }}
        >
          ← BACK TO JOBS
        </button>

        <div style={{ width: "100%", height: "400px", marginBottom: "2rem", overflow: "hidden" }}>
          <img 
            src={activeJob.img} 
            alt={activeJob.title} 
            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: "800", fontSize: "32px", color: "var(--text-primary)", textTransform: "uppercase", margin: 0 }}>
            {activeJob.title}
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              background: "rgba(231,76,60,0.1)",
              border: "1px solid rgba(231,76,60,0.2)",
              padding: "4px 12px",
              color: "var(--red-core)",
              borderRadius: "2px",
            }}
          >
            {activeJob.location}
          </span>
        </div>

        <div style={{ fontFamily: "var(--font-primary)", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-light)" }}>
          <strong>Department:</strong> {activeJob.dept} | <strong>Experience:</strong> {activeJob.exp}
        </div>

        <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase" }}>
          Job Description
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "2rem" }}>
          {activeJob.desc}
        </p>

        <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "1rem", textTransform: "uppercase" }}>
          Why Work Here?
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "3rem" }}>
          {activeJob.whyWorkHere}
        </p>

        <button
          onClick={() => {
            setSelectedRole(activeJob.title);
            setShowModal(true);
          }}
          className="btn-solid-red"
          style={{ width: "100%", height: "52px", fontSize: "14px" }}
        >
          APPLY NOW →
        </button>
      </div>
    );
  };

  const renderJobList = () => (
    <>
      <SectionLabel text="// HUMAN RESOURCES" />
      <h2 className="section-title-large" style={{ marginBottom: "3rem" }}>CAREER PIPELINES</h2>

      {/* Two Tab Layout Switches */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
        {careersData.categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => navigate(`/careers?category=${cat.id}`)}
            style={{
              padding: "12px 32px",
              backgroundColor: activeCategory === cat.id ? "var(--red-core)" : "transparent",
              color: activeCategory === cat.id ? "#fff" : "var(--text-primary)",
              border: "1px solid",
              borderColor: activeCategory === cat.id ? "var(--red-core)" : "var(--border-light)",
              fontFamily: "var(--font-primary)",
              fontWeight: "600",
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            {cat.name.toUpperCase()} ROLES
          </button>
        ))}
      </div>

      {/* Jobs Listing grid */}
      <div className="grid-2" style={{ gap: "32px" }}>
        {currentJobs.map((job) => (
          <div key={job.id} className="corporate-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "260px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "800", fontSize: "20px", color: "var(--text-primary)", textTransform: "uppercase", margin: 0 }}>
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

              <div style={{ fontFamily: "var(--font-primary)", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                <strong>Department:</strong> {job.dept} | <strong>Experience:</strong> {job.exp}
              </div>
              
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
                {job.desc.length > 120 ? job.desc.substring(0, 120) + "..." : job.desc}
              </p>
            </div>

            <button
              onClick={() => navigate(`/careers?job=${job.id}`)}
              className="btn-ghost-steel"
              style={{ alignSelf: "start", marginTop: "1.5rem", height: "38px", color: "var(--red-core)", borderColor: "var(--red-core)" }}
            >
              VIEW DETAILS →
            </button>
          </div>
        ))}
        {currentJobs.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)", padding: "4rem" }}>
            No roles available in this category currently.
          </div>
        )}
      </div>
    </>
  );

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="CAREERS" activePage="CAREERS" />

      <section className="section-padding" style={{ background: "var(--bg-primary)" }}>
        <div className="container">
          {activeJob ? renderJobDetails() : renderJobList()}
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
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "var(--bg-primary)",
              border: "1px solid var(--border-light)",
              borderTop: "3px solid var(--red-core)",
              padding: "40px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", gap: "1rem" }}>
              <h3 style={{ fontFamily: "var(--font-primary)", fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", textTransform: "uppercase", margin: 0 }}>
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
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  padding: 0
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
                  color: submitStatus.type === "success" ? "var(--text-primary)" : "#ef4444",
                }}
              >
                {submitStatus.msg}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="grid-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
                <div className="float-form-group" style={{ marginBottom: 0 }}>
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
                <div className="float-form-group" style={{ marginBottom: 0 }}>
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
              </div>

              <div className="grid-2" style={{ gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div className="float-form-group" style={{ marginBottom: 0, width: "130px", flexShrink: 0 }}>
                    <CountrySelect
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleInputChange}
                      className="float-form-control"
                      style={{ cursor: "pointer", paddingLeft: "8px" }}
                    />
                    <label className="float-form-label">Code</label>
                  </div>
                  <div className="float-form-group" style={{ marginBottom: 0, flex: 1 }}>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder=" "
                      pattern="[0-9]{10,15}"
                      minLength={10}
                      title="Phone number must be between 10 and 15 digits"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="float-form-control"
                    />
                    <label className="float-form-label">WhatsApp Number*</label>
                  </div>
                </div>
                <div className="float-form-group" style={{ marginBottom: 0 }}>
                  <input
                    type="number"
                    name="experience"
                    required
                    min="0"
                    step="0.5"
                    placeholder=" "
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="float-form-control"
                  />
                  <label className="float-form-label">Relevant Experience (Years)*</label>
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    border: "2px dashed var(--red-core)",
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
                  onClick={() => document.getElementById("resume-upload").click()}
                >
                  <Paperclip size={20} color="var(--red-core)" style={{ flexShrink: 0 }} />
                  {resume ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", wordBreak: "break-all" }}>{resume.name}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>({(resume.size / 1024).toFixed(1)} KB)</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setResume(null); }}
                        style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, fontFamily: "var(--font-primary)" }}>
                        <span style={{ fontWeight: 700, color: "var(--red-core)" }}>Drag & drop</span> resume or <span style={{ fontWeight: 700, color: "var(--red-core)" }}>click to attach</span>*
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0", fontFamily: "var(--font-primary)" }}>.PDF, .DOC, .DOCX — Max 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSubmitStatus(null);
                  }}
                  className="btn-ghost-steel"
                  style={{ flex: 1, height: "52px", color: "var(--text-primary)", borderColor: "var(--border-light)" }}
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
