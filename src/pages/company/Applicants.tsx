import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ApplicantDetailModal } from "@/components/modals/ApplicantDetailModal";
import {
  getCompanyApplicants,
  updateApplicationStage,
  ApplicationStage,
} from "@/lib/api";
import toast from "react-hot-toast";

const stageColors: Record<string, string> = {
  SHORTLISTED: "bg-green-500/10 text-green-600",
  ASSESSMENT_PENDING: "bg-yellow-500/10 text-yellow-600",
  ASSESSMENT_STARTED: "bg-blue-500/10 text-blue-600",
  SKILL_REJECTED: "bg-red-500/10 text-red-600",
  REJECTED: "bg-red-500/10 text-red-600",
  INTERVIEW: "bg-purple-500/10 text-purple-600",
  OFFERED: "bg-indigo-500/10 text-indigo-600",
  HIRED: "bg-emerald-500/10 text-emerald-600",
};

interface Applicant {
  _id: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_id?: string;
  resume_score?: number;
  mcq_score?: number;
  coding_score?: number;
  final_score?: number;
  stage?: ApplicationStage;
}

export default function Applicants() {
  const { jobId } = useParams<{ jobId: string }>();

  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplicant, setSelectedApplicant] =
    useState<Applicant | null>(null);

  useEffect(() => {
    if (!jobId) return;
    fetchApplications(jobId);
  }, [jobId]);

  const fetchApplications = async (id: string) => {
    try {
      setLoading(true);
      const data = await getCompanyApplicants(id);
      setApplications((data as Applicant[]) || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (
    applicationId: string,
    newStage: ApplicationStage
  ) => {
    if (!jobId) return;

    try {
      await updateApplicationStage(jobId, applicationId, newStage);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, stage: newStage } : app
        )
      );

      toast.success("Stage updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update stage");
    }
  };

  const sortedApplications = useMemo(() => {
    return [...applications].sort(
      (a, b) => (b.final_score ?? 0) - (a.final_score ?? 0)
    );
  }, [applications]);

  const filteredApplicants = sortedApplications.filter((app) => {
    const searchTarget =
      `${app.candidate_name || ""} ${app.candidate_email || ""}`.toLowerCase();

    const matchesSearch = searchTarget.includes(
      searchQuery.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "all" || app.stage === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-6">Loading applicants...</div>;
  }

  if (!jobId) {
    return <div className="p-6 text-red-500">Invalid job ID</div>;
  }

  return (
    <div className="space-y-8 p-6">

      <div>
        <h1 className="text-3xl font-bold">Applicants</h1>
        <p className="text-muted-foreground">
          Ranked candidate pipeline for this job
        </p>
      </div>

      {/* Search + Filter */}

      <div className="flex flex-col md:flex-row gap-4">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="ASSESSMENT_PENDING">Assessment Pending</SelectItem>
            <SelectItem value="ASSESSMENT_STARTED">Assessment Started</SelectItem>
            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFERED">Offered</SelectItem>
            <SelectItem value="HIRED">Hired</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SKILL_REJECTED">Skill Rejected</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* Applicant List */}

      <Card>
        <CardHeader>
          <CardTitle>
            Applications ({filteredApplicants.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {filteredApplicants.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No applicants found
            </div>
          ) : (
            filteredApplicants.map((app, index) => (

              <div
                key={app._id}
                className="border rounded-xl p-6 hover:shadow-md transition"
              >

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  {/* Left */}

                  <div className="flex items-center gap-4">

                    <div className="text-2xl font-bold text-muted-foreground w-8">
                      #{index + 1}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {app.candidate_name?.[0] || "U"}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {app.candidate_name || "Unnamed"}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {app.candidate_email || app.candidate_id}
                      </p>
                    </div>

                    <Badge
                      className={
                        stageColors[app.stage || ""] ||
                        "bg-gray-200 text-gray-700"
                      }
                    >
                      {app.stage}
                    </Badge>

                  </div>

                  {/* Right */}

                  <div className="flex flex-col gap-3 w-full lg:w-[350px]">

                    <ScoreBar label="Resume" value={app.resume_score} />
                    <ScoreBar label="MCQ" value={app.mcq_score} />
                    <ScoreBar label="Coding" value={app.coding_score} />
                    <ScoreBar label="Final" value={app.final_score} />

                    <Select
                      value={app.stage}
                      onValueChange={(value) =>
                        handleStageChange(
                          app._id,
                          value as ApplicationStage
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update Stage" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="INTERVIEW">
                          Move to Interview
                        </SelectItem>

                        <SelectItem value="OFFERED">
                          Offer
                        </SelectItem>

                        <SelectItem value="HIRED">
                          Mark as Hired
                        </SelectItem>

                        <SelectItem value="REJECTED">
                          Reject
                        </SelectItem>
                      </SelectContent>

                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplicant(app)}
                    >
                      View Details
                    </Button>

                  </div>

                </div>

              </div>

            ))
          )}

        </CardContent>
      </Card>

      <ApplicantDetailModal
        open={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        applicant={selectedApplicant}
      />

    </div>
  );
}

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value ?? 0}%</span>
      </div>
      <Progress value={value ?? 0} className="h-2 mt-1" />
    </div>
  );
}