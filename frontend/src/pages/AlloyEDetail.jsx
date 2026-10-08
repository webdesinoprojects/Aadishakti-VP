import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import SectionLabel from "../components/SectionLabel";
import { useCms } from "../context/CmsContext";
import { DEFAULT_ALLOY_E_PAGE, mergeCmsContent } from "../data/publicCmsDefaults";
import "./alloy-e-detail.css";

const COMPOSITION_COLUMNS = [
  ["materialNumber", "Material Number"],
  ["ag", "Ag"],
  ["as", "As"],
  ["bi", "Bi"],
  ["cd", "Cd"],
  ["cu", "Cu"],
  ["ni", "Ni"],
  ["te", "Te"],
  ["zn", "Zn"],
  ["sb", "Sb"],
  ["sn", "Sn"],
  ["pb", "Pb"],
];

export default function AlloyEDetail({ product }) {
  const { cms } = useCms();
  const content = mergeCmsContent(DEFAULT_ALLOY_E_PAGE, cms?.alloyEPage);
  const introduction = Array.isArray(content.introduction) ? content.introduction : [];
  const composition = Array.isArray(content.composition) ? content.composition : [];
  const packagingBullets = Array.isArray(content.packagingBullets) ? content.packagingBullets : [];
  const certifications = Array.isArray(content.certifications) ? content.certifications : [];

  return (
    <main className="alloy-e-page">
      <PageHero
        title={content.heading.toUpperCase()}
        activePage={content.heading.toUpperCase()}
        image={product.img}
      />

      <section className="alloy-e-intro section-padding">
        <div className="container alloy-e-intro-grid">
          <div className="alloy-e-product-visual">
            <div className="alloy-e-image-frame">
              <img src={product.img} alt={product.name} />
              <span>{product.num}</span>
            </div>
            <div className="alloy-e-fact-card">
              <small>International standard</small>
              <strong>EN 12548</strong>
              <small>Primary application</small>
              <strong>Power cable sheathing</strong>
            </div>
          </div>

          <div className="alloy-e-copy">
            <SectionLabel text={content.eyebrow} />
            <h2>{content.heading}</h2>
            {introduction.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="alloy-e-standard">
              <span>01</span>
              <div>
                <h3>{content.standardHeading}</h3>
                <p>{content.standardText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="alloy-e-composition section-padding">
        <div className="container">
          <SectionLabel text="// CONTROLLED CHEMISTRY" />
          <div className="alloy-e-section-heading">
            <h2>{content.compositionHeading}</h2>
            <p>Alloy E elements by percentage. Material is produced to the stated standard or an approved customer-specific requirement.</p>
          </div>
          <div className="alloy-e-table-wrap">
            <table>
              <thead>
                <tr>
                  {COMPOSITION_COLUMNS.map(([key, label]) => <th key={key}>{label}</th>)}
                </tr>
              </thead>
              <tbody>
                {composition.map((row, index) => (
                  <tr key={`${row.materialNumber || "alloy"}-${index}`}>
                    {COMPOSITION_COLUMNS.map(([key]) => <td key={key}>{row[key] || "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="alloy-e-analysis section-padding">
        <div className="container">
          <SectionLabel text="// MATERIAL PERFORMANCE" />
          <h2>{content.mechanicalHeading}</h2>
          <div className={`alloy-e-analysis-card${content.grainImage ? " has-image" : ""}`}>
            {content.grainImage && <img src={content.grainImage} alt="Lead Alloy E grain structure" />}
            <div>
              <span className="alloy-e-card-index">02</span>
              <h3>{content.grainHeading}</h3>
              <p>{content.grainText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="alloy-e-logistics section-padding">
        <div className="container alloy-e-logistics-grid">
          <div className="alloy-e-packaging">
            <SectionLabel text="// SAFE DELIVERY" />
            <h2>{content.packagingHeading}</h2>
            <p>{content.packagingText}</p>
            <ul>
              {packagingBullets.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          <div className="alloy-e-packaging-visual">
            {content.packagingImage ? (
              <img src={content.packagingImage} alt="Lead Alloy E export packaging" />
            ) : (
              <img src={product.img} alt="Lead Alloy E ingots" />
            )}
          </div>
        </div>
      </section>

      <section className="alloy-e-footer-section section-padding">
        <div className="container alloy-e-footer-grid">
          <div>
            <SectionLabel text="// QUALITY SYSTEMS" />
            <h2>{content.certificationsHeading}</h2>
            <div className="alloy-e-certifications">
              {certifications.map((certification) => <span key={certification}>{certification}</span>)}
            </div>
          </div>
          <div className="alloy-e-address-card">
            <h3>{content.addressHeading}</h3>
            <p>{content.address}</p>
            <a href={content.website} target="_blank" rel="noreferrer">{content.website}</a>
            <Link to="/contact" className="btn-solid-red">Enquire about Alloy E →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
