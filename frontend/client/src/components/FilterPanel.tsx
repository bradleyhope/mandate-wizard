import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";

export interface FilterState {
  platforms: string[];
  contentTypes: string[];
  genres: string[];
  dateRange: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

const PLATFORMS = [
  "Netflix",
  "Amazon Prime Video",
  "Disney+",
  "Hulu",
  "Apple TV+",
  "HBO Max",
  "Paramount+",
  "Peacock",
];

const CONTENT_TYPES = [
  "Greenlight",
  "Quote",
  "Deal",
  "Cancellation",
  "Renewal",
  "Executive Move",
];

const GENRES = [
  "Drama",
  "Comedy",
  "Thriller",
  "Crime",
  "Documentary",
  "Unscripted",
  "Limited Series",
  "Animation",
  "Sci-Fi",
  "Horror",
];

const DATE_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "This year", value: "year" },
  { label: "All time", value: "all" },
];

export function FilterPanel({ filters, onFilterChange, onClearAll }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    platforms: true,
    contentTypes: true,
    genres: false,
    dateRange: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    onFilterChange({ ...filters, platforms: newPlatforms });
  };

  const handleContentTypeToggle = (type: string) => {
    const newTypes = filters.contentTypes.includes(type)
      ? filters.contentTypes.filter(t => t !== type)
      : [...filters.contentTypes, type];
    onFilterChange({ ...filters, contentTypes: newTypes });
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    onFilterChange({ ...filters, genres: newGenres });
  };

  const handleDateRangeChange = (range: string) => {
    onFilterChange({ ...filters, dateRange: range });
  };

  const activeFilterCount = 
    filters.platforms.length + 
    filters.contentTypes.length + 
    filters.genres.length + 
    (filters.dateRange !== "all" ? 1 : 0);

  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {isExpanded && (
        <Card className="mt-3 p-4 space-y-4">
          {/* Date Range */}
          <div>
            <button
              onClick={() => toggleSection("dateRange")}
              className="flex items-center justify-between w-full mb-2"
            >
              <Label className="text-sm font-semibold">Date Range</Label>
              {expandedSections.dateRange ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.dateRange && (
              <div className="space-y-2">
                {DATE_RANGES.map((range) => (
                  <div key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`date-${range.value}`}
                      name="dateRange"
                      checked={filters.dateRange === range.value}
                      onChange={() => handleDateRangeChange(range.value)}
                      className="mr-2"
                    />
                    <Label
                      htmlFor={`date-${range.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platforms */}
          <div className="border-t pt-4">
            <button
              onClick={() => toggleSection("platforms")}
              className="flex items-center justify-between w-full mb-2"
            >
              <Label className="text-sm font-semibold">
                Platform {filters.platforms.length > 0 && `(${filters.platforms.length})`}
              </Label>
              {expandedSections.platforms ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.platforms && (
              <div className="space-y-2">
                {PLATFORMS.map((platform) => (
                  <div key={platform} className="flex items-center">
                    <Checkbox
                      id={`platform-${platform}`}
                      checked={filters.platforms.includes(platform)}
                      onCheckedChange={() => handlePlatformToggle(platform)}
                    />
                    <Label
                      htmlFor={`platform-${platform}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Types */}
          <div className="border-t pt-4">
            <button
              onClick={() => toggleSection("contentTypes")}
              className="flex items-center justify-between w-full mb-2"
            >
              <Label className="text-sm font-semibold">
                Content Type {filters.contentTypes.length > 0 && `(${filters.contentTypes.length})`}
              </Label>
              {expandedSections.contentTypes ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.contentTypes && (
              <div className="space-y-2">
                {CONTENT_TYPES.map((type) => (
                  <div key={type} className="flex items-center">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.contentTypes.includes(type)}
                      onCheckedChange={() => handleContentTypeToggle(type)}
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="border-t pt-4">
            <button
              onClick={() => toggleSection("genres")}
              className="flex items-center justify-between w-full mb-2"
            >
              <Label className="text-sm font-semibold">
                Genre {filters.genres.length > 0 && `(${filters.genres.length})`}
              </Label>
              {expandedSections.genres ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {expandedSections.genres && (
              <div className="space-y-2">
                {GENRES.map((genre) => (
                  <div key={genre} className="flex items-center">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={filters.genres.includes(genre)}
                      onCheckedChange={() => handleGenreToggle(genre)}
                    />
                    <Label
                      htmlFor={`genre-${genre}`}
                      className="ml-2 text-sm font-normal cursor-pointer"
                    >
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Clear all filters
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

