import React from "react";

export default function SectionLabel({ text }) {
  return (
    <div 
      className="section-label-trigger"
      style={{ 
        fontFamily: "var(--font-mono)", 
        fontSize: "var(--fs-label)", 
        fontWeight: "500", 
        color: "var(--red-core)", 
        letterSpacing: "0.3em", 
        textTransform: "uppercase", 
        display: "flex", 
        alignItems: "center", 
        gap: "1rem", 
        marginBottom: "1rem" 
      }}
    >
      <span>{text}</span>
      <span className="section-label-line" style={{ display: "inline-block", height: "2px", backgroundColor: "var(--red-core)" }}></span>
    </div>
  );
}
