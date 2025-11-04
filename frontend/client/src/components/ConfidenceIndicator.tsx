import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConfidenceIndicatorProps {
  confidence: number; // 0-1 scale
  compact?: boolean;
}

export function ConfidenceIndicator({ confidence, compact = false }: ConfidenceIndicatorProps) {
  const percentage = Math.round(confidence * 100);
  
  const getConfidenceLevel = () => {
    if (confidence >= 0.8) return { label: "High", color: "bg-green-500", icon: CheckCircle2, textColor: "text-green-700" };
    if (confidence >= 0.6) return { label: "Medium", color: "bg-yellow-500", icon: AlertCircle, textColor: "text-yellow-700" };
    return { label: "Low", color: "bg-red-500", icon: HelpCircle, textColor: "text-red-700" };
  };

  const level = getConfidenceLevel();
  const Icon = level.icon;

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className={`${level.textColor} border-current`}>
            <Icon className="w-3 h-3 mr-1" />
            {percentage}%
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            <span className="font-semibold">{level.label} Confidence</span>
            <br />
            This answer is based on {percentage}% confidence from our data sources.
          </p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Card className="p-4 bg-gray-50/50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${level.textColor}`} />
            <span className="text-sm font-semibold">Confidence Score</span>
          </div>
          <Badge variant="outline" className={`${level.textColor} border-current`}>
            {level.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Answer Confidence</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full ${level.color} transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-gray-600">
          {confidence >= 0.8 && (
            "This answer is highly confident based on strong matches in our knowledge base."
          )}
          {confidence >= 0.6 && confidence < 0.8 && (
            "This answer is moderately confident. Some information may be inferred or partial."
          )}
          {confidence < 0.6 && (
            "This answer has lower confidence. Consider verifying with additional sources or refining your query."
          )}
        </p>
      </div>
    </Card>
  );
}

