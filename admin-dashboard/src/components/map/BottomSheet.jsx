import { X, Clock, MapPin, Tag, ChevronUp } from 'lucide-react';
import { getStatusColor, getCategoryColor } from '../../utils/mockData';

export const BottomSheet = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 transform transition-transform duration-300">
      <div className="bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChevronUp className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Detalles del Reporte</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h4>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                {report.status === 'en_proceso' ? 'En proceso' : report.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(report.category)}`}>
                {report.category}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Ubicación</p>
                <p className="text-sm text-gray-600">{report.municipality}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Fecha de reporte</p>
                <p className="text-sm text-gray-600">
                  {new Date(report.createdAt).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Descripción</p>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Ver detalle completo
          </button>
        </div>
      </div>
    </div>
  );
};