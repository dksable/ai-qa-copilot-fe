import type { TestFocus, TestPlan } from "@/services/testcases";

export type ProjectDomain = "Banking" | "Healthcare" | "E-commerce" | "SaaS" | "Education" | "Custom";
export type EntityStatus = "Active" | "Archived";
export type ModulePriority = "Low" | "Medium" | "High" | "Critical";
export type HistoryStatus =
  | "Draft"
  | "Submitted for Review"
  | "Changes Requested"
  | "Approved"
  | "Rejected";
export type ExportFormat = "excel" | "pdf";
export type ExportType = "version" | "versions" | "requirement" | "project" | "filtered";
export type UserRole = "Admin" | "QA Lead" | "QA Engineer" | "Viewer";
export type WorkspaceRole = "Owner" | "Admin" | "QA Lead" | "QA Engineer" | "Viewer";
export type ProjectPermissionLevel = "Full Access" | "Edit Access" | "Review Access" | "View Only";
export type MemberStatus = "Active" | "Inactive" | "Removed";
export type InviteStatus = "Pending" | "Accepted" | "Expired" | "Revoked";
export type PlanId = "free" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus = "Trialing" | "Active" | "Canceled" | "Past Due";
export type TrialStatus = "Active" | "Expired" | "Converted";
export type ReviewAction =
  | "Submitted for Review"
  | "Approved"
  | "Changes Requested"
  | "Rejected"
  | "Comment Added"
  | "Exported Approved Version";
export type AuthProvider = "email";
export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface ProjectSummary {
  id: string;
  userId: string;
  name: string;
  description: string;
  domain: ProjectDomain;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  totalModules: number;
  totalRequirements: number;
  totalTestCases: number;
  lastUpdatedAt: string;
}

export interface Workspace {
  id: string;
  workspaceName: string;
  description: string;
  logo?: string;
  ownerId: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  status: MemberStatus;
  assignedProjects: Array<{ projectId: string; permission: ProjectPermissionLevel }>;
  joinedAt: string;
  lastActiveAt: string;
}

export interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceRole;
  assignedProjects: Array<{ projectId: string; permission: ProjectPermissionLevel }>;
  message?: string;
  token: string;
  inviteLink?: string;
  status: InviteStatus;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export interface WorkspacePermission {
  id: string;
  workspaceId: string;
  role: WorkspaceRole;
  permissions: string[];
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  createdAt: string;
}

export interface WorkspaceDetail {
  workspace: Workspace;
  members: WorkspaceMember[];
  invites: WorkspaceInvite[];
  activityLogs: ActivityLog[];
}

export interface AuthUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: AuthProvider;
  role: WorkspaceRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextResponse {
  user: AuthUser;
  workspace: Workspace | null;
  member: WorkspaceMember | null;
  role: WorkspaceRole;
  permissions: string[];
}

export interface AuthResponse extends AuthContextResponse {
  accessToken: string;
  expiresAt: string;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  recommended?: boolean;
  trialDays?: number;
  features: string[];
  limits: {
    workspaces: number | "unlimited";
    teamMembers: number | "unlimited";
    projects: number | "unlimited";
    requirementsPerMonth: number | "unlimited";
    aiGenerationsPerMonth: number | "unlimited";
    aiChatMessagesPerMonth: number | "unlimited";
    exportsPerMonth: number | "unlimited";
    storageMb: number | "unlimited";
    exports: string;
    analytics: boolean;
    reviewWorkflow: boolean;
    jiraIntegration: boolean;
    prioritySupport: boolean;
    customLimits: boolean;
  };
}

