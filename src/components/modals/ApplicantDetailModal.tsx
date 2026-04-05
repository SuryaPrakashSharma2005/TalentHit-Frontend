import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, TrendingUp, User, Phone, MapPin } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface Applicant {
  _id: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_id?: string;
  stage?: string;
  resume_score?: number;
  mcq_score?: number;
  coding_score?: number;
  final_score?: number;
  skill_match_percentage?: number;
  created_at?: string;
  skills?: string[];
  phone?: string;
  location?: string;
}

interface ApplicantDetailModalProps {
  open: boolean;
  onClose: () => void;
  applicant: Applicant | null;
}

export function ApplicantDetailModal({
  open,
  onClose,
  applicant,
}: ApplicantDetailModalProps) {
  if (!applicant) return null;

  const statusMap: Record<string, string> = {
    SHORTLISTED: "Shortlisted",
    REJECTED: "Rejected",
    INTERVIEW: "Interview",
    OFFERED: "Offered",
    HIRED: "Hired",
  };

  const status = statusMap[applicant.stage || ""] || "In Review";

  const radarData = [
    { metric: "Resume", value: applicant.resume_score ?? 0 },
    { metric: "MCQ", value: applicant.mcq_score ?? 0 },
    { metric: "Coding", value: applicant.coding_score ?? 0 },
    { metric: "Skill Match", value: applicant.skill_match_percentage ?? 0 },
    { metric: "Final Score", value: applicant.final_score ?? 0 },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-semibold">
            Applicant Detailed Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {applicant.candidate_name || "Candidate"}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Applicant Profile
              </p>
            </div>

            <Badge className="text-sm px-3 py-1">
              {status}
            </Badge>
          </div>

          {/* CONTACT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <InfoCard
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={applicant.candidate_email || "Not available"}
            />

            <InfoCard
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={applicant.phone || "Not available"}
            />

            <InfoCard
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={applicant.location || "Not available"}
            />

            <InfoCard
              icon={<Calendar className="h-4 w-4" />}
              label="Applied On"
              value={
                applicant.created_at
                  ? new Date(applicant.created_at).toLocaleDateString()
                  : "N/A"
              }
            />

          </div>

          <Separator />

          {/* PERFORMANCE + SKILLS */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* PERFORMANCE METRICS */}
            <div className="space-y-4 bg-muted/30 p-5 rounded-xl">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Metrics
              </h4>

              <div className="space-y-3">
                <Metric label="Resume Score" value={applicant.resume_score} />
                <Metric label="MCQ Score" value={applicant.mcq_score} />
                <Metric label="Coding Score" value={applicant.coding_score} />
                <Metric label="Final Score" value={applicant.final_score} />
                <Metric
                  label="Skill Match"
                  value={applicant.skill_match_percentage}
                />
              </div>
            </div>

            {/* SKILLS */}
            <div className="space-y-4 bg-muted/30 p-5 rounded-xl">
              <h4 className="font-semibold">
                Applicant Skills
              </h4>

              <div className="flex flex-wrap gap-2">
                {applicant.skills && applicant.skills.length > 0 ? (
                  applicant.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No skills available
                  </p>
                )}
              </div>
            </div>

          </div>

          <Separator />

          {/* RADAR CHART */}
          <div className="space-y-4">

            <h4 className="font-semibold">
              Performance Radar Overview
            </h4>

            <div className="w-full h-[320px] bg-muted/30 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value?: number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-base">
        {value ?? 0}%
      </span>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-muted/30 space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium break-words">
        {value}
      </p>
    </div>
  );
}