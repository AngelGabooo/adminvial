import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, 
  AlertTriangle, Waves, Wind, Thermometer, CloudRain,
  MapPin, Shield, CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(0);

  // Array de imágenes de fondo temáticas de desastres naturales
  const backgrounds = [
    'https://images.unsplash.com/photo-1587923623987-c7e4083beb23?w=1920&q=80', // Inundación
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=1920&q=80', // Huracán
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80', // Tormenta
    'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=1920&q=80', // Inundación urbana
  ];

  useEffect(() => {
    // Cambiar fondo cada 10 segundos
    const interval = setInterval(() => {
      setBackgroundImage((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setLocalError('Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const demoCredentials = [
    { email: 'admin@proteccioncivil.gob.mx', password: 'admin123', role: 'Administrador' },
    { email: 'operador@proteccioncivil.gob.mx', password: 'operador123', role: 'Operador' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video o imagen de fondo con overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${backgrounds[backgroundImage]})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-blue-900/70"></div>
      </div>

      {/* Elementos decorativos flotantes - animación de desastres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float-slow">
          <CloudRain className="h-12 w-12 text-blue-300/20" />
        </div>
        <div className="absolute bottom-32 right-20 animate-float-medium">
          <Waves className="h-16 w-16 text-cyan-300/20" />
        </div>
        <div className="absolute top-40 right-32 animate-float-fast">
          <Wind className="h-10 w-10 text-gray-300/20" />
        </div>
        <div className="absolute bottom-20 left-32 animate-float-slow">
          <AlertTriangle className="h-14 w-14 text-orange-300/15" />
        </div>
        <div className="absolute top-1/2 left-5 animate-pulse-ring">
          <MapPin className="h-8 w-8 text-red-300/20" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Columna izquierda - Información y branding */}
          <div className="hidden lg:flex flex-col justify-center text-white space-y-6">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                {/* Logo de Bachi */}
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <img 
                    src="/img/bachii.png" 
                    alt="Bachi" 
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48?text=Bachi';
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bachi</h2>
                  <p className="text-white/70 text-sm">Sistema de Gestión de Desastres</p>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                Comunidad
                <span className="block text-orange-400">Segura</span>
              </h1>
              
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                Sistema integral para la gestión, seguimiento y atención de 
                emergencias y desastres naturales en el estado de Chiapas.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                  </div>
                  <span className="text-white/80">Reporte de incidentes en tiempo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-white/80">Geolocalización de zonas críticas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-400" />
                  </div>
                  <span className="text-white/80">Seguimiento y resolución de incidentes</span>
                </div>
              </div>

              {/* Estadísticas en vivo */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">24/7</p>
                  <p className="text-xs text-white/60">Monitoreo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">156</p>
                  <p className="text-xs text-white/60">Reportes activos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">98%</p>
                  <p className="text-xs text-white/60">Efectividad</p>
                </div>
              </div>
            </div>

            {/* Alerta de emergencia */}
            <div className="backdrop-blur-sm bg-red-500/20 rounded-xl p-4 border border-red-500/30 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-ping-slow">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Alerta Naranja</p>
                  <p className="text-sm text-white/70">Lluvias intensas en región norte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario de login */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Logo móvil */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                  <img 
                    src="/img/bachi.png" 
                    alt="Bachi" 
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/56?text=Bachi';
                    }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
                <p className="text-white/70 text-sm">Sistema de Gestión de Desastres</p>
              </div>

              <div className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl p-8 border border-white/20">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
                  <p className="text-sm text-gray-500 mt-1">Accede al panel de control de emergencias</p>
                </div>

                {(error || localError) && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-shake">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error || localError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@proteccioncivil.gob.mx"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">Recordarme</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Ingresando...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Acceder al panel
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">Credenciales de prueba</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {demoCredentials.map((cred, idx) => (
                    <button
                      key={idx}
                      onClick={() => fillDemoCredentials(cred.email, cred.password)}
                      className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-left border border-gray-100 hover:border-orange-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600">
                            {cred.role}
                          </p>
                          <p className="text-xs text-gray-500">{cred.email}</p>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">{cred.password}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">
                    Sistema de Gestión de Desastres Naturales - Protección Civil Chiapas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos personalizados para animaciones */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(15px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};