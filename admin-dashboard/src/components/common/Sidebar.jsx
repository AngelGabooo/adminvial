import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Settings, 
  Users, 
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  TrendingUp,
  PieChart,
  Shield,
  Download,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/mapa', icon: Map, label: 'Mapa' },
    { path: '/heatmap', icon: TrendingUp, label: 'Mapa de Calor' },
    { path: '/estadisticas', icon: PieChart, label: 'Estadísticas' },
    { path: '/reportes', icon: FileText, label: 'Reportes', badge: 12 },
    { path: '/usuarios', icon: Users, label: 'Usuarios' },
    { path: '/moderacion', icon: Shield, label: 'Moderación', badge: 4 },
    { path: '/exportar', icon: Download, label: 'Exportar Datos' },
    { path: '/perfil', icon: User, label: 'Mi Perfil' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 z-40 h-full bg-white shadow-xl transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="h-16"></div>
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center justify-between px-3 py-2 rounded-lg transition-all
                  ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-400">Versión 1.0.0</p>
              <p className="text-xs text-gray-400">© 2024 Chiapas</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};