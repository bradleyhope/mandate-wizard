import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function DevLogin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Automatically authenticate bradley@projectbrazen.com for testing
    localStorage.setItem('user_email', 'bradley@projectbrazen.com');
    localStorage.setItem('subscription_status', 'paid');
    localStorage.setItem('is_paid', 'true');
    localStorage.setItem('user_name', 'Bradley Hope');
    
    // Redirect to home
    setTimeout(() => {
      setLocation('/');
    }, 500);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-muted-foreground">Setting up your session</p>
      </div>
    </div>
  );
}

