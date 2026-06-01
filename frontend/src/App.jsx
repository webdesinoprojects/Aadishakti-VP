import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnnouncementBar from "./components/AnnouncementBar";

import Home from "./pages/Home";
import About from "./pages/About";
import Businesses from "./pages/Businesses";
import Products from "./pages/Products";
import Sustainability from "./pages/Sustainability";
import Investors from "./pages/Investors";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Sourcing from "./pages/Sourcing";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname, search]);
  return null;
}

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{ minHeight: "80vh" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(
      ".dominance-card, .corporate-card, .founder-card, .timeline-item, table.terminal-table"
    );
    items.forEach((el) => { el.classList.add("reveal-item"); observer.observe(el); });
    return () => items.forEach((el) => observer.unobserve(el));
  }, [location.pathname]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />

      <main style={{ flex: 1, paddingTop: 0 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about"         element={<PageTransition><About /></PageTransition>} />
            <Route path="/businesses"    element={<PageTransition><Businesses /></PageTransition>} />
            <Route path="/products"      element={<PageTransition><Products /></PageTransition>} />
            <Route path="/sustainability" element={<PageTransition><Sustainability /></PageTransition>} />
            <Route path="/investors"     element={<PageTransition><Investors /></PageTransition>} />
            <Route path="/careers"       element={<PageTransition><Careers /></PageTransition>} />
            <Route path="/sourcing"      element={<PageTransition><Sourcing /></PageTransition>} />
            <Route path="/contact"       element={<PageTransition><Contact /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
