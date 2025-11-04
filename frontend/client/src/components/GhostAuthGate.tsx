import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";

// Get backend API URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://5000-iy1gh94d7s437eutwzpcu-aa64bff1.manusvm.computer';

interface GhostAuthGateProps {
  children: React.ReactNode;
}

export default function GhostAuthGate({ children }: GhostAuthGateProps) {
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Check for magic link token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    if (token) {
      verifyToken(token);
    }
  }, []);

  const checkExistingSession = async () => {
    const sessionToken = localStorage.getItem("mandate_wizard_session");
    const userEmail = localStorage.getItem("mandate_wizard_email");

    if (sessionToken && userEmail) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await response.json();

        if (data.success && data.is_paid) {
          setIsAuthenticated(true);
          setUserInfo(data);
        } else {
          // Session invalid or subscription expired
          localStorage.removeItem("mandate_wizard_session");
          localStorage.removeItem("mandate_wizard_email");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    }

    setIsLoading(false);
  };

  const verifyToken = async (token: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success && data.is_paid) {
        // Store session
        localStorage.setItem("mandate_wizard_session", data.session_token);
        localStorage.setItem("mandate_wizard_email", data.email);

        setIsAuthenticated(true);
        setUserInfo(data);

        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (!data.is_paid) {
        setError("A paid Hollywood Signal subscription is required to access Mandate Wizard.");
      } else {
        setError(data.error || "Invalid or expired magic link.");
      }
    } catch (err) {
      setError("Failed to verify authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSendingLink(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/magic-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setLinkSent(true);
        
        // DEV: If dev_token is returned, auto-verify for testing
        if (data.dev_token) {
          console.log("[DEV] Auto-verifying with dev token");
          setTimeout(() => verifyToken(data.dev_token), 2000);
        }
      } else {
        setError(data.message || "Failed to send magic link. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSendingLink(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mandate_wizard_session");
    localStorage.removeItem("mandate_wizard_email");
    setIsAuthenticated(false);
    setUserInfo(null);
    
    fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" }).catch(() => {});
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // Authenticated - show children with logout button
  if (isAuthenticated) {
    return (
      <div>
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
          {userInfo?.name && (
            <span className="text-sm text-slate-300">
              {userInfo.name}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-700"
          >
            Logout
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // Not authenticated - show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Mandate Wizard
          </CardTitle>
          <CardDescription className="text-center text-slate-300">
            Strategic Intelligence for Hollywood Signal Subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!linkSent ? (
            <>
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isSendingLink}
                  />
                  <p className="text-xs text-slate-400">
                    Use your Hollywood Signal subscription email
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isSendingLink || !email}
                >
                  {isSendingLink ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-slate-400">
                <p>Don't have a subscription?</p>
                <a
                  href="https://www.hollywoodsignal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Subscribe to Hollywood Signal
                </a>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-900/20 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Check Your Email</h3>
                <p className="text-slate-300">
                  We've sent a magic link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-slate-400">
                  Click the link in the email to access Mandate Wizard
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setLinkSent(false);
                  setEmail("");
                }}
                className="mt-4 bg-slate-700/50 border-slate-600 hover:bg-slate-600"
              >
                Use Different Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

