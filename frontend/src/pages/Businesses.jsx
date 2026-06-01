import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";

const smoothEase = [0.25, 0.46, 0.45, 0.94];

export default function Businesses() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plant = params.get("plant");
    if (plant) {
      const el = document.getElementById(plant);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }, [location.search]);

  return (
    <div style={{ position: "relative", zIndex: 5 }}>
      <PageHero title="OUR OPERATING UNITS" activePage="BUSINESSES" />

      <section
        id="mundra"
        style={{
          minHeight: "85vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid var(--steel)",
          overflow: "hidden",
          scrollMarginTop: "84px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/plant/Plant Pic 02.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.6,
            zIndex: 1,
            filter: "saturate(1.05) contrast(1.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(100deg, rgba(8,8,8,0.74) 0%, rgba(8,8,8,0.55) 40%, rgba(8,8,8,0.35) 100%)",
            zIndex: 2,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 3, padding: "80px 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.62 }}
            transition={{ duration: 0.85, ease: smoothEase }}
            className="grid-2"
            style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.64 }}
              transition={{ duration: 0.75, delay: 0.12, ease: smoothEase }}
            >
              <SectionLabel text="// AGRPL DIVISION" />
              <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: "900", fontSize: "var(--fs-h2)", color: "var(--text-white)", textTransform: "uppercase", marginBottom: "1rem" }}>
                MUNDRA SMELTER DIVISION
              </h2>
              <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "600", fontSize: "16px", color: "var(--red-core)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem" }}>
                AADISHAKTI GREEN RECYCLING PVT. LTD.
              </h3>

              <p style={{ color: "#E4E4E0", fontSize: "var(--fs-lead)", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Located in the maritime economic corridor of Mundra Port Special Economic Zone (SEZ), Kutch, Gujarat. Serves as our sovereign gateway to transboundary logistics.
              </p>
              <p style={{ color: "#D0D0CB", fontSize: "var(--fs-body)", lineHeight: "1.6", marginBottom: "2rem" }}>
                Launched in 2023, AGRPL operates high-capacity smelting and refining furnaces. Close port-proximity secures immediate transboundary vessel clearance within 48 hours of docking. Incorporates modern, baghouse air filtration units matching stringent international ecological guidelines.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ border: "1px solid var(--steel)", background: "rgba(8,8,8,0.72)", padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-white)" }}>
                  ISO 9001:2015 CERTIFIED
                </span>
                <span style={{ border: "1px solid var(--steel)", background: "rgba(8,8,8,0.72)", padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-white)" }}>
                  BASEL COMPLIANT SMELTER
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.64 }}
              transition={{ duration: 0.75, delay: 0.22, ease: smoothEase }}
            >
              <div style={{ background: "rgba(8,8,8,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>30,000 MT</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Active Capacity</p>
              </div>
              <div style={{ background: "rgba(8,8,8,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>120,000 MT</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Capacity by Apr 26</p>
              </div>
              <div style={{ background: "rgba(8,8,8,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>48% Export</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Volume Share</p>
              </div>
              <div style={{ background: "rgba(8,8,8,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>Mundra Port</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Primary Node</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        id="roorkee"
        style={{
          minHeight: "85vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "#111111",
          borderBottom: "1px solid var(--steel)",
          overflow: "hidden",
          scrollMarginTop: "84px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.6,
            zIndex: 1,
            filter: "saturate(1.04) contrast(1.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(100deg, rgba(11,11,11,0.74) 0%, rgba(11,11,11,0.54) 42%, rgba(11,11,11,0.34) 100%)",
            zIndex: 2,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 3, padding: "80px 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 52 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.62 }}
            transition={{ duration: 0.85, ease: smoothEase }}
            className="grid-2"
            style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "center" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.64 }}
              transition={{ duration: 0.75, delay: 0.12, ease: smoothEase }}
            >
              <SectionLabel text="// AMRPL DIVISION" />
              <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: "900", fontSize: "var(--fs-h2)", color: "var(--text-white)", textTransform: "uppercase", marginBottom: "1rem" }}>
                ROORKEE DOMESTIC DIVISION
              </h2>
              <h3 style={{ fontFamily: "var(--font-primary)", fontWeight: "600", fontSize: "16px", color: "var(--red-core)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2rem" }}>
                AADISHAKTI METAL RECYCLING PVT. LTD.
              </h3>

              <p style={{ color: "#E4E4E0", fontSize: "var(--fs-lead)", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                Located in the key industrial estate zone of Roorkee, Haridwar district, Uttarakhand. Serves as our primary domestic distribution division.
              </p>
              <p style={{ color: "#D0D0CB", fontSize: "var(--fs-body)", lineHeight: "1.6", marginBottom: "2rem" }}>
                Acquired in 2014 and restructured in 2023, AMRPL is a fully licensed recycler of hazardous battery wastes under strict regulatory authorization. Outfitted with comprehensive metallurgical pots, casting grids, and high-performance OES spectrographs. Delivers refined ingots directly to North India's major automotive grid grids.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ border: "1px solid var(--steel)", background: "rgba(8,8,8,0.72)", padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-white)" }}>
                  ISO 14001:2015 REGISTERED
                </span>
                <span style={{ border: "1px solid var(--steel)", background: "rgba(8,8,8,0.72)", padding: "8px 16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-white)" }}>
                  HAZARDOUS RECYCLING PERMIT
                </span>
              </div>
            </motion.div>

            <motion.div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.64 }}
              transition={{ duration: 0.75, delay: 0.22, ease: smoothEase }}
            >
              <div style={{ background: "rgba(11,11,11,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>40,000 MT</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Active Capacity</p>
              </div>
              <div style={{ background: "rgba(11,11,11,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>100% Audit</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Safety Compliant</p>
              </div>
              <div style={{ background: "rgba(11,11,11,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>2014 Acq.</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Group Legacy</p>
              </div>
              <div style={{ background: "rgba(11,11,11,0.58)", backdropFilter: "blur(1px)", border: "1px solid rgba(255,255,255,0.18)", padding: "24px", borderTop: "2px solid var(--red-core)" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "28px", color: "var(--text-white)", fontWeight: "700" }}>OES Testing</div>
                <p style={{ color: "#A7A7A2", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Lab Analysis</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