export interface Subscription {
  id: string;
  workspaceId: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  trialStartsAt?: string;
  trialEndsAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trial {
  id: string;
  workspaceId: string;
  userId: string;
  subscriptionId: string;
  planId: PlanId;
  status: TrialStatus;
  startsAt: string;
  endsAt: string;
  daysRemaining: number;
  featuresAvailable: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  subscription: Subscription;
  plan: Plan;
  trial?: Trial | null;
}

export interface UsageMetric {
  used: number;
  limit: number | "unlimited";
}

export interface WorkspaceUsageResponse {
  subscription: Subscription;
  plan: Plan;
  trial?: Trial | null;
  usage: {
    workspaces: UsageMetric;
    members: UsageMetric;
    projects: UsageMetric;
    requirements: UsageMetric;
    aiGenerations: UsageMetric;
    aiChatMessages: UsageMetric;
    exports: UsageMetric;
    activeUsers: UsageMetric;
    storage: UsageMetric;
  };
}

export interface ProjectModule {
  id: string;
  projectId: string;
  name: string;
  description: string;
  priority: ModulePriority;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  moduleId: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  priority: ModulePriority;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseGenerationHistory {
  id: string;
  userId: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  version: number;
  requirementInput: string;
  generatedAt: string;
  generatedBy: string;
  aiModelUsed: string;
  testType: TestFocus;
  coverageScore: number;
  status: HistoryStatus;
  reviewStatus: HistoryStatus;
  submittedBy?: string;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  isLocked: boolean;
  updatedAt: string;
  output: TestPlan;
}

export interface TestCaseHistoryRecord extends TestCaseGenerationHistory {
  projectName: string;
  moduleName: string;
  requirementTitle: string;
}

export interface TestCaseHistoryCompare {
  from: TestCaseHistoryRecord;
  to: TestCaseHistoryRecord;
  coverageDifference: number;
  addedTestCases: string[];
  removedTestCases: string[];
  updatedTestCases: string[];
}

export interface HistoryFilters {
  projectId?: string;
  moduleId?: string;
  requirementId?: string;
  generatedBy?: string;
  status?: HistoryStatus;
  dateFrom?: string;
  dateTo?: string;
  minCoverage?: string;
  maxCoverage?: string;
  search?: string;
}

export interface ExportHistoryRecord {
  id: string;
  userId: string;
  exportType: ExportType;
  exportFormat: ExportFormat;
  projectId?: string;
  requirementId?: string;
  totalRecords: number;
  createdAt: string;
}

export interface ReviewComment {
  id: string;
  historyId: string;
  userId: string;
  userName: string;
  role: UserRole;
  message: string;
  actionType: ReviewAction;
  createdAt: string;
}

export interface ReviewAuditTrail {
  id: string;
  historyId: string;
  action: ReviewAction;
  userId: string;
  userName: string;
  role: UserRole;
  oldStatus?: HistoryStatus;
  newStatus?: HistoryStatus;
  timestamp: string;
  comment?: string;
}

export interface ReviewDetail {
  history: TestCaseHistoryRecord;
  comments: ReviewComment[];
  auditTrail: ReviewAuditTrail[];
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface AIChat {
  id: string;
  userId: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  historyVersionId?: string;
  title: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
  projectName?: string;
  moduleName?: string;
  requirementTitle?: string;
}

export interface AIChatSummary {
  id: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  historyVersionId?: string;
  title: string;
  projectName: string;
  requirementTitle: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendAIChatMessageInput {
  chatId?: string;
  projectId: string;
  moduleId: string;
  requirementId: string;
  historyVersionId?: string;
  userMessage: string;
}

export interface ProjectDetail {
  project: ProjectSummary;
  modules: ProjectModule[];
  requirements: Requirement[];
  histories: TestCaseGenerationHistory[];
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalModules: number;
  totalRequirements: number;
  totalTestCases: number;
  averageTestCoverageScore: number;
  pendingReviews: number;
  approvedTestCases: number;
  changesRequested: number;
  rejectedItems: number;
  averageApprovalTimeHours: number;
  recentlyUpdatedProjects: ProjectSummary[];
}

export interface AnalyticsFilters {
  workspaceId?: string;
  projectId?: string;
  moduleId?: string;
  userId?: string;
  status?: HistoryStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface AnalyticsSummary {
  totalProjects: number;
  totalModules: number;
  totalRequirements: number;
  totalTestCasesGenerated: number;
  averageCoverageScore: number;
  approvedTestCases: number;
  pendingReviews: number;
  changesRequested: number;
  rejectedTestCases: number;
  totalExports: number;
  aiChatInteractions: number;
}

export interface AnalyticsCoverage {
  byProject: Array<{ projectId: string; projectName: string; averageCoverageScore: number }>;
  trend: Array<{ date: string; averageCoverageScore: number }>;
  lowCoverageRequirements: Array<{
    historyId: string;
    requirementId: string;
    requirementTitle: string;
    projectName: string;
    moduleName: string;
    coverageScore: number;
    version: number;
    generatedAt: string;
  }>;
  highCoverageRequirements: Array<{
    historyId: string;
    requirementId: string;
    requirementTitle: string;
    projectName: string;
    moduleName: string;
    coverageScore: number;
    version: number;
    generatedAt: string;
  }>;
  recommendation: string;
}

export interface AnalyticsGeneration {
  generatedOverTime: Array<{ name: string; versions: number }>;
  caseDistribution: Array<{ name: string; value: number }>;
  generatedByProject: Array<{ name: string; testCases: number }>;
  generatedByUser: Array<{ name: string; testCases: number }>;
  mostActiveModules: Array<{ name: string; testCases: number }>;
}

export interface AnalyticsReview {
  pendingReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  changesRequestedCount: number;
  averageApprovalTimeHours: number;
  statusDistribution: Array<{ name: string; value: number }>;
  reviewBottlenecks: Array<{
    historyId: string;
    requirementTitle: string;
    projectName: string;
    submittedAt: string;
    waitingDays: number;
  }>;
  reviewerActivity: Array<{ name: string; reviewsCompleted: number }>;
}

export interface AnalyticsProjectHealth {
  projectId: string;
  projectName: string;
  totalRequirements: number;
  totalGeneratedVersions: number;
  averageCoverageScore: number;
  pendingReviews: number;
  approvedVersions: number;
  lastActivityDate: string;
  healthStatus: "Healthy" | "Needs Attention" | "Critical";
}

export interface AnalyticsUserProductivity {
  userId: string;
  userName: string;
  role: WorkspaceRole;
  testCasesGenerated: number;
  reviewsCompleted: number;
  approvedVersions: number;
  aiChatUsage: number;
  exports: number;
  lastActiveDate: string;
}

export interface AnalyticsAIUsage {
  totalAIGenerations: number;
  totalAIChatMessages: number;
  mostUsedQuickPrompts: Array<{ name: string; count: number }>;
  averageCoverageImprovementAfterAIChat: number;
  aiGeneratedVersionsSaved: number;
  usageOverTime: Array<{ name: string; messages: number }>;
}

export interface AnalyticsExports {
  totalExcelExports: number;
  totalPdfExports: number;
  exportsByProject: Array<{ name: string; exports: number }>;
  exportsByUser: Array<{ name: string; exports: number }>;
  mostExportedRequirements: Array<{ name: string; exports: number }>;
  approvedVsDraftExportCount: Array<{ name: string; value: number }>;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  domain: ProjectDomain;
  status?: EntityStatus;
}

export interface CreateModuleInput {
  projectId: string;
  name: string;
  description: string;
  priority: ModulePriority;
  status?: EntityStatus;
}

export interface CreateRequirementInput {
  projectId: string;
  moduleId: string;
  title: string;
  description: string;
  acceptanceCriteria: string;
  priority: ModulePriority;
  status?: EntityStatus;
}

const apiBaseUrl = () => import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL;

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  const token = localStorage.getItem("aiqa_access_token");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem("aiqa_access_token");
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Request failed.");
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function toQueryString(filters: HistoryFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

function analyticsQueryString(filters: AnalyticsFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function getHistoryExportUrl(historyId: string, format: "pdf" | "excel" | "csv" | "json") {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  return `${baseUrl.replace(/\/$/, "")}/api/test-case-history/${historyId}/export?format=${format}`;
}

async function downloadBlob(path: string, body: unknown, fallbackName: string) {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  const token = localStorage.getItem("aiqa_access_token");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Export failed.");
  }

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename = disposition?.match(/filename="([^"]+)"/)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export const projectApi = {
  signup: (input: { fullName: string; email: string; password: string; confirmPassword: string; workspaceName?: string }) =>
    apiRequest<AuthResponse>("/api/auth/signup", { method: "POST", body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(input) }),
  logout: () => apiRequest<void>("/api/auth/logout", { method: "POST" }),
  me: () => apiRequest<AuthContextResponse>("/api/auth/me"),
  forgotPassword: (email: string) =>
    apiRequest<{ message: string; resetLink?: string; resetToken?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (input: { token: string; password: string; confirmPassword: string }) =>
    apiRequest<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(input) }),
  updateProfile: (input: { fullName?: string; avatar?: string }) =>
    apiRequest<AuthContextResponse>("/api/auth/profile", { method: "PATCH", body: JSON.stringify(input) }),
  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/api/auth/change-password", { method: "PATCH", body: JSON.stringify(input) }),
  listPlans: () => apiRequest<Plan[]>("/api/plans"),
  getCurrentSubscription: (workspaceId: string) =>
    apiRequest<SubscriptionResponse>(`/api/subscription/current?workspaceId=${encodeURIComponent(workspaceId)}`),
  getWorkspaceUsage: (workspaceId: string) =>
    apiRequest<WorkspaceUsageResponse>(`/api/subscription/usage?workspaceId=${encodeURIComponent(workspaceId)}`),
  getCurrentTrial: (workspaceId: string) =>
    apiRequest<Trial | null>(`/api/trial/current?workspaceId=${encodeURIComponent(workspaceId)}`),
  updateSubscription: (input: { workspaceId: string; planId: PlanId; billingCycle?: BillingCycle }) =>
    apiRequest<SubscriptionResponse>("/api/subscription/current", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  getDashboard: () => apiRequest<DashboardStats>("/api/dashboard"),
  listProjects: () => apiRequest<ProjectSummary[]>("/api/projects"),
  createProject: (input: CreateProjectInput) =>
    apiRequest<ProjectSummary>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getProject: (projectId: string) => apiRequest<ProjectDetail>(`/api/projects/${projectId}`),
  updateProject: (projectId: string, input: Partial<CreateProjectInput>) =>
    apiRequest<ProjectSummary>(`/api/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  archiveProject: (projectId: string) =>
    apiRequest<ProjectSummary>(`/api/projects/${projectId}/archive`, { method: "PATCH" }),
  deleteProject: (projectId: string) =>
    apiRequest<void>(`/api/projects/${projectId}`, { method: "DELETE" }),
  listModules: (projectId: string) =>
    apiRequest<ProjectModule[]>(`/api/projects/${projectId}/modules`),
  createModule: (input: CreateModuleInput) =>
    apiRequest<ProjectModule>("/api/modules", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateModule: (moduleId: string, input: Partial<Omit<CreateModuleInput, "projectId">>) =>
    apiRequest<ProjectModule>(`/api/modules/${moduleId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteModule: (moduleId: string) => apiRequest<void>(`/api/modules/${moduleId}`, { method: "DELETE" }),
  listRequirements: (moduleId: string) =>
    apiRequest<Requirement[]>(`/api/modules/${moduleId}/requirements`),
  createRequirement: (input: CreateRequirementInput) =>
    apiRequest<Requirement>("/api/requirements", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateRequirement: (
    requirementId: string,
    input: Partial<Omit<CreateRequirementInput, "projectId" | "moduleId">>,
  ) =>
    apiRequest<Requirement>(`/api/requirements/${requirementId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteRequirement: (requirementId: string) =>
    apiRequest<void>(`/api/requirements/${requirementId}`, { method: "DELETE" }),
  getHistory: (requirementId: string) =>
    apiRequest<TestCaseHistoryRecord[]>(`/api/requirements/${requirementId}/history`),
  listHistory: (filters: HistoryFilters = {}) =>
    apiRequest<TestCaseHistoryRecord[]>(`/api/test-case-history${toQueryString(filters)}`),
  getHistoryById: (historyId: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/test-case-history/${historyId}`),
  compareHistory: (fromId: string, toId: string) =>
    apiRequest<TestCaseHistoryCompare>(
      `/api/test-case-history/compare?fromId=${encodeURIComponent(fromId)}&toId=${encodeURIComponent(toId)}`,
    ),
  updateHistoryStatus: (historyId: string, status: HistoryStatus) =>
    apiRequest<TestCaseHistoryRecord>(`/api/test-case-history/${historyId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteHistory: (historyId: string) =>
    apiRequest<void>(`/api/test-case-history/${historyId}`, { method: "DELETE" }),
  listExportHistory: () => apiRequest<ExportHistoryRecord[]>("/api/export/history"),
  exportVersions: (historyIds: string[], format: ExportFormat) =>
    downloadBlob(`/api/export/${format}`, { historyIds }, `test-case-export.${format === "excel" ? "xlsx" : "pdf"}`),
  exportVersion: (historyId: string, format: ExportFormat) =>
    downloadBlob("/api/export/version", { historyId, format }, `test-case-version.${format === "excel" ? "xlsx" : "pdf"}`),
  exportRequirement: (requirementId: string, format: ExportFormat) =>
    downloadBlob("/api/export/requirement", { requirementId, format }, `requirement-export.${format === "excel" ? "xlsx" : "pdf"}`),
  exportProject: (projectId: string, format: ExportFormat) =>
    downloadBlob("/api/export/project", { projectId, format }, `project-export.${format === "excel" ? "xlsx" : "pdf"}`),
  exportFiltered: (filters: HistoryFilters, format: ExportFormat) =>
    downloadBlob(`/api/export/${format}`, { filters }, `filtered-export.${format === "excel" ? "xlsx" : "pdf"}`),
  sendAIChatMessage: (input: SendAIChatMessageInput) =>
    apiRequest<AIChat>("/api/ai-chat/message", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listAIChats: () => apiRequest<AIChatSummary[]>("/api/ai-chat/history"),
  getAIChat: (chatId: string) => apiRequest<AIChat>(`/api/ai-chat/${chatId}`),
  deleteAIChat: (chatId: string) => apiRequest<void>(`/api/ai-chat/${chatId}`, { method: "DELETE" }),
  saveChatAsVersion: (chatId: string, historyVersionId?: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/ai-chat/${chatId}/save-as-version`, {
      method: "POST",
      body: JSON.stringify({ historyVersionId }),
    }),
  submitForReview: (historyId: string, comment?: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/submit/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  getReviewQueue: () => apiRequest<TestCaseHistoryRecord[]>("/api/review/queue"),
  getReviewDetail: (historyId: string) => apiRequest<ReviewDetail>(`/api/review/${historyId}`),
  approveReview: (historyId: string, comment?: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/approve/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  requestReviewChanges: (historyId: string, comment: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/request-changes/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  rejectReview: (historyId: string, comment: string) =>
    apiRequest<TestCaseHistoryRecord>(`/api/review/reject/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  addReviewComment: (historyId: string, comment: string) =>
    apiRequest<ReviewComment>(`/api/review/comment/${historyId}`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    }),
  getReviewComments: (historyId: string) =>
    apiRequest<ReviewComment[]>(`/api/review/comments/${historyId}`),
  listWorkspaces: () => apiRequest<Workspace[]>("/api/workspaces"),
  createWorkspace: (input: { workspaceName: string; description: string; logo?: string }) =>
    apiRequest<Workspace>("/api/workspaces", { method: "POST", body: JSON.stringify(input) }),
  getWorkspace: (workspaceId: string) => apiRequest<WorkspaceDetail>(`/api/workspaces/${workspaceId}`),
  updateWorkspace: (
    workspaceId: string,
    input: Partial<Pick<Workspace, "workspaceName" | "description" | "logo">>,
  ) => apiRequest<Workspace>(`/api/workspaces/${workspaceId}`, { method: "PUT", body: JSON.stringify(input) }),
  archiveWorkspace: (workspaceId: string) =>
    apiRequest<Workspace>(`/api/workspaces/${workspaceId}/archive`, { method: "PATCH" }),
  deleteWorkspace: (workspaceId: string) =>
    apiRequest<void>(`/api/workspaces/${workspaceId}`, { method: "DELETE" }),
  listWorkspaceMembers: (workspaceId: string) =>
    apiRequest<WorkspaceMember[]>(`/api/workspaces/${workspaceId}/members`),
  updateMemberRole: (workspaceId: string, memberId: string, role: WorkspaceRole) =>
    apiRequest<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
  updateMemberProjects: (
    workspaceId: string,
    memberId: string,
    assignedProjects: WorkspaceMember["assignedProjects"],
  ) =>
    apiRequest<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}/projects`, {
      method: "PATCH",
      body: JSON.stringify({ assignedProjects }),
    }),
  removeMember: (workspaceId: string, memberId: string) =>
    apiRequest<void>(`/api/workspaces/${workspaceId}/members/${memberId}`, { method: "DELETE" }),
  deactivateMember: (workspaceId: string, memberId: string) =>
    apiRequest<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}/deactivate`, {
      method: "PATCH",
    }),
  createInvite: (
    workspaceId: string,
    input: { email: string; role: WorkspaceRole; assignedProjects: WorkspaceInvite["assignedProjects"]; message?: string },
  ) =>
    apiRequest<WorkspaceInvite>(`/api/workspaces/${workspaceId}/invites`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  listInvites: (workspaceId: string) => apiRequest<WorkspaceInvite[]>(`/api/workspaces/${workspaceId}/invites`),
  acceptInvite: (token: string) =>
    apiRequest<WorkspaceMember>("/api/workspaces/invites/accept", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  revokeInvite: (workspaceId: string, inviteId: string) =>
    apiRequest<WorkspaceInvite>(`/api/workspaces/${workspaceId}/invites/${inviteId}/revoke`, {
      method: "PATCH",
    }),
  resendInvite: (workspaceId: string, inviteId: string) =>
    apiRequest<WorkspaceInvite>(`/api/workspaces/${workspaceId}/invites/${inviteId}/resend`, {
      method: "POST",
    }),
  getMyPermissions: (workspaceId: string) =>
    apiRequest<{ userId: string; role: WorkspaceRole; permissions: string[]; assignedProjects: WorkspaceMember["assignedProjects"] }>(
      `/api/workspaces/${workspaceId}/permissions/me`,
    ),
  listRoles: (workspaceId: string) =>
    apiRequest<WorkspacePermission[]>(`/api/workspaces/${workspaceId}/roles`),
  updateRolePermissions: (workspaceId: string, role: WorkspaceRole, permissions: string[]) =>
    apiRequest<WorkspacePermission>(`/api/workspaces/${workspaceId}/roles/${role}`, {
      method: "PATCH",
      body: JSON.stringify({ role, permissions }),
    }),
  getAnalyticsSummary: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsSummary>(`/api/analytics/summary${analyticsQueryString(filters)}`),
  getAnalyticsCoverage: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsCoverage>(`/api/analytics/coverage${analyticsQueryString(filters)}`),
  getAnalyticsGeneration: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsGeneration>(`/api/analytics/generation${analyticsQueryString(filters)}`),
  getAnalyticsReview: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsReview>(`/api/analytics/review${analyticsQueryString(filters)}`),
  getAnalyticsProjectsHealth: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsProjectHealth[]>(`/api/analytics/projects-health${analyticsQueryString(filters)}`),
  getAnalyticsUsersProductivity: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsUserProductivity[]>(`/api/analytics/users-productivity${analyticsQueryString(filters)}`),
  getAnalyticsAIUsage: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsAIUsage>(`/api/analytics/ai-usage${analyticsQueryString(filters)}`),
  getAnalyticsExports: (filters: AnalyticsFilters = {}) =>
    apiRequest<AnalyticsExports>(`/api/analytics/exports${analyticsQueryString(filters)}`),
};
