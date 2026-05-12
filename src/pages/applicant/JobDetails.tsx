
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Building2,
  Briefcase,
  Copy,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  getJobDetails,
  applyToJob,
  JobDetails as JobDetailsType,
} from "@/lib/api";

import toast from "react-hot-toast";

export default function JobDetails() {

  const { jobId } = useParams();

  const [job, setJob] =
    useState<JobDetailsType | null>(null);

  const [loading, setLoading] = useState(true);

  const [applying, setApplying] = useState(false);

  // ======================================================
  // FETCH JOB
  // ======================================================

  useEffect(() => {

    const fetchJob = async () => {

      try {

        if (!jobId) return;

        const data = await getJobDetails(jobId);

        setJob(data);

      } catch (err: any) {

        toast.error(
          err.message || "Failed to load job"
        );

      } finally {

        setLoading(false);
      }
    };

    fetchJob();

  }, [jobId]);

  // ======================================================
  // APPLY
  // ======================================================

  const handleApply = async () => {

    try {

      if (!jobId) return;

      setApplying(true);

      await applyToJob(jobId);

      toast.success(
        "Application submitted successfully"
      );

    } catch (err: any) {

      toast.error(
        err.message || "Failed to apply"
      );

    } finally {

      setApplying(false);
    }
  };

  // ======================================================
  // COPY LINK
  // ======================================================

  const copyLink = async () => {

    if (!job?.share_url) return;

    await navigator.clipboard.writeText(
      job.share_url
    );

    toast.success("Job link copied");
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  if (!job) {
    return (
      <div className="text-center py-20">
        Job not found
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <Card>

        <CardContent className="p-8 space-y-6">

          {/* HEADER */}

          <div className="flex items-start justify-between gap-6 flex-wrap">

            <div className="flex gap-4">

              {/* LOGO */}

              {job.company_logo ? (

                <img
                  src={job.company_logo}
                  alt={job.company_name}
                  className="w-16 h-16 rounded-2xl object-cover"
                />

              ) : (

                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

              )}

              {/* TITLE */}

              <div>

                <h1 className="text-3xl font-bold">
                  {job.title}
                </h1>

                <p className="text-primary font-medium mt-2">
                  {job.company_name}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">

                  {job.domain && (
                    <span className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                      {job.domain}
                    </span>
                  )}

                  {job.department && (
                    <span className="px-3 py-1 bg-accent rounded-full text-sm">
                      {job.department}
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3">

              <Button
                variant="outline"
                onClick={copyLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>

              <Button
                onClick={handleApply}
                disabled={applying}
              >

                {applying ? (

                  <Loader2 className="w-4 h-4 animate-spin" />

                ) : (

                  <>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Apply Now
                  </>

                )}

              </Button>

            </div>

          </div>

          {/* STATS */}

          <div className="grid md:grid-cols-3 gap-4">

            <Card>
              <CardContent className="p-4">

                <p className="text-sm text-muted-foreground">
                  Experience
                </p>

                <p className="font-semibold text-lg mt-1">
                  {job.min_experience}+ years
                </p>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">

                <p className="text-sm text-muted-foreground">
                  Openings
                </p>

                <p className="font-semibold text-lg mt-1">
                  {job.openings}
                </p>

              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">

                <p className="text-sm text-muted-foreground">
                  Skills Required
                </p>

                <p className="font-semibold text-lg mt-1">
                  {job.required_skills.length}
                </p>

              </CardContent>
            </Card>

          </div>

          {/* SKILLS */}

          <div>

            <h2 className="text-xl font-semibold mb-3">
              Required Skills
            </h2>

            <div className="flex gap-2 flex-wrap">

              {job.required_skills.map((skill) => (

                <span
                  key={skill}
                  className="px-3 py-2 bg-accent rounded-lg text-sm"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>

          {/* DESCRIPTION */}

          {job.description && (

            <div>

              <h2 className="text-xl font-semibold mb-3">
                Job Description
              </h2>

              <p className="text-muted-foreground leading-7 whitespace-pre-wrap">
                {job.description}
              </p>

            </div>

          )}

          {/* COMPANY DESCRIPTION */}

          {job.company_description && (

            <div>

              <h2 className="text-xl font-semibold mb-3">
                About Company
              </h2>

              <p className="text-muted-foreground leading-7 whitespace-pre-wrap">
                {job.company_description}
              </p>

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}
