import React from "react";
import { motion } from "framer-motion";

export default function ScrollReveal({ children, delay = 0, duration = 0.6 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94], // matching the non-negotiable cubic-bezier
      }}
    >
      {children}
    </motion.div>
  );
}
