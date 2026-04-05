import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCandidateSettings,
  updateCandidateSettings,
  getCurrentCandidateProfile,
  updateMyProfile,
  CandidateSettings,
} from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export const ApplicantSettings = () => {
  const { user } = useAuth();
  const candidateId = user?.id;

  const [data, setData] = useState<CandidateSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =================================================
  // FETCH SETTINGS + PROFILE
  // =================================================

  useEffect(() => {
    if (!candidateId) return;

    const fetchSettings = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          getCandidateSettings(candidateId),
          getCurrentCandidateProfile(),
        ]);

        setData({
          ...settingsRes,
          name: profileRes.name || "",
          email: profileRes.email || "",
          phone: profileRes.phone || "",
          location: profileRes.location || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [candidateId]);

  // =================================================
  // SAVE CHANGES
  // =================================================

  const saveChanges = async () => {
    if (!candidateId || !data) return;

    try {
      setSaving(true);

      await Promise.all([
        updateCandidateSettings(candidateId, data),
        updateMyProfile({
          name: data.name,
          email: data.email,
          phone: data.phone,
          location: data.location,
        }),
      ]);

      toast.success("Settings updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // =================================================
  // LOADING
  // =================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) return <div>No settings found</div>;

  // =================================================
  // UI
  // =================================================

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, notifications, and privacy preferences.
        </p>
      </motion.div>

      {/* PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input
            placeholder="Full Name"
            value={data.name || ""}
            onChange={(e) =>
              setData({ ...data, name: e.target.value })
            }
          />

          <Input
            placeholder="Email"
            value={data.email || ""}
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />

          <Input
            placeholder="Phone"
            value={data.phone || ""}
            onChange={(e) =>
              setData({ ...data, phone: e.target.value })
            }
          />

          <Input
            placeholder="Location"
            value={data.location || ""}
            onChange={(e) =>
              setData({ ...data, location: e.target.value })
            }
          />

        </CardContent>
      </Card>

      {/* NOTIFICATIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {Object.entries(data.settings?.notifications || {}).map(
            ([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium capitalize">{key}</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about {key}
                  </p>
                </div>

                <Switch
                  checked={value as boolean}
                  onCheckedChange={(checked) =>
                    setData({
                      ...data,
                      settings: {
                        ...data.settings,
                        notifications: {
                          ...data.settings.notifications,
                          [key]: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* PRIVACY */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Controls</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {Object.entries(data.settings?.privacy || {}).map(
            ([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium capitalize">{key}</p>
                  <p className="text-sm text-muted-foreground">
                    Control visibility of {key}
                  </p>
                </div>

                <Switch
                  checked={value as boolean}
                  onCheckedChange={(checked) =>
                    setData({
                      ...data,
                      settings: {
                        ...data.settings,
                        privacy: {
                          ...data.settings.privacy,
                          [key]: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* SECURITY */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">
            Enable Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      {/* DANGER */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button variant="destructive">
            Deactivate Account
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={saveChanges} disabled={saving}>
          {saving && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save Changes
        </Button>
      </div>

    </div>
  );
};

