import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MandateCard as MandateCardType } from "@/lib/api";
import { formatDate } from "@/lib/dateUtils";

interface MandateCardProps {
  card: MandateCardType;
}

const colorClasses = {
  red: "bg-red-500/10 border-red-500/50 hover:border-red-500",
  green: "bg-green-500/10 border-green-500/50 hover:border-green-500",
  blue: "bg-blue-500/10 border-blue-500/50 hover:border-blue-500",
  purple: "bg-purple-500/10 border-purple-500/50 hover:border-purple-500",
};

const badgeClasses = {
  red: "bg-red-500/20 text-red-300 border-red-500/50",
  green: "bg-green-500/20 text-green-300 border-green-500/50",
  blue: "bg-blue-500/20 text-blue-300 border-blue-500/50",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/50",
};

export function MandateCard({ card }: MandateCardProps) {
  const colorClass = colorClasses[card.color as keyof typeof colorClasses] || colorClasses.blue;
  const badgeClass = badgeClasses[card.color as keyof typeof badgeClasses] || badgeClasses.blue;

  return (
    <Card className={`transition-all duration-300 ${colorClass}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-2xl">{card.icon}</span>
              {card.title}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {card.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={badgeClass}>
            {card.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(card.metadata).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{formatDate(card.date)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

