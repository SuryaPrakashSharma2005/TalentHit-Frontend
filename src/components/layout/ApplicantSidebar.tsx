import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardCheck,
  Calendar,
  TrendingUp,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/applicant" },
  { icon: Search, label: "Find Jobs", path: "/applicant/jobs" },
  { icon: Briefcase, label: "My Applications", path: "/applicant/applications" },
  { icon: ClipboardCheck, label: "Assessments", path: "/applicant/assessments" },
  { icon: Calendar, label: "Interviews", path: "/applicant/interviews" },
  { icon: TrendingUp, label: "My Progress", path: "/applicant/progress" },
  { icon: User, label: "Profile", path: "/applicant/profile" },
  { icon: Settings, label: "Settings", path: "/applicant/settings" },
];

export const ApplicantSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SS</span>
              </div>
              <span className="font-semibold text-lg text-foreground">TalentHit</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", collapsed && "mx-auto")} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
    </motion.aside>
  );
};
