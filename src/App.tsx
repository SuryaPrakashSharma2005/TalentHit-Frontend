import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Auth from "./pages/auth/Auth";
import { CompanySidebar } from "@/components/layout/CompanySidebar";
import { Navbar } from "@/components/layout/Navbar";

/* ---------------- Pages ---------------- */

import Index from "./pages/Index";
import Dashboard from "./pages/company/Dashboard";
import JobManagement from "./pages/company/JobManagement";
import AssessmentSetup from "./pages/company/AssessmentSetup";
import Applicants from "./pages/company/Applicants";
import Analytics from "./pages/company/Analytics";
import Reports from "./pages/company/Reports";
import Settings from "./pages/company/Settings";
import NotFound from "./pages/NotFound";

/* ---------------- Applicant Pages ---------------- */

import { ApplicantLayout } from "./layouts/ApplicantLayout";
import { ApplicantDashboard } from "./pages/applicant/ApplicantDashboard";
import { FindJobs } from "./pages/applicant/FindJobs";
import { MyApplications } from "./pages/applicant/MyApplications";
import { ApplicantAssessments } from "./pages/applicant/ApplicantAssessments";
import { ApplicantInterviews } from "./pages/applicant/ApplicantInterviews";
import { ApplicantProgress } from "./pages/applicant/ApplicantProgress";
import { ApplicantProfile } from "./pages/applicant/ApplicantProfile";
import { ApplicantSettings } from "./pages/applicant/ApplicantSettings";
import TestPage from "./pages/applicant/TestPage";
import CodingAssessmentPage from "./pages/applicant/CodingAssessmentPage";

/* ---------------- Query Client ---------------- */

const queryClient = new QueryClient();

/* ---------------- Company Layout ---------------- */

const CompanyLayout = () => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <CompanySidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

/* ---------------- Main App ---------------- */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />

          <BrowserRouter>
            <Routes>
              {/* ================= PUBLIC ================= */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Auth />} />

              {/* ================= APPLICANT ================= */}
              <Route
                path="/applicant"
                element={
                  <ProtectedRoute allowedRole="applicant">
                    <ApplicantLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ApplicantDashboard />} />
                <Route path="jobs" element={<FindJobs />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="assessments" element={<ApplicantAssessments />} />
                <Route path="interviews" element={<ApplicantInterviews />} />
                <Route path="progress" element={<ApplicantProgress />} />
                <Route path="profile" element={<ApplicantProfile />} />
                <Route path="settings" element={<ApplicantSettings />} />

                {/* 🔒 Protected Test Route */}
                <Route
                  path="test/:jobId/:applicationId"
                  element={<TestPage />}
                />
              </Route>
              <Route
                path="coding/:applicationId"
                element={<CodingAssessmentPage />}
              />

              {/* ================= COMPANY ================= */}
              <Route
                path="/company"
                element={
                  <ProtectedRoute allowedRole="company">
                    <CompanyLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<JobManagement />} />

                {/* ✅ Correct Param-Based Applicants Route */}
                <Route
                  path="jobs/:jobId/applicants"
                  element={<Applicants />}
                />

                <Route path="assessments" element={<AssessmentSetup />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* ================= 404 ================= */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;