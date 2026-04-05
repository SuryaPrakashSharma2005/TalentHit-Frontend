import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ApplicantSidebar } from "@/components/layout/ApplicantSidebar";
import { ApplicantNavbar } from "@/components/layout/ApplicantNavbar";

export const ApplicantLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex">
        <ApplicantSidebar />
        <div className="ml-20 lg:ml-[280px] flex-1 transition-all duration-300 w-full">
          <ApplicantNavbar />
          <main className="">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};