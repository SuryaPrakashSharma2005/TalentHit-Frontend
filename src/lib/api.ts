// ==================================================
// BASE CONFIG
// ==================================================

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "/api"; // 🔥 Use Vite proxy instead of hardcoded backend URL

const DEFAULT_TIMEOUT = 15000;

// ==================================================
// CORE API ENGINE
// ==================================================

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      credentials: "include",
      signal: controller.signal,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
      },
      ...options,
    });

    clearTimeout(timeout);

    let responseData: any = null;

    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError("Unauthorized", 401);
      }

      const message =
        responseData?.detail ||
        responseData?.message ||
        "Unexpected server error";

      throw new ApiError(message, response.status);
    }

    return responseData as T;
  } catch (error: any) {
    clearTimeout(timeout);

    if (error.name === "AbortError") {
      throw new ApiError("Request timed out");
    }

    if (!navigator.onLine) {
      throw new ApiError("No internet connection");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(error.message || "Network error");
  }
}
// ==================================================
// SHARED TYPES
// ==================================================

export type ApplicationStage =
  | "SKILL_REJECTED"
  | "ASSESSMENT_PENDING"
  | "ASSESSMENT_STARTED"
  | "ASSESSMENT_COMPLETED"
  | "CODING_PENDING"
  | "SHORTLISTED"
  | "REJECTED"
  | "INTERVIEW"
  | "OFFERED"
  | "HIRED";

export interface Job {
  _id: string;
  company_id: string;
  title: string;
  required_skills: string[];
  min_experience: number;
  degree?: string;
  openings: number;
  status: "ACTIVE" | "CLOSED";
  created_at: string;
}
export interface RecommendedJob {
  _id: string;
  title: string;
  min_experience: number;
  required_skills: string[];
  match_percentage: number;
}
export interface Application {
  _id: string;
  job_id: string;
  company_id: string;
  candidate_id: string;
  skill_match_percentage: number;
  resume_score: number;
  mcq_score: number;
  coding_score?: number;
  final_score: number;
  stage: ApplicationStage;
  status: string;
  created_at: string;
  job_title?: string;
}

export interface MCQQuestion {
  id: string;
  skill: string;
  question: string;
  options: string[];
}

export interface CompanyDashboardStats {
  total_jobs: number;
  total_applications: number;
  shortlisted: number;
  skill_rejected: number;
}

export interface CompanyAnalytics {
  total_applications: number;
  conversion_rate: number;
  top_skills: { skill: string; demand: number }[];
  jobs_by_department: { department: string; count: number }[];
}

export interface CandidateProfile {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  experience_years: number;
  education: string | { degree?: string };
  avatar?: string;
  phone?: string;
  location?: string;
}

export interface CandidateSettings {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      jobAlerts: boolean;
      interviewReminders: boolean;
      weeklyDigest: boolean;
    };
    privacy: {
      profileVisible: boolean;
      showToRecruiters: boolean;
      activityStatus: boolean;
    };
  };
}

// ==================================================
// MCQ TEST TYPES  🔥 ADD HERE
// ==================================================

export interface StartTestResponse {
  message: string;
}

export interface CurrentQuestionResponse {
  question_id: string;
  question: string;
  options: string[];
  question_number: number;
  total_questions: number;
  message?: string;
}

export interface SubmitAnswerResponse {
  message: string;
}

export interface FinalizeTestResponse {
  mcq_score: number;
  final_score: number;
  stage: string;
}
// ==================================================
// HELPER METHODS
// ==================================================

const get = <T>(url: string) => apiRequest<T>(url);

const post = <T>(url: string, body?: any) =>
  apiRequest<T>(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

const patch = <T>(url: string, body?: any) =>
  apiRequest<T>(url, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });

// ==================================================
// PUBLIC JOBS (APPLICANT)
// ==================================================

export const getActiveJobs = (skip = 0, limit = 20) =>
  get<Job[]>(`/jobs?skip=${skip}&limit=${limit}`);

