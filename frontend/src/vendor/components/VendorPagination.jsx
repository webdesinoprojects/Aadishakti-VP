import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function VendorPagination({ totalItems = 0, itemsPerPage = 10, currentPage = 1, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  // For a simple UI, just show all pages if it's less than 6, otherwise basic truncation
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, '...', totalPages);
  }

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) onPageChange(currentPage + 1);
  };

  return (
    <div className="vendor-pagination">
      <button className="vendor-page-btn" disabled={currentPage === 1} onClick={handlePrev}>
        <ChevronLeft size={16} style={{ marginRight: '4px' }} /> Prev
      </button>
      
      {pages.map((page, idx) => (
        page === '...' ? (
          <span key={`dots-${idx}`} className="vendor-page-dots">...</span>
        ) : (
          <button 
            key={page}
            className={`vendor-page-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange && onPageChange(page)}
          >
            {page}
          </button>
        )
      ))}

      <button className="vendor-page-btn" disabled={currentPage === totalPages} onClick={handleNext}>
        Next <ChevronRight size={16} style={{ marginLeft: '4px' }} />
      </button>
    </div>
  );
}
