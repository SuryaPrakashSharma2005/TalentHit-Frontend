import { useEffect, useState } from "react";
import { Edit, Save, Camera, Loader2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getCurrentCandidateProfile,
  getCandidateApplications,
  updateMyProfile,
  uploadResume,
  CandidateProfile,
  Application,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export const ApplicantProfile = () => {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    experience_years: 0,
    education: "",
    skills: "",
    avatar: "",
  });

  // ===============================
  // FETCH PROFILE DATA
  // ===============================
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "applicant") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, appData] = await Promise.all([
          getCurrentCandidateProfile(),
          getCandidateApplications(user.id),
        ]);

        setProfile(profileData);
        setApplications(appData);

        setFormData({
          name: profileData.name || "",
          experience_years: profileData.experience_years || 0,
          education:
            typeof profileData.education === "string"
              ? profileData.education
              : profileData.education?.degree || "",
          skills: profileData.skills?.join(", ") || "",
          avatar: profileData.avatar || "",
        });

        setImagePreview(profileData.avatar || null);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // ===============================
  // HANDLE AVATAR UPLOAD
  // ===============================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData({ ...formData, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // ===============================
  // HANDLE RESUME UPLOAD (JWT BASED)
  // ===============================
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Select a resume file first");
      return;
    }

    try {
      setUploading(true);

      await uploadResume(resumeFile);

      toast.success("Resume uploaded & skills extracted");

      const updated = await getCurrentCandidateProfile();
      setProfile(updated);

      setFormData((prev) => ({
        ...prev,
        skills: updated.skills?.join(", ") || "",
      }));
    } catch (err: any) {
      toast.error(err?.message || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // HANDLE PROFILE UPDATE
  // ===============================
  const handleUpdate = async () => {
    try {
      setSaving(true);

      await updateMyProfile({
        name: formData.name,
        experience_years: Number(formData.experience_years),
        education: formData.education,
        avatar: formData.avatar,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
      });

      toast.success("Profile updated successfully");
      setEditMode(false);

      const updated = await getCurrentCandidateProfile();
      setProfile(updated);
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-6">Profile not found.</div>;
  }

  const completedApps = applications.filter(
    (a) =>
      a.stage === "ASSESSMENT_COMPLETED" ||
      a.stage === "SHORTLISTED"
  );

  const profileCompletion = Math.min(
    100,
    (profile.skills?.length > 0 ? 30 : 0) +
      (profile.experience_years > 0 ? 30 : 0) +
      (profile.education ? 20 : 0) +
      (completedApps.length > 0 ? 20 : 0)
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and professional details
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => (editMode ? handleUpdate() : setEditMode(true))}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : editMode ? (
            <Save className="w-4 h-4 mr-2" />
          ) : (
            <Edit className="w-4 h-4 mr-2" />
          )}
          {editMode ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* PROFILE COMPLETION */}
      <Card>
        <CardContent className="p-5">
          <div className="flex justify-between">
            <span>Profile Completion</span>
            <span className="font-bold">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* RESUME SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setResumeFile(e.target.files?.[0] || null)
            }
            className="border p-2 rounded w-full"
          />

          <Button
            onClick={handleResumeUpload}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {uploading ? "Uploading..." : "Upload Resume"}
          </Button>
        </CardContent>
      </Card>

      {/* PERSONAL INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border shadow">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-2xl font-bold">
                  {profile.name?.[0]}
                </div>
              )}
            </div>

            {editMode && (
              <label className="cursor-pointer text-sm text-primary flex items-center gap-2">
                <Camera size={16} />
                Change Photo
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            {editMode ? (
              <>
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <Input
                  type="number"
                  placeholder="Years of Experience"
                  value={formData.experience_years}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience_years: Number(e.target.value),
                    })
                  }
                />

                <Input
                  placeholder="Education"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                />

                <Input
                  placeholder="Skills (comma separated)"
                  value={formData.skills}
                  onChange={(e) =>
                    setFormData({ ...formData, skills: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
                <p>{profile.experience_years} years experience</p>

                <p>
                  {typeof profile.education === "string"
                    ? profile.education
                    : profile.education?.degree}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};