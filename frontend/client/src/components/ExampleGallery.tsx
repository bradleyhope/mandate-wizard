import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface ExampleQuery {
  category: string;
  question: string;
  preview: string;
  tags: string[];
}

interface ExampleGalleryProps {
  onSelectQuery: (query: string) => void;
}

const exampleQueries: ExampleQuery[] = [
  {
    category: "Platform Analysis",
    question: "What are Netflix's recent greenlights in the crime thriller genre?",
    preview: "Get a comprehensive list of crime thriller projects greenlit by Netflix, including titles, executives, and talent attached.",
    tags: ["Netflix", "Crime", "Greenlights"],
  },
  {
    category: "Executive Intelligence",
    question: "Which executives are greenlighting the most unscripted content?",
    preview: "Discover which executives across all platforms are championing unscripted programming and reality shows.",
    tags: ["Executives", "Unscripted", "Trends"],
  },
  {
    category: "Deal Tracking",
    question: "Show me production deals signed in the last 6 months",
    preview: "Track recent production deals, overall deals, and first-look agreements across the industry.",
    tags: ["Deals", "Production", "Recent"],
  },
  {
    category: "Genre Trends",
    question: "What drama series were greenlit in Q4 2024?",
    preview: "Analyze drama series greenlights from the last quarter across all major streaming platforms.",
    tags: ["Drama", "Series", "Q4 2024"],
  },
  {
    category: "Competitive Analysis",
    question: "Compare Amazon and Disney+ greenlight strategies",
    preview: "See how Amazon Prime Video and Disney+ differ in their content acquisition and development approaches.",
    tags: ["Amazon", "Disney+", "Strategy"],
  },
  {
    category: "Talent Tracking",
    question: "What projects has Shonda Rhimes greenlit recently?",
    preview: "Track the latest projects from top showrunners and producers across streaming platforms.",
    tags: ["Talent", "Showrunners", "Projects"],
  },
];

export function ExampleGallery({ onSelectQuery }: ExampleGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Example Queries</h2>
      </div>
      <p className="text-sm text-gray-600">
        Explore what Mandate Wizard can do with these sample queries. Click any card to try it out.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exampleQueries.map((example, index) => (
          <Card
            key={index}
            className="p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
            onClick={() => onSelectQuery(example.question)}
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">
                  {example.category}
                </p>
                <h3 className="font-medium text-sm group-hover:text-blue-700 transition-colors">
                  {example.question}
                </h3>
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {example.preview}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {example.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500">
          Or type your own question below to get started
        </p>
      </div>
    </div>
  );
}

