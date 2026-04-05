import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  getCandidateApplications,
  Application,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const stageColors: Record<string, string> = {
  ASSESSMENT_PENDING: "bg-yellow-500/10 text-yellow-600",
  ASSESSMENT_STARTED: "bg-blue-500/10 text-blue-600",
  SHORTLISTED: "bg-green-500/10 text-green-600",
  REJECTED: "bg-red-500/10 text-red-600",
};

export const ApplicantAssessments = () => {
  const { user } = useAuth();
  const candidateId = user?.id;
  const navigate = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    if (!candidateId) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await getCandidateApplications(candidateId);
        setApplications(data || []);
      } catch {
        toast.error("Failed to load assessments");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [candidateId]);

  // ===============================
  // FILTERS
  // ===============================
  const pending = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.stage === "ASSESSMENT_PENDING" ||
          a.stage === "ASSESSMENT_STARTED"
      ),
    [applications]
  );

  const completed = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.stage === "SHORTLISTED" ||
          a.stage === "REJECTED"
      ),
    [applications]
  );

  const avgScore = useMemo(() => {
    if (completed.length === 0) return 0;

    const total = completed.reduce(
      (sum, a) => sum + (a.mcq_score ?? 0),
      0
    );

    return total / completed.length;
  }, [completed]);

  const handleStart = (app: Application) => {
    navigate(`/applicant/test/${app.job_id}/${app._id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">My Assessments</h1>
        <p className="text-muted-foreground">
          Complete assessments to showcase your skills
        </p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{pending.length}</p>
            <p className="text-sm text-muted-foreground">
              Pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {completed.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">
              {avgScore.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              Avg MCQ Score
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="pending" className="space-y-4">
          {pending.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-500" />
                No pending assessments
              </CardContent>
            </Card>
          ) : (
            pending.map((app) => (
              <Card key={app._id}>
                <CardContent className="p-5 flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {app.job_title || "Untitled Job"}
                    </h3>

                    <Badge
                      className={
                        stageColors[app.stage || ""] ||
                        "bg-gray-200 text-gray-700"
                      }
                    >
                      {app.stage}
                    </Badge>

                    <p className="text-sm text-muted-foreground">
                      Resume Score: {app.resume_score ?? 0}%
                    </p>
                  </div>

                  <button
                    onClick={() => handleStart(app)}
                    className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition"
                  >
                    {app.stage === "ASSESSMENT_STARTED"
                      ? "Resume Test"
                      : "Start Test"}
                  </button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* COMPLETED */}
        <TabsContent value="completed" className="space-y-4">
          {completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No completed assessments yet.
              </CardContent>
            </Card>
          ) : (
            completed.map((app) => (
              <Card key={app._id}>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg">
                    {app.job_title || "Untitled Job"}
                  </h3>

                  <Badge
                    className={
                      stageColors[app.stage || ""] ||
                      "bg-gray-200 text-gray-700"
                    }
                  >
                    {app.stage}
                  </Badge>

                  <p className="text-sm text-muted-foreground">
                    MCQ Score: {app.mcq_score ?? 0}%
                  </p>

                  <Progress
                    value={app.mcq_score ?? 0}
                    className="h-2"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};