import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requirePaid?: boolean;
}

export function ProtectedRoute({ children, requirePaid = false }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Not authenticated at all
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please sign in with your Hollywood Signal subscription to access Mandate Wizard.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setLocation('/login')} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Requires paid subscription but user is free
  if (requirePaid && !user?.isPaid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <Lock className="h-4 w-4" />
            <AlertTitle>Paid Subscription Required</AlertTitle>
            <AlertDescription>
              This feature requires a paid Hollywood Signal subscription. You currently have a free membership.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <a href="https://www.hollywoodsignal.com" target="_blank" rel="noopener noreferrer">
              Upgrade to Paid Subscription
            </a>
          </Button>
          <Button variant="outline" onClick={() => setLocation('/')} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // User has required access
  return <>{children}</>;
}

