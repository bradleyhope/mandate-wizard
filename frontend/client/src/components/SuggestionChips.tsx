import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, Film, Calendar } from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
  context?: "initial" | "netflix" | "amazon" | "executive" | "genre";
}

const suggestionsByContext = {
  initial: [
    { icon: TrendingUp, text: "Recent greenlights", query: "What are the most recent greenlights across all platforms?" },
    { icon: Users, text: "Top executives", query: "Which executives are greenlighting the most content this year?" },
    { icon: Film, text: "Crime thrillers", query: "Show me recent crime thriller greenlights" },
    { icon: Calendar, text: "This quarter", query: "What content was greenlit in the last 3 months?" },
  ],
  netflix: [
    { icon: Film, text: "Compare with Amazon", query: "How do Netflix's recent greenlights compare to Amazon's?" },
    { icon: Users, text: "Show executive quotes", query: "What have Netflix executives said recently?" },
    { icon: TrendingUp, text: "Filter by genre", query: "Show me Netflix greenlights by genre" },
  ],
  amazon: [
    { icon: Film, text: "Compare with Netflix", query: "How do Amazon's recent greenlights compare to Netflix's?" },
    { icon: Users, text: "Show executive quotes", query: "What have Amazon executives said recently?" },
    { icon: TrendingUp, text: "Filter by genre", query: "Show me Amazon greenlights by genre" },
  ],
  executive: [
    { icon: Film, text: "Recent projects", query: "What projects has this executive greenlit recently?" },
    { icon: TrendingUp, text: "Genre preferences", query: "What genres does this executive prefer?" },
    { icon: Users, text: "Team structure", query: "Who reports to this executive?" },
  ],
  genre: [
    { icon: Calendar, text: "Recent trends", query: "What are the recent trends in this genre?" },
    { icon: Users, text: "Top executives", query: "Which executives greenlight the most content in this genre?" },
    { icon: Film, text: "Platform breakdown", query: "Which platforms are investing most in this genre?" },
  ],
};

export function SuggestionChips({ onSelect, context = "initial" }: SuggestionChipsProps) {
  const suggestions = suggestionsByContext[context] || suggestionsByContext.initial;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        Suggested queries
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSelect(suggestion.query)}
              className="text-xs h-8 px-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              {suggestion.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

