import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import GhostAuthGate from "./components/GhostAuthGate";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Query from "./pages/Query";
import Login from "./pages/Login";
import DevLogin from "./pages/DevLogin";
import TestFetch from "./pages/TestFetch";

function Router() {
  return (
    <Switch>
      <Route path={"/test-fetch"} component={TestFetch} />
      <Route path={"/dev-login"} component={DevLogin} />
      <Route path={"/login"} component={Login} />
      <Route path={"/"}>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path={"/dashboard"}>
        <ProtectedRoute requirePaid>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path={"/query"}>
        <ProtectedRoute requirePaid>
          <Query />
        </ProtectedRoute>
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <GhostAuthGate>
              <Router />
            </GhostAuthGate>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
