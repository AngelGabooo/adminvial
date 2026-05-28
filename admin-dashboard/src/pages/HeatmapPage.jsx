import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Map as MapIcon, 
  Layers, 
  X,
  TrendingUp,
  Info,
  Calendar,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { reports, getStatusColor } from '../utils/mockData';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// ─── Componente interno que accede al mapa y dibuja el heatmap en canvas ───
function CanvasHeatmap({ points, visible, intensity }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!visible || points.length === 0) return;

    const HeatLayer = L.Layer.extend({
      onAdd(map) {
        this._map = map;

        const pane = map.getPanes().overlayPane;
        this._canvas = document.createElement('canvas');
        this._canvas.style.cssText = `
          position: absolute;
          top: 0; left: 0;
          pointer-events: none;
          opacity: 0.75;
          z-index: 400;
        `;
        pane.appendChild(this._canvas);

        this._draw = this._draw.bind(this);
        map.on('moveend zoomend viewreset move zoom', this._draw);
        this._draw();
      },

      onRemove(map) {
        map.off('moveend zoomend viewreset move zoom', this._draw);
        if (this._canvas && this._canvas.parentNode) {
          this._canvas.parentNode.removeChild(this._canvas);
        }
      },

      _draw() {
        const map = this._map;
        if (!map || !this._canvas) return;

        const mapPane = map.getPanes().mapPane;
        const mapPanePos = L.DomUtil.getPosition(mapPane);
        const size = map.getSize();

        this._canvas.width = size.x;
        this._canvas.height = size.y;

        this._canvas.style.left = (-mapPanePos.x) + 'px';
        this._canvas.style.top  = (-mapPanePos.y) + 'px';

        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        const zoom = map.getZoom();
        const radius = Math.max(15, (50 / Math.pow(2, Math.max(0, 12 - zoom)))) * intensity;

        points.forEach(({ lat, lng, weight }) => {
          const containerPoint = map.latLngToContainerPoint(L.latLng(lat, lng));

          const x = containerPoint.x;
          const y = containerPoint.y;

          if (x < -radius || x > size.x + radius || y < -radius || y > size.y + radius) return;

          const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
          const w = Math.min(1, Math.max(0.1, weight));
          grad.addColorStop(0,    `rgba(240, 59,  32,  ${0.9 * w})`);
          grad.addColorStop(0.25, `rgba(253, 141, 60,  ${0.75 * w})`);
          grad.addColorStop(0.5,  `rgba(254, 178, 76,  ${0.55 * w})`);
          grad.addColorStop(0.75, `rgba(255, 237, 160, ${0.3 * w})`);
          grad.addColorStop(1,    `rgba(255, 255, 178, 0)`);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        });
      }
    });

    layerRef.current = new HeatLayer();
    map.addLayer(layerRef.current);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, points, visible, intensity]);

  return null;
}

// ─── Componente de control de centro ───
function MapCenterController({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger > 0) map.setView([16.75, -93.12], 10);
  }, [trigger, map]);
  return null;
}

