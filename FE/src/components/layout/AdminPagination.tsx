import React from 'react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function AdminPagination({ currentPage, totalPages, setCurrentPage }: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const getPaginationGroup = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
      end = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }

    const group = [];
    for (let i = start; i <= end; i++) {
      group.push(i);
    }
    return group;
  };

  const handlePrev = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNext = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  return (
    <div className="card-footer bg-white border-top py-3">
      <ul className="pagination justify-content-end mb-0">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePrev}>Trước</button>
        </li>
        {currentPage > 3 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
            </li>
            {currentPage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          </>
        )}
        {getPaginationGroup().map(page => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
          </li>
        ))}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            <li className="page-item">
              <button className="page-link" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
            </li>
          </>
        )}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handleNext}>Sau</button>
        </li>
      </ul>
    </div>
  );
}
