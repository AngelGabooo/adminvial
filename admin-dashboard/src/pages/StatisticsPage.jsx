import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  ComposedChart, Area
} from 'recharts';
import {
  FileText, TrendingUp, Clock, Calendar, Download,
  CheckCircle, AlertCircle, Activity, Award, Target
} from 'lucide-react';
import { reports } from '../utils/mockData';

export const StatisticsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 6);
      return date.toISOString().split('T')[0];
    })(),
    end: new Date().toISOString().split('T')[0]
  });
  const [chartType, setChartType] = useState('bar');

  // Filtrar reportes por fecha de forma estable con useMemo
  const filteredReports = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);
    
    return reports.filter(r => {
      const reportDate = new Date(r.createdAt);
      return reportDate >= startDate && reportDate <= endDate;
    });
  }, [dateRange.start, dateRange.end]);

  // Calcular estadísticas con useMemo
  const stats = useMemo(() => {
    const total = filteredReports.length;
    const resolved = filteredReports.filter(r => r.status === 'resuelto').length;
    const pendientes = filteredReports.filter(r => r.status === 'pendiente').length;
    const enProceso = filteredReports.filter(r => r.status === 'en_proceso').length;
    const resolvedWithTime = filteredReports.filter(r => r.status === 'resuelto' && r.resolvedAt);
    
    const avgTime = resolvedWithTime.reduce((acc, r) => {
      const created = new Date(r.createdAt);
      const resolved = new Date(r.resolvedAt);
      return acc + (resolved - created) / (1000 * 60 * 60 * 24);
    }, 0) / (resolvedWithTime.length || 1);
    
    return {
      total,
      resolved,
      pendientes,
      enProceso,
      avgResolutionTime: avgTime.toFixed(1),
      resolutionRate: total ? ((resolved / total) * 100).toFixed(1) : 0,
      weeklyAverage: Math.round(total / 4) || 0
    };
  }, [filteredReports]);

  // Datos por mes con useMemo
  const monthlyData = useMemo(() => {
    const months = {};
    filteredReports.forEach(r => {
      const date = new Date(r.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return Object.entries(months)
      .map(([month, count]) => ({ month, reportes: count }))
      .slice(-6);
  }, [filteredReports]);

  // Datos por categoría con useMemo
  const categoryData = useMemo(() => {
    const categories = {};
    filteredReports.forEach(r => {
      categories[r.category] = (categories[r.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredReports]);

  // Datos por municipio con useMemo
  const municipalityData = useMemo(() => {
    const municipalities = {};
    filteredReports.forEach(r => {
      municipalities[r.municipality] = (municipalities[r.municipality] || 0) + 1;
    });
    return Object.entries(municipalities)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredReports]);

  // Datos por estado
  const statusData = [
    { name: 'Pendientes', value: stats.pendientes, color: '#f59e0b' },
    { name: 'En proceso', value: stats.enProceso, color: '#3b82f6' },
    { name: 'Resueltos', value: stats.resolved, color: '#10b981' }
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1'];

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
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

  const exportData = useCallback(() => {
    const headers = ['ID', 'Título', 'Categoría', 'Estado', 'Municipio', 'Fecha'];
    const rows = filteredReports.map(r => [
      r.id, r.title, r.category, r.status, r.municipality, r.createdAt
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas_${dateRange.start}_${dateRange.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredReports, dateRange]);

  const handleStartDateChange = (e) => {
    setDateRange(prev => ({ ...prev, start: e.target.value }));
  };

  const handleEndDateChange = (e) => {
    setDateRange(prev => ({ ...prev, end: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Estadísticas Avanzadas
            </h1>
            <p className="text-gray-500 text-sm mt-1">Dashboard analítico de reportes ciudadanos</p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={handleStartDateChange}
                className="text-sm focus:outline-none w-32"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={handleEndDateChange}
                className="text-sm focus:outline-none w-32"
              />
            </div>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Reportes" 
            value={stats.total} 
            icon={FileText} 
            color="from-blue-500 to-blue-600"
            trend={12}
            subtitle="+24 vs mes anterior"
          />
          <StatCard 
            title="Tasa de Resolución" 
            value={`${stats.resolutionRate}%`} 
            icon={CheckCircle} 
            color="from-green-500 to-green-600"
            trend={5}
          />
          <StatCard 
            title="Tiempo Promedio" 
            value={`${stats.avgResolutionTime} días`} 
            icon={Clock} 
            color="from-orange-500 to-orange-600"
            trend={-8}
          />
          <StatCard 
            title="Promedio Semanal" 
            value={stats.weeklyAverage} 
            icon={Activity} 
            color="from-purple-500 to-purple-600"
            trend={15}
          />
        </div>

        {/* Charts Grid */}
        {monthlyData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Reportes por Mes</h3>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    Barras
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${chartType === 'line' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                  >
                    Línea
                  </button>
                </div>
              </div>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  {chartType === 'bar' ? (
                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reportes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reportes" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Reportes por municipio */}
          {municipalityData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Reportes por Municipio</h3>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart 
                    data={municipalityData} 
                    layout="vertical" 
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Distribución por estado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Reportes más frecuentes por zona */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Reportes más Frecuentes por Zona</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { zona: 'Centro Histórico', reportes: 45, porcentaje: 85, categoria: 'Infraestructura' },
              { zona: 'Zona Norte', reportes: 32, porcentaje: 60, categoria: 'Alumbrado' },
              { zona: 'Periférico Sur', reportes: 28, porcentaje: 53, categoria: 'Limpieza' },
              { zona: 'Zona Oriente', reportes: 24, porcentaje: 45, categoria: 'Servicios' },
              { zona: 'Zona Poniente', reportes: 18, porcentaje: 34, categoria: 'Tránsito' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.zona}</h4>
                  <span className="text-xs text-gray-500">{item.reportes} reportes</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-2" style={{ width: `${item.porcentaje}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">Principal categoría: {item.categoria}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <Award className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">{stats.resolutionRate}%</p>
            <p className="text-sm opacity-90">Eficiencia de resolución</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <Target className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">95%</p>
            <p className="text-sm opacity-90">Meta de satisfacción</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <TrendingUp className="h-8 w-8 mb-2 opacity-80" />
            <p className="text-2xl font-bold">+24%</p>
            <p className="text-sm opacity-90">Crecimiento anual</p>
          </div>
        </div>

        {/* Mensaje si no hay datos */}
        {filteredReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No hay datos</h3>
            <p className="text-gray-500">No se encontraron reportes en el rango de fechas seleccionado</p>
          </div>
        )}
      </div>
    </div>
  );
};