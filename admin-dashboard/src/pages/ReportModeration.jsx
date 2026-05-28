import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronLeft, ChevronRight,
  Image as ImageIcon, MapPin, Calendar, Tag,
  Eye, CheckCircle, XCircle, AlertTriangle,
  Flag, Shield, User, Clock, AlertCircle,
  Copy, Filter, X
} from 'lucide-react';
import { reports, getCategoryColor } from '../utils/mockData';

// Datos mock para reportes pendientes de moderación
const pendingReports = [
  {
    id: 101,
    title: 'Publicidad engañosa',
    description: 'Anuncio de servicios no relacionados con la plataforma...',
    category: 'Otros',
    municipality: 'Tuxtla Gutiérrez',
    image: null,
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
    image: null,
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
    image: null,
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
    image: null,
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

  const filters = [
    { value: 'all', label: 'Todos', icon: AlertCircle, color: 'gray' },
    { value: 'suspicious', label: 'Sospechosos', icon: AlertTriangle, color: 'yellow' },
    { value: 'spam', label: 'Spam', icon: Flag, color: 'red' },
    { value: 'duplicate', label: 'Duplicados', icon: Copy, color: 'orange' },
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
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'spam': return <Flag className="h-4 w-4 text-red-500" />;
      case 'duplicate': return <Copy className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
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
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const FilterButton = ({ filter, label, icon: Icon, color }) => (
    <button
      onClick={() => setFilterType(filter)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        filterType === filter
          ? `bg-${color === 'red' ? 'red' : color === 'yellow' ? 'yellow' : color === 'orange' ? 'orange' : 'blue'}-600 text-white shadow-md`
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Moderación de Reportes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Revisa y modera reportes sospechosos o inapropiados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {filters.map(filter => (
            <div key={filter.value} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{filter.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filter.value === 'all' ? pendingReports.length : pendingReports.filter(r => r.status === filter.value).length}
                  </p>
                </div>
                <div className={`p-2 rounded-xl bg-${filter.color === 'red' ? 'red' : filter.color === 'yellow' ? 'yellow' : filter.color === 'orange' ? 'orange' : 'blue'}-100`}>
                  <filter.icon className={`h-5 w-5 text-${filter.color === 'red' ? 'red' : filter.color === 'yellow' ? 'yellow' : filter.color === 'orange' ? 'orange' : 'blue'}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, usuario o folio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            {filteredReports.length} reporte{filteredReports.length !== 1 ? 's' : ''} pendiente{filteredReports.length !== 1 ? 's' : ''} de moderación
          </p>
        </div>

        {/* Lista de reportes */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {paginatedReports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                {/* Header con imagen */}
                <div className="relative">
                  <div className="h-36 bg-gradient-to-r from-gray-100 to-gray-200 relative">
                    {report.image ? (
                      <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                        <p className="text-xs text-gray-400 mt-2">Sin imagen</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {getStatusText(report.status)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(report.priority)}`}>
                      {report.priority === 'high' ? 'Alta prioridad' : report.priority === 'medium' ? 'Media prioridad' : 'Baja prioridad'}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-xs text-gray-500">Folio: #{report.id}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(report.category)}`}>
                      {report.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.municipality}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {report.user}
                    </span>
                  </div>

                  {/* Razón de sospecha */}
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-yellow-800">Razón de sospecha</p>
                        <p className="text-xs text-yellow-700">{report.suspicionReason}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(report)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(report)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleViewDetail(report.id)}
                      className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Todo en orden!</h3>
            <p className="text-gray-500 mb-6">No hay reportes pendientes de moderación en este momento.</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Contenido verificado</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <Shield className="h-4 w-4" />
                <span>Plataforma segura</span>
              </div>
            </div>
          </div>
        )}

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

        {/* Modal de confirmación */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${confirmAction === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {confirmAction === 'approve' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {confirmAction === 'approve' ? 'Aprobar reporte' : 'Rechazar reporte'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas {confirmAction === 'approve' ? 'aprobar' : 'rechazar'} el reporte <strong>#{selectedReport?.id}</strong>?
                {confirmAction === 'reject' && ' Este reporte será marcado como spam.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmActionHandler}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    confirmAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};