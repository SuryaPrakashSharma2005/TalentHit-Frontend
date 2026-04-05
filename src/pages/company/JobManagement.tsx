import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, Tag, Eye } from "lucide-react";
import { CreateJobModal } from "@/components/modals/CreateJobModal";
import toast from "react-hot-toast";
import { getCompanyJobsBackend, closeJob,} from "@/lib/api";

interface Job {
  _id: string;
  title: string;
  required_skills: string[];
  openings: number;
  status: string;
  created_at: string;
}

export default function JobManagement() {
  const { user, loading: authLoading } = useAuth();
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "company") {
      setLoading(false);
      return;
    }

    fetchJobs();
  }, [user, authLoading]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      // ✅ No companyId needed anymore
      const data = await getCompanyJobsBackend();
      setJobs(data as Job[]);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    try {
      await closeJob(jobId);
      toast.success("Job closed successfully");
      fetchJobs(); // ✅ no companyId
    } catch (error: any) {
      toast.error(error.message || "Failed to close job");
    }
  };

  if (!authLoading && (!user || user.role !== "company")) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Unauthorized access
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">
            Manage and track all your job postings
          </p>
        </div>

        <Button onClick={() => setCreateJobOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>

      {/* Loading */}
      {authLoading || loading ? (
        <div className="text-muted-foreground">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No jobs posted yet.
            <div className="mt-4">
              <Button onClick={() => setCreateJobOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Job
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job._id} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">
                    {job.title}
                  </CardTitle>

                  <Badge
                    variant={job.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {job.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">

                {/* Meta */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {job.openings} openings
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Posted{" "}
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Skills */}
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/company/jobs/${job._id}/applicants`)
                    }
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Applicants
                  </Button>

                  {job.status === "ACTIVE" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCloseJob(job._id)}
                    >
                      Close Job
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateJobModal
        open={createJobOpen}
        onClose={() => {
          setCreateJobOpen(false);
          fetchJobs(); // ✅ no companyId
        }}
      />
    </div>
  );
}