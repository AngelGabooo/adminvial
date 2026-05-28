import { X } from 'lucide-react';
import { municipalities, categories } from '../../utils/mockData';

export const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      status: '',
      municipality: '',
      date: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="bg-white rounded-lg shadow-lg p-3">
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_proceso">En proceso</option>
          <option value="resuelto">Resueltos</option>
        </select>

        <select
          value={filters.municipality}
          onChange={(e) => handleChange('municipality', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los municipios</option>
          {municipalities.map(mun => (
            <option key={mun} value={mun}>{mun}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
};