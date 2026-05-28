import { Clock, MapPin, Tag } from 'lucide-react';
import { getStatusColor, getCategoryColor } from '../../utils/mockData';

export const RecentReportsList = ({ reports }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reportes Recientes</h3>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                  {report.status === 'en_proceso' ? 'En proceso' : report.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  {report.municipality}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(report.category)}`}>
                  {report.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        Ver todos los reportes →
      </button>
    </div>
  );
};