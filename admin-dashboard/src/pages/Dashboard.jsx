import { useState, useEffect } from 'react';
import { 
  FileText, Clock, CheckCircle, AlertTriangle,
  TrendingUp, TrendingDown, Map, Calendar, Zap,
  Activity, BarChart3, Eye, Filter, ChevronRight,
  Shield, Award, Target, Bell, Download
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
  const [selectedPeriod, setSelectedPeriod] = useState('week');

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
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 12,
      barPercentage: 0.7,
    }],
  };

  const doughnutData = {
    labels: categories,
    datasets: [{
      data: categoryData,
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1'],
      borderWidth: 0,
      hoverOffset: 10,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          font: { size: 12 },
          usePointStyle: true,
          boxWidth: 8,
        } 
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        padding: 10,
        cornerRadius: 8,
      }
    },
    layout: {
      padding: 10
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change, subtitle, trend }) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      orange: 'from-orange-500 to-orange-600',
    };

    const bgGradients = {
      blue: 'from-blue-50 to-blue-100/50',
      yellow: 'from-yellow-50 to-yellow-100/50',
      purple: 'from-purple-50 to-purple-100/50',
      green: 'from-green-50 to-green-100/50',
    };

    return (
      <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradients[color]} rounded-2xl p-5 border border-${color}-100 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradients[color]} shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  };

  const QuickAction = ({ icon: Icon, label, color, onClick }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 group"
    >
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md group-hover:shadow-lg`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6">
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Panel de Control
              </h1>
              <p className="text-gray-500 text-sm mt-1">Visión general del sistema de reportes ciudadanos</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                {['week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedPeriod === period
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
                  </button>
                ))}
              </div>
              <button className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <Download className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid mejorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard 
            title="Total Reportes" 
            value={stats.total} 
            icon={FileText} 
            color="blue" 
            trend={12} 
            subtitle="+24 vs mes anterior" 
          />
          <StatCard 
            title="Pendientes" 
            value={stats.pendientes} 
            icon={AlertTriangle} 
            color="yellow" 
            trend={-5} 
            subtitle="Requieren atención" 
          />
          <StatCard 
            title="En Proceso" 
            value={stats.enProceso} 
            icon={Activity} 
            color="purple" 
            trend={8} 
            subtitle="En seguimiento" 
          />
          <StatCard 
            title="Resueltos" 
            value={stats.resueltos} 
            icon={CheckCircle} 
            color="green" 
            trend={15} 
            subtitle="Completados" 
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
          <QuickAction icon={Eye} label="Ver todos" color="from-blue-500 to-blue-600" />
          <QuickAction icon={Map} label="Ver mapa" color="from-purple-500 to-purple-600" />
          <QuickAction icon={BarChart3} label="Estadísticas" color="from-green-500 to-green-600" />
          <QuickAction icon={Filter} label="Filtros" color="from-orange-500 to-orange-600" />
          <QuickAction icon={Bell} label="Alertas" color="from-red-500 to-red-600" />
          <QuickAction icon={Download} label="Exportar" color="from-teal-500 to-teal-600" />
        </div>

        {/* Charts Section mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reportes por Municipio</h3>
                <p className="text-xs text-gray-500 mt-0.5">Distribución geográfica de incidentes</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Map className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="h-72">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reportes por Categoría</h3>
                <p className="text-xs text-gray-500 mt-0.5">Clasificación por tipo de incidente</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="h-72">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Critical Zones and Recent Reports mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Zones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Zonas Críticas</h3>
                <p className="text-xs text-gray-500 mt-0.5">Mayor concentración de incidentes</p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "Centro Histórico", reports: 12, percentage: 80, trend: "up" },
                { name: "Zona Norte", reports: 8, percentage: 60, trend: "up" },
                { name: "Periférico Sur", reports: 6, percentage: 45, trend: "down" },
              ].map((zone, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{zone.name}</span>
                      {zone.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{zone.reports} reportes</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-2.5 transition-all duration-1000 ease-out group-hover:opacity-80"
                        style={{ width: `${zone.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border-t border-gray-100 pt-4">
              Ver todas las zonas
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Reportes Recientes</h3>
                <p className="text-xs text-gray-500 mt-0.5">Últimos incidentes registrados</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className={`p-2 rounded-xl ${getCategoryColor(report.category)} group-hover:scale-110 transition-transform`}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </p>
                      <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${getStatusColor(report.status)}`}>
                        {report.status === 'en_proceso' ? 'En proceso' : report.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Map className="h-3 w-3" />
                        {report.municipality}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 border-t border-gray-100 pt-4">
              Ver todos los reportes
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Bar mejorado */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide">Tiempo promedio de resolución</p>
                <p className="text-2xl font-bold">{avgResolutionTime} días</p>
              </div>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide">Reportes esta semana</p>
                <p className="text-2xl font-bold">{weeklyReports}</p>
              </div>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide">Tasa de resolución</p>
                <p className="text-2xl font-bold">{((stats.resueltos / stats.total) * 100).toFixed(1)}%</p>
              </div>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase tracking-wide">Eficiencia del sistema</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};