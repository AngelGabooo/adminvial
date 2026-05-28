import { useState, useEffect, useCallback } from 'react';
import { reports as initialReports } from '../utils/mockData';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    municipality: '',
    dateRange: { start: null, end: null },
    searchTerm: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enProceso: 0,
    resueltos: 0,
    byCategory: {},
    byMunicipality: {},
    avgResolutionTime: 0
  });

  // Cargar reportes
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        // Simular carga de API
        await new Promise(resolve => setTimeout(resolve, 500));
        setReports(initialReports);
        setError(null);
      } catch (err) {
        setError('Error al cargar los reportes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Calcular estadísticas
  const calculateStats = useCallback((reportsData) => {
    const total = reportsData.length;
    const pendientes = reportsData.filter(r => r.status === 'pendiente').length;
    const enProceso = reportsData.filter(r => r.status === 'en_proceso').length;
    const resueltos = reportsData.filter(r => r.status === 'resuelto').length;

    // Por categoría
    const byCategory = {};
    reportsData.forEach(report => {
      byCategory[report.category] = (byCategory[report.category] || 0) + 1;
    });

    // Por municipio
    const byMunicipality = {};
    reportsData.forEach(report => {
      byMunicipality[report.municipality] = (byMunicipality[report.municipality] || 0) + 1;
    });

    // Tiempo promedio de resolución
    const resolvedReports = reportsData.filter(r => r.status === 'resuelto' && r.resolvedAt);
    const avgResolutionTime = resolvedReports.reduce((acc, report) => {
      const created = new Date(report.createdAt);
      const resolved = new Date(report.resolvedAt);
      const days = (resolved - created) / (1000 * 60 * 60 * 24);
      return acc + days;
    }, 0) / (resolvedReports.length || 1);

    setStats({
      total,
      pendientes,
      enProceso,
      resueltos,
      byCategory,
      byMunicipality,
      avgResolutionTime: avgResolutionTime.toFixed(1)
    });
  }, []);

  // Filtrar reportes
  const filteredReports = useCallback(() => {
    let filtered = [...reports];

    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.municipality) {
      filtered = filtered.filter(r => r.municipality === filters.municipality);
    }
    if (filters.dateRange.start) {
      filtered = filtered.filter(r => new Date(r.createdAt) >= filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(r => new Date(r.createdAt) <= filters.dateRange.end);
    }
    if (filters.searchTerm) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [reports, filters]);

  // Actualizar estadísticas cuando cambian los reportes
  useEffect(() => {
    if (reports.length > 0) {
      calculateStats(reports);
    }
  }, [reports, calculateStats]);

  // CRUD Operations
  const addReport = useCallback(async (newReport) => {
    try {
      const report = {
        ...newReport,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pendiente'
      };
      setReports(prev => [report, ...prev]);
      return report;
    } catch (err) {
      setError('Error al agregar el reporte');
      throw err;
    }
  }, []);

  const updateReport = useCallback(async (id, updates) => {
    try {
      setReports(prev => prev.map(report => 
        report.id === id ? { ...report, ...updates } : report
      ));
    } catch (err) {
      setError('Error al actualizar el reporte');
      throw err;
    }
  }, []);

  const deleteReport = useCallback(async (id) => {
    try {
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (err) {
      setError('Error al eliminar el reporte');
      throw err;
    }
  }, []);

  const getReportById = useCallback((id) => {
    return reports.find(report => report.id === id);
  }, [reports]);

  const getReportsByStatus = useCallback((status) => {
    return reports.filter(report => report.status === status);
  }, [reports]);

  const getReportsByCategory = useCallback((category) => {
    return reports.filter(report => report.category === category);
  }, [reports]);

  const getReportsByMunicipality = useCallback((municipality) => {
    return reports.filter(report => report.municipality === municipality);
  }, [reports]);

  const getWeeklyReports = useCallback(() => {
    const currentWeek = new Date();
    const weekStart = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
    return reports.filter(r => new Date(r.createdAt) >= weekStart);
  }, [reports]);

  const getMonthlyReports = useCallback(() => {
    const currentMonth = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    return reports.filter(r => new Date(r.createdAt) >= monthStart);
  }, [reports]);

  return {
    // Datos
    reports: filteredReports(),
    allReports: reports,
    loading,
    error,
    stats,
    filters,
    
    // Acciones de filtrado
    setFilters,
    clearFilters: () => setFilters({
      category: '',
      status: '',
      municipality: '',
      dateRange: { start: null, end: null },
      searchTerm: ''
    }),
    
    // CRUD
    addReport,
    updateReport,
    deleteReport,
    getReportById,
    
    // Consultas específicas
    getReportsByStatus,
    getReportsByCategory,
    getReportsByMunicipality,
    getWeeklyReports,
    getMonthlyReports,
    
    // Utilidades
    refreshReports: () => {
      setReports([...initialReports]);
    }
  };
};