import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  subscriptionStatus: 'paid' | 'free' | 'none';
  isPaid: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, subscriptionStatus: string, isPaid: boolean, name: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Development bypass for testing
    const DEV_EMAIL = 'bradley@projectbrazen.com';
    
    // Check if user is already logged in
    let email = localStorage.getItem('user_email');
    let subscriptionStatus = localStorage.getItem('subscription_status') as 'paid' | 'free' | 'none';
    let isPaid = localStorage.getItem('is_paid') === 'true';
    let name = localStorage.getItem('user_name') || '';

    // Development bypass: auto-authenticate bradley@projectbrazen.com
    if (!email || email === DEV_EMAIL) {
      email = DEV_EMAIL;
      subscriptionStatus = 'paid';
      isPaid = true;
      name = 'Bradley Hope';
      
      // Save to localStorage
      localStorage.setItem('user_email', email);
      localStorage.setItem('subscription_status', subscriptionStatus);
      localStorage.setItem('is_paid', 'true');
      localStorage.setItem('user_name', name);
    }

    if (email && subscriptionStatus) {
      setUser({ email, name, subscriptionStatus, isPaid });
    }
  }, []);

  const login = (email: string, subscriptionStatus: string, isPaid: boolean, name: string) => {
    const userStatus = subscriptionStatus as 'paid' | 'free' | 'none';
    setUser({ email, name, subscriptionStatus: userStatus, isPaid });
    localStorage.setItem('user_email', email);
    localStorage.setItem('subscription_status', subscriptionStatus);
    localStorage.setItem('is_paid', isPaid.toString());
    localStorage.setItem('user_name', name);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_email');
    localStorage.removeItem('subscription_status');
    localStorage.removeItem('is_paid');
    localStorage.removeItem('user_name');
  };

  const checkAuth = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

