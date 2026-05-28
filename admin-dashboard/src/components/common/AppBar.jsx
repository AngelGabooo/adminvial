import { Menu, Bell, User, Search, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export const AppBar = ({ title = "Chiapas", onMenuClick }) => {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: "Nuevo reporte crítico", message: "Bache en zona centro", time: "Hace 5 min", read: false },
    { id: 2, title: "Reporte resuelto", message: "Alumbrado público reparado", time: "Hace 1 hora", read: false },
    { id: 3, title: "Meta alcanzada", message: "100 reportes resueltos esta semana", time: "Hace 3 horas", read: true },
  ];

  return (
    <nav className="glass-effect fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  Dashboard <span className="text-gray-800">Chiapas</span>
                </h1>
                <p className="text-xs text-gray-500">Sistema de Gestión de Reportes</p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar reportes, municipios..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
                    <h3 className="text-white font-semibold">Notificaciones</h3>
                    <p className="text-blue-100 text-xs">Tienes {notifications.filter(n => !n.read).length} notificaciones nuevas</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`h-2 w-2 mt-2 rounded-full ${!notif.read ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 transition-all">
                <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Mi Perfil</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </button>
                  <hr className="my-2" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};