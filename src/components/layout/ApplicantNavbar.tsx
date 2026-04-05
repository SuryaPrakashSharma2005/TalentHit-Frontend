import { Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentCandidateProfile } from "@/lib/api";

export const ApplicantNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user: authUser } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!authUser || authUser.role !== "applicant") {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const userProfile = await getCurrentCandidateProfile();
        setProfile(userProfile);
      } catch (err) {
        console.error("Navbar profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const avatarInitial = profile?.name?.[0]?.toUpperCase() || "U";

  // ✅ SAFE EDUCATION DISPLAY
  const educationText =
    typeof profile?.education === "object"
      ? profile?.education?.degree || ""
      : profile?.education || "";

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">

      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            className="w-full pl-10 pr-4 py-2 bg-accent/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-xl transition-colors"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-accent rounded-xl transition-colors relative"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No notifications yet
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">

          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              {loading ? "Loading..." : profile?.name || "User"}
            </p>

            {/* ✅ SAFE EDUCATION RENDER */}
            <p className="text-xs text-muted-foreground">
              {educationText}
            </p>
          </div>

          <div className="relative group">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-border shadow-sm ring-2 ring-transparent group-hover:ring-primary transition-all duration-200">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
                    {avatarInitial}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};