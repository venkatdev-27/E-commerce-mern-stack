import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="pagination" style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '20px',
      alignItems: 'center'
    }}>
      {/* PREVIOUS */}
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        style={{
          padding: '8px 16px',
          background: currentPage === 1 ? 'var(--bg-secondary)' : 'var(--accent)',
          color: currentPage === 1 ? 'var(--text-secondary)' : 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
      >
        Previous
      </button>

      {/* PAGE INFO */}
      <span style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        Page {currentPage} of {totalPages}
      </span>

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        style={{
          padding: '8px 16px',
          background: currentPage === totalPages ? 'var(--bg-secondary)' : 'var(--accent)',
          color: currentPage === totalPages ? 'var(--text-secondary)' : 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
      >
        Next
      </button>
    </div>
  );
}
