import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { FilterState } from "./FilterPanel";

interface MobileFilterDrawerProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  activeFilterCount: number;
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
];

const DATE_RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "This year" },
  { value: "all", label: "All Time" },
];

export function MobileFilterDrawer({
  filters,
  onFilterChange,
  onClearAll,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onFilterChange({ ...filters, platforms: newPlatforms });
  };

  const handleContentTypeToggle = (type: string) => {
    const newTypes = filters.contentTypes.includes(type)
      ? filters.contentTypes.filter((t) => t !== type)
      : [...filters.contentTypes, type];
    onFilterChange({ ...filters, contentTypes: newTypes });
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onFilterChange({ ...filters, genres: newGenres });
  };

  const handleDateRangeChange = (range: string) => {
    onFilterChange({ ...filters, dateRange: range });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-background pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClearAll();
                  setOpen(false);
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6 pt-6">
          {/* Date Range */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Date Range</h3>
            <div className="space-y-2">
              {DATE_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleDateRangeChange(range.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    filters.dateRange === range.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Platform</h3>
            <div className="space-y-2">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                >
                  <Checkbox
                    id={`mobile-platform-${platform}`}
                    checked={filters.platforms.includes(platform)}
                    onCheckedChange={() => handlePlatformToggle(platform)}
                  />
                  <Label
                    htmlFor={`mobile-platform-${platform}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Content Types */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Content Type</h3>
            <div className="space-y-2">
              {CONTENT_TYPES.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                >
                  <Checkbox
                    id={`mobile-type-${type}`}
                    checked={filters.contentTypes.includes(type)}
                    onCheckedChange={() => handleContentTypeToggle(type)}
                  />
                  <Label
                    htmlFor={`mobile-type-${type}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold mb-3 text-base">Genre</h3>
            <div className="space-y-2">
              {GENRES.map((genre) => (
                <div
                  key={genre}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                >
                  <Checkbox
                    id={`mobile-genre-${genre}`}
                    checked={filters.genres.includes(genre)}
                    onCheckedChange={() => handleGenreToggle(genre)}
                  />
                  <Label
                    htmlFor={`mobile-genre-${genre}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button (sticky at bottom) */}
        <div className="sticky bottom-0 bg-background pt-4 pb-6 border-t mt-6">
          <Button
            className="w-full h-12 text-base"
            onClick={() => setOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

