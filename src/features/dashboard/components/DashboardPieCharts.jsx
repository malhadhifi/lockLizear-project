import PieChart from '@/components/charts/PieChart';

export default function DashboardPieCharts({ stats = {} }) {
  const userStatusData = [
    { label: 'Active',    value: stats.activeUsers    || 0, color: '#22c55e' },
    { label: 'Inactive',  value: stats.inactiveUsers  || 0, color: '#ef4444' },
    { label: 'Expired',   value: stats.expiredLicenses|| 0, color: '#f59e0b' },
    { label: 'Suspended', value: stats.suspendedUsers || 0, color: '#6b7280' },
  ];
  const docTypeData = [
    { label: 'Video', value: stats.videoCount || 0, color: '#3b82f6' },
    { label: 'PDF',   value: stats.pdfCount   || 0, color: '#ef4444' },
    { label: 'Audio', value: stats.audioCount || 0, color: '#22c55e' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <PieChart title="User Status Distribution" data={userStatusData} />
      <PieChart title="Document Types" data={docTypeData} />
    </div>
  );
}
