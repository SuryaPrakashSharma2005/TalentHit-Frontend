import {
  LayoutDashboard,
  Briefcase,
  ClipboardCheck,
  Users,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const companyMenuItems = [
  { title: "Dashboard", url: "/company", icon: LayoutDashboard },
  { title: "Job Management", url: "/company/jobs", icon: Briefcase },
  { title: "Assessment Setup", url: "/company/assessments", icon: ClipboardCheck },
  { title: "Analytics", url: "/company/analytics", icon: BarChart3 },
  { title: "Reports", url: "/company/reports", icon: FileText },
  { title: "Settings", url: "/company/settings", icon: Settings },
];

export function CompanySidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-3 py-4">
          <h1
            className={`font-bold text-xl text-primary transition-opacity ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            TalentHit
          </h1>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {companyMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}