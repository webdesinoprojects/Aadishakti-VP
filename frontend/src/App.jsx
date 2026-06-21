import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnnouncementBar from "./components/AnnouncementBar";
import AdminApp from "./admin/AdminApp";
import VendorApp from "./vendor/VendorApp";
import CustomerApp from "./customer/CustomerApp";

import Login from "./pages/auth/Login";
import VendorRegister from "./pages/auth/VendorRegister";

import Home from "./pages/Home";
import About from "./pages/About";
import Businesses from "./pages/Businesses";
import Products from "./pages/Products";
import Sustainability from "./pages/Sustainability";
import TrackOrder from "./pages/TrackOrder";
import Investors from "./pages/Investors";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import CustomAlloy from "./pages/CustomAlloy";
import Sourcing from "./pages/Sourcing";
import Import from "./pages/Import";
import Media from "./pages/Media";
import Gallery from "./pages/Gallery";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
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

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVendorRoute = location.pathname.startsWith('/vendor');
  const isCustomerRoute = location.pathname.startsWith('/customer');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    // Skip intersection observer for admin routes
    if (isAdminRoute) return;

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
    items.forEach((el) => {
      el.classList.add("reveal-item");
      observer.observe(el);
    });
    return () => items.forEach((el) => observer.unobserve(el));
  }, [location.pathname, isAdminRoute]);

  // Render admin panel without main site layout
  if (isAdminRoute) {
    return <AdminApp />;
  }

  // Render vendor portal without main site layout
  if (isVendorRoute) {
    return <VendorApp />;
  }

  // Render customer portal without main site layout
  if (isCustomerRoute) {
    return <CustomerApp />;
  }

  // Render auth routes without main site layout
  if (isAuthRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<VendorRegister />} />
      </Routes>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", color: "var(--text-secondary)" }}>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />

      <main style={{ flex: 1, paddingTop: 0 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/businesses" element={<PageTransition><Businesses /></PageTransition>} />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/sustainability" element={<PageTransition><Sustainability /></PageTransition>} />
            <Route path="/track" element={<PageTransition><TrackOrder /></PageTransition>} />
            <Route path="/investors" element={<PageTransition><Investors /></PageTransition>} />
            <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
            <Route path="/sourcing" element={<PageTransition><Sourcing /></PageTransition>} />
            <Route path="/import" element={<PageTransition><Import /></PageTransition>} />
            <Route path="/media" element={<PageTransition><Media /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/custom-alloy" element={<PageTransition><CustomAlloy /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
