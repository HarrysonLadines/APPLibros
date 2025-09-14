import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AuthContextProps {
  children: ReactNode;
}

interface AuthContextType {
  user: { id: string; email: string; nombre?: string } | null;
  login: (userData: { id: string; email: string; nombre?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    nombre?: string;
  } | null>(null);

  useEffect(() => {
    console.log('[AuthProvider] Montando AuthProvider...');

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // 👈 esto envía la cookie
        });

        if (res.ok) {
          const data = await res.json();
          console.log('[AuthProvider] Usuario recibido desde backend:', data.user);
          setUser(data.user);
        } else {
          console.warn('[AuthProvider] No autenticado o token inválido');
          setUser(null);
        }
      } catch (err) {
        console.error('[AuthProvider] Error al obtener usuario:', err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = (userData: {
    id: string;
    email: string;
    nombre?: string;
  }) => {
    console.log('[AuthProvider] Login: Actualizando usuario en contexto:', userData);
    setUser(userData);
  };

  const logout = () => {
    console.log('[AuthProvider] Logout: Limpiando usuario del contexto');
    setUser(null);
    document.cookie = 'token=; Max-Age=0; path=/'; // Eliminar la cookie manualmente
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
