// =============================================
// useExport Hook
// تصدير البيانات لـ CSV
// =============================================

import { useState } from 'react';
import { exportToCSV } from '../utils/exportCSV';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (data, filename, transformer) => {
    if (!data || data.length === 0) return;
    setIsExporting(true);
    try {
      const finalData = transformer ? data.map(transformer) : data;
      exportToCSV(finalData, filename);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting };
};

export default useExport;
