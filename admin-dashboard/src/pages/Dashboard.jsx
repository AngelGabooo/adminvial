import { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle, AlertTriangle,
  TrendingUp, TrendingDown, Map, Calendar, Zap,
  Activity, BarChart3, Eye, Filter
} from 'lucide-react';
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
import { reports, getStatusColor, getCategoryColor } from '../utils/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltos: 0
  });
  const [avgResolutionTime, setAvgResolutionTime] = useState(0);
  const [weeklyReports, setWeeklyReports] = useState(0);

  useEffect(() => {
    const total = reports.length;
    const pendientes = reports.filter(r => r.status === 'pendiente').length;
    const enProceso = reports.filter(r => r.status === 'en_proceso').length;
    const resueltos = reports.filter(r => r.status === 'resuelto').length;
    
    setStats({ total, pendientes, enProceso, resueltos });

    const resolvedReports = reports.filter(r => r.status === 'resuelto' && r.resolvedAt);
    const avgTime = resolvedReports.reduce((acc, report) => {
      const created = new Date(report.createdAt);
      const resolved = new Date(report.resolvedAt);
      const days = (resolved - created) / (1000 * 60 * 60 * 24);
      return acc + days;
    }, 0) / (resolvedReports.length || 1);
    setAvgResolutionTime(avgTime.toFixed(1));

    const currentWeek = new Date();
    const weekStart = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
    const weekly = reports.filter(r => new Date(r.createdAt) >= weekStart).length;
    setWeeklyReports(weekly);
  }, []);

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
    datasets: [{
      label: 'Reportes por Municipio',
      data: municipalityData,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 8,
    }],
  };

  const doughnutData = {
    labels: categories,
    datasets: [{
      data: categoryData,
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 12 } } }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
    };
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colors[color]} shadow-md`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-500 text-sm mt-1">Visión general del sistema de reportes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Reportes" value={stats.total} icon={FileText} color="blue" change={12} subtitle="+24 vs mes anterior" />
          <StatCard title="Pendientes" value={stats.pendientes} icon={AlertTriangle} color="yellow" change={-5} subtitle="Requieren atención" />
          <StatCard title="En Proceso" value={stats.enProceso} icon={Activity} color="purple" change={8} subtitle="En seguimiento" />
          <StatCard title="Resueltos" value={stats.resueltos} icon={CheckCircle} color="green" change={15} subtitle="Completados" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Reportes por Municipio</h3>
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Reportes por Categoría</h3>
            <div className="h-64">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Critical Zones and Recent Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Zones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Zonas Críticas</h3>
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="space-y-3">
              {[
                { name: "Centro Histórico", reports: 12, percentage: 80 },
                { name: "Zona Norte", reports: 8, percentage: 60 },
                { name: "Periférico Sur", reports: 6, percentage: 45 },
              ].map((zone, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{zone.name}</span>
                    <span className="text-gray-500">{zone.reports} reportes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-2" style={{ width: `${zone.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Reportes Recientes</h3>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-1.5 rounded-lg ${getCategoryColor(report.category)}`}>
                    <AlertTriangle className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full whitespace-nowrap ${getStatusColor(report.status)}`}>
                        {report.status === 'en_proceso' ? 'En proceso' : report.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{report.municipality}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Tiempo promedio de resolución</p>
                <p className="text-xl font-bold">{avgResolutionTime} días</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Reportes esta semana</p>
                <p className="text-xl font-bold">{weeklyReports}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Tasa de resolución</p>
                <p className="text-xl font-bold">{((stats.resueltos / stats.total) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};