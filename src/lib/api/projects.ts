import type { TestFocus, TestPlan } from "@/lib/api/testcases";

export type ProjectDomain = "Banking" | "Healthcare" | "E-commerce" | "SaaS" | "Education" | "Custom";
export type EntityStatus = "Active" | "Archived";
export type ModulePriority = "Low" | "Medium" | "High" | "Critical";
export type HistoryStatus = "Draft" | "Reviewed" | "Approved";
export type ExportFormat = "excel" | "pdf";
export type ExportType = "version" | "versions" | "requirement" | "project" | "filtered";

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
  recentlyUpdatedProjects: ProjectSummary[];
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

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
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

export function getHistoryExportUrl(historyId: string, format: "pdf" | "excel" | "csv" | "json") {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");
  return `${baseUrl.replace(/\/$/, "")}/api/test-case-history/${historyId}/export?format=${format}`;
}

async function downloadBlob(path: string, body: unknown, fallbackName: string) {
  const baseUrl = apiBaseUrl();
  if (!baseUrl) throw new Error("API URL is not configured.");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
};
