import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ title, data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{
      data: data.map((d) => d.value),
      backgroundColor: data.map((d) => d.color || '#3b82f6'),
      borderWidth: 0,
    }],
  };
  return (
    <div className="card">
      {title && <h3 className="text-base font-semibold text-slate-700 mb-4">{title}</h3>}
      <div className="h-56">
        <Pie data={chartData} options={{ maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } } }} />
      </div>
    </div>
  );
}
