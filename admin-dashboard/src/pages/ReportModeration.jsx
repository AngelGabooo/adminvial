import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronLeft, ChevronRight,
  Image as ImageIcon, MapPin, Calendar, Tag,
  Eye, CheckCircle, XCircle, AlertTriangle,
  Flag, Shield, User, Clock, AlertCircle,
  Copy, Filter, X, TrendingUp, Activity,
  Award, Target, Zap, BarChart3
} from 'lucide-react';
import { reports, getCategoryColor } from '../utils/mockData';


// Imágenes de Unsplash (gratuitas y de calidad)
const imageUrls = {
  // Para reportes de infraestructura/baches
  bache: 'https://www.jornada.com.mx/ndjsimg/images/jornada/jornadaimg/ciudad-perdida-22306/ciudad-perdida-22306_123d3a44-1ef7-43de-bf81-d3353e08d8f6_medialjnimgndimage=fullsize',
  // Para reportes de alumbrado
  alumbrado: 'https://i.blogs.es/a01afd/baches-3-/450_1000.jpg',
  // Para reportes de basura/limpieza
  basura: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2yUfoOrMFLZ04HNCkBF7ujtHTIsd_uO6PQA&s',
  // Para reportes de inundaciones
  inundacion: 'https://www.informador.mx/__export/1731688911632/sites/elinformador/img/2024/11/15/basura-residuos_version1731688910202.png_969991728.png',
  // Para reportes generales
  general: 'https://images.unsplash.com/photo-1582653291997-079a1b04e5d1?w=800&q=80',
  // Para reportes de tránsito
  transito: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80',
};

// Datos mock para reportes pendientes de moderación
// Datos mock para reportes pendientes de moderación
const pendingReports = [
  {
    id: 101,
    title: 'Publicidad engañosa',
    description: 'Anuncio de servicios no relacionados con la plataforma...',
    category: 'Otros',
    municipality: 'Tuxtla Gutiérrez',
    image: 'https://www.jornada.com.mx/ndjsimg/images/jornada/jornadaimg/ciudad-perdida-22306/ciudad-perdida-22306_123d3a44-1ef7-43de-bf81-d3353e08d8f6_medialjnimgndimage=fullsize', // Imagen de publicidad engañosa
    createdAt: '2024-01-20',
    user: 'Usuario123',
    userEmail: 'usuario123@email.com',
    suspicionReason: 'Contenido promocional no autorizado',
    status: 'suspicious',
    priority: 'high'
  },
  {
    id: 102,
    title: 'Reporte duplicado - Bache en Av. Central',
    description: 'Este reporte ya fue registrado anteriormente...',
    category: 'Infraestructura',
    municipality: 'Tuxtla Gutiérrez',
    image: 'https://i.blogs.es/a01afd/baches-3-/450_1000.jpg', // Imagen de bache
    createdAt: '2024-01-19',
    user: 'Anonimo456',
    userEmail: 'anonimo456@email.com',
    suspicionReason: 'Reporte duplicado (coincide con ID #1)',
    status: 'duplicate',
    priority: 'medium'
  },
  {
    id: 103,
    title: 'Contenido ofensivo',
    description: 'Lenguaje inapropiado en la descripción...',
    category: 'Otros',
    municipality: 'San Cristóbal',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2yUfoOrMFLZ04HNCkBF7ujtHTIsd_uO6PQA&s', // Imagen genérica
    createdAt: '2024-01-18',
    user: 'Usuario789',
    userEmail: 'usuario789@email.com',
    suspicionReason: 'Lenguaje ofensivo detectado',
    status: 'spam',
    priority: 'high'
  },
  {
    id: 104,
    title: 'Información falsa',
    description: 'Reporte con información que no corresponde a la realidad...',
    category: 'Servicios',
    municipality: 'Comitán',
    image: 'https://www.informador.mx/__export/1731688911632/sites/elinformador/img/2024/11/15/basura-residuos_version1731688910202.png_969991728.png', // Imagen de fake news
    createdAt: '2024-01-17',
    user: 'UsuarioXYZ',
    userEmail: 'usuarioxyz@email.com',
    suspicionReason: 'Información verificada como falsa',
    status: 'suspicious',
    priority: 'high'
  },
];

