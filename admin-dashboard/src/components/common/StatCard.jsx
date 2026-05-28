import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color, change, subtitle }) => {
  const gradients = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const bgGradients = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'bg-gradient-to-br from-green-50 to-green-100',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    red: 'bg-gradient-to-br from-red-50 to-red-100',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100',
  };

  return (
    <div className={`stat-card ${bgGradients[color]} border border-${color}-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[color]} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="text-xs font-bold">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {/* Efecto decorativo */}
      <div className="absolute -bottom-2 -right-2 opacity-10">
        <Icon className="h-16 w-16" />
      </div>
    </div>
  );
};