import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, ArrowUp } from "lucide-react";

interface TrendingTopic {
  topic: string;
  count: number;
  trend: "up" | "stable" | "down";
  category: string;
}

interface TrendingTopicsProps {
  onTopicClick?: (topic: string) => void;
}

// Mock trending topics - in production, this would come from backend analytics
const MOCK_TRENDING: TrendingTopic[] = [
  { topic: "Crime Thriller Greenlights", count: 45, trend: "up", category: "Genre" },
  { topic: "Netflix International", count: 38, trend: "up", category: "Platform" },
  { topic: "Limited Series Deals", count: 32, trend: "stable", category: "Format" },
  { topic: "Unscripted Content", count: 28, trend: "up", category: "Genre" },
  { topic: "Amazon Prime Video", count: 25, trend: "stable", category: "Platform" },
  { topic: "Executive Moves", count: 22, trend: "up", category: "News" },
];

export function TrendingTopics({ onTopicClick }: TrendingTopicsProps) {
  const getTrendIcon = (trend: string) => {
    if (trend === "up") {
      return <ArrowUp className="w-3 h-3 text-green-600" />;
    }
    return null;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Genre":
        return "bg-purple-100 text-purple-700";
      case "Platform":
        return "bg-blue-100 text-blue-700";
      case "Format":
        return "bg-green-100 text-green-700";
      case "News":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Trending Topics</h3>
          <Badge variant="secondary" className="ml-auto text-xs">
            Last 24h
          </Badge>
        </div>

        <div className="space-y-2">
          {MOCK_TRENDING.map((topic, index) => (
            <button
              key={index}
              onClick={() => onTopicClick?.(topic.topic)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {topic.topic}
                    </span>
                    {getTrendIcon(topic.trend)}
                  </div>
                  <Badge variant="outline" className={`mt-1 text-xs ${getCategoryColor(topic.category)}`}>
                    {topic.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-xs text-gray-500">{topic.count} queries</span>
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          Based on query patterns across all users
        </div>
      </div>
    </Card>
  );
}

