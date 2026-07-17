
export default function SectionLabel({ text, light = false }) {
  const textColor = light ? "#FFFFFF" : "var(--red-core)";
  const accentColor = light ? "#FFFFFF" : "var(--red-core)";

  let prefix = "";
  let mainText = text;
  if (text.startsWith("// ")) {
    prefix = "// ";
    mainText = text.substring(3);
  } else if (text.startsWith("//")) {
    prefix = "//";
    mainText = text.substring(2);
  }

  return (
    <div 
      className="section-label-trigger"
      style={{ 
        fontFamily: "var(--font-mono)", 
        fontSize: "var(--fs-label)", 
        fontWeight: "700", 
        color: textColor, 
        letterSpacing: "0.2em", 
        textTransform: "uppercase", 
        display: "flex", 
        alignItems: "center", 
        gap: "1rem", 
        marginBottom: "1rem"
      }}
    >
      {light && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <filter id="grunge-brush">
            <feTurbulence type="fractalNoise" baseFrequency="0.15 0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="speckleNoise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 8 -3" in="speckleNoise" result="speckleAlpha" />
            <feComposite operator="in" in="displaced" in2="speckleAlpha" />
          </filter>
        </svg>
      )}
      
      <div style={{
        position: 'relative',
        display: 'inline-block',
        padding: light ? '6px 14px' : '0'
      }}>
        {light && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--red-core)',
            filter: 'url(#grunge-brush)',
            transform: 'rotate(-1deg)',
            zIndex: 1
          }} />
        )}
        <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
          {prefix && <span style={{ color: accentColor }}>{prefix}</span>}
          {mainText}
        </span>
      </div>
      {!light && <span className="section-label-line" style={{ display: "inline-block", height: "2px", backgroundColor: accentColor, flex: 1, maxWidth: "40px" }}></span>}
    </div>
  );
}
