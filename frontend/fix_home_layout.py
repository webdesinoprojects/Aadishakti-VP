import os

home_path = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src\pages\Home.jsx"

with open(home_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Section 3: "55% 45%" grid
content = content.replace(
    '<div style={{ display: "grid", gridTemplateColumns: "55% 45%", gap: "56px", alignItems: "center" }}>',
    '<div className="split-grid-55-45">'
)

# 2. Section 3 stats row
content = content.replace(
    '<div style={{ display: "flex", gap: "48px" }}>',
    '<div className="home-stats-row">'
)

# 3. Section 3 mosaic grid
content = content.replace(
    '<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 180px", gap: "4px" }}>',
    '<div className="mosaic-grid">'
)

# 4. Section 4 TWO ENTITIES
content = content.replace(
    '<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>',
    '<div className="grid-2 no-gap">'
)

# 5. Line 525: repeat(4, 1fr)
content = content.replace(
    '<div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>',
    '<div className="grid-4 no-gap">'
)

# 6. Line 634: repeat(3, 1fr)
content = content.replace(
    '<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>',
    '<div className="grid-3" style={{ gap: "16px" }}>'
)

with open(home_path, "w", encoding="utf-8") as f:
    f.write(content)


# Add CSS to index.css
css_path = r"c:\Users\asnoi\Downloads\Aadishakti-VP\frontend\src\index.css"

with open(css_path, "a", encoding="utf-8") as f:
    f.write("""
/* ==========================================================================
   HOME PAGE RESPONSIVE GRIDS
   ========================================================================== */
.split-grid-55-45 {
  display: grid;
  grid-template-columns: 55% 45%;
  gap: 56px;
  align-items: center;
}

.home-stats-row {
  display: flex;
  gap: 48px;
}

.mosaic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 220px 180px;
  gap: 4px;
}

.no-gap {
  gap: 0 !important;
}

@media (max-width: 960px) {
  .split-grid-55-45 {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .home-stats-row {
    flex-wrap: wrap;
    gap: 24px;
  }
  
  .mosaic-grid {
    grid-template-rows: 150px 150px;
  }
}
""")

print("Home.jsx and index.css updated for mobile layouts.")
