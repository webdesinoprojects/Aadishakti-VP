import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionLabel from "../components/SectionLabel";
import AnimatedNumber from "../components/AnimatedNumber";
import ScrollReveal from "../components/ScrollReveal";
import { ASSETS } from "../assets/assetMap";

/* ── Data ── */
const heroSlides = [
  {
    image: ASSETS.heroBg1,
    eyebrow: "// EST. 2004 · MUNDRA · ROORKEE",
    titleA: "India's",
    titleB: "Premier",
    titleC: "Secondary Lead Group",
    subtitle: "Two world-class refineries. One unwavering standard of purity.",
  },
  {
    image: ASSETS.heroBg2,
    eyebrow: "// ISO 9001:2015 · BIS CERTIFIED · LME GRADE",
    titleA: "Engineered",
    titleB: "Precision",
    titleC: "in Lead Recycling",
    subtitle: "Consistent metallurgy backed by quality systems, safety culture, and export-grade reliability.",
  },
  {
    image: ASSETS.heroBg3,
    eyebrow: "// CIRCULAR ECONOMY · RESPONSIBLE GROWTH",
    titleA: "Building",
    titleB: "Sustainable",
    titleC: "Industrial Value",
    subtitle: "From battery scrap recovery to high-purity output — every step built for long-term partnerships.",
  },
];

const strengths = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.8">
        <path d="M12 2L3 7v5c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "BIS Certified Quality",
    desc: "IS 27:1992 certified pure lead meeting Bureau of Indian Standards for battery and industrial use.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "20+ Years of Operations",
    desc: "Deep process knowledge and market relationships built over two decades in secondary lead refining.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.8">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
    title: "LME Grade Purity",
    desc: "99.97–99.985% Pb minimum — LME-registered quality accepted by global battery manufacturers.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Zero Liquid Discharge",
    desc: "100% wastewater recycled within plant premises. Closed-circuit processes with PCB compliance.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.8">
        <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    title: "ISO 9001:2015 Certified",
    desc: "Systematic quality management across procurement, smelting, refining, and dispatch operations.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red-core)" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Pan-India Distribution",
    desc: "Supply network reaching major battery manufacturers across North, West, and South India.",
  },
];

const products = [
  { key: "pureLead",   name: "Refined Pure Lead", spec: "99.97–99.985% Pb", desc: "LME-grade for battery and industrial applications.", img: ASSETS.products.pureLead },
  { key: "leadAlloys", name: "Lead Alloys",        spec: "Sb, Ca, Sn variants", desc: "Custom metallurgy for automotive and energy storage.", img: ASSETS.products.leadAlloys },
  { key: "redLead",   name: "Red Lead Oxide",     spec: "Pb₃O₄",           desc: "Consistent particle profile for battery and glass.", img: ASSETS.products.redLead },
  { key: "greyOxide", name: "Grey Lead Oxide",    spec: "2PbO·Pb",         desc: "Controlled reactivity for electrochemical battery use.", img: ASSETS.products.greyOxide },
];

const statsStrip = [
  { num: "50000", suffix: "+", label: "Metric Tonnes PA" },
  { num: "20",    suffix: "+", label: "Years of Operations" },
  { num: "2",     suffix: "",  label: "World-Class Plants" },
  { num: "4",     suffix: "+", label: "Certifications" },
];

const sustainabilityStats = [
  { value: "100%", label: "Battery Scrap Recycled — Nothing to Landfill" },
  { value: "ZLD",  label: "Zero Liquid Discharge — All Water Recycled In-Plant" },
  { value: "ISO",  label: "ISO 14001:2015 Environmental Management System" },
];

const clientNames = [
  "Exide Industries", "Amara Raja Batteries", "Luminous Power Technologies",
  "Su-Kam Power Systems", "HBL Power Systems", "Okaya Power Group",
  "Rocket Electric", "Genus Power Infrastructure", "Livguard Energy",
];