export const applyToJob = async (jobId: string) => {
  const response = await fetch(`/api/jobs/${jobId}/apply`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to apply");
  }

  return response.json();
};
// ==================================================
// CANDIDATE
// ==================================================

export const getCandidateApplications = (candidateId: string) =>
  get<Application[]>(`/candidate/${candidateId}/applications`);


export const getCandidateSettings = (candidateId: string) =>
  get<CandidateSettings>(`/candidate/${candidateId}/settings`);

export const updateCandidateSettings = (
  candidateId: string,
  data: Partial<CandidateSettings>
) =>
  patch<{ message: string }>(
    `/candidate/${candidateId}/settings`,
    data
  );

// ==================================================
// MCQ FLOW
// ==================================================

// ==================================================
// COMPANY (JWT BASED)
// ==================================================

export const getCompanyDashboard = () =>
  get<CompanyDashboardStats>(`/jobs/company/dashboard`);

export const getCompanyJobs = () =>
  get<Job[]>(`/jobs/company/jobs`);

export const getCompanyAnalytics = () =>
  get<CompanyAnalytics>(`/jobs/company/analytics`);

export const createJob = (data: {
  title: string;
  required_skills: string[];
  min_experience: number;
  department?: string;
  openings: number;
  coding_language?: string;
  job_duration_days?: number;
  domain?: string;
  sub_domain?: string;
}) =>
  post<Job>("/jobs/create", data);

export const closeJob = (jobId: string) =>
  patch<{ message: string }>(`/jobs/${jobId}/close`);

export const getJobApplications = (
  jobId: string,
  skip = 0,
  limit = 20
) =>
  get<Application[]>(
    `/jobs/${jobId}/applications?skip=${skip}&limit=${limit}`
  );

export const updateApplicationStage = (
  jobId: string,
  applicationId: string,
  stage: ApplicationStage
) =>
  patch<{ message: string }>(
    `/jobs/${jobId}/applications/${applicationId}/stage`,
    { stage }
  );

export const shortlistJob = (jobId: string) =>
  post<{ shortlisted_count: number; limit: number }>(
    `/jobs/${jobId}/shortlist`
  );

// ==================================================
// COMPANY SETTINGS (JWT BASED)
// ==================================================

export interface CompanySettings {
  name: string;
  email: string;
  website: string;
  notify_new_applications: boolean;
  notify_assessment_complete: boolean;
  notify_weekly_reports: boolean;
  auto_screen: boolean;
  require_assessment: boolean;
}

export const getCompanySettings = () =>
  get<CompanySettings>(`/company/settings`);

export const updateCompanySettings = (
  payload: Partial<CompanySettings>
) =>
  patch<{ message: string }>(
    `/company/settings`,
    payload
  );

// ==================================================
// AUTH
// ==================================================

export interface AuthResponse {
  message: string;
}

export interface CurrentUser {
  id: string;
  role: "company" | "applicant";
}

export const registerUser = (data: {
  email: string;
  password: string;
  role: "company" | "applicant";
}) =>
  post<AuthResponse>("/auth/register", data);

export const loginUser = (data: {
  email: string;
  password: string;
}) =>
  post<AuthResponse>("/auth/login", data);

export const logoutUser = () =>
  post<AuthResponse>("/auth/logout");

export const getCurrentUser = () =>
  get<CurrentUser>("/auth/me");


// ==================================================
// CANDIDATE (JWT BASED)
// ==================================================

export const getCurrentCandidateProfile = () =>
  get<CandidateProfile>(`/candidate/me`);

export const getMyApplications = () =>
  get<Application[]>(`/jobs/me/applications`);

export const updateMyProfile = (
  data: Partial<CandidateProfile>
) =>
  patch<{ message: string }>(
    `/candidate/me`,
    data
  );
export const getRecommendedJobs = () =>
  get<RecommendedJob[]>("/jobs/recommended");


