import React from "react";
import { Link } from "react-router-dom";
import { ASSETS } from "../assets/assetMap";

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const quickLinks = [
  { to: "/",               label: "Home" },
  { to: "/about",          label: "Corporate Overview" },
  { to: "/products",       label: "Products Catalog" },
  { to: "/sustainability",  label: "Sustainability" },
  { to: "/investors",      label: "Investor Relations" },
  { to: "/careers",        label: "Careers" },
];

const entities = [
  { to: "/businesses?plant=mundra",  code: "AGRPL", name: "Mundra Plant", loc: "Kutch, Gujarat" },
  { to: "/businesses?plant=roorkee", code: "AMRPL", name: "Roorkee Plant", loc: "Haridwar, Uttarakhand" },
  { to: "/sourcing",                 code: "IMP",   name: "Sourcing Desk", loc: "Battery Scrap Procurement" },
  { to: "/about",                    code: "HQ",    name: "Corporate HQ", loc: "New Delhi 110015" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0F0F0F", fontFamily: "var(--font-primary)", position: "relative" }}>

      {/* ── TOP RED ACCENT ── */}
      <div style={{ height: "3px", background: "var(--red-core)", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, var(--red-core) 50%, transparent 100%)", boxShadow: "0 0 12px rgba(204,34,0,0.5)" }} />
      </div>

      {/* ══════════════════════════════════
          PRE-FOOTER — CTA BAND
      ══════════════════════════════════ */}
      <div style={{ background: "#0B0B0B", borderBottom: "1px solid #1C1C1C" }}>
        <div className="container" style={{ padding: "52px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "28px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "10px" }}>
              // PARTNER WITH US
            </div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(20px, 2.5vw, 32px)", color: "#FFFFFF", lineHeight: 1.2, marginBottom: "0" }}>
              Ready to source from India&apos;s leading secondary lead group?
            </h2>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexShrink: 0 }}>
            <Link to="/contact" className="btn-solid-red" style={{ height: "46px", paddingInline: "28px", fontSize: "12px" }}>
              Get In Touch &rarr;
            </Link>
            <Link to="/sourcing" className="btn-ghost-steel" style={{ height: "46px", paddingInline: "24px", fontSize: "12px", color: "#AAAAAA", borderColor: "#333" }}>
              Sell Scrap &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          MAIN FOOTER GRID
      ══════════════════════════════════ */}
      <div className="container" style={{ padding: "72px 0 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr 1.2fr 1.4fr", gap: "56px", alignItems: "start" }}>

          {/* ── COL 1: Brand ── */}
          <div>
            <Link to="/" onClick={scrollTop} style={{ display: "inline-block", marginBottom: "24px" }}>
              <img
                src={ASSETS.logo}
                alt="Aadishakti Group"
                style={{ height: "46px", width: "auto", objectFit: "contain", display: "block" }}
              />
            </Link>

            <p style={{
              fontFamily: "var(--font-editorial)", fontStyle: "italic",
              fontSize: "15px", color: "#666666", lineHeight: 1.65,
              borderLeft: "2px solid var(--red-core)", paddingLeft: "14px",
              margin: "0 0 28px 0",
            }}>
              &ldquo;Forging geological weight, absolute metallurgy, and ecological circular recovery.&rdquo;
            </p>

            {/* Cert chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "28px" }}>
              {["ISO 9001:2015", "ISO 14001:2015", "BIS Certified", "Basel Compliant"].map((c) => (
                <span key={c} style={{
                  fontFamily: "var(--font-mono)", fontSize: "9px", color: "#888888",
                  border: "1px solid #222222", padding: "4px 10px", letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {c}
                </span>
              ))}
            </div>

            {/* Social row */}
            <div style={{ display: "flex", gap: "10px" }}>
              <a
                href="https://www.linkedin.com/company/aadishakti-group-aadishakti-metal-recycling-pvt-ltd"
                target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="footer-social-btn"
                style={{ width: "38px", height: "38px", border: "1px solid #222222", display: "flex", alignItems: "center", justifyContent: "center", color: "#666666", background: "transparent", transition: "all 0.22s ease" }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zm-11 19H5V9h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76S5.53 4.21 6.5 4.21s1.75.79 1.75 1.76-.78 1.76-1.75 1.76zM20 19h-3v-5.6c0-3.37-4-3.11-4 0V19h-3V9h3v1.77c1.4-2.59 7-2.78 7 2.47V19z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X / Twitter"
                className="footer-social-btn"
                style={{ width: "38px", height: "38px", border: "1px solid #222222", display: "flex", alignItems: "center", justifyContent: "center", color: "#666666", background: "transparent", transition: "all 0.22s ease" }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── COL 2: Quick Links ── */}
          <div>
            <h4 style={{ fontSize: "10px", fontWeight: 700, color: "var(--red-core)", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "10px", height: "1.5px", background: "var(--red-core)", display: "inline-block" }} />
              Quick Links
            </h4>
            <ul style={{ listStyle: "none" }}>
              {quickLinks.map((link) => (
                <li key={link.to} style={{ borderBottom: "1px solid #161616" }}>
                  <Link
                    to={link.to}
                    onClick={scrollTop}
                    className="footer-nav-link"
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 0", fontSize: "13px", fontWeight: 500, color: "#777777", transition: "all 0.2s ease" }}
                  >
                    <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--red-core)", flexShrink: 0, opacity: 0.6 }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Our Entities ── */}
          <div>
            <h4 style={{ fontSize: "10px", fontWeight: 700, color: "var(--red-core)", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "10px", height: "1.5px", background: "var(--red-core)", display: "inline-block" }} />
              Our Entities
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {entities.map((e) => (
                <Link
                  key={e.to}
                  to={e.to}
                  onClick={scrollTop}
                  className="footer-entity-link"
                  style={{ display: "block", padding: "14px 0", borderBottom: "1px solid #161616", transition: "all 0.2s ease" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--red-core)",
                      border: "1px solid #2A0000", padding: "2px 7px", letterSpacing: "0.1em",
                      background: "rgba(204,34,0,0.08)", flexShrink: 0,
                    }}>
                      {e.code}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#AAAAAA" }}>{e.name}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#444444", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", paddingLeft: "0" }}>
                    {e.loc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── COL 4: Infrastructure / Contact ── */}
          <div>
            <h4 style={{ fontSize: "10px", fontWeight: 700, color: "var(--red-core)", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ width: "10px", height: "1.5px", background: "var(--red-core)", display: "inline-block" }} />
              Infrastructure
            </h4>

            <address style={{ fontStyle: "normal", display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* HQ Address */}
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--red-core)" strokeWidth="2" style={{ marginTop: "2px", flexShrink: 0 }}>
                  <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p style={{ fontSize: "13px", color: "#666666", lineHeight: 1.6 }}>
                  30, Third Floor, Shivaji Marg,<br />
                  Moti Nagar, New Delhi&nbsp;110&nbsp;015
                </p>
              </div>

              {/* Phone */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--red-core)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <a href="tel:+918743000299" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#CCCCCC", transition: "color 0.2s" }} className="footer-contact-link">
                  +91&thinsp;8743&thinsp;000&thinsp;299
                </a>
              </div>

              {/* Email */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--red-core)" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:marketing@aadishakti.com" style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--red-core)", transition: "color 0.2s" }} className="footer-contact-link">
                  marketing@aadishakti.com
                </a>
              </div>

              {/* GSTIN / CIN strip */}
              <div style={{ marginTop: "8px", padding: "14px 16px", background: "#0A0A0A", border: "1px solid #1A1A1A", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#333333", letterSpacing: "0.08em" }}>
                  CIN: L27109DL1994PTC058925
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#333333", letterSpacing: "0.08em" }}>
                  Established 2004 &middot; New Delhi, India
                </div>
              </div>
            </address>
          </div>

        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ height: "1px", background: "#181818", margin: "0 clamp(20px,5vw,80px)" }} />

      {/* ══════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════ */}
      <div style={{ background: "#080808" }}>
        <div className="container" style={{ padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#333333" }}>
            &copy; {year} Aadishakti Group. All Rights Reserved.
          </p>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
            {["ISO 9001:2015", "ISO 14001:2015", "BIS IS 27:1992", "Made in India"].map((item, i, arr) => (
              <React.Fragment key={item}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#2C2C2C", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#2A2A2A", display: "inline-block" }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Interactive CSS ── */}
      <style>{`
        .footer-social-btn:hover {
          color: #FFFFFF !important;
          border-color: var(--red-core) !important;
          background: rgba(204,34,0,0.10) !important;
          transform: translateY(-2px);
        }
        .footer-nav-link:hover {
          color: #FFFFFF !important;
          padding-left: 6px !important;
        }
        .footer-entity-link:hover span[style*="color: #AAAAAA"] {
          color: #FFFFFF !important;
        }
        .footer-contact-link:hover {
          color: var(--red-bright) !important;
        }
        @media (max-width: 1024px) {
          .container > div[style*="gridTemplateColumns: 1.8fr"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .container > div[style*="gridTemplateColumns: 1.8fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
