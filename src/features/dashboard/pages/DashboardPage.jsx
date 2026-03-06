import { useEffect, useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import DashboardStats    from '../components/DashboardStats';
import DashboardPieCharts from '../components/DashboardPieCharts';
import RecentActivity    from '../components/RecentActivity';
import QuickActions      from '../components/QuickActions';
import dashboardService  from '../services/dashboardService';

export default function DashboardPage() {
  const [stats,      setStats]      = useState({});
  const [activities, setActivities] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([dashboardService.getStats(), dashboardService.getRecentActivity()])
      .then(([s, a]) => { setStats(s); setActivities(a); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your DRM system" />
      <DashboardStats stats={stats} />
      <DashboardPieCharts stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivity activities={activities} />
        <QuickActions />
      </div>
    </div>
  );
}
