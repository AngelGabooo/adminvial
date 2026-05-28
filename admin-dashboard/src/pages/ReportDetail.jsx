import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, User, Tag, Clock, ArrowLeft,
  Edit, Map, Mail, Download, CheckCircle, XCircle,
  Clock as ClockIcon, AlertCircle, MessageSquare,
  FileText, Image as ImageIcon, Share2, Flag
} from 'lucide-react';
import { reports, getStatusColor, getCategoryColor } from '../utils/mockData';

export const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = reports.find(r => r.id === parseInt(id));
  
  const [currentStatus, setCurrentStatus] = useState(report?.status || 'pendiente');
  const [showHistory, setShowHistory] = useState(true);
  const [comment, setComment] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900">Reporte no encontrado</h2>
          <p className="text-gray-500 mt-1">El reporte que buscas no existe</p>
          <button
            onClick={() => navigate('/reportes')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const getStatusText = (status) => {
    const texts = { pendiente: 'Pendiente', en_proceso: 'En proceso', resuelto: 'Resuelto' };
    return texts[status] || status;
  };

  const getNextStatus = () => {
    const order = ['pendiente', 'en_proceso', 'resuelto'];
    const currentIndex = order.indexOf(currentStatus);
    if (currentIndex < order.length - 1) {
      return order[currentIndex + 1];
    }
    return null;
  };

  const getPreviousStatus = () => {
    const order = ['pendiente', 'en_proceso', 'resuelto'];
    const currentIndex = order.indexOf(currentStatus);
    if (currentIndex > 0) {
      return order[currentIndex - 1];
    }
    return null;
  };

  const handleStatusChange = (newStatus) => {
    setPendingStatus(newStatus);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = () => {
    setCurrentStatus(pendingStatus);
    setShowConfirmModal(false);
    setPendingStatus(null);
    // Aquí iría la llamada a la API
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Historial de actualizaciones
  const history = [
    { id: 1, action: 'Reporte creado', user: 'Ciudadano', date: report.createdAt, status: 'pendiente', comment: 'Reporte inicial ciudadano' },
    { id: 2, action: 'Estado cambiado a En proceso', user: 'Administrador', date: new Date(new Date(report.createdAt).getTime() + 86400000).toISOString(), status: 'en_proceso', comment: 'Asignado a equipo de atención' },
  ];

  if (currentStatus === 'en_proceso' && history.length === 2) {
    history.push({
      id: 3,
      action: 'Estado cambiado a Resuelto',
      user: 'Administrador',
      date: new Date().toISOString(),
      status: 'resuelto',
      comment: 'Reporte resuelto y cerrado'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/reportes')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detalle del Reporte
            </h1>
            <p className="text-gray-500 text-sm mt-1">Folio #{report.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {report.image ? (
                <img src={report.image} alt={report.title} className="w-full h-80 object-cover" />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400 mb-3" />
                  <p className="text-gray-500">Sin imagen disponible</p>
                </div>
              )}
            </div>

            {/* Información del reporte */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{report.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Categoría</p>
                    <p className={`inline-block px-2 py-1 text-sm rounded-lg mt-1 ${getCategoryColor(report.category)}`}>
                      {report.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Fecha de reporte</p>
                    <p className="text-sm text-gray-900">{formatDate(report.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Ubicación</p>
                    <p className="text-sm text-gray-900">{report.municipality}</p>
                    <p className="text-xs text-gray-400 mt-1">Lat: {report.lat} | Lng: {report.lng}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Reportado por</p>
                    <p className="text-sm text-gray-900">Ciudadano</p>
                    <p className="text-xs text-gray-400">ID: Anonymous</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Descripción</p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                  {report.description}
                </p>
              </div>
            </div>

            {/* Historial de actualizaciones */}
            {showHistory && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de actualizaciones</h3>
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {history.map((item, idx) => (
                      <div key={item.id} className="relative flex gap-4">
                        <div className="relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'resuelto' ? 'bg-green-100' :
                            item.status === 'en_proceso' ? 'bg-blue-100' : 'bg-yellow-100'
                          }`}>
                            {item.status === 'resuelto' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : item.status === 'en_proceso' ? (
                              <ClockIcon className="h-4 w-4 text-blue-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <p className="font-medium text-gray-900">{item.action}</p>
                            <p className="text-xs text-gray-400">{formatDate(item.date)}</p>
                          </div>
                          <p className="text-sm text-gray-600">Por: {item.user}</p>
                          {item.comment && (
                            <p className="text-xs text-gray-500 mt-1 italic">"{item.comment}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Barra lateral */}
          <div className="space-y-6">
            {/* Estado actual */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Estado actual</h3>
              <div className={`p-4 rounded-xl text-center mb-4 ${getStatusColor(currentStatus)}`}>
                <span className="font-semibold text-lg">{getStatusText(currentStatus)}</span>
              </div>
              
              <div className="flex gap-2">
                {getPreviousStatus() && (
                  <button
                    onClick={() => handleStatusChange(getPreviousStatus())}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    Retroceder
                  </button>
                )}
                {getNextStatus() && (
                  <button
                    onClick={() => handleStatusChange(getNextStatus())}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Avanzar a {getStatusText(getNextStatus())}
                  </button>
                )}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Acciones rápidas</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  <Map className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Ver en mapa</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Contactar al reportador</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Exportar reporte (PDF)</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  <Share2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Compartir reporte</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Flag className="h-4 w-4" />
                  <span className="text-sm">Reportar problema</span>
                </button>
              </div>
            </div>

            {/* Agregar comentario */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Agregar comentario</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe un comentario interno sobre este reporte..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows="3"
              />
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all">
                <MessageSquare className="h-4 w-4" />
                Enviar comentario
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar cambio de estado</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas cambiar el estado a <strong>{getStatusText(pendingStatus)}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};