import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface PasswordGateProps {
  onUnlock: () => void;
}

export function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - you can change this password
    const correctPassword = "mandate2025";
    
    if (password === correctPassword) {
      localStorage.setItem("mandate_wizard_unlocked", "true");
      onUnlock();
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">
              Mandate Wizard
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              Strategic Intelligence Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Enter Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Password"
                className="w-full"
                autoFocus
              />
              {error && (
                <p className="text-destructive text-sm mt-2">{error}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              Access Platform
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Beta Access Only • Contact admin for password
          </p>
        </div>
      </div>
    </div>
  );
}

