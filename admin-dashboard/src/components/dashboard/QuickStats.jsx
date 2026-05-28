import { TrendingUp, Calendar, Zap } from 'lucide-react';

export const QuickStats = ({ avgTime, weeklyReports }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Rápidas</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Tiempo promedio</p>
              <p className="text-lg font-bold text-gray-900">{avgTime} días</p>
            </div>
          </div>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            -2.3%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Reportes esta semana</p>
              <p className="text-lg font-bold text-gray-900">{weeklyReports}</p>
            </div>
          </div>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            +18%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Eficiencia</p>
              <p className="text-lg font-bold text-gray-900">87%</p>
            </div>
          </div>
          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            +5%
          </span>
        </div>
      </div>
    </div>
  );
};