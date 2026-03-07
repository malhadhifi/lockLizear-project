import Button from '../common/Button';
import { useExport } from '../../hooks/useExport';

const ExportButton = ({ data, filename, columns }) => {
  const { exportToCSV, loading } = useExport();

  const handleExport = () => {
    const exportData = data.map(row => {
      const exportRow = {};
      columns.forEach(col => {
        exportRow[col.label] = row[col.key];
      });
      return exportRow;
    });

    exportToCSV(exportData, filename);
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      size="sm"
      disabled={loading || !data || data.length === 0}
    >
      <span className="mr-2">📥</span>
      تصدير CSV
    </Button>
  );
};

export default ExportButton;
