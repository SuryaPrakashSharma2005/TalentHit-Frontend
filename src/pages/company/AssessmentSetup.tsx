import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getCompanyJobsBackend,
  getCompanyApplicants,
} from "@/lib/api";
import toast from "react-hot-toast";

interface Job {
  _id: string;
  title: string;
}

interface Applicant {
  stage: string;
}

interface AssessmentStats {
  jobId: string;
  title: string;
  pending: number;
  completed: number;
  started: number;
}

export default function AssessmentSetup() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AssessmentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "company") {
      setLoading(false);
      return;
    }

    fetchAssessmentStats();
  }, [user, authLoading]);

  const fetchAssessmentStats = async () => {
    try {
      setLoading(true);

      // ✅ Properly typed
      const jobs = (await getCompanyJobsBackend()) as Job[];

      const results = await Promise.all(
        jobs.map(async (job) => {
          const apps = (await getCompanyApplicants(
            job._id
          )) as Applicant[];

          const pending = apps.filter(
            (a) => a.stage === "ASSESSMENT_PENDING"
          ).length;

          const started = apps.filter(
            (a) => a.stage === "ASSESSMENT_STARTED"
          ).length;

          const completed = apps.filter(
            (a) =>
              a.stage === "ASSESSMENT_COMPLETED" ||
              a.stage === "SHORTLISTED" ||
              a.stage === "REJECTED"
          ).length;

          if (pending + started + completed === 0) return null;

          return {
            jobId: job._id,
            title: job.title,
            pending,
            started,
            completed,
          };
        })
      );

      setStats(
        results.filter(Boolean) as AssessmentStats[]
      );
    } catch (error) {
      toast.error("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading assessments...
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Assessment Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor candidate assessment activity
        </p>
      </div>

      {stats.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No assessment activity yet.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {stats.map((job) => (
          <Card
            key={job.jobId}
            className="hover:shadow-md transition cursor-pointer"
            onClick={() =>
              navigate(
                `/company/jobs/${job.jobId}/applicants`
              )
            }
          >
            <CardHeader>
              <CardTitle className="text-lg">
                {job.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-4 flex-wrap">
                <Badge className="bg-yellow-500/10 text-yellow-600">
                  Pending: {job.pending}
                </Badge>

                <Badge className="bg-blue-500/10 text-blue-600">
                  Started: {job.started}
                </Badge>

                <Badge className="bg-green-500/10 text-green-600">
                  Completed: {job.completed}
                </Badge>
              </div>

              <span className="text-primary font-medium text-sm">
                View Applicants →
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}