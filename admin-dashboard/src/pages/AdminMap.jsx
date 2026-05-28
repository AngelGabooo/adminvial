import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { 
  Filter, 
  Map as MapIcon, 
  Layers, 
  X,
  MapPin,
  Clock,
  Tag,
  AlertTriangle,
  Calendar,
  User,
  Image as ImageIcon,
  Share2,
  ChevronRight
} from 'lucide-react';
import { reports, getStatusColor, getCategoryColor } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';

// Corregir los íconos de Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Componente para controlar el mapa
function MapController({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const AdminMap = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState([16.75, -93.12]);
  const [mapZoom, setMapZoom] = useState(10);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    municipality: '',
    date: ''
  });

  const municipalities = [...new Set(reports.map(r => r.municipality))];
  const categories = [...new Set(reports.map(r => r.category))];

  const filteredReports = reports.filter(report => {
    if (filters.category && report.category !== filters.category) return false;
    if (filters.status && report.status !== filters.status) return false;
    if (filters.municipality && report.municipality !== filters.municipality) return false;
    return true;
  });

  const getMarkerColor = (status) => {
    const colors = {
      pendiente: '#ef4444',
      en_proceso: '#f59e0b',
      resuelto: '#10b981'
    };
    return colors[status] || colors.pendiente;
  };

  const getMarkerIcon = (status) => {
    return new divIcon({
      html: `<div style="
        background-color: ${getMarkerColor(status)};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s;
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      status: '',
      municipality: '',
      date: ''
    });
  };

  const centerMap = () => {
    setMapCenter([16.75, -93.12]);
    setMapZoom(10);
  };

  const closePanel = () => {
    setSelectedReport(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="mt-16 flex-1 relative">
        {/* Mapa */}
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} zoom={mapZoom} />
          
          {/* Marcadores */}
          {filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={getMarkerIcon(report.status)}
              eventHandlers={{
                click: () => {
                  setSelectedReport(report);
                }
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{report.description.substring(0, 80)}...</p>
                  <button 
                    onClick={() => setSelectedReport(report)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Ver detalles →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Panel Flotante de Detalles - Esquina Izquierda */}
        {selectedReport && (
          <div className="absolute top-20 left-4 z-10 w-96 animate-slideInLeft">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header del panel */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white" />
                  <h3 className="text-white font-semibold text-sm">Detalles del Reporte</h3>
                </div>
                <button 
                  onClick={closePanel}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Contenido del panel */}
              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {/* Título y estado */}
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{selectedReport.title}</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedReport.status)}`}>
                      {selectedReport.status === 'en_proceso' ? 'En proceso' : selectedReport.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedReport.category)}`}>
                      {selectedReport.category}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedReport.description}</p>
                </div>

                {/* Información detallada */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Ubicación</p>
                      <p className="text-sm text-gray-900">{selectedReport.municipality}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Fecha de reporte</p>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedReport.createdAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Reportado por</p>
                      <p className="text-sm text-gray-900">Ciudadano</p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm">
                    Ver detalle completo
                  </button>
                  <button className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        {showFilters && (
          <div className="absolute top-4 right-4 z-10 animate-slideDown w-96">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Filtros avanzados</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-3">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="resuelto">Resueltos</option>
                </select>
                <select
                  value={filters.municipality}
                  onChange={(e) => setFilters({...filters, municipality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos los municipios</option>
                  {municipalities.map(mun => <option key={mun} value={mun}>{mun}</option>)}
                </select>
              </div>
              {(filters.category || filters.status || filters.municipality) && (
                <button onClick={clearFilters} className="mt-3 text-sm text-red-600 hover:text-red-700">
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Floating Action Buttons */}
        <div className="absolute bottom-6 right-6 z-10 flex flex-col space-y-3">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`rounded-full p-3 shadow-lg transition-all duration-300 ${
              showHeatmap 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:shadow-xl'
            }`}
            title={showHeatmap ? 'Ocultar mapa de calor' : 'Mostrar mapa de calor'}
          >
            <MapIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700"
            title="Filtros avanzados"
          >
            <Filter className="h-6 w-6" />
          </button>
          <button
            onClick={centerMap}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700"
            title="Centrar mapa"
          >
            <Layers className="h-6 w-6" />
          </button>
        </div>

        {/* Report Counter */}
        <div className="absolute bottom-6 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {filteredReports.length} reportes activos
            </span>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};