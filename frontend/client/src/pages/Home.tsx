import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MandateCard } from "@/components/MandateCard";
import { API_ENDPOINTS, fetchAPI, type MandateCard as MandateCardType } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

import { useLocation } from "wouter";

export default function Home() {
  const [cards, setCards] = useState<MandateCardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<MandateCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [, setLocation] = useLocation();

  const fetchCards = async () => {
    try {
      setLoading(true);
      console.log('[Home] Fetching from /api/recent-mandates');
      
      // Direct fetch using relative URL (will be proxied by Vite)
      const response = await fetch('/api/recent-mandates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': localStorage.getItem('user_email') || '',
        },
      });
      
      console.log('[Home] Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[Home] Data received:', data);
      
      const fetchedCards = data.data.cards || [];
      setCards(fetchedCards);
      setFilteredCards(fetchedCards);
      setError(null);
    } catch (err) {
      console.error('[Home] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch mandates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchCards, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Show all cards (no filtering)
  useEffect(() => {
    setFilteredCards(cards);
  }, [cards]);



  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find the Right Executive for Your Project
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Get instant pitch intelligence: who to contact, what they're looking for, and how to craft your pitch
          </p>
          <Link href="/query">
            <Button size="lg" className="text-lg px-12 py-6">
              Start Query →
            </Button>
          </Link>
        </div>
      </section>



      {/* Recent Mandates Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Recent Mandates & Greenlights</h2>
            <p className="text-muted-foreground">
              Browse the latest executive mandates and project greenlights
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {loading && cards.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No recent mandates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredCards.slice(0, 9).map((card, index) => (
                <MandateCard key={index} card={card} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-8">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Mandate Wizard. Strategic intelligence platform for entertainment industry professionals.
          </p>
        </div>
      </footer>
    </div>
  );
}
