import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Award, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  getCandidateApplications,
  Application,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export const ApplicantProgress = () => {
  const { user } = useAuth();
  const candidateId = user?.id;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    if (!candidateId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCandidateApplications(candidateId);
        setApplications(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  // ===============================
  // COMPLETED FILTER (FIXED)
  // ===============================
  const completed = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.stage === "SHORTLISTED" ||
          a.stage === "REJECTED"
      ),
    [applications]
  );

  // ===============================
  // CALCULATIONS (SAFE)
  // ===============================
  const overallScore = useMemo(() => {
    if (completed.length === 0) return 0;
    const total = completed.reduce(
      (sum, a) => sum + (a.final_score ?? 0),
      0
    );
    return total / completed.length;
  }, [completed]);

  const avgMcq = useMemo(() => {
    if (completed.length === 0) return 0;
    const total = completed.reduce(
      (sum, a) => sum + (a.mcq_score ?? 0),
      0
    );
    return total / completed.length;
  }, [completed]);

  // ===============================
  // MONTHLY PROGRESS (SAFE)
  // ===============================
  const monthlyProgress = useMemo(() => {
    const monthlyMap: Record<string, number[]> = {};

    completed.forEach((app) => {
      if (!app.created_at) return;

      const month = new Date(app.created_at).toLocaleString(
        "default",
        { month: "short" }
      );

      if (!monthlyMap[month]) monthlyMap[month] = [];
      monthlyMap[month].push(app.final_score ?? 0);
    });

    return Object.entries(monthlyMap).map(([month, scores]) => ({
      month,
      score:
        scores.reduce((sum, s) => sum + s, 0) /
        scores.length,
    }));
  }, [completed]);

  const skillComparison = [
    {
      skill: "Technical",
      you: avgMcq,
      average: 70,
    },
  ];

  const achievements = [
    {
      title: "First Assessment",
      achieved: completed.length >= 1,
    },
    {
      title: "Top Performer",
      achieved: overallScore >= 85,
    },
    {
      title: "Consistent Growth",
      achieved: monthlyProgress.length >= 3,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">My Progress</h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <Target className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">
              {overallScore.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Overall Score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Award className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">
              {completed.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Assessments Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <TrendingUp className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">
              {avgMcq.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Avg MCQ Score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Score Trend */}
      {monthlyProgress.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyProgress}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>You vs Average</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillComparison}>
              <XAxis dataKey="skill" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="you" fill="hsl(var(--primary))" />
              <Bar dataKey="average" fill="hsl(var(--muted))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {achievements.map((a) => (
            <div
              key={a.title}
              className={`p-4 rounded-xl border ${
                a.achieved
                  ? "border-primary bg-primary/5"
                  : "border-border opacity-50"
              }`}
            >
              <p className="font-medium">{a.title}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};