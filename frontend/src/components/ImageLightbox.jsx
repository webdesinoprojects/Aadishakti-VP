import React, { useState, useEffect } from 'react';
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

  if (!images || images.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
      >
        <X size={36} />
      </button>

      {images.length > 1 && (
        <button 
          onClick={handlePrev}
          style={{ position: 'absolute', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '15px', borderRadius: '50%' }}
        >
          <ChevronLeft size={36} />
        </button>
      )}

      <img 
        src={images[currentIndex]} 
        alt={`Proof ${currentIndex + 1}`} 
        style={{ maxHeight: '85vh', maxWidth: '85vw', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 50px rgba(0,0,0,0.5)' }} 
      />

      {images.length > 1 && (
        <button 
          onClick={handleNext}
          style={{ position: 'absolute', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', padding: '15px', borderRadius: '50%' }}
        >
          <ChevronRight size={36} />
        </button>
      )}

      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: '30px', color: '#fff', fontSize: '16px', fontWeight: 600, background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px' }}>
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
