import { GoogleMap, Marker, HeatmapLayer, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 16.75,
  lng: -93.12
};

const mapOptions = {
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

export const MapView = ({ 
  reports, 
  center = defaultCenter, 
  zoom = 10,
  onMarkerClick,
  showHeatmap = false,
  selectedReport = null,
  onInfoWindowClose 
}) => {
  const [map, setMap] = useState(null);

  const getMarkerIcon = (status) => {
    const icons = {
      pendiente: {
        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      },
      en_proceso: {
        url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      },
      resuelto: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    };
    return icons[status] || icons.pendiente;
  };

  const heatmapData = reports.map(report => ({
    location: new google.maps.LatLng(report.lat, report.lng),
    weight: report.status === 'pendiente' ? 1 : (report.status === 'en_proceso' ? 0.7 : 0.3)
  }));

  const clusterReports = (reports) => {
    const clusters = {};
    const zoomLevel = map?.getZoom() || 10;
    const threshold = zoomLevel > 12 ? 0.01 : 0.05;

    reports.forEach(report => {
      const latKey = Math.round(report.lat / threshold);
      const lngKey = Math.round(report.lng / threshold);
      const key = `${latKey},${lngKey}`;
      
      if (!clusters[key]) {
        clusters[key] = {
          count: 0,
          reports: [],
          lat: report.lat,
          lng: report.lng
        };
      }
      clusters[key].count++;
      clusters[key].reports.push(report);
    });

    return Object.values(clusters);
  };

  const clusters = clusterReports(reports);
  const shouldCluster = map && map.getZoom() < 12;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={mapOptions}
      onLoad={setMap}
    >
      {showHeatmap && heatmapData.length > 0 && (
        <HeatmapLayer
          data={heatmapData}
          options={{
            radius: 20,
            opacity: 0.6,
            dissipating: true,
            gradient: [
              'rgba(0, 255, 255, 0)',
              'rgba(0, 255, 255, 1)',
              'rgba(0, 191, 255, 1)',
              'rgba(0, 127, 255, 1)',
              'rgba(0, 63, 255, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(0, 0, 223, 1)',
              'rgba(0, 0, 191, 1)',
              'rgba(0, 0, 159, 1)',
              'rgba(0, 0, 127, 1)',
              'rgba(63, 0, 91, 1)',
              'rgba(127, 0, 63, 1)',
              'rgba(191, 0, 31, 1)',
              'rgba(255, 0, 0, 1)'
            ]
          }}
        />
      )}

      {!showHeatmap && (shouldCluster ? clusters : reports).map((item, index) => {
        if (item.count && shouldCluster) {
          // Mostrar cluster
          return (
            <Marker
              key={`cluster-${index}`}
              position={{ lat: item.lat, lng: item.lng }}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(50, 50),
                labelOrigin: new google.maps.Point(25, 15)
              }}
              label={{
                text: item.count.toString(),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
              onClick={() => {
                // Hacer zoom al cluster
                map?.setCenter({ lat: item.lat, lng: item.lng });
                map?.setZoom((map.getZoom() || 10) + 2);
              }}
            />
          );
        } else {
          // Mostrar marcador individual
          const report = item.count ? item.reports[0] : item;
          return (
            <Marker
              key={report.id}
              position={{ lat: report.lat, lng: report.lng }}
              icon={getMarkerIcon(report.status)}
              onClick={() => onMarkerClick(report)}
            />
          );
        }
      })}

      {selectedReport && (
        <InfoWindow
          position={{ lat: selectedReport.lat, lng: selectedReport.lng }}
          onCloseClick={onInfoWindowClose}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-gray-900 mb-1">{selectedReport.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedReport.description}</p>
            <div className="flex justify-between items-center text-xs">
              <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedReport.status)}`}>
                {selectedReport.status}
              </span>
              <button 
                onClick={() => onMarkerClick(selectedReport)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver detalles →
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const getStatusColor = (status) => {
  const colors = {
    pendiente: "bg-yellow-100 text-yellow-800",
    en_proceso: "bg-blue-100 text-blue-800",
    resuelto: "bg-green-100 text-green-800"
  };
  return colors[status] || colors.pendiente;
};