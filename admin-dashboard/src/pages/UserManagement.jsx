import { useState, useMemo } from 'react';
import { 
  Search, Filter, X, ChevronLeft, ChevronRight,
  User, Mail, Phone, Calendar, FileText,
  Eye, Ban, CheckCircle, Shield, MoreVertical,
  AlertCircle, Star, Users as UsersIcon,
  Activity, Clock
} from 'lucide-react';

// Datos mock de usuarios
const mockUsers = [
  { 
    id: 1, 
    name: 'Ana García', 
    email: 'ana.garcia@email.com', 
    phone: '+52 961 123 4567',
    avatar: null,
    reportsCount: 24,
    registerDate: '2024-01-15',
    lastActive: '2024-01-20',
    status: 'active',
    role: 'ciudadano'
  },
  { 
    id: 2, 
    name: 'Carlos López', 
    email: 'carlos.lopez@email.com', 
    phone: '+52 961 234 5678',
    avatar: null,
    reportsCount: 12,
    registerDate: '2024-01-10',
    lastActive: '2024-01-19',
    status: 'active',
    role: 'ciudadano'
  },
  { 
    id: 3, 
    name: 'María Martínez', 
    email: 'maria.martinez@email.com', 
    phone: '+52 961 345 6789',
    avatar: null,
    reportsCount: 8,
    registerDate: '2024-01-05',
    lastActive: '2024-01-15',
    status: 'blocked',
    role: 'ciudadano'
  },
  { 
    id: 4, 
    name: 'Juan Rodríguez', 
    email: 'juan.rodriguez@email.com', 
    phone: '+52 961 456 7890',
    avatar: null,
    reportsCount: 31,
    registerDate: '2023-12-20',
    lastActive: '2024-01-18',
    status: 'active',
    role: 'colaborador'
  },
  { 
    id: 5, 
    name: 'Laura Sánchez', 
    email: 'laura.sanchez@email.com', 
    phone: '+52 961 567 8901',
    avatar: null,
    reportsCount: 5,
    registerDate: '2024-01-12',
    lastActive: '2024-01-17',
    status: 'active',
    role: 'ciudadano'
  },
  { 
    id: 6, 
    name: 'Pedro Ramírez', 
    email: 'pedro.ramirez@email.com', 
    phone: '+52 961 678 9012',
    avatar: null,
    reportsCount: 45,
    registerDate: '2023-11-01',
    lastActive: '2024-01-20',
    status: 'active',
    role: 'colaborador'
  },
];

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('reports');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Filtrar usuarios
  const filteredUsers = useMemo(() => {
    let filtered = [...mockUsers];

    // Búsqueda
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
      );
    }

    // Filtro de estado
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(u => u.status === 'active');
      } else if (statusFilter === 'blocked') {
        filtered = filtered.filter(u => u.status === 'blocked');
      } else if (statusFilter === 'most_active') {
        filtered = [...filtered].sort((a, b) => b.reportsCount - a.reportsCount).slice(0, 5);
      }
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case 'reports':
          aVal = a.reportsCount;
          bVal = b.reportsCount;
          break;
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'date':
          aVal = new Date(a.registerDate);
          bVal = new Date(b.registerDate);
          break;
        default:
          aVal = a.reportsCount;
          bVal = b.reportsCount;
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleBlockUser = (user) => {
    setSelectedUser(user);
    setConfirmAction('block');
    setShowConfirmModal(true);
  };

  const handleUnblockUser = (user) => {
    setSelectedUser(user);
    setConfirmAction('unblock');
    setShowConfirmModal(true);
  };

  const handleViewReports = (userId) => {
    console.log('Ver reportes del usuario:', userId);
  };

  const confirmActionHandler = () => {
    console.log(`${confirmAction} usuario:`, selectedUser?.id);
    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-1">+{trend}%</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-md`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );

  const FilterButton = ({ filter, label, icon: Icon }) => (
    <button
      onClick={() => setStatusFilter(filter)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        statusFilter === filter
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 text-sm mt-1">Administra los usuarios registrados en la plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Usuarios" value={mockUsers.length} icon={UsersIcon} color="from-blue-500 to-blue-600" trend={12} />
          <StatCard title="Usuarios Activos" value={mockUsers.filter(u => u.status === 'active').length} icon={CheckCircle} color="from-green-500 to-green-600" />
          <StatCard title="Usuarios Bloqueados" value={mockUsers.filter(u => u.status === 'blocked').length} icon={Ban} color="from-red-500 to-red-600" />
          <StatCard title="Total Reportes" value={mockUsers.reduce((acc, u) => acc + u.reportsCount, 0)} icon={FileText} color="from-purple-500 to-purple-600" />
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <FilterButton filter="all" label="Todos" icon={UsersIcon} />
              <FilterButton filter="active" label="Activos" icon={Activity} />
              <FilterButton filter="blocked" label="Bloqueados" icon={Ban} />
              <FilterButton filter="most_active" label="Más activos" icon={Star} />
            </div>
          </div>
        </div>

        {/* Resultados y ordenamiento */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <p className="text-sm text-gray-500">
            Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="reports">Reportes</option>
              <option value="name">Nombre</option>
              <option value="date">Fecha registro</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="space-y-3 mb-6">
          {paginatedUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex flex-wrap items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {getInitials(user.name)}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>

                {/* Información */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    {user.role === 'colaborador' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Colaborador
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                      {user.status === 'active' ? 'Activo' : 'Bloqueado'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {user.reportsCount} reportes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Registro: {formatDate(user.registerDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Activo: {formatDate(user.lastActive)}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewReports(user.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Ver reportes"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleBlockUser(user)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Bloquear"
                    >
                      <Ban className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblockUser(user)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                      title="Desbloquear"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Modal de confirmación */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${confirmAction === 'block' ? 'bg-red-100' : 'bg-green-100'}`}>
                  {confirmAction === 'block' ? (
                    <Ban className="h-6 w-6 text-red-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {confirmAction === 'block' ? 'Bloquear usuario' : 'Desbloquear usuario'}
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas {confirmAction === 'block' ? 'bloquear' : 'desbloquear'} al usuario <strong>{selectedUser?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmActionHandler}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors ${
                    confirmAction === 'block' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};