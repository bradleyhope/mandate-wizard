import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Database, TrendingUp } from "lucide-react";

interface QueryInterpretationProps {
  intent: string;
  attributes?: Record<string, any>;
  context?: {
    referenced_person?: string;
    vector_count?: number;
    graph_count?: number;
  };
}

const INTENT_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  ROUTING: {
    label: "Executive Routing",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Target,
  },
  FACTUAL_QUERY: {
    label: "Factual Query",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: Database,
  },
  STRATEGIC: {
    label: "Strategic Analysis",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: TrendingUp,
  },
  MARKET_INFO: {
    label: "Market Information",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: TrendingUp,
  },
  COMPARATIVE: {
    label: "Comparative Analysis",
    color: "bg-pink-100 text-pink-800 border-pink-300",
    icon: TrendingUp,
  },
  HYBRID: {
    label: "Hybrid Query",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: Brain,
  },
};

export function QueryInterpretation({ intent, attributes, context }: QueryInterpretationProps) {
  const intentInfo = INTENT_LABELS[intent] || INTENT_LABELS.HYBRID;
  const Icon = intentInfo.icon;

  return (
    <Card className="p-4 bg-blue-50/50 border-blue-200">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-900">Query Interpretation</h4>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Intent:</span>
            <Badge variant="outline" className={`${intentInfo.color} border`}>
              <Icon className="w-3 h-3 mr-1" />
              {intentInfo.label}
            </Badge>
          </div>

          {attributes && Object.keys(attributes).length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-gray-600">Detected Attributes:</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(attributes).map(([key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;
                  return (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}: {Array.isArray(value) ? value.join(", ") : String(value)}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {context && (
            <div className="space-y-1">
              <span className="text-xs text-gray-600">Data Sources Used:</span>
              <div className="flex flex-wrap gap-1.5">
                {context.vector_count !== undefined && context.vector_count > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Database className="w-3 h-3 mr-1" />
                    {context.vector_count} vector results
                  </Badge>
                )}
                {context.graph_count !== undefined && context.graph_count > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    {context.graph_count} executives
                  </Badge>
                )}
                {context.referenced_person && (
                  <Badge variant="outline" className="text-xs bg-yellow-50">
                    Referenced: {context.referenced_person}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 italic">
          {intent === "ROUTING" && "Finding the right executive to pitch your project to."}
          {intent === "FACTUAL_QUERY" && "Retrieving specific facts from our knowledge base."}
          {intent === "STRATEGIC" && "Analyzing patterns and strategic insights."}
          {intent === "MARKET_INFO" && "Providing market overview and regional information."}
          {intent === "COMPARATIVE" && "Comparing entities or analyzing differences."}
          {intent === "HYBRID" && "Combining multiple analysis approaches for comprehensive results."}
        </p>
      </div>
    </Card>
  );
}

