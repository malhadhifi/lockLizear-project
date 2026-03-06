import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ title, labels, datasets }) {
  const chartData = { labels, datasets };
  return (
    <div className="card">
      {title && <h3 className="text-base font-semibold text-slate-700 mb-4">{title}</h3>}
      <div className="h-56">
        <Bar data={chartData} options={{
          maintainAspectRatio: false,
          plugins: { legend: { display: datasets.length > 1 } },
          scales: { y: { beginAtZero: true } },
        }} />
      </div>
    </div>
  );
}
