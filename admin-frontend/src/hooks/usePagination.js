import { useEffect, useState } from "react";

export function usePagination({
  initialPage = 1,
  totalPages = 1
} = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Keep page within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
    if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const resetPage = () => {
    setCurrentPage(initialPage);
  };

  return {
    currentPage,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    resetPage
  };
}
