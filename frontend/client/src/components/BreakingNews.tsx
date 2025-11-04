import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, AlertCircle } from "lucide-react";
import type { MandateCard } from "@/lib/api";

interface BreakingNewsProps {
  items: MandateCard[];
  maxItems?: number;
}

export function BreakingNews({ items, maxItems = 3 }: BreakingNewsProps) {
  const breakingItems = items
    .filter(item => {
      // Consider items as "breaking" if they're from the last 24 hours
      const itemDate = new Date(item.date);
      const now = new Date();
      const hoursDiff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    })
    .slice(0, maxItems);

  if (breakingItems.length === 0) {
    return null;
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case "greenlight":
        return <Zap className="w-4 h-4 text-green-600" />;
      case "deal":
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const minutesDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (minutesDiff < 60) {
      return `${minutesDiff}m ago`;
    }
    const hoursDiff = Math.floor(minutesDiff / 60);
    return `${hoursDiff}h ago`;
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-red-600 animate-pulse" />
          <h3 className="text-lg font-bold text-red-900">Breaking News</h3>
          <Badge variant="destructive" className="ml-auto">
            Live
          </Badge>
        </div>

        <div className="space-y-2">
          {breakingItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100 hover:border-red-300 transition-colors cursor-pointer"
            >
              <div className="mt-0.5">{getItemIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTimeAgo(item.date)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
                {item.metadata.platform && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {item.metadata.platform}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-600 text-center pt-2 border-t border-red-100">
          Updates in real-time • Last updated {formatTimeAgo(breakingItems[0].date)}
        </div>
      </div>
    </Card>
  );
}