export const updateCandidateProfile = (
  candidateId: string,
  data: any
) =>
  patch(`/candidate/${candidateId}`, data);

export interface GenerateMCQResponse {
  questions: MCQQuestion[];
}


export interface SubmitMCQResponse {
  mcq_score: number;
  final_score: number;
  stage: string;
}

export const submitMCQ = (
  jobId: string,
  applicationId: string,
  answers: Record<string, number>
) =>
  post<SubmitMCQResponse>(
    `/jobs/${jobId}/applications/${applicationId}/submit-mcq`,
    { answers }
  );

export const submitAnswer = (
  applicationId: string,
  payload: { question_id: string; selected_option: number }
) =>
  post<SubmitAnswerResponse>(
    `/jobs/${applicationId}/submit-answer`,
    payload
  );

export const finalizeTest = (applicationId: string) =>
  post<FinalizeTestResponse>(
    `/jobs/${applicationId}/finalize-test`
  );

export function extractErrorMessage(error: any): string {
  if (!error) return "Something went wrong";

  if (typeof error === "string") return error;

  if (typeof error.message === "string") return error.message;

  if (typeof error.detail === "string") return error.detail;

  if (error.response?.data?.detail)
    return error.response.data.detail;

  return "Unexpected error occurred";
}


export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("resume_file", file);

  const response = await fetch(`/api/candidate/upload-resume`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Upload failed");
  }

  return response.json();
};

// 🔥 BACKEND-CORRECT MCQ SUBMIT
export const submitAssessment = (
  jobId: string,
  applicationId: string,
  answers: Record<string, number>
) =>
  post<{
    mcq_score: number;
    final_score: number;
    stage: string;
  }>(
    `/jobs/${jobId}/applications/${applicationId}/submit-mcq`,
    answers
  );

// 🔥 COMPANY ROUTES (BACKEND ALIGNED)

export const getCompanyProfile = () =>
  get(`/company/me`);

export const getCompanyJobsBackend = () =>
  get(`/company/jobs`);

export const getCompanyApplicants = (jobId: string) =>
  get(`/company/jobs/${jobId}/applicants`);

export const autoShortlistBackend = (jobId: string) =>
  post(`/company/jobs/${jobId}/auto-shortlist`);

export const getCompanyAnalyticsBackend = () =>
  get(`/company/analytics`);

// 🔥 NOTIFICATIONS

export interface Notification {
  id: string;
  message: string;
  created_at: string;
}

export const getNotifications = () =>
  get<Notification[]>(`/notifications/`);

// 🔥 START ASSESSMENT (BACKEND ALIGNED)
export const startAssessment = (
  jobId: string,
  applicationId: string
) =>
  post<{ questions: { id: string; question: string; options: string[] }[] }>(
    `/jobs/${jobId}/applications/${applicationId}/start-test`
  );

export const getAssessmentQuestions = (
  jobId: string,
  applicationId: string
) =>
  get(`/jobs/${jobId}/applications/${applicationId}/questions`);

export const getCompanyReports = () =>
  get(`/company/reports`);

// ==================================================
// CODING ASSESSMENT TYPES
// ==================================================

export interface CodingQuestion {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  domain: string;
}

export interface StartCodingResponse {
  questions: CodingQuestion[];
}

export interface SubmitCodingResponse {
  coding_score: number
  final_score: number
  stage: string

  // optional judge metrics
  coding_passed_tests?: number
  coding_total_questions?: number
  execution_time?: number
}


// ==================================================
// CODING ASSESSMENT API
// ==================================================

export const startCodingTest = async (
  applicationId: string
): Promise<StartCodingResponse> => {

  return post<StartCodingResponse>(
    `/coding/start/${applicationId}`
  )
}

export const submitCodingTest = async (
  applicationId: string,
  answers: Record<string, string>
): Promise<SubmitCodingResponse> => {

  return post<SubmitCodingResponse>(
    `/coding/submit/${applicationId}`,
    { answers }
  )
}