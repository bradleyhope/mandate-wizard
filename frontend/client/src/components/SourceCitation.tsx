import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Source {
  id: number;
  type: string;
  title: string;
  platform: string;
  metadata: Record<string, any>;
}

interface SourceCitationProps {
  sourceId: number;
  source?: Source;
  onClick?: () => void;
}

export function SourceCitation({ sourceId, source, onClick }: SourceCitationProps) {
  const citationContent = (
    <Badge
      variant="outline"
      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 text-xs px-1.5 py-0 h-5 font-mono"
      onClick={onClick}
    >
      [{sourceId}]
    </Badge>
  );

  if (!source) {
    return citationContent;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {citationContent}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold text-sm">{source.title}</p>
          <p className="text-xs text-muted-foreground">
            {source.type} • {source.platform}
          </p>
          {source.metadata.genre && (
            <p className="text-xs">Genre: {source.metadata.genre}</p>
          )}
          {source.metadata.date && (
            <p className="text-xs">Date: {source.metadata.date}</p>
          )}
          {source.metadata.executive && (
            <p className="text-xs">Executive: {source.metadata.executive}</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

