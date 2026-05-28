import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, LogIn, 
  AlertTriangle, Waves, Wind, CloudRain,
  MapPin, Shield, CheckCircle,
  AlertCircle, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Array de imágenes de fondo - SOLO desastres naturales (sin teclado)
  const backgrounds = [
    'https://www.elfinanciero.com.mx/resizer/v2/N6DRKY66YVAFFILWQF3Q2LNQCQ.png?smart=true&auth=e95207fe168565e2580bd258c94f05c1822a7e3fbbd4a39d0e70d04c4e8bfaed&width=1440&height=810',     // Inundación urbana
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxE1JJnFQ3NIwdUtVtxTJx2psGbS2m4hgJ6A&s',     // Huracán desde el aire
    'https://suramericana.com/content/uploads/2020/11/Seguros-SURA-Habitat-Geociencias-Imagen-Facebook-descargas-electricas-atmosfericas.png',   // Tormenta eléctrica
    'https://wradio.com.mx/resizer/v2/7UJG7RSRUJAILK3W6CUKFRIN5Q.jpeg?auth=8412b1082d34e128a73543c27be81d1e403524c7087b761c5a165178543184a3&width=768&height=576&quality=70&smart=true',   // Inundación en calle
    'hhttps://upload.wikimedia.org/wikipedia/commons/b/b8/Deerfire.jpg',   // Incendio forestal
    'https://www.latercera.com/resizer/v2/ZWEKZH3O65EPBM3ACSELL6ZZGQ.jpg?auth=7b145fa93da624cbf021959be73db0d6a4785816c462e62955d998ff061a2891&width=990&smart=true',   // Deslizamiento de tierra
    'https://www.fundacionaquae.org/wp-content/uploads/2020/08/qu-es-y-cmo-se-forma-un-tornado1-1024x597.jpg',   // Tornado
    'https://www.unicef.es/sites/unicef.es/files/communication/UNI772733-Myanmar.jpg',   // Terremoto
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundImage((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

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
    { email: 'admin@bachi.com', password: 'admin123', role: 'Administrador' },
    { email: 'operador@bachi.com', password: 'operador123', role: 'Operador' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData({ email, password });
    if (window.innerWidth < 1024) {
      setShowMobileMenu(false);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1587923623987-c7e4083beb23?w=1920&q=80';

  // Info para móvil (versión colapsable)
  const MobileInfoPanel = () => (
    <div className="lg:hidden fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-blue-900 overflow-y-auto">
      <div className="relative min-h-screen p-6">
        <button
          onClick={() => setShowMobileMenu(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="flex flex-col items-center text-center pt-12">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
            <img 
              src="/img/bachii.png" 
              alt="Bachi" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.target.src = 'https://placehold.co/80x80/3b82f6/white?text=B';
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-white">Bachi</h2>
          <p className="text-white/70 text-sm mt-1">Sistema de Gestión de Desastres</p>
          
          <div className="mt-8 w-full text-left">
            <h3 className="text-xl font-bold text-white mb-4">Comunidad Segura</h3>
            <p className="text-white/80 mb-6">
              Sistema integral para la gestión, seguimiento y atención de emergencias y desastres naturales.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                </div>
                <span className="text-white/80 text-sm">Reporte de incidentes en tiempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-white/80 text-sm">Geolocalización de zonas críticas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-white/80 text-sm">Seguimiento y resolución de incidentes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${imageErrors[backgroundImage] ? fallbackImage : backgrounds[backgroundImage]})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-blue-900/70"></div>
        <img 
          src={backgrounds[backgroundImage]} 
          alt="Desastre natural"
          className="hidden"
          onError={() => handleImageError(backgroundImage)}
        />
      </div>

      {/* Elementos decorativos flotantes - solo visibles en desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
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
        <div className="max-w-6xl w-full">
          {/* Botón menú móvil */}
          <div className="lg:hidden absolute top-4 left-4">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-xl text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Panel móvil */}
          {showMobileMenu && <MobileInfoPanel />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Columna izquierda - Info (solo desktop) */}
            <div className="hidden lg:flex flex-col justify-center text-white space-y-6">
              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 xl:p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    <img 
                      src="/img/bachii.png" 
                      alt="Bachi" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/64x64/3b82f6/white?text=B';
                        e.target.className = 'w-10 h-10 object-contain';
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Bachi</h2>
                    <p className="text-white/70 text-sm">Sistema de Gestión de Desastres</p>
                  </div>
                </div>
                
                <h1 className="text-3xl xl:text-4xl font-bold mb-4">
                  Comunidad
                  <span className="block text-orange-400">Segura</span>
                </h1>
                
                <p className="text-white/80 text-base xl:text-lg mb-6 leading-relaxed">
                  Sistema integral para la gestión, seguimiento y atención de 
                  emergencias y desastres naturales.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-white/80 text-sm">Reporte de incidentes en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-white/80 text-sm">Geolocalización de zonas críticas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-400" />
                    </div>
                    <span className="text-white/80 text-sm">Seguimiento y resolución de incidentes</span>
                  </div>
                </div>

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

              <div className="backdrop-blur-sm bg-red-500/20 rounded-xl p-4 border border-red-500/30 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-ping-slow">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Alerta Naranja</p>
                    <p className="text-xs text-white/70">Lluvias intensas en región norte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                {/* Logo móvil */}
                <div className="lg:hidden text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-3 overflow-hidden">
                    <img 
                      src="/img/bachii.png" 
                      alt="Bachi" 
                      className="w-14 h-14 object-contain"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/80x80/3b82f6/white?text=B';
                      }}
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
                  <p className="text-white/70 text-sm">Sistema de Gestión de Desastres</p>
                </div>

                <div className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl p-5 sm:p-8 border border-white/20">
                  <div className="mb-5 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Iniciar sesión</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Accede al panel de control de emergencias</p>
                  </div>

                  {(error || localError) && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 animate-shake">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error || localError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                          placeholder="admin@bachi.com"
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                          className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
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

                    <div className="flex items-center justify-between flex-wrap gap-2">
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
                      className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

                  <div className="relative my-5 sm:my-6">
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
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

                  <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                      Bachi - Sistema de Gestión de Desastres Naturales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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