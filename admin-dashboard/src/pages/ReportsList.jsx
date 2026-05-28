import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, X, ChevronLeft, ChevronRight,
  Image as ImageIcon, MapPin, Calendar, Tag,
  Eye, Download, AlertCircle, ArrowUpDown
} from 'lucide-react';
import { reports, getStatusColor, getCategoryColor } from '../utils/mockData';

export const ReportsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    municipality: '',
    date: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  const municipalities = [...new Set(reports.map(r => r.municipality))];
  const categories = [...new Set(reports.map(r => r.category))];
  const statuses = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'resuelto', label: 'Resuelto' }
  ];

  // Filtrar y buscar reportes
  const filteredReports = useMemo(() => {
    let filtered = [...reports];

    // Búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toString().includes(searchTerm)
      );
    }

    // Filtros
    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.municipality) {
      filtered = filtered.filter(r => r.municipality === filters.municipality);
    }
    if (filters.date) {
      filtered = filtered.filter(r => r.createdAt === filters.date);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case 'date':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case 'title':
          aVal = a.title;
          bVal = b.title;
          break;
        case 'folio':
          aVal = a.id;
          bVal = b.id;
          break;
        default:
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, filters, sortBy, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setFilters({ status: '', category: '', municipality: '', date: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || filters.status || filters.category || filters.municipality || filters.date;

  const getStatusText = (status) => {
    const texts = { pendiente: 'Pendiente', en_proceso: 'En proceso', resuelto: 'Resuelto' };
    return texts[status] || status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleRowClick = (id) => {
    navigate(`/reportes/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Todos los Reportes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestión completa de reportes ciudadanos</p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, descripción o folio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
              {hasActiveFilters && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <X className="h-4 w-4" />
                Limpiar
              </button>
            )}
          </div>

          {/* Filtros avanzados */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={filters.municipality}
                  onChange={(e) => setFilters({...filters, municipality: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los municipios</option>
                  {municipalities.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({...filters, date: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resultados y ordenamiento */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <p className="text-sm text-gray-500">
            Mostrando {paginatedReports.length} de {filteredReports.length} reportes
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Fecha</option>
                <option value="title">Título</option>
                <option value="folio">Folio</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm">{sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}</span>
            </button>
          </div>
        </div>

        {/* Tabla de reportes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Folio</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Reporte</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Municipio</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedReports.map((report) => (
                  <tr 
                    key={report.id} 
                    onClick={() => handleRowClick(report.id)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">#{report.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {report.image ? (
                            <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{report.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{report.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{report.municipality}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{formatDate(report.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRowClick(report.id); }}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Mensaje sin resultados */}
        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No se encontraron reportes</h3>
            <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};