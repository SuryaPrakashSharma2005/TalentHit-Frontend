import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import {
  getCompanyReports,
} from "@/lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export default function Reports() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "company") {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getCompanyReports();
      setData(res);
    } catch (error: any) {
      toast.error(error.message || "Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hiring-report-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();

    toast.success("Report exported successfully");
  };

  if (!authLoading && (!user || user.role !== "company")) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Unauthorized access
      </div>
    );
  }

  if (authLoading || loading) {
    return <div className="p-6">Loading report...</div>;
  }

  if (!data) {
    return (
      <div className="p-6 text-muted-foreground">
        No report data available.
      </div>
    );
  }

  const stageData = Object.entries(
    data.stage_distribution || {}
  ).map(([stage, count]) => ({
    stage,
    count,
  }));

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Hiring Intelligence Report
          </h1>
          <p className="text-muted-foreground">
            Executive-level hiring overview & performance insights
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPI label="Total Jobs" value={data.total_jobs} />
        <KPI label="Total Applications" value={data.total_applications} />
        <KPI
          label="Avg Final Score"
          value={`${data.average_final_score}%`}
        />
        <KPI
          label="Shortlist Conversion"
          value={`${data.shortlist_conversion_rate}%`}
        />
      </div>

      {/* Stage Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Funnel Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {stageData.length === 0 ? (
            <div className="text-muted-foreground text-center py-6">
              No stage data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Funnel Pie */}
      <Card>
        <CardHeader>
          <CardTitle>Application Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {stageData.length === 0 ? (
            <div className="text-muted-foreground text-center py-6">
              No breakdown available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stageData}
                  dataKey="count"
                  nameKey="stage"
                  outerRadius={110}
                >
                  {stageData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

function KPI({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">
          {label}
        </p>
        <p className="text-3xl font-bold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}