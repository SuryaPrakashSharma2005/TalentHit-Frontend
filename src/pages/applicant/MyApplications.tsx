import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCandidateApplications,
  Application,
} from "@/lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const stageColors: Record<string, string> = {
  ASSESSMENT_PENDING: "bg-yellow-500/10 text-yellow-600",
  ASSESSMENT_STARTED: "bg-blue-500/10 text-blue-600",
  ASSESSMENT_COMPLETED: "bg-indigo-500/10 text-indigo-600",
  CODING_PENDING: "bg-indigo-500/10 text-indigo-600",
  SHORTLISTED: "bg-green-500/10 text-green-600",
  REJECTED: "bg-red-500/10 text-red-600",
  SKILL_REJECTED: "bg-red-500/10 text-red-600",
  INTERVIEW: "bg-purple-500/10 text-purple-600",
  OFFERED: "bg-indigo-500/10 text-indigo-600",
  HIRED: "bg-emerald-500/10 text-emerald-600",
};

export const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const candidateId = user?.id;

  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidateId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const apps = await getCandidateApplications(candidateId);
        setApplications(apps || []);
      } catch {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  const filteredApps = useMemo(() => {
    return applications.filter((app) =>
      (app.job_title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [applications, searchQuery]);

  return (
    <div className="space-y-6">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">My Applications</h1>
      </motion.div>

      {/* SEARCH */}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl"
        />
      </div>

      {/* APPLICATION LIST */}

      <div className="space-y-4">

        {loading ? (
          <div className="text-muted-foreground">
            Loading applications...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-muted-foreground">
            No applications found.
          </div>
        ) : (
          filteredApps.map((app, index) => (

            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >

              <Card>
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* LEFT SIDE */}

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

                    {/* SKILL MATCH */}

                    {app.stage === "ASSESSMENT_PENDING" && (
                      <p className="text-sm text-muted-foreground">
                        Skill Match: {app.skill_match_percentage ?? 0}%
                      </p>
                    )}

                    {/* MCQ SCORE */}

                    {(app.stage === "ASSESSMENT_COMPLETED" ||
                      app.stage === "CODING_PENDING") && (
                      <p className="text-sm text-muted-foreground">
                        MCQ Score: {app.mcq_score ?? 0}%
                      </p>
                    )}

                    {/* FINAL SCORE */}

                    {(app.stage === "SHORTLISTED" ||
                      app.stage === "INTERVIEW" ||
                      app.stage === "OFFERED" ||
                      app.stage === "HIRED") && (
                      <p className="text-sm text-muted-foreground">
                        Final Score: {app.final_score ?? 0}%
                      </p>
                    )}

                  </div>

                  {/* RIGHT SIDE ACTIONS */}

                  <div className="flex gap-3">

                    {/* START MCQ */}

                    {app.stage === "ASSESSMENT_PENDING" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/applicant/test/${app.job_id}/${app._id}`
                          )
                        }
                      >
                        Start MCQ Test
                      </Button>
                    )}

                    {/* RESUME MCQ */}

                    {app.stage === "ASSESSMENT_STARTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/applicant/test/${app.job_id}/${app._id}`
                          )
                        }
                      >
                        Resume MCQ
                      </Button>
                    )}

                    {/* START CODING */}

                    {(app.stage === "ASSESSMENT_COMPLETED" ||
                      app.stage === "CODING_PENDING") && (
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() =>
                          navigate(`/coding/${app._id}`)
                        }
                      >
                        Start Coding Test
                      </Button>
                    )}

                  </div>

                </CardContent>
              </Card>

            </motion.div>
          ))
        )}

      </div>

    </div>
  );
};