export const ReportModeration = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filters = [
    { value: 'all', label: 'Todos', icon: AlertCircle, color: 'gray', count: pendingReports.length },
    { value: 'suspicious', label: 'Sospechosos', icon: AlertTriangle, color: 'yellow', count: pendingReports.filter(r => r.status === 'suspicious').length },
    { value: 'spam', label: 'Spam', icon: Flag, color: 'red', count: pendingReports.filter(r => r.status === 'spam').length },
    { value: 'duplicate', label: 'Duplicados', icon: Copy, color: 'orange', count: pendingReports.filter(r => r.status === 'duplicate').length },
  ];

  const filteredReports = useMemo(() => {
    let filtered = [...pendingReports];

    if (filterType !== 'all') {
      filtered = filtered.filter(r => r.status === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [filterType, searchTerm]);

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (report) => {
    setSelectedReport(report);
    setConfirmAction('approve');
    setShowConfirmModal(true);
  };

  const handleReject = (report) => {
    setSelectedReport(report);
    setConfirmAction('reject');
    setShowConfirmModal(true);
  };

  const handleViewDetail = (reportId) => {
    navigate(`/reportes/${reportId}`);
  };

  const confirmActionHandler = () => {
    console.log(`${confirmAction} reporte:`, selectedReport?.id);
    setShowConfirmModal(false);
    setSelectedReport(null);
    setConfirmAction(null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'suspicious': return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'spam': return <Flag className="h-3.5 w-3.5" />;
      case 'duplicate': return <Copy className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'suspicious': return 'Sospechoso';
      case 'spam': return 'Spam';
      case 'duplicate': return 'Duplicado';
      default: return 'Pendiente';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'suspicious': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'spam': return 'bg-red-100 text-red-700 border-red-200';
      case 'duplicate': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const FilterButton = ({ filter, label, icon: Icon, color, count }) => (
    <button
      onClick={() => setFilterType(filter)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        filterType === filter
          ? `bg-gradient-to-r ${
              color === 'red' ? 'from-red-500 to-red-600' :
              color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
              color === 'orange' ? 'from-orange-500 to-orange-600' :
              'from-blue-500 to-blue-600'
            } text-white shadow-md`
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
          filterType === filter ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Estadísticas rápidas
  const stats = {
    total: pendingReports.length,
    resolved: 0,
    pending: pendingReports.length,
    efficiency: 98,
    avgResponseTime: '2.5 horas'
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
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Moderación</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Moderación de Reportes
              </h1>
              <p className="text-gray-500 text-sm mt-1">Revisa y modera reportes sospechosos o inapropiados</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Mejoradas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {filters.map(filter => (
            <div 
              key={filter.value} 
              onClick={() => setFilterType(filter.value)}
              className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-lg transition-all cursor-pointer group ${
                filterType === filter.value ? 'ring-2 ring-blue-500 border-transparent' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{filter.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{filter.count}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${
                  filter.color === 'red' ? 'from-red-500 to-red-600' :
                  filter.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                  filter.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  'from-blue-500 to-blue-600'
                } shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <filter.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      filter.color === 'red' ? 'bg-red-500' :
                      filter.color === 'yellow' ? 'bg-yellow-500' :
                      filter.color === 'orange' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${(filter.count / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de búsqueda y filtros mejorada */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, usuario o folio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map(filter => (
                <FilterButton
                  key={filter.value}
                  filter={filter.value}
                  label={filter.label}
                  icon={filter.icon}
                  color={filter.color}
                  count={filter.count}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Mostrando {paginatedReports.length} de {filteredReports.length} reportes
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Actualizado en tiempo real</span>
          </div>
        </div>

        {/* Lista de reportes */}
        {filteredReports.length > 0 ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6 mb-6`}>
            {paginatedReports.map((report) => (
              <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Header con imagen mejorado */}
                <div className="relative">
                  <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {report.image ? (
                      <img src={report.image} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Sin imagen disponible</p>
                      </div>
                    )}
                    {/* Overlay de prioridad */}
                    <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-lg ${getPriorityColor(report.priority)}`}>
                      {report.priority === 'high' ? '⚠️ Alta prioridad' : report.priority === 'medium' ? '📋 Media prioridad' : '✅ Baja prioridad'}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${getStatusColor(report.status)} shadow-sm`}>
                        {getStatusIcon(report.status)}
                        {getStatusText(report.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenido mejorado */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">Folio: #{report.id}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(report.category)}`}>
                          {report.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4 pb-3 border-b border-gray-100">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <MapPin className="h-3 w-3" />
                      {report.municipality}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                      <User className="h-3 w-3" />
                      {report.user}
                    </span>
                  </div>

                  {/* Razón de sospecha mejorada */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-yellow-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-yellow-800">Razón de sospecha</p>
                        <p className="text-xs text-yellow-700">{report.suspicionReason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción mejorados */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(report)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02]"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(report)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium transition-all transform hover:scale-[1.02]"
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleViewDetail(report.id)}
                      className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl transition-all group"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State mejorado */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Todo en orden!</h3>
            <p className="text-gray-500 mb-6">No hay reportes pendientes de moderación en este momento.</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span>Contenido verificado</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                <Shield className="h-4 w-4" />
                <span>Plataforma segura</span>
              </div>
            </div>
          </div>
        )}

        {/* Paginación mejorada */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all disabled:cursor-not-allowed"
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
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
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
              className="p-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Modal de confirmación mejorado */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform animate-scaleIn">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${confirmAction === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {confirmAction === 'approve' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {confirmAction === 'approve' ? 'Aprobar reporte' : 'Rechazar reporte'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas {confirmAction === 'approve' ? 'aprobar' : 'rechazar'} el reporte <strong className="text-gray-900">#{selectedReport?.id}</strong>?
                {confirmAction === 'reject' && ' Este reporte será marcado como spam y no será visible para el público.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmActionHandler}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all transform hover:scale-[1.02] ${
                    confirmAction === 'approve' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};