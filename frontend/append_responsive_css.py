import os

css_path = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src\index.css"

with open(css_path, "a", encoding="utf-8") as f:
    f.write("""
/* ==========================================================================
   HERO RESPONSIVE STYLES
   ========================================================================== */
.hero-nav-arrows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-stats-wrapper {
  background: var(--bg-primary);
  border-top: 1px solid var(--border-light);
  padding: 28px 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 5;
}

.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.hero-stat-num {
  font-size: clamp(28px, 3.5vw, 48px);
}

.hero-stat-label {
  font-size: 11px;
}

@media (max-width: 768px) {
  .hero-nav-arrows {
    flex-direction: row;
    top: auto !important;
    bottom: 220px; /* Above the stats bar */
    transform: none !important;
  }
  
  .hero-stats-wrapper {
    position: relative; /* Remove absolute positioning so it flows naturally */
    bottom: auto;
    padding: 20px 0;
  }
  
  .hero-stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }
  
  .hero-stat-item {
    border-left: none !important;
    border-bottom: 1px solid var(--border-light);
    padding: 0 16px 16px 16px !important;
  }
  
  .hero-stat-item:last-child {
    border-bottom: none;
    padding-bottom: 0 !important;
  }
  
  .hero-stat-num {
    font-size: 32px !important;
  }
  
  .hero-stat-label {
    font-size: 10px !important;
  }
}
""")

print("Hero responsive CSS appended.")
