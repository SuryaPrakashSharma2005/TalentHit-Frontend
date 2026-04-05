import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  ClipboardCheck,
  Calendar,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  getCandidateApplications,
  getActiveJobs,
  Application,
  Job,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const ApplicantDashboard = () => {
  const { user } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const apps = await getCandidateApplications(user.id);
          setApplications(apps);
        }

        const activeJobs = await getActiveJobs();
        setJobs(activeJobs);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // ===============================
  // METRICS
  // ===============================

  const activeApplications = applications.filter(
    (a) => a.stage !== "REJECTED"
  ).length;

  const completedAssessments = applications.filter(
    (a) =>
      a.stage === "SHORTLISTED" ||
      a.stage === "REJECTED"
  ).length;

  const pendingAssessments = applications.filter(
    (a) => a.stage === "ASSESSMENT_PENDING"
  ).length;

  const shortlisted = applications.filter(
    (a) => a.stage === "SHORTLISTED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-primary rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="opacity-80">
          You have {pendingAssessments} pending assessments
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <Briefcase />
            <div>
              <p className="text-xl font-bold">{activeApplications}</p>
              <p className="text-sm text-muted-foreground">
                Active Applications
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <ClipboardCheck />
            <div>
              <p className="text-xl font-bold">{completedAssessments}</p>
              <p className="text-sm text-muted-foreground">
                Assessments Completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <Calendar />
            <div>
              <p className="text-xl font-bold">{shortlisted}</p>
              <p className="text-sm text-muted-foreground">Shortlisted</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <TrendingUp />
            <div>
              <p className="text-xl font-bold">{jobs.length}</p>
              <p className="text-sm text-muted-foreground">
                Open Jobs Available
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Link to="/applicant/applications" className="text-primary text-sm">
            View All <ChevronRight className="inline w-4 h-4" />
          </Link>
        </CardHeader>

        <CardContent className="space-y-3">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applications yet
            </p>
          ) : (
            applications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="flex justify-between p-3 bg-accent/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {app.job_title || "Job"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Stage: {app.stage}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {app.skill_match_percentage ?? 0}% match
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Jobs</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-4">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job._id}
              className="border rounded-lg p-4 hover:border-primary transition"
            >
              <h4 className="font-semibold">{job.title}</h4>

              <p className="text-sm text-muted-foreground">
                Required: {job.required_skills.join(", ")}
              </p>

              <p className="text-sm mt-2">
                {job.openings} openings
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};