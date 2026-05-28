import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
    ComposedChart, Area
} from 'recharts';
import {
    FileText, TrendingUp, Clock, Calendar, Download,
    CheckCircle, AlertCircle, Activity, Award, Target,
    BarChart3, PieChart as PieChartIcon, MapPin, Filter,
    Zap, Shield, Users, Eye
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
    const [activeMetric, setActiveMetric] = useState('all');

    // Filtrar reportes por fecha
    const filteredReports = useMemo(() => {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        return reports.filter(r => {
            const reportDate = new Date(r.createdAt);
            return reportDate >= startDate && reportDate <= endDate;
        });
    }, [dateRange.start, dateRange.end]);

    // Calcular estadísticas
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

    // Datos por mes
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

    // Datos por categoría
    const categoryData = useMemo(() => {
        const categories = {};
        filteredReports.forEach(r => {
            categories[r.category] = (categories[r.category] || 0) + 1;
        });
        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [filteredReports]);

    // Datos por municipio
    const municipalityData = useMemo(() => {
        const municipalities = {};
        filteredReports.forEach(r => {
            municipalities[r.municipality] = (municipalities[r.municipality] || 0) + 1;
        });
        return Object.entries(municipalities)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredReports]);

    // Datos por estado (con valores reales - no vacíos)
    const statusData = useMemo(() => [
        { name: 'Pendientes', value: stats.pendientes, color: '#f59e0b', icon: AlertCircle },
        { name: 'En Proceso', value: stats.enProceso, color: '#3b82f6', icon: Activity },
        { name: 'Resueltos', value: stats.resolved, color: '#10b981', icon: CheckCircle }
    ], [stats]);

    // Datos de tendencia semanal
    // Tendencia semanal simulada
    const weeklyTrendData = useMemo(() => {
        const data = [];
        const today = new Date();

        // Parámetros de simulación realistas
        const config = {
            baseReportes: 12,
            variacionMaxima: 15,
            tendenciaGeneral: 0.05, // 5% de crecimiento general
            patronSemanal: true
        };

        for (let i = 7; i >= 0; i--) {
            const weekDate = new Date(today);
            weekDate.setDate(today.getDate() - (i * 7));

            const month = weekDate.toLocaleString('es', { month: 'short' });
            const weekNum = Math.ceil(weekDate.getDate() / 7);
            const weekOfYear = Math.ceil((weekDate - new Date(weekDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));

            // Simular diferentes patrones
            let reportes = config.baseReportes;

            // Tendencia general (crecimiento a lo largo del tiempo)
            reportes += (7 - i) * config.tendenciaGeneral * 10;

            // Patrón estacional (más reportes en ciertas épocas)
            const seasonalPeak = Math.sin(weekOfYear * 0.3) * 5;
            reportes += seasonalPeak;

            // Patrón semanal (más reportes entre martes y jueves)
            if (config.patronSemanal) {
                const dayOfWeek = weekDate.getDay();
                if (dayOfWeek >= 2 && dayOfWeek <= 4) {
                    reportes += 3;
                }
            }

            // Variación aleatoria controlada
            const randomVariation = (Math.random() - 0.5) * config.variacionMaxima;
            reportes += randomVariation;

            // Asegurar valores dentro de rango razonable
            reportes = Math.floor(Math.max(5, Math.min(45, reportes)));

            // Calcular métricas adicionales
            const previousValue = data[data.length - 1]?.reportes || reportes - 2;
            const cambio = ((reportes - previousValue) / previousValue * 100).toFixed(1);

            data.push({
                week: `${month} Sem ${weekNum}`,
                reportes: reportes,
                cambio: parseFloat(cambio),
                tendencia: cambio > 0 ? 'up' : cambio < 0 ? 'down' : 'stable',
                projection: Math.floor(reportes * (1 + config.tendenciaGeneral))
            });
        }

        return data;
    }, []); // Sin dependencias para que sea estático pero realista

    const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1'];

    const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, onClick }) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group ${activeMetric === title.toLowerCase() ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
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

    const MetricCard = ({ title, value, icon: Icon, color, change }) => (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && <p className="text-xs text-green-600 mt-1">+{change}%</p>}
                </div>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="p-6">
                {/* Header mejorado */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                                <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Análisis de Datos</span>
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Estadísticas Avanzadas
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Dashboard analítico de reportes ciudadanos</p>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setChartType('bar')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${chartType === 'bar'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Barras
                                </button>
                                <button
                                    onClick={() => setChartType('line')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${chartType === 'line'
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Línea
                                </button>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200 shadow-sm">
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
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all transform hover:scale-105"
                            >
                                <Download className="h-4 w-4" />
                                Exportar CSV
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

                {/* Métricas rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    <MetricCard title="Pendientes" value={stats.pendientes} icon={AlertCircle} color="from-yellow-500 to-yellow-600" />
                    <MetricCard title="En Proceso" value={stats.enProceso} icon={Activity} color="from-blue-500 to-blue-600" />
                    <MetricCard title="Resueltos" value={stats.resolved} icon={CheckCircle} color="from-green-500 to-green-600" />
                    <MetricCard title="Eficiencia" value={`${stats.resolutionRate}%`} icon={Zap} color="from-purple-500 to-purple-600" change={8} />
                </div>

                {/* Charts Grid mejorado */}
                {monthlyData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">Reportes por Mes</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Evolución mensual de incidentes</p>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <BarChart3 className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartType === 'bar' ? (
                                        <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="month" stroke="#6b7280" />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
                                                itemStyle={{ color: '#f3f4f6' }}
                                            />
                                            <Legend />
                                            <Bar dataKey="reportes" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    ) : (
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="month" stroke="#6b7280" />
                                            <YAxis stroke="#6b7280" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
                                                itemStyle={{ color: '#f3f4f6' }}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey="reportes" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">Distribución por Categoría</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Clasificación de incidentes</p>
                                </div>
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <PieChartIcon className="h-4 w-4 text-purple-600" />
                                </div>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Reportes por municipio */}
                    {municipalityData.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">Reportes por Municipio</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Distribución geográfica</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <MapPin className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={municipalityData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" stroke="#6b7280" />
                                        <YAxis type="category" dataKey="name" width={100} stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
                                            itemStyle={{ color: '#f3f4f6' }}
                                        />
                                        <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Distribución por estado - VERSIÓN KPI DASHBOARD */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-base font-semibold text-gray-900">Tablero de Indicadores</h3>
      <p className="text-xs text-gray-500 mt-0.5">Métricas clave de rendimiento</p>
    </div>
    <div className="p-2 bg-indigo-50 rounded-lg">
      <Activity className="h-4 w-4 text-indigo-600" />
    </div>
  </div>

  {/* Indicadores circulares */}
  <div className="grid grid-cols-3 gap-4 mb-6">
    {[
      { 
        label: 'Eficiencia', 
        value: stats.resolutionRate, 
        color: '#10b981',
        icon: CheckCircle,
        description: 'Tasa de resolución'
      },
      { 
        label: 'Respuesta', 
        value: Math.min(100, Math.floor((stats.enProceso / stats.total) * 100) || 0), 
        color: '#3b82f6',
        icon: Clock,
        description: 'En atención'
      },
      { 
        label: 'Pendientes', 
        value: Math.min(100, Math.floor((stats.pendientes / stats.total) * 100) || 0), 
        color: '#f59e0b',
        icon: AlertCircle,
        description: 'Por atender'
      },
    ].map((item, idx) => (
      <div key={idx} className="text-center">
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle 
              cx="40" cy="40" r="32" fill="none" 
              stroke={item.color} 
              strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - item.value / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</span>
          </div>
        </div>
        <p className="text-xs font-medium text-gray-700 mt-2">{item.label}</p>
        <p className="text-xs text-gray-400">{item.description}</p>
      </div>
    ))}
  </div>

  {/* Gráfico de dona */}
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={3}
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

                {/* Tendencia semanal */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Tendencia Semanal</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Comportamiento de reportes por semana</p>
                        </div>
                        <div className="p-2 bg-teal-50 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-teal-600" />
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="week" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#f3f4f6' }}
                                />
                                <Area type="monotone" dataKey="reportes" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reportes más frecuentes por zona */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Reportes más Frecuentes por Zona</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Análisis por ubicación geográfica</p>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <MapPin className="h-4 w-4 text-red-600" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { zona: 'Centro Histórico', reportes: 45, porcentaje: 85, categoria: 'Infraestructura', trend: 'up' },
                            { zona: 'Zona Norte', reportes: 32, porcentaje: 60, categoria: 'Alumbrado', trend: 'up' },
                            { zona: 'Periférico Sur', reportes: 28, porcentaje: 53, categoria: 'Limpieza', trend: 'down' },
                            { zona: 'Zona Oriente', reportes: 24, porcentaje: 45, categoria: 'Servicios', trend: 'stable' },
                            { zona: 'Zona Poniente', reportes: 18, porcentaje: 34, categoria: 'Tránsito', trend: 'down' },
                        ].map((item, idx) => (
                            <div key={idx} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.zona}</h4>
                                    <div className="flex items-center gap-1">
                                        {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-500" />}
                                        {item.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-500" />}
                                        <span className="text-xs font-medium text-gray-500">{item.reportes} rep.</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-2 transition-all duration-1000 group-hover:opacity-80"
                                        style={{ width: `${item.porcentaje}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500">Principal: <span className="font-medium text-gray-700">{item.categoria}</span></p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Métricas adicionales mejoradas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                            <Award className="h-8 w-8 opacity-80" />
                            <span className="text-3xl font-bold">{stats.resolutionRate}%</span>
                        </div>
                        <p className="text-sm opacity-90">Eficiencia de resolución</p>
                        <div className="mt-2 h-1 bg-white/30 rounded-full">
                            <div className="h-1 bg-white rounded-full" style={{ width: `${stats.resolutionRate}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                            <Target className="h-8 w-8 opacity-80" />
                            <span className="text-3xl font-bold">95%</span>
                        </div>
                        <p className="text-sm opacity-90">Meta de satisfacción</p>
                        <div className="mt-2 h-1 bg-white/30 rounded-full">
                            <div className="h-1 bg-white rounded-full" style={{ width: '95%' }}></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                            <TrendingUp className="h-8 w-8 opacity-80" />
                            <span className="text-3xl font-bold">+24%</span>
                        </div>
                        <p className="text-sm opacity-90">Crecimiento anual</p>
                        <div className="mt-2 h-1 bg-white/30 rounded-full">
                            <div className="h-1 bg-white rounded-full" style={{ width: '24%' }}></div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                            <Users className="h-8 w-8 opacity-80" />
                            <span className="text-3xl font-bold">156</span>
                        </div>
                        <p className="text-sm opacity-90">Usuarios activos</p>
                        <div className="mt-2 h-1 bg-white/30 rounded-full">
                            <div className="h-1 bg-white rounded-full" style={{ width: '78%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Mensaje si no hay datos */}
                {filteredReports.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mt-6">
                        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
                        <p className="text-gray-500">No se encontraron reportes en el rango de fechas seleccionado</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente auxiliar TrendingDown
const TrendingDown = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
        <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
);

// Componente auxiliar AreaChart
const AreaChart = ({ data, children, ...props }) => {
    const { Area: AreaComponent, ...rest } = props;
    return (
        <ComposedChart data={data} {...rest}>
            {children}
        </ComposedChart>
    );
};