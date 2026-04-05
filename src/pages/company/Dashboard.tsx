import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Users,
  UserCheck,
  AlertTriangle,
  Plus,
  Eye,
  FileText,
  TrendingUp,
  Award,
} from "lucide-react";
import { CreateJobModal } from "@/components/modals/CreateJobModal";
import { useNavigate } from "react-router-dom";
import { getCompanyAnalyticsBackend } from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "company") {
      setLoading(false);
      return;
    }

    fetchDashboard();
  }, [user, authLoading]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getCompanyAnalyticsBackend();
      console.log("Dashboard analytics:", data);
      setStats(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (!user || user.role !== "company") {
    return (
      <div className="p-6 text-red-500 font-medium">
        Unauthorized access
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-muted-foreground">
        No dashboard data available yet.
      </div>
    );
  }

  // ===============================
  // FIXED METRICS FROM stage_distribution
  // ===============================

  const stage = stats.stage_distribution || {};

  const shortlisted = stage.SHORTLISTED ?? 0;
  const skillRejected = stage.SKILL_REJECTED ?? 0;

  const conversionRate =
    stats.total_applications > 0
      ? (shortlisted / stats.total_applications) * 100
      : 0;

  const avgScore = stats.average_final_score ?? 0;

  const metrics = [
    {
      label: "Total Jobs",
      value: stats.total_jobs ?? 0,
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      label: "Total Applications",
      value: stats.total_applications ?? 0,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Shortlisted",
      value: shortlisted,
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      label: "Skill Rejected",
      value: skillRejected,
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-10 p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Company Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-powered hiring insights & pipeline overview
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setCreateJobOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/company/jobs")}
          >
            <Eye className="mr-2 h-4 w-4" />
            Manage Jobs
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/company/reports")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <MetricCard
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
            />
          </motion.div>
        ))}
      </div>

      {/* Advanced Insights */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Conversion Rate */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Conversion Rate
              </h2>
            </div>

            <div className="text-3xl font-bold">
              {conversionRate.toFixed(1)}%
            </div>

            <Progress
              value={conversionRate}
              className="h-2"
            />

            <p className="text-sm text-muted-foreground">
              Percentage of applicants shortlisted
            </p>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">
                Average Candidate Score
              </h2>
            </div>

            <div className="text-3xl font-bold">
              {avgScore.toFixed(1)}%
            </div>

            <Progress
              value={avgScore}
              className="h-2"
            />

            <p className="text-sm text-muted-foreground">
              Overall performance across all applicants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <CreateJobModal
        open={createJobOpen}
        onClose={() => {
          setCreateJobOpen(false);
          fetchDashboard();
        }}
      />
    </div>
  );
}

