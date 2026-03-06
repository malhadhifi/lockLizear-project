import { useCallback } from 'react';
import { exportCSV, formatDataForExport } from '@/utils/exportCSV';
import useToast from './useToast';

export const useExport = (columns, filename = 'export.csv') => {
  const toast = useToast();

  const exportData = useCallback((data) => {
    try {
      const formatted = formatDataForExport(data, columns);
      exportCSV(formatted, filename);
      toast.success('Export successful');
    } catch {
      toast.error('Export failed');
    }
  }, [columns, filename]);

  return { exportData };
};

export default useExport;
