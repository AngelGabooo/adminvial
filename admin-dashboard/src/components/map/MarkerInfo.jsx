import { 
  X, 
  MapPin, 
  Clock, 
  Tag, 
  Calendar, 
  User, 
  Image as ImageIcon,
  Share2,
  Download,
  Flag
} from 'lucide-react';
import { getStatusColor, getCategoryColor } from '../../utils/mockData';

export const MarkerInfo = ({ report, onClose, onViewDetails }) => {
  if (!report) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${Math.floor(diffHours / 24)} días`;
  };

  return (
    <div className="absolute top-4 right-4 z-10 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-slideIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-white" />
          <h3 className="text-white font-semibold">Detalles del Reporte</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        {/* Título y estado */}
        <div className="mb-4">
          <h4 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h4>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
              {report.status === 'en_proceso' ? 'En proceso' : report.status}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(report.category)}`}>
              {report.category}
            </span>
            {report.priority && (
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                Alta prioridad
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">{report.description}</p>
        </div>

        {/* Información detallada */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Ubicación</p>
              <p className="text-sm text-gray-900">{report.municipality}</p>
              <p className="text-xs text-gray-500 mt-1">
                Lat: {report.lat.toFixed(6)} | Lng: {report.lng.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Fecha de reporte</p>
              <p className="text-sm text-gray-900">{formatDate(report.createdAt)}</p>
              <p className="text-xs text-gray-500">{getTimeAgo(report.createdAt)}</p>
            </div>
          </div>

          {report.resolvedAt && (
            <div className="flex items-start space-x-3">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Fecha de resolución</p>
                <p className="text-sm text-gray-900">{formatDate(report.resolvedAt)}</p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <User className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Reportado por</p>
              <p className="text-sm text-gray-900">{report.userName || 'Ciudadano'}</p>
              <p className="text-xs text-gray-500">ID: {report.userId || 'Anonymous'}</p>
            </div>
          </div>
        </div>

        {/* Imagen si existe */}
        {report.image && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Evidencia</p>
            <div className="relative group">
              <img 
                src={report.image} 
                alt="Evidencia" 
                className="rounded-lg w-full h-48 object-cover cursor-pointer"
                onClick={() => window.open(report.image, '_blank')}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onViewDetails(report)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Ver detalle completo
          </button>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
            <Flag className="h-4 w-4" />
            Reportar
          </button>
        </div>
      </div>
    </div>
  );
};