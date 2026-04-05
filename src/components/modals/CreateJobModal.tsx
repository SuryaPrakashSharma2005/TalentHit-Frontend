import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { createJob } from "@/lib/api";

// ===============================
// DOMAIN STRUCTURE
// ===============================
const domainMap: Record<string, any> = {
  Engineering: {
    Software: [
      "Web Development",
      "Backend Engineering",
      "Cyber Security",
      "Networking",
      "Database (DBMS)",
      "Operating System",
      "File Processing",
      "System Design"
    ],

    Mechanical: [
      "Design Engineering",
      "Thermodynamics",
      "Manufacturing",
      "Fluid Mechanics"
    ],

    Electrical: [
      "Power Systems",
      "Control Systems",
      "Embedded Systems",
      "Circuit Design"
    ],

    Civil: [
      "Structural Engineering",
      "Geotechnical Engineering",
      "Construction Management",
      "Transportation Engineering"
    ]
  },

  IT: {
    Software: [
      "Web Development",
      "Backend Engineering",
      "Cyber Security",
      "Networking",
      "Database (DBMS)"
    ],

    Infrastructure: [
      "Cloud Computing",
      "DevOps",
      "System Administration"
    ]
  }
};
interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateJobModal({ open, onClose }: CreateJobModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");

  const [domain, setDomain] = useState("");
  const [subDomain, setSubDomain] = useState("");

  const [codingLanguage, setCodingLanguage] = useState("");
  const [jobDuration, setJobDuration] = useState("30");

  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [experienceMin, setExperienceMin] = useState("0");
  const [experienceMax, setExperienceMax] = useState("3");

  const [positions, setPositions] = useState(1);
  const [loading, setLoading] = useState(false);

  const isSoftwareDomain = domain === "Software";

  const handleAddSkill = () => {
    if (newSkill.trim() && !skillTags.includes(newSkill.trim())) {
      setSkillTags([...skillTags, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillTags(skillTags.filter((s) => s !== skill));
  };

  const resetForm = () => {
    setTitle("");
    setDepartment("");
    setDomain("");
    setSubDomain("");
    setCodingLanguage("");
    setJobDuration("30");
    setSkillTags([]);
    setExperienceMin("0");
    setExperienceMax("3");
    setPositions(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Job title is required");
      return;
    }

    if (!department) {
      toast.error("Select department");
      return;
    }

    if (!domain) {
      toast.error("Select domain");
      return;
    }

    if (!subDomain) {
      toast.error("Select specialization");
      return;
    }

    if (skillTags.length === 0) {
      toast.error("Add at least one skill");
      return;
    }

    if (isSoftwareDomain && !codingLanguage) {
      toast.error("Select coding language");
      return;
    }

    try {
      setLoading(true);

      await createJob({
        title,
        required_skills: skillTags,
        min_experience: Number(experienceMin),
        department,
        domain,
        sub_domain: subDomain,
        openings: positions,
        coding_language: isSoftwareDomain ? codingLanguage : undefined,
        job_duration_days: Number(jobDuration),
      });

      toast.success("Job posting created successfully!");

      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job Posting</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Job Title */}
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Backend Developer"
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label>Department</Label>

            <Select
              value={department}
              onValueChange={(value) => {
                setDepartment(value);
                setDomain("");
                setSubDomain("");
                setCodingLanguage("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Domain */}
          {domainMap[department] && (
            <div className="space-y-2">
              <Label>Domain</Label>

              <Select
                value={domain}
                onValueChange={(value) => {
                  setDomain(value);
                  setSubDomain("");
                  setCodingLanguage("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>

                <SelectContent>
                  {Object.keys(domainMap[department]).map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Sub Domain */}
          {domain && domainMap[department]?.[domain] && (
            <div className="space-y-2">
              <Label>Specialization</Label>

              <Select value={subDomain} onValueChange={setSubDomain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>

                <SelectContent>
                  {domainMap[department][domain].map((sub: string) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Coding Language (ONLY SOFTWARE) */}
          {isSoftwareDomain && (
            <div className="space-y-2">
              <Label>Coding Assessment Language</Label>

              <Select
                value={codingLanguage}
                onValueChange={setCodingLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skill Tags</Label>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />

              <Button type="button" onClick={handleAddSkill} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {skillTags.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Experience</Label>
              <Input
                type="number"
                value={experienceMin}
                onChange={(e) => setExperienceMin(e.target.value)}
              />
            </div>

            <div>
              <Label>Max Experience</Label>
              <Input
                type="number"
                value={experienceMax}
                onChange={(e) => setExperienceMax(e.target.value)}
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label>Job Duration (Days)</Label>
            <Input
              type="number"
              value={jobDuration}
              onChange={(e) => setJobDuration(e.target.value)}
            />
          </div>

          {/* Positions */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() => setPositions(Math.max(1, positions - 1))}
            >
              <Minus />
            </Button>

            <span>{positions}</span>

            <Button
              type="button"
              onClick={() => setPositions(positions + 1)}
            >
              <Plus />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}