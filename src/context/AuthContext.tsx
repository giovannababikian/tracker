import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  theme: 'dark' | 'light';
  isLoading: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string, name?: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchToDemo: (username: string) => Promise<void>;
  updateUserPreferences: (prefs: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'ht_auth_user';
const LOCAL_STORAGE_TOKEN_KEY = 'ht_auth_token';
const LOCAL_STORAGE_THEME_KEY = 'ht_theme';

// Default initial user for instant onboarding
const DEFAULT_INITIAL_USER: UserProfile = {
  id: 'user_gbcosta',
  username: 'gbcosta',
  name: 'GB Costa',
  email: 'gbcosta.ct@gmail.com',
  createdAt: '2026-09-28T12:00:00.000Z',
  nativeViewMode: false,
  theme: 'dark',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize theme with body classes
  useEffect(() => {
    const savedTheme = (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as 'dark' | 'light') || 'dark';
    setThemeState(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.remove('bg-zinc-950', 'text-zinc-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-zinc-950', 'text-zinc-100');
    }
  }, []);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    if (user) {
      updateUserPreferences({ theme: newTheme });
    }
    if (newTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.remove('bg-zinc-950', 'text-zinc-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('bg-slate-50', 'text-slate-900');
      document.body.classList.add('bg-zinc-950', 'text-zinc-100');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const savedUserStr = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      const savedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

      if (savedUserStr && savedToken) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser(parsed);
          setToken(savedToken);

          // Verify with backend
          fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
            .then((res) => {
              if (res.ok) return res.json();
              throw new Error('Token expired');
            })
            .then((data) => {
              if (data?.user) {
                setUser((prev) => ({ ...prev, ...data.user }));
              }
            })
            .catch(() => {
              // Maintain local session if offline
            });
        } catch (e) {
          console.error('Error restoring auth', e);
        }
      } else {
        // Automatically sign in with default user so the app works out-of-the-box
        const defaultToken = 'token_default_gbcosta';
        setUser(DEFAULT_INITIAL_USER);
        setToken(defaultToken);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEFAULT_INITIAL_USER));
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, defaultToken);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Falha no login' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      return { success: true };
    } catch (e: any) {
      // Local fallback for client-side resiliency
      if (username.toLowerCase() === 'gbcosta' && (password === '123' || password === 'senha123')) {
        const fallbackUser: UserProfile = { ...DEFAULT_INITIAL_USER };
        setUser(fallbackUser);
        setToken('token_fallback');
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(fallbackUser));
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, 'token_fallback');
        return { success: true };
      }
      return { success: false, error: 'Erro de conexão ou credenciais inválidas' };
    }
  };

  const register = async (username: string, password: string, name?: string, email?: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Falha ao cadastrar usuário' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: 'Erro ao conectar ao servidor de cadastro' };
    }
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  };

  const quickSwitchToDemo = async (username: string) => {
    if (username === 'gbcosta') {
      await login('gbcosta', '123');
    } else {
      // Create or login as demo
      const result = await login(username, '123');
      if (!result.success) {
        await register(username, '123', username.toUpperCase(), `${username}@example.com`);
      }
    }
  };

  const updateUserPreferences = (prefs: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...prefs };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        theme,
        isLoading,
        toggleTheme,
        setTheme,
        login,
        register,
        logout,
        quickSwitchToDemo,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
