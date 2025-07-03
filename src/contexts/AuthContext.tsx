import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for existing user session
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    // Ensure test user exists for demonstration
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const testUser = users.find((u: any) => u.email === 'test@test.com');
    if (!testUser) {
      users.push({ email: 'test@test.com', password: 'password' });
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, []);

  const login = (email: string) => {
    localStorage.setItem('user', JSON.stringify({ email }));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