/* ── Component ── */
export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((p) => (p + 1) % heroSlides.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <div style={{ position: "relative", zIndex: 5 }}>

      {/* ════════════════════════════════════════
          SECTION 1 — HERO (100vh, white overlay)
          ════════════════════════════════════════ */}
      <section
        className="hero-section"
        style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        {/* Carousel backgrounds */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {heroSlides.map((s, idx) => (
            <div
              key={s.image}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: `url("${s.image}")`,
                backgroundSize: "cover", backgroundPosition: "center",
                opacity: idx === activeSlide ? 1 : 0,
                transform: idx === activeSlide ? "scale(1)" : "scale(1.03)",
                transition: "opacity 1s ease, transform 5.5s ease",
              }}
            />
          ))}
        </div>

        {/* White gradient overlay — white left, photo right */}
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(105deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 32%, rgba(255,255,255,0.45) 58%, rgba(255,255,255,0.06) 100%)",
          }}
        />

        {/* Content — dark text on white side */}
        <div
          className="container"
          style={{ position: "relative", zIndex: 4, paddingBottom: "120px" }}
        >
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: "620px" }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--red-core)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <span style={{ width: "28px", height: "1.5px", background: "var(--red-core)", marginRight: "10px", display: "inline-block" }} />
              {slide.eyebrow}
            </div>

            <h1 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(36px, 4.5vw, 62px)", color: "var(--text-primary)", lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: "700px" }}>
              {slide.titleA}{" "}
              <span style={{ color: "var(--red-core)" }}>{slide.titleB}</span>{" "}
              {slide.titleC}
            </h1>

            <p style={{ marginTop: "20px", maxWidth: "520px", fontFamily: "var(--font-primary)", fontWeight: 400, fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: 1.65, color: "var(--text-secondary)" }}>
              {slide.subtitle}
            </p>

            <div style={{ marginTop: "36px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/businesses" className="btn-solid-red">Explore Operations</Link>
              <Link to="/investors"  className="btn-ghost-steel">Investor Relations →</Link>
            </div>

            {/* Slide dots */}
            <div style={{ marginTop: "32px", display: "flex", gap: "10px", alignItems: "center" }}>
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setActiveSlide(idx)}
                  style={{
                    width: idx === activeSlide ? "40px" : "28px",
                    height: "4px", border: "none", borderRadius: "999px",
                    background: idx === activeSlide ? "var(--red-core)" : "rgba(0,0,0,0.22)",
                    cursor: "pointer", transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Glassmorphism cert card — bottom right over photo */}
        <motion.div
          className="hero-glass-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { label: "ISO 9001:2015", value: "Quality Certified" },
            { label: "LME Grade Lead", value: "99.97% Pb Min." },
            { label: "Est. 2004", value: "Mundra · Roorkee" },
          ].map((row) => (
            <div key={row.label} className="hero-glass-row">
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {row.label}
              </span>
              <span style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>
                {row.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Prev / Next arrows */}
        <div style={{ position: "absolute", right: "clamp(16px, 3vw, 44px)", top: "50%", transform: "translateY(-50%)", zIndex: 6, display: "flex", flexDirection: "column", gap: "10px" }}>
          {["‹", "›"].map((ch, i) => (
            <button
              key={ch}
              type="button"
              aria-label={i === 0 ? "Previous slide" : "Next slide"}
              onClick={() => setActiveSlide((p) => i === 0 ? (p - 1 + heroSlides.length) % heroSlides.length : (p + 1) % heroSlides.length)}
              style={{ width: "42px", height: "42px", borderRadius: "3px", border: "1px solid rgba(0,0,0,0.18)", background: "rgba(255,255,255,0.62)", backdropFilter: "blur(8px)", color: "var(--text-primary)", fontSize: "28px", lineHeight: 1, cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--red-core)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--red-core)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.62)"; e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)"; }}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-light)", padding: "28px 0", position: "absolute", bottom: 0, width: "100%", zIndex: 5 }}>
          <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { num: "50000", suffix: "+", label: "Metric Tonnes PA" },
              { num: "20",    suffix: "+", label: "Years of Excellence" },
              { num: "2",     suffix: "",  label: "World-Class Plants" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ padding: "0 24px", borderLeft: i > 0 ? "1px solid var(--border-light)" : "none" }}>
                <div style={{ fontFamily: "var(--font-primary)", fontWeight: 800, fontSize: "clamp(28px, 3.5vw, 48px)", color: "var(--text-primary)", lineHeight: 1 }}>
                  <AnimatedNumber value={stat.num} suffix={stat.suffix} />
                </div>
                <div style={{ marginTop: "6px", fontFamily: "var(--font-primary)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — CLIENT NAME TICKER
          ════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-light)", padding: "0", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", height: "68px" }}>
          <div style={{ padding: "0 28px", flexShrink: 0, borderRight: "1px solid var(--border-light)", height: "100%", display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              Trusted by
            </span>
          </div>
          <div className="clients-marquee-wrap" style={{ flex: 1, overflow: "hidden" }}>
            <div className="clients-marquee-inner">
              {[...clientNames, ...clientNames].map((name, i) => (
                <div
                  key={i}
                  style={{
                    padding: "0 44px",
                    fontFamily: "var(--font-primary)", fontWeight: 700,
                    fontSize: "13px", color: "var(--text-secondary)",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    borderRight: "1px solid var(--border-light)",
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — WHO WE ARE (expanded, image mosaic)
          ════════════════════════════════════════ */}
      <section className="section-padding" style={{ background: "var(--bg-primary)", minHeight: "600px" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: "grid", gridTemplateColumns: "55% 45%", gap: "56px", alignItems: "center" }}>
              {/* Left — text */}
              <div>
                <SectionLabel text="// WHO WE ARE" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, lineHeight: 1.15, marginBottom: "20px" }}>
                  With Over 20 Years of <span style={{ color: "var(--red-core)" }}>Operations</span>
                </h2>
                <p style={{ fontSize: "var(--fs-lead)", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "16px" }}>
                  Aadishakti Group transforms used lead-acid battery scrap into high-purity refined products
                  for energy storage and industrial applications. Through strategic smelting facilities in
                  Mundra and Roorkee, we combine process discipline, scale, and supply consistency.
                </p>
                <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "16px" }}>
                  Our Mundra facility (AGRPL) operates in Kutch, Gujarat, adjacent to Adani Port — giving
                  us unmatched access to international battery scrap. Our Roorkee division (AMRPL) serves
                  North India's major battery manufacturers with domestic supply consistency.
                </p>
                <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "36px" }}>
                  Committed to BIS standards, Basel Convention compliance, and zero-liquid-discharge operations,
                  we deliver certified quality with environmental responsibility built in.
                </p>

                <div style={{ display: "flex", gap: "48px" }}>
                  {[
                    { num: "50,000+", label: "MT Annual Capacity" },
                    { num: "₹1000+",  label: "Crore Group Turnover" },
                    { num: "4+",      label: "Active Certifications" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(22px, 2.5vw, 32px)", color: "var(--text-primary)", lineHeight: 1 }}>
                        {s.num}
                      </div>
                      <div style={{ marginTop: "6px", fontFamily: "var(--font-primary)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — image mosaic */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 180px", gap: "4px" }}>
                {[
                  { src: ASSETS.mundraPlant[0], alt: "Mundra plant exterior", style: { gridColumn: "1/2", gridRow: "1/2" } },
                  { src: ASSETS.mundraPlant[11], alt: "Production floor", style: { gridColumn: "2/3", gridRow: "1/2" } },
                  { src: ASSETS.mundraPlant[4], alt: "Plant overview", style: { gridColumn: "1/3", gridRow: "2/3" } },
                ].map((img) => (
                  <motion.img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    style={{ ...img.style, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 4 — TWO ENTITIES (full-bleed photo + glass overlay)
          ════════════════════════════════════════ */}
      <section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {/* AGRPL — Mundra */}
          <div className="entity-card">
            <img className="entity-card-bg" src={ASSETS.mundraPlant[0]} alt="AGRPL Mundra Plant" loading="lazy" />
            <div className="entity-card-overlay" />
            <div className="entity-card-glass">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--red-core)", letterSpacing: "0.16em", marginBottom: "8px" }}>AGRPL</div>
              <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(18px, 2vw, 26px)", color: "#FFFFFF", marginBottom: "8px" }}>
                Mundra Smelter Division
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "16px" }}>
                Export-oriented processing hub — 30,000 MT active, 120,000 MT by 2026. Port-adjacent logistics.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                {["Mundra SEZ", "ISO 9001:2015", "Basel Compliant"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.25)", padding: "4px 10px", letterSpacing: "0.1em" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/businesses?plant=mundra" style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "12px", color: "var(--red-core)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Explore AGRPL →
              </Link>
            </div>
          </div>

          {/* AMRPL — Roorkee */}
          <div className="entity-card">
            <img className="entity-card-bg" src={ASSETS.roorkeeOffice[0]} alt="AMRPL Roorkee Plant" loading="lazy" />
            <div className="entity-card-overlay" />
            <div className="entity-card-glass">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--red-core)", letterSpacing: "0.16em", marginBottom: "8px" }}>AMRPL</div>
              <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(18px, 2vw, 26px)", color: "#FFFFFF", marginBottom: "8px" }}>
                Roorkee Domestic Division
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "16px" }}>
                Domestic supply hub — 40,000 MT capacity. OES spectrograph quality lab. North India distribution.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
                {["Haridwar, UK", "ISO 14001:2015", "Hazardous Permit"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.25)", padding: "4px 10px", letterSpacing: "0.1em" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link to="/businesses?plant=roorkee" style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "12px", color: "var(--red-core)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Explore AMRPL →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 5 — CORE STRENGTHS
          ════════════════════════════════════════ */}
      <section className="section-padding bg-diagonal-hatch" style={{ minHeight: "480px" }}>
        <div className="container">
          <ScrollReveal>
            <SectionLabel text="// WHY AADISHAKTI" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
              <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900 }}>Our Core Strengths</h2>
              <Link to="/about" className="btn-ghost-steel">Company Overview →</Link>
            </div>
            <div className="grid-3" style={{ gap: "20px" }}>
              {strengths.map((s) => (
                <div key={s.title} className="strength-item">
                  <div style={{ marginBottom: "14px" }}>{s.icon}</div>
                  <h4 style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "10px" }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 6 — PRODUCTS TEASER (with photos)
          ════════════════════════════════════════ */}
      <section className="section-padding bg-steel-grid" style={{ minHeight: "520px" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
              <div>
                <SectionLabel text="// PRODUCTS" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900 }}>Core Product Portfolio</h2>
              </div>
              <Link to="/products" className="btn-solid-red">Full Product Catalog</Link>
            </div>

            <div className="grid-4" style={{ gap: "16px" }}>
              {products.map((p) => (
                <div key={p.key} className="product-teaser-card">
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <img
                      className="pt-img"
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", color: "var(--red-core)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
                      {p.spec}
                    </div>
                    <h3 style={{ fontSize: "var(--fs-h3)", fontWeight: 800, marginBottom: "8px" }}>{p.name}</h3>
                    <p style={{ fontSize: "var(--fs-body)", color: "var(--text-muted)", lineHeight: 1.6 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 7 — STATS STRIP (solid red)
          ════════════════════════════════════════ */}
      <section style={{ background: "var(--red-core)", padding: "64px 0" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>
              {statsStrip.map((s, i) => (
                <div key={s.label} className="stats-strip-item">
                  <div style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "clamp(36px, 4vw, 56px)", color: "#FFFFFF", lineHeight: 1 }}>
                    <AnimatedNumber value={s.num} suffix={s.suffix} />
                  </div>
                  <div style={{ marginTop: "8px", fontFamily: "var(--font-primary)", fontWeight: 500, fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 8 — SUSTAINABILITY (dark photo)
          ════════════════════════════════════════ */}
      <section className="dark-photo-section" style={{ minHeight: "500px" }}>
        <img className="dps-bg" src={ASSETS.sustainabilityBg} alt="Aadishakti plant operations" loading="lazy" />
        <div className="dps-content container" style={{ padding: "100px 0" }}>
          <ScrollReveal>
            <div className="grid-2" style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: "60px", alignItems: "center" }}>
              {/* Left — quote + link */}
              <div>
                <SectionLabel text="// SUSTAINABILITY" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15, marginBottom: "24px" }}>
                  Responsible Circular Economy Practices
                </h2>
                <blockquote style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: "clamp(16px, 1.5vw, 20px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, borderLeft: "3px solid var(--red-core)", paddingLeft: "20px", marginBottom: "32px" }}>
                  "Lead recycling is the most efficient form of circular economy — returning full industrial
                   value while protecting the environment from raw mining hazards."
                </blockquote>
                <Link to="/sustainability" className="btn-solid-red">Our Sustainability Commitment →</Link>
              </div>

              {/* Right — glass stat cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {sustainabilityStats.map((s) => (
                  <div key={s.value} className="glass-card-dark" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "28px", color: "#FFFFFF", lineHeight: 1, flexShrink: 0 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 9 — CLIENTS MARQUEE
          ════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-secondary)", padding: "48px 0", borderTop: "1px solid var(--border-light)" }}>
        <div className="container" style={{ marginBottom: "28px" }}>
          <SectionLabel text="// OUR VALUED CLIENTS" />
          <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: "18px", color: "var(--text-muted)" }}>
            Supplying India's leading battery manufacturers
          </h3>
        </div>

        <div className="clients-marquee-wrap" style={{ overflow: "hidden" }}>
          <div className="clients-marquee-inner">
            {[...clientNames, ...clientNames].map((name, i) => (
              <div
                key={i}
                style={{
                  padding: "0 48px",
                  borderRight: "1px solid var(--border-light)",
                  fontFamily: "var(--font-primary)",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 10 — INVESTORS PREVIEW
          ════════════════════════════════════════ */}
      <section style={{ background: "#111111", padding: "80px 0", minHeight: "400px" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginBottom: "40px" }}>
              <div>
                <SectionLabel text="// INVESTORS" />
                <h2 style={{ fontSize: "var(--fs-h2)", fontWeight: 900, color: "var(--text-white)", lineHeight: 1.15 }}>
                  Performance & Growth Visibility
                </h2>
              </div>
              <Link to="/investors" className="btn-ghost-steel" style={{ color: "#B0B0B0", borderColor: "#3A3A3A" }}>
                Open Investor Desk →
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "Revenue Growth", value: "↑ Consistent YoY", desc: "Multi-year track record of volume and revenue expansion." },
                { label: "Capacity Pipeline", value: "120,000 MT", desc: "Expansion to 120,000 MTPA by April 2026 at Mundra facility." },
                { label: "Export Share", value: "48% Volume", desc: "Nearly half of output serves international battery manufacturers." },
              ].map((item) => (
                <div key={item.label} className="glass-card-dark" style={{ padding: "28px 24px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red-core)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "10px" }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-primary)", fontWeight: 900, fontSize: "22px", color: "#FFFFFF", marginBottom: "10px" }}>
                    {item.value}
                  </div>
                  <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link to="/investors" className="btn-solid-red">
                Access Full Investor Dashboard →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Responsive overrides */}
      <style>{`
        .hero-section { padding-top: 72px; }
        body.bar-visible .hero-section { padding-top: 108px; }
        @media (max-width: 900px) {
          section > div[style*="gridTemplateColumns: 1fr 1fr"]:not(.container) { grid-template-columns: 1fr !important; }
          .entity-card { height: 360px; }
        }
        @media (max-width: 768px) {
          section[class*="section-padding"] > .container > div[style*="55%"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
