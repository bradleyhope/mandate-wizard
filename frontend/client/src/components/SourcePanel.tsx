import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, FileText, User, Film } from "lucide-react";

interface Source {
  id: number;
  type: string;
  title: string;
  platform: string;
  metadata: Record<string, any>;
}

interface SourcePanelProps {
  sources: Source[];
}

export function SourcePanel({ sources }: SourcePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'executive':
        return <User className="w-4 h-4" />;
      case 'greenlight':
        return <Film className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'executive':
        return 'border-l-blue-500';
      case 'greenlight':
        return 'border-l-green-500';
      case 'quote':
        return 'border-l-purple-500';
      case 'deal':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Sources ({sources.length})
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {sources.map((source) => (
            <Card
              key={source.id}
              className={`p-3 border-l-4 ${getSourceColor(source.type)} hover:bg-gray-50 transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-gray-500">
                  {getSourceIcon(source.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {source.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {source.type} • {source.platform}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-gray-500 flex-shrink-0">
                      [{source.id}]
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="mt-2 space-y-1">
                    {source.metadata.genre && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Genre:</span> {source.metadata.genre}
                      </p>
                    )}
                    {source.metadata.date && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Date:</span> {source.metadata.date}
                      </p>
                    )}
                    {source.metadata.executive && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Executive:</span> {source.metadata.executive}
                      </p>
                    )}
                    {source.metadata.position && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Position:</span> {source.metadata.position}
                      </p>
                    )}
                    {source.metadata.region && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Region:</span> {source.metadata.region}
                      </p>
                    )}
                    {source.metadata.format && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Format:</span> {source.metadata.format}
                      </p>
                    )}
                    {source.metadata.talent && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Talent:</span> {source.metadata.talent}
                      </p>
                    )}
                    {source.metadata.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {source.metadata.description}
                      </p>
                    )}
                    {source.metadata.preview && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {source.metadata.preview}
                      </p>
                    )}
                    {source.metadata.relevance !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        Relevance: {(source.metadata.relevance * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

