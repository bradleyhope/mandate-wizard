import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Grid, List } from "lucide-react";
import type { MandateCard } from "@/lib/api";

interface TableViewProps {
  data: MandateCard[];
  onExport?: (format: "csv" | "json") => void;
}

type SortField = "title" | "date" | "type" | "platform";
type SortDirection = "asc" | "desc";

export function TableView({ data, onExport }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case "type":
        aValue = a.type;
        bValue = b.type;
        break;
      case "platform":
        aValue = a.metadata.platform || a.metadata.Platform || "";
        bValue = b.metadata.platform || b.metadata.Platform || "";
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-blue-600" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "greenlight":
        return "bg-green-100 text-green-800";
      case "quote":
        return "bg-purple-100 text-purple-800";
      case "deal":
        return "bg-orange-100 text-orange-800";
      case "breaking":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Type", "Platform", "Date", "Description"];
    const rows = sortedData.map((item) => [
      item.title,
      item.type,
      item.metadata.platform || item.metadata.Platform || "",
      item.date,
      item.description,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mandate-wizard-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    if (onExport) onExport("csv");
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(sortedData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mandate-wizard-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    if (onExport) onExport("json");
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Table View</h3>
          <span className="text-sm text-gray-600">({sortedData.length} items)</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <Download className="w-4 h-4 mr-1" />
            JSON
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <button
                    onClick={() => handleSort("title")}
                    className="flex items-center font-semibold hover:text-blue-600"
                  >
                    Title
                    <SortIcon field="title" />
                  </button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <button
                    onClick={() => handleSort("type")}
                    className="flex items-center font-semibold hover:text-blue-600"
                  >
                    Type
                    <SortIcon field="type" />
                  </button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <button
                    onClick={() => handleSort("platform")}
                    className="flex items-center font-semibold hover:text-blue-600"
                  >
                    Platform
                    <SortIcon field="platform" />
                  </button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center font-semibold hover:text-blue-600"
                  >
                    Date
                    <SortIcon field="date" />
                  </button>
                </TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No data to display
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.metadata.platform || item.metadata.Platform || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(item.date)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700 max-w-md truncate">
                      {item.description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}

