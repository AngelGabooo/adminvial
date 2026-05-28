import { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, CheckCircle,
  FileText, TrendingUp, Settings, Bell, Lock,
  LogOut, Edit2, Camera, Shield, Award, Clock
} from 'lucide-react';
import { reports } from '../utils/mockData';

export const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Mtro. Carlos Hernández',
    role: 'Director de Obras Públicas',
    department: 'Dirección de Obras Públicas',
    municipality: 'Tuxtla Gutiérrez',
    email: 'carlos.hernandez@tuxtla.gob.mx',
    phone: '+52 961 123 4567',
    joinDate: '2023-01-15',
    avatar: null
  });

  // Estadísticas personales
  const personalStats = {
    managedReports: reports.length,
    resolvedThisMonth: reports.filter(r => 
      r.status === 'resuelto' && 
      new Date(r.resolvedAt || r.createdAt).getMonth() === new Date().getMonth()
    ).length,
    avgResponseTime: '2.5 días',
    satisfactionRate: '94%'
  };

  const menuOptions = [
    { icon: User, label: 'Mi Cuenta', description: 'Información personal y contacto' },
    { icon: Lock, label: 'Cambiar contraseña', description: 'Actualiza tu contraseña de acceso' },
    { icon: Bell, label: 'Notificaciones administrativas', description: 'Configura tus alertas' },
    { icon: Settings, label: 'Configuración del panel', description: 'Preferencias del dashboard' },
    { icon: LogOut, label: 'Cerrar sesión', description: 'Salir de la plataforma', danger: true },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );

  const MenuItem = ({ icon: Icon, label, description, danger, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
        danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`p-2 rounded-xl ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
        <Icon className={`h-5 w-5 ${danger ? 'text-red-600' : 'text-blue-600'}`} />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {!danger && <ChevronRight className="h-4 w-4 text-gray-400" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Perfil de Administrador
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tu información y preferencias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Perfil */}
          <div className="space-y-6">
            {/* Foto de perfil y datos básicos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-4">{profileData.name}</h2>
              <p className="text-sm text-blue-600 font-medium mt-1">{profileData.role}</p>
              <p className="text-xs text-gray-500 mt-1">{profileData.department}</p>
              <p className="text-xs text-gray-400 mt-2">{profileData.municipality}</p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar perfil
                </button>
              </div>
            </div>

            {/* Estadísticas personales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Estadísticas personales</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reportes gestionados</span>
                  <span className="font-semibold text-gray-900">{personalStats.managedReports}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resueltos este mes</span>
                  <span className="font-semibold text-green-600">{personalStats.resolvedThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo promedio respuesta</span>
                  <span className="font-semibold text-gray-900">{personalStats.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tasa de satisfacción</span>
                  <span className="font-semibold text-blue-600">{personalStats.satisfactionRate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Información detallada y menú */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de contacto */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Información de contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Correo electrónico</p>
                    <p className="text-sm text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm text-gray-900">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Municipio</p>
                    <p className="text-sm text-gray-900">{profileData.municipality}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Miembro desde</p>
                    <p className="text-sm text-gray-900">{formatDate(profileData.joinDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Reportes gestionados" value={personalStats.managedReports} icon={FileText} color="bg-blue-500" />
              <StatCard title="Resueltos este mes" value={personalStats.resolvedThisMonth} icon={CheckCircle} color="bg-green-500" />
              <StatCard title="Tasa de resolución" value={personalStats.satisfactionRate} icon={Award} color="bg-purple-500" />
            </div>

            {/* Menú de opciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <h3 className="font-semibold text-gray-900 p-5 pb-0">Opciones del panel</h3>
              <div className="divide-y divide-gray-100">
                {menuOptions.map((option, idx) => (
                  <MenuItem
                    key={idx}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                    danger={option.danger}
                    onClick={() => {
                      if (option.danger) {
                        console.log('Cerrar sesión');
                      } else {
                        console.log(`Navegar a ${option.label}`);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Badges de logros */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6" />
                <h3 className="font-semibold">Administrador Verificado</h3>
              </div>
              <p className="text-sm opacity-90 mb-3">
                Tienes acceso completo al panel de administración y herramientas de moderación.
              </p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs">2FA Activado</span>
                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs">Certificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para ChevronRight
const ChevronRight = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);