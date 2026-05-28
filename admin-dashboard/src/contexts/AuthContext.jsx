import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Credenciales actualizadas para coincidir con el login
        const validCredentials = {
          'admin@bachi.com': { 
            password: 'admin123',
            user: {
              id: 1,
              name: 'Carlos Hernández',
              email: 'admin@bachi.com',
              role: 'admin',
              avatar: null,
              department: 'Administración',
              municipality: 'Tuxtla Gutiérrez'
            }
          },
          'operador@bachi.com': {
            password: 'operador123',
            user: {
              id: 2,
              name: 'Ana García',
              email: 'operador@bachi.com',
              role: 'operator',
              avatar: null,
              department: 'Operaciones',
              municipality: 'San Cristóbal'
            }
          }
        };

        const validUser = validCredentials[email];
        
        if (validUser && validUser.password === password) {
          const userData = validUser.user;
          const token = `fake-jwt-token-${Date.now()}`;
          
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          
          setUser(userData);
          setLoading(false);
          resolve(userData);
        } else {
          setError('Correo electrónico o contraseña incorrectos');
          setLoading(false);
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isOperator: user?.role === 'operator'
    }}>
      {children}
    </AuthContext.Provider>
  );
};