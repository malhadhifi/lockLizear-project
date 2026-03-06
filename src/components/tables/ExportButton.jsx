import Button from '@/components/common/Button';

export default function ExportButton({ onClick, loading = false, label = 'Export CSV' }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}
            loading={loading} icon="📥">
      {label}
    </Button>
  );
}
