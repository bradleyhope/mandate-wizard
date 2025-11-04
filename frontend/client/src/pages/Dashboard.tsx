import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_ENDPOINTS, fetchAPI, type DashboardStats } from "@/lib/api";
import { Loader2, Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('[Dashboard] Fetching from /api/pattern/dashboard');
      
      const response = await fetch('/api/pattern/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': localStorage.getItem('user_email') || '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const rawData = await response.json();
      console.log('[Dashboard] Data received:', rawData);
      
      // Transform API response to expected format
      const transformedStats = {
        total_greenlights: rawData.stats.greenlights_by_year.reduce((sum: number, item: any) => sum + item.count, 0),
        by_year: rawData.stats.greenlights_by_year.reduce((acc: any, item: any) => {
          acc[item.year] = item.count;
          return acc;
        }, {}),
        by_genre: rawData.stats.top_genres.reduce((acc: any, item: any) => {
          acc[item.genre] = item.count;
          return acc;
        }, {}),
        by_format: rawData.stats.format_breakdown.reduce((acc: any, item: any) => {
          acc[item.format] = item.count;
          return acc;
        }, {}),
        by_executive: rawData.stats.top_executives
          .filter((item: any) => item.executive && item.executive.trim() !== '')
          .slice(0, 10)
          .reduce((acc: any, item: any) => {
            acc[item.executive] = item.count;
            return acc;
          }, {})
      };
      
      console.log('[Dashboard] Transformed stats:', transformedStats);
      setStats(transformedStats);
      setError(null);
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
          <p className="text-destructive">{error || 'Failed to load dashboard'}</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const genreData = {
    labels: Object.keys(stats.by_genre),
    datasets: [
      {
        data: Object.values(stats.by_genre),
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(168, 85, 247, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const executiveData = {
    labels: Object.keys(stats.by_executive).slice(0, 10),
    datasets: [
      {
        label: 'Greenlights',
        data: Object.values(stats.by_executive).slice(0, 10),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
      },
    ],
  };

  const yearData = {
    labels: Object.keys(stats.by_year).sort(),
    datasets: [
      {
        label: 'Greenlights by Year',
        data: Object.keys(stats.by_year).sort().map(year => stats.by_year[year]),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card/50">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pattern Analysis Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Visualize greenlight patterns, executive preferences, and industry trends
              </p>
            </div>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border">
        <div className="container py-6">
          <div className="flex gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {Object.keys(stats.by_year).sort().map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {Object.keys(stats.by_genre).map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchStats}>
              Refresh
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Greenlights</CardDescription>
                <CardTitle className="text-4xl">{stats.total_greenlights}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Genres</CardDescription>
                <CardTitle className="text-4xl">{Object.keys(stats.by_genre).length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Executives</CardDescription>
                <CardTitle className="text-4xl">{Object.keys(stats.by_executive).length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Years Tracked</CardDescription>
                <CardTitle className="text-4xl">{Object.keys(stats.by_year).length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Genre Distribution</CardTitle>
                <CardDescription>Greenlights by genre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Pie data={genreData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, display: true } } }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Executives</CardTitle>
                <CardDescription>Greenlights by executive (Top 10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Bar data={executiveData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Greenlight Trends</CardTitle>
                <CardDescription>Year-over-year greenlight activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line data={yearData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