// ─── Página principal ───
export const HeatmapPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [heatmapIntensity, setHeatmapIntensity] = useState(1);
  const [showLegend, setShowLegend] = useState(true);
  const [centerTrigger, setCenterTrigger] = useState(0);

  const categories = ['all', ...new Set(reports.map(r => r.category))];
  const periods = [
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Último mes' },
    { value: 'all', label: 'Todos' }
  ];

  const getFilteredByPeriod = (list) => {
    if (selectedPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return list.filter(r => new Date(r.createdAt) >= weekAgo);
    }
    if (selectedPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return list.filter(r => new Date(r.createdAt) >= monthAgo);
    }
    return list;
  };

  const filteredReports = getFilteredByPeriod(
    selectedCategory === 'all'
      ? reports
      : reports.filter(r => r.category === selectedCategory)
  );

  // Convertir reportes a puntos con peso
  const heatPoints = filteredReports.map(r => ({
    lat: r.lat,
    lng: r.lng,
    weight: r.status === 'pendiente' ? 1 : r.status === 'en_proceso' ? 0.7 : 0.4,
  }));

  const getMarkerIcon = (status) => {
    const colors = { pendiente: '#ef4444', en_proceso: '#f59e0b', resuelto: '#10b981' };
    return L.divIcon({
      html: `<div style="
        background-color: ${colors[status] || colors.pendiente};
        width: 20px; height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const getCriticalZones = () => {
    const zones = [
      { name: 'Centro Histórico', count: filteredReports.filter(r => r.municipality === 'Tuxtla Gutiérrez').length },
      { name: 'Zona Norte', count: filteredReports.filter(r => r.municipality === 'San Cristóbal').length },
      { name: 'Periférico Sur', count: filteredReports.filter(r => r.municipality === 'Comitán').length },
    ];
    return zones.sort((a, b) => b.count - a.count).slice(0, 3);
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="mt-16 flex-1 relative">
        <MapContainer
          center={[16.75, -93.12]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Heatmap canvas */}
          <CanvasHeatmap
            points={heatPoints}
            visible={showHeatmap}
            intensity={heatmapIntensity}
          />

          {/* Centrar mapa */}
          <MapCenterController trigger={centerTrigger} />

          {/* Marcadores */}
          {showMarkers && filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.lat, report.lng]}
              icon={getMarkerIcon(report.status)}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{report.description?.substring(0, 80)}...</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                      {report.status === 'en_proceso' ? 'En proceso' : report.status}
                    </span>
                    <span className="text-xs text-gray-500">{report.municipality}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Panel de controles superior */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Mapa de Calor - Zonas Críticas</h2>
                  <p className="text-xs text-gray-500">
                    {filteredReports.length} reportes · concentración de incidentes
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Selector de período */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {periods.map(p => (
                    <button
                      key={p.value}
                      onClick={() => setSelectedPeriod(p.value)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedPeriod === p.value
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Selector de categoría */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Todas las categorías' : cat}
                    </option>
                  ))}
                </select>

                {/* Toggle heatmap */}
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    showHeatmap
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showHeatmap ? 'Ocultar calor' : 'Mostrar calor'}
                </button>

                {/* Toggle marcadores */}
                <button
                  onClick={() => setShowMarkers(!showMarkers)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    showMarkers
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  {showMarkers ? 'Ocultar puntos' : 'Mostrar puntos'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leyenda del mapa de calor */}
        {showLegend && (
          <div className="absolute bottom-6 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-gray-200 w-64">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Intensidad de Calor</h3>
              <button onClick={() => setShowLegend(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { color: '#f03b20', label: 'Muy Alta', range: '> 80%' },
                { color: '#fd8d3c', label: 'Alta', range: '60-80%' },
                { color: '#feb24c', label: 'Media', range: '40-60%' },
                { color: '#fed976', label: 'Baja', range: '20-40%' },
                { color: '#ffffb2', label: 'Muy Baja', range: '< 20%' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.range}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Total reportes</span>
                <span className="font-semibold text-gray-900">{filteredReports.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">Zonas críticas</span>
                <span className="font-semibold text-red-600">{getCriticalZones().length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botón para mostrar leyenda */}
        {!showLegend && (
          <button
            onClick={() => setShowLegend(true)}
            className="absolute bottom-6 left-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Info className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Zonas críticas flotantes */}
        <div className="absolute top-24 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 min-w-[180px]">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">📍 Zonas críticas</h4>
          <div className="space-y-1">
            {getCriticalZones().map((zone, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-600">{zone.name}</span>
                <span className="font-medium text-red-600">{zone.count} rep.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botones flotantes */}
        <div className="absolute bottom-6 right-6 z-10 flex flex-col space-y-3">
          <button
            onClick={() => setHeatmapIntensity(v => Math.min(v + 0.2, 2))}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all text-gray-700"
            title="Aumentar intensidad"
          >
            <TrendingUp className="h-5 w-5" />
          </button>
          <button
            onClick={() => setHeatmapIntensity(v => Math.max(v - 0.2, 0.3))}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all text-gray-700"
            title="Disminuir intensidad"
          >
            <TrendingUp className="h-5 w-5 rotate-180" />
          </button>
          <button
            onClick={() => setCenterTrigger(t => t + 1)}
            className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all text-gray-700"
            title="Centrar mapa"
          >
            <Layers className="h-5 w-5" />
          </button>
        </div>

        {/* Indicador de intensidad */}
        <div className="absolute top-24 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg border border-gray-200">
          <span className="text-xs text-gray-600">
            Intensidad: {Math.round(heatmapIntensity * 100)}%
          </span>
        </div>
      </main>
    </div>
  );
};