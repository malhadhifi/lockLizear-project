import { useState, useCallback } from 'react';
import appConfig from '@/config/app.config';

export const usePagination = (defaultSize = appConfig.pagination.defaultPageSize) => {
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(defaultSize);
  const [total,    setTotal]    = useState(0);

  const goToPage    = useCallback((p) => setPage(p), []);
  const changeSize  = useCallback((s) => { setPageSize(s); setPage(1); }, []);
  const reset       = useCallback(() => { setPage(1); }, []);

  const totalPages = Math.ceil(total / pageSize);

  return { page, pageSize, total, totalPages, setTotal, goToPage, changeSize, reset };
};

export default usePagination;
