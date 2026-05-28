import { useState, useMemo } from 'react';
import {
  Calendar, MapPin, Tag, Filter, Download,
  FileText, FileSpreadsheet, CheckCircle, Clock,
  AlertCircle, Eye, Trash2, RefreshCw
} from 'lucide-react';
import { reports, municipalities, categories } from '../utils/mockData';

export const ExportData = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);

  // Historial de exportaciones recientes
  const [exportHistory] = useState([
    { id: 1, date: '2024-01-20 15:30', records: 45, format: 'csv', user: 'Admin' },
    { id: 2, date: '2024-01-19 10:15', records: 128, format: 'xlsx', user: 'Admin' },
    { id: 3, date: '2024-01-18 09:00', records: 67, format: 'csv', user: 'Admin' },
  ]);

  const statuses = [
    { value: '', label: 'Todos' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'resuelto', label: 'Resueltos' }
  ];

  // Filtrar reportes según criterios
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Filtro por fecha
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter(r => new Date(r.createdAt) >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      filtered = filtered.filter(r => new Date(r.createdAt) <= endDate);
    }

    // Filtro por municipio
    if (selectedMunicipality) {
      filtered = filtered.filter(r => r.municipality === selectedMunicipality);
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // Filtro por estado
    if (selectedStatus) {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    return filtered;
  }, [dateRange, selectedMunicipality, selectedCategory, selectedStatus]);

  const clearFilters = () => {
    setDateRange({
      start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    });
    setSelectedMunicipality('');
    setSelectedCategory('');
    setSelectedStatus('');
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simular exportación
    setTimeout(() => {
      const data = filteredReports.map(r => ({
        ID: r.id,
        Título: r.title,
        Categoría: r.category,
        Estado: r.status,
        Municipio: r.municipality,
        Fecha: r.createdAt,
        Descripción: r.description
      }));

      // Crear CSV
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
      ];
      const csv = csvRows.join('\n');

      // Descargar
      const blob = new Blob([csv], { type: exportFormat === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reportes_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);
      
      setIsExporting(false);
    }, 1500);
  };

  const FilterCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Exportar Reportes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Exporta reportes con filtros personalizados</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Filtros */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de exportación</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FilterCard title="Rango de fechas" icon={Calendar}>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </FilterCard>

                <FilterCard title="Municipio" icon={MapPin}>
                  <select
                    value={selectedMunicipality}
                    onChange={(e) => setSelectedMunicipality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos los municipios</option>
                    {municipalities.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </FilterCard>

                <FilterCard title="Categoría" icon={Tag}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FilterCard>

                <FilterCard title="Estado" icon={Filter}>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </FilterCard>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Vista previa */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Vista previa</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{filteredReports.length} registros</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Folio</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Título</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Categoría</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Municipio</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReports.slice(0, 5).map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs text-gray-900">#{report.id}</td>
                        <td className="px-3 py-2 text-xs text-gray-600 max-w-[200px] truncate">{report.title}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{report.category}</td>
                        <td className="px-3 py-2 text-xs text-gray-600">{report.municipality}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredReports.length > 5 && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  +{filteredReports.length - 5} registros más
                </p>
              )}
            </div>
          </div>

          {/* Columna derecha - Exportación */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Opciones de exportación</h2>
              
              <div className="space-y-3 mb-5">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">CSV</p>
                    <p className="text-xs text-gray-500">Compatible con Excel, Google Sheets</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                  <input
                    type="radio"
                    value="xlsx"
                    checked={exportFormat === 'xlsx'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <FileSpreadsheet className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="font-medium text-gray-900">Excel (.xlsx)</p>
                    <p className="text-xs text-gray-500">Formato nativo de Excel</p>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Resumen de exportación</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Se exportarán <strong>{filteredReports.length}</strong> reportes
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={isExporting || filteredReports.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-xl font-medium transition-all"
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Exportar Reportes
                  </>
                )}
              </button>
            </div>

            {/* Historial de exportaciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Exportaciones recientes</h2>
              <div className="space-y-3">
                {exportHistory.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Download className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {exp.records} reportes
                        </p>
                        <p className="text-xs text-gray-500">
                          {exp.date} · {exp.format.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-red-500 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};