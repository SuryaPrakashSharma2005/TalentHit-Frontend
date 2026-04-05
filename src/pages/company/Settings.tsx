import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  getCompanySettings,
  updateCompanySettings,
} from "@/lib/api";

interface CompanySettings {
  name: string;
  email: string;
  website: string;
  notify_new_applications: boolean;
  notify_assessment_complete: boolean;
  notify_weekly_reports: boolean;
  auto_screen: boolean;
  require_assessment: boolean;
}

export default function Settings() {
  const { user, loading: authLoading } = useAuth();

  const [settings, setSettings] =
    useState<CompanySettings | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "company") {
      setLoading(false);
      return;
    }

    fetchSettings();
  }, [user, authLoading]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getCompanySettings(); // ✅ no companyId
      setSettings(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await updateCompanySettings(settings); // ✅ no companyId
      toast.success("Settings updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    key: keyof CompanySettings,
    value: any
  ) => {
    setSettings((prev) =>
      prev ? { ...prev, [key]: value } : prev
    );
  };

  if (!authLoading && (!user || user.role !== "company")) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Unauthorized access
      </div>
    );
  }

  if (authLoading || loading || !settings) {
    return (
      <div className="p-6 text-muted-foreground">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">
          Company Settings
        </h1>
        <p className="text-muted-foreground">
          Manage company profile and hiring preferences
        </p>
      </div>

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
          <CardDescription>
            Update company information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label>Company Name</Label>
            <Input
              value={settings.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Contact Email</Label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Website</Label>
            <Input
              value={settings.website}
              onChange={(e) =>
                updateField("website", e.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure update preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SwitchRow
            label="New Applications"
            checked={settings.notify_new_applications}
            onChange={(val) =>
              updateField("notify_new_applications", val)
            }
          />

          <Separator />

          <SwitchRow
            label="Assessment Completions"
            checked={settings.notify_assessment_complete}
            onChange={(val) =>
              updateField(
                "notify_assessment_complete",
                val
              )
            }
          />

          <Separator />

          <SwitchRow
            label="Weekly Reports"
            checked={settings.notify_weekly_reports}
            onChange={(val) =>
              updateField("notify_weekly_reports", val)
            }
          />
        </CardContent>
      </Card>

      {/* Hiring Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Preferences</CardTitle>
          <CardDescription>
            Customize workflow behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SwitchRow
            label="Auto-screen Candidates"
            checked={settings.auto_screen}
            onChange={(val) =>
              updateField("auto_screen", val)
            }
          />

          <Separator />

          <SwitchRow
            label="Require Assessments"
            checked={settings.require_assessment}
            onChange={(val) =>
              updateField("require_assessment", val)
            }
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <Label>{label}</Label>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
}