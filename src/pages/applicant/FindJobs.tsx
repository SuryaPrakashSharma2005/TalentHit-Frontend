import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  Bookmark,
  Loader2,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getRecommendedJobs,
  applyToJob,
  getCandidateApplications,
  RecommendedJob,
  extractErrorMessage,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

export const FindJobs = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  // ===============================
  // FETCH JOBS + APPLIED JOBS
  // ===============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [recommended, applications] = await Promise.all([
          getRecommendedJobs(),
          user?.id ? getCandidateApplications(user.id) : [],
        ]);

        setJobs(recommended || []);

        const appliedSet = new Set<string>();

        (applications || []).forEach((app: any) => {
          if (app.job_id) {
            appliedSet.add(app.job_id);
          }
        });

        setAppliedJobs(appliedSet);
      } catch (err: any) {
        toast.error(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // ===============================
  // SAVE JOB
  // ===============================
  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  // ===============================
  // APPLY
  // ===============================
  const handleApply = async (jobId: string) => {
    if (!user || user.role !== "applicant") {
      toast.error("Login required as applicant");
      return;
    }

    if (appliedJobs.has(jobId)) {
      toast.error("Already applied to this job");
      return;
    }

    try {
      setApplyingJobId(jobId);

      await applyToJob(jobId);

      toast.success("Application submitted successfully!");

      setAppliedJobs((prev) => new Set(prev).add(jobId));
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    } finally {
      setApplyingJobId(null);
    }
  };

  // ===============================
  // FILTER
  // ===============================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  // ===============================
  // UI
  // ===============================
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Find Jobs</h1>
      </motion.div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl"
        />
      </div>

      {/* JOB LIST */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.has(job._id);
            const isRecommended =
              (job.match_percentage ?? 0) >= 60;

            return (
              <Card key={job._id}>
                <CardContent className="p-5 flex justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {job.title}
                        </h3>

                        {isRecommended && (
                          <span className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded">
                            <Star className="w-3 h-3" />
                            Recommended
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground">
                        Experience: {job.min_experience ?? 0} yrs
                      </p>

                      <div className="flex gap-2 mt-2 flex-wrap">
                        {(job.required_skills || []).map(
                          (skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-accent rounded text-xs"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {/* SAVE */}
                    <button
                      onClick={() => toggleSave(job._id)}
                      className={`p-2 rounded-lg transition ${
                        savedJobs.includes(job._id)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Bookmark
                        className={
                          savedJobs.includes(job._id)
                            ? "fill-current"
                            : ""
                        }
                      />
                    </button>

                    {/* APPLY */}
                    <Button
                      disabled={
                        applyingJobId === job._id || isApplied
                      }
                      onClick={() => handleApply(job._id)}
                    >
                      {applyingJobId === job._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isApplied ? (
                        "Applied"
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="text-muted-foreground text-center py-6">
              No jobs found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};