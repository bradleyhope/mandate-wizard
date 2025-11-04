import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, X, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchField {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  onClose?: () => void;
}

const SEARCH_FIELDS = [
  { value: "title", label: "Title" },
  { value: "executive", label: "Executive" },
  { value: "platform", label: "Platform" },
  { value: "genre", label: "Genre" },
  { value: "talent", label: "Talent" },
  { value: "production_company", label: "Production Company" },
  { value: "description", label: "Description" },
  { value: "date", label: "Date" },
];

const OPERATORS = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "not_contains", label: "Does not contain" },
];

const DATE_OPERATORS = [
  { value: "after", label: "After" },
  { value: "before", label: "Before" },
  { value: "between", label: "Between" },
  { value: "equals", label: "On" },
];

export function AdvancedSearch({ onSearch, onClose }: AdvancedSearchProps) {
  const [searchFields, setSearchFields] = useState<SearchField[]>([
    { id: "1", field: "title", operator: "contains", value: "" },
  ]);
  const [logicOperator, setLogicOperator] = useState<"AND" | "OR">("AND");

  const addField = () => {
    const newField: SearchField = {
      id: Date.now().toString(),
      field: "title",
      operator: "contains",
      value: "",
    };
    setSearchFields([...searchFields, newField]);
  };

  const removeField = (id: string) => {
    if (searchFields.length > 1) {
      setSearchFields(searchFields.filter((f) => f.id !== id));
    }
  };

  const updateField = (id: string, updates: Partial<SearchField>) => {
    setSearchFields(
      searchFields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const buildQuery = (): string => {
    const conditions = searchFields
      .filter((f) => f.value.trim())
      .map((f) => {
        const field = f.field;
        const value = f.value;
        
        switch (f.operator) {
          case "equals":
            return `${field}:"${value}"`;
          case "contains":
            return `${field}:${value}`;
          case "starts_with":
            return `${field}:${value}*`;
          case "ends_with":
            return `${field}:*${value}`;
          case "not_contains":
            return `NOT ${field}:${value}`;
          case "after":
            return `${field}:>${value}`;
          case "before":
            return `${field}:<${value}`;
          default:
            return `${field}:${value}`;
        }
      });

    return conditions.join(` ${logicOperator} `);
  };

  const handleSearch = () => {
    const query = buildQuery();
    if (query) {
      onSearch(query);
    }
  };

  const handleReset = () => {
    setSearchFields([
      { id: "1", field: "title", operator: "contains", value: "" },
    ]);
    setLogicOperator("AND");
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Advanced Search</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Build complex queries by combining multiple search criteria. Use AND to match all
                conditions, or OR to match any condition.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {searchFields.map((field, index) => (
          <div key={field.id}>
            {index > 0 && (
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 border-t" />
                <Select
                  value={logicOperator}
                  onValueChange={(value) => setLogicOperator(value as "AND" | "OR")}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1 border-t" />
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label className="text-xs">Field</Label>
                <Select
                  value={field.field}
                  onValueChange={(value) => updateField(field.id, { field: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEARCH_FIELDS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2">
                <Label className="text-xs">Operator</Label>
                <Select
                  value={field.operator}
                  onValueChange={(value) => updateField(field.id, { operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.field === "date" ? DATE_OPERATORS : OPERATORS).map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-[2] space-y-2">
                <Label className="text-xs">Value</Label>
                <Input
                  type={field.field === "date" ? "date" : "text"}
                  value={field.value}
                  onChange={(e) => updateField(field.id, { value: e.target.value })}
                  placeholder="Enter search value..."
                />
              </div>

              {searchFields.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={addField}>
          <Plus className="w-4 h-4 mr-1" />
          Add Field
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {searchFields.some((f) => f.value.trim()) && (
        <div className="pt-3 border-t">
          <Label className="text-xs text-gray-600">Query Preview:</Label>
          <code className="block mt-1 p-2 bg-gray-50 rounded text-xs font-mono break-all">
            {buildQuery() || "Enter search criteria above"}
          </code>
        </div>
      )}
    </Card>
  );
}

