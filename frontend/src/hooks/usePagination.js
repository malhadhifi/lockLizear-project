// =============================================
// usePagination Hook
// ترقيم الصفحات
// =============================================

import { useState } from 'react';
import { APP_CONFIG } from '../config/app.config';

export const usePagination = (initialPage = 1, initialPerPage = APP_CONFIG.DEFAULT_PAGE_SIZE) => {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / perPage);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const resetPagination = () => {
    setPage(1);
    setTotal(0);
  };

  return {
    page, perPage, total, totalPages,
    setPage, setPerPage, setTotal,
    goToPage, nextPage, prevPage, resetPagination,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export default usePagination;
