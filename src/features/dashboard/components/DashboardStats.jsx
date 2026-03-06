import StatsCard from '@/components/charts/StatsCard';

export default function DashboardStats({ stats = {} }) {
  const cards = [
    { title: 'Total Users',        value: stats.totalUsers     || 0, icon: '👥', color: 'blue'   },
    { title: 'Active Users',       value: stats.activeUsers    || 0, icon: '✅',    color: 'green'  },
    { title: 'Total Documents',    value: stats.totalDocuments || 0, icon: '📹', color: 'purple' },
    { title: 'Total Publications', value: stats.totalPubs      || 0, icon: '📚', color: 'orange' },
    { title: 'Devices Registered', value: stats.totalDevices   || 0, icon: '💻', color: 'blue'   },
    { title: 'Expired Licenses',   value: stats.expiredLicenses|| 0, icon: '⏰',    color: 'red'    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((c) => <StatsCard key={c.title} {...c} />)}
    </div>
  );
}
