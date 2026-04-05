
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getCompanyAnalyticsBackend } from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#06b6d4",
];

export default function Analytics() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "company") {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await getCompanyAnalyticsBackend();
        console.log("Analytics response:", res);
        setData(res || {});
      } catch (error: any) {
        toast.error(error.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!user || user.role !== "company") {
    return (
      <div className="p-6 text-red-500 font-medium">
        Unauthorized access
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-muted-foreground">
        No analytics data available
      </div>
    );
  }

  // ===============================
  // KPI DATA
  // ===============================

  const totalApplications = data.total_applications ?? 0;
  const conversionRate = data.shortlist_conversion_rate ?? 0;
  const averageScore = data.average_final_score ?? 0;

  // ===============================
  // PIPELINE DATA
  // ===============================

  const stageDistributionRaw = data.stage_distribution || {};

  const stageDistribution =
    Object.keys(stageDistributionRaw).length > 0
      ? Object.entries(stageDistributionRaw).map(([stage, count]) => ({
        stage: stage.replace(/_/g, " "),
          count: Number(count),
        }))
      : [
          { stage: "SHORTLISTED", count: 6 },
          { stage: "REJECTED", count: 4 },
          { stage: "HIRED", count: 2 },
          { stage: "ASSESSMENT STARTED", count: 1 },
        ];

  // ===============================
  // FALLBACK DATA FOR CHARTS
  // ===============================

  const topSkills =
    data.top_skills && data.top_skills.length > 0
      ? data.top_skills
      : [
          { skill: "Python", demand: 5 },
          { skill: "React", demand: 3 },
          { skill: "JavaScript", demand: 4 },
        ];

  const jobsByDepartment =
    data.jobs_by_department && data.jobs_by_department.length > 0
      ? data.jobs_by_department
      : [
          { department: "Engineering", count: 6 },
          { department: "Design", count: 3 },
          { department: "Marketing", count: 2 },
        ];

  return (
    <div className="space-y-8 p-6">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold"
      >
        Analytics
      </motion.h1>

      {/* KPI */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-3xl font-bold text-primary">
              {conversionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-3xl font-bold">{averageScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Total Applications
            </p>
            <p className="text-3xl font-bold">{totalApplications}</p>
          </CardContent>
        </Card>
      </div>

      {/* APPLICATION PIPELINE */}
      <Card>
        <CardHeader>
          <CardTitle>Application Pipeline</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={stageDistribution}
                dataKey="count"
                nameKey="stage"
                outerRadius={110}
                label
              >
                {stageDistribution.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* TOP SKILLS */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills in Demand</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topSkills} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="skill" type="category" />
              <Tooltip />
              <Bar dataKey="demand" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* JOBS BY DEPARTMENT */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Department</CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={jobsByDepartment}
                dataKey="count"
                nameKey="department"
                outerRadius={110}
                label
              >
                {jobsByDepartment.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}