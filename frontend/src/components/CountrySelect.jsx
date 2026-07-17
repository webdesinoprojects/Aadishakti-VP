import { useState, useRef, useEffect } from "react";
import { allCountryOptions } from "../utils/countries";
import { ChevronDown } from "lucide-react";

export default function CountrySelect({ name, value, onChange, className, style }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = allCountryOptions.find(opt => opt.value === value) || allCountryOptions[0];

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      <div
        className={className}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          width: "100%",
          paddingRight: "8px"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selectedOption.label.split(" (")[0]} ({selectedOption.value})
        </span>
        <ChevronDown size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "250px", // wider than the select to show full country name
            maxHeight: "220px",
            overflowY: "auto",
            background: "var(--bg-primary, #ffffff)",
            border: "1px solid var(--border-light, #e2e8f0)",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 9999,
            marginTop: "4px"
          }}
        >
          {allCountryOptions.map((opt) => (
            <div
              key={`${opt.label}-${opt.value}`}
              onClick={() => handleSelect(opt.value)}
              style={{
                padding: "8px 12px",
                fontSize: "13px",
                cursor: "pointer",
                color: opt.value === value ? "var(--red-core)" : "var(--text-primary)",
                background: opt.value === value ? "var(--bg-secondary)" : "transparent",
                borderBottom: "1px solid var(--border-light)",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "var(--bg-secondary)";
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) e.currentTarget.style.background = "transparent";
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
