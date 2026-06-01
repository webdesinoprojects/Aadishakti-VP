import React, { useState, useEffect, useRef } from "react";

export default function AnimatedNumber({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            animate();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    const animate = () => {
      let startTimestamp = null;
      const duration = 2000; // 2 seconds
      const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // easeOutExpo multiplier
        const easeMultiplier = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayValue(Math.floor(easeMultiplier * numericValue));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    return () => observer.disconnect();
  }, [value]);

  const textSuffix = value.replace(/[0-9]/g, "") + suffix;

  return (
    <span ref={elementRef}>
      {displayValue.toLocaleString()}
      {textSuffix}
    </span>
  );
}
