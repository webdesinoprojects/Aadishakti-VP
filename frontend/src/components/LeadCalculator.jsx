import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const RECOVERY = {
  VRLA:       { A: 0.62, B: 0.57, C: 0.52 },
  Tubular:    { A: 0.58, B: 0.53, C: 0.48 },
  "Flat Plate": { A: 0.55, B: 0.50, C: 0.45 },
};

export default function LeadCalculator() {
  const [qty, setQty]   = useState("");
  const [type, setType] = useState("VRLA");
  const [grade, setGrade] = useState("A");

  const result = useMemo(() => {
    const q = parseFloat(qty);
    if (!q || q <= 0) return null;
    const rate = RECOVERY[type][grade];
    return { leadMT: (q * rate).toFixed(2), pct: (rate * 100).toFixed(0) };
  }, [qty, type, grade]);

  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(255,255,255,0.96)",
        border: "1px solid var(--border-light)",
        padding: "28px 28px 24px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header */}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "6px" }}>
        // INTERACTIVE TOOL
      </div>
      <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 800, fontSize: "16px", color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.25 }}>
        Battery Scrap → Lead Estimator
      </h3>

      {/* Inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
        <div>
          <label className="float-form-label">Scrap Quantity (MT)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 100"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="float-form-control"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div>
          <label className="float-form-label">Battery Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="float-form-control"
            style={{ borderRadius: 0, cursor: "pointer" }}
          >
            {Object.keys(RECOVERY).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="float-form-label">Scrap Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="float-form-control"
            style={{ borderRadius: 0, cursor: "pointer" }}
          >
            <option value="A">Grade A (Premium)</option>
            <option value="B">Grade B (Standard)</option>
            <option value="C">Grade C (Mixed)</option>
          </select>
        </div>
      </div>

      {/* Output */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          borderLeft: "3px solid var(--red-core)",
          padding: "16px 18px",
          marginBottom: "16px",
          minHeight: "72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {result ? (
          <>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "32px", fontWeight: 700, color: "var(--red-core)", lineHeight: 1 }}>
                {result.leadMT}
              </span>
              <span style={{ fontFamily: "var(--font-primary)", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                MT Pure Lead Recovery
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              ≈ {result.pct}% lead content from {type} · Grade {grade}
            </div>
          </>
        ) : (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-light)" }}>
            Enter quantity above to calculate
          </span>
        )}
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-primary)", lineHeight: 1.5, marginBottom: "14px" }}>
        Estimates only. Actual recovery depends on battery condition and composition.
      </p>

      <Link
        to="/contact"
        className="btn-solid-red"
        style={{ width: "100%", justifyContent: "center", fontSize: "11px", height: "44px" }}
      >
        Request Formal Assessment →
      </Link>
    </div>
  );
}
