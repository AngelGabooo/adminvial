import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Activity
} from 'lucide-react';

export const SummaryCards = ({ stats, changes }) => {
  const cards = [
    {
      title: 'Total Reportes',
      value: stats.total,
      icon: FileText,
      color: 'blue',
      change: changes?.total || 12,
      trend: 'up'
    },
    {
      title: 'Pendientes',
      value: stats.pendientes,
      icon: AlertTriangle,
      color: 'yellow',
      change: changes?.pendientes || -5,
      trend: 'down'
    },
    {
      title: 'En Proceso',
      value: stats.enProceso,
      icon: Activity,
      color: 'purple',
      change: changes?.enProceso || 8,
      trend: 'up'
    },
    {
      title: 'Resueltos',
      value: stats.resueltos,
      icon: CheckCircle,
      color: 'green',
      change: changes?.resueltos || 15,
      trend: 'up'
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-500',
      text: 'text-blue-600'
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'bg-yellow-500',
      text: 'text-yellow-600'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-500',
      text: 'text-purple-600'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-500',
      text: 'text-green-600'
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              <div className="flex items-center mt-2">
                {card.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs font-medium ${card.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change > 0 ? '+' : ''}{card.change}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs semana anterior</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[card.color].icon}`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};