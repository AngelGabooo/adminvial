import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const ChartsSection = ({ reports }) => {
  const categories = [...new Set(reports.map(r => r.category))];
  const categoryData = categories.map(cat => 
    reports.filter(r => r.category === cat).length
  );

  const municipalities = [...new Set(reports.map(r => r.municipality))];
  const municipalityData = municipalities.map(mun => 
    reports.filter(r => r.municipality === mun).length
  );

  const barChartData = {
    labels: municipalities,
    datasets: [
      {
        label: 'Reportes por Municipio',
        data: municipalityData,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        data: categoryData,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes por Categoría y Municipio</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <Bar data={barChartData} options={options} />
        </div>
        <div className="h-64">
          <Doughnut data={doughnutData} options={options} />
        </div>
      </div>
    </div>
  );
};