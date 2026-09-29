import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = React.useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const handlePrev = React.useCallback(() => {
    if (!images || images.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!images || images.length === 0) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, width: '100vw', height: '100dvh',
        background: 'rgba(0,0,0,0.94)', zIndex: 100000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '72px clamp(16px, 7vw, 84px) 50px'
      }}
    >
      <button 
        type="button"
        aria-label="Close image preview"
        onClick={onClose}
        style={{ position: 'absolute', top: '22px', right: '28px', width: '48px', height: '48px', borderRadius: '50%', background: '#FFFFFF', border: 'none', color: '#111111', cursor: 'pointer', display: 'grid', placeItems: 'center', zIndex: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.28)' }}
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <button 
          type="button"
          aria-label="Previous image"
          onClick={(event) => {
            event.stopPropagation();
            handlePrev();
          }}
          style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', cursor: 'pointer', padding: '12px', borderRadius: '50%', zIndex: 2 }}
        >
          <ChevronLeft size={36} />
        </button>
      )}

      <img 
        src={images[currentIndex]} 
        alt={`Gallery image ${currentIndex + 1}`}
        onClick={(event) => event.stopPropagation()}
        style={{ maxHeight: 'calc(100dvh - 122px)', maxWidth: '92vw', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 50px rgba(0,0,0,0.5)' }}
      />

      {images.length > 1 && (
        <button 
          type="button"
          aria-label="Next image"
          onClick={(event) => {
            event.stopPropagation();
            handleNext();
          }}
          style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', cursor: 'pointer', padding: '12px', borderRadius: '50%', zIndex: 2 }}
        >
          <ChevronRight size={36} />
        </button>
      )}

      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: '30px', color: '#fff', fontSize: '16px', fontWeight: 600, background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px' }}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>,
    document.body
  );
}
