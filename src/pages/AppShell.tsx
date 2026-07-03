import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Sparkles,
  Brain,
  Wand2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Cloud,
  Database,
  Code2,
  ClipboardCheck,
  Copy,
  Loader2,
  Beaker,
  ShieldCheck,
  Rocket,
  Zap,
  Layers,
  ListChecks,
  Gauge,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  Plus,
  Archive,
  Trash2,
  Pencil,
  Eye,
  CalendarDays,
  Boxes,
  FileText,
  History,
  Download,
  Search,
  SearchCheck,
  Github,
  GitBranch,
  GitMerge,
  GitPullRequest,
  GitCompare,
  RefreshCw,
  Bot,
  Send,
  MessageSquare,
  ClipboardList,
  Users,
  BarChart3,
  Layers3,
  TrendingUp,
  UserCircle,
  Puzzle,
  ExternalLink,
  Monitor,
  Keyboard,
  Network,
  KeyRound,
  PlayCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TopHeader } from "@/components/header/TopHeader";
import { SidebarFooter } from "@/components/navigation/SidebarFooter";
import { SidebarHeader } from "@/components/navigation/SidebarHeader";
import { SidebarMenu } from "@/components/navigation/SidebarMenu";
import { cn } from "@/lib/utils";
import { usePersistentTheme } from "@/hooks/usePersistentTheme";
import type { ActiveView, Theme } from "@/types/app";

import { generateTestCases, type TestCase, type TestPlan } from "@/services/testcases";
import {
  projectApi,
  type AIChat,
  type AIChatSummary,
  type AnalyticsAIUsage,
  type AnalyticsCoverage,
  type AnalyticsExports,
  type AnalyticsFilters,
  type AnalyticsGeneration,
  type AnalyticsProjectHealth,
  type AnalyticsReview,
  type AnalyticsSummary,
  type AnalyticsUserProductivity,
  type AIQualitySummary,
  type AIQualityTrendPoint,
  type ApiAnalyticsSummary,
  type AIProviderConfig,
  type AIProviderFeatureMapping,
  type AIProviderFeatureName,
  type AIProviderSettingsResponse,
  type AIProviderUsageLog,
  type ApiEndpoint,
  type ApiFailureAnalysis,
  type ApiFailureEvidence,
  type ApiImpactAnalysis,
  type ApiRepositoryCoverage,
  type ApiRepositoryDependencyGraph,
  type ApiRepositoryProfile,
  type ApiRepositoryRiskSummary,
  type ApiRouteMapping,
  type ApiRun,
  type ApiValidationMode,
  type ApiValidationResult,
  type ApiValidationRun,
  type ApiContractValidation,
  type ContractDashboard,
  type ApiRiskLevel,
  type ApiTestFramework,
  type ApiTestGenerationType,
  type ApiWorkspace,
  type ApplicationRepositoryConfig,
  type ApplicationRepositoryType,
  type SaveAIProviderInput,
  type AuthContextResponse,
  type AuthResponse,
  type BillingCycle,
  type CreateProjectInput,
  type DashboardStats,
  type EntityStatus,
  type ExportFormat,
  type ExportHistoryRecord,
  type GitHubAutomationConfig,
  type HistoryFilters,
  type HistoryStatus,
  type ModulePriority,
  type ProjectDetail,
  type ProjectDomain,
  type ProjectModule,
  type ProjectSummary,
  type PostmanRequest,
  type PostmanWorkspace,
  type GeneratedApiTest,
  type GeneratedApiTestSuite,
  type Requirement,
  type RepositoryAnalysis,
  type RepositoryActivity,
  type RepositoryActivityStatus,
  type RepositoryImpactAnalysis,
  type RepositoryImpactAnalysisStatus,
  type RepositoryGeneratedTestUpdate,
  type RepositoryLearningProfile,
  type RepositoryValidationMode,
  type RepositoryValidationRun,
  type RepositoryValidationRecommendation,
  type ReleaseReadinessSnapshot,
  type RootCauseAnalysis,
  type RepositorySync,
  type ReviewDetail,
  type ValidationAutoFix,
  type ValidationFailureAnalysis,
  type ValidationHistoryDetail,
  type ValidationHistoryRecord,
  type ValidationHistoryStatistics,
  type ValidationRetryAttempt,
  type Workspace,
  type WorkspaceDetail,
  type WorkspaceMember,
  type WorkspaceRole,
  type Plan,
  type PlanId,
  type PlaywrightValidationJob,
  type SubscriptionResponse,
  type ApprovedTestCaseVersion,
  type CreateTestRunInput,
  type TestExecution,
  type TestExecutionDashboard,
  type TestExecutionHistoryItem,
  type TestExecutionStatus,
  type TestRunDetail,
  type TestRunSummary,
  type WorkspaceUsageResponse,
  type TestCaseHistoryCompare,
  type TestCaseHistoryRecord,
  type TestCaseGenerationHistory,
} from "@/services/projects";
import type {
  RegressionImpactAnalysis,
  RegressionPriority,
  RiskLevel,
  ReleaseRecommendationStatus,
} from "@/services/regressionImpact";
import type {
  CoverageStatus,
  OverallCoverageStatus,
  TestCoverageScoreAnalysis,
} from "@/services/coverageScore";

type ExecutionEvidenceDraft = {
  status: TestExecutionStatus;
  actualResult: string;
  comments: string;
  bugId: string;
  jiraBugId: string;
  jiraBugUrl: string;
  screenshotUrl: string;
  videoUrl: string;
  logUrl: string;
  executionTime: string;
  browser: NonNullable<TestExecution["browser"]> | "";
  operatingSystem: NonNullable<TestExecution["operatingSystem"]> | "";
  buildNumber: string;
  environment: NonNullable<TestExecution["environment"]> | "";
};

interface AnalyticsBundle {
  summary: AnalyticsSummary;
  coverage: AnalyticsCoverage;
  generation: AnalyticsGeneration;
  review: AnalyticsReview;
  projectHealth: AnalyticsProjectHealth[];
  userProductivity: AnalyticsUserProductivity[];
  aiUsage: AnalyticsAIUsage;
  exports: AnalyticsExports;
  aiQuality: AIQualitySummary;
  aiQualityTrends: AIQualityTrendPoint[];
  apiAnalytics: ApiAnalyticsSummary;
}

export default function AppShell() {
  const { theme, toggleTheme } = usePersistentTheme();
  const [requirement, setRequirement] = useState("");
  const [testType, setTestType] = useState<"functional" | "api" | "ui" | "integration">(
    "functional",
  );
  const [plan, setPlan] = useState<TestPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playwrightValidationJob, setPlaywrightValidationJob] = useState<PlaywrightValidationJob | null>(null);
  const [isValidatingPlaywright, setIsValidatingPlaywright] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("landing");
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedRequirementId, setSelectedRequirementId] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<TestCaseGenerationHistory[]>([]);
  const [allHistory, setAllHistory] = useState<TestCaseHistoryRecord[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");
  const [historyFilters, setHistoryFilters] = useState<HistoryFilters>({});
  const [compareFromId, setCompareFromId] = useState("");
  const [compareToId, setCompareToId] = useState("");
  const [comparison, setComparison] = useState<TestCaseHistoryCompare | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistoryRecord[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [chatHistory, setChatHistory] = useState<AIChatSummary[]>([]);
  const [activeChat, setActiveChat] = useState<AIChat | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedChatHistoryVersionId, setSelectedChatHistoryVersionId] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<TestCaseHistoryRecord[]>([]);
  const [reviewDetail, setReviewDetail] = useState<ReviewDetail | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [testRuns, setTestRuns] = useState<TestRunSummary[]>([]);
  const [selectedTestRunId, setSelectedTestRunId] = useState("");
  const [testRunDetail, setTestRunDetail] = useState<TestRunDetail | null>(null);
  const [approvedExecutionVersions, setApprovedExecutionVersions] = useState<ApprovedTestCaseVersion[]>([]);
  const [executionDashboard, setExecutionDashboard] = useState<TestExecutionDashboard | null>(null);
  const [executionHistoryItems, setExecutionHistoryItems] = useState<TestExecutionHistoryItem[]>([]);
  const [isExecutionLoading, setIsExecutionLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [workspaceDetail, setWorkspaceDetail] = useState<WorkspaceDetail | null>(null);
  const [isWorkspaceLoading, setIsWorkspaceLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsBundle | null>(null);
  const [analyticsFilters, setAnalyticsFilters] = useState<AnalyticsFilters>({});
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [auth, setAuth] = useState<AuthContextResponse | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(() => Boolean(localStorage.getItem("aiqa_access_token")));
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [workspaceUsage, setWorkspaceUsage] = useState<WorkspaceUsageResponse | null>(null);
  const [aiProviderSettings, setAIProviderSettings] = useState<AIProviderSettingsResponse | null>(null);
  const [aiProviderUsage, setAIProviderUsage] = useState<AIProviderUsageLog[]>([]);
  const [isAIProviderLoading, setIsAIProviderLoading] = useState(false);
  const [githubAutomationConfig, setGithubAutomationConfig] = useState<GitHubAutomationConfig | null>(null);
  const [repositoryAnalysis, setRepositoryAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [repositorySyncs, setRepositorySyncs] = useState<RepositorySync[]>([]);
  const [applicationRepositories, setApplicationRepositories] = useState<ApplicationRepositoryConfig[]>([]);
  const [repositoryActivities, setRepositoryActivities] = useState<RepositoryActivity[]>([]);
  const [isIntegrationLoading, setIsIntegrationLoading] = useState(false);
  const [isPushingPlaywright, setIsPushingPlaywright] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false);
  const lastShortcutPrefixRef = useRef<{ key: string; time: number } | null>(null);
  const isAuthenticated = Boolean(auth?.user);

  const globalSearchItems = useMemo(() => {
    const items: Array<{ group: string; title: string; description: string; view: ActiveView; icon: typeof Search }> = [];
    projects.forEach((project) => items.push({
      group: "Projects",
      title: project.name,
      description: `${project.domain} / ${project.totalRequirements} requirements`,
      view: "projects",
      icon: FolderKanban,
    }));
    projectDetail?.requirements.forEach((requirementItem) => items.push({
      group: "Requirements",
      title: requirementItem.title,
      description: requirementItem.description || "Project requirement",
      view: "generator",
      icon: FileText,
    }));
    allHistory.slice(0, 80).forEach((history) => items.push({
      group: "Test History",
      title: history.requirementTitle,
      description: `Version ${history.version} / ${history.coverageScore}% coverage`,
      view: "history",
      icon: History,
    }));
    repositoryActivities.slice(0, 80).forEach((activity) => items.push({
      group: "Repository Activity",
      title: `${activity.repoOwner}/${activity.repoName}`,
      description: `${activity.eventType} / ${activity.branch || "branch"} / ${activity.fileCount} files`,
      view: "repository-activity",
      icon: GitBranch,
    }));
    workspaceDetail?.members.forEach((member) => items.push({
      group: "Team Members",
      title: member.name,
      description: `${member.email} / ${member.role}`,
      view: "workspace",
      icon: Users,
    }));
    return items;
  }, [allHistory, projectDetail?.requirements, projects, repositoryActivities, workspaceDetail?.members]);

  const filteredSearchItems = useMemo(() => {
    const query = globalSearchQuery.trim().toLowerCase();
    if (!query) return globalSearchItems.slice(0, 12);
    return globalSearchItems
      .filter((item) => `${item.group} ${item.title} ${item.description}`.toLowerCase().includes(query))
      .slice(0, 24);
  }, [globalSearchItems, globalSearchQuery]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (isTyping || target?.isContentEditable) return;
      if (event.key === "/") {
        event.preventDefault();
        setIsGlobalSearchOpen(true);
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setIsShortcutHelpOpen(true);
        return;
      }
      if (event.key === "Escape") {
        setIsGlobalSearchOpen(false);
        setIsShortcutHelpOpen(false);
        return;
      }
      const nowTime = Date.now();
      const prefix = lastShortcutPrefixRef.current;
      if (event.key === "g" || event.key === "n") {
        lastShortcutPrefixRef.current = { key: event.key, time: nowTime };
        return;
      }
      if (prefix && nowTime - prefix.time < 1200) {
        const shortcut = `${prefix.key} ${event.key}`;
        const routes: Record<string, ActiveView> = {
          "g d": "dashboard",
          "g p": "projects",
          "g r": "repository-activity",
          "g v": "repository-validation-history",
          "g a": "analytics",
          "n p": "projects",
          "n t": "generator",
        };
        const nextView = routes[shortcut];
        if (nextView) {
          event.preventDefault();
          setActiveView(nextView);
          if (shortcut === "n p") setIsProjectDialogOpen(true);
        }
        lastShortcutPrefixRef.current = null;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const refreshProjects = async (projectId = selectedProjectId) => {
    try {
      setIsLoadingProjects(true);
      const [dashboardStats, projectList] = await Promise.all([
        projectApi.getDashboard(),
        projectApi.listProjects(),
      ]);
      setDashboard(dashboardStats);
      setProjects(projectList);
      if (projectId) {
        const detail = await projectApi.getProject(projectId);
        setProjectDetail(detail);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const refreshHistory = async (filters = historyFilters) => {
    try {
      setIsLoadingHistory(true);
      const records = await projectApi.listHistory(filters);
      setAllHistory(records);
      if (!selectedHistoryId && records[0]) setSelectedHistoryId(records[0].id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const refreshExportHistory = async () => {
    try {
      setExportHistory(await projectApi.listExportHistory());
    } catch {
      setExportHistory([]);
    }
  };

  const refreshChatHistory = async () => {
    try {
      setChatHistory(await projectApi.listAIChats());
    } catch {
      setChatHistory([]);
    }
  };

  const refreshReviewQueue = async () => {
    try {
      setIsReviewLoading(true);
      setReviewQueue(await projectApi.getReviewQueue());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load review queue");
    } finally {
      setIsReviewLoading(false);
    }
  };

  const refreshExecution = async (testRunId = selectedTestRunId) => {
    try {
      setIsExecutionLoading(true);
      const [runs, dashboardData, approvedVersions] = await Promise.all([
        projectApi.listTestRuns(),
        projectApi.getTestExecutionDashboard(),
        projectApi.listApprovedTestCaseVersions(),
      ]);
      setTestRuns(runs);
      setExecutionDashboard(dashboardData);
      setApprovedExecutionVersions(approvedVersions);
      const nextRunId = testRunId || runs[0]?.id || "";
      setSelectedTestRunId(nextRunId);
      setTestRunDetail(nextRunId ? await projectApi.getTestRun(nextRunId) : null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load test execution");
    } finally {
      setIsExecutionLoading(false);
    }
  };

  const refreshWorkspace = async (workspaceId = selectedWorkspaceId) => {
    try {
      setIsWorkspaceLoading(true);
      const workspaceList = await projectApi.listWorkspaces();
      setWorkspaces(workspaceList);
      const nextWorkspaceId = workspaceId || workspaceList[0]?.id || "";
      setSelectedWorkspaceId(nextWorkspaceId);
      if (nextWorkspaceId) setWorkspaceDetail(await projectApi.getWorkspace(nextWorkspaceId));
      if (nextWorkspaceId) void refreshPricing(nextWorkspaceId);
      if (nextWorkspaceId) void refreshAIProviders(nextWorkspaceId);
      if (nextWorkspaceId) void refreshIntegrations(nextWorkspaceId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load workspace");
    } finally {
      setIsWorkspaceLoading(false);
    }
  };

  const refreshAIProviders = async (workspaceId = selectedWorkspaceId || auth?.workspace?.id || "") => {
    if (!workspaceId) return;
    try {
      setIsAIProviderLoading(true);
      const [settings, usage] = await Promise.all([
        projectApi.listAIProviders(workspaceId),
        projectApi.listAIProviderUsage(workspaceId),
      ]);
      setAIProviderSettings(settings);
      setAIProviderUsage(usage);
    } catch {
      setAIProviderSettings(null);
      setAIProviderUsage([]);
    } finally {
      setIsAIProviderLoading(false);
    }
  };

  const refreshIntegrations = async (workspaceId = selectedWorkspaceId || auth?.workspace?.id || "") => {
    if (!workspaceId) return;
    try {
      setIsIntegrationLoading(true);
      const [config, analysis, applicationRepos, activities] = await Promise.all([
        projectApi.getGitHubAutomationConfig(workspaceId),
        projectApi.getGitHubRepositoryAnalysis(workspaceId),
        projectApi.listApplicationRepositories(workspaceId),
        projectApi.listRepositoryActivity(workspaceId),
      ]);
      const syncs = config ? await projectApi.listGitHubRepositorySyncs(workspaceId) : [];
      setGithubAutomationConfig(config);
      setRepositoryAnalysis(analysis);
      setRepositorySyncs(syncs);
      setApplicationRepositories(applicationRepos);
      setRepositoryActivities(activities);
    } catch {
      setGithubAutomationConfig(null);
      setRepositoryAnalysis(null);
      setRepositorySyncs([]);
      setApplicationRepositories([]);
      setRepositoryActivities([]);
    } finally {
      setIsIntegrationLoading(false);
    }
  };

  const refreshAnalytics = async (filters = analyticsFilters) => {
    try {
      setIsAnalyticsLoading(true);
      const [
        summary,
        coverage,
        generation,
        review,
        projectHealth,
        userProductivity,
        aiUsage,
        exports,
        aiQuality,
        aiQualityTrends,
        apiAnalytics,
      ] = await Promise.all([
        projectApi.getAnalyticsSummary(filters),
        projectApi.getAnalyticsCoverage(filters),
        projectApi.getAnalyticsGeneration(filters),
        projectApi.getAnalyticsReview(filters),
        projectApi.getAnalyticsProjectsHealth(filters),
        projectApi.getAnalyticsUsersProductivity(filters),
        projectApi.getAnalyticsAIUsage(filters),
        projectApi.getAnalyticsExports(filters),
        projectApi.getAIQualitySummary(filters),
        projectApi.getAIQualityTrends(filters),
        projectApi.getApiAnalyticsSummary(filters),
      ]);
      setAnalytics({ summary, coverage, generation, review, projectHealth, userProductivity, aiUsage, exports, aiQuality, aiQualityTrends, apiAnalytics });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load analytics");
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  const runExport = async (label: string, action: () => Promise<void>) => {
    try {
      setIsExporting(true);
      await action();
      await refreshExportHistory();
      await refreshAnalytics(analyticsFilters);
      await refreshPricing(selectedWorkspaceId || auth?.workspace?.id);
      toast.success(`${label} export downloaded`);
    } catch (error) {
      if (handleLimitExceeded(error)) return;
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const pushPlaywrightToGitHub = async (fileName: string) => {
    if (!plan) return;
    const workspaceId = selectedWorkspaceId || auth?.workspace?.id;
    if (!workspaceId) {
      toast.error("Select a workspace before pushing to GitHub.");
      return;
    }
    if (!githubAutomationConfig) {
      toast.error("Please configure GitHub repository integration first.");
      return;
    }
    try {
      setIsPushingPlaywright(true);
      const moduleItem = (projectDetail?.modules ?? []).find((item) => item.id === selectedModuleId);
      const requirementItem = (moduleItem?.requirements ?? []).find((item) => item.id === selectedRequirementId);
      const result = await projectApi.pushPlaywrightToGitHub({
        workspaceId,
        fileName,
        playwrightCode: plan.playwright,
        requirementTitle: requirementItem?.title || requirement.slice(0, 80) || "Generated Playwright Tests",
        projectName: projectDetail?.project.name,
        moduleName: moduleItem?.name,
        coverageScore: plan.coverageAnalysis?.score,
        generatedBy: auth?.user.fullName || auth?.user.email,
        version: plan.savedHistoryId ? "Saved history" : "Current generated result",
      });
      toast.success(
        <span>
          Pull Request created successfully:{" "}
          <a className="font-semibold underline" href={result.pullRequestUrl} target="_blank" rel="noreferrer">
            View PR
          </a>
        </span>,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to push Playwright test to GitHub");
    } finally {
      setIsPushingPlaywright(false);
    }
  };

  const runPlaywrightValidation = async (fileName: string) => {
    if (!plan?.playwright) {
      toast.error("Generate Playwright code before running validation.");
      return;
    }
    const workspaceId = selectedWorkspaceId || auth?.workspace?.id;
    const moduleItem = (projectDetail?.modules ?? []).find((item) => item.id === selectedModuleId);
    const requirementItem = (moduleItem?.requirements ?? []).find((item) => item.id === selectedRequirementId);

    try {
      setIsValidatingPlaywright(true);
      const queuedJob = await projectApi.createPlaywrightValidationJob({
        workspaceId,
        projectId: selectedProjectId || undefined,
        moduleId: selectedModuleId || undefined,
        requirementId: selectedRequirementId || undefined,
        requirementTitle: requirementItem?.title || requirement.slice(0, 120) || "Generated Playwright Tests",
        fileName,
        playwrightCode: plan.playwright,
      });
      setPlaywrightValidationJob(queuedJob);

      let latestJob = queuedJob;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        latestJob = await projectApi.getPlaywrightValidationJob(queuedJob.id);
        setPlaywrightValidationJob(latestJob);
        if (["Passed", "Failed", "Warning", "Error"].includes(latestJob.status)) break;
      }

      if (latestJob.status === "Passed") {
        toast.success("AI Test Validation passed");
      } else if (latestJob.status === "Warning") {
        toast.warning("AI Test Validation completed with warnings");
      } else if (latestJob.status === "Failed" || latestJob.status === "Error") {
        toast.error(latestJob.errorMessage || "AI Test Validation found issues to review");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI Test Validation failed");
    } finally {
      setIsValidatingPlaywright(false);
    }
  };

  const applyAuth = (response: AuthResponse | AuthContextResponse) => {
    if ("accessToken" in response) localStorage.setItem("aiqa_access_token", response.accessToken);
    setAuth({
      user: response.user,
      workspace: response.workspace,
      member: response.member,
      role: response.role,
      permissions: response.permissions,
    });
    setActiveView("dashboard");
  };

  const loadProductData = () => {
    void refreshProjects("");
    void refreshHistory({});
    void refreshExportHistory();
    void refreshChatHistory();
    void refreshReviewQueue();
    void refreshExecution("");
    void refreshWorkspace("");
    void refreshAnalytics({});
    void refreshPricing();
    void refreshAIProviders();
    void refreshIntegrations();
  };

  const refreshPricing = async (workspaceId = auth?.workspace?.id) => {
    try {
      setIsPricingLoading(true);
      const planList = await projectApi.listPlans();
      setPlans(planList);
      if (workspaceId) {
        const [current, usage] = await Promise.all([
          projectApi.getCurrentSubscription(workspaceId),
          projectApi.getWorkspaceUsage(workspaceId),
        ]);
        setSubscription(current);
        setWorkspaceUsage(usage);
        setBillingCycle(current.subscription.billingCycle);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load pricing");
    } finally {
      setIsPricingLoading(false);
    }
  };

  const handleLimitExceeded = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Plan limit exceeded.";
    if (!message.includes("Plan limit exceeded")) return false;
    toast.warning(message);
    if (window.confirm(`${message}\n\nOpen Pricing to upgrade your plan?`)) {
      setActiveView("pricing");
    }
    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem("aiqa_access_token");
    if (!token) return;
    projectApi
      .me()
      .then((context) => {
        setAuth(context);
        loadProductData();
      })
      .catch(() => {
        localStorage.removeItem("aiqa_access_token");
        setAuth(null);
      })
      .finally(() => setIsAuthLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadProductData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedProjectId) {
      setProjectDetail(null);
      setSelectedModuleId("");
      setSelectedRequirementId("");
      return;
    }
    void refreshProjects(selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    if (!selectedRequirementId) {
      setHistoryItems([]);
      return;
    }
    projectApi
      .getHistory(selectedRequirementId)
      .then(setHistoryItems)
      .catch(() => setHistoryItems([]));
  }, [selectedRequirementId]);

  const onGenerate = async () => {
    if (requirement.trim().length < 10) {
      toast.error("Please describe the requirement (at least 10 characters).");
      return;
    }
    if (!selectedProjectId || !selectedModuleId) {
      toast.error("Please select a project and module before generating test cases.");
      return;
    }
    try {
      setIsGenerating(true);
      setPlaywrightValidationJob(null);
      const generatedPlan = await generateTestCases({
        requirement,
        testType,
        projectId: selectedProjectId,
        moduleId: selectedModuleId,
        requirementId: selectedRequirementId || undefined,
      });
      setPlan(generatedPlan);
      if (generatedPlan.savedRequirementId) {
        setSelectedRequirementId(generatedPlan.savedRequirementId);
      }
      await refreshProjects(selectedProjectId);
      await refreshHistory();
      await refreshAnalytics(analyticsFilters);
      await refreshPricing();
      toast.success("Test plan generated");
    } catch (error) {
      if (handleLimitExceeded(error)) return;
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />

      <Nav
        theme={theme}
        activeView={activeView}
        onChangeView={setActiveView}
        onToggleTheme={toggleTheme}
        workspaces={workspaces}
        selectedWorkspaceId={selectedWorkspaceId}
        onWorkspaceChange={(workspaceId) => void refreshWorkspace(workspaceId)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapsed={() => setIsSidebarCollapsed((value) => !value)}
        isMobileOpen={isMobileNavOpen}
        onMobileOpenChange={setIsMobileNavOpen}
        auth={auth}
        onSearchOpen={() => setIsGlobalSearchOpen(true)}
        onShortcutsOpen={() => setIsShortcutHelpOpen(true)}
        onLogin={() => setActiveView("login")}
        onProfile={() => setActiveView("settings-profile")}
        onLogout={async () => {
          try {
            await projectApi.logout();
          } catch {
            // Token may already be expired; local cleanup is enough.
          }
          localStorage.removeItem("aiqa_access_token");
          setAuth(null);
          setActiveView("landing");
          toast.success("Logged out");
        }}
      />

      <main
        className={cn(
          "relative min-h-screen px-4 pb-20 pt-24 transition-[padding] duration-300 sm:px-6 md:pb-24 lg:pt-28",
          isSidebarCollapsed ? "lg:pl-28 lg:pr-10" : "lg:pl-80 lg:pr-10",
        )}
      >
        <div className="mx-auto max-w-[1480px] space-y-8">
        {isAuthenticated && !["landing", "login", "signup", "forgot-password", "reset-password"].includes(activeView) && (
          <TrialBanner
            trial={workspaceUsage?.trial ?? subscription?.trial ?? null}
            onUpgrade={() => setActiveView("pricing")}
          />
        )}
        {activeView === "landing" ? (
          <LandingPage
            onStart={() => setActiveView(isAuthenticated ? "generator" : "signup")}
            onBookDemo={() => toast.success("Demo request captured. Sales will follow up shortly.")}
            onPricing={() => setActiveView(isAuthenticated ? "pricing" : "signup")}
          />
        ) : activeView === "login" ? (
          <AuthPage
            mode="login"
            isLoading={isAuthLoading}
            onModeChange={setActiveView}
            onAuthenticated={applyAuth}
          />
        ) : activeView === "signup" ? (
          <AuthPage
            mode="signup"
            isLoading={isAuthLoading}
            onModeChange={setActiveView}
            onAuthenticated={applyAuth}
          />
        ) : activeView === "forgot-password" ? (
          <AuthPage
            mode="forgot-password"
            isLoading={isAuthLoading}
            onModeChange={setActiveView}
            onAuthenticated={applyAuth}
          />
        ) : activeView === "reset-password" ? (
          <AuthPage
            mode="reset-password"
            isLoading={isAuthLoading}
            onModeChange={setActiveView}
            onAuthenticated={applyAuth}
          />
        ) : !isAuthenticated ? (
          <AuthPage
            mode="login"
            isLoading={isAuthLoading}
            onModeChange={setActiveView}
            onAuthenticated={applyAuth}
          />
        ) : activeView === "dashboard" ? (
          <DashboardHomePage
            dashboard={dashboard}
            workspaceUsage={workspaceUsage}
            projects={projects}
            reviewQueue={reviewQueue}
            testRuns={testRuns}
            onNavigate={setActiveView}
          />
        ) : activeView === "profile" || activeView === "settings-profile" ? (
          <ProfilePage
            auth={auth}
            onAuthChange={setAuth}
          />
        ) : activeView === "settings-ai-providers" ? (
          <SettingsSection title="AI Providers" description="Configure default AI, Bring Your Own AI providers, feature model mapping, and usage logs.">
            <AIProvidersSettings
              workspaceId={selectedWorkspaceId || auth?.workspace?.id || ""}
              role={auth.role}
              settings={aiProviderSettings}
              usage={aiProviderUsage}
              isLoading={isAIProviderLoading}
              onRefresh={() => refreshAIProviders(selectedWorkspaceId || auth?.workspace?.id || "")}
            />
          </SettingsSection>
        ) : activeView === "repository-application" ||
          activeView === "repository-automation" ||
          activeView === "repository-activity" ||
          activeView === "repository-impact" ||
          activeView === "repository-playwright" ||
          activeView === "repository-validation-history" ||
          activeView === "repository-release-readiness" ? (
          <RepositoryIntelligencePage
            activeView={activeView}
            workspaceId={selectedWorkspaceId || auth?.workspace?.id || ""}
            role={auth.role}
            config={githubAutomationConfig}
            analysis={repositoryAnalysis}
            syncs={repositorySyncs}
            applicationRepositories={applicationRepositories}
            repositoryActivities={repositoryActivities}
            isLoading={isIntegrationLoading}
            onRefresh={() => refreshIntegrations(selectedWorkspaceId || auth?.workspace?.id || "")}
          />
        ) : activeView === "api-workspace" ? (
          <ApiWorkspacePage
            workspaceId={selectedWorkspaceId || auth?.workspace?.id || ""}
            projects={projects}
            role={auth.role}
          />
        ) : activeView === "pricing" || activeView === "settings-billing" ? (
          <PricingPage
            plans={plans}
            subscription={subscription}
            workspaceUsage={workspaceUsage}
            billingCycle={billingCycle}
            isLoading={isPricingLoading}
            workspaceId={auth?.workspace?.id ?? ""}
            onBillingCycleChange={setBillingCycle}
            onPlanChange={async (planId) => {
              if (!auth?.workspace?.id) {
                toast.error("Workspace is required to change plans.");
                return;
              }
              const updated = await projectApi.updateSubscription({
                workspaceId: auth.workspace.id,
                planId,
                billingCycle,
              });
              setSubscription(updated);
              await refreshPricing(auth.workspace.id);
              toast.success(`Plan updated to ${updated.plan.name}`);
            }}
          />
        ) : activeView === "settings-workspace" ? (
          <TeamWorkspacePage
            workspaces={workspaces}
            selectedWorkspaceId={selectedWorkspaceId}
            detail={workspaceDetail}
            projects={projects}
            workspaceUsage={workspaceUsage}
            isLoading={isWorkspaceLoading}
            onSelectWorkspace={(workspaceId) => void refreshWorkspace(workspaceId)}
            onRefresh={() => {
              void refreshWorkspace(selectedWorkspaceId);
              void refreshPricing(selectedWorkspaceId);
            }}
            onLimitExceeded={handleLimitExceeded}
          />
        ) : activeView === "generator" ? (
          <>
            <Hero />

            <section className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_1fr]">
              <GeneratorCard
                requirement={requirement}
                testType={testType}
                projects={projects}
                projectDetail={projectDetail}
                selectedProjectId={selectedProjectId}
                selectedModuleId={selectedModuleId}
                selectedRequirementId={selectedRequirementId}
                isGenerating={isGenerating}
                onRequirementChange={setRequirement}
                onTestTypeChange={setTestType}
                onProjectChange={(projectId) => {
                  setSelectedProjectId(projectId);
                  setSelectedModuleId("");
                  setSelectedRequirementId("");
                }}
                onModuleChange={(moduleId) => {
                  setSelectedModuleId(moduleId);
                  setSelectedRequirementId("");
                }}
                onRequirementSelect={setSelectedRequirementId}
                onGenerate={onGenerate}
              />

              <FeatureGrid />
            </section>

            <section className="mt-12">
              {isGenerating && <ResultSkeleton />}
              {plan && (
                <Results
                  plan={plan}
                  onExport={
                    plan.savedHistoryId
                      ? (format) =>
                          runExport(format === "excel" ? "Excel" : "PDF", () =>
                            projectApi.exportVersion(plan.savedHistoryId!, format),
                          )
                      : undefined
                  }
                  isExporting={isExporting}
                  githubConfig={githubAutomationConfig}
                  repositoryAnalysis={repositoryAnalysis}
                  isPushingPlaywright={isPushingPlaywright}
                  onPushPlaywright={pushPlaywrightToGitHub}
                  validationJob={playwrightValidationJob}
                  isValidatingPlaywright={isValidatingPlaywright}
                  onValidatePlaywright={runPlaywrightValidation}
                />
              )}
              {!isGenerating && !plan && <EmptyState />}
            </section>
          </>
        ) : activeView === "projects" ? (
          <ProjectsPage
            dashboard={dashboard}
            projects={projects}
            projectDetail={projectDetail}
            selectedProjectId={selectedProjectId}
            selectedModuleId={selectedModuleId}
            selectedRequirementId={selectedRequirementId}
            historyItems={historyItems}
            isLoading={isLoadingProjects}
            isProjectDialogOpen={isProjectDialogOpen}
            onProjectDialogOpenChange={setIsProjectDialogOpen}
            onSelectProject={setSelectedProjectId}
            onSelectModule={setSelectedModuleId}
            onSelectRequirement={setSelectedRequirementId}
            onRefresh={() => {
              void refreshProjects(selectedProjectId);
              void refreshPricing(selectedWorkspaceId || auth?.workspace?.id);
            }}
            isExporting={isExporting}
            onExportRequirement={(requirementId, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () =>
                projectApi.exportRequirement(requirementId, format),
              )
            }
            onExportProject={(projectId, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () =>
                projectApi.exportProject(projectId, format),
              )
            }
            workspaceUsage={workspaceUsage}
            onLimitExceeded={handleLimitExceeded}
          />
        ) : activeView === "history" ? (
          <TestCaseHistoryPage
            projects={projects}
            projectDetail={projectDetail}
            history={allHistory}
            selectedHistoryId={selectedHistoryId}
            filters={historyFilters}
            compareFromId={compareFromId}
            compareToId={compareToId}
            comparison={comparison}
            exportHistory={exportHistory}
            isLoading={isLoadingHistory}
            isExporting={isExporting}
            onSelectHistory={setSelectedHistoryId}
            onSelectProject={(projectId) => {
              setSelectedProjectId(projectId);
              setSelectedModuleId("");
              setSelectedRequirementId("");
            }}
            onFiltersChange={(filters) => {
              setHistoryFilters(filters);
              void refreshHistory(filters);
            }}
            onStatusChange={async (historyId, status) => {
              await projectApi.updateHistoryStatus(historyId, status);
              toast.success("History status updated");
              await refreshHistory(historyFilters);
            }}
            onDelete={async (historyId) => {
              if (!window.confirm("Delete this history version?")) return;
              await projectApi.deleteHistory(historyId);
              toast.success("History record deleted");
              setSelectedHistoryId("");
              await refreshHistory(historyFilters);
            }}
            onSubmitForReview={async (historyId, comment) => {
              await projectApi.submitForReview(historyId, comment);
              toast.success("Submitted for review");
              await refreshHistory(historyFilters);
              await refreshReviewQueue();
            }}
            onCompareFromChange={setCompareFromId}
            onCompareToChange={setCompareToId}
            onCompare={async () => {
              if (!compareFromId || !compareToId) {
                toast.error("Select two versions to compare.");
                return;
              }
              setComparison(await projectApi.compareHistory(compareFromId, compareToId));
            }}
            onExportVersions={(historyIds, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () =>
                projectApi.exportVersions(historyIds, format),
              )
            }
            onExportRequirement={(requirementId, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () =>
                projectApi.exportRequirement(requirementId, format),
              )
            }
            onExportProject={(projectId, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () =>
                projectApi.exportProject(projectId, format),
              )
            }
            onExportFiltered={(filters, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () =>
                projectApi.exportFiltered(filters, format),
              )
            }
          />
        ) : activeView === "review" ? (
          <ReviewQueuePage
            queue={reviewQueue}
            detail={reviewDetail}
            isLoading={isReviewLoading}
            onRefresh={refreshReviewQueue}
            onOpenReview={async (historyId) => {
              setReviewDetail(await projectApi.getReviewDetail(historyId));
            }}
            onApprove={async (historyId, comment) => {
              await projectApi.approveReview(historyId, comment);
              toast.success("Version approved");
              setReviewDetail(await projectApi.getReviewDetail(historyId));
              await refreshReviewQueue();
              await refreshHistory();
            }}
            onRequestChanges={async (historyId, comment) => {
              await projectApi.requestReviewChanges(historyId, comment);
              toast.success("Changes requested");
              setReviewDetail(await projectApi.getReviewDetail(historyId));
              await refreshReviewQueue();
              await refreshHistory();
            }}
            onReject={async (historyId, comment) => {
              await projectApi.rejectReview(historyId, comment);
              toast.success("Version rejected");
              setReviewDetail(await projectApi.getReviewDetail(historyId));
              await refreshReviewQueue();
              await refreshHistory();
            }}
            onComment={async (historyId, comment) => {
              await projectApi.addReviewComment(historyId, comment);
              toast.success("Comment added");
              setReviewDetail(await projectApi.getReviewDetail(historyId));
            }}
          />
        ) : activeView === "execution" ? (
          <TestExecutionPage
            projects={projects}
            projectDetail={projectDetail}
            selectedProjectId={selectedProjectId}
            selectedModuleId={selectedModuleId}
            selectedRequirementId={selectedRequirementId}
            testRuns={testRuns}
            selectedTestRunId={selectedTestRunId}
            detail={testRunDetail}
            approvedVersions={approvedExecutionVersions}
            dashboard={executionDashboard}
            historyItems={executionHistoryItems}
            isLoading={isExecutionLoading}
            currentUserName={auth?.user.fullName ?? "Current User"}
            onProjectChange={(projectId) => {
              setSelectedProjectId(projectId);
              setSelectedModuleId("");
              setSelectedRequirementId("");
            }}
            onModuleChange={(moduleId) => {
              setSelectedModuleId(moduleId);
              setSelectedRequirementId("");
            }}
            onRequirementChange={setSelectedRequirementId}
            onRefresh={() => refreshExecution(selectedTestRunId)}
            onCreateRun={async (input) => {
              const run = await projectApi.createTestRun(input);
              toast.success("Test run created");
              await refreshExecution(run.id);
            }}
            onSelectRun={async (runId) => {
              setSelectedTestRunId(runId);
              setTestRunDetail(await projectApi.getTestRun(runId));
              setExecutionHistoryItems([]);
            }}
            onDeleteRun={async (runId) => {
              if (!window.confirm("Delete this test run?")) return;
              await projectApi.deleteTestRun(runId);
              toast.success("Test run deleted");
              await refreshExecution("");
            }}
            onUpdateExecution={async (execution, draft) => {
              await projectApi.updateTestExecutionStatus(execution.id, {
                status: draft.status,
                actualResult: draft.actualResult,
                comments: draft.comments,
                bugId: draft.bugId,
                jiraBugId: draft.jiraBugId,
                jiraBugUrl: draft.jiraBugUrl,
                screenshotUrl: draft.screenshotUrl,
                videoUrl: draft.videoUrl,
                logUrl: draft.logUrl,
                executionTime: draft.executionTime ? Number(draft.executionTime) : undefined,
                browser: draft.browser || undefined,
                operatingSystem: draft.operatingSystem || undefined,
                buildNumber: draft.buildNumber,
                environment: draft.environment || undefined,
                updatedBy: auth?.user.fullName ?? "Current User",
              });
              toast.success("Execution updated");
              if (selectedTestRunId) setTestRunDetail(await projectApi.getTestRun(selectedTestRunId));
              setExecutionDashboard(await projectApi.getTestExecutionDashboard());
            }}
            onLoadExecutionHistory={async (executionId) => {
              setExecutionHistoryItems(await projectApi.getTestExecutionHistory(executionId));
            }}
            onExportRun={(runId, format) =>
              runExport(format === "excel" ? "Excel" : "PDF", () => projectApi.exportTestRunReport(runId, format))
            }
          />
        ) : activeView === "chat" ? (
          <AIChatPage
            projects={projects}
            projectDetail={projectDetail}
            selectedProjectId={selectedProjectId}
            selectedModuleId={selectedModuleId}
            selectedRequirementId={selectedRequirementId}
            activeChat={activeChat}
            chatHistory={chatHistory}
            message={chatMessage}
            isLoading={isChatLoading}
            onProjectChange={(projectId) => {
              setSelectedProjectId(projectId);
              setSelectedModuleId("");
              setSelectedRequirementId("");
              setSelectedChatHistoryVersionId("");
              setActiveChat(null);
            }}
            onModuleChange={(moduleId) => {
              setSelectedModuleId(moduleId);
              setSelectedRequirementId("");
              setSelectedChatHistoryVersionId("");
              setActiveChat(null);
            }}
            onRequirementChange={(requirementId) => {
              setSelectedRequirementId(requirementId);
              setSelectedChatHistoryVersionId("");
              setActiveChat(null);
            }}
            onMessageChange={setChatMessage}
            onSend={async (prompt) => {
              const userMessage = prompt ?? chatMessage;
              if (!selectedProjectId || !selectedModuleId || !selectedRequirementId) {
                toast.error("Select project, module, and requirement before chatting.");
                return;
              }
              if (!userMessage.trim()) return;
              try {
                setIsChatLoading(true);
                const chat = await projectApi.sendAIChatMessage({
                  chatId: activeChat?.id,
                  projectId: selectedProjectId,
                  moduleId: selectedModuleId,
                  requirementId: selectedRequirementId,
                  historyVersionId: activeChat?.historyVersionId || selectedChatHistoryVersionId || undefined,
                  userMessage,
                });
                setActiveChat(chat);
                setSelectedChatHistoryVersionId(chat.historyVersionId ?? selectedChatHistoryVersionId);
                setChatMessage("");
                await refreshChatHistory();
                await refreshPricing(selectedWorkspaceId || auth?.workspace?.id);
              } catch (error) {
                if (handleLimitExceeded(error)) return;
                toast.error(error instanceof Error ? error.message : "AI chat failed");
              } finally {
                setIsChatLoading(false);
              }
            }}
            onOpenChat={async (chatId) => {
              try {
                const chat = await projectApi.getAIChat(chatId);
                setActiveChat(chat);
                setSelectedChatHistoryVersionId(chat.historyVersionId ?? "");
                setSelectedProjectId(chat.projectId);
                setSelectedModuleId(chat.moduleId);
                setSelectedRequirementId(chat.requirementId);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to open chat");
              }
            }}
            onDeleteChat={async (chatId) => {
              if (!window.confirm("Delete this AI chat?")) return;
              await projectApi.deleteAIChat(chatId);
              if (activeChat?.id === chatId) setActiveChat(null);
              await refreshChatHistory();
              toast.success("Chat deleted");
            }}
            onNewChat={() => {
              setActiveChat(null);
              setChatMessage("");
              setSelectedChatHistoryVersionId("");
            }}
            selectedHistoryVersionId={selectedChatHistoryVersionId}
            onHistoryVersionChange={setSelectedChatHistoryVersionId}
            onSaveAsVersion={async () => {
              if (!activeChat) return;
              try {
                const history = await projectApi.saveChatAsVersion(activeChat.id, activeChat.historyVersionId);
                toast.success(`Saved as Version ${history.version}`);
                await refreshHistory();
                await refreshPricing(selectedWorkspaceId || auth?.workspace?.id);
              } catch (error) {
                if (handleLimitExceeded(error)) return;
                toast.error(error instanceof Error ? error.message : "Failed to save version");
              }
            }}
          />
        ) : activeView === "analytics" ? (
          <AnalyticsDashboardPage
            analytics={analytics}
            filters={analyticsFilters}
            workspaces={workspaces}
            selectedWorkspaceId={selectedWorkspaceId}
            projects={projects}
            projectDetail={projectDetail}
            isLoading={isAnalyticsLoading}
            onFiltersChange={(filters) => {
              setAnalyticsFilters(filters);
              void refreshAnalytics(filters);
            }}
            onRefresh={() => refreshAnalytics(analyticsFilters)}
          />
        ) : (
          <TeamWorkspacePage
            workspaces={workspaces}
            selectedWorkspaceId={selectedWorkspaceId}
            detail={workspaceDetail}
            projects={projects}
            workspaceUsage={workspaceUsage}
            isLoading={isWorkspaceLoading}
            onSelectWorkspace={(workspaceId) => void refreshWorkspace(workspaceId)}
            onRefresh={() => {
              void refreshWorkspace(selectedWorkspaceId);
              void refreshPricing(selectedWorkspaceId);
            }}
            onLimitExceeded={handleLimitExceeded}
          />
        )}
        </div>
      </main>

      <Dialog open={isGlobalSearchOpen} onOpenChange={setIsGlobalSearchOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b border-border/40 p-4">
            <DialogTitle className="flex items-center gap-2">
              <Search className="size-4 text-primary" />
              Global Search
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/50 px-3 py-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                autoFocus
                value={globalSearchQuery}
                onChange={(event) => setGlobalSearchQuery(event.target.value)}
                placeholder="Search projects, requirements, test cases, repositories, validation runs..."
                className="h-8 border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </div>
            <div className="mt-4 max-h-[52vh] space-y-2 overflow-y-auto pr-1">
              {filteredSearchItems.length ? filteredSearchItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={`${item.group}-${item.title}-${item.description}`}
                    type="button"
                    onClick={() => {
                      setActiveView(item.view);
                      setIsGlobalSearchOpen(false);
                      setGlobalSearchQuery("");
                    }}
                    className="flex w-full items-start gap-3 rounded-lg border border-border/40 bg-card/70 p-3 text-left transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">{item.group}</span>
                      <span className="block truncate font-semibold">{item.title}</span>
                      <span className="block truncate text-sm text-muted-foreground">{item.description}</span>
                    </span>
                  </button>
                );
              }) : (
                <ProfessionalEmptyState
                  icon={Search}
                  title="No search results"
                  message="Try searching for a project, requirement, repository event, validation run, team member, or settings page."
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShortcutHelpOpen} onOpenChange={setIsShortcutHelpOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="size-4 text-primary" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {[
              ["/", "Open global search"],
              ["?", "Open shortcut help"],
              ["g d", "Go to Dashboard"],
              ["g p", "Go to Projects"],
              ["g r", "Go to Repository Intelligence"],
              ["g v", "Go to Validation History"],
              ["g a", "Go to Analytics"],
              ["n p", "Create new project"],
              ["n t", "Generate new test"],
              ["Esc", "Close modal or drawer"],
            ].map(([shortcut, description]) => (
              <div key={shortcut} className="flex items-center justify-between gap-4 rounded-lg border border-border/40 bg-surface/40 px-3 py-2">
                <span className="text-sm text-muted-foreground">{description}</span>
                <kbd className="rounded border border-border/60 bg-background px-2 py-1 text-xs font-semibold">{shortcut}</kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster richColors theme={theme} position="top-right" />
    </div>
  );
}

function Nav({
  theme,
  activeView,
  onChangeView,
  onToggleTheme,
  workspaces,
  selectedWorkspaceId,
  onWorkspaceChange,
  isCollapsed,
  onToggleCollapsed,
  isMobileOpen,
  onMobileOpenChange,
  auth,
  onSearchOpen,
  onShortcutsOpen,
  onLogin,
  onProfile,
  onLogout,
}: {
  theme: Theme;
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  onToggleTheme: () => void;
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  isMobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  auth: AuthContextResponse | null;
  onSearchOpen: () => void;
  onShortcutsOpen: () => void;
  onLogin: () => void;
  onProfile: () => void;
  onLogout: () => void;
}) {
  const navigate = (view: ActiveView) => {
    onChangeView(view);
    onMobileOpenChange(false);
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-border/50 bg-card/80 shadow-card backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        <SidebarHeader isCollapsed={isCollapsed} onToggleCollapsed={onToggleCollapsed} />

        <SidebarMenu activeView={activeView} isCollapsed={isCollapsed} onNavigate={navigate} />
        <SidebarFooter auth={auth} isCollapsed={isCollapsed} />
      </aside>

      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={() => onMobileOpenChange(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-border/50 bg-card/95 shadow-card backdrop-blur-xl transition-transform lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarHeader mobile />
        <SidebarMenu activeView={activeView} compact onNavigate={navigate} />
      </aside>

      <TopHeader
        theme={theme}
        isCollapsed={isCollapsed}
        auth={auth}
        onMobileOpen={() => onMobileOpenChange(true)}
        onToggleTheme={onToggleTheme}
        onSearchOpen={onSearchOpen}
        onShortcutsOpen={onShortcutsOpen}
        onLogin={onLogin}
        onProfile={onProfile}
        onLogout={onLogout}
      />
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
  );
}

function TrialBanner({
  trial,
  onUpgrade,
}: {
  trial: WorkspaceUsageResponse["trial"] | null | undefined;
  onUpgrade: () => void;
}) {
  if (!trial || trial.status !== "Active") return null;
  return (
    <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-primary shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
            <Rocket className="size-4" />
          </span>
          <div>
            <p className="font-semibold">Your Pro trial expires in {trial.daysRemaining} days.</p>
            <p className="mt-1 text-sm text-primary/80">
              Trial ends on {formatDate(trial.endsAt)}. Upgrade anytime to keep Pro features active.
            </p>
          </div>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={onUpgrade}>
          Upgrade
        </Button>
      </div>
    </div>
  );
}

function statusClass(status: EntityStatus) {
  return status === "Active"
    ? "border-success/40 bg-success/10 text-success"
    : "border-muted-foreground/30 bg-muted/30 text-muted-foreground";
}

function modulePriorityClass(priority: ModulePriority) {
  switch (priority) {
    case "Critical":
      return "border-destructive/60 bg-destructive/15 text-destructive";
    case "High":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Medium":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-success/40 bg-success/10 text-success";
  }
}

function GeneratorCard({
  requirement,
  testType,
  projects,
  projectDetail,
  selectedProjectId,
  selectedModuleId,
  selectedRequirementId,
  isGenerating,
  onRequirementChange,
  onTestTypeChange,
  onProjectChange,
  onModuleChange,
  onRequirementSelect,
  onGenerate,
}: {
  requirement: string;
  testType: "functional" | "api" | "ui" | "integration";
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
  selectedProjectId: string;
  selectedModuleId: string;
  selectedRequirementId: string;
  isGenerating: boolean;
  onRequirementChange: (value: string) => void;
  onTestTypeChange: (value: "functional" | "api" | "ui" | "integration") => void;
  onProjectChange: (value: string) => void;
  onModuleChange: (value: string) => void;
  onRequirementSelect: (value: string) => void;
  onGenerate: () => void;
}) {
  const modules = projectDetail?.modules.filter((moduleItem) => moduleItem.status === "Active") ?? [];
  const requirements =
    projectDetail?.requirements.filter((item) => item.moduleId === selectedModuleId) ?? [];

  return (
    <Card className="max-w-full overflow-hidden border-border/50 bg-card/70 p-6 backdrop-blur-xl shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Input</h2>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Project</label>
          <Select value={selectedProjectId} onValueChange={onProjectChange}>
            <SelectTrigger className="border-border/60 bg-input/40">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Module</label>
          <Select value={selectedModuleId} onValueChange={onModuleChange} disabled={!selectedProjectId}>
            <SelectTrigger className="border-border/60 bg-input/40">
              <SelectValue placeholder="Select module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((moduleItem) => (
                <SelectItem key={moduleItem.id} value={moduleItem.id}>
                  {moduleItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_160px]">
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Existing requirement
          </label>
          <Select
            value={selectedRequirementId || "new"}
            onValueChange={(value) => onRequirementSelect(value === "new" ? "" : value)}
            disabled={!selectedModuleId}
          >
            <SelectTrigger className="border-border/60 bg-input/40">
              <SelectValue placeholder="New requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New requirement</SelectItem>
              {requirements.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Test focus</label>
          <Select value={testType} onValueChange={(v) => onTestTypeChange(v as typeof testType)}>
            <SelectTrigger className="border-border/60 bg-input/40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="functional">Functional</SelectItem>
              <SelectItem value="ui">UI / UX</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="integration">Integration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="mb-2 block text-xs font-medium text-muted-foreground">
        User story, requirement, or acceptance criteria
      </label>
      <Textarea
        value={requirement}
        onChange={(e) => onRequirementChange(e.target.value)}
        placeholder="As a user, I want to ... so that ..."
        className="min-h-[260px] resize-y border-border/60 bg-input/40 font-mono text-sm leading-relaxed focus-visible:ring-primary"
      />

      <div className="mt-4 flex justify-end">
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          size="lg"
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate & Save Test Cases
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

function DashboardHomePage({
  dashboard,
  workspaceUsage,
  projects,
  reviewQueue,
  testRuns,
  onNavigate,
}: {
  dashboard: DashboardStats | null;
  workspaceUsage: WorkspaceUsageResponse | null;
  projects: ProjectSummary[];
  reviewQueue: TestCaseHistoryRecord[];
  testRuns: TestRunSummary[];
  onNavigate: (view: ActiveView) => void;
}) {
  const recentProjects = projects.slice(0, 4);
  const activeRuns = testRuns.filter((run) => run.status !== "Completed").slice(0, 4);

  return (
    <div className="max-w-full overflow-hidden space-y-6">
      <div className="flex max-w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <LayoutDashboard className="mr-1 size-3" /> Dashboard
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Workspace Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor QA coverage, projects, reviews, execution progress, and workspace usage from one place.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2">
          <Button variant="outline" onClick={() => onNavigate("projects")}>
            <FolderKanban className="size-4" />
            Projects
          </Button>
          <Button className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={() => onNavigate("generator")}>
            <Wand2 className="size-4" />
            Generate Tests
          </Button>
        </div>
      </div>

      <DashboardCards dashboard={dashboard} />
      <WorkspaceUsageDashboard usage={workspaceUsage} />

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recently Updated Projects</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("projects")}>View all</Button>
          </div>
          <div className="space-y-3">
            {recentProjects.length ? recentProjects.map((project) => (
              <div key={project.id} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                <p className="font-medium">{project.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {project.totalRequirements} requirements / {project.totalTestCases} test cases
                </p>
              </div>
            )) : (
              <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                No projects yet. Create a project to start organizing QA work.
              </p>
            )}
          </div>
        </Card>

        <Card className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Pending Reviews</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("review")}>Open queue</Button>
          </div>
          <div className="space-y-3">
            {reviewQueue.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                <p className="font-medium">{item.requirementTitle}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Version {item.version} / {item.coverageScore}% coverage
                </p>
              </div>
            ))}
            {!reviewQueue.length && (
              <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                No review requests are pending.
              </p>
            )}
          </div>
        </Card>

        <Card className="app-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Active Test Runs</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("execution")}>View runs</Button>
          </div>
          <div className="space-y-3">
            {activeRuns.length ? activeRuns.map((run) => (
              <div key={run.id} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{run.name}</p>
                  <Badge variant="outline" className={executionStatusClass(run.status)}>{run.status}</Badge>
                </div>
                <Progress value={run.progress} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">{run.passRate}% pass rate</p>
              </div>
            )) : (
              <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                No active test runs yet.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProjectsPage({
  dashboard,
  projects,
  projectDetail,
  workspaceUsage,
  selectedProjectId,
  selectedModuleId,
  selectedRequirementId,
  historyItems,
  isLoading,
  isProjectDialogOpen,
  onProjectDialogOpenChange,
  onSelectProject,
  onSelectModule,
  onSelectRequirement,
  onRefresh,
  isExporting,
  onExportRequirement,
  onExportProject,
  onLimitExceeded,
}: {
  dashboard: DashboardStats | null;
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
  workspaceUsage: WorkspaceUsageResponse | null;
  selectedProjectId: string;
  selectedModuleId: string;
  selectedRequirementId: string;
  historyItems: TestCaseGenerationHistory[];
  isLoading: boolean;
  isProjectDialogOpen: boolean;
  onProjectDialogOpenChange: (open: boolean) => void;
  onSelectProject: (projectId: string) => void;
  onSelectModule: (moduleId: string) => void;
  onSelectRequirement: (requirementId: string) => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExportRequirement: (requirementId: string, format: ExportFormat) => void;
  onExportProject: (projectId: string, format: ExportFormat) => void;
  onLimitExceeded: (error: unknown) => boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <LayoutDashboard className="mr-1 size-3" /> Project management
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Organize generated test cases by project, module, requirement, and version history.
          </p>
        </div>
        <ProjectDialog
          open={isProjectDialogOpen}
          onOpenChange={onProjectDialogOpenChange}
          onCreated={(project) => {
            onSelectProject(project.id);
            onRefresh();
          }}
          onLimitExceeded={onLimitExceeded}
        />
      </div>

      <DashboardCards dashboard={dashboard} />
      <WorkspaceUsageDashboard usage={workspaceUsage} />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ProjectList
          projects={projects}
          selectedProjectId={selectedProjectId}
          isLoading={isLoading}
          onSelectProject={onSelectProject}
          onRefresh={onRefresh}
        />
        <ProjectDetailPanel
          detail={projectDetail}
          selectedModuleId={selectedModuleId}
          selectedRequirementId={selectedRequirementId}
          historyItems={historyItems}
          onSelectModule={onSelectModule}
          onSelectRequirement={onSelectRequirement}
          onRefresh={onRefresh}
          isExporting={isExporting}
          onExportRequirement={onExportRequirement}
          onExportProject={onExportProject}
          onLimitExceeded={onLimitExceeded}
        />
      </div>
    </div>
  );
}

function DashboardCards({ dashboard }: { dashboard: DashboardStats | null }) {
  const items = [
    { label: "Total Projects", value: dashboard?.totalProjects ?? 0, icon: FolderKanban, trend: "Portfolio scope" },
    { label: "Active Projects", value: dashboard?.activeProjects ?? 0, icon: CheckCircle2, trend: "Ready for delivery" },
    { label: "Modules", value: dashboard?.totalModules ?? 0, icon: Boxes, trend: "Product areas" },
    { label: "Requirements", value: dashboard?.totalRequirements ?? 0, icon: FileText, trend: "Tracked stories" },
    { label: "Test Cases", value: dashboard?.totalTestCases ?? 0, icon: ClipboardCheck, trend: "Generated coverage" },
    { label: "Avg Coverage", value: `${dashboard?.averageTestCoverageScore ?? 0}%`, icon: Gauge, trend: "Quality signal" },
    { label: "Pending Reviews", value: dashboard?.pendingReviews ?? 0, icon: ClipboardList, trend: "Needs lead action" },
    { label: "Approved", value: dashboard?.approvedTestCases ?? 0, icon: CheckCircle2, trend: "Export-ready" },
    { label: "Changes Requested", value: dashboard?.changesRequested ?? 0, icon: AlertTriangle, trend: "Iteration needed" },
    { label: "Rejected", value: dashboard?.rejectedItems ?? 0, icon: XCircle, trend: "Blocked versions" },
    {
      label: "Avg Approval Time",
      value: `${dashboard?.averageApprovalTimeHours ?? 0}h`,
      icon: CalendarDays,
      trend: "Review velocity",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      {items.map(({ label, value, icon: Icon, trend }) => (
        <Card key={label} className="app-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="size-3 text-success" />
            {trend}
          </p>
        </Card>
      ))}
    </div>
  );
}

function WorkspaceUsageDashboard({ usage }: { usage: WorkspaceUsageResponse | null }) {
  if (!usage) return null;

  const items = [
    { label: "Workspaces", metric: usage.usage.workspaces, icon: Layers },
    { label: "Members", metric: usage.usage.members, icon: Users },
    { label: "Active Users", metric: usage.usage.activeUsers, icon: UserCircle },
    { label: "Projects", metric: usage.usage.projects, icon: FolderKanban },
    { label: "Requirements", metric: usage.usage.requirements, icon: FileText },
    { label: "AI Generations", metric: usage.usage.aiGenerations, icon: Sparkles },
    { label: "AI Chat Messages", metric: usage.usage.aiChatMessages, icon: MessageSquare },
    { label: "Exports", metric: usage.usage.exports, icon: Download },
    { label: "Storage", metric: usage.usage.storage, icon: Database, unit: "MB" },
  ];
  const warnings = items.filter(({ metric }) => {
    if (metric.limit === "unlimited" || metric.limit === 0) return false;
    return metric.used / metric.limit >= 0.8;
  });

  return (
    <Card className="app-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">Workspace Usage</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current limits for the {usage.plan.name} plan.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
          {usage.plan.name}
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ label, metric, icon: Icon, unit }) => {
          const isUnlimited = metric.limit === "unlimited";
          const percent = isUnlimited || metric.limit === 0 ? 8 : Math.min(100, Math.round((metric.used / metric.limit) * 100));
          const isFull = !isUnlimited && metric.used >= metric.limit;
          const usedText = unit ? `${metric.used} ${unit}` : metric.used;
          const limitText = isUnlimited ? "Unlimited" : unit ? `${metric.limit} ${unit}` : metric.limit;
          return (
            <div key={label} className="rounded-lg border border-border/50 bg-surface/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <span className={cn("text-sm font-semibold", isFull && "text-destructive")}>
                  {usedText} / {limitText}
                </span>
              </div>
              <Progress value={percent} className="mt-3 h-2" />
            </div>
          );
        })}
      </div>
      {warnings.length > 0 && (
        <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Usage warning</p>
              <p className="mt-1">
                {warnings.map((item) => item.label).join(", ")} {warnings.length === 1 ? "is" : "are"} above 80% of the monthly quota.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function TrialDashboard({
  trial,
  onUpgrade,
}: {
  trial: WorkspaceUsageResponse["trial"] | null | undefined;
  onUpgrade: () => void;
}) {
  if (!trial) return null;
  const isActive = trial.status === "Active";
  return (
    <Card className="app-card p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge variant="outline" className={cn(isActive ? "border-primary/40 bg-primary/10 text-primary" : "border-muted-foreground/30")}>
            {trial.status === "Active" ? "Pro Trial" : `Trial ${trial.status}`}
          </Badge>
          <h2 className="mt-3 font-display text-2xl font-semibold">Trial Dashboard</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track your trial window and the Pro features currently available to this workspace.
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-surface/40 p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground">Days Remaining</p>
          <p className="mt-1 font-display text-4xl font-bold">{trial.daysRemaining}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MiniStat label="Trial Start Date" value={formatDate(trial.startsAt)} />
        <MiniStat label="Trial End Date" value={formatDate(trial.endsAt)} />
        <MiniStat label="Trial Behavior" value={isActive ? "Downgrades to Free on expiry" : "Free plan active"} />
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold">Features Available</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {trial.featuresAvailable.map((feature) => (
            <div key={feature} className="flex items-center gap-2 rounded-lg border border-border/40 bg-surface/30 px-3 py-2 text-sm">
              <CheckCircle2 className="size-4 text-success" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Button className="mt-5 bg-gradient-primary text-primary-foreground shadow-glow" onClick={onUpgrade}>
        Upgrade Plan
      </Button>
    </Card>
  );
}

function ProjectDialog({
  open,
  onOpenChange,
  onCreated,
  onLimitExceeded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (project: ProjectSummary) => void;
  onLimitExceeded: (error: unknown) => boolean;
}) {
  const [form, setForm] = useState<CreateProjectInput>({
    name: "",
    description: "",
    domain: "SaaS",
    status: "Active",
  });
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Project name and description are required.");
      return;
    }
    try {
      setIsSaving(true);
      const project = await projectApi.createProject(form);
      toast.success("Project created");
      setForm({ name: "", description: "", domain: "SaaS", status: "Active" });
      onOpenChange(false);
      onCreated(project);
    } catch (error) {
      if (onLimitExceeded(error)) return;
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
          <Plus className="size-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border/60 bg-card">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Project Name
            </label>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Customer Portal QA"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Regression coverage for the customer-facing portal"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Domain / Category
            </label>
            <Select
              value={form.domain}
              onValueChange={(domain) =>
                setForm((current) => ({ ...current, domain: domain as ProjectDomain }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Banking", "Healthcare", "E-commerce", "SaaS", "Education", "Custom"].map(
                  (domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={submit} disabled={isSaving} className="w-full">
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            Save Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectList({
  projects,
  selectedProjectId,
  isLoading,
  onSelectProject,
  onRefresh,
}: {
  projects: ProjectSummary[];
  selectedProjectId: string;
  isLoading: boolean;
  onSelectProject: (projectId: string) => void;
  onRefresh: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const visibleProjects = projects.filter((project) =>
    [project.name, project.description, project.domain].join(" ").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const archiveProject = async (projectId: string) => {
    if (!window.confirm("Archive this project?")) return;
    await projectApi.archiveProject(projectId);
    toast.success("Project archived");
    onRefresh();
  };

  const deleteProject = async (projectId: string) => {
    if (!window.confirm("Delete this project and all modules, requirements, and history?")) return;
    await projectApi.deleteProject(projectId);
    toast.success("Project deleted");
    onSelectProject("");
    onRefresh();
  };
  return (
    <Card className="app-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderKanban className="size-4 text-primary" />
          <h2 className="text-base font-semibold">All Projects</h2>
        </div>
        {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      </div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border/50 bg-surface/50 px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search projects"
          className="h-7 border-0 bg-transparent px-0 focus-visible:ring-0"
        />
      </div>
      {projects.length === 0 ? (
        <ProfessionalEmptyState
          icon={FolderKanban}
          title="No projects found"
          message="Create a project to organize modules, requirements, generated versions, and review workflows."
          actionLabel="Create from top action"
        />
      ) : visibleProjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
          <FolderKanban className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No projects match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleProjects.map((project) => {
            const health = project.totalTestCases === 0 ? "Needs Attention" : project.status === "Active" ? "Healthy" : "Archived";
            return (
              <div
                key={project.id}
                className={cn(
                  "rounded-lg border bg-surface/40 p-4 transition-colors",
                  selectedProjectId === project.id
                    ? "border-primary/50"
                    : "border-border/40 hover:border-primary/30",
                )}
              >
                <button type="button" onClick={() => onSelectProject(project.id)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge variant="outline" className={cn("text-xs", health === "Healthy" ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning")}>
                          {health}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", statusClass(project.status))}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <span>{project.totalModules} modules</span>
                    <span>{project.totalRequirements} reqs</span>
                    <span>{project.totalTestCases} tests</span>
                    <span>{project.domain}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    Updated {formatDate(project.lastUpdatedAt)}
                  </div>
                </button>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => archiveProject(project.id)}>
                    <Archive className="size-3.5" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteProject(project.id)}>
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function ProjectDetailPanel({
  detail,
  selectedModuleId,
  selectedRequirementId,
  historyItems,
  onSelectModule,
  onSelectRequirement,
  onRefresh,
  isExporting,
  onExportRequirement,
  onExportProject,
  onLimitExceeded,
}: {
  detail: ProjectDetail | null;
  selectedModuleId: string;
  selectedRequirementId: string;
  historyItems: TestCaseGenerationHistory[];
  onSelectModule: (moduleId: string) => void;
  onSelectRequirement: (requirementId: string) => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExportRequirement: (requirementId: string, format: ExportFormat) => void;
  onExportProject: (projectId: string, format: ExportFormat) => void;
  onLimitExceeded: (error: unknown) => boolean;
}) {
  if (!detail) {
    return (
      <Card className="border-dashed border-border/50 bg-card/30 p-10 text-center backdrop-blur">
        <Eye className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Select a project to view details.</p>
      </Card>
    );
  }

  const selectedModule = detail.modules.find((item) => item.id === selectedModuleId);
  const moduleRequirements = detail.requirements.filter((item) => item.moduleId === selectedModuleId);
  const selectedRequirement = detail.requirements.find((item) => item.id === selectedRequirementId);
  const latestCoverage =
    detail.histories.length > 0
      ? Math.round(
          detail.histories.reduce((total, item) => total + item.coverageScore, 0) /
            detail.histories.length,
        )
      : 0;

  return (
    <div className="space-y-4">
      <Card className="max-w-full overflow-hidden border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{detail.project.name}</h2>
              <Badge variant="outline" className={cn("text-xs", statusClass(detail.project.status))}>
                {detail.project.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{detail.project.description}</p>
          </div>
          <Badge variant="outline">{detail.project.domain}</Badge>
          <ExportDropdown
            label="Export Project"
            disabled={isExporting}
            onExport={(format) => onExportProject(detail.project.id, format)}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <MiniStat label="Modules" value={detail.modules.length} />
          <MiniStat label="Requirements" value={detail.requirements.length} />
          <MiniStat label="Versions" value={detail.histories.length} />
          <MiniStat label="Avg Coverage" value={`${latestCoverage}%`} />
        </div>
      </Card>

      <ModuleManager
        projectId={detail.project.id}
        modules={detail.modules}
        selectedModuleId={selectedModuleId}
        onSelectModule={onSelectModule}
        onRefresh={onRefresh}
      />

      <RequirementManager
        projectId={detail.project.id}
        selectedModule={selectedModule}
        requirements={moduleRequirements}
        selectedRequirementId={selectedRequirementId}
        onSelectRequirement={onSelectRequirement}
        onRefresh={onRefresh}
        isExporting={isExporting}
        onExportRequirement={onExportRequirement}
        onLimitExceeded={onLimitExceeded}
      />

      <HistoryPanel selectedRequirement={selectedRequirement} historyItems={historyItems} />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-0 rounded-lg border border-border/40 bg-surface/40 p-3">
      <p className="truncate text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-display text-xl font-semibold">{value}</p>
    </div>
  );
}

function RiskBadge({ risk }: { risk: ApiRiskLevel }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        risk === "High" && "border-red-200 bg-red-50 text-red-700",
        risk === "Medium" && "border-amber-200 bg-amber-50 text-amber-700",
        risk === "Low" && "border-emerald-200 bg-emerald-50 text-emerald-700",
      )}
    >
      {risk}
    </Badge>
  );
}

function ApiValidationStatusBadge({ status }: { status: ApiValidationRun["status"] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        status === "Passed" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "Running" && "border-blue-200 bg-blue-50 text-blue-700",
        status === "Queued" && "border-slate-200 bg-slate-50 text-slate-700",
        status === "Cancelled" && "border-orange-200 bg-orange-50 text-orange-700",
        status === "Failed" && "border-red-200 bg-red-50 text-red-700",
        status === "Error" && "border-red-300 bg-red-100 text-red-900",
      )}
    >
      {status}
    </Badge>
  );
}

function ImpactList({ title, items, empty = "None detected" }: { title: string; items: string[]; empty?: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.length ? items.slice(0, 12).map((item) => (
          <Badge key={item} variant="outline" className="max-w-full truncate">
            {item}
          </Badge>
        )) : <span className="text-sm text-muted-foreground">{empty}</span>}
      </div>
    </div>
  );
}

function formatValidationDuration(durationMs?: number) {
  const totalSeconds = Math.max(0, Math.round((durationMs ?? 0) / 1000));
  if (totalSeconds < 60) return `${totalSeconds} seconds`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min${minutes > 1 ? "s" : ""}${seconds ? ` ${seconds} sec` : ""}`;
}

function formatValidationMode(mode?: RepositoryValidationMode) {
  if (!mode) return "Quick";
  return `${mode[0].toUpperCase()}${mode.slice(1)}`;
}

function validationModeEstimate(mode?: RepositoryValidationMode) {
  if (mode === "full") return "~2 minutes";
  if (mode === "impact") return "~30 seconds";
  return "~15 seconds";
}

function validationModeDescription(mode?: RepositoryValidationMode) {
  if (mode === "full") return "Runs the complete Playwright suite.";
  if (mode === "impact") return "Runs impacted tests detected by Repository Intelligence.";
  return "Runs only newly generated or approved Playwright updates.";
}

function normalizeValidationBrowser(run?: RepositoryValidationRun | null) {
  const browser = run?.browser?.trim();
  if (browser && !/github actions|local runner|backend/i.test(browser)) return browser;
  const source = [
    run?.command,
    run?.logs,
    run?.stdout,
    ...(run?.validationDebugLogs ?? []).flatMap((step) => [step.command, step.stdout, step.stderr]),
  ].filter(Boolean).join("\n");
  const match = source.match(/(?:Browser|VALIDATION_BROWSER)[:=]\s*(chromium|firefox|webkit|all)/i);
  if (match?.[1]) return match[1].toLowerCase();
  return run?.validationProvider === "github-actions" ? "chromium" : browser || "-";
}

function validationProviderLabel(provider?: RepositoryValidationRun["validationProvider"]) {
  if (provider === "github-actions") return "GitHub Actions";
  if (provider === "local-runner") return "Local Runner";
  if (provider === "backend-fallback") return "Local Runner Fallback";
  return "-";
}

function validationStatusClass(status?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === "passed" || normalized === "success") return "border-success/30 bg-success/10 text-success";
  if (normalized === "running" || normalized === "pending") return "border-primary/30 bg-primary/10 text-primary";
  if (normalized === "queued") return "border-muted-foreground/30 bg-muted text-muted-foreground";
  if (normalized === "cancelled" || normalized === "canceled") return "border-warning/30 bg-warning/10 text-warning";
  if (normalized === "failed" || normalized === "failure") return "border-destructive/30 bg-destructive/10 text-destructive";
  if (normalized === "error") return "border-red-950 bg-red-950/10 text-red-900";
  return "border-border/60 bg-card text-muted-foreground";
}

function CopyableValue({ label, value, href }: { label: string; value?: string | number | null; href?: string }) {
  const hasValue = Boolean(value && String(value) !== "-");
  const displayValue = hasValue ? String(value) : "-";
  const copy = async () => {
    if (!hasValue) return;
    await navigator.clipboard.writeText(String(value));
    toast.success(`${label} copied`);
  };
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {href && hasValue ? (
          <a className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-primary underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">
            {displayValue}
          </a>
        ) : (
          <p className="min-w-0 flex-1 truncate font-mono text-sm font-semibold">{displayValue}</p>
        )}
        {hasValue ? (
          <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={copy} aria-label={`Copy ${label}`}>
            <Copy className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ValidationMetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Wand2;
  label: string;
  value: string | number;
  tone?: "success" | "danger" | "warning" | "primary" | "muted";
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border/40 bg-card/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg border",
          tone === "success" && "border-success/30 bg-success/10 text-success",
          tone === "danger" && "border-destructive/30 bg-destructive/10 text-destructive",
          tone === "warning" && "border-warning/30 bg-warning/10 text-warning",
          tone === "primary" && "border-primary/30 bg-primary/10 text-primary",
          (!tone || tone === "muted") && "border-border/40 bg-surface/60 text-muted-foreground",
        )}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 break-words font-display text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProfessionalEmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: typeof Wand2;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-surface/30 p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {actionLabel && onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : actionLabel ? (
        <Badge variant="outline" className="mt-4 border-primary/30 bg-primary/10 text-primary">
          {actionLabel}
        </Badge>
      ) : null}
    </div>
  );
}

function ContextualLoadingState({
  icon: Icon = Loader2,
  title,
  description,
}: {
  icon?: typeof Loader2;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/60 p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className={cn("size-5", Icon === Loader2 && "animate-spin")} />
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
    </div>
  );
}

function ModuleManager({
  projectId,
  modules,
  selectedModuleId,
  onSelectModule,
  onRefresh,
}: {
  projectId: string;
  modules: ProjectModule[];
  selectedModuleId: string;
  onSelectModule: (moduleId: string) => void;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    priority: "Medium" as ModulePriority,
    status: "Active" as EntityStatus,
  });

  const addModule = async () => {
    if (!form.name.trim()) {
      toast.error("Module name is required.");
      return;
    }
    const moduleItem = await projectApi.createModule({ projectId, ...form });
    toast.success("Module added");
    setForm({ name: "", description: "", priority: "Medium", status: "Active" });
    onSelectModule(moduleItem.id);
    onRefresh();
  };

  const editModule = async (moduleItem: ProjectModule) => {
    const name = window.prompt("Module name", moduleItem.name);
    if (!name) return;
    await projectApi.updateModule(moduleItem.id, { name });
    toast.success("Module updated");
    onRefresh();
  };

  const deleteModuleItem = async (moduleId: string) => {
    if (!window.confirm("Delete this module and its requirements/history?")) return;
    await projectApi.deleteModule(moduleId);
    toast.success("Module deleted");
    onSelectModule("");
    onRefresh();
  };

  return (
    <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <Boxes className="size-4 text-primary" />
        <h3 className="font-semibold">Modules</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_150px_auto]">
        <Input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Login"
        />
        <Input
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Module description"
        />
        <Select
          value={form.priority}
          onValueChange={(priority) =>
            setForm((current) => ({ ...current, priority: priority as ModulePriority }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Low", "Medium", "High", "Critical"].map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addModule}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>
      <div className="mt-4 space-y-2">
        {modules.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
            No modules yet. Add Login, Registration, Payment, Dashboard, or any product area.
          </p>
        ) : (
          modules.map((moduleItem) => (
            <div
              key={moduleItem.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-surface/40 p-3",
                selectedModuleId === moduleItem.id ? "border-primary/50" : "border-border/40",
              )}
            >
              <button type="button" onClick={() => onSelectModule(moduleItem.id)} className="text-left">
                <p className="font-medium">{moduleItem.name}</p>
                <p className="text-xs text-muted-foreground">{moduleItem.description || "No description"}</p>
              </button>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", modulePriorityClass(moduleItem.priority))}>
                  {moduleItem.priority}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", statusClass(moduleItem.status))}>
                  {moduleItem.status}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => editModule(moduleItem)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteModuleItem(moduleItem.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function RequirementManager({
  projectId,
  selectedModule,
  requirements,
  selectedRequirementId,
  onSelectRequirement,
  onRefresh,
  isExporting,
  onExportRequirement,
  onLimitExceeded,
}: {
  projectId: string;
  selectedModule?: ProjectModule;
  requirements: Requirement[];
  selectedRequirementId: string;
  onSelectRequirement: (requirementId: string) => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExportRequirement: (requirementId: string, format: ExportFormat) => void;
  onLimitExceeded: (error: unknown) => boolean;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    acceptanceCriteria: "",
    priority: "Medium" as ModulePriority,
    status: "Active" as EntityStatus,
  });

  const addRequirement = async () => {
    if (!selectedModule) {
      toast.error("Select a module first.");
      return;
    }
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Requirement title and description are required.");
      return;
    }
    try {
      const requirement = await projectApi.createRequirement({
        projectId,
        moduleId: selectedModule.id,
        ...form,
      });
      toast.success("Requirement added");
      setForm({
        title: "",
        description: "",
        acceptanceCriteria: "",
        priority: "Medium",
        status: "Active",
      });
      onSelectRequirement(requirement.id);
      onRefresh();
    } catch (error) {
      if (onLimitExceeded(error)) return;
      toast.error(error instanceof Error ? error.message : "Failed to add requirement");
    }
  };

  const editRequirement = async (requirement: Requirement) => {
    const title = window.prompt("Requirement title", requirement.title);
    if (!title) return;
    await projectApi.updateRequirement(requirement.id, { title });
    toast.success("Requirement updated");
    onRefresh();
  };

  const deleteRequirementItem = async (requirementId: string) => {
    if (!window.confirm("Delete this requirement and all generated versions?")) return;
    await projectApi.deleteRequirement(requirementId);
    toast.success("Requirement deleted");
    onSelectRequirement("");
    onRefresh();
  };

  return (
    <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h3 className="font-semibold">Requirements</h3>
        </div>
        <ExportDropdown
          label="Export Requirement"
          disabled={isExporting || !selectedRequirementId}
          onExport={(format) => onExportRequirement(selectedRequirementId, format)}
        />
      </div>
      <div className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_150px_auto]">
          <Input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Reset password via email"
            disabled={!selectedModule}
          />
          <Select
            value={form.priority}
            onValueChange={(priority) =>
              setForm((current) => ({ ...current, priority: priority as ModulePriority }))
            }
            disabled={!selectedModule}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Low", "Medium", "High", "Critical"].map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addRequirement} disabled={!selectedModule}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        <Textarea
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Requirement description"
          disabled={!selectedModule}
        />
        <Textarea
          value={form.acceptanceCriteria}
          onChange={(event) =>
            setForm((current) => ({ ...current, acceptanceCriteria: event.target.value }))
          }
          placeholder="Acceptance criteria"
          disabled={!selectedModule}
        />
      </div>
      <div className="mt-4 space-y-2">
        {!selectedModule ? (
          <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
            Select a module to manage requirements.
          </p>
        ) : requirements.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
            No requirements under this module yet.
          </p>
        ) : (
          requirements.map((requirement) => (
            <div
              key={requirement.id}
              className={cn(
                "rounded-lg border bg-surface/40 p-3",
                selectedRequirementId === requirement.id ? "border-primary/50" : "border-border/40",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onSelectRequirement(requirement.id)}
                  className="text-left"
                >
                  <p className="font-medium">{requirement.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {requirement.description}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs", modulePriorityClass(requirement.priority))}>
                    {requirement.priority}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => editRequirement(requirement)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteRequirementItem(requirement.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Created {formatDate(requirement.createdAt)} · Updated {formatDate(requirement.updatedAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function HistoryPanel({
  selectedRequirement,
  historyItems,
}: {
  selectedRequirement?: Requirement;
  historyItems: TestCaseGenerationHistory[];
}) {
  return (
    <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <History className="size-4 text-primary" />
        <h3 className="font-semibold">Test Case History</h3>
      </div>
      {!selectedRequirement ? (
        <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
          Select a requirement to view generated versions.
        </p>
      ) : historyItems.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
          No generated versions for this requirement yet.
        </p>
      ) : (
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/40 bg-surface/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Version {item.version}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.generatedAt)} by {item.generatedBy}
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-xs", coverageStatusClass(item.output.coverageAnalysis.coverageStatus))}>
                  {item.coverageScore}% coverage
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                <span>Model: {item.aiModelUsed}</span>
                <span>Positive: {item.output.positive.length}</span>
                <span>Negative: {item.output.negative.length}</span>
                <span>Edge: {item.output.edge.length}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function historyStatusClass(status: HistoryStatus) {
  switch (status) {
    case "Approved":
      return "border-success/40 bg-success/10 text-success";
    case "Submitted for Review":
      return "border-primary/40 bg-primary/10 text-primary";
    case "Rejected":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Changes Requested":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-muted-foreground/30 bg-muted/30 text-muted-foreground";
  }
}

function TestCaseHistoryPage({
  projects,
  projectDetail,
  history,
  selectedHistoryId,
  filters,
  compareFromId,
  compareToId,
  comparison,
  exportHistory,
  isLoading,
  isExporting,
  onSelectHistory,
  onSelectProject,
  onFiltersChange,
  onStatusChange,
  onDelete,
  onSubmitForReview,
  onCompareFromChange,
  onCompareToChange,
  onCompare,
  onExportVersions,
  onExportRequirement,
  onExportProject,
  onExportFiltered,
}: {
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
  history: TestCaseHistoryRecord[];
  selectedHistoryId: string;
  filters: HistoryFilters;
  compareFromId: string;
  compareToId: string;
  comparison: TestCaseHistoryCompare | null;
  exportHistory: ExportHistoryRecord[];
  isLoading: boolean;
  isExporting: boolean;
  onSelectHistory: (historyId: string) => void;
  onSelectProject: (projectId: string) => void;
  onFiltersChange: (filters: HistoryFilters) => void;
  onStatusChange: (historyId: string, status: HistoryStatus) => void;
  onDelete: (historyId: string) => void;
  onSubmitForReview: (historyId: string, comment?: string) => void;
  onCompareFromChange: (historyId: string) => void;
  onCompareToChange: (historyId: string) => void;
  onCompare: () => void;
  onExportVersions: (historyIds: string[], format: ExportFormat) => void;
  onExportRequirement: (requirementId: string, format: ExportFormat) => void;
  onExportProject: (projectId: string, format: ExportFormat) => void;
  onExportFiltered: (filters: HistoryFilters, format: ExportFormat) => void;
}) {
  const [selectedExportIds, setSelectedExportIds] = useState<string[]>([]);
  const selectedHistory = history.find((item) => item.id === selectedHistoryId) ?? history[0];
  const selectedRequirementVersions = selectedHistory
    ? history
        .filter((item) => item.requirementId === selectedHistory.requirementId)
        .sort((a, b) => a.version - b.version)
    : [];
  const modules = projectDetail?.modules ?? [];
  const requirements = projectDetail?.requirements.filter((item) => !filters.moduleId || item.moduleId === filters.moduleId) ?? [];
  const generatedByOptions = Array.from(new Set(history.map((item) => item.generatedBy)));

  const updateFilter = (key: keyof HistoryFilters, value: string) => {
    const next = { ...filters, [key]: value || undefined };
    if (key === "projectId") {
      next.moduleId = undefined;
      next.requirementId = undefined;
      onSelectProject(value);
    }
    if (key === "moduleId") next.requirementId = undefined;
    onFiltersChange(next);
  };

  const toggleExportSelection = (historyId: string) => {
    setSelectedExportIds((current) =>
      current.includes(historyId)
        ? current.filter((item) => item !== historyId)
        : [...current, historyId],
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <History className="mr-1 size-3" /> Versioned QA output
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Test Case History
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review saved test case generations, compare versions, update approval status, and export QA artifacts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExportDropdown
            label="Export Filtered"
            disabled={isExporting || history.length === 0}
            onExport={(format) => onExportFiltered(filters, format)}
          />
          {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
        </div>
      </div>

      <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Search className="size-4 text-primary" />
          <h2 className="font-semibold">Filters</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            value={filters.search ?? ""}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search requirement, test case, project..."
          />
          <Select value={filters.projectId ?? "all"} onValueChange={(value) => updateFilter("projectId", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.moduleId ?? "all"} onValueChange={(value) => updateFilter("moduleId", value === "all" ? "" : value)} disabled={!filters.projectId}>
            <SelectTrigger>
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {modules.map((moduleItem) => (
                <SelectItem key={moduleItem.id} value={moduleItem.id}>
                  {moduleItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.requirementId ?? "all"} onValueChange={(value) => updateFilter("requirementId", value === "all" ? "" : value)} disabled={!filters.projectId}>
            <SelectTrigger>
              <SelectValue placeholder="Requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All requirements</SelectItem>
              {requirements.map((requirement) => (
                <SelectItem key={requirement.id} value={requirement.id}>
                  {requirement.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status ?? "all"} onValueChange={(value) => updateFilter("status", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["Draft", "Submitted for Review", "Changes Requested", "Approved", "Rejected"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.generatedBy ?? "all"} onValueChange={(value) => updateFilter("generatedBy", value === "all" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Generated by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Anyone</SelectItem>
              {generatedByOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={filters.dateFrom ?? ""} onChange={(event) => updateFilter("dateFrom", event.target.value)} />
          <Input type="date" value={filters.dateTo ?? ""} onChange={(event) => updateFilter("dateTo", event.target.value)} />
          <Input
            type="number"
            min="0"
            max="100"
            value={filters.minCoverage ?? ""}
            onChange={(event) => updateFilter("minCoverage", event.target.value)}
            placeholder="Min coverage"
          />
        </div>
      </Card>

      <div className="grid max-w-full gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <Card className="min-w-0 max-w-full overflow-hidden border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="size-4 text-primary" />
              <h2 className="font-semibold">History Records</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{history.length} records</Badge>
              <ExportDropdown
                label="Export Selected"
                disabled={isExporting || selectedExportIds.length === 0}
                onExport={(format) => onExportVersions(selectedExportIds, format)}
              />
            </div>
          </div>
          {history.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
              <History className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No generated history yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-lg border bg-surface/40 p-4 transition-colors",
                    selectedHistory?.id === item.id ? "border-primary/50" : "border-border/40 hover:border-primary/30",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedExportIds.includes(item.id)}
                          onChange={() => toggleExportSelection(item.id)}
                          aria-label={`Select version ${item.version} for export`}
                          className="size-4 accent-primary"
                        />
                        <button type="button" onClick={() => onSelectHistory(item.id)} className="min-w-0 text-left">
                          <p className="break-words font-semibold">{item.requirementTitle}</p>
                        </button>
                      </div>
                      <p className="mt-1 break-words text-xs text-muted-foreground">
                        {item.projectName} / {item.moduleName}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", historyStatusClass(item.reviewStatus))}>
                      {item.reviewStatus}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                    <span>Version {item.version}</span>
                    <span>{item.coverageScore}% coverage</span>
                    <span>{item.generatedBy}</span>
                    <span>{formatDate(item.generatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="min-w-0 max-w-full space-y-5 overflow-hidden">
          {selectedHistory ? (
            <>
              <Card className="max-w-full overflow-hidden border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
                <div className="flex max-w-full flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-xl font-semibold">{selectedHistory.requirementTitle}</h2>
                    <p className="mt-1 break-words text-sm text-muted-foreground">
                      Version {selectedHistory.version} generated on {formatDate(selectedHistory.generatedAt)} by {selectedHistory.generatedBy}
                    </p>
                    <p className="mt-1 break-words text-xs text-muted-foreground">AI model: {selectedHistory.aiModelUsed}</p>
                  </div>
                  <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">
                    <Select
                      value={selectedHistory.reviewStatus}
                      onValueChange={(status) => onStatusChange(selectedHistory.id, status as HistoryStatus)}
                      disabled={selectedHistory.isLocked}
                    >
                      <SelectTrigger className="h-9 w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Submitted for Review">Submitted for Review</SelectItem>
                        <SelectItem value="Changes Requested">Changes Requested</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!["Draft", "Changes Requested"].includes(selectedHistory.reviewStatus)}
                      onClick={() => {
                        if (!window.confirm("Submit this version for review?")) return;
                        onSubmitForReview(selectedHistory.id, window.prompt("Optional submit comment") ?? undefined);
                      }}
                    >
                      <ClipboardList className="size-3.5" />
                      Submit for Review
                    </Button>
                    <ExportDropdown
                      disabled={isExporting}
                      onExport={(format) => onExportVersions([selectedHistory.id], format)}
                    />
                    <ExportDropdown
                      label="Export Requirement"
                      disabled={isExporting}
                      onExport={(format) => onExportRequirement(selectedHistory.requirementId, format)}
                    />
                    <ExportDropdown
                      label="Export Project"
                      disabled={isExporting}
                      onExport={(format) => onExportProject(selectedHistory.projectId, format)}
                    />
                    <Button variant="outline" size="sm" onClick={() => onDelete(selectedHistory.id)}>
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="mt-5 max-w-full overflow-hidden rounded-lg border border-border/40 bg-surface/40 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Requirement Input
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">{selectedHistory.requirementInput}</p>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Coverage Score</span>
                    <span className="font-mono text-xs text-muted-foreground">{selectedHistory.coverageScore}%</span>
                  </div>
                  <Progress value={selectedHistory.coverageScore} className="h-2.5" />
                </div>
              </Card>

              <Card className="max-w-full overflow-hidden border-border/50 bg-card/70 p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2">
                  <History className="size-4 text-primary" />
                  <h3 className="font-semibold">Version Timeline</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedRequirementVersions.map((item) => (
                    <Button
                      key={item.id}
                      variant={item.id === selectedHistory.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => onSelectHistory(item.id)}
                    >
                      Version {item.version} - {formatDate(item.generatedAt)}
                    </Button>
                  ))}
                </div>
              </Card>

              <CompareVersionsPanel
                history={selectedRequirementVersions}
                compareFromId={compareFromId}
                compareToId={compareToId}
                comparison={comparison}
                onCompareFromChange={onCompareFromChange}
                onCompareToChange={onCompareToChange}
                onCompare={onCompare}
              />

              <div className="min-w-0 max-w-full overflow-hidden">
                <Results plan={selectedHistory.output} />
              </div>
            </>
          ) : (
            <Card className="border-dashed border-border/50 bg-card/30 p-10 text-center backdrop-blur">
              <History className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Select a history record to view details.</p>
            </Card>
          )}
        </div>
      </div>

      <ExportHistoryTable exports={exportHistory} />
    </div>
  );
}

function ExportHistoryTable({ exports }: { exports: ExportHistoryRecord[] }) {
  return (
    <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <Download className="size-4 text-primary" />
        <h2 className="font-semibold">Export History</h2>
      </div>
      {exports.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
          No exports have been generated yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Export Type</th>
                <th className="px-3 py-2 text-left">Format</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Records</th>
              </tr>
            </thead>
            <tbody>
              {exports.map((item) => (
                <tr key={item.id} className="border-t border-border/40">
                  <td className="px-3 py-2">{item.userId}</td>
                  <td className="px-3 py-2 capitalize">{item.exportType}</td>
                  <td className="px-3 py-2 capitalize">{item.exportFormat}</td>
                  <td className="px-3 py-2">{formatDate(item.createdAt)}</td>
                  <td className="px-3 py-2">{item.totalRecords}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function CompareVersionsPanel({
  history,
  compareFromId,
  compareToId,
  comparison,
  onCompareFromChange,
  onCompareToChange,
  onCompare,
}: {
  history: TestCaseHistoryRecord[];
  compareFromId: string;
  compareToId: string;
  comparison: TestCaseHistoryCompare | null;
  onCompareFromChange: (historyId: string) => void;
  onCompareToChange: (historyId: string) => void;
  onCompare: () => void;
}) {
  return (
    <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <GitCompare className="size-4 text-primary" />
        <h3 className="font-semibold">Compare Versions</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <Select value={compareFromId} onValueChange={onCompareFromChange}>
          <SelectTrigger>
            <SelectValue placeholder="From version" />
          </SelectTrigger>
          <SelectContent>
            {history.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                Version {item.version} ({item.coverageScore}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={compareToId} onValueChange={onCompareToChange}>
          <SelectTrigger>
            <SelectValue placeholder="To version" />
          </SelectTrigger>
          <SelectContent>
            {history.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                Version {item.version} ({item.coverageScore}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onCompare}>
          <GitCompare className="size-4" />
          Compare
        </Button>
      </div>
      {comparison && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
            <p className="font-semibold">Coverage Difference</p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {comparison.from.coverageScore}% to {comparison.to.coverageScore}%
            </p>
            <Badge
              variant="outline"
              className={cn(
                "mt-3",
                comparison.coverageDifference >= 0
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {comparison.coverageDifference >= 0 ? "+" : ""}
              {comparison.coverageDifference}% improvement
            </Badge>
          </div>
          <div className="grid gap-3">
            <CompareList title="Added test cases" items={comparison.addedTestCases} tone="success" />
            <CompareList title="Removed test cases" items={comparison.removedTestCases} tone="danger" />
            <CompareList title="Updated test cases" items={comparison.updatedTestCases} tone="warning" />
          </div>
        </div>
      )}
    </Card>
  );
}

function CompareList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "danger" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-destructive"
        : "text-warning";
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
      <p className={cn("text-sm font-semibold", toneClass)}>{title}</p>
      {items.length ? (
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">No changes detected.</p>
      )}
    </div>
  );
}

function AuthPage({
  mode,
  isLoading,
  onModeChange,
  onAuthenticated,
}: {
  mode: "login" | "signup" | "forgot-password" | "reset-password";
  isLoading: boolean;
  onModeChange: (view: ActiveView) => void;
  onAuthenticated: (response: AuthResponse) => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    workspaceName: "",
    token: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const title =
    mode === "signup"
      ? "Create your AI QA Copilot account"
      : mode === "forgot-password"
        ? "Reset your password"
        : mode === "reset-password"
          ? "Create a new password"
          : "Welcome back";

  const passwordType = showPassword ? "text" : "password";
  const submit = async () => {
    try {
      setIsSubmitting(true);
      if (mode === "signup") {
        if (form.password !== form.confirmPassword) throw new Error("Passwords do not match.");
        const response = await projectApi.signup({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          workspaceName: form.workspaceName,
        });
        toast.success("Account created");
        onAuthenticated(response);
      } else if (mode === "login") {
        const response = await projectApi.login({ email: form.email, password: form.password });
        toast.success("Logged in successfully");
        onAuthenticated(response);
      } else if (mode === "forgot-password") {
        const response = await projectApi.forgotPassword(form.email);
        setResetLink(response.resetLink ?? "");
        toast.success("Reset instructions prepared");
      } else {
        await projectApi.resetPassword({
          token: form.token,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        toast.success("Password reset. Please login.");
        onModeChange("login");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_460px]">
      <div className="hidden lg:block">
        <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
          Secure team workspace
        </Badge>
        <h1 className="font-display text-5xl font-bold leading-tight">Govern AI-generated QA work with roles, review, and analytics.</h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Sign in to manage projects, invite team members, approve test case versions, and export official QA reports.
        </p>
      </div>
      <Card className="app-card p-6">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signup" ? "Start with a default owner workspace." : "Use your email and password to continue."}
          </p>
        </div>

        <div className="space-y-4">
          {mode === "signup" && (
            <>
              <Input placeholder="Full name" value={form.fullName} onChange={(event) => setForm((value) => ({ ...value, fullName: event.target.value }))} />
              <Input placeholder="Company / Workspace name" value={form.workspaceName} onChange={(event) => setForm((value) => ({ ...value, workspaceName: event.target.value }))} />
            </>
          )}
          {(mode === "login" || mode === "signup" || mode === "forgot-password") && (
            <Input placeholder="Work email" type="email" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} />
          )}
          {mode === "reset-password" && (
            <Input placeholder="Reset token" value={form.token} onChange={(event) => setForm((value) => ({ ...value, token: event.target.value }))} />
          )}
          {(mode === "login" || mode === "signup" || mode === "reset-password") && (
            <div className="flex gap-2">
              <Input
                placeholder={mode === "reset-password" ? "New password" : "Password"}
                type={passwordType}
                value={form.password}
                onChange={(event) => setForm((value) => ({ ...value, password: event.target.value }))}
              />
              <Button type="button" variant="outline" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          )}
          {(mode === "signup" || mode === "reset-password") && (
            <Input
              placeholder="Confirm password"
              type={passwordType}
              value={form.confirmPassword}
              onChange={(event) => setForm((value) => ({ ...value, confirmPassword: event.target.value }))}
            />
          )}
          <Button className="w-full bg-gradient-primary text-primary-foreground" onClick={submit} disabled={isSubmitting || isLoading}>
            {(isSubmitting || isLoading) && <Loader2 className="size-4 animate-spin" />}
            {mode === "signup" ? "Create Account" : mode === "forgot-password" ? "Send Reset Link" : mode === "reset-password" ? "Reset Password" : "Login"}
          </Button>
          {resetLink && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
              Reset link: <span className="font-mono">{resetLink}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
          {mode !== "login" && <button onClick={() => onModeChange("login")} className="hover:text-foreground">Back to login</button>}
          {mode !== "signup" && <button onClick={() => onModeChange("signup")} className="hover:text-foreground">Create account</button>}
          {mode !== "forgot-password" && <button onClick={() => onModeChange("forgot-password")} className="hover:text-foreground">Forgot password?</button>}
          {mode !== "reset-password" && <button onClick={() => onModeChange("reset-password")} className="hover:text-foreground">Have reset token?</button>}
        </div>
      </Card>
    </div>
  );
}

function ProfilePage({
  auth,
  onAuthChange,
}: {
  auth: AuthContextResponse | null;
  onAuthChange: (auth: AuthContextResponse | null) => void;
}) {
  const [fullName, setFullName] = useState(auth?.user.fullName ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!auth) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">Settings</Badge>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage account identity and password security.</p>
      </div>
      <Tabs defaultValue="account" className="space-y-5">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-5">
          <Card className="app-card p-6">
            <div className="grid gap-4">
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" />
              <Input value={auth.user.email} readOnly />
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniStat label="Role" value={auth.role} />
                <MiniStat label="Workspace" value={auth.workspace?.workspaceName ?? "No workspace"} />
              </div>
              <Button
                onClick={async () => {
                  const updated = await projectApi.updateProfile({ fullName });
                  onAuthChange(updated);
                  toast.success("Profile updated");
                }}
              >
                Save Profile
              </Button>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          {auth.user.authProvider === "email" && (
            <Card className="app-card p-6">
              <h2 className="mb-4 font-semibold">Change Password</h2>
              <div className="grid gap-3">
                <Input type="password" placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                <Input type="password" placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                <Button
                  variant="outline"
                  onClick={async () => {
                    await projectApi.changePassword({ currentPassword, newPassword });
                    setCurrentPassword("");
                    setNewPassword("");
                    toast.success("Password changed");
                  }}
                >
                  Change Password
                </Button>
              </div>
            </Card>
          )}
          <Card className="app-card p-6">
            <h2 className="font-semibold">Security Notice</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              AI provider API keys are encrypted before storage and are never displayed after saving. Rotate or delete keys when access changes.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const providerTypes = [
  ["openai", "OpenAI"],
  ["anthropic", "Anthropic Claude"],
  ["gemini", "Google Gemini"],
  ["groq", "Groq"],
  ["azure-openai", "Azure OpenAI"],
  ["openrouter", "OpenRouter"],
  ["custom-openai-compatible", "Custom OpenAI-Compatible API"],
] as const;

const aiFeatureLabels: Record<AIProviderFeatureName, string> = {
  "test-generation": "Test Case Generation",
  "ai-chat": "AI Chat",
  "playwright-generation": "Playwright Generation",
  "requirement-impact": "Requirement Impact Analysis",
  "coverage-score": "Coverage Score",
  "repository-impact": "Repository Impact Analysis",
  "repository-test-update": "Repository Test Update Generation",
  "playwright-validation-failure": "Playwright Validation Failure Analysis",
  "repository-fix-suggestion": "Repository Fix Suggestion",
};

type RepositoryIntelligenceTab = "automation" | "application" | "activity" | "learning";

const repositoryIntelligenceMeta: Record<
  "repository-application" | "repository-automation" | "repository-activity" | "repository-impact" | "repository-playwright" | "repository-validation-history" | "repository-release-readiness",
  { title: string; description: string; tab: RepositoryIntelligenceTab }
> = {
  "repository-application": {
    title: "Application Repositories",
    description: "Connect frontend and backend repositories, register webhooks, and capture code-change activity.",
    tab: "application",
  },
  "repository-automation": {
    title: "Automation Repository",
    description: "Configure the GitHub Playwright automation repository used for generated specs, validation, and pull requests.",
    tab: "automation",
  },
  "repository-activity": {
    title: "Repository Activity",
    description: "Review GitHub push and pull request events from connected application repositories.",
    tab: "activity",
  },
  "repository-impact": {
    title: "AI Impact Analysis",
    description: "Open repository activity events to map changed files to impacted modules, tests, and recommendations.",
    tab: "activity",
  },
  "repository-playwright": {
    title: "Playwright Update Workflow",
    description: "Generate updates, review diffs, run validation, get AI recommendations, and create pull requests.",
    tab: "activity",
  },
  "repository-validation-history": {
    title: "Validation History",
    description: "Review validation attempts, GitHub Actions outcomes, AI failure analysis, auto-fixes, and retry attempts.",
    tab: "activity",
  },
  "repository-release-readiness": {
    title: "Release Readiness",
    description: "Track validation pass rate, high-risk changes, pending fixes, and release recommendation score.",
    tab: "activity",
  },
};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">Settings</Badge>
        <h1 className="font-display text-3xl font-bold">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function apiRiskBadgeClass(risk: ApiRiskLevel) {
  if (risk === "High") return "border-red-200 bg-red-50 text-red-700";
  if (risk === "Medium") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function methodBadgeClass(method: string) {
  const value = method.toUpperCase();
  if (value === "GET") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value === "POST") return "border-blue-200 bg-blue-50 text-blue-700";
  if (["PUT", "PATCH"].includes(value)) return "border-amber-200 bg-amber-50 text-amber-700";
  if (value === "DELETE") return "border-red-200 bg-red-50 text-red-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function SchemaPreview({ value }: { value: unknown }) {
  if (!value) return <p className="text-sm text-muted-foreground">Not defined</p>;
  return (
    <pre className="max-h-72 overflow-auto rounded-lg border bg-slate-950 p-4 text-xs text-slate-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function ApiWorkspacePage({
  workspaceId,
  projects,
  role,
}: {
  workspaceId: string;
  projects: ProjectSummary[];
  role: WorkspaceRole;
}) {
  const [workspaces, setWorkspaces] = useState<ApiWorkspace[]>([]);
  const [postmanWorkspaces, setPostmanWorkspaces] = useState<PostmanWorkspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedPostmanId, setSelectedPostmanId] = useState("");
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [postmanRequests, setPostmanRequests] = useState<PostmanRequest[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [selectedPostmanRequest, setSelectedPostmanRequest] = useState<PostmanRequest | null>(null);
  const [generatedSuite, setGeneratedSuite] = useState<GeneratedApiTestSuite | null>(null);
  const [generatedTests, setGeneratedTests] = useState<GeneratedApiTest[]>([]);
  const [selectedGeneratedTest, setSelectedGeneratedTest] = useState<GeneratedApiTest | null>(null);
  const [apiRuns, setApiRuns] = useState<ApiRun[]>([]);
  const [selectedApiRun, setSelectedApiRun] = useState<ApiRun | null>(null);
  const [contractDashboard, setContractDashboard] = useState<ContractDashboard | null>(null);
  const [contractValidations, setContractValidations] = useState<ApiContractValidation[]>([]);
  const [selectedContractValidation, setSelectedContractValidation] = useState<ApiContractValidation | null>(null);
  const [apiRepositories, setApiRepositories] = useState<ApiRepositoryProfile[]>([]);
  const [selectedApiRepositoryId, setSelectedApiRepositoryId] = useState("");
  const [apiRouteMappings, setApiRouteMappings] = useState<ApiRouteMapping[]>([]);
  const [apiDependencyGraph, setApiDependencyGraph] = useState<ApiRepositoryDependencyGraph[]>([]);
  const [apiRepositoryCoverage, setApiRepositoryCoverage] = useState<ApiRepositoryCoverage | null>(null);
  const [apiRepositoryRisk, setApiRepositoryRisk] = useState<ApiRepositoryRiskSummary | null>(null);
  const [apiImpactAnalysis, setApiImpactAnalysis] = useState<ApiImpactAnalysis | null>(null);
  const [apiValidations, setApiValidations] = useState<ApiValidationRun[]>([]);
  const [selectedApiValidation, setSelectedApiValidation] = useState<ApiValidationRun | null>(null);
  const [apiValidationResults, setApiValidationResults] = useState<ApiValidationResult[]>([]);
  const [apiFailureAnalysis, setApiFailureAnalysis] = useState<ApiFailureAnalysis | null>(null);
  const [apiFailureEvidence, setApiFailureEvidence] = useState<ApiFailureEvidence[]>([]);
  const [latestCollectionSummary, setLatestCollectionSummary] = useState<{ total: number; passed: number; failed: number; errors: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isGeneratingApiTests, setIsGeneratingApiTests] = useState(false);
  const [isRunningApi, setIsRunningApi] = useState(false);
  const [isValidatingContract, setIsValidatingContract] = useState(false);
  const [isRunningApiValidation, setIsRunningApiValidation] = useState(false);
  const [isAnalyzingApiFailure, setIsAnalyzingApiFailure] = useState(false);
  const [isScanningApiRepository, setIsScanningApiRepository] = useState(false);
  const [isAnalyzingApiImpact, setIsAnalyzingApiImpact] = useState(false);
  const [projectId, setProjectId] = useState("none");
  const [apiGenerationType, setApiGenerationType] = useState<ApiTestGenerationType>("all");
  const [apiFramework, setApiFramework] = useState<ApiTestFramework>("playwright");
  const [apiTestCount, setApiTestCount] = useState("8");
  const [manualApiMethod, setManualApiMethod] = useState("GET");
  const [manualApiEndpoint, setManualApiEndpoint] = useState("");
  const [apiRequirementText, setApiRequirementText] = useState("");
  const [runnerEnvironment, setRunnerEnvironment] = useState("QA");
  const [runnerBaseUrl, setRunnerBaseUrl] = useState("");
  const [runnerToken, setRunnerToken] = useState("");
  const [runnerApiKey, setRunnerApiKey] = useState("");
  const [runnerHeaders, setRunnerHeaders] = useState("{}");
  const [runnerBody, setRunnerBody] = useState("{}");
  const [runnerTimeout, setRunnerTimeout] = useState("15000");
  const [runnerStatusAssertion, setRunnerStatusAssertion] = useState("200");
  const [runnerResponseTimeAssertion, setRunnerResponseTimeAssertion] = useState("2000");
  const [apiValidationMode, setApiValidationMode] = useState<ApiValidationMode>("quick");
  const [apiValidationEnvironment, setApiValidationEnvironment] = useState("QA");
  const [swaggerUrl, setSwaggerUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [githubForm, setGithubForm] = useState({ owner: "", repo: "", path: "", branch: "main" });
  const [postmanGithubForm, setPostmanGithubForm] = useState({ owner: "", repo: "", path: "", branch: "main" });
  const [apiRepositoryForm, setApiRepositoryForm] = useState({ owner: "", repo: "", defaultBranch: "main", token: "" });
  const [apiChangedFiles, setApiChangedFiles] = useState("");
  const canImport = ["Owner", "Admin", "QA Lead"].includes(role);
  const canDelete = ["Owner", "Admin"].includes(role);
  const selectedWorkspace = workspaces.find((item) => item.id === selectedWorkspaceId) ?? workspaces[0] ?? null;
  const selectedPostman = postmanWorkspaces.find((item) => item.id === selectedPostmanId) ?? postmanWorkspaces[0] ?? null;
  const selectedApiRepository = apiRepositories.find((item) => item.id === selectedApiRepositoryId || item.repositoryId === selectedApiRepositoryId) ?? apiRepositories[0] ?? null;

  const loadWorkspaces = async () => {
    setIsLoading(true);
    try {
      const [list, postmanList, repositoryList] = await Promise.all([
        projectApi.listApiWorkspaces({ workspaceId }),
        projectApi.listPostmanWorkspaces({ workspaceId }),
        projectApi.listApiRepositories(workspaceId),
      ]);
      setWorkspaces(list);
      setPostmanWorkspaces(postmanList);
      setApiRepositories(repositoryList);
      const nextId = selectedWorkspaceId && list.some((item) => item.id === selectedWorkspaceId)
        ? selectedWorkspaceId
        : list[0]?.id ?? "";
      const nextPostmanId = selectedPostmanId && postmanList.some((item) => item.id === selectedPostmanId)
        ? selectedPostmanId
        : postmanList[0]?.id ?? "";
      const nextApiRepositoryId = selectedApiRepositoryId && repositoryList.some((item) => item.id === selectedApiRepositoryId || item.repositoryId === selectedApiRepositoryId)
        ? selectedApiRepositoryId
        : repositoryList[0]?.id ?? "";
      setSelectedWorkspaceId(nextId);
      setSelectedPostmanId(nextPostmanId);
      setSelectedApiRepositoryId(nextApiRepositoryId);
      const [nextEndpoints, nextPostmanRequests, nextApiRoutes, nextDependencyGraph, nextCoverage, nextRisk] = await Promise.all([
        nextId ? projectApi.listApiEndpoints(nextId) : Promise.resolve([]),
        nextPostmanId ? projectApi.listPostmanRequests(nextPostmanId) : Promise.resolve([]),
        nextApiRepositoryId ? projectApi.listApiRepositoryEndpoints(nextApiRepositoryId) : Promise.resolve([]),
        nextApiRepositoryId ? projectApi.getApiRepositoryDependencyGraph(nextApiRepositoryId) : Promise.resolve([]),
        nextApiRepositoryId ? projectApi.getApiRepositoryCoverage(nextApiRepositoryId) : Promise.resolve(null),
        nextApiRepositoryId ? projectApi.getApiRepositoryRiskSummary(nextApiRepositoryId) : Promise.resolve(null),
      ]);
      setEndpoints(nextEndpoints);
      setPostmanRequests(nextPostmanRequests);
      setApiRouteMappings(nextApiRoutes);
      setApiDependencyGraph(nextDependencyGraph);
      setApiRepositoryCoverage(nextCoverage);
      setApiRepositoryRisk(nextRisk);
      setApiRuns(await projectApi.listApiRuns({ workspaceId }));
      const validationHistory = await projectApi.listApiValidations({ workspaceId });
      setApiValidations(validationHistory);
      setSelectedApiValidation(validationHistory[0] ?? null);
      setContractDashboard(await projectApi.getApiContractDashboard(workspaceId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load API workspaces.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const selectWorkspace = async (apiWorkspaceId: string) => {
    setSelectedWorkspaceId(apiWorkspaceId);
    setSelectedEndpoint(null);
    setIsLoading(true);
    try {
      setEndpoints(await projectApi.listApiEndpoints(apiWorkspaceId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load endpoints.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectPostmanWorkspace = async (postmanWorkspaceId: string) => {
    setSelectedPostmanId(postmanWorkspaceId);
    setSelectedPostmanRequest(null);
    setIsLoading(true);
    try {
      setPostmanRequests(await projectApi.listPostmanRequests(postmanWorkspaceId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load Postman requests.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectApiRepository = async (repositoryId: string) => {
    setSelectedApiRepositoryId(repositoryId);
    setIsLoading(true);
    try {
      const [routes, graph, coverage, risk, summary] = await Promise.all([
        projectApi.listApiRepositoryEndpoints(repositoryId),
        projectApi.getApiRepositoryDependencyGraph(repositoryId),
        projectApi.getApiRepositoryCoverage(repositoryId),
        projectApi.getApiRepositoryRiskSummary(repositoryId),
        projectApi.getApiRepositorySummary(repositoryId),
      ]);
      setApiRouteMappings(routes);
      setApiDependencyGraph(graph);
      setApiRepositoryCoverage(coverage);
      setApiRepositoryRisk(risk);
      setApiImpactAnalysis(summary.latestImpactAnalysis ?? null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load API repository intelligence.");
    } finally {
      setIsLoading(false);
    }
  };

  const connectApiRepository = async () => {
    if (!canImport) {
      toast.error("You do not have permission to connect backend repositories.");
      return;
    }
    if (!apiRepositoryForm.owner || !apiRepositoryForm.repo || !apiRepositoryForm.token) {
      toast.error("Repository owner, name, and GitHub token are required.");
      return;
    }
    setIsScanningApiRepository(true);
    try {
      const profile = await projectApi.connectApiRepository({
        workspaceId,
        projectId: projectId === "none" ? undefined : projectId,
        ...apiRepositoryForm,
      });
      setApiRepositoryForm((value) => ({ ...value, token: "" }));
      setSelectedApiRepositoryId(profile.id);
      toast.success("Backend repository connected.");
      const scan = await projectApi.scanApiRepository(profile.id);
      setApiRepositories((items) => [scan.profile, ...items.filter((item) => item.id !== scan.profile.id)]);
      setApiRouteMappings(scan.mappings);
      setApiDependencyGraph(await projectApi.getApiRepositoryDependencyGraph(scan.profile.id));
      setApiRepositoryCoverage(await projectApi.getApiRepositoryCoverage(scan.profile.id));
      setApiRepositoryRisk(await projectApi.getApiRepositoryRiskSummary(scan.profile.id));
      toast.success(`Detected ${scan.profile.totalEndpoints} API routes.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to connect or scan backend repository.");
    } finally {
      setIsScanningApiRepository(false);
    }
  };

  const scanApiRepository = async () => {
    if (!selectedApiRepository) return;
    setIsScanningApiRepository(true);
    try {
      const scan = await projectApi.scanApiRepository(selectedApiRepository.id);
      setApiRepositories((items) => [scan.profile, ...items.filter((item) => item.id !== scan.profile.id)]);
      setApiRouteMappings(scan.mappings);
      setApiDependencyGraph(await projectApi.getApiRepositoryDependencyGraph(scan.profile.id));
      setApiRepositoryCoverage(await projectApi.getApiRepositoryCoverage(scan.profile.id));
      setApiRepositoryRisk(await projectApi.getApiRepositoryRiskSummary(scan.profile.id));
      toast.success(`Repository scan completed: ${scan.profile.totalEndpoints} APIs detected.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Repository scan failed.");
    } finally {
      setIsScanningApiRepository(false);
    }
  };

  const runApiImpactAnalysis = async () => {
    if (!selectedApiRepository) return;
    const changedFiles = apiChangedFiles
      .split(/\r?\n|,/)
      .map((file) => file.trim())
      .filter(Boolean);
    if (!changedFiles.length) {
      toast.error("Add at least one changed backend file.");
      return;
    }
    setIsAnalyzingApiImpact(true);
    try {
      const analysis = await projectApi.runApiRepositoryImpactAnalysis(selectedApiRepository.id, { changedFiles });
      setApiImpactAnalysis(analysis);
      toast.success(`${analysis.affectedEndpoints.length} impacted APIs detected.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API impact analysis failed.");
    } finally {
      setIsAnalyzingApiImpact(false);
    }
  };

  const importSpec = async (runner: () => Promise<unknown>) => {
    if (!canImport) {
      toast.error("You do not have permission to import API specifications.");
      return;
    }
    setIsImporting(true);
    try {
      await runner();
      toast.success("API specification imported successfully.");
      await loadWorkspaces();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API import failed.");
    } finally {
      setIsImporting(false);
    }
  };

  const onUploadFile = async (file?: File) => {
    if (!file) return;
    const content = await file.text();
    await importSpec(() => projectApi.importApiWorkspaceUpload({
      workspaceId,
      projectId: projectId === "none" ? undefined : projectId,
      fileName: file.name,
      content,
    }));
  };

  const onUploadPostmanCollection = async (file?: File) => {
    if (!file) return;
    const collection = await file.text();
    await importSpec(() => projectApi.importPostmanCollection({
      workspaceId,
      projectId: projectId === "none" ? undefined : projectId,
      collection,
      sourceType: "upload",
    }));
  };

  const onUploadPostmanEnvironment = async (file: File | undefined, source: "environment" | "global") => {
    if (!file || !selectedPostman) return;
    const content = await file.text();
    await importSpec(() => projectApi.importPostmanEnvironment({
      postmanWorkspaceId: selectedPostman.id,
      content,
      source,
    }));
  };

  const viewEndpoint = async (endpoint: ApiEndpoint) => {
    try {
      setSelectedEndpoint(await projectApi.getApiEndpoint(endpoint.apiWorkspaceId, endpoint.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load endpoint details.");
    }
  };

  const deleteWorkspace = async (apiWorkspaceId: string) => {
    if (!canDelete) {
      toast.error("Only Owner/Admin can delete API workspaces.");
      return;
    }
    if (!window.confirm("Delete this API workspace and all imported endpoints?")) return;
    try {
      await projectApi.deleteApiWorkspace(apiWorkspaceId);
      toast.success("API workspace deleted.");
      await loadWorkspaces();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete API workspace.");
    }
  };

  const deletePostmanWorkspace = async (postmanWorkspaceId: string) => {
    if (!canDelete) {
      toast.error("Only Owner/Admin can delete Postman collections.");
      return;
    }
    if (!window.confirm("Delete this Postman collection and its converted API inventory?")) return;
    try {
      await projectApi.deletePostmanWorkspace(postmanWorkspaceId);
      toast.success("Postman collection deleted.");
      await loadWorkspaces();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete Postman collection.");
    }
  };

  const authTypes = selectedWorkspace?.authTypes?.length ? selectedWorkspace.authTypes.join(", ") : "Not detected";
  const serverUrl = selectedWorkspace?.serverUrls?.[0] ?? "Not detected";
  const highRiskCount = endpoints.filter((endpoint) => endpoint.riskLevel === "High").length;
  const postmanHighRiskCount = postmanRequests.filter((request) => request.riskLevel === "High").length;
  const generatedApprovedCount = generatedTests.filter((test) => test.status === "Approved").length;

  const loadGeneratedTests = async (suiteId: string, suiteOverride?: GeneratedApiTestSuite | null) => {
    const [suite, tests] = await Promise.all([
      suiteOverride ? Promise.resolve(suiteOverride) : projectApi.getGeneratedApiTestSuite(suiteId),
      projectApi.listGeneratedApiTests(suiteId),
    ]);
    setGeneratedSuite(suite);
    setGeneratedTests(tests);
  };

  const generateApiTests = async (scope: "collection" | "endpoint" | "manual", endpoint?: ApiEndpoint) => {
    setIsGeneratingApiTests(true);
    try {
      const baseInput = {
        workspaceId,
        projectId: projectId === "none" ? undefined : projectId,
        generationType: apiGenerationType,
        framework: apiFramework,
        priority: "High" as ModulePriority,
        numberOfTests: Number(apiTestCount) || 8,
        requirementText: apiRequirementText || undefined,
      };
      const result = scope === "endpoint" && endpoint
        ? await projectApi.generateApiTestsForEndpoint(endpoint.id, baseInput)
        : scope === "collection" && selectedWorkspace
          ? await projectApi.generateApiTestsForCollection(selectedWorkspace.id, baseInput)
          : await projectApi.generateApiTests({
            ...baseInput,
            manualEndpoint: { method: manualApiMethod, endpoint: manualApiEndpoint || "/api/resource" },
          });
      setGeneratedSuite(result.suite);
      setGeneratedTests(result.tests);
      toast.success(`Generated ${result.tests.length} API tests`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to generate API tests.");
    } finally {
      setIsGeneratingApiTests(false);
    }
  };

  const updateGeneratedTestStatus = async (testId: string, action: "approve" | "reject" | "regenerate") => {
    try {
      const result = action === "approve"
        ? await projectApi.approveGeneratedApiTest(testId)
        : action === "reject"
          ? await projectApi.rejectGeneratedApiTest(testId)
          : await projectApi.regenerateGeneratedApiTest(testId);
      if (result.suite) await loadGeneratedTests(result.suite.id, result.suite);
      toast.success(action === "approve" ? "API test approved" : action === "reject" ? "API test rejected" : "API test regenerated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update generated API test.");
    }
  };

  const parseJsonObject = (value: string, label: string) => {
    try {
      const parsed = JSON.parse(value || "{}");
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      return parsed as Record<string, string>;
    } catch {
      throw new Error(`${label} must be a valid JSON object.`);
    }
  };

  const runnerInput = () => {
    const headers = parseJsonObject(runnerHeaders, "Headers");
    const body = JSON.parse(runnerBody || "{}") as unknown;
    return {
      workspaceId,
      projectId: projectId === "none" ? undefined : projectId,
      apiWorkspaceId: selectedWorkspace?.id,
      environment: runnerEnvironment,
      variables: {
        BASE_URL: runnerBaseUrl || selectedWorkspace?.serverUrls?.[0] || "",
        API_TOKEN: runnerToken,
        TOKEN: runnerToken,
        API_KEY: runnerApiKey,
      },
      headers,
      requestBody: body,
      timeoutMs: Number(runnerTimeout) || 15000,
      assertions: [
        { assertionType: "status_code_equals" as const, expectedValue: Number(runnerStatusAssertion) || 200, enabled: true },
        { assertionType: "response_time_less_than" as const, expectedValue: Number(runnerResponseTimeAssertion) || 2000, enabled: true },
        { assertionType: "schema_validation" as const, enabled: true },
      ],
    };
  };

  const refreshApiRuns = async () => {
    setApiRuns(await projectApi.listApiRuns({ workspaceId, apiWorkspaceId: selectedWorkspace?.id }));
  };

  const runEndpoint = async (endpoint: ApiEndpoint) => {
    if (["DELETE", "PUT", "PATCH"].includes(endpoint.method) && !window.confirm(`${endpoint.method} can change data. Run this API request?`)) return;
    setIsRunningApi(true);
    try {
      const run = await projectApi.runApiEndpoint(endpoint.id, {
        ...runnerInput(),
        apiWorkspaceId: endpoint.apiWorkspaceId,
        authType: endpoint.authType,
      });
      setSelectedApiRun(run);
      await refreshApiRuns();
      toast.success(`API run ${run.resultStatus.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API run failed.");
    } finally {
      setIsRunningApi(false);
    }
  };

  const runManualRequest = async () => {
    setIsRunningApi(true);
    try {
      const run = await projectApi.runApiRequest({
        ...runnerInput(),
        url: manualApiEndpoint || `${runnerBaseUrl}/api/resource`,
        method: manualApiMethod,
      });
      setSelectedApiRun(run);
      await refreshApiRuns();
      toast.success(`API run ${run.resultStatus.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API request failed.");
    } finally {
      setIsRunningApi(false);
    }
  };

  const runCollection = async () => {
    if (!selectedWorkspace) return;
    setIsRunningApi(true);
    try {
      const result = await projectApi.runApiCollection(selectedWorkspace.id, runnerInput());
      setLatestCollectionSummary(result.summary);
      setSelectedApiRun(result.runs[0] ?? null);
      await refreshApiRuns();
      toast.success(`Collection run completed: ${result.summary.passed}/${result.summary.total} passed`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Collection run failed.");
    } finally {
      setIsRunningApi(false);
    }
  };

  const refreshContractData = async (endpointId?: string) => {
    const [dashboard, history] = await Promise.all([
      projectApi.getApiContractDashboard(workspaceId),
      endpointId ? projectApi.getApiContractHistory(endpointId) : Promise.resolve(contractValidations),
    ]);
    setContractDashboard(dashboard);
    if (endpointId) setContractValidations(history);
  };

  const validateContract = async (endpoint: ApiEndpoint, run?: ApiRun | null) => {
    setIsValidatingContract(true);
    try {
      const validation = await projectApi.validateApiContractEndpoint(endpoint.id, run ? { runId: run.id } : {});
      setSelectedContractValidation(validation);
      setContractValidations(await projectApi.getApiContractHistory(endpoint.id));
      setContractDashboard(await projectApi.getApiContractDashboard(workspaceId));
      toast.success(`Contract ${validation.validationStatus.toLowerCase()} with ${validation.compatibilityScore}% compatibility`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Contract validation failed.");
    } finally {
      setIsValidatingContract(false);
    }
  };

  const validateWorkspaceContracts = async () => {
    if (!selectedWorkspace) return;
    setIsValidatingContract(true);
    try {
      const result = await projectApi.validateApiContractWorkspace(selectedWorkspace.id);
      setContractDashboard(await projectApi.getApiContractDashboard(workspaceId));
      toast.success(`Validated ${result.summary.total} API contracts`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Workspace contract validation failed.");
    } finally {
      setIsValidatingContract(false);
    }
  };

  const refreshApiValidation = async (validationId: string) => {
    const response = await projectApi.getApiValidation(validationId);
    setSelectedApiValidation(response.validationRun);
    setApiValidationResults(response.results);
    setApiValidations((items) => [response.validationRun, ...items.filter((item) => item.id !== response.validationRun.id)]);
    const failurePayload = await projectApi.getApiFailureAnalysisByValidation(validationId).catch(() => null);
    setApiFailureAnalysis(failurePayload?.analysis ?? null);
    setApiFailureEvidence(failurePayload?.evidence ?? []);
    return response.validationRun;
  };

  const refreshApiValidationHistory = async () => {
    const history = await projectApi.listApiValidations({ workspaceId, apiWorkspaceId: selectedWorkspace?.id });
    setApiValidations(history);
    if (!selectedApiValidation && history[0]) setSelectedApiValidation(history[0]);
  };

  const runApiGithubValidation = async (scope: "suite" | "workspace" | "endpoint", endpoint?: ApiEndpoint) => {
    setIsRunningApiValidation(true);
    try {
      const input = {
        workspaceId,
        projectId: projectId === "none" ? undefined : projectId,
        apiWorkspaceId: selectedWorkspace?.id,
        validationMode: apiValidationMode,
        framework: apiFramework,
        environment: apiValidationEnvironment,
        variables: {
          BASE_URL: runnerBaseUrl || selectedWorkspace?.serverUrls?.[0] || "",
          API_TOKEN: runnerToken,
          API_KEY: runnerApiKey,
        },
      };
      const run = scope === "suite" && generatedSuite
        ? await projectApi.runApiValidation({ ...input, generatedSuiteId: generatedSuite.id, triggerSource: "Generated API Test Suite" })
        : scope === "endpoint" && endpoint
          ? await projectApi.runApiEndpointValidation(endpoint.id, input)
          : selectedWorkspace
            ? await projectApi.runApiWorkspaceValidation(selectedWorkspace.id, input)
            : await projectApi.runApiValidation({ ...input, triggerSource: "API Validation" });
      setSelectedApiValidation(run);
      setApiValidationResults([]);
      setApiFailureAnalysis(null);
      setApiFailureEvidence([]);
      setApiValidations((items) => [run, ...items.filter((item) => item.id !== run.id)]);
      toast.success("API GitHub validation started.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start API validation.");
    } finally {
      setIsRunningApiValidation(false);
    }
  };

  const retryApiGithubValidation = async () => {
    if (!selectedApiValidation) return;
    setIsRunningApiValidation(true);
    try {
      const run = await projectApi.retryApiValidation(selectedApiValidation.id, {
        variables: {
          BASE_URL: runnerBaseUrl || selectedWorkspace?.serverUrls?.[0] || "",
          API_TOKEN: runnerToken,
          API_KEY: runnerApiKey,
        },
      });
      setSelectedApiValidation(run);
      setApiValidationResults([]);
      setApiFailureAnalysis(null);
      setApiFailureEvidence([]);
      setApiValidations((items) => [run, ...items.filter((item) => item.id !== run.id)]);
      toast.success("API validation retry started.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to retry API validation.");
    } finally {
      setIsRunningApiValidation(false);
    }
  };

  const analyzeSelectedApiFailure = async (regenerate = false) => {
    if (!selectedApiValidation) return;
    setIsAnalyzingApiFailure(true);
    try {
      const payload = regenerate
        ? await projectApi.regenerateApiFailureAnalysis({
          analysisId: apiFailureAnalysis?.id,
          validationRunId: selectedApiValidation.id,
        })
        : await projectApi.analyzeApiValidationFailure(selectedApiValidation.id);
      setApiFailureAnalysis(payload.analysis);
      setApiFailureEvidence(payload.evidence);
      toast.success(regenerate ? "API failure analysis regenerated." : "API failure analysis completed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to analyze API failure.");
    } finally {
      setIsAnalyzingApiFailure(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border bg-card/90 p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">API Testing Intelligence</Badge>
          <h1 className="font-display text-3xl font-semibold text-foreground">API Workspace</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Import Swagger/OpenAPI specifications, detect endpoints and contracts, and prepare APIs for AI test generation, contract checks, and release readiness.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{workspaces.length} specs</Badge>
          <Badge variant="outline">{postmanWorkspaces.length} Postman collections</Badge>
          <Badge variant="outline">{endpoints.length} endpoints</Badge>
          <Badge variant="outline" className={(highRiskCount + postmanHighRiskCount) ? "border-red-200 bg-red-50 text-red-700" : ""}>{highRiskCount + postmanHighRiskCount} high risk</Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Network className="size-5" /></div>
            <div>
              <h2 className="font-display text-xl font-semibold">Import API Specification</h2>
              <p className="text-sm text-muted-foreground">Supports OpenAPI 3.x, Swagger 2.0, JSON, and YAML.</p>
            </div>
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold">Project</label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Optional project" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No project selected</SelectItem>
                {projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="upload" className="mt-5">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="swagger">URL</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="api">API URL</TabsTrigger>
              <TabsTrigger value="postman">Postman</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4 space-y-3">
              <Input
                type="file"
                accept=".json,.yaml,.yml,application/json"
                disabled={!canImport || isImporting}
                onChange={(event) => void onUploadFile(event.target.files?.[0])}
              />
              <p className="text-xs text-muted-foreground">Upload a Swagger/OpenAPI JSON or YAML file from your machine.</p>
            </TabsContent>
            <TabsContent value="swagger" className="mt-4 space-y-3">
              <Input value={swaggerUrl} onChange={(event) => setSwaggerUrl(event.target.value)} placeholder="https://example.com/openapi.json" />
              <Button disabled={!canImport || isImporting || !swaggerUrl} onClick={() => void importSpec(() => projectApi.importApiWorkspaceUrl({ workspaceId, projectId: projectId === "none" ? undefined : projectId, url: swaggerUrl, sourceType: "swagger_url" }))}>
                {isImporting ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
                Import Swagger URL
              </Button>
            </TabsContent>
            <TabsContent value="github" className="mt-4 grid gap-3 sm:grid-cols-2">
              <Input value={githubForm.owner} onChange={(event) => setGithubForm((value) => ({ ...value, owner: event.target.value }))} placeholder="Repository owner" />
              <Input value={githubForm.repo} onChange={(event) => setGithubForm((value) => ({ ...value, repo: event.target.value }))} placeholder="Repository name" />
              <Input value={githubForm.branch} onChange={(event) => setGithubForm((value) => ({ ...value, branch: event.target.value }))} placeholder="Branch" />
              <Input value={githubForm.path} onChange={(event) => setGithubForm((value) => ({ ...value, path: event.target.value }))} placeholder="docs/openapi.yaml" />
              <Button className="sm:col-span-2" disabled={!canImport || isImporting || !githubForm.owner || !githubForm.repo || !githubForm.path} onClick={() => void importSpec(() => projectApi.importApiWorkspaceGitHub({ workspaceId, projectId: projectId === "none" ? undefined : projectId, ...githubForm }))}>
                {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Github className="size-4" />}
                Import from GitHub
              </Button>
            </TabsContent>
            <TabsContent value="api" className="mt-4 space-y-3">
              <Input value={apiUrl} onChange={(event) => setApiUrl(event.target.value)} placeholder="https://api.example.com/swagger.yaml" />
              <Button disabled={!canImport || isImporting || !apiUrl} onClick={() => void importSpec(() => projectApi.importApiWorkspaceUrl({ workspaceId, projectId: projectId === "none" ? undefined : projectId, url: apiUrl, sourceType: "api_url" }))}>
                {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Network className="size-4" />}
                Import API URL
              </Button>
            </TabsContent>
            <TabsContent value="postman" className="mt-4 space-y-4">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="font-semibold">Import Postman Collection</p>
                <p className="mt-1 text-xs text-muted-foreground">Collection v2/v2.1 imports become AI-ready API workspaces with requests, variables, auth, tests, and risk analysis.</p>
                <Input
                  className="mt-3"
                  type="file"
                  accept=".json,application/json"
                  disabled={!canImport || isImporting}
                  onChange={(event) => void onUploadPostmanCollection(event.target.files?.[0])}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="font-semibold">Upload Environment</p>
                  <p className="mt-1 text-xs text-muted-foreground">Attach Local, QA, UAT, Staging, or Production variables to the selected collection.</p>
                  <Input className="mt-3" type="file" accept=".json,application/json" disabled={!canImport || !selectedPostman || isImporting} onChange={(event) => void onUploadPostmanEnvironment(event.target.files?.[0], "environment")} />
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="font-semibold">Upload Globals</p>
                  <p className="mt-1 text-xs text-muted-foreground">Import shared global variables for variable resolution.</p>
                  <Input className="mt-3" type="file" accept=".json,application/json" disabled={!canImport || !selectedPostman || isImporting} onChange={(event) => void onUploadPostmanEnvironment(event.target.files?.[0], "global")} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={postmanGithubForm.owner} onChange={(event) => setPostmanGithubForm((value) => ({ ...value, owner: event.target.value }))} placeholder="GitHub owner" />
                <Input value={postmanGithubForm.repo} onChange={(event) => setPostmanGithubForm((value) => ({ ...value, repo: event.target.value }))} placeholder="Repository name" />
                <Input value={postmanGithubForm.branch} onChange={(event) => setPostmanGithubForm((value) => ({ ...value, branch: event.target.value }))} placeholder="Branch" />
                <Input value={postmanGithubForm.path} onChange={(event) => setPostmanGithubForm((value) => ({ ...value, path: event.target.value }))} placeholder="collections/api.postman_collection.json" />
                <Button className="sm:col-span-2" disabled={!canImport || isImporting || !postmanGithubForm.owner || !postmanGithubForm.repo || !postmanGithubForm.path} onClick={() => void importSpec(() => projectApi.importPostmanGitHub({ workspaceId, projectId: projectId === "none" ? undefined : projectId, ...postmanGithubForm }))}>
                  {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Github className="size-4" />}
                  Import Postman from GitHub
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {!canImport && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Your role can view API workspaces. Import access is available for Owner, Admin, and QA Lead.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Imported API Workspaces</h2>
              <p className="text-sm text-muted-foreground">Select a specification to review inventory and endpoint details.</p>
            </div>
            <Button variant="outline" onClick={() => void loadWorkspaces()} disabled={isLoading}>
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Refresh
            </Button>
          </div>

          <div className="mt-5 grid gap-3">
            {isLoading && !workspaces.length ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
            ) : workspaces.length ? (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => void selectWorkspace(workspace.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition hover:border-primary/40 hover:bg-primary/5",
                    selectedWorkspace?.id === workspace.id && "border-primary/50 bg-primary/5",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{workspace.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{workspace.version || "No version"} · {workspace.totalEndpoints} endpoints</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{workspace.format}</Badge>
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{workspace.importStatus}</Badge>
                    </div>
                  </div>
                  <p className="mt-3 truncate text-xs text-muted-foreground">{workspace.sourceUrl || workspace.githubRepo || "Uploaded file"} · Imported {formatDate(workspace.createdAt)}</p>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed p-8 text-center">
                <Network className="mx-auto size-8 text-primary" />
                <h3 className="mt-3 font-semibold">No API workspaces yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Import Swagger or OpenAPI to create your API inventory.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">API Repository Intelligence</Badge>
            <h2 className="font-display text-xl font-semibold">Backend/API Repository Map</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Connect backend repositories, detect routes/controllers/services/schemas, map API tests, and understand API impact from code changes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void scanApiRepository()} disabled={!selectedApiRepository || isScanningApiRepository}>
              {isScanningApiRepository ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Scan Repository
            </Button>
            <Button variant="outline" disabled={!selectedApiRepository}>
              <ListChecks className="size-4" />
              Generate Missing API Tests
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.25fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="font-semibold">Connect Backend Repository</p>
              <p className="mt-1 text-sm text-muted-foreground">GitHub token is encrypted in the backend and used only for repository scanning.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input value={apiRepositoryForm.owner} onChange={(event) => setApiRepositoryForm((value) => ({ ...value, owner: event.target.value }))} placeholder="Repository owner" />
                <Input value={apiRepositoryForm.repo} onChange={(event) => setApiRepositoryForm((value) => ({ ...value, repo: event.target.value }))} placeholder="Backend repository" />
                <Input value={apiRepositoryForm.defaultBranch} onChange={(event) => setApiRepositoryForm((value) => ({ ...value, defaultBranch: event.target.value }))} placeholder="Default branch" />
                <Input type="password" value={apiRepositoryForm.token} onChange={(event) => setApiRepositoryForm((value) => ({ ...value, token: event.target.value }))} placeholder="GitHub token / PAT" />
                <Button className="sm:col-span-2" onClick={() => void connectApiRepository()} disabled={!canImport || isScanningApiRepository}>
                  {isScanningApiRepository ? <Loader2 className="size-4 animate-spin" /> : <Github className="size-4" />}
                  Connect & Scan Repository
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Connected Backend Repositories</p>
                  <p className="text-sm text-muted-foreground">{apiRepositories.length} connected repositories</p>
                </div>
                <Badge variant="outline">{selectedApiRepository?.framework ?? "No repo"}</Badge>
              </div>
              <div className="mt-3 max-h-64 space-y-2 overflow-auto">
                {apiRepositories.map((repository) => (
                  <button
                    key={repository.id}
                    type="button"
                    onClick={() => void selectApiRepository(repository.id)}
                    className={cn(
                      "w-full rounded-xl border bg-background p-3 text-left transition hover:border-primary/40 hover:bg-primary/5",
                      selectedApiRepository?.id === repository.id && "border-primary/50 bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{repository.repositoryName}</p>
                      <Badge variant="outline" className={repository.coverageScore >= 80 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : repository.coverageScore >= 50 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}>
                        {repository.coverageScore}% coverage
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {repository.framework} · {repository.language} · {repository.totalEndpoints} APIs · {repository.lastScannedAt ? `Scanned ${formatDate(repository.lastScannedAt)}` : "Not scanned"}
                    </p>
                  </button>
                ))}
                {!apiRepositories.length && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No backend repositories connected yet.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MiniStat label="Framework" value={selectedApiRepository?.framework ?? "Unknown"} />
              <MiniStat label="APIs Detected" value={selectedApiRepository?.totalEndpoints ?? 0} />
              <MiniStat label="Auth APIs" value={selectedApiRepository?.protectedEndpoints ?? 0} />
              <MiniStat label="High Risk" value={selectedApiRepository?.highRiskEndpoints ?? 0} />
              <MiniStat label="Coverage Score" value={`${apiRepositoryCoverage?.coverageScore ?? selectedApiRepository?.coverageScore ?? 0}%`} />
              <MiniStat label="Controllers" value={selectedApiRepository?.controllerDirectories.length ?? 0} />
              <MiniStat label="Services" value={selectedApiRepository?.serviceDirectories.length ?? 0} />
              <MiniStat label="DTO/Schemas" value={selectedApiRepository?.dtoDirectories.length ?? 0} />
            </div>

            <Tabs defaultValue="map">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="map">API Map</TabsTrigger>
                <TabsTrigger value="graph">Dependency Graph</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
                <TabsTrigger value="coverage">Coverage</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-4">
                <div className="rounded-2xl border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Detected Routes</p>
                    <Badge variant="outline">{apiRouteMappings.length} endpoints</Badge>
                  </div>
                  <div className="mt-3 max-h-96 overflow-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="sticky top-0 bg-muted text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2">Method</th>
                          <th className="px-3 py-2">Endpoint</th>
                          <th className="px-3 py-2">Controller</th>
                          <th className="px-3 py-2">Auth</th>
                          <th className="px-3 py-2">Risk</th>
                          <th className="px-3 py-2">Tests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiRouteMappings.map((route) => (
                          <tr key={route.id} className="border-b last:border-0">
                            <td className="px-3 py-2 font-mono text-xs font-semibold">{route.method}</td>
                            <td className="px-3 py-2 font-mono text-xs">{route.path}</td>
                            <td className="px-3 py-2 text-xs">{route.controllerFile ?? "Not detected"}{route.lineNumber ? `:${route.lineNumber}` : ""}</td>
                            <td className="px-3 py-2"><Badge variant="outline">{route.authRequired ? "Protected" : "Public"}</Badge></td>
                            <td className="px-3 py-2"><RiskBadge risk={route.riskLevel} /></td>
                            <td className="px-3 py-2 text-xs">{route.testFiles.length ? `${route.testFiles.length} mapped` : "Missing"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!apiRouteMappings.length && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">Scan a backend repository to detect API routes.</p>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="graph" className="mt-4">
                <div className="max-h-96 space-y-3 overflow-auto rounded-2xl border bg-muted/20 p-4">
                  {apiDependencyGraph.map((module) => (
                    <div key={module.moduleName} className="rounded-xl border bg-background p-3">
                      <p className="font-semibold capitalize">{module.moduleName} Module</p>
                      <div className="mt-2 space-y-2">
                        {module.endpoints.map((endpoint) => (
                          <div key={`${endpoint.method}-${endpoint.path}`} className="rounded-lg bg-muted/40 p-3 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">{endpoint.method}</Badge>
                              <span className="font-mono text-xs">{endpoint.path}</span>
                              <RiskBadge risk={endpoint.riskLevel} />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">Controller: {endpoint.controller || "Not detected"}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Services: {endpoint.services.join(", ") || "Not mapped"}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Tests: {endpoint.tests.join(", ") || "No mapped tests"}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!apiDependencyGraph.length && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">Dependency graph appears after a repository scan.</p>}
                </div>
              </TabsContent>

              <TabsContent value="impact" className="mt-4">
                <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="font-semibold">Changed Backend Files</p>
                    <p className="mt-1 text-sm text-muted-foreground">Paste changed files from a commit, PR, or webhook event. One file per line.</p>
                    <Textarea
                      className="mt-3 font-mono text-xs"
                      rows={8}
                      value={apiChangedFiles}
                      onChange={(event) => setApiChangedFiles(event.target.value)}
                      placeholder={"src/auth/auth.service.ts\nsrc/auth/auth.controller.ts\nsrc/auth/dto/login.dto.ts"}
                    />
                    <Button className="mt-3 w-full" onClick={() => void runApiImpactAnalysis()} disabled={!selectedApiRepository || isAnalyzingApiImpact}>
                      {isAnalyzingApiImpact ? <Loader2 className="size-4 animate-spin" /> : <SearchCheck className="size-4" />}
                      Run API Impact Analysis
                    </Button>
                  </div>
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">Impact Result</p>
                      {apiImpactAnalysis && <RiskBadge risk={apiImpactAnalysis.riskLevel} />}
                    </div>
                    {apiImpactAnalysis ? (
                      <div className="mt-3 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <MiniStat label="Impacted APIs" value={apiImpactAnalysis.affectedEndpoints.length} />
                          <MiniStat label="Affected Tests" value={apiImpactAnalysis.affectedTests.length} />
                          <MiniStat label="Confidence" value={`${apiImpactAnalysis.confidenceScore}%`} />
                        </div>
                        <ImpactList title="Affected Endpoints" items={apiImpactAnalysis.affectedEndpoints} />
                        <ImpactList title="Affected Services" items={apiImpactAnalysis.affectedServices} />
                        <ImpactList title="Affected Schemas" items={apiImpactAnalysis.affectedSchemas} />
                        <ImpactList title="Recommended Actions" items={apiImpactAnalysis.recommendations} />
                      </div>
                    ) : (
                      <p className="mt-3 rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No API impact analysis yet.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="coverage" className="mt-4">
                <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="font-semibold">API Coverage Intelligence</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <MiniStat label="With Tests" value={apiRepositoryCoverage?.endpointsWithTests ?? 0} />
                      <MiniStat label="Without Tests" value={apiRepositoryCoverage?.endpointsWithoutTests ?? 0} />
                      <MiniStat label="High Risk Coverage" value={`${apiRepositoryCoverage?.highRiskEndpointCoverage ?? 0}%`} />
                      <MiniStat label="Protected APIs" value={apiRepositoryCoverage?.authCoverage ?? 0} />
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-muted/20 p-4">
                    <p className="font-semibold">Risk Summary</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-4">
                      <MiniStat label="High" value={apiRepositoryRisk?.high ?? 0} />
                      <MiniStat label="Medium" value={apiRepositoryRisk?.medium ?? 0} />
                      <MiniStat label="Low" value={apiRepositoryRisk?.low ?? 0} />
                      <MiniStat label="Protected" value={apiRepositoryRisk?.protectedEndpoints ?? 0} />
                    </div>
                    <div className="mt-3 space-y-2">
                      {(apiRepositoryRisk?.recommendations ?? []).map((recommendation) => (
                        <div key={recommendation} className="rounded-xl border bg-background p-3 text-sm">{recommendation}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">API GitHub Validation</Badge>
            <h2 className="font-display text-xl font-semibold">Validate API Tests with GitHub Actions</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Commit approved API tests to a validation branch, trigger GitHub Actions, track execution progress, and feed results into AI analysis and release readiness.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void runApiGithubValidation("suite")} disabled={isRunningApiValidation || !generatedSuite}>
              {isRunningApiValidation ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
              Run Suite Validation
            </Button>
            <Button variant="outline" onClick={() => void runApiGithubValidation("workspace")} disabled={isRunningApiValidation || !selectedWorkspace}>
              <Network className="size-4" />
              Validate Workspace
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="font-semibold">Validation Settings</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Mode</label>
                  <Select value={apiValidationMode} onValueChange={(value) => setApiValidationMode(value as ApiValidationMode)}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick Validation</SelectItem>
                      <SelectItem value="impact">Impact Validation</SelectItem>
                      <SelectItem value="full">Full Validation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Environment</label>
                  <Select value={apiValidationEnvironment} onValueChange={setApiValidationEnvironment}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Local", "Development", "QA", "UAT", "Staging", "Production"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3 rounded-xl border bg-background p-3 text-xs text-muted-foreground">
                Uses the connected Automation Repository and `.github/workflows/api-validation.yml`. Secrets are passed as variables and masked by GitHub.
              </div>
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">Validation History</p>
                <Button variant="outline" size="sm" onClick={() => void refreshApiValidationHistory()}>Refresh</Button>
              </div>
              <div className="mt-3 max-h-80 space-y-2 overflow-auto">
                {apiValidations.map((run) => (
                  <button
                    key={run.id}
                    type="button"
                    onClick={() => void refreshApiValidation(run.id)}
                    className={cn(
                      "w-full rounded-xl border bg-background p-3 text-left transition hover:border-primary/40",
                      selectedApiValidation?.id === run.id && "border-primary/50 bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold">{run.triggerSource}</p>
                      <ApiValidationStatusBadge status={run.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{run.framework} · {run.environment} · {formatValidationDuration(run.duration)} · {formatDate(run.createdAt)}</p>
                  </button>
                ))}
                {!apiValidations.length && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No API validations yet.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">Validation Result</p>
                  <p className="text-sm text-muted-foreground">GitHub Actions execution, progress, reports, logs, and AI recommendation.</p>
                </div>
                {selectedApiValidation && <ApiValidationStatusBadge status={selectedApiValidation.status} />}
              </div>

              {selectedApiValidation ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{selectedApiValidation.currentStep}</span>
                      <span>{selectedApiValidation.progress}%</span>
                    </div>
                    <Progress value={selectedApiValidation.progress} className="h-2.5" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <MiniStat label="Status" value={selectedApiValidation.status} />
                    <MiniStat label="Mode" value={selectedApiValidation.validationMode} />
                    <MiniStat label="Framework" value={selectedApiValidation.framework} />
                    <MiniStat label="Environment" value={selectedApiValidation.environment} />
                    <MiniStat label="Passed APIs" value={selectedApiValidation.passedTests} />
                    <MiniStat label="Failed APIs" value={selectedApiValidation.failedTests} />
                    <MiniStat label="Skipped" value={selectedApiValidation.skippedTests} />
                    <MiniStat label="Duration" value={formatValidationDuration(selectedApiValidation.duration)} />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <CopyableValue label="Validation Branch" value={selectedApiValidation.branch} />
                    <CopyableValue label="Workflow Run ID" value={selectedApiValidation.workflowRunId ? String(selectedApiValidation.workflowRunId) : "-"} href={selectedApiValidation.workflowUrl} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={() => void refreshApiValidation(selectedApiValidation.id)}>
                      <RefreshCw className="size-4" />
                      Poll Result
                    </Button>
                    <Button variant="outline" onClick={() => void retryApiGithubValidation()} disabled={isRunningApiValidation}>
                      <RefreshCw className="size-4" />
                      Retry Validation
                    </Button>
                    <Button variant="outline" disabled={!selectedApiValidation.workflowUrl} onClick={() => selectedApiValidation.workflowUrl && window.open(selectedApiValidation.workflowUrl, "_blank")}>
                      <ExternalLink className="size-4" />
                      Open Workflow
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => void analyzeSelectedApiFailure(false)}
                      disabled={isAnalyzingApiFailure || !["Failed", "Error"].includes(selectedApiValidation.status)}
                    >
                      {isAnalyzingApiFailure ? <Loader2 className="size-4 animate-spin" /> : <Bot className="size-4" />}
                      Analyze Failure
                    </Button>
                    <Button variant="outline" disabled>
                      <Wand2 className="size-4" />
                      Generate Auto Fix Soon
                    </Button>
                  </div>
                  <div className="rounded-xl border bg-background p-3 text-sm">
                    <p className="font-semibold">AI Recommendation</p>
                    <p className="mt-1 text-muted-foreground">{selectedApiValidation.aiRecommendation || "Recommendation will be available after validation completes."}</p>
                  </div>
                  {selectedApiValidation.status === "Failed" && !apiFailureAnalysis && (
                    <div className="rounded-xl border border-dashed bg-background p-4 text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">API Failure Analysis</p>
                      <p className="mt-1">Run AI analysis to identify the likely root cause, impacted APIs, backend files, tests, and recommended next actions.</p>
                    </div>
                  )}
                  {apiFailureAnalysis && (
                    <div className="space-y-4 rounded-2xl border bg-background p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2 border-primary/30 bg-primary/10 text-primary">API Failure Analysis</Badge>
                          <h3 className="font-display text-lg font-semibold">{apiFailureAnalysis.failureCategory}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{apiFailureAnalysis.rootCause}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize",
                              apiFailureAnalysis.severity === "Critical" && "border-red-700 bg-red-950/10 text-red-700",
                              apiFailureAnalysis.severity === "High" && "border-red-500 bg-red-500/10 text-red-600",
                              apiFailureAnalysis.severity === "Medium" && "border-amber-500 bg-amber-500/10 text-amber-700",
                              apiFailureAnalysis.severity === "Low" && "border-emerald-500 bg-emerald-500/10 text-emerald-700",
                            )}
                          >
                            {apiFailureAnalysis.severity} severity
                          </Badge>
                          <Badge variant="outline">{apiFailureAnalysis.confidenceScore}% confidence</Badge>
                          <Badge variant="outline">{apiFailureAnalysis.autoFixPossible ? "Auto fix possible" : "Manual review"}</Badge>
                        </div>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <MiniStat label="Impacted APIs" value={apiFailureAnalysis.impactedApis.length} />
                        <MiniStat label="Impacted Tests" value={apiFailureAnalysis.impactedTests.length} />
                        <MiniStat label="Backend Files" value={apiFailureAnalysis.impactedBackendFiles.length} />
                        <MiniStat label="Evidence Items" value={apiFailureEvidence.length || apiFailureAnalysis.evidence.length} />
                      </div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border bg-muted/20 p-3">
                          <p className="font-semibold">Failure Summary</p>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{apiFailureAnalysis.responseSummary || apiFailureAnalysis.requestSummary}</p>
                        </div>
                        <div className="rounded-xl border bg-muted/20 p-3">
                          <p className="font-semibold">Recommended Actions</p>
                          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                            {apiFailureAnalysis.recommendations.map((item) => (
                              <li key={item} className="flex gap-2">
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="grid gap-4 lg:grid-cols-3">
                        <ImpactList title="Impacted APIs" items={apiFailureAnalysis.impactedApis} empty="No impacted APIs detected." />
                        <ImpactList title="Impacted Tests" items={apiFailureAnalysis.impactedTests} empty="No mapped API tests detected." />
                        <ImpactList title="Backend Files" items={apiFailureAnalysis.impactedBackendFiles} empty="No backend files mapped yet." />
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-3">
                        <p className="font-semibold">Evidence Timeline</p>
                        <div className="mt-3 space-y-2">
                          {(apiFailureEvidence.length ? apiFailureEvidence : apiFailureAnalysis.evidence.map((summary, index) => ({
                            id: `${apiFailureAnalysis.id}-${index}`,
                            analysisId: apiFailureAnalysis.id,
                            sourceType: "analysis",
                            sourceReference: apiFailureAnalysis.id,
                            evidenceType: "Evidence",
                            summary,
                            confidence: apiFailureAnalysis.confidenceScore,
                            createdAt: apiFailureAnalysis.createdAt,
                          }))).map((item) => (
                            <div key={item.id} className="rounded-lg border bg-background p-3 text-sm">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium">{item.evidenceType}</p>
                                <Badge variant="outline">{item.confidence}%</Badge>
                              </div>
                              <p className="mt-1 text-muted-foreground">{item.summary}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{item.sourceType} · {item.sourceReference}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => void analyzeSelectedApiFailure(true)} disabled={isAnalyzingApiFailure}>
                          {isAnalyzingApiFailure ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                          Regenerate Analysis
                        </Button>
                        <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${apiFailureAnalysis.rootCause}\n\n${apiFailureAnalysis.recommendations.join("\n")}`)}>
                          <Copy className="size-4" />
                          Copy Summary
                        </Button>
                        <Button variant="outline" disabled>
                          <Wand2 className="size-4" />
                          Generate AI Auto Fix Soon
                        </Button>
                        <Button variant="outline" onClick={() => void retryApiGithubValidation()} disabled={isRunningApiValidation}>
                          <RefreshCw className="size-4" />
                          Retry Validation
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Run API validation to see GitHub Actions status and reports.</p>
              )}
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="font-semibold">Failed and Passed APIs</p>
              <div className="mt-3 max-h-72 overflow-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-muted text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Method</th>
                      <th className="px-3 py-2">Endpoint</th>
                      <th className="px-3 py-2">Expected</th>
                      <th className="px-3 py-2">Actual</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Failure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiValidationResults.map((result) => (
                      <tr key={result.id} className="border-b last:border-0">
                        <td className="px-3 py-2 font-mono text-xs">{result.method}</td>
                        <td className="px-3 py-2 font-mono text-xs">{result.endpoint}</td>
                        <td className="px-3 py-2">{result.expectedStatus ?? "-"}</td>
                        <td className="px-3 py-2">{result.actualStatus ?? "-"}</td>
                        <td className="px-3 py-2"><Badge variant="outline">{result.status}</Badge></td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{result.failureReason ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!apiValidationResults.length && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No API validation result rows selected yet.</p>}
              </div>
            </div>

            {selectedApiValidation && (
              <details className="rounded-2xl border bg-muted/20 p-4">
                <summary className="cursor-pointer font-semibold">Validation Logs</summary>
                <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{selectedApiValidation.logs || "Logs will appear after the workflow starts."}</pre>
              </details>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">API Runner</Badge>
            <h2 className="font-display text-xl font-semibold">Execute APIs From Workspace</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Run endpoints, manual requests, or full collections with environment variables, auth, assertions, response viewing, and saved run history.
            </p>
          </div>
          {latestCollectionSummary && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{latestCollectionSummary.total} run</Badge>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{latestCollectionSummary.passed} passed</Badge>
              <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">{latestCollectionSummary.failed + latestCollectionSummary.errors} failed</Badge>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-2xl border bg-muted/20 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Environment</label>
                <Select value={runnerEnvironment} onValueChange={setRunnerEnvironment}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Local", "Development", "QA", "UAT", "Staging", "Production"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Timeout</label>
                <Input className="mt-2" value={runnerTimeout} onChange={(event) => setRunnerTimeout(event.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Expected Status</label>
                <Input className="mt-2" value={runnerStatusAssertion} onChange={(event) => setRunnerStatusAssertion(event.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">BASE_URL</label>
              <Input className="mt-2" value={runnerBaseUrl} onChange={(event) => setRunnerBaseUrl(event.target.value)} placeholder={selectedWorkspace?.serverUrls?.[0] || "https://api.example.com"} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input type="password" value={runnerToken} onChange={(event) => setRunnerToken(event.target.value)} placeholder="API_TOKEN / Bearer token" />
              <Input type="password" value={runnerApiKey} onChange={(event) => setRunnerApiKey(event.target.value)} placeholder="API_KEY" />
            </div>
            <div className="grid gap-3 md:grid-cols-[120px_1fr]">
              <Select value={manualApiMethod} onValueChange={setManualApiMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"].map((method) => <SelectItem key={method} value={method}>{method}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input value={manualApiEndpoint} onChange={(event) => setManualApiEndpoint(event.target.value)} placeholder="{{BASE_URL}}/api/users/{{userId}}" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Headers JSON</label>
                <Textarea className="mt-2 font-mono text-xs" value={runnerHeaders} onChange={(event) => setRunnerHeaders(event.target.value)} rows={4} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Body JSON</label>
                <Textarea className="mt-2 font-mono text-xs" value={runnerBody} onChange={(event) => setRunnerBody(event.target.value)} rows={4} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void runManualRequest()} disabled={isRunningApi}>
                {isRunningApi ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
                Run Request
              </Button>
              <Button variant="outline" onClick={() => void runCollection()} disabled={isRunningApi || !selectedWorkspace}>
                <ListChecks className="size-4" />
                Run Collection
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Response Viewer</p>
                  <p className="text-sm text-muted-foreground">Status, timing, headers, body, assertions, and contract result.</p>
                </div>
                {selectedApiRun && <Badge variant="outline" className={selectedApiRun.resultStatus === "Passed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : selectedApiRun.resultStatus === "Failed" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}>{selectedApiRun.resultStatus}</Badge>}
              </div>
              {selectedApiRun ? (
                <div className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-4">
                    <MiniStat label="Status" value={selectedApiRun.statusCode ?? "Error"} />
                    <MiniStat label="Time" value={`${selectedApiRun.responseTime} ms`} />
                    <MiniStat label="Size" value={`${selectedApiRun.responseSize} B`} />
                    <MiniStat label="Assertions" value={`${selectedApiRun.assertionResults.filter((item) => item.passed).length}/${selectedApiRun.assertionResults.length}`} />
                  </div>
                  <Tabs defaultValue="body">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="assertions">Assertions</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                    <TabsContent value="body" className="mt-3"><SchemaPreview value={selectedApiRun.responseBody ?? selectedApiRun.errorMessage} /></TabsContent>
                    <TabsContent value="headers" className="mt-3"><SchemaPreview value={selectedApiRun.responseHeaders} /></TabsContent>
                    <TabsContent value="assertions" className="mt-3">
                      <div className="space-y-2">
                        {selectedApiRun.assertionResults.map((assertion) => (
                          <div key={`${assertion.assertionType}-${assertion.label}`} className="flex items-center justify-between rounded-xl border bg-muted/30 p-3 text-sm">
                            <span>{assertion.label}</span>
                            <Badge variant="outline" className={assertion.passed ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>{assertion.passed ? "Passed" : "Failed"}</Badge>
                          </div>
                        ))}
                        {selectedApiRun.contractResult && !selectedApiRun.contractResult.passed && <SchemaPreview value={selectedApiRun.contractResult.issues} />}
                      </div>
                    </TabsContent>
                    <TabsContent value="timeline" className="mt-3">
                      <div className="rounded-xl border bg-muted/30 p-3 text-sm">
                        <p>Executed at {formatDate(selectedApiRun.executedAt)}</p>
                        <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{selectedApiRun.method} {selectedApiRun.resolvedUrl}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">Run an API request to view the response.</div>
              )}
            </div>

            <div className="rounded-2xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Run History</p>
                <Button variant="outline" size="sm" onClick={() => void refreshApiRuns()}>Refresh</Button>
              </div>
              {selectedApiRun?.endpointId && (
                <Button
                  className="mt-3 w-full"
                  variant="outline"
                  onClick={() => {
                    const endpoint = endpoints.find((item) => item.id === selectedApiRun.endpointId);
                    if (endpoint) void validateContract(endpoint, selectedApiRun);
                  }}
                  disabled={isValidatingContract}
                >
                  {isValidatingContract ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  Validate Contract for This Run
                </Button>
              )}
              <div className="mt-3 max-h-72 space-y-2 overflow-auto">
                {apiRuns.slice(0, 8).map((run) => (
                  <button key={run.id} type="button" onClick={() => setSelectedApiRun(run)} className="w-full rounded-xl border bg-background p-3 text-left hover:border-primary/40">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-mono text-xs">{run.method} {run.resolvedUrl}</p>
                      <Badge variant="outline" className={run.resultStatus === "Passed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}>{run.resultStatus}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{run.statusCode || "Error"} · {run.responseTime} ms · {formatDate(run.executedAt)}</p>
                  </button>
                ))}
                {!apiRuns.length && <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No API runs yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">AI Contract Testing</Badge>
            <h2 className="font-display text-xl font-semibold">API Contract Health</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Compare actual API responses with imported Swagger/OpenAPI or Postman contracts, detect breaking changes, and generate business-aware recommendations.
            </p>
          </div>
          <Button variant="outline" onClick={() => void validateWorkspaceContracts()} disabled={!selectedWorkspace || isValidatingContract}>
            {isValidatingContract ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Validate Workspace
          </Button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MiniStat label="Compatibility" value={`${contractDashboard?.compatibilityScore ?? 100}%`} />
          <MiniStat label="Valid Contracts" value={contractDashboard?.validContracts ?? 0} />
          <MiniStat label="Failed Contracts" value={contractDashboard?.failedContracts ?? 0} />
          <MiniStat label="Breaking Changes" value={contractDashboard?.breakingChanges ?? 0} />
          <MiniStat label="High Risk APIs" value={contractDashboard?.highRiskApis ?? 0} />
          <MiniStat label="Critical APIs" value={contractDashboard?.criticalApis ?? 0} />
          <MiniStat label="Total APIs" value={contractDashboard?.totalApis ?? 0} />
          <MiniStat label="Latest Status" value={selectedContractValidation?.validationStatus ?? "No validation"} />
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">Contract Analysis</p>
                <p className="text-sm text-muted-foreground">AI-style explanation, release risk, and recommended actions.</p>
              </div>
              {selectedContractValidation && (
                <Badge variant="outline" className={selectedContractValidation.validationStatus === "Passed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : selectedContractValidation.validationStatus === "Failed" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}>
                  {selectedContractValidation.validationStatus}
                </Badge>
              )}
            </div>
            {selectedContractValidation ? (
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Score" value={`${selectedContractValidation.compatibilityScore}%`} />
                  <MiniStat label="Risk" value={selectedContractValidation.riskLevel} />
                  <MiniStat label="AI Confidence" value={`${selectedContractValidation.aiConfidence}%`} />
                </div>
                <div className="rounded-xl border bg-background p-3 text-sm">
                  <p className="font-semibold">AI Analysis</p>
                  <p className="mt-1 text-muted-foreground">{selectedContractValidation.aiAnalysis}</p>
                </div>
                <div className="space-y-2">
                  {selectedContractValidation.recommendations.map((recommendation) => (
                    <div key={recommendation} className="rounded-xl border bg-muted/30 p-3 text-sm">{recommendation}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                Run an API, then validate its contract from the endpoint row or response viewer.
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="font-semibold">Difference Viewer</p>
            <p className="text-sm text-muted-foreground">Added, removed, changed fields, status changes, and impact.</p>
            <div className="mt-4 max-h-80 space-y-2 overflow-auto">
              {selectedContractValidation?.breakingChanges.length ? selectedContractValidation.breakingChanges.map((change) => (
                <div key={`${change.changeType}-${change.fieldPath}`} className="rounded-xl border bg-background p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs font-semibold">{change.fieldPath}</p>
                    <Badge variant="outline" className={change.severity === "Critical" || change.severity === "High" ? "border-red-200 bg-red-50 text-red-700" : change.severity === "Medium" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-blue-200 bg-blue-50 text-blue-700"}>{change.severity}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{change.changeType}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{change.impact}</p>
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <pre className="max-h-28 overflow-auto rounded bg-slate-950 p-2 text-[11px] text-slate-100">{JSON.stringify(change.expectedValue, null, 2)}</pre>
                    <pre className="max-h-28 overflow-auto rounded bg-slate-950 p-2 text-[11px] text-slate-100">{JSON.stringify(change.actualValue, null, 2)}</pre>
                  </div>
                </div>
              )) : (
                <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No contract differences selected.</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">AI API Test Generation</Badge>
            <h2 className="font-display text-xl font-semibold">Generate API Tests</h2>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              Generate positive, negative, edge, contract, security, and performance tests from imported API schemas, Postman requests, requirements, or a manual endpoint.
            </p>
          </div>
          {generatedSuite && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Quality {generatedSuite.qualityScore}%</Badge>
              <Badge variant="outline">{generatedApprovedCount}/{generatedSuite.totalTests} approved</Badge>
              <Badge variant="outline">{generatedSuite.framework}</Badge>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-2xl border bg-muted/20 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Test Type</label>
                <Select value={apiGenerationType} onValueChange={(value) => setApiGenerationType(value as ApiTestGenerationType)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                    <SelectItem value="edge">Edge Cases</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Framework</label>
                <Select value={apiFramework} onValueChange={(value) => setApiFramework(value as ApiTestFramework)}>
                  <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="playwright">Playwright API</SelectItem>
                    <SelectItem value="axios">Axios</SelectItem>
                    <SelectItem value="supertest">Supertest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Number of Tests</label>
                <Input className="mt-2" value={apiTestCount} onChange={(event) => setApiTestCount(event.target.value)} />
              </div>
            </div>
            <Textarea
              value={apiRequirementText}
              onChange={(event) => setApiRequirementText(event.target.value)}
              placeholder="Optional requirement, user story, or acceptance criteria to guide API test generation."
              rows={3}
            />
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <Select value={manualApiMethod} onValueChange={setManualApiMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => <SelectItem key={method} value={method}>{method}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input value={manualApiEndpoint} onChange={(event) => setManualApiEndpoint(event.target.value)} placeholder="/api/manual-endpoint" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled={isGeneratingApiTests || !selectedWorkspace} onClick={() => void generateApiTests("collection")}>
                {isGeneratingApiTests ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Generate From Collection
              </Button>
              <Button variant="outline" disabled={isGeneratingApiTests} onClick={() => void generateApiTests("manual")}>
                <Code2 className="size-4" />
                Generate Manual Endpoint
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="font-semibold">API Quality Score</p>
            <p className="mt-1 text-sm text-muted-foreground">Generated API suites calculate schema, auth, negative, contract, security, and overall quality coverage.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Overall Quality" value={generatedSuite ? `${generatedSuite.qualityScore}%` : "No suite"} />
              <MiniStat label="Approved Tests" value={generatedSuite ? generatedApprovedCount : 0} />
              <MiniStat label="Output Framework" value={generatedSuite?.framework ?? apiFramework} />
            </div>
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              Generated code uses `BASE_URL`, `API_TOKEN`, `API_KEY`, and other environment-safe placeholders. Real secrets are never generated or hardcoded.
            </div>
          </div>
        </div>

        {generatedTests.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-2xl border">
            <div className="border-b bg-muted/40 p-4">
              <p className="font-semibold">Generated API Test Review</p>
              <p className="text-sm text-muted-foreground">Review, approve, reject, edit, or regenerate generated API tests before future runner/contract workflows.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Endpoint</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Quality</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {generatedTests.map((test) => (
                    <tr key={test.id} className="hover:bg-muted/40">
                      <td className="max-w-sm px-4 py-3 font-semibold">{test.title}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{test.testType}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs">{test.method} {test.endpoint}</td>
                      <td className="px-4 py-3">{test.priority}</td>
                      <td className="px-4 py-3">{test.qualityScores.overall}%</td>
                      <td className="px-4 py-3"><Badge variant="outline">{test.status}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedGeneratedTest(test)}><Eye className="size-4" />Review</Button>
                          <Button variant="ghost" size="sm" onClick={() => void updateGeneratedTestStatus(test.id, "approve")} disabled={test.status === "Approved"}>Approve</Button>
                          <Button variant="ghost" size="sm" onClick={() => void updateGeneratedTestStatus(test.id, "reject")} disabled={test.status === "Rejected"}>Reject</Button>
                          <Button variant="ghost" size="sm" onClick={() => void updateGeneratedTestStatus(test.id, "regenerate")}>Regenerate</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Postman Intelligence</h2>
            <p className="text-sm text-muted-foreground">Imported collections are analyzed for folders, variables, authentication, existing tests, health, and AI readiness.</p>
          </div>
          <Badge variant="outline">{postmanRequests.length} imported requests</Badge>
        </div>

        {postmanWorkspaces.length ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-3">
              {postmanWorkspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  onClick={() => void selectPostmanWorkspace(workspace.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition hover:border-primary/40 hover:bg-primary/5",
                    selectedPostman?.id === workspace.id && "border-primary/50 bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{workspace.collectionName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Postman v{workspace.collectionVersion || "2.x"} · {workspace.totalRequests} requests</p>
                    </div>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{workspace.importStatus}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Health {workspace.healthScore}%</span>
                    <span>AI Ready {workspace.aiReady}%</span>
                    <span>{workspace.totalFolders} folders</span>
                    <span>{workspace.totalVariables} variables</span>
                  </div>
                </button>
              ))}
            </div>

            {selectedPostman && (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <MiniStat label="Collection Health" value={`${selectedPostman.healthScore}%`} />
                  <MiniStat label="AI Ready" value={`${selectedPostman.aiReady}%`} />
                  <MiniStat label="Authentication" value={selectedPostman.authTypes.join(", ") || "No auth"} />
                  <MiniStat label="Last Imported" value={formatDate(selectedPostman.updatedAt)} />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Card className="p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Collection Summary</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p>CRUD APIs: <strong>{selectedPostman.summary.crudApis}</strong></p>
                      <p>Auth APIs: <strong>{selectedPostman.summary.authenticationApis}</strong></p>
                      <p>Payment APIs: <strong>{selectedPostman.summary.paymentApis}</strong></p>
                      <p>User APIs: <strong>{selectedPostman.summary.userApis}</strong></p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Current Tests</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(selectedPostman.summary.currentTests.length ? selectedPostman.summary.currentTests : ["No tests detected"]).map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Missing Tests</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedPostman.summary.missingTests.map((item) => <Badge key={item} variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">{item}</Badge>)}
                    </div>
                  </Card>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Variables {selectedPostman.variables.length}</Badge>
                    <Badge variant="outline">High Risk {postmanHighRiskCount}</Badge>
                    <Badge variant="outline">AI Ready Requests {postmanRequests.filter((request) => request.aiReadyStatus === "Ready").length}</Badge>
                  </div>
                  {canDelete && (
                    <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => void deletePostmanWorkspace(selectedPostman.id)}>
                      <Trash2 className="size-4" />
                      Delete Collection
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed p-8 text-center">
            <FileText className="mx-auto size-8 text-primary" />
            <h3 className="mt-3 font-semibold">No Postman collections imported</h3>
            <p className="mt-1 text-sm text-muted-foreground">Upload a Postman Collection JSON to migrate requests, variables, auth, and tests into AI QA Copilot.</p>
          </div>
        )}
      </Card>

      {selectedPostman && (
        <Card className="overflow-hidden">
          <div className="border-b p-5">
            <h2 className="font-display text-xl font-semibold">Postman Request Inventory</h2>
            <p className="mt-1 text-sm text-muted-foreground">Requests are preserved as imported and converted into AI-ready API assets.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Folder</th>
                  <th className="px-4 py-3">Authentication</th>
                  <th className="px-4 py-3">Existing Tests</th>
                  <th className="px-4 py-3">Variables</th>
                  <th className="px-4 py-3">AI Ready</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {postmanRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3"><Badge variant="outline" className={methodBadgeClass(request.method)}>{request.method}</Badge></td>
                    <td className="max-w-sm px-4 py-3">
                      <p className="font-semibold">{request.name}</p>
                      <p className="truncate font-mono text-xs text-muted-foreground">{request.url}</p>
                    </td>
                    <td className="px-4 py-3">{request.folderPath || "Root"}</td>
                    <td className="px-4 py-3">{request.authType}</td>
                    <td className="px-4 py-3">{request.testSummary.join(", ") || "Missing"}</td>
                    <td className="px-4 py-3">{request.variables.length ? request.variables.join(", ") : "-"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={request.aiReadyStatus === "Ready" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}>{request.aiReadyStatus}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedPostmanRequest(request)}>
                          <Eye className="size-4" />
                          View Request
                        </Button>
                        <Button variant="ghost" size="sm" disabled>Generate AI Tests</Button>
                        <Button variant="ghost" size="sm" disabled>Run API</Button>
                        <Button variant="ghost" size="sm" disabled>Variables</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!postmanRequests.length && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No Postman requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedWorkspace && (
        <>
          <Card className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">{selectedWorkspace.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedWorkspace.description || "Imported API specification ready for API Testing Intelligence."}</p>
              </div>
              {canDelete && (
                <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => void deleteWorkspace(selectedWorkspace.id)}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              )}
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MiniStat label="Server URL" value={serverUrl} />
              <MiniStat label="Authentication" value={authTypes} />
              <MiniStat label="Tags" value={selectedWorkspace.tags.length || "None"} />
              <MiniStat label="Last Imported" value={formatDate(selectedWorkspace.updatedAt)} />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b p-5">
              <h2 className="font-display text-xl font-semibold">API Inventory</h2>
              <p className="mt-1 text-sm text-muted-foreground">Normalized endpoint inventory from the imported Swagger/OpenAPI specification.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Endpoint</th>
                    <th className="px-4 py-3">Tag</th>
                    <th className="px-4 py-3">Auth</th>
                    <th className="px-4 py-3">Request Body</th>
                    <th className="px-4 py-3">Responses</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {endpoints.map((endpoint) => (
                    <tr key={endpoint.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3"><Badge variant="outline" className={methodBadgeClass(endpoint.method)}>{endpoint.method}</Badge></td>
                      <td className="max-w-sm px-4 py-3 font-mono text-xs">{endpoint.path}</td>
                      <td className="px-4 py-3">{endpoint.tags[0] || "General"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={endpoint.authRequired ? "border-blue-200 bg-blue-50 text-blue-700" : ""}>
                          <KeyRound className="mr-1 size-3" />
                          {endpoint.authType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{endpoint.requestBodySchema ? "Yes" : "No"}</td>
                      <td className="px-4 py-3">{endpoint.statusCodes.join(", ") || "-"}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={apiRiskBadgeClass(endpoint.riskLevel)}>{endpoint.riskLevel}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => void viewEndpoint(endpoint)}>
                            <Eye className="size-4" />
                            Details
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => void generateApiTests("endpoint", endpoint)} disabled={isGeneratingApiTests}>Generate Tests</Button>
                          <Button variant="ghost" size="sm" onClick={() => void runEndpoint(endpoint)} disabled={isRunningApi}>Run API</Button>
                          <Button variant="ghost" size="sm" onClick={() => void validateContract(endpoint)} disabled={isValidatingContract}>Contract</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!endpoints.length && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No endpoints found for this API workspace.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Dialog open={Boolean(selectedEndpoint)} onOpenChange={(open) => !open && setSelectedEndpoint(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>API Endpoint Details</DialogTitle>
          </DialogHeader>
          {selectedEndpoint && (
            <div className="space-y-5">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={methodBadgeClass(selectedEndpoint.method)}>{selectedEndpoint.method}</Badge>
                  <code className="rounded bg-background px-2 py-1 text-sm">{selectedEndpoint.path}</code>
                  <Badge variant="outline" className={apiRiskBadgeClass(selectedEndpoint.riskLevel)}>{selectedEndpoint.riskLevel} risk</Badge>
                </div>
                <h3 className="mt-4 font-semibold">{selectedEndpoint.summary || selectedEndpoint.operationId || "Untitled operation"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{selectedEndpoint.description || "No description provided in the imported specification."}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <MiniStat label="Tags" value={selectedEndpoint.tags.join(", ") || "General"} />
                <MiniStat label="Auth Required" value={selectedEndpoint.authRequired ? "Yes" : "No"} />
                <MiniStat label="Status Codes" value={selectedEndpoint.statusCodes.join(", ") || "-"} />
              </div>
              <Tabs defaultValue="parameters">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>
                <TabsContent value="parameters" className="mt-4"><SchemaPreview value={selectedEndpoint.parameters} /></TabsContent>
                <TabsContent value="headers" className="mt-4"><SchemaPreview value={selectedEndpoint.headers} /></TabsContent>
                <TabsContent value="request" className="mt-4"><SchemaPreview value={selectedEndpoint.requestBodySchema} /></TabsContent>
                <TabsContent value="response" className="mt-4"><SchemaPreview value={selectedEndpoint.responseSchemas} /></TabsContent>
                <TabsContent value="examples" className="mt-4"><SchemaPreview value={selectedEndpoint.examples} /></TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedPostmanRequest)} onOpenChange={(open) => !open && setSelectedPostmanRequest(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Postman Request Detail</DialogTitle>
          </DialogHeader>
          {selectedPostmanRequest && (
            <div className="space-y-5">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={methodBadgeClass(selectedPostmanRequest.method)}>{selectedPostmanRequest.method}</Badge>
                  <Badge variant="outline" className={apiRiskBadgeClass(selectedPostmanRequest.riskLevel)}>{selectedPostmanRequest.riskLevel} risk</Badge>
                  <Badge variant="outline">{selectedPostmanRequest.aiReadyStatus}</Badge>
                </div>
                <h3 className="mt-4 font-semibold">{selectedPostmanRequest.name}</h3>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{selectedPostmanRequest.url}</p>
                {selectedPostmanRequest.description && <p className="mt-3 text-sm text-muted-foreground">{selectedPostmanRequest.description}</p>}
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <MiniStat label="Folder" value={selectedPostmanRequest.folderPath || "Root"} />
                <MiniStat label="Authentication" value={selectedPostmanRequest.authType} />
                <MiniStat label="Variables Used" value={selectedPostmanRequest.variables.length || "None"} />
                <MiniStat label="Existing Tests" value={selectedPostmanRequest.testSummary.length || "Missing"} />
              </div>

              <Tabs defaultValue="headers">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="query">Query</TabsTrigger>
                  <TabsTrigger value="path">Path</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>
                <TabsContent value="headers" className="mt-4"><SchemaPreview value={selectedPostmanRequest.headers} /></TabsContent>
                <TabsContent value="query" className="mt-4"><SchemaPreview value={selectedPostmanRequest.queryParams} /></TabsContent>
                <TabsContent value="path" className="mt-4"><SchemaPreview value={selectedPostmanRequest.pathParams} /></TabsContent>
                <TabsContent value="body" className="mt-4"><SchemaPreview value={selectedPostmanRequest.requestBody} /></TabsContent>
                <TabsContent value="tests" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(selectedPostmanRequest.testSummary.length ? selectedPostmanRequest.testSummary : ["No test scripts detected"]).map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
                    </div>
                    <SchemaPreview value={selectedPostmanRequest.testScripts} />
                  </div>
                </TabsContent>
                <TabsContent value="examples" className="mt-4"><SchemaPreview value={selectedPostmanRequest.responseExamples} /></TabsContent>
              </Tabs>

              {selectedPostman?.variables?.length ? (
                <div className="rounded-2xl border p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Resolved Variables</p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {selectedPostman.variables.slice(0, 12).map((variable) => (
                      <div key={`${variable.source}-${variable.name}`} className="rounded-xl border bg-muted/30 p-3">
                        <p className="font-mono text-xs font-semibold">{variable.name}</p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">{variable.source} · {variable.resolvedValue || "No value"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedGeneratedTest)} onOpenChange={(open) => !open && setSelectedGeneratedTest(null)}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated API Test Review</DialogTitle>
          </DialogHeader>
          {selectedGeneratedTest && (
            <div className="space-y-5">
              <div className="rounded-2xl border bg-muted/40 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={methodBadgeClass(selectedGeneratedTest.method)}>{selectedGeneratedTest.method}</Badge>
                  <Badge variant="outline">{selectedGeneratedTest.testType}</Badge>
                  <Badge variant="outline" className={apiRiskBadgeClass(selectedGeneratedTest.riskLevel)}>{selectedGeneratedTest.riskLevel} risk</Badge>
                  <Badge variant="outline">{selectedGeneratedTest.status}</Badge>
                </div>
                <h3 className="mt-4 font-semibold">{selectedGeneratedTest.title}</h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{selectedGeneratedTest.endpoint}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <MiniStat label="Expected Status" value={selectedGeneratedTest.expectedStatus} />
                <MiniStat label="AI Confidence" value={`${selectedGeneratedTest.aiConfidence}%`} />
                <MiniStat label="Overall Quality" value={`${selectedGeneratedTest.qualityScores.overall}%`} />
                <MiniStat label="Framework" value={selectedGeneratedTest.framework} />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <MiniStat label="Schema Coverage" value={`${selectedGeneratedTest.qualityScores.schemaCoverage}%`} />
                <MiniStat label="Auth Coverage" value={`${selectedGeneratedTest.qualityScores.authCoverage}%`} />
                <MiniStat label="Security Coverage" value={`${selectedGeneratedTest.qualityScores.securityCoverage}%`} />
              </div>

              <Tabs defaultValue="case">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="case">Test Case</TabsTrigger>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Expected</TabsTrigger>
                  <TabsTrigger value="assertions">Assertions</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                <TabsContent value="case" className="mt-4">
                  <div className="rounded-2xl border p-4 text-sm">
                    <p><strong>Preconditions:</strong> Configure environment variables and valid auth profile before execution.</p>
                    <p className="mt-2"><strong>Priority:</strong> {selectedGeneratedTest.priority}</p>
                    <p className="mt-2"><strong>Risk:</strong> {selectedGeneratedTest.riskLevel}</p>
                    <p className="mt-2"><strong>Safety:</strong> Destructive methods must use seeded or disposable test data.</p>
                  </div>
                </TabsContent>
                <TabsContent value="request" className="mt-4">
                  <SchemaPreview value={{
                    headers: selectedGeneratedTest.headers,
                    queryParams: selectedGeneratedTest.queryParams,
                    pathParams: selectedGeneratedTest.pathParams,
                    body: selectedGeneratedTest.requestBody,
                  }} />
                </TabsContent>
                <TabsContent value="response" className="mt-4">
                  <SchemaPreview value={selectedGeneratedTest.expectedResponse} />
                </TabsContent>
                <TabsContent value="assertions" className="mt-4">
                  <div className="space-y-2">
                    {selectedGeneratedTest.assertions.map((assertion) => (
                      <div key={assertion} className="rounded-xl border bg-muted/30 p-3 text-sm">{assertion}</div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="code" className="mt-4">
                  <pre className="max-h-96 overflow-auto rounded-lg border bg-slate-950 p-4 text-xs text-slate-100">{selectedGeneratedTest.executableCode}</pre>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => void navigator.clipboard.writeText(selectedGeneratedTest.executableCode).then(() => toast.success("Executable code copied"))}>
                  <Copy className="size-4" />
                  Copy Code
                </Button>
                <Button variant="outline" onClick={() => void updateGeneratedTestStatus(selectedGeneratedTest.id, "regenerate")}>Regenerate</Button>
                <Button variant="outline" onClick={() => void updateGeneratedTestStatus(selectedGeneratedTest.id, "reject")}>Reject</Button>
                <Button onClick={() => void updateGeneratedTestStatus(selectedGeneratedTest.id, "approve")}>Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function RepositoryIntelligencePage({
  activeView,
  workspaceId,
  role,
  config,
  analysis,
  syncs,
  applicationRepositories,
  repositoryActivities,
  isLoading,
  onRefresh,
}: {
  activeView: "repository-application" | "repository-automation" | "repository-activity" | "repository-impact" | "repository-playwright" | "repository-validation-history" | "repository-release-readiness";
  workspaceId: string;
  role: WorkspaceRole;
  config: GitHubAutomationConfig | null;
  analysis: RepositoryAnalysis | null;
  syncs: RepositorySync[];
  applicationRepositories: ApplicationRepositoryConfig[];
  repositoryActivities: RepositoryActivity[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const meta = repositoryIntelligenceMeta[activeView];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <GitBranch className="mr-1 size-3.5" />
            Repository Intelligence
          </Badge>
          <h1 className="font-display text-3xl font-bold">{meta.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{meta.description}</p>
        </div>
      </div>
      {activeView === "repository-validation-history" ? (
        <ValidationHistoryPage workspaceId={workspaceId} />
      ) : activeView === "repository-release-readiness" ? (
        <ReleaseReadinessPage workspaceId={workspaceId} />
      ) : (
        <AutomationRepositorySettings
          workspaceId={workspaceId}
          role={role}
          config={config}
          analysis={analysis}
          syncs={syncs}
          applicationRepositories={applicationRepositories}
          repositoryActivities={repositoryActivities}
          isLoading={isLoading}
          initialTab={meta.tab}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

function ValidationHistoryPage({ workspaceId }: { workspaceId: string }) {
  const [records, setRecords] = useState<ValidationHistoryRecord[]>([]);
  const [statistics, setStatistics] = useState<ValidationHistoryStatistics | null>(null);
  const [selectedRun, setSelectedRun] = useState<ValidationHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [isRootCauseLoading, setIsRootCauseLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;
    setIsLoading(true);
    const filters = {
      workspaceId,
      search: search || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      validationMode: modeFilter === "all" ? undefined : modeFilter,
      branch: branchFilter || undefined,
    };
    Promise.all([
      projectApi.listValidationHistoryRecords(filters),
      projectApi.getValidationHistoryStatistics(filters),
    ])
      .then(([history, stats]) => {
        setRecords(history);
        setStatistics(stats);
      })
      .catch(() => {
        setRecords([]);
        setStatistics(null);
      })
      .finally(() => setIsLoading(false));
  }, [workspaceId, search, statusFilter, modeFilter, branchFilter]);

  const openDetail = async (runId: string) => {
    try {
      setSelectedRun(await projectApi.getValidationHistoryRecordDetail(runId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load validation detail");
    }
  };

  const runRootCauseAnalysis = async (regenerate = false) => {
    if (!selectedRun) return;
    try {
      setIsRootCauseLoading(true);
      const rootCause = regenerate
        ? await projectApi.regenerateRootCauseAnalysis(selectedRun.validationRun.id)
        : await projectApi.generateRootCauseAnalysis(selectedRun.validationRun.id);
      setSelectedRun({ ...selectedRun, rootCauseAnalysis: rootCause });
      toast.success(regenerate ? "Root cause analysis regenerated" : "Root cause analysis generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate root cause analysis");
    } finally {
      setIsRootCauseLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <MiniStat label="Total Validations" value={statistics?.totalValidations ?? records.length} />
        <MiniStat label="Success Rate" value={`${statistics?.validationSuccessRate ?? 0}%`} />
        <MiniStat label="Passed After Retry" value={statistics?.passedAfterRetry ?? 0} />
        <MiniStat label="Average Duration" value={formatValidationDuration(statistics?.averageDuration ?? 0)} />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <MiniStat label="Most Active Repo" value={statistics?.mostActiveRepository ?? "-"} />
        <MiniStat label="Most Active User" value={statistics?.mostActiveUser ?? "-"} />
        <MiniStat label="Retry Success Rate" value={`${statistics?.retrySuccessRate ?? 0}%`} />
        <MiniStat label="Failed" value={statistics?.failed ?? 0} />
      </div>
      <Card className="app-card overflow-hidden p-0">
        <div className="border-b border-border/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Validation History</h2>
              <p className="mt-1 text-sm text-muted-foreground">Central audit log for workflow executions, reports, retries, recommendations, and branch evidence.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setModeFilter("all");
              setBranchFilter("");
            }}>Reset Filters</Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Input placeholder="Search validation, commit, workflow..." value={search} onChange={(event) => setSearch(event.target.value)} />
            <Input placeholder="Branch" value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Passed">Passed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modes</SelectItem>
                <SelectItem value="quick">Quick Validation</SelectItem>
                <SelectItem value="impact">Impact Validation</SelectItem>
                <SelectItem value="full">Full Validation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="m-5 h-48" />
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No validation runs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Repository</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Trigger</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Browser</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Passed</th>
                  <th className="px-4 py-3">Failed</th>
                  <th className="px-4 py-3">Retry</th>
                  <th className="px-4 py-3">AI Recommendation</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(record.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.repositoryName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.projectName}</td>
                    <td className="px-4 py-3 max-w-52 truncate font-mono text-xs">{record.branch}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{record.triggerSource}</Badge></td>
                    <td className="px-4 py-3 capitalize">{record.validationMode}</td>
                    <td className="px-4 py-3">{record.browser}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={record.status.includes("Passed") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : record.status.includes("Failed") || record.status === "Error" ? "border-red-200 bg-red-50 text-red-700" : record.status === "Running" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-orange-200 bg-orange-50 text-orange-700"}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{record.passedTests}</td>
                    <td className="px-4 py-3">{record.failedTests}</td>
                    <td className="px-4 py-3">{record.retryCount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{record.aiRecommendation ?? "-"}</td>
                    <td className="px-4 py-3">{formatValidationDuration(record.totalDuration)}</td>
                    <td className="px-4 py-3">
                      {record.workflowUrl ? <a className="font-semibold text-primary underline" href={record.workflowUrl} target="_blank" rel="noreferrer">Open</a> : "-"}
                    </td>
                    <td className="px-4 py-3"><Button variant="outline" size="sm" onClick={() => openDetail(record.validationRunId)}>View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Dialog open={Boolean(selectedRun)} onOpenChange={(open) => !open && setSelectedRun(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Validation Detail</DialogTitle></DialogHeader>
          {selectedRun && (
            <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-2">
              <div className="grid gap-3 md:grid-cols-4">
                <MiniStat label="Status" value={selectedRun.history.status} />
                <MiniStat label="Passed" value={selectedRun.history.passedTests} />
                <MiniStat label="Failed" value={selectedRun.history.failedTests} />
                <MiniStat label="Retries" value={selectedRun.history.retryCount} />
              </div>
              <Tabs defaultValue="overview">
                <TabsList className="flex h-auto flex-wrap justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="failed">Failed Tests</TabsTrigger>
                  <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                  <TabsTrigger value="root">Root Cause</TabsTrigger>
                  <TabsTrigger value="fixes">AI Auto Fix</TabsTrigger>
                  <TabsTrigger value="retries">Retry History</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="logs">Logs</TabsTrigger>
                  <TabsTrigger value="github">GitHub Workflow</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <Card className="app-card p-4">
                    <div className="grid gap-3 md:grid-cols-3">
                      <MiniStat label="Validation ID" value={selectedRun.history.validationRunId} />
                      <MiniStat label="Repository" value={selectedRun.history.repositoryName} />
                      <MiniStat label="Project" value={selectedRun.history.projectName} />
                      <MiniStat label="Branch" value={selectedRun.history.branch} />
                      <MiniStat label="Commit" value={selectedRun.history.commitSha?.slice(0, 8) ?? "-"} />
                      <MiniStat label="Trigger Source" value={selectedRun.history.triggerSource} />
                      <MiniStat label="Mode" value={selectedRun.history.validationMode ?? "-"} />
                      <MiniStat label="Browser" value={selectedRun.history.browser ?? "-"} />
                      <MiniStat label="AI Recommendation" value={selectedRun.history.aiRecommendation ?? "-"} />
                    </div>
                  </Card>
                  <Card className="app-card p-4">
                    <h3 className="font-semibold">Duration Breakdown</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-5">
                      <MiniStat label="Setup" value={formatValidationDuration(selectedRun.history.setupTime)} />
                      <MiniStat label="Execution" value={formatValidationDuration(selectedRun.history.executionTime)} />
                      <MiniStat label="Artifacts" value={formatValidationDuration(selectedRun.history.artifactUploadTime)} />
                      <MiniStat label="AI Analysis" value={formatValidationDuration(selectedRun.history.aiAnalysisTime)} />
                      <MiniStat label="Total" value={formatValidationDuration(selectedRun.history.totalDuration)} />
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="timeline" className="space-y-3">
                  {selectedRun.timeline.map((step) => (
                    <div key={`${step.name}-${step.timestamp}`} className="rounded-lg border border-border/40 bg-card/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{step.name}</p>
                        <Badge variant="outline">{step.status}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(step.timestamp)} · {formatValidationDuration(step.duration)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{step.details}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="failed" className="space-y-3">
                  {(selectedRun.validationRun.failedTests ?? []).length === 0 ? <p className="text-sm text-muted-foreground">No failed tests were captured.</p> : selectedRun.validationRun.failedTests?.map((test) => (
                    <Card key={`${test.testFile}-${test.testName}`} className="app-card p-4">
                      <p className="font-mono text-sm font-semibold">{test.testFile}</p>
                      <p className="mt-1 text-sm">{test.testName}</p>
                      <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{test.errorMessage}</p>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="ai" className="space-y-4">
                  {selectedRun.failureAnalysis ? (
                    <Card className="app-card p-4">
                      <h3 className="font-semibold">AI Failure Analysis</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedRun.failureAnalysis.summary ?? selectedRun.failureAnalysis.rootCause}</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-4">
                        <MiniStat label="Failure Type" value={selectedRun.failureAnalysis.failureType ?? selectedRun.failureAnalysis.category} />
                        <MiniStat label="Risk" value={selectedRun.failureAnalysis.riskLevel} />
                        <MiniStat label="Confidence" value={`${selectedRun.failureAnalysis.confidenceScore}%`} />
                        <MiniStat label="Auto Fix" value={selectedRun.failureAnalysis.autoFixAvailable ? "Available" : "No"} />
                      </div>
                    </Card>
                  ) : <p className="text-sm text-muted-foreground">No AI failure analysis available.</p>}
                  {selectedRun.recommendation && (
                    <Card className="app-card p-4">
                      <h3 className="font-semibold">AI Recommendation</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedRun.recommendation.summary}</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <MiniStat label="Release" value={selectedRun.recommendation.releaseRecommendation} />
                        <MiniStat label="Decision" value={selectedRun.recommendation.mergeDecision} />
                        <MiniStat label="Confidence" value={`${selectedRun.recommendation.confidenceScore}%`} />
                      </div>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="root" className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Root Cause Analysis</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Correlates code changes, failed tests, logs, impact analysis, and history to explain why validation failed.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => runRootCauseAnalysis(false)} disabled={isRootCauseLoading}>
                        {isRootCauseLoading ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
                        Generate Root Cause Analysis
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => runRootCauseAnalysis(true)} disabled={isRootCauseLoading || !selectedRun.rootCauseAnalysis}>
                        <RefreshCw className="size-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  {selectedRun.rootCauseAnalysis ? (
                    <Card className="app-card p-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{selectedRun.rootCauseAnalysis.category}</Badge>
                        <Badge variant="outline">{selectedRun.rootCauseAnalysis.riskLevel} Risk</Badge>
                        <Badge variant="outline">{selectedRun.rootCauseAnalysis.confidenceScore}% Confidence</Badge>
                        <Badge variant="outline">Auto Fix: {selectedRun.rootCauseAnalysis.autoFixPossible ? "Possible" : "No"}</Badge>
                      </div>
                      <p className="mt-4 text-sm font-semibold">Root Cause</p>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedRun.rootCauseAnalysis.rootCause}</p>
                      <p className="mt-4 text-sm font-semibold">Failure Reason</p>
                      <p className="mt-2 text-sm text-muted-foreground">{selectedRun.rootCauseAnalysis.failureReason}</p>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-border/40 p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Application Files</p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {selectedRun.rootCauseAnalysis.affectedApplicationFiles.map((file) => <li key={file} className="font-mono text-xs">{file}</li>)}
                          </ul>
                        </div>
                        <div className="rounded-lg border border-border/40 p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">Test Files</p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {selectedRun.rootCauseAnalysis.affectedTestFiles.map((file) => <li key={file} className="font-mono text-xs">{file}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <p className="text-sm font-semibold">Recommended Fix</p>
                        <p className="mt-2 text-sm text-muted-foreground">{selectedRun.rootCauseAnalysis.recommendedFix}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold">Evidence</p>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                          {selectedRun.rootCauseAnalysis.evidence.map((item) => <li key={item}>- {item}</li>)}
                        </ul>
                      </div>
                      {selectedRun.rootCauseAnalysis.relatedPreviousFailures.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold">Related Previous Failures</p>
                          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                            {selectedRun.rootCauseAnalysis.relatedPreviousFailures.map((item) => <li key={item}>- {item}</li>)}
                          </ul>
                        </div>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          void navigator.clipboard.writeText([
                            selectedRun.rootCauseAnalysis?.rootCause,
                            selectedRun.rootCauseAnalysis?.failureReason,
                            selectedRun.rootCauseAnalysis?.recommendedFix,
                          ].filter(Boolean).join("\n\n"));
                          toast.success("Root cause summary copied");
                        }}>
                          <Copy className="size-4" />
                          Copy Summary
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toast.info("Generate AI Auto Fix from Root Cause is available in the validation panel.")}>Generate AI Auto Fix</Button>
                        <Button variant="outline" size="sm" onClick={() => toast.info("Use Auto Retry Validation from the validation panel to retry failed tests.")}>Retry Validation</Button>
                      </div>
                    </Card>
                  ) : (
                    <Card className="border-dashed border-border/50 bg-card/40 p-8 text-center text-sm text-muted-foreground">
                      No root cause analysis yet. Generate it after a failed validation to identify why tests failed.
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="fixes" className="space-y-3">
                  {selectedRun.autoFixes.length === 0 ? <p className="text-sm text-muted-foreground">No AI auto fixes generated.</p> : selectedRun.autoFixes.map((fix) => (
                    <Card key={fix.id} className="app-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-sm font-semibold">{fix.filePath ?? fix.testFilePath}</p>
                        <Badge variant="outline">{fix.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{fix.fixSummary}</p>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="retries" className="space-y-3">
                  {selectedRun.retries.length === 0 ? <p className="text-sm text-muted-foreground">No retry attempts recorded.</p> : selectedRun.retries.map((retry) => (
                    <Card key={retry.id} className="app-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">Attempt {retry.attemptNumber}</p>
                        <Badge variant="outline">{retry.flakyDetected ? "Potentially Flaky" : retry.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{retry.triggerReason}</p>
                      <p className="mt-2 text-xs text-muted-foreground">Passed {retry.passed} · Failed {retry.failed} · Skipped {retry.skipped} · {formatValidationDuration(retry.duration)}</p>
                      {retry.workflowUrl && <a className="mt-2 inline-block text-xs font-semibold text-primary underline" href={retry.workflowUrl} target="_blank" rel="noreferrer">Open workflow</a>}
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="reports" className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedRun.reports.html ? <a className="rounded-lg border border-border/40 p-4 font-semibold text-primary underline" href={selectedRun.reports.html} target="_blank" rel="noreferrer">Open HTML Report</a> : <div className="rounded-lg border border-dashed border-border/50 p-4 text-sm text-muted-foreground">HTML report unavailable.</div>}
                    {selectedRun.reports.json ? <div className="rounded-lg border border-border/40 p-4 font-mono text-xs">{selectedRun.reports.json}</div> : <div className="rounded-lg border border-dashed border-border/50 p-4 text-sm text-muted-foreground">JSON report unavailable.</div>}
                  </div>
                </TabsContent>
                <TabsContent value="logs" className="space-y-3">
                  <Input placeholder="Search logs" value={logSearch} onChange={(event) => setLogSearch(event.target.value)} />
                  <pre className="max-h-80 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
                    {([selectedRun.logs.logs, selectedRun.logs.stdout, selectedRun.logs.stderr].filter(Boolean).join("\n\n") || "No logs available.")
                      .split("\n")
                      .filter((line) => !logSearch || line.toLowerCase().includes(logSearch.toLowerCase()))
                      .join("\n")}
                  </pre>
                  <Button variant="outline" size="sm" onClick={() => {
                    void navigator.clipboard.writeText([selectedRun.logs.logs, selectedRun.logs.stdout, selectedRun.logs.stderr].filter(Boolean).join("\n\n"));
                    toast.success("Logs copied");
                  }}>Copy Logs</Button>
                </TabsContent>
                <TabsContent value="github" className="space-y-3">
                  <Card className="app-card p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <MiniStat label="Workflow Run ID" value={selectedRun.history.workflowRunId ?? "-"} />
                      <MiniStat label="Commit SHA" value={selectedRun.history.commitSha ?? "-"} />
                      <MiniStat label="Source Branch" value={selectedRun.history.sourceBranch} />
                      <MiniStat label="Target Branch" value={selectedRun.history.targetBranch} />
                    </div>
                    {selectedRun.history.workflowUrl && <a className="mt-4 inline-block text-sm font-semibold text-primary underline" href={selectedRun.history.workflowUrl} target="_blank" rel="noreferrer">Open GitHub Workflow</a>}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReleaseReadinessPage({ workspaceId }: { workspaceId: string }) {
  const [snapshot, setSnapshot] = useState<ReleaseReadinessSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;
    setIsLoading(true);
    projectApi
      .getReleaseReadinessSummary(workspaceId)
      .then(setSnapshot)
      .catch(() => setSnapshot(null))
      .finally(() => setIsLoading(false));
  }, [workspaceId]);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!snapshot) {
    return <Card className="border-dashed border-border/50 bg-card/40 p-10 text-center text-sm text-muted-foreground">No release readiness data yet.</Card>;
  }

  const tone = snapshot.readinessScore >= 90
    ? "border-success/30 bg-success/10 text-success"
    : snapshot.readinessScore >= 70
      ? "border-warning/30 bg-warning/10 text-warning"
      : "border-destructive/30 bg-destructive/10 text-destructive";
  const releaseStatus = snapshot.releaseStatus ?? (snapshot.readinessScore >= 90 ? "READY" : snapshot.readinessScore >= 70 ? "READY WITH CAUTION" : "NOT READY");
  const score = snapshot.releaseScore ?? snapshot.readinessScore;

  return (
    <div className="space-y-5">
      <Card className={cn("app-card p-6", tone)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Release Status</p>
            <h2 className="mt-2 font-display text-5xl font-bold">{releaseStatus}</h2>
            <p className="mt-2 text-sm">{snapshot.finalRecommendation ?? snapshot.recommendation}</p>
          </div>
          <div className="w-full max-w-md">
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span>Release Score</span>
              <span>{score}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-4">
        <MiniStat label="Release Score" value={`${score}%`} />
        <MiniStat label="AI Confidence" value={`${snapshot.aiConfidence ?? 0}%`} />
        <MiniStat label="Risk Level" value={snapshot.riskLevel ?? "MEDIUM"} />
        <MiniStat label="Validation Success" value={`${snapshot.validationSuccessRate ?? snapshot.automationPassRate}%`} />
        <MiniStat label="Failed Tests" value={snapshot.failedTestsCount ?? snapshot.failedValidations} />
        <MiniStat label="Flaky Tests" value={snapshot.flakyTestsCount ?? 0} />
        <MiniStat label="Coverage Score" value={`${snapshot.coverageScore}%`} />
        <MiniStat label="Repository Health" value={`${snapshot.repositoryHealthScore ?? 0}%`} />
        <MiniStat label="Critical Issues" value={snapshot.criticalIssuesCount ?? snapshot.openHighRiskChanges} />
        <MiniStat label="Blockers" value={snapshot.blockerIssuesCount ?? 0} />
        <MiniStat label="Pending AI Fixes" value={snapshot.pendingFixes} />
        <MiniStat label="Final Recommendation" value={snapshot.finalRecommendation ?? snapshot.recommendation} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="app-card p-5">
          <h3 className="font-semibold">Critical Issues</h3>
          <div className="mt-4 space-y-3">
            {(snapshot.reasons?.length ? snapshot.reasons : ["No critical issues detected in the latest snapshot."]).map((reason) => (
              <div key={reason} className="rounded-lg border border-border/40 bg-card/70 p-3 text-sm text-muted-foreground">{reason}</div>
            ))}
          </div>
        </Card>
        <Card className="app-card p-5">
          <h3 className="font-semibold">AI Recommendation</h3>
          <p className="mt-3 text-sm text-muted-foreground">{snapshot.finalRecommendation ?? snapshot.recommendation}</p>
          <div className="mt-4 space-y-2">
            {(snapshot.recommendedActions ?? []).map((action) => (
              <p key={action} className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">{action}</p>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="app-card p-5">
          <h3 className="font-semibold">Root Cause Insights</h3>
          <div className="mt-4 space-y-3">
            {(snapshot.rootCauseInsights?.length ? snapshot.rootCauseInsights : ["No root cause insights available yet."]).map((insight) => (
              <div key={insight} className="rounded-lg border border-border/40 bg-card/70 p-3 text-sm text-muted-foreground">{insight}</div>
            ))}
          </div>
        </Card>
        <Card className="app-card p-5">
          <h3 className="font-semibold">Release Timeline</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Repository changes detected</p>
            <p>Impact analysis completed</p>
            <p>Validation completed</p>
            <p>Failure/root cause analysis generated when required</p>
            <p>Final release recommendation generated</p>
          </div>
        </Card>
      </div>
      <Card className="app-card p-5">
        <h3 className="font-semibold">Risk Distribution</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {Object.entries(snapshot.riskSummary).map(([key, value]) => (
            <MiniStat key={key} label={key.replace(/([A-Z])/g, " $1")} value={value} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function AutomationRepositorySettings({
  workspaceId,
  role,
  config,
  analysis,
  syncs,
  applicationRepositories,
  repositoryActivities,
  isLoading,
  initialTab = "automation",
  onRefresh,
}: {
  workspaceId: string;
  role: WorkspaceRole;
  config: GitHubAutomationConfig | null;
  analysis: RepositoryAnalysis | null;
  syncs: RepositorySync[];
  applicationRepositories: ApplicationRepositoryConfig[];
  repositoryActivities: RepositoryActivity[];
  isLoading: boolean;
  initialTab?: RepositoryIntelligenceTab;
  onRefresh: () => void;
}) {
  const canManage = role === "Owner" || role === "Admin";
  const [form, setForm] = useState({
    token: "",
    owner: config?.owner ?? "",
    repo: config?.repo ?? "",
    defaultBranch: config?.defaultBranch ?? "main",
    testFolderPath: config?.testFolderPath ?? "tests/e2e",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInitializingOnboarding, setIsInitializingOnboarding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSyncId, setActiveSyncId] = useState("");
  const [isGeneratingSyncSuggestions, setIsGeneratingSyncSuggestions] = useState(false);
  const [isGeneratingSyncUpdates, setIsGeneratingSyncUpdates] = useState(false);
  const [isCreatingSyncPr, setIsCreatingSyncPr] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<RepositoryIntelligenceTab>(initialTab);
  const [learningProfile, setLearningProfile] = useState<RepositoryLearningProfile | null>(null);
  const [isLearningLoading, setIsLearningLoading] = useState(false);
  const [isLearningRefreshing, setIsLearningRefreshing] = useState(false);
  const [isLearningResetting, setIsLearningResetting] = useState(false);
  const [overrideForm, setOverrideForm] = useState({
    language: analysis?.language ?? "TypeScript",
    framework: analysis?.framework ?? "Playwright Test Runner",
    buildTool: analysis?.buildTool ?? "npm",
    testFolderPath: analysis?.testFolderPath ?? config?.testFolderPath ?? "tests/e2e",
    pageObjectFolderPath: analysis?.pageObjectFolderPath ?? "",
    pattern: analysis?.pattern ?? "Direct Playwright",
    namingConvention: analysis?.namingConvention ?? "*.spec.ts",
    importStyle: analysis?.importStyle ?? "@playwright/test",
    usesPageObjectModel: analysis?.usesPageObjectModel ?? false,
    usesFixtures: analysis?.usesFixtures ?? false,
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setForm((current) => ({
      token: "",
      owner: config?.owner ?? current.owner,
      repo: config?.repo ?? current.repo,
      defaultBranch: config?.defaultBranch ?? (current.defaultBranch || "main"),
      testFolderPath: config?.testFolderPath ?? (current.testFolderPath || "tests/e2e"),
    }));
  }, [config]);

  useEffect(() => {
    if (!config?.id) {
      setLearningProfile(null);
      return;
    }
    setIsLearningLoading(true);
    projectApi
      .getRepositoryLearning(config.id)
      .then(setLearningProfile)
      .catch(() => setLearningProfile(null))
      .finally(() => setIsLearningLoading(false));
  }, [config?.id]);

  useEffect(() => {
    setOverrideForm({
      language: analysis?.language ?? "TypeScript",
      framework: analysis?.framework ?? "Playwright Test Runner",
      buildTool: analysis?.buildTool ?? "npm",
      testFolderPath: analysis?.testFolderPath ?? config?.testFolderPath ?? "tests/e2e",
      pageObjectFolderPath: analysis?.pageObjectFolderPath ?? "",
      pattern: analysis?.pattern ?? "Direct Playwright",
      namingConvention: analysis?.namingConvention ?? "*.spec.ts",
      importStyle: analysis?.importStyle ?? "@playwright/test",
      usesPageObjectModel: analysis?.usesPageObjectModel ?? false,
      usesFixtures: analysis?.usesFixtures ?? false,
    });
  }, [analysis, config]);

  const saveConfig = async () => {
    if (!workspaceId) {
      toast.error("Select a workspace first.");
      return;
    }
    if (!canManage) {
      toast.error("You do not have permission to configure integrations.");
      return;
    }
    try {
      setIsSaving(true);
      await projectApi.connectGitHubAutomation({
        workspaceId,
        token: form.token,
        owner: form.owner,
        repo: form.repo,
        defaultBranch: form.defaultBranch || "main",
        testFolderPath: form.testFolderPath || "tests/e2e",
      });
      setForm((current) => ({ ...current, token: "" }));
      toast.success("GitHub automation repository connected");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect GitHub repository");
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async () => {
    if (!workspaceId) return;
    try {
      setIsTesting(true);
      const result = await projectApi.testGitHubAutomationConnection(workspaceId);
      toast.success(`Connected to ${result.repository}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "GitHub connection failed");
    } finally {
      setIsTesting(false);
    }
  };

  const analyzeRepository = async () => {
    if (!workspaceId) return;
    try {
      setIsAnalyzing(true);
      const nextAnalysis = await projectApi.analyzeGitHubRepository(workspaceId);
      toast.success(`Repository analyzed with ${nextAnalysis.confidenceScore}% confidence`);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Repository analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const initializeAutomationRepositoryOnboarding = async () => {
    if (!workspaceId) return;
    try {
      setIsInitializingOnboarding(true);
      const result = await projectApi.initializeAutomationRepositoryOnboarding(workspaceId);
      if (result.pullRequest) {
        toast.success(
          <span>
            Automation Repository Onboarding PR created:{" "}
            <a className="font-semibold underline" href={result.pullRequest.html_url} target="_blank" rel="noreferrer">
              View PR
            </a>
          </span>,
        );
      } else {
        toast.success(result.message);
      }
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Automation Repository Onboarding failed");
    } finally {
      setIsInitializingOnboarding(false);
    }
  };

  const saveOverride = async () => {
    try {
      await projectApi.overrideGitHubRepositoryAnalysis({
        workspaceId,
        ...overrideForm,
      });
      toast.success("Repository analysis override saved");
      setIsOverrideOpen(false);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save repository analysis override");
    }
  };
  const activeSync = syncs.find((sync) => sync.id === activeSyncId) ?? syncs[0] ?? null;

  const syncRepository = async () => {
    if (!workspaceId) return;
    if (!analysis) {
      toast.error("Run Automation Repository Onboarding analysis before syncing repository changes.");
      return;
    }
    try {
      setIsSyncing(true);
      const sync = await projectApi.syncGitHubRepository(workspaceId);
      setActiveSyncId(sync.id);
      toast.success(`Repository sync completed: ${sync.changedFiles.length} changed file(s)`);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Repository sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const generateSyncSuggestions = async () => {
    if (!activeSync) return;
    try {
      setIsGeneratingSyncSuggestions(true);
      await projectApi.generateGitHubRepositorySyncSuggestions(activeSync.id);
      toast.success("AI repository sync suggestions generated");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate sync suggestions");
    } finally {
      setIsGeneratingSyncSuggestions(false);
    }
  };

  const generateSyncUpdates = async () => {
    if (!activeSync) return;
    try {
      setIsGeneratingSyncUpdates(true);
      await projectApi.generateGitHubRepositorySyncUpdates(activeSync.id);
      toast.success("Playwright update preview generated");
      setIsPreviewOpen(true);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate Playwright updates");
    } finally {
      setIsGeneratingSyncUpdates(false);
    }
  };

  const createSyncPr = async () => {
    if (!activeSync) return;
    try {
      setIsCreatingSyncPr(true);
      const updated = activeSync.prPreview
        ? await projectApi.createGitHubRepositorySyncUpdatePr(activeSync.id)
        : await projectApi.createGitHubRepositorySyncPr(activeSync.id);
      toast.success(
        <span>
          Repository Sync PR created:{" "}
          <a className="font-semibold underline" href={updated.pullRequest?.pullRequestUrl || updated.prUrl} target="_blank" rel="noreferrer">
            View PR
          </a>
        </span>,
      );
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create repository sync PR");
    } finally {
      setIsCreatingSyncPr(false);
    }
  };

  const refreshRepositoryLearning = async () => {
    if (!config?.id) {
      toast.error("Connect an automation repository before refreshing learning.");
      return;
    }
    try {
      setIsLearningRefreshing(true);
      const profile = await projectApi.refreshRepositoryLearning(config.id);
      setLearningProfile(profile);
      toast.success("Repository learning refreshed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to refresh repository learning");
    } finally {
      setIsLearningRefreshing(false);
    }
  };

  const resetRepositoryLearning = async () => {
    if (!config?.id) return;
    if (!canManage) {
      toast.error("Only Owner/Admin can reset repository learning.");
      return;
    }
    try {
      setIsLearningResetting(true);
      await projectApi.resetRepositoryLearning(config.id);
      setLearningProfile(null);
      toast.success("Repository learning memory reset");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset repository learning");
    } finally {
      setIsLearningResetting(false);
    }
  };

  const riskClass = (risk: string) =>
    risk === "High"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : risk === "Medium"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-success/40 bg-success/10 text-success";
  const learningValidationTotal = (learningProfile?.validationPassCount ?? 0) + (learningProfile?.validationFailCount ?? 0);
  const learningValidationRate = learningValidationTotal
    ? Math.round(((learningProfile?.validationPassCount ?? 0) / learningValidationTotal) * 100)
    : 0;
  const topLocatorPreference = learningProfile?.locatorPreferences?.[0];

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RepositoryIntelligenceTab)} className="space-y-5">
      <TabsList className="h-auto flex-wrap justify-start">
        <TabsTrigger value="automation">Automation Repository</TabsTrigger>
        <TabsTrigger value="application">Application Repositories</TabsTrigger>
        <TabsTrigger value="activity">Webhook Activity</TabsTrigger>
        <TabsTrigger value="learning">Repository Learning</TabsTrigger>
      </TabsList>
      <TabsContent value="automation" className="space-y-5">
      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">Automation Repository Onboarding</Badge>
            <h2 className="font-display text-2xl font-semibold">Automation Repository Onboarding</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Connect, analyze, initialize, and validate any GitHub Playwright automation repository with AI. AI QA Copilot detects framework readiness, prepares missing Playwright setup, configures GitHub Actions validation, and keeps all changes inside reviewable pull requests.
            </p>
          </div>
          {config ? (
            <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Configured</Badge>
          ) : (
            <Badge variant="outline">Not configured</Badge>
          )}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.85fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={form.owner}
                disabled={!canManage}
                onChange={(event) => setForm((value) => ({ ...value, owner: event.target.value }))}
                placeholder="Repository owner, e.g. dksable"
              />
              <Input
                value={form.repo}
                disabled={!canManage}
                onChange={(event) => setForm((value) => ({ ...value, repo: event.target.value }))}
                placeholder="Repository name, e.g. ai-qa-automation"
              />
              <Input
                value={form.defaultBranch}
                disabled={!canManage}
                onChange={(event) => setForm((value) => ({ ...value, defaultBranch: event.target.value }))}
                placeholder="Default branch, e.g. main"
              />
              <Input
                value={form.testFolderPath}
                disabled={!canManage}
                onChange={(event) => setForm((value) => ({ ...value, testFolderPath: event.target.value }))}
                placeholder="Test folder path, e.g. tests/e2e"
              />
            </div>
            <Input
              type="password"
              value={form.token}
              disabled={!canManage}
              onChange={(event) => setForm((value) => ({ ...value, token: event.target.value }))}
              placeholder={config?.tokenMasked ? `GitHub token (${config.tokenMasked})` : "GitHub Personal Access Token"}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveConfig} disabled={!canManage || isSaving || !form.token || !form.owner || !form.repo}>
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Github className="size-4" />}
                Save Repository Config
              </Button>
              <Button variant="outline" onClick={testConnection} disabled={!config || isTesting}>
                {isTesting ? <Loader2 className="size-4 animate-spin" /> : <GitBranch className="size-4" />}
                Test Connection
              </Button>
              <Button variant="outline" onClick={analyzeRepository} disabled={!config || isAnalyzing}>
                {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                Analyze Onboarding Readiness
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border/40 bg-surface/40 p-4">
            <h3 className="font-semibold">Current Target</h3>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : config ? (
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Repository:</span> {config.owner}/{config.repo}</p>
                <p><span className="text-muted-foreground">Branch:</span> {config.defaultBranch}</p>
                <p><span className="text-muted-foreground">Folder:</span> {config.testFolderPath}</p>
                <p><span className="text-muted-foreground">Token:</span> {config.tokenMasked}</p>
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">Please configure an automation repository first.</p>
            )}
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
              Tokens are encrypted in the backend and never displayed after saving. Automation Repository Onboarding always creates a branch and pull request; it never pushes directly to the default branch.
            </div>
          </div>
        </div>
      </Card>

      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold">Automation Repository Onboarding Report</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              AI QA Copilot scans the repository, checks Playwright readiness, validates GitHub Actions compatibility, and recommends initialization steps.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis && (
              <Badge
                variant="outline"
                className={analysis.confidenceScore < 70 ? "border-warning/40 bg-warning/10 text-warning" : "border-success/40 bg-success/10 text-success"}
              >
                {analysis.confidenceScore}% confidence
              </Badge>
            )}
            <Dialog open={isOverrideOpen} onOpenChange={setIsOverrideOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!analysis}>
                  <Pencil className="size-3.5" />
                  Manual Override
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Override Automation Repository Onboarding Analysis</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select value={overrideForm.language} onValueChange={(language) => setOverrideForm((value) => ({ ...value, language }))}>
                      <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
                      <SelectContent>{["TypeScript", "JavaScript", "Java", "Unknown"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={overrideForm.framework} onValueChange={(framework) => setOverrideForm((value) => ({ ...value, framework }))}>
                      <SelectTrigger><SelectValue placeholder="Framework" /></SelectTrigger>
                      <SelectContent>{["Playwright", "Playwright Test Runner", "Java Playwright", "Custom Playwright setup", "Unknown"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input value={overrideForm.testFolderPath} onChange={(event) => setOverrideForm((value) => ({ ...value, testFolderPath: event.target.value }))} placeholder="Test folder path" />
                    <Input value={overrideForm.pageObjectFolderPath} onChange={(event) => setOverrideForm((value) => ({ ...value, pageObjectFolderPath: event.target.value }))} placeholder="Page object folder path" />
                    <Select value={overrideForm.pattern} onValueChange={(pattern) => setOverrideForm((value) => ({ ...value, pattern }))}>
                      <SelectTrigger><SelectValue placeholder="Pattern" /></SelectTrigger>
                      <SelectContent>{["Page Object Model", "Fixtures", "Direct Playwright", "Custom"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={overrideForm.buildTool} onValueChange={(buildTool) => setOverrideForm((value) => ({ ...value, buildTool }))}>
                      <SelectTrigger><SelectValue placeholder="Build tool" /></SelectTrigger>
                      <SelectContent>{["npm", "Maven", "Gradle", "Unknown"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                    <Input value={overrideForm.namingConvention} onChange={(event) => setOverrideForm((value) => ({ ...value, namingConvention: event.target.value }))} placeholder="Naming convention" />
                    <Input value={overrideForm.importStyle} onChange={(event) => setOverrideForm((value) => ({ ...value, importStyle: event.target.value }))} placeholder="Import style" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOverrideOpen(false)}>Cancel</Button>
                    <Button onClick={saveOverride}>Save Override</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!analysis ? (
          <p className="mt-5 rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
            No onboarding analysis yet. Connect GitHub and click Analyze Onboarding Readiness.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-lg font-semibold">Automation Repository Onboarding Health</h4>
                    <Badge
                      variant="outline"
                      className={analysis.onboardingStatus === "Ready" ? "border-success/40 bg-success/10 text-success" : analysis.onboardingStatus === "Needs Initialization" ? "border-warning/40 bg-warning/10 text-warning" : "border-destructive/40 bg-destructive/10 text-destructive"}
                    >
                      {analysis.onboardingStatus || "Needs Review"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {analysis.githubActionsCompatible
                      ? "GitHub Actions validation workflow is compatible with AI QA Copilot."
                      : "GitHub Actions validation workflow is missing or needs initialization."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    {analysis.readinessScore ?? analysis.confidenceScore}% readiness
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={initializeAutomationRepositoryOnboarding}
                    disabled={!canManage || isInitializingOnboarding || analysis.onboardingStatus === "Ready"}
                  >
                    {isInitializingOnboarding ? <Loader2 className="size-4 animate-spin" /> : <Rocket className="size-4" />}
                    Initialize Missing Files
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <MiniStat label="Playwright Version" value={analysis.playwrightVersion || "Unknown"} />
                <MiniStat label="Package Manager" value={analysis.packageManager || analysis.buildTool || "Unknown"} />
                <MiniStat label="GitHub Actions" value={analysis.githubActionsCompatible ? "Ready" : "Missing"} />
                <MiniStat label="Missing Files" value={String(analysis.missingFiles?.length ?? 0)} />
              </div>
              {analysis.missingFiles?.length ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Missing initialization files</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.missingFiles.map((file) => <Badge key={file} variant="outline" className="font-mono text-[11px]">{file}</Badge>)}
                  </div>
                </div>
              ) : null}
              {analysis.recommendedActions?.length ? (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {analysis.recommendedActions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              ) : null}
            </div>
            {analysis.confidenceScore < 70 && (
              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                Confidence is low. Please review the detected language, folder, and pattern before pushing generated tests.
              </div>
            )}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MiniStat label="Framework" value={analysis.framework} />
              <MiniStat label="Language" value={analysis.language} />
              <MiniStat label="Build Tool" value={analysis.buildTool} />
              <MiniStat label="Pattern" value={analysis.pattern} />
              <MiniStat label="Test Folder" value={analysis.testFolderPath} />
              <MiniStat label="Page Objects" value={analysis.pageObjectFolderPath || "Not detected"} />
              <MiniStat label="POM" value={analysis.usesPageObjectModel ? "Yes" : "No"} />
              <MiniStat label="Fixtures" value={analysis.usesFixtures ? "Yes" : "No"} />
            </div>
            {analysis.healthChecks?.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {analysis.healthChecks.map((check) => (
                  <div key={check.name} className="rounded-lg border border-border/40 bg-card/70 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{check.name}</p>
                      <Badge
                        variant="outline"
                        className={check.status === "Passed" ? "border-success/40 bg-success/10 text-success" : check.status === "Warning" ? "border-warning/40 bg-warning/10 text-warning" : "border-destructive/40 bg-destructive/10 text-destructive"}
                      >
                        {check.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{check.message}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
              <h4 className="text-sm font-semibold">Scanned Files</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.scannedFiles.slice(0, 18).map((file) => (
                  <Badge key={file} variant="outline" className="font-mono text-[11px]">{file}</Badge>
                ))}
                {analysis.scannedFiles.length > 18 && <Badge variant="outline">+{analysis.scannedFiles.length - 18} more</Badge>}
              </div>
            </div>
          </div>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="app-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Github className="size-5" /></span>
            <div>
              <h3 className="font-semibold">GitHub</h3>
              <p className="text-sm text-muted-foreground">MVP support for branches, files, and pull requests.</p>
            </div>
          </div>
        </Card>
        <Card className="app-card p-5 opacity-75">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-surface/80 text-muted-foreground"><GitBranch className="size-5" /></span>
              <div>
                <h3 className="font-semibold">Bitbucket</h3>
                <p className="text-sm text-muted-foreground">Repository automation integration planned.</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </Card>
      </div>

      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Repository Sync</Badge>
              <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning">Beta</Badge>
            </div>
            <h3 className="font-display text-xl font-semibold">AI Repository Sync</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              Detect repository changes, identify impacted Playwright tests, generate AI recommendations, and create a pull request for QA review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={syncRepository} disabled={!config || !analysis || isSyncing}>
              {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Sync Repository
            </Button>
            <Button variant="outline" onClick={generateSyncSuggestions} disabled={!activeSync || isGeneratingSyncSuggestions}>
              {isGeneratingSyncSuggestions ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Generate Suggestions
            </Button>
            <Button variant="outline" onClick={generateSyncUpdates} disabled={!activeSync || isGeneratingSyncUpdates}>
              {isGeneratingSyncUpdates ? <Loader2 className="size-4 animate-spin" /> : <Code2 className="size-4" />}
              Generate Updates
            </Button>
            <Button variant="outline" onClick={() => setIsPreviewOpen(true)} disabled={!activeSync?.prPreview}>
              <Eye className="size-4" />
              PR Preview
            </Button>
            <Button onClick={createSyncPr} disabled={!(activeSync?.prPreview || activeSync?.aiSuggestions.length) || isCreatingSyncPr}>
              {isCreatingSyncPr ? <Loader2 className="size-4 animate-spin" /> : <GitPullRequest className="size-4" />}
              Create Update PR
            </Button>
          </div>
        </div>

        {!config ? (
          <p className="mt-5 rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">Connect GitHub before using Repository Sync Beta.</p>
        ) : !analysis ? (
          <p className="mt-5 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">Run Smart Repository Analysis before syncing repository changes.</p>
        ) : !activeSync ? (
          <p className="mt-5 rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">No repository sync has been created yet.</p>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MiniStat label="Changed Files" value={String(activeSync.changedFiles.length)} />
              <MiniStat label="Impacted Tests" value={String(activeSync.impactedTests.length)} />
              <MiniStat label="Risk Level" value={activeSync.riskLevel} />
              <MiniStat label="Latest Commit" value={activeSync.latestCommitSha.slice(0, 8)} />
            </div>
            {activeSync.prUrl && (
              <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                Pull Request created: <a href={activeSync.prUrl} target="_blank" rel="noreferrer" className="font-semibold underline">View PR</a>
              </div>
            )}
            <div className="overflow-hidden rounded-lg border border-border/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">File Path</th>
                    <th className="px-3 py-2">Change</th>
                    <th className="px-3 py-2">Module</th>
                    <th className="px-3 py-2">Risk</th>
                    <th className="px-3 py-2">Possible Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {activeSync.changedFiles.slice(0, 10).map((file) => (
                    <tr key={file.filePath}>
                      <td className="px-3 py-2 font-mono text-xs">{file.filePath}</td>
                      <td className="px-3 py-2">{file.changeType}</td>
                      <td className="px-3 py-2">{file.relatedModule}</td>
                      <td className="px-3 py-2"><Badge variant="outline" className={riskClass(file.riskLevel)}>{file.riskLevel}</Badge></td>
                      <td className="px-3 py-2 text-muted-foreground">{file.possibleTestImpact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-hidden rounded-lg border border-border/40">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Impacted Test</th>
                    <th className="px-3 py-2">Changed File</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {activeSync.impactedTests.slice(0, 10).map((test, index) => (
                    <tr key={`${test.testFile}-${index}`}>
                      <td className="px-3 py-2 font-mono text-xs">{test.testFile}</td>
                      <td className="px-3 py-2 font-mono text-xs">{test.relatedChangedFile}</td>
                      <td className="px-3 py-2">{test.suggestedAction}</td>
                      <td className="px-3 py-2">{test.confidenceScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {activeSync.aiSuggestions.length ? activeSync.aiSuggestions.map((suggestion, index) => (
                <div key={index} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h4 className="font-semibold">AI Recommendation</h4>
                    <Badge variant="outline" className={riskClass(suggestion.riskLevel)}>{suggestion.riskLevel}</Badge>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{suggestion.summary}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {suggestion.suggestedUpdates.map((update) => <li key={update}>{update}</li>)}
                  </ul>
                  <p className="mt-3 text-sm font-medium">{suggestion.recommendedPrAction}</p>
                </div>
              )) : (
                <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground lg:col-span-2">Generate AI suggestions after syncing the repository.</p>
              )}
            </div>
            {activeSync.prPreview && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">PR Preview Ready</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{activeSync.prPreview.title}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{activeSync.prPreview.branchName}</p>
                  </div>
                  <Badge variant="outline" className={riskClass(activeSync.prPreview.riskLevel)}>{activeSync.prPreview.confidenceScore}% confidence</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <p><span className="text-muted-foreground">Files to add:</span> {activeSync.prPreview.filesToAdd.length}</p>
                  <p><span className="text-muted-foreground">Files to update:</span> {activeSync.prPreview.filesToUpdate.length}</p>
                </div>
              </div>
            )}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogContent className="max-w-6xl">
                <DialogHeader>
                  <DialogTitle>Repository Sync PR Preview</DialogTitle>
                </DialogHeader>
                {activeSync.prPreview ? (
                  <div className="max-h-[75vh] space-y-4 overflow-y-auto pr-2">
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <MiniStat label="Branch" value={activeSync.prPreview.branchName} />
                        <MiniStat label="PR Title" value={activeSync.prPreview.title} />
                        <MiniStat label="Risk" value={activeSync.prPreview.riskLevel} />
                        <MiniStat label="Confidence" value={`${activeSync.prPreview.confidenceScore}%`} />
                      </div>
                      <pre className="mt-4 max-h-44 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{activeSync.prPreview.description}</pre>
                    </div>
                    {(activeSync.generatedUpdates ?? []).map((update) => (
                      <div key={update.id} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-mono text-sm font-semibold">{update.testFilePath}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{update.impactReason}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{update.changedLocatorOrFlow}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className={riskClass(update.riskLevel)}>{update.riskLevel}</Badge>
                            <Badge variant="outline">{update.confidenceScore}%</Badge>
                            <Badge variant="outline">{update.suggestedAction}</Badge>
                          </div>
                        </div>
                        <div className="grid gap-3 lg:grid-cols-2">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Old code</p>
                            <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{update.oldCode || "New file"}</pre>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">New AI-suggested code</p>
                            <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{update.newCode}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
                      <Button onClick={createSyncPr} disabled={isCreatingSyncPr}>
                        {isCreatingSyncPr ? <Loader2 className="size-4 animate-spin" /> : <GitPullRequest className="size-4" />}
                        Confirm and Create PR
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
                    Generate Playwright updates before viewing PR preview.
                  </p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
      </TabsContent>
      <TabsContent value="learning" className="space-y-5">
        <Card className="app-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">
                <Brain className="mr-1 size-3.5" />
                Repository Learning
              </Badge>
              <h2 className="font-display text-2xl font-semibold">Repository Learning</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                AI QA Copilot learns repository-specific Playwright patterns, locator strategy, naming conventions, team feedback, and validation outcomes so future generated tests match this automation repository more closely.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={refreshRepositoryLearning} disabled={!config || isLearningRefreshing}>
                {isLearningRefreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                Refresh Repository Learning
              </Button>
              <Button variant="outline" onClick={resetRepositoryLearning} disabled={!config || !canManage || isLearningResetting}>
                {isLearningResetting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                Reset Memory
              </Button>
            </div>
          </div>

          {!config ? (
            <div className="mt-5 rounded-lg border border-dashed border-border/50 p-8 text-center">
              <Brain className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Connect an automation repository before building repository memory.</p>
            </div>
          ) : isLearningLoading ? (
            <Skeleton className="mt-5 h-64 w-full" />
          ) : !learningProfile ? (
            <div className="mt-5 rounded-lg border border-dashed border-border/50 p-8 text-center">
              <Brain className="mx-auto size-8 text-muted-foreground" />
              <h3 className="mt-3 font-semibold">No repository learning profile yet</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
                Refresh learning to analyze existing repository analysis, generated tests, team approvals, edits, rejections, and validation results.
              </p>
              <Button className="mt-4" onClick={refreshRepositoryLearning} disabled={isLearningRefreshing}>
                {isLearningRefreshing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Build Repository Learning Profile
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MiniStat label="Memory Status" value="Active" />
                <MiniStat label="Repository" value={learningProfile.repositoryName} />
                <MiniStat label="Overall Confidence" value={`${learningProfile.overallConfidence}%`} />
                <MiniStat label="Last Analyzed" value={learningProfile.lastAnalyzedAt ? formatDate(learningProfile.lastAnalyzedAt) : "-"} />
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MiniStat label="Framework" value={`${learningProfile.framework}${learningProfile.frameworkVersion ? ` ${learningProfile.frameworkVersion}` : ""}`} />
                <MiniStat label="Language" value={learningProfile.language} />
                <MiniStat label="Package Manager" value={learningProfile.packageManager} />
                <MiniStat label="Preferred Locator" value={topLocatorPreference?.strategy ?? "Learning"} />
                <MiniStat label="POM Usage" value={learningProfile.testStylePatterns.pageObjectUsage} />
                <MiniStat label="Test Style" value={learningProfile.testStylePatterns.describeStructure} />
                <MiniStat label="Naming Pattern" value={learningProfile.namingPatterns.testFilePattern} />
                <MiniStat label="Validation Success Rate" value={learningValidationTotal ? `${learningValidationRate}%` : "No runs"} />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_.9fr]">
                <Card className="border border-border/40 bg-card/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">Learned Pattern Signals</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Patterns used as context before generating future Playwright tests.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Repository-Aware</Badge>
                      <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Learned Pattern</Badge>
                      {learningProfile.overallConfidence >= 85 && (
                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">High Confidence</Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Test Directories</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(learningProfile.testDirectories.length ? learningProfile.testDirectories : ["Not detected"]).map((item) => (
                          <Badge key={item} variant="outline" className="font-mono text-[11px]">{item}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Page Object Directories</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(learningProfile.pageObjectDirectories.length ? learningProfile.pageObjectDirectories : ["Not detected"]).map((item) => (
                          <Badge key={item} variant="outline" className="font-mono text-[11px]">{item}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Locator Preferences</p>
                      <div className="mt-2 space-y-2">
                        {learningProfile.locatorPreferences.map((preference) => (
                          <div key={preference.strategy} className="space-y-1">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-semibold">{preference.strategy}</span>
                              <span className="text-muted-foreground">{preference.weight}%</span>
                            </div>
                            <Progress value={preference.weight} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">Common Flows</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(learningProfile.commonFlows.length ? learningProfile.commonFlows : ["No generated flows yet"]).map((flow) => (
                          <Badge key={flow} variant="outline">{flow}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border border-border/40 bg-card/70 p-4">
                  <h3 className="font-semibold">Team Feedback Learning</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Approved, rejected, edited, and validated tests tune future AI confidence.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MiniStat label="Accepted Tests" value={learningProfile.acceptedGenerationCount} />
                    <MiniStat label="Rejected Tests" value={learningProfile.rejectedGenerationCount} />
                    <MiniStat label="Edited Tests" value={learningProfile.editedGenerationCount} />
                    <MiniStat label="Validation Passes" value={learningProfile.validationPassCount} />
                    <MiniStat label="Validation Failures" value={learningProfile.validationFailCount} />
                    <MiniStat label="Repository Match" value={`${learningProfile.repositoryMatchScore}%`} />
                  </div>
                </Card>
              </div>

              <Card className="border border-border/40 bg-card/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">AI Confidence Trend</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Recent learning events and score changes for this repository only.</p>
                  </div>
                  <Badge variant="outline">{learningProfile.aiConfidenceTrend.length} events</Badge>
                </div>
                {learningProfile.aiConfidenceTrend.length === 0 ? (
                  <p className="mt-4 rounded-lg border border-dashed border-border/50 p-5 text-center text-sm text-muted-foreground">No confidence events yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {learningProfile.aiConfidenceTrend.slice(-6).reverse().map((event) => (
                      <div key={`${event.date}-${event.event}-${event.score}`} className="grid gap-3 rounded-lg border border-border/40 bg-surface/40 p-3 text-sm md:grid-cols-[180px_1fr_100px]">
                        <span className="text-muted-foreground">{formatDate(event.date)}</span>
                        <span className="font-medium">{event.event}</span>
                        <span className="font-semibold text-primary">{event.score}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="application">
        <ApplicationRepositoriesPanel
          workspaceId={workspaceId}
          canManage={canManage}
          repositories={applicationRepositories}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />
      </TabsContent>
      <TabsContent value="activity">
        <RepositoryActivityPanel
          activities={repositoryActivities}
          repositories={applicationRepositories}
          onRefresh={onRefresh}
        />
      </TabsContent>
    </Tabs>
  );
}

function ApplicationRepositoriesPanel({
  workspaceId,
  canManage,
  repositories,
  isLoading,
  onRefresh,
}: {
  workspaceId: string;
  canManage: boolean;
  repositories: ApplicationRepositoryConfig[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState({
    repositoryType: "frontend" as ApplicationRepositoryType,
    token: "",
    owner: "",
    repo: "",
    defaultBranch: "main",
    webhookSecret: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [manualSetup, setManualSetup] = useState<ApplicationRepositoryConfig["manualSetup"] | null>(null);

  const connectRepository = async () => {
    if (!workspaceId) {
      toast.error("Select a workspace first.");
      return;
    }
    try {
      setIsSaving(true);
      const saved = await projectApi.connectApplicationRepository({
        workspaceId,
        ...form,
        webhookSecret: form.webhookSecret || undefined,
      });
      setManualSetup(saved.manualSetup ?? null);
      setForm((current) => ({ ...current, token: "", webhookSecret: "" }));
      toast.success(saved.webhookStatus === "Connected" ? "Application repository connected" : "Repository saved. Manual webhook setup may be required.");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect application repository");
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (configId: string) => {
    try {
      const result = await projectApi.testApplicationRepositoryConnection(configId);
      toast.success(`Connected to ${result.repository}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "GitHub connection failed");
    }
  };

  const registerWebhook = async (configId: string) => {
    try {
      const updated = await projectApi.registerApplicationRepositoryWebhook(configId);
      setManualSetup(updated.manualSetup ?? null);
      toast.success(updated.webhookStatus === "Connected" ? "Webhook registered" : "Manual webhook setup required");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Webhook registration failed");
      onRefresh();
    }
  };

  const disconnectRepository = async (configId: string) => {
    if (!window.confirm("Disconnect this application repository?")) return;
    try {
      await projectApi.deleteApplicationRepository(configId);
      toast.success("Application repository disconnected");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to disconnect repository");
    }
  };

  return (
    <div className="space-y-5">
      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">Application Repositories</Badge>
            <h2 className="font-display text-2xl font-semibold">Connect Frontend and Backend Repositories</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Register GitHub webhooks for application repositories so AI QA Copilot can capture push and pull request changes for future impact analysis.
            </p>
          </div>
          <Badge variant="outline">{repositories.length} connected</Badge>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <Select value={form.repositoryType} onValueChange={(repositoryType) => setForm((value) => ({ ...value, repositoryType: repositoryType as ApplicationRepositoryType }))}>
            <SelectTrigger><SelectValue placeholder="Repository Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Application Frontend Repository</SelectItem>
              <SelectItem value="backend">Application Backend Repository</SelectItem>
            </SelectContent>
          </Select>
          <Input value={form.owner} disabled={!canManage} onChange={(event) => setForm((value) => ({ ...value, owner: event.target.value }))} placeholder="Repository owner" />
          <Input value={form.repo} disabled={!canManage} onChange={(event) => setForm((value) => ({ ...value, repo: event.target.value }))} placeholder="Repository name" />
          <Input value={form.defaultBranch} disabled={!canManage} onChange={(event) => setForm((value) => ({ ...value, defaultBranch: event.target.value }))} placeholder="Default branch" />
          <Input type="password" value={form.token} disabled={!canManage} onChange={(event) => setForm((value) => ({ ...value, token: event.target.value }))} placeholder="GitHub Personal Access Token" />
          <Input type="password" value={form.webhookSecret} disabled={!canManage} onChange={(event) => setForm((value) => ({ ...value, webhookSecret: event.target.value }))} placeholder="Webhook secret optional" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={connectRepository} disabled={!canManage || isSaving || !form.token || !form.owner || !form.repo}>
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Github className="size-4" />}
            Save & Register Webhook
          </Button>
        </div>
        {manualSetup && (
          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm">
            <p className="font-semibold text-warning">Manual webhook setup required</p>
            <div className="mt-2 grid gap-2 text-muted-foreground md:grid-cols-2">
              <p>Webhook URL: <span className="font-mono text-foreground">{manualSetup.webhookUrl}</span></p>
              <p>Content type: <span className="font-mono text-foreground">{manualSetup.contentType}</span></p>
              <p>Secret: <span className="font-mono text-foreground">{manualSetup.secret}</span></p>
              <p>Events: <span className="font-mono text-foreground">{manualSetup.events.join(", ")}</span></p>
            </div>
          </div>
        )}
      </Card>

      {isLoading ? (
        <ContextualLoadingState
          icon={Github}
          title="Loading connected repositories"
          description="Checking application repository connections, webhook status, and last received GitHub events."
        />
      ) : repositories.length === 0 ? (
        <ProfessionalEmptyState
          icon={GitBranch}
          title="No application repositories connected"
          message="Connect frontend or backend repositories to receive GitHub webhook activity and prepare future AI impact analysis."
          actionLabel="Use the connection form above"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {repositories.map((repository) => (
            <Card key={repository.id} className="app-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{repository.repositoryType === "frontend" ? "Frontend" : "Backend"}</Badge>
                    <Badge variant="outline" className={
                      repository.webhookStatus === "Connected"
                        ? "border-success/40 bg-success/10 text-success"
                        : repository.webhookStatus === "Failed"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : "border-warning/40 bg-warning/10 text-warning"
                    }>
                      {repository.webhookStatus}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-semibold">{repository.owner}/{repository.repo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Branch: {repository.defaultBranch}</p>
                </div>
                <Github className="size-5 text-muted-foreground" />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <p>Last event: {repository.lastEventReceivedAt ? formatDate(repository.lastEventReceivedAt) : "-"}</p>
                <p>Last sync: {repository.lastSyncedAt ? formatDate(repository.lastSyncedAt) : "-"}</p>
                <p>Token: {repository.tokenMasked}</p>
                <p>Secret: {repository.webhookSecretMasked}</p>
              </div>
              {repository.webhookError && <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-sm text-destructive">{repository.webhookError}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => testConnection(repository.id)}>Test Connection</Button>
                <Button variant="outline" size="sm" onClick={() => registerWebhook(repository.id)}>Re-register Webhook</Button>
                <Button variant="outline" size="sm" disabled={!canManage} onClick={() => disconnectRepository(repository.id)}>Disconnect</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RepositoryActivityPanel({
  activities,
  repositories,
  onRefresh,
}: {
  activities: RepositoryActivity[];
  repositories: ApplicationRepositoryConfig[];
  onRefresh: () => void;
}) {
  const [activeActivity, setActiveActivity] = useState<RepositoryActivity | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<RepositoryImpactAnalysis | null>(null);
  const [isImpactLoading, setIsImpactLoading] = useState(false);
  const [isImpactRunning, setIsImpactRunning] = useState(false);
  const [testUpdates, setTestUpdates] = useState<RepositoryGeneratedTestUpdate[]>([]);
  const [validationRun, setValidationRun] = useState<RepositoryValidationRun | null>(null);
  const [validationRecommendation, setValidationRecommendation] = useState<RepositoryValidationRecommendation | null>(null);
  const [failureAnalysis, setFailureAnalysis] = useState<ValidationFailureAnalysis | null>(null);
  const [autoFixes, setAutoFixes] = useState<ValidationAutoFix[]>([]);
  const [retryAttempts, setRetryAttempts] = useState<ValidationRetryAttempt[]>([]);
  const [retryRecommendation, setRetryRecommendation] = useState<{
    retryRecommendation: "Recommended" | "With Caution" | "Not Recommended";
    reason: string;
    failureType: string;
    testFiles: string[];
    testNames: string[];
    maxRetries: number;
  } | null>(null);
  const [validationMode, setValidationMode] = useState<RepositoryValidationMode>("quick");
  const [isUpdateGenerating, setIsUpdateGenerating] = useState(false);
  const [isValidationRunning, setIsValidationRunning] = useState(false);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [isFailureAnalysisLoading, setIsFailureAnalysisLoading] = useState(false);
  const [isAutoFixLoading, setIsAutoFixLoading] = useState(false);
  const [isRetryingValidation, setIsRetryingValidation] = useState(false);
  const [isPrCreating, setIsPrCreating] = useState(false);
  const [fixSuggestion, setFixSuggestion] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [activityEventFilter, setActivityEventFilter] = useState("all");
  const [activityStatusFilter, setActivityStatusFilter] = useState("all");
  const [activityRepositoryFilter, setActivityRepositoryFilter] = useState("all");
  const visibleActivities = activities.filter((activity) => {
    const repositoryKey = `${activity.repoOwner}/${activity.repoName}`;
    const query = activitySearch.trim().toLowerCase();
    return (
      (!query || `${repositoryKey} ${activity.branch} ${activity.author} ${activity.message}`.toLowerCase().includes(query)) &&
      (activityEventFilter === "all" || activity.eventType === activityEventFilter) &&
      (activityStatusFilter === "all" || activity.status === activityStatusFilter) &&
      (activityRepositoryFilter === "all" || repositoryKey === activityRepositoryFilter)
    );
  });
  const totalFiles = activities.reduce((sum, activity) => sum + activity.fileCount, 0);
  const lastActivity = activities[0]?.createdAt;
  const approvedOrEditedUpdates = testUpdates.filter((update) => update.status === "Approved" || update.status === "Edited");
  const hasApprovedOrEditedUpdates = approvedOrEditedUpdates.length > 0;
  const validationPassed = validationRun?.status === "Passed" && validationRun.failed === 0;
  const validationInProgress = isValidationRunning || validationRun?.status === "Running" || validationRun?.status === "Pending";
  const validationStageDurations = validationRun?.validationStageTimings ?? [];
  const validationCacheHit = validationRun?.validationDebugLogs?.some((step) => /cache hit:\s*true/i.test(`${step.stdout}\n${step.stderr}`)) ?? false;
  const validationBrowserInstallSkipped = validationRun?.validationDebugLogs?.some((step) => /skipping browser download|browser cache restored/i.test(`${step.stdout}\n${step.stderr}`)) ?? false;
  const validationTestExecutionDuration = validationStageDurations
    .filter((stage) => stage.stage === "Test execution")
    .reduce((sum, stage) => sum + stage.duration, 0);
  const validationBrowser = normalizeValidationBrowser(validationRun);
  const validationProvider = validationProviderLabel(validationRun?.validationProvider);
  const validationRepoUrl = validationRun?.workflowRunUrl?.split("/actions/runs/")[0] ?? "";
  const validationRepository = validationRepoUrl ? validationRepoUrl.replace("https://github.com/", "") : "-";
  const validationBranchUrl = validationRepoUrl && validationRun?.validationBranchName
    ? `${validationRepoUrl}/tree/${encodeURIComponent(validationRun.validationBranchName)}`
    : undefined;
  const validationProgressStages = ["Queued", "Preparing Runner", "Installing Dependencies", "Installing Browsers", "Running Tests", "Uploading Reports", "Completed"];
  const validationQueueStatus = validationRun?.status === "Pending" ? "Queued" : validationRun?.status === "Running" ? "Running" : validationRun?.status ?? "Not Started";
  const validationElapsed = validationRun ? formatValidationDuration(Date.now() - new Date(validationRun.createdAt).getTime()) : "-";
  const validationEstimatedTime = validationModeEstimate(validationMode);
  const validationProgressPercent = validationRun
    ? validationRun.status === "Passed" || validationRun.status === "Failed" ? 100
      : Math.min(95, Math.max(12, (validationRun.validationStageTimings?.filter((item) => item.status === "Passed" || item.status === "Skipped").length ?? 0) * 14))
    : 0;
  const recommendationBlocksPr = validationRecommendation?.releaseRecommendation === "Do Not Merge";
  const recommendationWarnsPr = validationRecommendation?.releaseRecommendation === "Merge with Caution";
  const downloadValidationJson = () => {
    if (!validationRun?.jsonReportData) {
      toast.info("JSON report is not available yet.");
      return;
    }
    const blob = new Blob([JSON.stringify(validationRun.jsonReportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aiqa-validation-${validationRun.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!activeActivity) {
      setImpactAnalysis(null);
      return;
    }
    setIsImpactLoading(true);
    projectApi
      .getRepositoryImpactAnalysis(activeActivity.id)
      .then(async (analysis) => {
        setImpactAnalysis(analysis);
        const [updates, validation] = await Promise.all([
          projectApi.listRepositoryTestUpdates(analysis.id).catch(() => []),
          projectApi.getRepositoryUpdateValidation(analysis.id).catch(() => null),
        ]);
        const recommendation = await projectApi.getRepositoryValidationRecommendation(analysis.id).catch(() => null);
        setTestUpdates(updates);
        setValidationRun(validation);
        setValidationRecommendation(recommendation);
        if (validation) {
          const [failure, fixes, retries, retryPlan] = await Promise.all([
            projectApi.getValidationFailureAnalysis(validation.id).catch(() => null),
            projectApi.listValidationAutoFixes(validation.id).catch(() => []),
            projectApi.listValidationRetries(validation.id).catch(() => []),
            projectApi.getValidationRetryRecommendation(validation.id).catch(() => null),
          ]);
          setFailureAnalysis(failure);
          setAutoFixes(fixes);
          setRetryAttempts(retries);
          setRetryRecommendation(retryPlan);
        } else {
          setFailureAnalysis(null);
          setAutoFixes([]);
          setRetryAttempts([]);
          setRetryRecommendation(null);
        }
      })
      .catch(() => {
        setImpactAnalysis(null);
        setTestUpdates([]);
        setValidationRun(null);
        setValidationRecommendation(null);
        setFailureAnalysis(null);
        setAutoFixes([]);
        setRetryAttempts([]);
        setRetryRecommendation(null);
      })
      .finally(() => setIsImpactLoading(false));
  }, [activeActivity]);

  const updateStatus = async (activityId: string, status: RepositoryActivityStatus) => {
    try {
      await projectApi.updateRepositoryActivityStatus(activityId, status);
      toast.success(`Activity marked ${status.toLowerCase()}`);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update activity");
    }
  };

  const runImpactAnalysis = async (regenerate = false) => {
    if (!activeActivity) return;
    try {
      setIsImpactRunning(true);
      const analysis = regenerate
        ? await projectApi.regenerateRepositoryImpactAnalysis(activeActivity.id)
        : await projectApi.runRepositoryImpactAnalysis(activeActivity.id);
      setImpactAnalysis(analysis);
      setTestUpdates([]);
      setValidationRun(null);
      setValidationRecommendation(null);
      setFailureAnalysis(null);
      setAutoFixes([]);
      setRetryAttempts([]);
      toast.success(regenerate ? "Impact analysis regenerated" : "Impact analysis completed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impact analysis failed");
    } finally {
      setIsImpactRunning(false);
    }
  };

  const generateTestUpdates = async () => {
    if (!impactAnalysis) return;
    try {
      setIsUpdateGenerating(true);
      const updates = await projectApi.generateRepositoryTestUpdates(impactAnalysis.id);
      setTestUpdates(updates);
      toast.success("Generated Playwright test update proposals");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate test updates");
    } finally {
      setIsUpdateGenerating(false);
    }
  };

  const refreshTestUpdates = async () => {
    if (!impactAnalysis) return;
    setTestUpdates(await projectApi.listRepositoryTestUpdates(impactAnalysis.id));
  };

  const updateTestUpdateStatus = async (updateId: string, action: "approve" | "reject" | "regenerate") => {
    try {
      if (action === "approve") await projectApi.approveRepositoryTestUpdate(updateId);
      if (action === "reject") await projectApi.rejectRepositoryTestUpdate(updateId);
      if (action === "regenerate") await projectApi.regenerateRepositoryTestUpdate(updateId);
      await refreshTestUpdates();
      toast.success(action === "approve" ? "Update approved" : action === "reject" ? "Update rejected" : "Update regenerated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update proposal");
    }
  };

  const editTestUpdate = async (update: RepositoryGeneratedTestUpdate) => {
    const newCode = window.prompt("Edit proposed code", update.newCode);
    if (!newCode || newCode === update.newCode) return;
    try {
      await projectApi.editRepositoryTestUpdate(update.id, { newCode });
      await refreshTestUpdates();
      toast.success("Proposed code updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to edit proposed code");
    }
  };

  const runValidation = async () => {
    if (!impactAnalysis) return;
    const isTerminalStatus = (status: RepositoryValidationRun["status"]) =>
      !["Pending", "Running"].includes(status);

    try {
      setIsValidationRunning(true);
      const startedRun = await projectApi.runRepositoryUpdateValidation(impactAnalysis.id, {
        validationMode,
        browser: "chromium",
      });
      setValidationRun(startedRun);
      setValidationRecommendation(null);
      setFailureAnalysis(null);
      setAutoFixes([]);
      setRetryAttempts([]);
      toast.success("Validation started. Results will appear here automatically.");
      localStorage.setItem(`aiqa-active-validation-${impactAnalysis.id}`, startedRun.id);

      let latestRun = startedRun;
      for (let attempt = 0; attempt < 80 && !isTerminalStatus(latestRun.status); attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        latestRun = await projectApi.getRepositoryUpdateValidation(impactAnalysis.id);
        setValidationRun(latestRun);
      }

      if (!isTerminalStatus(latestRun.status)) {
        toast.warning("Validation is still running. You can stay on this page; results will be available shortly.");
        return;
      }

      toast.success(latestRun.status === "Failed" ? "Validation completed with failures" : "Validation completed");
      localStorage.removeItem(`aiqa-active-validation-${impactAnalysis.id}`);
      void loadValidationRecommendation(impactAnalysis.id, false);
      if (latestRun.status === "Failed" || latestRun.failed > 0 || (latestRun.failedTests?.length ?? 0) > 0) {
        void runFailureAnalysis(false, latestRun.id);
        void projectApi.getValidationRetryRecommendation(latestRun.id).then(setRetryRecommendation).catch(() => setRetryRecommendation(null));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Validation failed");
    } finally {
      setIsValidationRunning(false);
    }
  };

  useEffect(() => {
    if (!impactAnalysis || !validationRun || isValidationRunning || !["Pending", "Running"].includes(validationRun.status)) return;
    localStorage.setItem(`aiqa-active-validation-${impactAnalysis.id}`, validationRun.id);
    const interval = window.setInterval(async () => {
      try {
        const latestRun = await projectApi.getRepositoryUpdateValidation(impactAnalysis.id);
        setValidationRun(latestRun);
        if (!["Pending", "Running"].includes(latestRun.status)) {
          localStorage.removeItem(`aiqa-active-validation-${impactAnalysis.id}`);
          toast.success(latestRun.status === "Failed" ? "Validation completed with failures" : "Validation completed");
          void loadValidationRecommendation(impactAnalysis.id, false);
          if (latestRun.status === "Failed" || latestRun.failed > 0 || (latestRun.failedTests?.length ?? 0) > 0) {
            void runFailureAnalysis(false, latestRun.id);
            void projectApi.getValidationRetryRecommendation(latestRun.id).then(setRetryRecommendation).catch(() => setRetryRecommendation(null));
          }
          window.clearInterval(interval);
        }
      } catch {
        // Keep the current validation view intact if a transient poll fails.
      }
    }, 4000);
    return () => window.clearInterval(interval);
  }, [impactAnalysis, isValidationRunning, validationRun]);

  const loadValidationRecommendation = async (impactAnalysisId: string, regenerate: boolean) => {
    try {
      setIsRecommendationLoading(true);
      const recommendation = regenerate
        ? await projectApi.regenerateRepositoryValidationRecommendation(impactAnalysisId)
        : await projectApi.generateRepositoryValidationRecommendation(impactAnalysisId);
      setValidationRecommendation(recommendation);
      toast.success(regenerate ? "AI recommendation regenerated" : "AI recommendation generated");
    } catch {
      toast.warning("AI recommendation could not be generated. Validation result is still available.");
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  const runFailureAnalysis = async (regenerate = false, validationRunId = validationRun?.id) => {
    if (!validationRunId) return;
    try {
      setIsFailureAnalysisLoading(true);
      const analysis = regenerate
        ? await projectApi.regenerateValidationFailureAnalysis(validationRunId)
        : await projectApi.generateValidationFailureAnalysis(validationRunId);
      setFailureAnalysis(analysis);
      toast.success(regenerate ? "AI failure analysis regenerated" : "AI failure analysis generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate failure analysis");
    } finally {
      setIsFailureAnalysisLoading(false);
    }
  };

  const generateAutoFix = async (regenerate = false) => {
    if (!validationRun) return;
    try {
      setIsAutoFixLoading(true);
      const fixes = regenerate
        ? await projectApi.regenerateValidationAutoFix(validationRun.id)
        : await projectApi.generateValidationAutoFix(validationRun.id);
      setAutoFixes((current) => [...fixes, ...current]);
      toast.success(regenerate ? "AI auto-fix regenerated" : "AI auto-fix proposal generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate auto-fix");
    } finally {
      setIsAutoFixLoading(false);
    }
  };

  const updateAllAutoFixes = async (action: "approve" | "reject" | "commit") => {
    if (!validationRun) return;
    try {
      setIsAutoFixLoading(true);
      if (action === "approve") {
        setAutoFixes(await projectApi.approveAllValidationAutoFixes(validationRun.id));
        toast.success("All AI fixes approved");
      }
      if (action === "reject") {
        setAutoFixes(await projectApi.rejectAllValidationAutoFixes(validationRun.id));
        toast.success("All AI fixes rejected");
      }
      if (action === "commit") {
        const result = await projectApi.commitValidationAutoFixes(validationRun.id);
        setAutoFixes(await projectApi.listValidationAutoFixes(validationRun.id));
        await refreshTestUpdates();
        toast.success(`Approved fixes committed to ${result.branch}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update AI fixes");
    } finally {
      setIsAutoFixLoading(false);
    }
  };

  const updateAutoFixStatus = async (fix: ValidationAutoFix, action: "approve" | "reject" | "edit") => {
    try {
      if (action === "approve") await projectApi.approveValidationAutoFix(fix.id);
      if (action === "reject") await projectApi.rejectValidationAutoFix(fix.id);
      if (action === "edit") {
        const fixedCode = window.prompt("Edit fixed Playwright code", fix.afterCode ?? fix.fixedCode);
        if (!fixedCode || fixedCode === (fix.afterCode ?? fix.fixedCode)) return;
        await projectApi.editValidationAutoFix(fix.id, { fixedCode });
      }
      setAutoFixes(await projectApi.listValidationAutoFixes(fix.validationRunId));
      await refreshTestUpdates();
      toast.success(action === "approve" ? "Auto-fix approved" : action === "reject" ? "Auto-fix rejected" : "Auto-fix edited");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update auto-fix");
    }
  };

  const retryValidation = async (afterFix = false) => {
    if (!validationRun) return;
    try {
      setIsRetryingValidation(true);
      const result = afterFix
        ? await projectApi.retryValidationAfterFix(validationRun.id)
        : await projectApi.retryValidationRun(validationRun.id);
      setValidationRun(result.validationRun);
      setRetryAttempts(await projectApi.listValidationRetries(validationRun.id));
      setValidationRecommendation(null);
      setFailureAnalysis(null);
      setRetryRecommendation(null);
      toast.success(`${afterFix ? "Retry after fix" : "Retry"} attempt ${result.retry.attemptNumber} completed`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to retry validation");
    } finally {
      setIsRetryingValidation(false);
    }
  };

  const generateFixSuggestion = async () => {
    if (!impactAnalysis) return;
    try {
      const result = await projectApi.generateRepositoryFixSuggestion(impactAnalysis.id);
      setFixSuggestion(result.suggestion);
      if (result.validationRun) setValidationRun(result.validationRun);
      toast.success("Fix suggestion generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate fix suggestion");
    }
  };

  const createImpactPr = async () => {
    if (!impactAnalysis) return;
    if (!validationRun) {
      toast.error("Run validation before creating the pull request.");
      return;
    }
    const force = !validationPassed || recommendationBlocksPr || recommendationWarnsPr;
    if (recommendationBlocksPr && !window.confirm("AI recommendation says Do Not Merge. Owner/Admin override should be used only for exceptional QA review. Create PR anyway?")) return;
    if (!recommendationBlocksPr && force && !window.confirm("Validation or AI recommendation requires caution. Create PR anyway for QA review?")) return;
    try {
      setIsPrCreating(true);
      const result = await projectApi.createRepositoryImpactPullRequest(impactAnalysis.id, force);
      toast.success(
        <span>
          Pull Request created:{" "}
          <a className="font-semibold underline" href={result.pullRequestUrl || result.pullRequest?.html_url} target="_blank" rel="noreferrer">
            View PR
          </a>
        </span>,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create pull request");
    } finally {
      setIsPrCreating(false);
    }
  };

  const updateImpactStatus = async (status: RepositoryImpactAnalysisStatus) => {
    if (!impactAnalysis) return;
    try {
      const updated = await projectApi.updateRepositoryImpactAnalysisStatus(impactAnalysis.id, status);
      setImpactAnalysis(updated);
      toast.success(`Impact analysis marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update impact analysis");
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-5">
        <MiniStat label="Total Events" value={String(activities.length)} />
        <MiniStat label="Push Events" value={String(activities.filter((item) => item.eventType === "push").length)} />
        <MiniStat label="Pull Requests" value={String(activities.filter((item) => item.eventType === "pull_request").length)} />
        <MiniStat label="Changed Files" value={String(totalFiles)} />
        <MiniStat label="Last Activity" value={lastActivity ? formatDate(lastActivity) : "-"} />
      </div>

      <Card className="app-card overflow-hidden p-0">
        <div className="border-b border-border/40 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Repository Activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest GitHub push and pull request events from connected application repositories.</p>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/50 px-3 py-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                value={activitySearch}
                onChange={(event) => setActivitySearch(event.target.value)}
                placeholder="Search activity"
                className="h-7 border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </div>
            <Select value={activityRepositoryFilter} onValueChange={setActivityRepositoryFilter}>
              <SelectTrigger><SelectValue placeholder="Repository" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All repositories</SelectItem>
                {Array.from(new Set(activities.map((activity) => `${activity.repoOwner}/${activity.repoName}`))).map((repository) => (
                  <SelectItem key={repository} value={repository}>{repository}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={activityEventFilter} onValueChange={setActivityEventFilter}>
              <SelectTrigger><SelectValue placeholder="Event type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                <SelectItem value="push">Push</SelectItem>
                <SelectItem value="pull_request">Pull Request</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activityStatusFilter} onValueChange={setActivityStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="Ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {activities.length === 0 ? (
          <div className="p-6">
            <ProfessionalEmptyState
              icon={RefreshCw}
              title="No repository activity yet"
              message="Connect application repositories and register webhooks to capture push and pull request events for impact analysis."
              actionLabel="Connect Repository"
            />
          </div>
        ) : visibleActivities.length === 0 ? (
          <div className="p-6">
            <ProfessionalEmptyState
              icon={Search}
              title="No activity matches these filters"
              message="Adjust repository, event, status, or search filters to see more activity."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-surface/90 text-xs uppercase text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Repository</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Commit / PR</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Files</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {visibleActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(activity.createdAt)}</td>
                    <td className="px-4 py-3 font-medium">{activity.repoOwner}/{activity.repoName}</td>
                    <td className="px-4 py-3 capitalize">{activity.repositoryType}</td>
                    <td className="px-4 py-3">{activity.eventType}</td>
                    <td className="px-4 py-3 font-mono text-xs">{activity.branch || "-"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{activity.pullRequestNumber ? `PR #${activity.pullRequestNumber}` : activity.commitSha?.slice(0, 8) || "-"}</td>
                    <td className="px-4 py-3">{activity.author || "-"}</td>
                    <td className="px-4 py-3">{activity.fileCount}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{activity.status}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveActivity(activity)}>View</Button>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(activity.id, "Reviewed")}>Review</Button>
                        <Button variant="outline" size="sm" onClick={() => updateStatus(activity.id, "Ignored")}>Ignore</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog open={Boolean(activeActivity)} onOpenChange={(open) => !open && setActiveActivity(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Repository Activity Detail</DialogTitle>
          </DialogHeader>
          {activeActivity && (
            <Tabs defaultValue="summary" className="max-h-[75vh] overflow-y-auto pr-2">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Event Summary</TabsTrigger>
                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <MiniStat label="Repository" value={`${activeActivity.repoOwner}/${activeActivity.repoName}`} />
                  <MiniStat label="Event" value={activeActivity.eventType} />
                  <MiniStat label="Branch" value={activeActivity.branch || "-"} />
                  <MiniStat label="Author" value={activeActivity.author || "-"} />
                  <MiniStat label="Files Changed" value={String(activeActivity.fileCount)} />
                  <MiniStat label="Status" value={activeActivity.status} />
                </div>
                {activeActivity.message && <p className="rounded-lg border border-border/40 bg-surface/40 p-3 text-sm">{activeActivity.message}</p>}
                {activeActivity.pullRequestUrl && (
                  <a className="text-sm font-semibold text-primary underline" href={activeActivity.pullRequestUrl} target="_blank" rel="noreferrer">Open Pull Request</a>
                )}
                <ChangedFilesTable files={activeActivity.changedFiles} />
                <pre className="max-h-52 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
                  {JSON.stringify(activeActivity.rawMetadata ?? {}, null, 2)}
                </pre>
              </TabsContent>
              <TabsContent value="impact" className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">AI Impact Analysis</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Map application changes to impacted modules, Playwright tests, and QA recommendations.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => runImpactAnalysis(false)} disabled={isImpactRunning}>
                      {isImpactRunning ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                      Run AI Impact Analysis
                    </Button>
                    <Button variant="outline" onClick={() => runImpactAnalysis(true)} disabled={!impactAnalysis || isImpactRunning}>
                      <RefreshCw className="size-4" />
                      Regenerate Analysis
                    </Button>
                    <Button variant="outline" disabled={!impactAnalysis} onClick={() => updateImpactStatus("Reviewed")}>
                      <CheckCircle2 className="size-4" />
                      Mark as Reviewed
                    </Button>
                  </div>
                </div>

                {isImpactLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : !impactAnalysis ? (
                  <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
                    <SearchCheck className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">No impact analysis yet. Run analysis to generate test mapping and smart suggestions.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                      <MiniStat label="Changed Files" value={String(impactAnalysis.changedFiles.length)} />
                      <MiniStat label="Impacted Modules" value={String(impactAnalysis.impactedModules.length)} />
                      <MiniStat label="Impacted Tests" value={String(impactAnalysis.impactedTests.length)} />
                      <MiniStat label="High Risk Items" value={String(impactAnalysis.impactedTests.filter((test) => test.riskLevel === "High").length)} />
                      <MiniStat label="Confidence" value={`${impactAnalysis.confidenceScore}%`} />
                      <MiniStat label="Risk Level" value={impactAnalysis.riskLevel} />
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">Recommended Next Action</p>
                        <Badge variant="outline">{impactAnalysis.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{impactAnalysis.recommendation}</p>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
                      <p className="mb-3 text-sm font-semibold">Impacted Modules</p>
                      <div className="flex flex-wrap gap-2">
                        {impactAnalysis.impactedModules.map((moduleName) => <Badge key={moduleName} variant="outline">{moduleName}</Badge>)}
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border/40">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2">Test File</th>
                            <th className="px-3 py-2">Changed File</th>
                            <th className="px-3 py-2">Action</th>
                            <th className="px-3 py-2">Risk</th>
                            <th className="px-3 py-2">Confidence</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {impactAnalysis.impactedTests.map((test) => (
                            <tr key={`${test.testFilePath}-${test.relatedChangedFile}`}>
                              <td className="px-3 py-2 font-mono text-xs">{test.testFilePath}</td>
                              <td className="px-3 py-2 font-mono text-xs">{test.relatedChangedFile}</td>
                              <td className="px-3 py-2">{test.suggestedAction}</td>
                              <td className="px-3 py-2"><Badge variant="outline">{test.riskLevel}</Badge></td>
                              <td className="px-3 py-2">{test.confidenceScore}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {impactAnalysis.suggestions.map((suggestion) => (
                        <div key={`${suggestion.title}-${suggestion.relatedChangedFile}`} className="rounded-lg border border-border/40 bg-card/70 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-semibold">{suggestion.title}</h4>
                            <div className="flex gap-2">
                              <Badge variant="outline">{suggestion.category}</Badge>
                              <Badge variant="outline">{suggestion.priority}</Badge>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{suggestion.description}</p>
                          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                            {suggestion.relatedTestFile && <p>Test: <span className="font-mono">{suggestion.relatedTestFile}</span></p>}
                            {suggestion.relatedChangedFile && <p>Changed file: <span className="font-mono">{suggestion.relatedChangedFile}</span></p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">Impact Report</p>
                          <p className="mt-1 text-sm text-muted-foreground">Includes repository, branch, commit, changed files, impacted tests, risk, suggestions, and recommendation.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" disabled>Export PDF Coming Soon</Button>
                          <Button variant="outline" disabled>Export Excel Coming Soon</Button>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">Sprint 3: Playwright Update Workflow</p>
                          <p className="mt-1 text-sm text-muted-foreground">Generate proposed updates, approve changes, validate, and create a pull request.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={generateTestUpdates} disabled={isUpdateGenerating}>
                            {isUpdateGenerating ? <Loader2 className="size-4 animate-spin" /> : <Code2 className="size-4" />}
                            Generate Test Updates
                          </Button>
                          <Button variant="outline" disabled={testUpdates.length === 0}>
                            <Eye className="size-4" />
                            View PR Preview
                          </Button>
                          <Select value={validationMode} onValueChange={(value) => setValidationMode(value as RepositoryValidationMode)}>
                            <SelectTrigger className="h-10 w-[172px] bg-card">
                              <SelectValue placeholder="Validation mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quick">Quick Validation</SelectItem>
                              <SelectItem value="impact">Impact Validation</SelectItem>
                              <SelectItem value="full">Full Validation</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="rounded-lg border border-border/40 bg-card/70 px-3 py-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{formatValidationMode(validationMode)}</span>
                            <span className="mx-1">•</span>
                            <span>Estimated {validationEstimatedTime}</span>
                          </div>
                          <Button variant="outline" onClick={runValidation} disabled={!hasApprovedOrEditedUpdates || validationInProgress}>
                            {validationInProgress ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                            Run Validation
                          </Button>
                          <Button onClick={createImpactPr} disabled={!hasApprovedOrEditedUpdates || !validationRun || (!validationPassed && validationRun.status !== "Failed") || isPrCreating}>
                            {isPrCreating ? <Loader2 className="size-4 animate-spin" /> : <GitPullRequest className="size-4" />}
                            Create Pull Request
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Test Updates</h4>
                      {testUpdates.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                          No generated Playwright updates yet.
                        </div>
                      ) : (
                        testUpdates.map((update) => (
                          <div key={update.id} className="rounded-lg border border-border/40 bg-card/70 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="break-words font-mono text-sm font-semibold">{update.testFilePath}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{update.updateSummary}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{update.impactReason}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{update.status}</Badge>
                                <Badge variant="outline">{update.riskLevel}</Badge>
                                <Badge variant="outline">{update.confidenceScore}%</Badge>
                              </div>
                            </div>
                            <div className="mt-3 rounded-lg border border-primary/15 bg-primary/5 p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold">Repository-Aware AI Quality</p>
                                  <p className="text-xs text-muted-foreground">
                                    Generated using detected repository patterns, locator strategy, and assertion style.
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {update.repositoryLearningUsed ? (
                                    <>
                                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Repository-Aware</Badge>
                                      <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Learned Pattern</Badge>
                                      {update.repositoryLearningUsed.overallConfidence >= 85 && (
                                        <Badge variant="outline" className="border-success/30 bg-success/10 text-success">High Confidence</Badge>
                                      )}
                                    </>
                                  ) : null}
                                  <Badge variant="outline">{update.repositoryContextSummary?.pattern ?? "Repository pattern"}</Badge>
                                </div>
                              </div>
                              {update.repositoryLearningUsed ? (
                                <div className="mt-3 rounded-lg border border-primary/15 bg-background/70 p-3">
                                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">AI Repository Learning Used</p>
                                    <Badge variant="outline">{update.repositoryLearningUsed.overallConfidence}% overall confidence</Badge>
                                  </div>
                                  <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-3 xl:grid-cols-6">
                                    <div className="rounded-md bg-surface/70 p-2">
                                      <span className="font-semibold text-foreground">Locator:</span> {update.repositoryLearningUsed.locatorStrategy}
                                    </div>
                                    <div className="rounded-md bg-surface/70 p-2">
                                      <span className="font-semibold text-foreground">POM:</span> {update.repositoryLearningUsed.pageObjectModel ? "Enabled" : "Not detected"}
                                    </div>
                                    <div className="rounded-md bg-surface/70 p-2">
                                      <span className="font-semibold text-foreground">Style:</span> {update.repositoryLearningUsed.testStyle}
                                    </div>
                                    <div className="rounded-md bg-surface/70 p-2">
                                      <span className="font-semibold text-foreground">Naming:</span> {update.repositoryLearningUsed.namingPattern}
                                    </div>
                                    <div className="rounded-md bg-surface/70 p-2">
                                      <span className="font-semibold text-foreground">Repo Match:</span> {update.repositoryLearningUsed.repositoryMatchScore}%
                                    </div>
                                    <div className="rounded-md bg-surface/70 p-2">
                                      <span className="font-semibold text-foreground">Confidence:</span> {update.repositoryLearningUsed.overallConfidence}%
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                                <MiniStat label="Repo Match" value={`${update.repositoryMatchScore ?? update.qualityReport?.repositoryStyleMatch ?? update.confidenceScore}%`} />
                                <MiniStat label="Locator" value={`${update.locatorConfidence ?? update.qualityReport?.locatorQuality ?? update.confidenceScore}%`} />
                                <MiniStat label="Assertion" value={`${update.assertionConfidence ?? update.qualityReport?.assertionQuality ?? update.confidenceScore}%`} />
                                <MiniStat label="Coverage" value={`${update.businessCoverageScore ?? update.qualityReport?.businessCoverage ?? update.confidenceScore}%`} />
                                <MiniStat label="Stability" value={`${update.estimatedStabilityScore ?? update.qualityReport?.estimatedExecutionStability ?? update.confidenceScore}%`} />
                              </div>
                              <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3">
                                <div className="rounded-md bg-background/70 p-2">
                                  <span className="font-semibold text-foreground">Framework:</span> {update.repositoryContextSummary?.framework ?? "Playwright"}
                                </div>
                                <div className="rounded-md bg-background/70 p-2">
                                  <span className="font-semibold text-foreground">Locators:</span> {update.repositoryContextSummary?.locatorStrategy ?? "Stable locators"}
                                </div>
                                <div className="rounded-md bg-background/70 p-2">
                                  <span className="font-semibold text-foreground">Assertions:</span> {update.repositoryContextSummary?.assertionStyle ?? "Business assertions"}
                                </div>
                              </div>
                              {update.qualityReport ? (
                                <div className="mt-3 grid gap-3 md:grid-cols-2">
                                  <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Potential Risks</p>
                                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                                      {(update.qualityReport.potentialRisks.length ? update.qualityReport.potentialRisks : ["No major generation risks detected."]).map((risk) => (
                                        <li key={risk}>- {risk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Recommendations</p>
                                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                                      {(update.qualityReport.recommendations.length ? update.qualityReport.recommendations : ["Run validation before creating a pull request."]).map((recommendation) => (
                                        <li key={recommendation}>- {recommendation}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="mt-3 grid gap-3 lg:grid-cols-2">
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Old Code</p>
                                <pre className="max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{update.oldCode || "New file"}</pre>
                              </div>
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">New Proposed Code</p>
                                <pre className="max-h-56 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{update.newCode}</pre>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={() => updateTestUpdateStatus(update.id, "approve")}>Approve</Button>
                              <Button variant="outline" size="sm" onClick={() => updateTestUpdateStatus(update.id, "reject")}>Reject</Button>
                              <Button variant="outline" size="sm" onClick={() => updateTestUpdateStatus(update.id, "regenerate")}>Regenerate</Button>
                              <Button variant="outline" size="sm" onClick={() => editTestUpdate(update)}>Edit Code</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">Validation</p>
                          <p className="mt-1 text-sm text-muted-foreground">Validation runs against approved proposed updates before PR creation.</p>
                        </div>
                        {validationRun && (
                          <Badge variant="outline" className={validationStatusClass(validationRun.status)}>
                            {validationRun.status}
                          </Badge>
                        )}
                      </div>
                      {validationRun ? (
                        <div className="mt-4 space-y-3">
                          <div className={cn("rounded-xl border p-4 text-sm", validationStatusClass(validationRun.status))}>
                            {validationInProgress
                              ? validationRun.validationProvider === "github-actions"
                                ? "Validation is running in GitHub Actions. AI QA Copilot created a validation branch, pushed approved updates, and is polling the workflow result."
                                : "Validation is running. AI QA Copilot is preparing the automation repository, applying approved updates, and executing Playwright tests."
                              : validationPassed
                                ? (
                                  <div>
                                    <p className="font-semibold">Validation completed successfully.</p>
                                    <p className="mt-1">All Playwright tests passed.</p>
                                    <p className="mt-1">The generated automation is ready for pull request review.</p>
                                  </div>
                                )
                                : "Validation completed with failures. Review the failed tests, logs, and AI recommendation before creating a pull request."}
                          </div>
                          {validationInProgress ? (
                            <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="font-semibold">Validation Progress</p>
                                  <p className="mt-1 text-sm text-muted-foreground">{validationModeDescription(validationRun.validationMode ?? validationMode)}</p>
                                </div>
                                <Badge variant="outline" className={validationStatusClass(validationQueueStatus)}>{validationQueueStatus}</Badge>
                              </div>
                              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <MiniStat label="Progress" value={`${validationProgressPercent}%`} />
                                <MiniStat label="Elapsed" value={validationElapsed} />
                                <MiniStat label="Estimated Time" value={validationModeEstimate(validationRun.validationMode ?? validationMode)} />
                                <MiniStat label="Queue Position" value={validationQueueStatus === "Queued" ? "1" : "-"} />
                              </div>
                              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${validationProgressPercent}%` }} />
                              </div>
                              <div className="mt-4 grid gap-2 md:grid-cols-7">
                                {validationProgressStages.map((stage, index) => {
                                  const completedIndex = validationRun.validationStageTimings?.filter((item) => item.status === "Passed" || item.status === "Skipped").length ?? 0;
                                  const isActive = index === Math.min(completedIndex, validationProgressStages.length - 1);
                                  const isDone = index < completedIndex;
                                  return (
                                    <div key={stage} className={cn(
                                      "rounded-lg border p-2 text-center text-xs font-semibold",
                                      isDone && "border-success/30 bg-success/10 text-success",
                                      isActive && !isDone && "border-primary/30 bg-primary/10 text-primary",
                                      !isDone && !isActive && "border-border/40 bg-surface/40 text-muted-foreground",
                                    )}>
                                      {stage}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <ValidationMetricCard icon={ShieldCheck} label="Status" value={validationRun.status} tone={validationPassed ? "success" : validationInProgress ? "primary" : validationRun.failed > 0 ? "danger" : "muted"} />
                            <ValidationMetricCard icon={ListChecks} label="Total Tests" value={String(validationRun.totalTests)} />
                            <ValidationMetricCard icon={CheckCircle2} label="Passed" value={String(validationRun.passed)} tone="success" />
                            <ValidationMetricCard icon={XCircle} label="Failed" value={String(validationRun.failed)} tone={validationRun.failed > 0 ? "danger" : "muted"} />
                            <ValidationMetricCard icon={AlertTriangle} label="Skipped" value={String(validationRun.skipped)} tone={validationRun.skipped > 0 ? "warning" : "muted"} />
                            <ValidationMetricCard icon={Clock} label="Duration" value={formatValidationDuration(validationRun.duration)} />
                            <ValidationMetricCard icon={Monitor} label="Browser" value={validationBrowser} />
                            <ValidationMetricCard icon={Database} label="Environment" value={validationRun.environment || "-"} />
                            <ValidationMetricCard icon={Gauge} label="Validation Mode" value={formatValidationMode(validationRun.validationMode)} tone="primary" />
                            <ValidationMetricCard icon={Cloud} label="Validation Provider" value={validationProvider} tone="primary" />
                          </div>
                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <CopyableValue label="Repository" value={validationRepository} href={validationRepoUrl || undefined} />
                            <CopyableValue label="Validation Branch" value={validationRun.validationBranchName || "-"} href={validationBranchUrl} />
                            <CopyableValue label="Workflow Run ID" value={validationRun.workflowRunId ? String(validationRun.workflowRunId) : "-"} href={validationRun.workflowRunUrl} />
                            <CopyableValue label="Workflow URL" value={validationRun.workflowRunUrl || "-"} href={validationRun.workflowRunUrl} />
                          </div>
                          {validationRun.validationProvider === "github-actions" ? (
                            <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold">GitHub Actions Workflow</p>
                                  <p className="mt-1 text-sm text-muted-foreground">Validation is executed in the connected automation repository, not on the Render backend.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {validationRun.workflowRunUrl ? (
                                    <a
                                      className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5"
                                      href={validationRun.workflowRunUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <ExternalLink className="size-4" />
                                      Open Workflow
                                    </a>
                                  ) : null}
                                  {validationBranchUrl ? (
                                    <a
                                      className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5"
                                      href={validationBranchUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <GitBranch className="size-4" />
                                      Open Branch
                                    </a>
                                  ) : null}
                                  {validationRun.reportUrl ? (
                                    <a
                                      className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5"
                                      href={validationRun.reportUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <ExternalLink className="size-4" />
                                      View HTML Report
                                    </a>
                                  ) : (
                                    <Badge variant="outline" className="bg-card">HTML report will be available after successful report generation.</Badge>
                                  )}
                                  <Button variant="outline" size="sm" onClick={downloadValidationJson} disabled={!validationRun.jsonReportData}>
                                    <Download className="size-4" />
                                    Download JSON Report
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <MiniStat label="Workflow Run ID" value={validationRun.workflowRunId ? String(validationRun.workflowRunId) : "-"} />
                                <MiniStat label="Workflow Status" value={validationRun.workflowStatus || "-"} />
                                <MiniStat label="Conclusion" value={validationRun.workflowConclusion || "-"} />
                                <MiniStat label="Commit SHA" value={validationRun.workflowCommitSha ? validationRun.workflowCommitSha.slice(0, 12) : "-"} />
                              </div>
                            </div>
                          ) : null}
                          {validationRun.validationStageTimings?.length ? (
                            <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold">Validation Performance</p>
                                  <p className="mt-1 text-sm text-muted-foreground">Stage timing from GitHub Actions validation.</p>
                                </div>
                                <Badge variant="outline">{formatValidationDuration(validationRun.duration)} total</Badge>
                              </div>
                              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <MiniStat label="Cache Hit" value={validationCacheHit ? "Yes" : "No / warming"} />
                                <MiniStat label="Browser Install" value={validationBrowserInstallSkipped ? "Skipped" : "Installed"} />
                                <MiniStat label="Test Execution" value={formatValidationDuration(validationTestExecutionDuration)} />
                                <MiniStat label="Mode" value={validationRun.validationMode ?? "quick"} />
                              </div>
                              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {validationRun.validationStageTimings.map((stage, index) => {
                                  const percent = Math.min(100, Math.max(8, validationRun.duration ? Math.round((stage.duration / validationRun.duration) * 100) : 8));
                                  return (
                                    <div key={`${stage.stage}-${index}`} className="rounded-lg border border-border/40 bg-surface/50 p-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold">{stage.stage}</p>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            stage.status === "Passed" && "border-success/30 bg-success/10 text-success",
                                            stage.status === "Failed" && "border-destructive/30 bg-destructive/10 text-destructive",
                                            stage.status === "Skipped" && "border-warning/30 bg-warning/10 text-warning",
                                          )}
                                        >
                                          {stage.status}
                                        </Badge>
                                      </div>
                                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                                        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                                      </div>
                                      <p className="mt-2 text-xs text-muted-foreground">{formatValidationDuration(stage.duration)}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/40 bg-card/70 p-3 text-sm">
                            <span className="font-semibold">Command:</span>
                            <code className="break-all rounded bg-slate-950 px-2 py-1 text-xs text-slate-100">{validationRun.command || "npx playwright test --reporter=json,html --workers=1"}</code>
                            {validationRun.workflowRunUrl ? (
                              <a
                                className="ml-auto inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5"
                                href={validationRun.workflowRunUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="size-4" />
                                View GitHub Actions Run
                              </a>
                            ) : validationRun.reportUrl ? (
                              <a
                                className="ml-auto inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/5"
                                href={validationRun.reportUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="size-4" />
                                View HTML Report
                              </a>
                            ) : (
                              <Badge variant="outline" className="ml-auto">HTML report will be available after successful report generation.</Badge>
                            )}
                          </div>
                          {validationRun.failedTestNames?.length ? (
                            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                              <p className="text-sm font-semibold text-destructive">Failed Tests</p>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
                                {validationRun.failedTestNames.map((name) => <li key={name}>{name}</li>)}
                              </ul>
                            </div>
                          ) : null}
                          {validationRun.failedTests?.length ? (
                            <div className="overflow-hidden rounded-lg border border-border/40 bg-card/70">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
                                  <tr>
                                    <th className="px-3 py-2">Test File</th>
                                    <th className="px-3 py-2">Test Name</th>
                                    <th className="px-3 py-2">Error Message</th>
                                    <th className="px-3 py-2">Duration</th>
                                    <th className="px-3 py-2">Suggested Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                  {validationRun.failedTests.map((test, index) => (
                                    <tr key={`${test.testFile}-${test.testName}-${index}`}>
                                      <td className="max-w-[180px] break-words px-3 py-2 font-mono text-xs">{test.testFile}</td>
                                      <td className="px-3 py-2 font-medium">{test.testName}</td>
                                      <td className="max-w-sm break-words px-3 py-2 text-destructive">{test.errorMessage}</td>
                                      <td className="px-3 py-2">{formatValidationDuration(test.duration)}</td>
                                      <td className="px-3 py-2 text-muted-foreground">{test.suggestedAction}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                          {validationRun.errorDetails && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{validationRun.errorDetails}</p>}
                          {(validationRun.aiFailureExplanation || validationRun.failureExplanation) && (
                            <p className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
                              {validationRun.aiFailureExplanation || validationRun.failureExplanation}
                            </p>
                          )}
                          <div className="grid gap-3 md:grid-cols-3">
                            <MiniStat label="Screenshots" value={String(validationRun.screenshots?.length ?? 0)} />
                            <MiniStat label="Videos" value={String(validationRun.videos?.length ?? 0)} />
                            <MiniStat label="Traces" value={String(validationRun.traceFiles?.length ?? 0)} />
                          </div>
                          <div className="grid gap-3 lg:grid-cols-2">
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">stdout</p>
                              <pre className="max-h-52 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{validationRun.stdout || validationRun.logs || "No stdout captured."}</pre>
                            </div>
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">stderr</p>
                              <pre className="max-h-52 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{validationRun.stderr || "No stderr captured."}</pre>
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Validation Summary Log</p>
                            <pre className="max-h-52 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{validationRun.logs}</pre>
                          </div>
                          {validationRun.validationDebugLogs?.length ? (
                            <details className="rounded-lg border border-border/40 bg-card/70 p-3">
                              <summary className="cursor-pointer text-sm font-semibold">
                                {validationRun.validationProvider === "github-actions" ? "GitHub Actions Job Steps" : "Validation Debug Logs"}
                              </summary>
                              <div className="mt-3 space-y-3">
                                {validationRun.validationDebugLogs.map((step, index) => (
                                  <div key={`${step.stepName}-${index}`} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <p className="font-semibold">{step.stepName}</p>
                                        <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{step.command}</p>
                                      </div>
                                      <Badge
                                        className={cn(
                                          step.status === "Passed" && "border-success/30 bg-success/10 text-success",
                                          step.status === "Failed" && "border-destructive/30 bg-destructive/10 text-destructive",
                                          step.status === "Skipped" && "border-warning/30 bg-warning/10 text-warning",
                                        )}
                                        variant="outline"
                                      >
                                        {step.status}
                                      </Badge>
                                    </div>
                                    {validationRun.validationProvider === "github-actions" || step.validationProvider === "github-actions" ? (
                                      <div className="mt-3 grid gap-2 text-xs md:grid-cols-2 xl:grid-cols-4">
                                        <MiniStat label="Workflow Run ID" value={step.workflowRunId ? String(step.workflowRunId) : validationRun.workflowRunId ? String(validationRun.workflowRunId) : "-"} />
                                        <MiniStat label="Workflow Status" value={step.workflowStatus || validationRun.workflowStatus || "-"} />
                                        <MiniStat label="Conclusion" value={step.workflowConclusion || validationRun.workflowConclusion || "-"} />
                                        <MiniStat label="Branch" value={step.branch || validationRun.validationBranchName || "-"} />
                                        <MiniStat label="Commit" value={step.commitSha ? step.commitSha.slice(0, 12) : validationRun.workflowCommitSha ? validationRun.workflowCommitSha.slice(0, 12) : "-"} />
                                        <MiniStat label="Job" value={step.jobName || "-"} />
                                        <MiniStat label="Started" value={step.startedAt ? new Date(step.startedAt).toLocaleTimeString() : "-"} />
                                        <MiniStat label="Completed" value={step.completedAt ? new Date(step.completedAt).toLocaleTimeString() : "-"} />
                                      </div>
                                    ) : (
                                      <div className="mt-3 grid gap-2 text-xs md:grid-cols-2 xl:grid-cols-4">
                                        <MiniStat label="Exit Code" value={String(step.exitCode)} />
                                        <MiniStat label="Working Directory" value={step.workingDirectory || "-"} />
                                        <MiniStat label="Repository Path" value={step.repositoryPath || "-"} />
                                        <MiniStat label="Node" value={step.nodeVersion || "-"} />
                                        <MiniStat label="npm" value={step.npmVersion || "-"} />
                                        <MiniStat label="package.json" value={step.packageJsonExists ? "Yes" : "No"} />
                                        <MiniStat label="package-lock.json" value={step.packageLockExists ? "Yes" : "No"} />
                                        <MiniStat label="playwright.config.ts" value={step.playwrightConfigTsExists ? "Yes" : "No"} />
                                        <MiniStat label="node_modules" value={step.nodeModulesExists ? "Yes" : "No"} />
                                        <MiniStat label="@playwright/test" value={step.playwrightTestInstalled ? "Yes" : "No"} />
                                      </div>
                                    )}
                                    {(validationRun.validationProvider === "github-actions" || step.validationProvider === "github-actions") && step.jobUrl ? (
                                      <a className="mt-3 inline-flex text-xs font-semibold text-primary underline" href={step.jobUrl} target="_blank" rel="noreferrer">
                                        Open job logs
                                      </a>
                                    ) : null}
                                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                                      <div>
                                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">stdout</p>
                                        <pre className="max-h-44 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{step.stdout || "No stdout captured."}</pre>
                                      </div>
                                      <div>
                                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">stderr</p>
                                        <pre className="max-h-44 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{step.stderr || "No stderr captured."}</pre>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          ) : null}
                          {validationRun.stackTrace && (
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Stack Trace</p>
                              <pre className="max-h-52 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{validationRun.stackTrace}</pre>
                            </div>
                          )}
                          {validationRun.jsonReportData ? (
                            <details className="rounded-lg border border-border/40 bg-card/70 p-3">
                              <summary className="cursor-pointer text-sm font-semibold">Raw JSON Report</summary>
                              <pre className="mt-3 max-h-72 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
                                {JSON.stringify(validationRun.jsonReportData, null, 2)}
                              </pre>
                            </details>
                          ) : null}
                          {validationRun.failed > 0 && (
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" onClick={generateFixSuggestion}>Generate AI Failure Explanation</Button>
                              {fixSuggestion && <p className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">{fixSuggestion}</p>}
                            </div>
                          )}
                          {validationRun.failed > 0 && (
                            <Card className="app-card p-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <h4 className="font-semibold">AI Failure Analysis</h4>
                                  <p className="mt-1 text-sm text-muted-foreground">Failure classification, root cause, suggested fixes, and QA next steps.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" onClick={() => runFailureAnalysis(false)} disabled={isFailureAnalysisLoading}>
                                    {isFailureAnalysisLoading ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
                                    Analyze Failure with AI
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => runFailureAnalysis(true)} disabled={isFailureAnalysisLoading || !failureAnalysis}>
                                    <RefreshCw className="size-4" />
                                    Regenerate Analysis
                                  </Button>
                                </div>
                              </div>
                              {failureAnalysis ? (
                                <div className="mt-4 space-y-4">
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">{failureAnalysis.failureType ?? failureAnalysis.category}</Badge>
                                    <Badge variant="outline" className={failureAnalysis.riskLevel === "High" ? "border-red-200 bg-red-50 text-red-700" : failureAnalysis.riskLevel === "Medium" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
                                      {failureAnalysis.riskLevel} Risk
                                    </Badge>
                                    <Badge variant="outline" className={failureAnalysis.confidenceScore >= 85 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : failureAnalysis.confidenceScore >= 70 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}>
                                      {failureAnalysis.confidenceScore >= 85 ? "High" : failureAnalysis.confidenceScore >= 70 ? "Medium" : "Low"} Confidence
                                    </Badge>
                                    <Badge variant="outline">Auto Fix Possible: {failureAnalysis.autoFixAvailable ? "Yes" : "No"}</Badge>
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-4">
                                    <MiniStat label="Failure Type" value={failureAnalysis.failureType ?? failureAnalysis.category} />
                                    <MiniStat label="Affected Module" value={failureAnalysis.affectedModule} />
                                    <MiniStat label="Confidence" value={`${failureAnalysis.confidenceScore}%`} />
                                    <MiniStat label="AI Model" value={failureAnalysis.aiModel} />
                                  </div>
                                  <div className="grid gap-3 lg:grid-cols-2">
                                    <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                                      <p className="text-xs font-semibold uppercase text-muted-foreground">Summary</p>
                                      <p className="mt-2 text-sm">{failureAnalysis.summary ?? failureAnalysis.rootCause}</p>
                                    </div>
                                    <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                                      <p className="text-xs font-semibold uppercase text-muted-foreground">Root Cause</p>
                                      <p className="mt-2 text-sm">{failureAnalysis.rootCause}</p>
                                    </div>
                                  </div>
                                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                    <p className="text-xs font-semibold uppercase text-primary">Recommended Fix</p>
                                    <p className="mt-2 text-sm text-muted-foreground">{failureAnalysis.recommendedFix}</p>
                                  </div>
                                  {failureAnalysis.failedTests?.length ? (
                                    <div className="space-y-3">
                                      <p className="text-sm font-semibold">Failed Tests</p>
                                      {failureAnalysis.failedTests.map((test, index) => (
                                        <div key={`${test.testFile}-${test.testName}-${index}`} className="rounded-lg border border-border/40 bg-card/70 p-4">
                                          <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                              <p className="font-mono text-sm font-semibold">{test.testFile}</p>
                                              <p className="mt-1 text-sm text-muted-foreground">{test.testName}</p>
                                            </div>
                                            <Badge variant="outline">Retry {test.retryCount ?? 0}</Badge>
                                          </div>
                                          <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{test.errorMessage}</p>
                                          <p className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">{test.suggestedFix}</p>
                                          <div className="mt-3 flex flex-wrap gap-2">
                                            {test.screenshotUrl && <a className="text-xs font-semibold text-primary underline" href={test.screenshotUrl} target="_blank" rel="noreferrer">Screenshot</a>}
                                            {test.videoUrl && <a className="text-xs font-semibold text-primary underline" href={test.videoUrl} target="_blank" rel="noreferrer">Video</a>}
                                            {test.traceUrl && <a className="text-xs font-semibold text-primary underline" href={test.traceUrl} target="_blank" rel="noreferrer">Trace</a>}
                                          </div>
                                          {test.stackTrace && (
                                            <details className="mt-3 rounded-md border border-border/40 p-3">
                                              <summary className="cursor-pointer text-sm font-semibold">Stack trace</summary>
                                              <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{test.stackTrace}</pre>
                                            </details>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}
                                  {failureAnalysis.recommendedActions?.length ? (
                                    <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                                      <p className="text-sm font-semibold">Recommended Actions</p>
                                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        {failureAnalysis.recommendedActions.map((action) => <li key={action}>- {action}</li>)}
                                      </ul>
                                    </div>
                                  ) : null}
                                  <div className="rounded-lg border border-border/40 bg-card/70 p-4">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">QA Owner Action</p>
                                    <p className="mt-2 text-sm">{failureAnalysis.qaOwnerAction ?? "Review failed tests and retry validation after targeted fixes."}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        void navigator.clipboard.writeText([
                                          failureAnalysis.summary,
                                          failureAnalysis.rootCause,
                                          failureAnalysis.recommendedFix,
                                        ].filter(Boolean).join("\n\n"));
                                        toast.success("Failure summary copied");
                                      }}
                                    >
                                      <Copy className="size-4" />
                                      Copy Summary
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>Create Jira Bug · Coming Soon</Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateAutoFix(false)}
                                      disabled={isAutoFixLoading || !failureAnalysis.autoFixAvailable || failureAnalysis.confidenceScore < 75}
                                    >
                                      {isAutoFixLoading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
                                      Generate AI Fix
                                    </Button>
                                  </div>
                                  {failureAnalysis.autoFixAvailable && (
                                    <div className="rounded-lg border border-dashed border-border/50 p-3 text-xs text-muted-foreground">
                                      AI Auto Fix will generate targeted Playwright changes for review. Nothing is committed until you approve it.
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="mt-4 rounded-lg border border-dashed border-border/50 p-4 text-sm text-muted-foreground">
                                  No AI failure analysis yet. Run analysis to classify the failure and generate QA recommendations.
                                </p>
                              )}
                            </Card>
                          )}
                          {autoFixes.length > 0 && (
                            <Card className="app-card p-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <h4 className="font-semibold">AI Auto Fix</h4>
                                  <p className="mt-1 text-sm text-muted-foreground">Review repository-aware Playwright fixes before committing them to the validation branch.</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" onClick={() => generateAutoFix(true)} disabled={isAutoFixLoading}>
                                    {isAutoFixLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                                    Regenerate Fix
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => updateAllAutoFixes("approve")} disabled={isAutoFixLoading}>Approve All</Button>
                                  <Button variant="outline" size="sm" onClick={() => updateAllAutoFixes("reject")} disabled={isAutoFixLoading}>Reject All</Button>
                                  <Button size="sm" onClick={() => updateAllAutoFixes("commit")} disabled={isAutoFixLoading || !autoFixes.some((fix) => fix.status === "Approved" && !fix.committed)}>
                                    {isAutoFixLoading ? <Loader2 className="size-4 animate-spin" /> : <GitBranch className="size-4" />}
                                    Commit Approved
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-4 space-y-4">
                                {autoFixes.map((fix) => (
                                  <div key={fix.id} className="rounded-lg border border-border/40 bg-card/70 p-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <p className="font-mono text-sm font-semibold">{fix.filePath ?? fix.testFilePath}</p>
                                        <p className="mt-1 text-sm text-muted-foreground">{fix.fixSummary}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">{fix.status}</Badge>
                                        <Badge variant="outline">{fix.fixType ?? "AI Fix"}</Badge>
                                        <Badge variant="outline">{fix.confidenceScore}% confidence</Badge>
                                        <Badge variant="outline">{fix.repositoryMatchScore ?? 82}% repo match</Badge>
                                      </div>
                                    </div>
                                    {fix.explanation && <p className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">{fix.explanation}</p>}
                                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                                      <div>
                                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Current Code</p>
                                        <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{fix.beforeCode ?? fix.oldCode}</pre>
                                      </div>
                                      <div>
                                        <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">AI Suggested Fix</p>
                                        <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-emerald-100">{fix.afterCode ?? fix.fixedCode}</pre>
                                      </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <Button variant="outline" size="sm" onClick={() => updateAutoFixStatus(fix, "approve")}>Approve Fix</Button>
                                      <Button variant="outline" size="sm" onClick={() => updateAutoFixStatus(fix, "reject")}>Reject Fix</Button>
                                      <Button variant="outline" size="sm" onClick={() => updateAutoFixStatus(fix, "edit")}>Edit Fix</Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          void navigator.clipboard.writeText(fix.afterCode ?? fix.fixedCode);
                                          toast.success("AI fix copied");
                                        }}
                                      >
                                        <Copy className="size-4" />
                                        Copy Fix
                                      </Button>
                                    </div>
                                    {fix.committed && <p className="mt-3 text-xs font-semibold text-emerald-600">Committed to {fix.branch ?? validationRun.validationBranchName}</p>}
                                  </div>
                                ))}
                              </div>
                            </Card>
                          )}
                          <Card className="app-card p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h4 className="font-semibold">Auto Retry Validation</h4>
                                <p className="mt-1 text-sm text-muted-foreground">Retry failed Playwright tests only, preserve evidence, and detect flaky failures.</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" onClick={() => retryValidation(false)} disabled={isRetryingValidation || retryAttempts.length >= 3 || validationRun.failed === 0}>
                                  {isRetryingValidation ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                                  Retry Failed Tests
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => retryValidation(true)} disabled={isRetryingValidation || retryAttempts.length >= 3 || !autoFixes.some((fix) => fix.committed || fix.status === "Committed")}>
                                  <GitBranch className="size-4" />
                                  Retry After AI Auto Fix
                                </Button>
                              </div>
                            </div>
                            {retryRecommendation && (
                              <div className="mt-4 rounded-lg border border-border/40 bg-card/70 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" className={retryRecommendation.retryRecommendation === "Recommended" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : retryRecommendation.retryRecommendation === "With Caution" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}>
                                    Retry {retryRecommendation.retryRecommendation}
                                  </Badge>
                                  <Badge variant="outline">{retryRecommendation.failureType}</Badge>
                                  <Badge variant="outline">{retryAttempts.length} / {retryRecommendation.maxRetries} retries used</Badge>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground">{retryRecommendation.reason}</p>
                                {retryRecommendation.testFiles.length > 0 && (
                                  <p className="mt-2 font-mono text-xs text-muted-foreground">Failed files: {retryRecommendation.testFiles.join(", ")}</p>
                                )}
                              </div>
                            )}
                            <div className="mt-4 grid gap-3 md:grid-cols-4">
                              <MiniStat label="Total Retries" value={retryAttempts.length} />
                              <MiniStat label="Retry Success" value={`${retryAttempts.filter((attempt) => attempt.status === "Passed").length}/${retryAttempts.length || 0}`} />
                              <MiniStat label="Flaky Detected" value={retryAttempts.filter((attempt) => attempt.flakyDetected).length} />
                              <MiniStat label="Consistent Failures" value={retryAttempts.filter((attempt) => attempt.status === "Failed" && !attempt.flakyDetected).length} />
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <div className="rounded-lg border border-border/40 bg-card/70 p-3">
                                <p className="text-xs font-semibold uppercase text-muted-foreground">Attempt 1</p>
                                <p className="mt-2 font-semibold">{validationRun.status}</p>
                                <p className="mt-1 text-xs text-muted-foreground">Passed {validationRun.passed} / Failed {validationRun.failed} / Skipped {validationRun.skipped}</p>
                              </div>
                              {retryAttempts.map((attempt) => (
                                <div key={attempt.id} className="rounded-lg border border-border/40 bg-card/70 p-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs font-semibold uppercase text-muted-foreground">Attempt {attempt.attemptNumber}</p>
                                    {attempt.flakyDetected ? <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">Potentially Flaky</Badge> : attempt.status === "Failed" ? <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Consistent Failure</Badge> : null}
                                  </div>
                                  <p className="mt-2 font-semibold">{attempt.status}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">Passed {attempt.passed} / Failed {attempt.failed} / Skipped {attempt.skipped}</p>
                                  <p className="mt-1 text-xs text-muted-foreground">{attempt.retryType?.replaceAll("_", " ") ?? "manual"} · {attempt.retryRecommendation ?? "With Caution"}</p>
                                  {attempt.testFiles?.length ? <p className="mt-2 font-mono text-[11px] text-muted-foreground">{attempt.testFiles.join(", ")}</p> : null}
                                  {attempt.workflowUrl && <a className="mt-2 inline-block text-xs font-semibold text-primary underline" href={attempt.workflowUrl} target="_blank" rel="noreferrer">Open workflow</a>}
                                </div>
                              ))}
                            </div>
                          </Card>
                          <div className={`rounded-lg border p-4 ${
                            validationRecommendation?.releaseRecommendation === "Safe to Merge"
                              ? "border-success/30 bg-success/10"
                              : validationRecommendation?.releaseRecommendation === "Do Not Merge"
                                ? "border-destructive/30 bg-destructive/10"
                                : "border-warning/30 bg-warning/10"
                          }`}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold">AI Recommendation</p>
                                <p className="mt-1 text-sm text-muted-foreground">Decision support generated from validation results, impact analysis, and approved test updates.</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isRecommendationLoading}
                                onClick={() => impactAnalysis && loadValidationRecommendation(impactAnalysis.id, true)}
                              >
                                {isRecommendationLoading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                                Regenerate AI Recommendation
                              </Button>
                            </div>
                            {validationRecommendation ? (
                              <div className="mt-4 space-y-4">
                                <div className="grid gap-3 md:grid-cols-4">
                                  <MiniStat label="Confidence" value={`${validationRecommendation.confidenceScore}%`} />
                                  <MiniStat label="Risk Level" value={validationRecommendation.riskLevel} />
                                  <MiniStat label="Recommendation" value={validationRecommendation.releaseRecommendation} />
                                  <MiniStat label="Merge Decision" value={validationRecommendation.mergeDecision} />
                                </div>
                                <p className="rounded-md border border-border/40 bg-card/70 p-3 text-sm">{validationRecommendation.summary}</p>
                                <div className="grid gap-4 lg:grid-cols-2">
                                  <div>
                                    <p className="mb-2 text-sm font-semibold">Reasons</p>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                      {validationRecommendation.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="mb-2 text-sm font-semibold">Recommended Actions</p>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                      {validationRecommendation.recommendedActions.map((action) => <li key={action}>{action}</li>)}
                                    </ul>
                                  </div>
                                </div>
                                <div className="rounded-md border border-border/40 bg-card/70 p-3">
                                  <p className="text-xs font-semibold uppercase text-muted-foreground">QA Owner Action</p>
                                  <p className="mt-1 text-sm">{validationRecommendation.qaOwnerAction}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-4 rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                                {isRecommendationLoading
                                  ? "Generating AI recommendation from validation result..."
                                  : "AI recommendation could not be generated yet. Validation result is still available."}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                          No validation run yet. Approve test updates and run validation.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ChangedFilesTable({ files }: { files: RepositoryActivity["changedFiles"] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2">File Path</th>
            <th className="px-3 py-2">Change</th>
            <th className="px-3 py-2">Additions</th>
            <th className="px-3 py-2">Deletions</th>
            <th className="px-3 py-2">Module</th>
            <th className="px-3 py-2">Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {files.map((file) => (
            <tr key={`${file.filePath}-${file.changeType}`}>
              <td className="px-3 py-2 font-mono text-xs">{file.filePath}</td>
              <td className="px-3 py-2">{file.changeType}</td>
              <td className="px-3 py-2">{file.additions ?? "-"}</td>
              <td className="px-3 py-2">{file.deletions ?? "-"}</td>
              <td className="px-3 py-2">{file.possibleModule ?? "-"}</td>
              <td className="px-3 py-2"><Badge variant="outline">{file.riskLevel ?? "Low"}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AIProvidersSettings({
  workspaceId,
  role,
  settings,
  usage,
  isLoading,
  onRefresh,
}: {
  workspaceId: string;
  role: WorkspaceRole;
  settings: AIProviderSettingsResponse | null;
  usage: AIProviderUsageLog[];
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const canManage = role === "Owner" || role === "Admin";
  const canView = canManage || role === "QA Lead";
  const [form, setForm] = useState<SaveAIProviderInput>({
    workspaceId,
    providerType: "openai",
    providerName: "",
    apiKey: "",
    modelName: "",
    baseUrl: "",
    endpointUrl: "",
    deploymentName: "",
    apiVersion: "",
    requestFormat: "OpenAI Compatible",
    temperature: 0.2,
    maxTokens: 4000,
    isActive: true,
    fallbackToDefault: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm((value) => ({ ...value, workspaceId }));
  }, [workspaceId]);

  if (!canView) {
    return (
      <Card className="app-card p-8 text-center">
        <ShieldCheck className="mx-auto mb-3 size-8 text-muted-foreground" />
        <h2 className="font-semibold">AI provider settings are restricted</h2>
        <p className="mt-2 text-sm text-muted-foreground">Only Owner, Admin, and QA Lead roles can view provider configuration.</p>
      </Card>
    );
  }

  const providers = settings?.providers ?? [];
  const customProviders = providers.filter((provider) => !provider.isDefault);
  const activeProvider = customProviders.find((provider) => provider.isActive) ?? providers.find((provider) => provider.isDefault);

  const saveProvider = async () => {
    if (!workspaceId) {
      toast.error("Workspace is required.");
      return;
    }
    if (!form.providerName.trim() || !form.modelName.trim()) {
      toast.error("Provider name and model name are required.");
      return;
    }
    try {
      setIsSaving(true);
      await projectApi.createAIProvider({ ...form, workspaceId });
      toast.success("AI provider saved");
      setForm((value) => ({ ...value, providerName: "", apiKey: "", modelName: "", baseUrl: "", endpointUrl: "", deploymentName: "", apiVersion: "" }));
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save AI provider");
    } finally {
      setIsSaving(false);
    }
  };

  const updateMapping = async (featureName: AIProviderFeatureName, providerId: string) => {
    const provider = providers.find((item) => item.id === providerId);
    try {
      await projectApi.updateAIProviderFeatureMapping(workspaceId, [{
        featureName,
        providerId,
        modelName: provider?.modelName,
        isActive: true,
      }]);
      toast.success("Feature mapping updated");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update mapping");
    }
  };

  return (
    <div className="space-y-5">
      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">AI Providers</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Configure which AI model provider AI QA Copilot should use for test case generation, AI chat, requirement analysis, Playwright generation, and impact analysis.
            </p>
          </div>
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />}
            Refresh
          </Button>
        </div>
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">Recommended</Badge>
            <p className="font-semibold">{activeProvider?.providerName ?? "AI QA Copilot Default AI"}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            If no active custom provider is configured, AI QA Copilot automatically uses the default AI provider already configured for the application.
          </p>
        </div>
      </Card>

      {canManage && (
        <Card className="app-card p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Add Provider</h3>
            <p className="mt-1 text-sm text-muted-foreground">API keys are encrypted and never displayed after saving.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input placeholder="Provider name" value={form.providerName} onChange={(event) => setForm((value) => ({ ...value, providerName: event.target.value }))} />
            <Select value={form.providerType} onValueChange={(providerType) => setForm((value) => ({ ...value, providerType: providerType as SaveAIProviderInput["providerType"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{providerTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Model name" value={form.modelName} onChange={(event) => setForm((value) => ({ ...value, modelName: event.target.value }))} />
            <Input type="password" placeholder="API key" value={form.apiKey} onChange={(event) => setForm((value) => ({ ...value, apiKey: event.target.value }))} />
            <Input placeholder={form.providerType === "azure-openai" ? "Endpoint URL" : "Base URL optional"} value={form.providerType === "azure-openai" ? form.endpointUrl : form.baseUrl} onChange={(event) => setForm((value) => form.providerType === "azure-openai" ? ({ ...value, endpointUrl: event.target.value }) : ({ ...value, baseUrl: event.target.value }))} />
            {form.providerType === "azure-openai" ? (
              <>
                <Input placeholder="Deployment name" value={form.deploymentName} onChange={(event) => setForm((value) => ({ ...value, deploymentName: event.target.value }))} />
                <Input placeholder="API version" value={form.apiVersion} onChange={(event) => setForm((value) => ({ ...value, apiVersion: event.target.value }))} />
              </>
            ) : null}
            <Input type="number" step="0.1" placeholder="Temperature" value={form.temperature} onChange={(event) => setForm((value) => ({ ...value, temperature: Number(event.target.value) }))} />
            <Input type="number" placeholder="Max tokens" value={form.maxTokens} onChange={(event) => setForm((value) => ({ ...value, maxTokens: Number(event.target.value) }))} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={saveProvider} disabled={isSaving}>
              {isSaving && <Loader2 className="size-4 animate-spin" />}
              Save Provider
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Card className="app-card p-6">
          <h3 className="font-semibold">Provider List</h3>
          <div className="grid gap-3">
            {providers.map((provider) => (
              <div key={provider.id} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{provider.providerName}</p>
                      {provider.isDefault && <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">Recommended</Badge>}
                      <Badge variant="outline" className={provider.isActive ? "border-success/40 bg-success/10 text-success" : "border-muted-foreground/40 bg-muted/40 text-muted-foreground"}>
                        {provider.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{provider.modelName} / {provider.providerType}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Key: {provider.apiKeyMasked || "Managed by AI QA Copilot"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Created by {provider.createdBy} · {formatDate(provider.createdAt)}</p>
                  </div>
                  {canManage && !provider.isDefault && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={async () => {
                        try {
                          await projectApi.testAIProvider(provider.id);
                          toast.success("AI provider connection successful");
                          onRefresh();
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "Connection failed");
                          onRefresh();
                        }
                      }}>Test</Button>
                      <Button size="sm" variant="outline" onClick={async () => {
                        await (provider.isActive ? projectApi.deactivateAIProvider(provider.id) : projectApi.activateAIProvider(provider.id));
                        toast.success(provider.isActive ? "Provider deactivated" : "Provider activated");
                        onRefresh();
                      }}>{provider.isActive ? "Deactivate" : "Activate"}</Button>
                      <Button size="sm" variant="ghost" onClick={async () => {
                        if (!window.confirm("Delete this AI provider?")) return;
                        await projectApi.deleteAIProvider(provider.id);
                        toast.success("Provider deleted");
                        onRefresh();
                      }}><Trash2 className="size-4" /></Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="app-card p-6">
          <h3 className="font-semibold">Security Notice</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            API keys are encrypted before saving, masked in the UI, and never exposed in API responses. Use Test Connection after saving a provider.
          </p>
          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-muted-foreground">
            Only Owner and Admin users can add, update, test, activate, or delete providers.
          </div>
        </Card>
      </div>

      <Card className="app-card p-6">
        <h3 className="font-semibold">Feature-Level Model Mapping</h3>
        <div className="mt-4 overflow-hidden rounded-lg border border-border/40">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {(settings?.featureMappings ?? []).map((mapping) => (
                <tr key={mapping.featureName}>
                  <td className="px-4 py-3 font-medium">{aiFeatureLabels[mapping.featureName]}</td>
                  <td className="px-4 py-3">
                    {canManage ? (
                      <Select value={mapping.providerId} onValueChange={(providerId) => updateMapping(mapping.featureName, providerId)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{providers.map((provider) => <SelectItem key={provider.id} value={provider.id}>{provider.providerName}</SelectItem>)}</SelectContent>
                      </Select>
                    ) : mapping.providerName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{mapping.modelName}</td>
                  <td className="px-4 py-3"><Badge variant="outline">{mapping.isActive ? "Active" : "Inactive"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="app-card p-6">
        <h3 className="font-semibold">Usage Logs</h3>
        <div className="mt-4 space-y-2">
          {usage.slice(0, 8).map((log) => (
            <div key={log.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/40 bg-surface/40 p-3 text-sm">
              <span>{aiFeatureLabels[log.featureName]} · {log.providerName} · {log.modelName}</span>
              <Badge variant="outline" className={log.status === "Success" ? "border-success/40 bg-success/10 text-success" : "border-destructive/40 bg-destructive/10 text-destructive"}>{log.status}</Badge>
              <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
            </div>
          ))}
          {!usage.length && <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">No AI provider usage has been logged yet.</p>}
        </div>
      </Card>
    </div>
  );
}

function LandingPage({
  onStart,
  onBookDemo,
  onPricing,
}: {
  onStart: () => void;
  onBookDemo: () => void;
  onPricing: () => void;
}) {
  const heroFeatures = [
    { icon: Sparkles, label: "AI Test Case Generation" },
    { icon: ClipboardCheck, label: "Manual Test Execution" },
    { icon: SearchCheck, label: "AI Impact Analysis" },
    { icon: ShieldCheck, label: "Review & Approval Workflow" },
    { icon: Code2, label: "Real Playwright Validation" },
    { icon: BarChart3, label: "Analytics & Reporting" },
    { icon: Users, label: "Team Collaboration" },
    { icon: GitBranch, label: "Repository Intelligence" },
  ];
  const challengeCards = [
    {
      title: "Manual Test Design",
      description: "Writing and maintaining test cases consumes significant QA effort across every sprint.",
      icon: FileText,
    },
    {
      title: "Requirement Changes",
      description: "Frequent requirement updates quickly make existing test cases outdated or incomplete.",
      icon: RefreshCw,
    },
    {
      title: "Limited Test Coverage",
      description: "Teams struggle to understand what has been tested, what is missing, and where quality risks exist.",
      icon: SearchCheck,
    },
    {
      title: "Review Bottlenecks",
      description: "Manual review and approval processes slow down QA readiness and delay releases.",
      icon: GitPullRequest,
    },
    {
      title: "Disconnected QA Tools",
      description: "Requirements, test cases, execution results, automation, and reports are often spread across multiple tools.",
      icon: Puzzle,
    },
    {
      title: "Automation Maintenance",
      description: "Existing Playwright automation requires constant updates as applications and repositories change.",
      icon: Code2,
    },
  ];
  const features = [
    {
      title: "AI Test Case Generation",
      description: "Generate positive, negative, edge, API, UI, regression scenarios, test data, and acceptance criteria from requirements.",
      icon: Wand2,
    },
    {
      title: "Review & Approval Workflow",
      description: "Submit, review, approve, reject, and lock official test case versions with governance.",
      icon: ClipboardList,
    },
    {
      title: "Manual Test Execution",
      description: "Create test runs, execute approved cases, track outcomes, capture evidence, and report execution status.",
      icon: ClipboardCheck,
    },
    {
      title: "Automation Repository Onboarding",
      description: "Connect, scan, initialize, and prepare Playwright repositories for AI-powered validation.",
      icon: Github,
      enterprise: true,
    },
    {
      title: "Repository Change Intelligence",
      description: "Monitor application repositories, capture changed files, map impacted tests, and suggest QA actions.",
      icon: GitBranch,
      enterprise: true,
    },
    {
      title: "Playwright Update Workflow",
      description: "Generate proposed test updates, review diffs, approve changes, and prepare pull requests.",
      icon: GitPullRequest,
      enterprise: true,
    },
    {
      title: "Real Playwright Validation",
      description: "Validate approved updates with GitHub Actions and review pass, fail, skipped, logs, and reports.",
      icon: ShieldCheck,
      enterprise: true,
    },
    {
      title: "AI Validation Recommendation",
      description: "Get confidence, risk, merge guidance, reasons, and QA actions after validation completes.",
      icon: Brain,
      enterprise: true,
    },
    {
      title: "Analytics Dashboard",
      description: "Track coverage, productivity, review queues, execution progress, exports, AI usage, and project health.",
      icon: BarChart3,
    },
    {
      title: "AI Providers / Bring Your Own AI",
      description: "Use AI QA Copilot default AI or connect OpenAI, Claude, Gemini, Groq, Azure OpenAI, OpenRouter, or custom providers.",
      icon: Sparkles,
      enterprise: true,
    },
    {
      title: "Team Workspace & Roles",
      description: "Manage team members, roles, permissions, project access, and governed workspace collaboration.",
      icon: Users,
    },
    {
      title: "Jira Integration",
      description: "Planned issue sync and traceability for enterprise QA workflows.",
      icon: Rocket,
      comingSoon: true,
    },
  ];
  const whyChoose = [
    {
      title: "Less Manual QA Effort",
      description: "Reduce repetitive test design, review preparation, execution tracking, and automation maintenance work.",
      icon: Rocket,
    },
    {
      title: "Safer Automation Changes",
      description: "Analyze repository changes, validate generated Playwright updates, and keep PRs review-ready.",
      icon: Gauge,
    },
    {
      title: "End-to-End QA Governance",
      description: "Bring generation, review, approval, execution, validation, and reporting into one controlled flow.",
      icon: ShieldCheck,
    },
    {
      title: "Higher Release Confidence",
      description: "Use coverage, execution, validation, and AI recommendations to make release decisions clearer.",
      icon: ClipboardCheck,
    },
    {
      title: "Team Collaboration",
      description: "Give QA engineers, leads, managers, and stakeholders one shared workspace for quality work.",
      icon: Users,
    },
    {
      title: "Management Visibility",
      description: "Make coverage, review progress, execution status, and team activity easier to track and communicate.",
      icon: BarChart3,
    },
  ];
  const workflowSteps = [
    {
      title: "Developer Pushes Code",
      description: "Application changes land in GitHub",
    },
    {
      title: "GitHub Webhook",
      description: "AI QA Copilot receives change events",
    },
    {
      title: "Repository Activity",
      description: "Changed files are captured",
    },
    {
      title: "AI Impact Analysis",
      description: "Identify quality and automation impact",
    },
    {
      title: "Test Mapping",
      description: "Map code changes to Playwright tests",
    },
    {
      title: "Generate Playwright Updates",
      description: "Create reviewed test update proposals",
    },
    {
      title: "Run Real Validation",
      description: "Run approved updates through GitHub Actions",
    },
    {
      title: "AI Recommendation",
      description: "Assess risk and merge readiness",
    },
    {
      title: "Create Pull Request",
      description: "Prepare production-ready PR",
    },
    {
      title: "QA Review",
      description: "Review, approve, and merge safely",
    },
  ];
  const integrations = [
    { title: "Jira Integration", description: "Issue traceability and QA workflow sync.", icon: Rocket, status: "Coming Soon" },
    { title: "GitHub Repository", description: "Analyze automation structure, generate Playwright files, and raise Pull Requests.", icon: Github, status: "Enterprise" },
    { title: "Bitbucket Repository", description: "Connect automation repos and branch workflows.", icon: GitCompare, status: "Coming Soon" },
    { title: "Azure DevOps", description: "Enterprise delivery workflow support.", icon: Boxes, status: "Future" },
    { title: "CI/CD Pipeline", description: "Automation execution and release pipeline signals.", icon: TrendingUp, status: "Future" },
  ];
  const aiProviderCards = [
    {
      title: "AI QA Copilot AI",
      description: "Built-in AI with zero setup.",
      badge: "Default",
      icon: Sparkles,
    },
    {
      title: "OpenAI",
      description: "Connect GPT models using your own API key.",
      icon: Bot,
    },
    {
      title: "Claude",
      description: "Use Claude for advanced reasoning and requirement analysis.",
      icon: Brain,
    },
    {
      title: "Gemini",
      description: "Connect Google Gemini for AI-powered QA workflows.",
      icon: Sparkles,
    },
    {
      title: "Groq",
      description: "Use ultra-fast AI inference for test generation.",
      icon: Zap,
    },
    {
      title: "Enterprise AI",
      description: "Azure OpenAI, OpenRouter, or custom OpenAI-compatible APIs.",
      icon: ShieldCheck,
    },
  ];
  const organizationCards = [
    {
      title: "Multi-tenant Workspaces",
      description: "Separate teams, clients, projects, roles, and QA assets inside governed organization workspaces.",
      icon: Layers3,
    },
    {
      title: "Team Management",
      description: "Invite members, manage access, assign project visibility, and support team-based QA operations.",
      icon: Users,
    },
    {
      title: "Role-Based Access",
      description: "Control who can create, review, approve, execute, export, configure integrations, and manage settings.",
      icon: ShieldCheck,
    },
  ];
  const faqs = [
    ["What is AI QA Copilot?", "AI QA Copilot is an AI-Powered Quality Engineering Platform for requirement analysis, test generation, review, execution, repository intelligence, Playwright validation, and QA reporting."],
    ["How does Automation Repository Onboarding help?", "It scans connected Playwright repositories, checks compatibility, initializes missing setup files safely, and prepares GitHub Actions validation."],
    ["Can AI QA Copilot detect frontend repository changes?", "Yes. It can connect application repositories, receive GitHub webhook events, and track changed files for impact analysis."],
    ["Can it update Playwright tests automatically?", "It can generate proposed Playwright updates for impacted tests, but users review and approve changes before validation and pull request creation."],
    ["Does it run generated Playwright tests before creating a PR?", "Yes. Approved updates can be validated through GitHub Actions, and the result includes pass/fail/skipped counts, logs, reports, and AI recommendations."],
    ["Can users choose their own AI provider?", "Yes. AI QA Copilot supports default AI and Bring Your Own AI providers such as OpenAI, Claude, Gemini, Groq, Azure OpenAI, OpenRouter, and custom providers."],
    ["Does it support manual execution?", "Yes. Teams can create test runs, execute approved test cases, and track Passed, Failed, Blocked, Skipped, and Not Executed status."],
    ["Can teams collaborate?", "Yes. Workspaces, roles, project access, review queues, and shared analytics support team-based QA work."],
    ["Is it suitable for enterprise QA teams?", "Yes. The product is designed around governed workflows, role-based access, approval controls, analytics, and scalable QA asset management."],
  ];
  const onboardingWorkflow = [
    { title: "Connect Repository", icon: Github },
    { title: "Repository Scan", icon: Search },
    { title: "Compatibility Analysis", icon: ShieldCheck },
    { title: "Framework Detection", icon: Code2 },
    { title: "Initialize Missing Files", icon: FileText },
    { title: "GitHub Actions Configuration", icon: GitBranch },
    { title: "Validation Ready", icon: CheckCircle2 },
    { title: "Run AI Validation", icon: Sparkles },
  ];
  const onboardingCapabilities = [
    {
      title: "Smart Repository Scan",
      description: "Automatically analyzes repository structure, dependencies, Playwright configuration, and framework readiness.",
      icon: Search,
    },
    {
      title: "Framework Detection",
      description: "Detects Playwright, version, package manager, repository structure, and stays future-ready for Cypress, Selenium, and WebdriverIO.",
      icon: Code2,
    },
    {
      title: "Compatibility Checker",
      description: "Checks package.json, Playwright config, GitHub Actions workflow, tests folder, dependencies, and displays a Repository Health Score.",
      icon: Gauge,
    },
    {
      title: "One-Click Initialization",
      description: "Creates missing workflow, Playwright config, .env example, README guidance, and sample smoke test without overwriting existing files.",
      icon: Rocket,
    },
    {
      title: "GitHub Actions Ready",
      description: "Prepares repository validation using GitHub Actions so teams do not need manual CI setup for AI QA Copilot validation.",
      icon: Github,
    },
    {
      title: "Validation Ready",
      description: "After onboarding, teams can generate Playwright updates, run validation, review results, and create Pull Requests.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-20 pb-10">
      <section className="grid min-h-[calc(100vh-7rem)] items-center gap-10 lg:grid-cols-[1fr_.95fr]">
        <div>
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1 size-3" /> Enterprise AI Quality Engineering
          </Badge>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl">
            <span className="block">AI QA Copilot</span>
            <span className="block text-primary">AI-Powered Quality Engineering Platform</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            AI QA Copilot helps QA, Product, and Engineering teams generate, review, execute, validate, automate, and continuously improve software testing using AI.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={onStart}>
              <Rocket className="size-4" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={onBookDemo}>
              <CalendarDays className="size-4" />
              Book Demo
            </Button>
            <Button size="lg" variant="ghost" onClick={() => window.open("https://github.com/dksable/ai-qa-copilot-fe/tree/main/docs", "_blank", "noopener,noreferrer")}>
              <FileText className="size-4" />
              View Documentation
            </Button>
          </div>
          <p className="mt-5 max-w-3xl text-sm font-medium leading-6 text-foreground/80">
            Built for QA Engineers, QA Leads, Product Managers, Engineering Managers, Delivery Managers, and Enterprise Teams.
          </p>
          <div className="mt-7 flex max-w-4xl flex-wrap gap-2.5">
            {heroFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-border/50 bg-card/70 px-3.5 py-2 shadow-sm backdrop-blur">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-3.5" />
                </span>
                <span className="text-xs font-semibold md:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <LandingProductMockup />
      </section>

      <LandingSection
        eyebrow="⭐ Enterprise Feature"
        title="Automation Repository Onboarding"
        description="Connect Any Playwright Automation Repository in Minutes"
      >
        <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card/75 p-5 shadow-card md:p-7">
          <div className="grid gap-8 xl:grid-cols-[1fr_.42fr]">
            <div>
              <div className="max-w-4xl">
                <p className="text-base leading-7 text-muted-foreground">
                  AI QA Copilot automatically scans, analyzes, initializes, and prepares your Playwright automation repository for AI-powered validation.
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Instead of manually configuring workflows, dependencies, and validation pipelines, users simply connect a GitHub repository and AI QA Copilot handles the rest.
                </p>
              </div>

              <div className="mt-7 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
                {onboardingWorkflow.map(({ title, icon: Icon }, index) => (
                  <div key={title} className="relative rounded-xl border border-border/40 bg-surface/50 p-3 text-center">
                    <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-3 text-xs font-semibold leading-5">{title}</p>
                    {index < onboardingWorkflow.length - 1 && (
                      <span className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rounded-full border border-primary/30 bg-background text-primary xl:flex xl:items-center xl:justify-center">
                        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {onboardingCapabilities.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="rounded-xl border border-border/40 bg-card/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
                    <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/40 bg-surface/60 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Repository Health</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold">Validation Ready</h3>
                </div>
                <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Enterprise</Badge>
              </div>
              <div className="mt-6 rounded-xl border border-success/25 bg-success/10 p-5 text-center">
                <p className="text-sm font-medium text-muted-foreground">Compatibility Score</p>
                <p className="mt-2 font-display text-5xl font-bold text-success">96%</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-success/15">
                  <div className="h-full w-[96%] rounded-full bg-success shadow-[0_0_18px_rgba(22,163,74,0.35)]" />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["package.json", "ok"],
                  ["Playwright Config", "ok"],
                  ["GitHub Workflow", "ok"],
                  ["Tests Folder", "ok"],
                  ["Fixtures Folder Missing", "warn"],
                ].map(([label, state]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-border/40 bg-card/70 px-3 py-2 text-sm">
                    <span>{label}</span>
                    {state === "ok" ? <CheckCircle2 className="size-4 text-success" /> : <AlertTriangle className="size-4 text-warning" />}
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommendation</p>
                <p className="mt-2 font-semibold">Initialize Missing Files</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Create a branch and Pull Request with missing onboarding files. Existing files are never overwritten silently.</p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_.8fr]">
            <div className="rounded-xl border border-border/40 bg-card/70 p-5">
              <h3 className="font-semibold">Why Automation Repository Onboarding?</h3>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {[
                  "Connect any Playwright automation repository.",
                  "Reduce setup time from hours to minutes.",
                  "Automatically detect repository issues.",
                  "Eliminate manual GitHub Actions configuration.",
                  "Standardize validation across projects.",
                  "Accelerate QA onboarding.",
                  "Improve developer productivity.",
                  "Enterprise-ready repository onboarding.",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 shrink-0 text-success" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border/40 bg-card/70 p-5">
              <h3 className="font-semibold">Feature Comparison</h3>
              <div className="mt-4 overflow-hidden rounded-lg border border-border/40 text-sm">
                <div className="grid grid-cols-3 bg-surface/70 font-semibold">
                  <div className="p-3">Capability</div>
                  <div className="p-3">AI QA Copilot</div>
                  <div className="p-3">Typical QA Tools</div>
                </div>
                <div className="grid grid-cols-3 border-t border-border/40">
                  <div className="p-3">Automation Repository Onboarding</div>
                  <div className="p-3 text-success">✅ Fully Automated</div>
                  <div className="p-3 text-destructive">❌ Manual Setup Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="The Challenge"
        title="Quality Engineering Has Become More Complex Than Ever"
        description="Modern software teams struggle with disconnected QA workflows, evolving requirements, automation maintenance, limited coverage visibility, and increasing release pressure."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {challengeCards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group flex min-h-[180px] flex-col rounded-xl border border-border/50 bg-card/70 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:bg-card hover:shadow-lg"
            >
              <span className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="text-base font-semibold leading-6 text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        id="core-features"
        eyebrow="Core Features"
        title="What AI QA Copilot Can Do"
        description="An AI-Powered Quality Engineering Platform for test generation, review, execution, validation, repository intelligence, automation updates, and quality reporting."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {features.map(({ title, description, icon: Icon, comingSoon, enterprise, beta }) => (
            <div
              key={title}
              className="group min-h-[132px] rounded-lg border border-border/40 bg-card/65 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/45 hover:bg-card/85 hover:shadow-card"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex min-h-10 flex-col gap-1.5">
                    <h3 className="text-sm font-semibold leading-5">{title}</h3>
                    {(enterprise || beta || comingSoon) && (
                      <div className="flex flex-wrap gap-1">
                        {enterprise && <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px] leading-none">Enterprise</Badge>}
                        {beta && <Badge variant="outline" className="h-5 rounded-full border-warning/40 bg-warning/10 px-2 text-[10px] leading-none text-warning">Beta</Badge>}
                        {comingSoon && <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px] leading-none">Coming Soon</Badge>}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="Authentication & Organization"
        title="Secure Collaboration for Enterprise QA Teams"
        description="AI QA Copilot supports authenticated team workspaces with governed access, clear ownership, and role-based controls across the QA lifecycle."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {organizationCards.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-4 transition-colors hover:border-primary/40">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="AI Providers / BYOAI"
        title="Choose Your AI. No Vendor Lock-In."
        description="Use AI QA Copilot’s built-in AI or connect your organization’s preferred AI provider for test generation, AI chat, impact analysis, and Playwright automation."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {aiProviderCards.map(({ title, description, badge, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-4 transition-colors hover:border-primary/40">
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {badge && <Badge variant="outline" className="h-6 border-primary/40 bg-primary/10 px-2 text-xs text-primary">{badge}</Badge>}
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-4">
          <div className="flex flex-wrap items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Bring Your Own AI</h3>
              <p className="mt-1.5 max-w-4xl text-xs leading-5 text-muted-foreground">
                Enterprise teams can use their existing AI subscriptions, reduce vendor lock-in, control AI usage, and align with internal security policies.
              </p>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="Business Outcomes"
        title="Built for QA Leaders, Engineering Managers, and Delivery Teams"
        description="Move from isolated test documents to governed quality operations with clear ownership, stronger confidence, and management-ready visibility."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {whyChoose.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-5">
              <Icon className="mb-4 size-5 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="How It Works"
        title="From Code Change to Production-Ready Pull Request"
        description="AI QA Copilot detects repository changes, analyzes test impact, generates Playwright updates, validates them, and prepares review-ready pull requests."
      >
        <div className="rounded-lg border border-border/40 bg-card/60 p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="relative rounded-lg border border-border/40 bg-background/50 p-3.5">
                <div className="flex items-start gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-5">{step.title}</h3>
                    <p className="mt-2 text-xs leading-4 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="Enterprise Integrations"
        title="Designed to Fit Enterprise Delivery Ecosystems"
        description="Planned integrations will connect QA planning, automation repositories, and delivery pipelines so quality work can flow into existing engineering processes."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {integrations.map(({ title, description, icon: Icon, status }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <Badge variant="outline" className="shrink-0 text-[10px]">{status}</Badge>
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection eyebrow="Pricing" title="Pricing Coming Soon" description="Start with the right plan for your QA maturity and scale into enterprise workflows.">
        <div className="grid gap-4 md:grid-cols-3">
          {["Free", "Pro", "Enterprise"].map((planName) => (
            <div key={planName} className="rounded-lg border border-border/40 bg-card/60 p-6">
              <h3 className="font-display text-xl font-semibold">{planName}</h3>
              <p className="mt-2 text-sm text-muted-foreground">Pricing Coming Soon</p>
              <Button className="mt-5 w-full" variant={planName === "Pro" ? "default" : "outline"} onClick={onPricing}>
                Join Waitlist
              </Button>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection eyebrow="FAQ" title="Questions Teams Ask Before Adopting" description="Practical answers for QA leaders, managers, and engineering stakeholders.">
        <div className="grid gap-3 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-border/40 bg-card/60 p-5">
              <h3 className="font-semibold">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <section className="rounded-lg border border-primary/30 bg-primary/10 p-8 text-center md:p-12">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Move from manual QA work to an AI-Powered Quality Engineering Platform.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Help your QA and engineering teams design better tests, govern approvals, execute with visibility, validate automation, and prepare pull requests with confidence.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={onStart}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" onClick={onBookDemo}>
            Book Demo
          </Button>
          <Button size="lg" variant="ghost" onClick={() => window.open("https://github.com/dksable/ai-qa-copilot-fe/tree/main/docs", "_blank", "noopener,noreferrer")}>
            View Documentation
          </Button>
        </div>
      </section>

      <footer className="flex flex-col gap-5 border-t border-border/40 pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-foreground">AI QA Copilot</p>
          <p className="mt-1">AI-Powered Quality Engineering Platform.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {["Product", "Features", "Pricing", "Documentation", "Contact", "LinkedIn", "GitHub"].map((link) => (
            <button key={link} type="button" className="hover:text-foreground">
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}

function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id}>
      <div className="mb-8 max-w-3xl">
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
          {eyebrow}
        </Badge>
        <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
      </div>
      {children}
    </section>
  );
}

function LandingProductMockup() {
  return (
    <div className="app-card overflow-hidden p-4">
      <div className="flex items-center gap-2 border-b border-border/40 pb-3">
        <span className="size-2.5 rounded-full bg-destructive" />
        <span className="size-2.5 rounded-full bg-warning" />
        <span className="size-2.5 rounded-full bg-success" />
        <span className="ml-3 text-xs text-muted-foreground">AI QA Copilot workspace</span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-3">
          {["Projects", "AI Chat", "Review Queue", "Analytics"].map((item, index) => (
            <div key={item} className={cn("rounded-lg border p-3 text-sm", index === 0 ? "border-primary/40 bg-primary/10" : "border-border/40 bg-surface/40")}>
              {item}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {["12,450", "86%", "31"].map((metric, index) => (
              <div key={metric} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                <p className="font-display text-xl font-semibold">{metric}</p>
                <p className="text-xs text-muted-foreground">{["Test Cases", "Coverage", "Reviews"][index]}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">Coverage Trend</p>
              <Badge variant="outline" className="border-success/40 bg-success/10 text-success">+15%</Badge>
            </div>
            <div className="flex h-32 items-end gap-2">
              {[34, 50, 44, 68, 72, 86, 78, 92].map((height, index) => (
                <div key={index} className="flex-1 rounded-t bg-primary/50" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
            <p className="text-sm font-semibold">Generated Test Plan</p>
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded-full bg-success/50" />
              <div className="h-2 w-4/5 rounded-full bg-primary/40" />
              <div className="h-2 w-2/3 rounded-full bg-warning/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CHART_COLORS = ["#38bdf8", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

function PricingPage({
  plans,
  subscription,
  workspaceUsage,
  billingCycle,
  isLoading,
  workspaceId,
  onBillingCycleChange,
  onPlanChange,
}: {
  plans: Plan[];
  subscription: SubscriptionResponse | null;
  workspaceUsage: WorkspaceUsageResponse | null;
  billingCycle: BillingCycle;
  isLoading: boolean;
  workspaceId: string;
  onBillingCycleChange: (cycle: BillingCycle) => void;
  onPlanChange: (planId: PlanId) => void;
}) {
  const comparisonRows: Array<[string, keyof Plan["limits"]]> = [
    ["Workspaces", "workspaces"],
    ["Team Members", "teamMembers"],
    ["Projects", "projects"],
    ["Requirements / Month", "requirementsPerMonth"],
    ["AI Generations / Month", "aiGenerationsPerMonth"],
    ["AI Chat Messages / Month", "aiChatMessagesPerMonth"],
    ["Exports / Month", "exportsPerMonth"],
    ["Storage", "storageMb"],
    ["Exports", "exports"],
    ["Analytics Dashboard", "analytics"],
    ["Review Workflow", "reviewWorkflow"],
    ["Jira Integration", "jiraIntegration"],
    ["Priority Support", "prioritySupport"],
  ];
  const currentPlanId = subscription?.subscription.planId;
  const priceFor = (plan: Plan) => {
    const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    if (price === null) return "Custom";
    if (price === 0) return "$0";
    return `$${price}`;
  };
  const limitText = (value: unknown) => {
    if (value === true) return "Included";
    if (value === false) return "Not included";
    if (value === "unlimited") return "Unlimited";
    return String(value);
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            SaaS Plans
          </Badge>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Pricing Plans</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Choose the plan that matches your QA team size, AI usage, exports, analytics, and governance needs.
          </p>
        </div>
        <div className="flex rounded-lg border border-border/50 bg-card/60 p-1">
          {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
            <Button
              key={cycle}
              size="sm"
              variant={billingCycle === cycle ? "secondary" : "ghost"}
              onClick={() => onBillingCycleChange(cycle)}
            >
              {cycle === "monthly" ? "Monthly" : "Yearly"}
              {cycle === "yearly" && <Badge variant="outline" className="ml-2 border-success/40 bg-success/10 text-success">Save 20%</Badge>}
            </Button>
          ))}
        </div>
      </div>

      <TrialDashboard trial={workspaceUsage?.trial ?? subscription?.trial} onUpgrade={() => onPlanChange("pro")} />

      {isLoading && !plans.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 shimmer" />
          <Skeleton className="h-96 shimmer" />
          <Skeleton className="h-96 shimmer" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = currentPlanId === plan.id;
            return (
              <Card key={plan.id} className={cn("app-card relative p-6", plan.recommended && "border-primary/50")}>
                {plan.recommended && (
                  <Badge className="absolute right-4 top-4 bg-gradient-primary text-primary-foreground">
                    Recommended
                  </Badge>
                )}
                {isCurrent && (
                  <Badge variant="outline" className="mb-3 border-success/40 bg-success/10 text-success">
                    Current Plan
                  </Badge>
                )}
                <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
                <p className="mt-2 min-h-12 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6">
                  <span className="font-display text-4xl font-bold">{priceFor(plan)}</span>
                  {plan.monthlyPrice !== null && <span className="ml-2 text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>}
                </div>
                {plan.trialDays && (
                  <p className="mt-2 text-sm text-primary">{plan.trialDays}-Day Trial</p>
                )}
                <Button
                  className={cn("mt-6 w-full", plan.recommended && "bg-gradient-primary text-primary-foreground shadow-glow")}
                  variant={plan.recommended ? "default" : "outline"}
                  disabled={isCurrent || !workspaceId}
                  onClick={() => onPlanChange(plan.id)}
                >
                  {isCurrent ? "Current Plan" : currentPlanId ? (plan.id === "enterprise" ? "Contact Sales" : "Switch Plan") : "Choose Plan"}
                </Button>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <WorkspaceUsageDashboard usage={workspaceUsage} />

      <Card className="app-card p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Feature Comparison</h2>
            <p className="mt-1 text-sm text-muted-foreground">Compare plan limits and SaaS capabilities.</p>
          </div>
          {subscription && (
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              Current: {subscription.plan.name} ({subscription.subscription.status})
            </Badge>
          )}
        </div>
        <div className="overflow-x-auto rounded-lg border border-border/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-elevated text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-4 py-3">{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {comparisonRows.map(([label, key]) => (
                <tr key={label} className="hover:bg-surface/40">
                  <td className="px-4 py-3 font-medium">{label}</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-4 py-3 text-muted-foreground">
                      {limitText(plan.limits[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AnalyticsDashboardPage({
  analytics,
  filters,
  workspaces,
  selectedWorkspaceId,
  projects,
  projectDetail,
  isLoading,
  onFiltersChange,
  onRefresh,
}: {
  analytics: AnalyticsBundle | null;
  filters: AnalyticsFilters;
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
  isLoading: boolean;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onRefresh: () => void;
}) {
  const updateFilter = (patch: Partial<AnalyticsFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };
  const selectedProjectModules = filters.projectId && projectDetail?.project.id === filters.projectId ? projectDetail.modules : [];
  const [isQualityRecalculating, setIsQualityRecalculating] = useState(false);
  const [isApiInsightsGenerating, setIsApiInsightsGenerating] = useState(false);
  const [apiInsights, setApiInsights] = useState<string[]>([]);
  const qualityTone = (score: number) =>
    score >= 90
      ? "border-success/40 bg-success/10 text-success"
      : score >= 80
        ? "border-primary/40 bg-primary/10 text-primary"
        : score >= 70
          ? "border-warning/40 bg-warning/10 text-warning"
          : "border-destructive/40 bg-destructive/10 text-destructive";
  const recalculateQuality = async () => {
    try {
      setIsQualityRecalculating(true);
      const result = await projectApi.recalculateAIQuality(filters);
      toast.success(`AI quality metrics recalculated for ${result.recalculated} generated output(s)`);
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to recalculate AI quality metrics");
    } finally {
      setIsQualityRecalculating(false);
    }
  };
  const generateApiInsights = async () => {
    try {
      setIsApiInsightsGenerating(true);
      const result = await projectApi.generateApiAnalyticsInsights(filters);
      setApiInsights(result.insights);
      toast.success("AI API insights generated");
      onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate API insights");
    } finally {
      setIsApiInsightsGenerating(false);
    }
  };

  if (isLoading && !analytics) {
    return (
      <div className="grid gap-4">
        <ContextualLoadingState
          icon={BarChart3}
          title="Loading analytics and AI quality metrics"
          description="Fetching coverage, review status, team productivity, validation trends, and AI quality score evidence."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="size-4 text-primary" />
              Analytics Dashboard
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold">QA productivity and coverage insights</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Track project health, coverage, review bottlenecks, AI usage, exports, and team throughput.
            </p>
          </div>
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />}
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-6">
          <Select
            value={filters.workspaceId ?? selectedWorkspaceId ?? "all"}
            onValueChange={(workspaceId) => updateFilter({ workspaceId: workspaceId === "all" ? undefined : workspaceId })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workspaces</SelectItem>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.workspaceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.projectId ?? "all"}
            onValueChange={(projectId) => updateFilter({ projectId: projectId === "all" ? undefined : projectId, moduleId: undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.moduleId ?? "all"}
            onValueChange={(moduleId) => updateFilter({ moduleId: moduleId === "all" ? undefined : moduleId })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modules</SelectItem>
              {selectedProjectModules.map((moduleItem) => (
                <SelectItem key={moduleItem.id} value={moduleItem.id}>
                  {moduleItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(status) => updateFilter({ status: status === "all" ? undefined : (status as HistoryStatus) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(["Draft", "Submitted for Review", "Changes Requested", "Approved", "Rejected"] as HistoryStatus[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(event) => updateFilter({ dateFrom: event.target.value || undefined })}
          />
          <Input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(event) => updateFilter({ dateTo: event.target.value || undefined })}
          />
        </div>
      </Card>

      {analytics ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Total Projects" value={analytics.summary.totalProjects} />
            <MiniStat label="Total Modules" value={analytics.summary.totalModules} />
            <MiniStat label="Total Requirements" value={analytics.summary.totalRequirements} />
            <MiniStat label="Test Cases Generated" value={analytics.summary.totalTestCasesGenerated} />
            <MiniStat label="Average Coverage" value={`${analytics.summary.averageCoverageScore}%`} />
            <MiniStat label="Approved Test Cases" value={analytics.summary.approvedTestCases} />
            <MiniStat label="Pending Reviews" value={analytics.summary.pendingReviews} />
            <MiniStat label="Changes Requested" value={analytics.summary.changesRequested} />
            <MiniStat label="Rejected Test Cases" value={analytics.summary.rejectedTestCases} />
            <MiniStat label="Total Exports" value={analytics.summary.totalExports} />
            <MiniStat label="AI Chat Interactions" value={analytics.summary.aiChatInteractions} />
            <MiniStat label="PDF / Excel Exports" value={`${analytics.exports.totalPdfExports}/${analytics.exports.totalExcelExports}`} />
          </div>

          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="size-4 text-primary" />
                  AI Quality Score
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold">Evidence-based quality measurement</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Measure AI output quality using requirement coverage, repository match, validation success, user acceptance, manual edit effort, and confidence trend.
                </p>
              </div>
              <Button variant="outline" onClick={recalculateQuality} disabled={isQualityRecalculating}>
                {isQualityRecalculating ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                Recalculate
              </Button>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
              <div className={cn("rounded-xl border p-5", qualityTone(analytics.aiQuality.overallQualityScore))}>
                <p className="text-sm font-semibold uppercase tracking-wide">Overall AI Quality Score</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-display text-6xl font-bold">{analytics.aiQuality.overallQualityScore}</span>
                  <span className="pb-2 text-lg font-semibold">/ 100</span>
                </div>
                <Badge variant="outline" className={cn("mt-4", qualityTone(analytics.aiQuality.overallQualityScore))}>
                  {analytics.aiQuality.qualityLabel}
                </Badge>
                <div className="mt-5 space-y-3">
                  {analytics.aiQuality.improvementSuggestions.slice(0, 3).map((suggestion) => (
                    <div key={suggestion} className="rounded-lg bg-background/70 p-3 text-sm leading-6 text-foreground">
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <MiniStat label="Requirement Coverage" value={`${analytics.aiQuality.requirementCoverage}%`} />
                <MiniStat label="Repository Match" value={`${analytics.aiQuality.repositoryMatchScore}%`} />
                <MiniStat label="Test Accuracy" value={`${analytics.aiQuality.testGenerationAccuracy}%`} />
                <MiniStat label="Validation Success" value={`${analytics.aiQuality.validationSuccessRate}%`} />
                <MiniStat label="Manual Edit Rate" value={`${analytics.aiQuality.manualEditRate}%`} />
                <MiniStat label="Manual Edit Score" value={`${analytics.aiQuality.manualEditScore}%`} />
                <MiniStat label="User Acceptance" value={`${analytics.aiQuality.userAcceptanceRate}%`} />
                <MiniStat label="AI Confidence" value={`${analytics.aiQuality.aiConfidenceScore}%`} />
                <MiniStat label="Generated Outputs" value={analytics.aiQuality.totalGeneratedOutputs} />
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <ChartCard title="AI Confidence and Quality Trend">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analytics.aiQualityTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="qualityScore" name="Quality Score" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="aiConfidenceScore" name="AI Confidence" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Quality Distribution">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={analytics.aiQuality.qualityDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                      {analytics.aiQuality.qualityDistribution.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </Card>

          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Network className="size-4 text-primary" />
                  API Analytics
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold">API health, validation, contracts, and release risk</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Measure API coverage, GitHub validation health, runner performance, contract compatibility, high-risk endpoints, and release readiness signals.
                </p>
              </div>
              <Button variant="outline" onClick={generateApiInsights} disabled={isApiInsightsGenerating}>
                {isApiInsightsGenerating ? <Loader2 className="size-4 animate-spin" /> : <Brain className="size-4" />}
                Generate AI API Insights
              </Button>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
              <div className={cn("rounded-xl border p-5", apiHealthTone(analytics.apiAnalytics.summary.apiHealthScore))}>
                <p className="text-sm font-semibold uppercase tracking-wide">API Health Score</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-display text-6xl font-bold">{analytics.apiAnalytics.summary.apiHealthScore}</span>
                  <span className="pb-2 text-lg font-semibold">/ 100</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className={apiHealthTone(analytics.apiAnalytics.summary.apiHealthScore)}>
                    {analytics.apiAnalytics.summary.apiHealthLabel}
                  </Badge>
                  <Badge variant="outline" className={apiRiskTone(analytics.apiAnalytics.summary.releaseRisk)}>
                    Release Risk: {analytics.apiAnalytics.summary.releaseRisk}
                  </Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {(apiInsights.length ? apiInsights : analytics.apiAnalytics.aiInsights).slice(0, 5).map((insight) => (
                    <div key={insight} className="rounded-lg bg-background/70 p-3 text-sm leading-6 text-foreground">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MiniStat label="Total APIs" value={analytics.apiAnalytics.summary.totalApis} />
                <MiniStat label="APIs Tested" value={analytics.apiAnalytics.summary.testedApis} />
                <MiniStat label="APIs Not Tested" value={analytics.apiAnalytics.summary.untestedApis} />
                <MiniStat label="Passed APIs" value={analytics.apiAnalytics.summary.passedApis} />
                <MiniStat label="Failed APIs" value={analytics.apiAnalytics.summary.failedApis} />
                <MiniStat label="Avg Response" value={`${analytics.apiAnalytics.summary.averageResponseTime} ms`} />
                <MiniStat label="p95 Response" value={`${analytics.apiAnalytics.summary.p95ResponseTime} ms`} />
                <MiniStat label="Contract Failures" value={analytics.apiAnalytics.summary.contractFailures} />
                <MiniStat label="Breaking Changes" value={analytics.apiAnalytics.summary.breakingChanges} />
                <MiniStat label="API Coverage" value={`${analytics.apiAnalytics.summary.apiCoverage}%`} />
                <MiniStat label="High-Risk APIs" value={analytics.apiAnalytics.summary.highRiskApis} />
                <MiniStat label="Validation Success" value={`${analytics.apiAnalytics.summary.validationSuccessRate}%`} />
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <ChartCard title="API Validation Pass/Fail Trend">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={analytics.apiAnalytics.validation.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="passed" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
                    <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Response Time Trend">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analytics.apiAnalytics.performance.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="averageResponseTime" name="Average" stroke="#38bdf8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="p95ResponseTime" name="p95" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="API Coverage by Module/Tag">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.apiAnalytics.coverage.byTag.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tag" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="coverage" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Contract Compatibility Trend">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analytics.apiAnalytics.contracts.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="compatibilityScore" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-4">
              <ApiAnalyticsList title="Failed APIs" rows={analytics.apiAnalytics.drilldowns.failedApis.map((api) => [`${api.method} ${api.path}`, api.riskLevel])} empty="No failed APIs detected." />
              <ApiAnalyticsList title="Slowest APIs" rows={analytics.apiAnalytics.drilldowns.slowestApis.map((api) => [`${api.method} ${api.endpoint}`, `${api.responseTime} ms`])} empty="No response-time data yet." />
              <ApiAnalyticsList title="Contract Failures" rows={analytics.apiAnalytics.drilldowns.contractFailures.map((contract) => [contract.endpointId || contract.apiWorkspaceId || contract.id, `${contract.breakingChanges.length} changes`])} empty="No contract failures." />
              <ApiAnalyticsList title="Untested APIs" rows={analytics.apiAnalytics.drilldowns.untestedApis.map((api) => [`${api.method} ${api.path}`, api.riskLevel])} empty="No untested APIs detected." />
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="Coverage Trend Over Time">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={analytics.coverage.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="averageCoverageScore" stroke="#38bdf8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Average Coverage by Project">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.coverage.byProject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="projectName" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="averageCoverageScore" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Test Cases by Project">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.generation.generatedByProject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="testCases" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Review Status Distribution">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.review.statusDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                    {analytics.review.statusDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="AI Usage Over Time">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={analytics.aiUsage.usageOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="messages" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="User Productivity">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.userProductivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="userName" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="testCasesGenerated" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Low Coverage Requirements</h2>
                <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning">
                  Below 70%
                </Badge>
              </div>
              {analytics.coverage.lowCoverageRequirements.length ? (
                <div className="grid gap-3">
                  {analytics.coverage.lowCoverageRequirements.map((item) => (
                    <div key={item.historyId} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.requirementTitle}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.projectName} • {item.moduleName} • Version {item.version}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                          {item.coverageScore}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                    {analytics.coverage.recommendation}
                  </div>
                </div>
              ) : (
                <EmptyAnalyticsState label="No low coverage requirements found." />
              )}
            </Card>

            <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
              <h2 className="font-display text-xl font-semibold">Project Health</h2>
              <div className="mt-4 grid gap-3">
                {analytics.projectHealth.length ? (
                  analytics.projectHealth.map((project) => (
                    <div key={project.projectId} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{project.projectName}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {project.totalRequirements} requirements • {project.totalGeneratedVersions} versions • {project.pendingReviews} pending
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{project.averageCoverageScore}% coverage</Badge>
                          <Badge variant="outline" className={healthClass(project.healthStatus)}>
                            {project.healthStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyAnalyticsState label="No project health data yet." />
                )}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <AnalyticsList title="Most Active Modules" rows={analytics.generation.mostActiveModules.map((item) => [item.name, item.testCases])} suffix="test cases" />
            <AnalyticsList title="Quick Prompts" rows={analytics.aiUsage.mostUsedQuickPrompts.map((item) => [item.name, item.count])} suffix="uses" />
            <AnalyticsList title="Exports by Project" rows={analytics.exports.exportsByProject.map((item) => [item.name, item.exports])} suffix="records" />
          </div>
        </>
      ) : (
        <ProfessionalEmptyState
          icon={BarChart3}
          title="No analytics data available"
          message="Generate test cases, run reviews, execute tests, or validate Playwright updates to build analytics and AI quality evidence."
        />
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
      <h2 className="mb-4 font-display text-xl font-semibold">{title}</h2>
      {children}
    </Card>
  );
}

function apiHealthTone(score: number) {
  if (score >= 95) return "border-success/40 bg-success/10 text-success";
  if (score >= 85) return "border-primary/40 bg-primary/10 text-primary";
  if (score >= 70) return "border-warning/40 bg-warning/10 text-warning";
  return "border-destructive/40 bg-destructive/10 text-destructive";
}

function apiRiskTone(risk: ApiAnalyticsSummary["summary"]["releaseRisk"]) {
  if (risk === "Low") return "border-success/40 bg-success/10 text-success";
  if (risk === "Medium") return "border-warning/40 bg-warning/10 text-warning";
  if (risk === "High") return "border-destructive/40 bg-destructive/10 text-destructive";
  return "border-red-900/40 bg-red-900/10 text-red-900";
}

function ApiAnalyticsList({ title, rows, empty }: { title: string; rows: Array<[string, string | number]>; empty: string }) {
  return (
    <Card className="border-border/50 bg-card/60 p-4 backdrop-blur">
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-3 max-h-72 space-y-2 overflow-auto">
        {rows.length ? rows.slice(0, 10).map(([label, value]) => (
          <div key={`${label}-${value}`} className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-surface/40 px-3 py-2">
            <span className="min-w-0 truncate text-sm">{label}</span>
            <Badge variant="outline" className="shrink-0">{value}</Badge>
          </div>
        )) : <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">{empty}</p>}
      </div>
    </Card>
  );
}

function AnalyticsList({ title, rows, suffix }: { title: string; rows: Array<[string, number]>; suffix: string }) {
  return (
    <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {rows.length ? (
          rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 px-3 py-2">
              <span className="truncate text-sm">{label}</span>
              <span className="text-sm font-semibold">
                {value} {suffix}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
      </div>
    </Card>
  );
}

function EmptyAnalyticsState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-surface/30 p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function healthClass(status: AnalyticsProjectHealth["healthStatus"]) {
  switch (status) {
    case "Healthy":
      return "border-success/40 bg-success/10 text-success";
    case "Needs Attention":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-destructive/40 bg-destructive/10 text-destructive";
  }
}

function TeamWorkspacePage({
  workspaces,
  selectedWorkspaceId,
  detail,
  projects,
  workspaceUsage,
  isLoading,
  onSelectWorkspace,
  onRefresh,
  onLimitExceeded,
}: {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  detail: WorkspaceDetail | null;
  projects: ProjectSummary[];
  workspaceUsage: WorkspaceUsageResponse | null;
  isLoading: boolean;
  onSelectWorkspace: (workspaceId: string) => void;
  onRefresh: () => void;
  onLimitExceeded: (error: unknown) => boolean;
}) {
  const [workspaceForm, setWorkspaceForm] = useState({ workspaceName: "", description: "", logo: "" });
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "QA Engineer" as WorkspaceRole,
    projectId: "",
    permission: "Edit Access" as WorkspaceMember["assignedProjects"][number]["permission"],
    message: "",
  });
  const [latestInviteLink, setLatestInviteLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const workspace = detail?.workspace;
  const members = detail?.members ?? [];
  const invites = detail?.invites ?? [];
  const activityLogs = detail?.activityLogs ?? [];
  const activeMembers = members.filter((member) => member.status === "Active").length;
  const assignedProjectCount = new Set(
    members.flatMap((member) => member.assignedProjects.map((project) => project.projectId)),
  ).size;

  const runWorkspaceAction = async (action: () => Promise<void>, success: string) => {
    try {
      setIsSaving(true);
      await action();
      toast.success(success);
      onRefresh();
    } catch (error) {
      if (onLimitExceeded(error)) return;
      toast.error(error instanceof Error ? error.message : "Workspace action failed");
    } finally {
      setIsSaving(false);
    }
  };

  const createWorkspace = () =>
    runWorkspaceAction(async () => {
      if (!workspaceForm.workspaceName.trim()) throw new Error("Workspace name is required.");
      const created = await projectApi.createWorkspace(workspaceForm);
      setWorkspaceForm({ workspaceName: "", description: "", logo: "" });
      onSelectWorkspace(created.id);
    }, "Workspace created");

  const updateWorkspace = () =>
    runWorkspaceAction(async () => {
      if (!workspace) return;
      const nextName = window.prompt("Workspace name", workspace.workspaceName);
      if (!nextName?.trim()) return;
      const nextDescription = window.prompt("Workspace description", workspace.description) ?? workspace.description;
      await projectApi.updateWorkspace(workspace.id, {
        workspaceName: nextName,
        description: nextDescription,
        logo: workspace.logo,
      });
    }, "Workspace updated");

  const inviteMember = () =>
    runWorkspaceAction(async () => {
      if (!workspace) return;
      if (!inviteForm.email.trim()) throw new Error("Email is required.");
      const assignedProjects = inviteForm.projectId
        ? [{ projectId: inviteForm.projectId, permission: inviteForm.permission }]
        : [];
      const invite = await projectApi.createInvite(workspace.id, {
        email: inviteForm.email,
        role: inviteForm.role,
        assignedProjects,
        message: inviteForm.message || undefined,
      });
      setInviteForm({
        email: "",
        role: "QA Engineer",
        projectId: "",
        permission: "Edit Access",
        message: "",
      });
      setLatestInviteLink(invite.inviteLink ?? "");
    }, "Invite created");

  const changeRole = (member: WorkspaceMember) =>
    runWorkspaceAction(async () => {
      if (!workspace) return;
      const role = window.prompt("Role: Owner, Admin, QA Lead, QA Engineer, Viewer", member.role) as WorkspaceRole | null;
      if (!role) return;
      await projectApi.updateMemberRole(workspace.id, member.id, role);
    }, "Role updated");

  const assignProject = (member: WorkspaceMember) =>
    runWorkspaceAction(async () => {
      if (!workspace) return;
      const projectId = window.prompt("Project ID to assign", member.assignedProjects[0]?.projectId ?? projects[0]?.id ?? "");
      if (!projectId) return;
      const permission = (window.prompt(
        "Permission: Full Access, Edit Access, Review Access, View Only",
        member.assignedProjects[0]?.permission ?? "View Only",
      ) ?? "View Only") as WorkspaceMember["assignedProjects"][number]["permission"];
      await projectApi.updateMemberProjects(workspace.id, member.id, [{ projectId, permission }]);
    }, "Project access updated");

  if (isLoading && !detail) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4 text-primary" />
              Team Workspace
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold">
              {workspace?.workspaceName ?? "Create your first workspace"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Manage members, roles, project access, invitations, and workspace activity from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedWorkspaceId} onValueChange={onSelectWorkspace}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>
              <SelectContent>
                {workspaces.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.workspaceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {workspace && (
              <>
                <Button variant="outline" onClick={updateWorkspace} disabled={isSaving}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    runWorkspaceAction(async () => {
                      if (workspace) await projectApi.archiveWorkspace(workspace.id);
                    }, "Workspace archived")
                  }
                  disabled={isSaving || workspace.status === "Archived"}
                >
                  <Archive className="size-4" />
                  Archive
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <MiniStat label="Members" value={members.length} />
          <MiniStat label="Active Members" value={activeMembers} />
          <MiniStat label="Pending Invites" value={invites.filter((invite) => invite.status === "Pending").length} />
          <MiniStat label="Assigned Projects" value={assignedProjectCount || projects.length} />
        </div>
      </Card>

      <WorkspaceUsageDashboard usage={workspaceUsage} />

      <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input
            placeholder="Workspace name"
            value={workspaceForm.workspaceName}
            onChange={(event) => setWorkspaceForm((value) => ({ ...value, workspaceName: event.target.value }))}
          />
          <Input
            placeholder="Description"
            value={workspaceForm.description}
            onChange={(event) => setWorkspaceForm((value) => ({ ...value, description: event.target.value }))}
          />
          <Button onClick={createWorkspace} disabled={isSaving}>
            <Plus className="size-4" />
            Create Workspace
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">Team Members</h2>
                <p className="text-sm text-muted-foreground">Change roles, assign project access, or deactivate users.</p>
              </div>
            </div>
            {members.length ? (
              <WorkspaceTable
                rows={members.map((member) => [
                  <div key="name">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>,
                  <Badge key="role" variant="outline" className={roleClass(member.role)}>
                    {member.role}
                  </Badge>,
                  <span key="projects" className="text-sm text-muted-foreground">
                    {member.assignedProjects.length
                      ? member.assignedProjects
                          .map((assignment) => projects.find((project) => project.id === assignment.projectId)?.name ?? "Project")
                          .join(", ")
                      : "All workspace projects"}
                  </span>,
                  <Badge key="status" variant="outline" className={member.status === "Active" ? statusClass("Active") : statusClass("Archived")}>
                    {member.status}
                  </Badge>,
                  <span key="joined" className="text-xs text-muted-foreground">
                    {formatDate(member.joinedAt)}
                  </span>,
                  <div key="actions" className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => changeRole(member)} disabled={isSaving || member.role === "Owner"}>
                      Role
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => assignProject(member)} disabled={isSaving}>
                      Projects
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        runWorkspaceAction(async () => {
                          if (workspace) await projectApi.deactivateMember(workspace.id, member.id);
                        }, "Member deactivated")
                      }
                      disabled={isSaving || member.role === "Owner"}
                    >
                      Deactivate
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (!window.confirm("Remove this member from the workspace?")) return;
                        void runWorkspaceAction(async () => {
                          if (workspace) await projectApi.removeMember(workspace.id, member.id);
                        }, "Member removed");
                      }}
                      disabled={isSaving || member.role === "Owner"}
                    >
                      Remove
                    </Button>
                  </div>,
                ])}
                headers={["Member", "Role", "Assigned Projects", "Status", "Joined", "Actions"]}
              />
            ) : (
              <EmptyWorkspaceState label="No members yet." />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="invites">
          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <h2 className="font-display text-xl font-semibold">Invite Members</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_.8fr_1fr_1fr]">
              <Input
                placeholder="Email"
                value={inviteForm.email}
                onChange={(event) => setInviteForm((value) => ({ ...value, email: event.target.value }))}
              />
              <Select
                value={inviteForm.role}
                onValueChange={(role: WorkspaceRole) => setInviteForm((value) => ({ ...value, role }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Admin", "QA Lead", "QA Engineer", "Viewer"] as WorkspaceRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={inviteForm.projectId || "all"}
                onValueChange={(projectId) => setInviteForm((value) => ({ ...value, projectId: projectId === "all" ? "" : projectId }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assigned project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={inviteMember} disabled={isSaving || !workspace}>
                <Send className="size-4" />
                Invite
              </Button>
            </div>
            <Textarea
              className="mt-3 min-h-20"
              placeholder="Optional message"
              value={inviteForm.message}
              onChange={(event) => setInviteForm((value) => ({ ...value, message: event.target.value }))}
            />
            {latestInviteLink && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-medium">Invite link</p>
                <div className="mt-2 flex gap-2">
                  <Input readOnly value={latestInviteLink} />
                  <Button
                    variant="outline"
                    onClick={() => {
                      void navigator.clipboard.writeText(latestInviteLink);
                      toast.success("Invite link copied");
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>
            )}
            <div className="mt-6">
              {invites.length ? (
                <WorkspaceTable
                  headers={["Email", "Role", "Status", "Expires", "Actions"]}
                  rows={invites.map((invite) => [
                    <span key="email" className="font-medium">
                      {invite.email}
                    </span>,
                    <Badge key="role" variant="outline" className={roleClass(invite.role)}>
                      {invite.role}
                    </Badge>,
                    <Badge key="status" variant="outline">
                      {invite.status}
                    </Badge>,
                    <span key="expires" className="text-xs text-muted-foreground">
                      {formatDate(invite.expiresAt)}
                    </span>,
                    <div key="actions" className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          runWorkspaceAction(async () => {
                            if (workspace) await projectApi.resendInvite(workspace.id, invite.id);
                          }, "Invite resent")
                        }
                        disabled={isSaving}
                      >
                        Resend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          runWorkspaceAction(async () => {
                            if (workspace) await projectApi.revokeInvite(workspace.id, invite.id);
                          }, "Invite revoked")
                        }
                        disabled={isSaving || invite.status === "Revoked"}
                      >
                        Revoke
                      </Button>
                    </div>,
                  ])}
                />
              ) : (
                <EmptyWorkspaceState label="No invites have been sent." />
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <h2 className="font-display text-xl font-semibold">Roles & Permissions</h2>
            <div className="mt-4 grid gap-3 lg:grid-cols-5">
              {(["Owner", "Admin", "QA Lead", "QA Engineer", "Viewer"] as WorkspaceRole[]).map((role) => (
                <div key={role} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                  <Badge variant="outline" className={roleClass(role)}>
                    {role}
                  </Badge>
                  <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                    {permissionsForRole(role).map((permission) => (
                      <li key={permission} className="flex gap-2">
                        <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <h2 className="font-display text-xl font-semibold">Activity Logs</h2>
            <div className="mt-4 grid gap-3">
              {activityLogs.length ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{log.action}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {log.actorName} • {log.resourceType}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyWorkspaceState label="No workspace activity yet." />
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
            <h2 className="font-display text-xl font-semibold">Workspace Overview</h2>
            {workspace ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="mt-2 text-sm">{workspace.description || "No description added."}</p>
                </div>
                <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={cn("mt-2", statusClass(workspace.status))}>
                    {workspace.status}
                  </Badge>
                  <p className="mt-3 text-xs text-muted-foreground">Created {formatDate(workspace.createdAt)}</p>
                </div>
              </div>
            ) : (
              <EmptyWorkspaceState label="Create a workspace to start managing your team." />
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WorkspaceTable({ headers, rows }: { headers: string[]; rows: Array<Array<ReactNode>> }) {
  return (
    <div className="max-h-[520px] overflow-auto rounded-lg border border-border/40">
      <table className="min-w-full divide-y divide-border/40 text-left text-sm">
        <thead className="sticky top-0 z-10 bg-surface-elevated text-xs uppercase text-muted-foreground shadow-sm">
          <tr>
            {headers.map((header) => (
              <th key={header} className="whitespace-nowrap px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((row, index) => (
            <tr key={index} className="bg-card/20 transition-colors hover:bg-surface/50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyWorkspaceState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-surface/30 p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function roleClass(role: WorkspaceRole) {
  switch (role) {
    case "Owner":
      return "border-primary/50 bg-primary/15 text-primary";
    case "Admin":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "QA Lead":
      return "border-warning/40 bg-warning/10 text-warning";
    case "QA Engineer":
      return "border-success/40 bg-success/10 text-success";
    default:
      return "border-muted-foreground/30 bg-muted/30 text-muted-foreground";
  }
}

function permissionsForRole(role: WorkspaceRole) {
  const matrix: Record<WorkspaceRole, string[]> = {
    Owner: ["Manage workspace", "Manage users", "Assign roles", "Approve reviews", "Export approved versions"],
    Admin: ["Manage projects", "Manage users", "Approve reviews", "View all workspace data"],
    "QA Lead": ["Create/edit projects", "Review test cases", "Request changes", "Export approved versions"],
    "QA Engineer": ["Create requirements", "Generate test cases", "Use AI Chat", "Submit for review"],
    Viewer: ["Read approved test cases", "View assigned projects", "Export approved versions when allowed"],
  };
  return matrix[role];
}

function ReviewQueuePage({
  queue,
  detail,
  isLoading,
  onRefresh,
  onOpenReview,
  onApprove,
  onRequestChanges,
  onReject,
  onComment,
}: {
  queue: TestCaseHistoryRecord[];
  detail: ReviewDetail | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenReview: (historyId: string) => void;
  onApprove: (historyId: string, comment?: string) => void;
  onRequestChanges: (historyId: string, comment: string) => void;
  onReject: (historyId: string, comment: string) => void;
  onComment: (historyId: string, comment: string) => void;
}) {
  const [comment, setComment] = useState("");

  const askOptional = (title: string) => window.prompt(title) ?? undefined;
  const askRequired = (title: string) => {
    const value = window.prompt(title);
    if (!value?.trim()) {
      toast.error("Comment/reason is required.");
      return null;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <ClipboardList className="mr-1 size-3" /> Review workflow
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Review Queue
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review submitted test case versions, request changes, reject, or approve locked final versions.
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh}>
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          Refresh
        </Button>
      </div>

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <Card className="min-w-0 border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Submitted Items</h2>
            <Badge variant="outline">{queue.length} pending</Badge>
          </div>
          {queue.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
              <ClipboardList className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">No items submitted for review.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/40 bg-surface/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{item.requirementTitle}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.projectName} / {item.moduleName}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", historyStatusClass(item.reviewStatus))}>
                      {item.reviewStatus}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <span>Version {item.version}</span>
                    <span>{item.coverageScore}% coverage</span>
                    <span>{item.submittedBy ?? "Current User"}</span>
                    <span>{item.submittedAt ? formatDate(item.submittedAt) : "Not submitted"}</span>
                  </div>
                  <Button className="mt-3" size="sm" onClick={() => onOpenReview(item.id)}>
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {detail ? (
          <div className="min-w-0 space-y-5">
            <Card className="min-w-0 overflow-hidden border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{detail.history.requirementTitle}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Version {detail.history.version} · Submitted by {detail.history.submittedBy ?? "Current User"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {detail.history.submittedAt ? formatDate(detail.history.submittedAt) : "not yet"}
                  </p>
                </div>
                <Badge variant="outline" className={cn("text-xs", historyStatusClass(detail.history.reviewStatus))}>
                  {detail.history.reviewStatus}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MiniStat label="Coverage" value={`${detail.history.coverageScore}%`} />
                <MiniStat label="Positive" value={detail.history.output.positive.length} />
                <MiniStat label="Negative" value={detail.history.output.negative.length} />
                <MiniStat label="Edge" value={detail.history.output.edge.length} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  onClick={() => onApprove(detail.history.id, askOptional("Approval comment"))}
                  disabled={detail.history.isLocked}
                >
                  <CheckCircle2 className="size-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const reason = askRequired("Reason for requested changes");
                    if (reason) onRequestChanges(detail.history.id, reason);
                  }}
                  disabled={detail.history.isLocked}
                >
                  <AlertTriangle className="size-4" />
                  Request Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const reason = askRequired("Rejection reason");
                    if (reason) onReject(detail.history.id, reason);
                  }}
                  disabled={detail.history.isLocked}
                >
                  <XCircle className="size-4" />
                  Reject
                </Button>
              </div>
            </Card>

            <Results plan={detail.history.output} />

            <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <h3 className="font-semibold">Comments</h3>
              </div>
              <div className="space-y-3">
                {detail.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet.</p>
                ) : (
                  detail.comments.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                      <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                        <span>{item.userName} · {item.role} · {item.actionType}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add comment" />
                <Button
                  onClick={() => {
                    if (!comment.trim()) return;
                    onComment(detail.history.id, comment);
                    setComment("");
                  }}
                >
                  Add
                </Button>
              </div>
            </Card>

            <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
              <h3 className="mb-3 font-semibold">Audit Trail</h3>
              <div className="space-y-2">
                {detail.auditTrail.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/40 bg-surface/40 p-3 text-sm">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.userName} · {formatDate(item.timestamp)} · {item.oldStatus ?? "none"} to {item.newStatus ?? "none"}
                    </p>
                    {item.comment && <p className="mt-1 text-xs">{item.comment}</p>}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="border-dashed border-border/50 bg-card/30 p-10 text-center backdrop-blur">
            <Eye className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Select a submitted item to review.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function executionStatusClass(status: TestExecutionStatus | string) {
  switch (status) {
    case "Passed":
      return "border-success/40 bg-success/10 text-success";
    case "Failed":
      return "border-destructive/50 bg-destructive/10 text-destructive";
    case "Blocked":
      return "border-warning/50 bg-warning/10 text-warning";
    case "Skipped":
      return "border-muted-foreground/40 bg-muted/40 text-muted-foreground";
    case "Completed":
      return "border-success/40 bg-success/10 text-success";
    case "In Progress":
      return "border-primary/40 bg-primary/10 text-primary";
    default:
      return "border-border/60 bg-surface/50 text-muted-foreground";
  }
}

function TestExecutionPage({
  projects,
  projectDetail,
  selectedProjectId,
  selectedModuleId,
  selectedRequirementId,
  testRuns,
  selectedTestRunId,
  detail,
  approvedVersions,
  dashboard,
  historyItems,
  isLoading,
  currentUserName,
  onProjectChange,
  onModuleChange,
  onRequirementChange,
  onRefresh,
  onCreateRun,
  onSelectRun,
  onDeleteRun,
  onUpdateExecution,
  onLoadExecutionHistory,
  onExportRun,
}: {
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
  selectedProjectId: string;
  selectedModuleId: string;
  selectedRequirementId: string;
  testRuns: TestRunSummary[];
  selectedTestRunId: string;
  detail: TestRunDetail | null;
  approvedVersions: ApprovedTestCaseVersion[];
  dashboard: TestExecutionDashboard | null;
  historyItems: TestExecutionHistoryItem[];
  isLoading: boolean;
  currentUserName: string;
  onProjectChange: (projectId: string) => void;
  onModuleChange: (moduleId: string) => void;
  onRequirementChange: (requirementId: string) => void;
  onRefresh: () => void;
  onCreateRun: (input: CreateTestRunInput) => Promise<void>;
  onSelectRun: (runId: string) => void;
  onDeleteRun: (runId: string) => void;
  onUpdateExecution: (
    execution: TestExecution,
    draft: ExecutionEvidenceDraft,
  ) => Promise<void>;
  onLoadExecutionHistory: (executionId: string) => void;
  onExportRun: (runId: string, format: ExportFormat) => void;
}) {
  const modules = projectDetail?.modules.filter((moduleItem) => moduleItem.status === "Active") ?? [];
  const requirements = projectDetail?.requirements.filter((item) => item.moduleId === selectedModuleId) ?? [];
  const filteredApprovedVersions = approvedVersions.filter(
    (version) =>
      (!selectedProjectId || version.projectId === selectedProjectId) &&
      (!selectedModuleId || version.moduleId === selectedModuleId) &&
      (!selectedRequirementId || version.requirementId === selectedRequirementId),
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    environment: "QA" as const,
    buildVersion: "",
    assignedTester: currentUserName,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10),
    description: "",
  });
  const [executionDrafts, setExecutionDrafts] = useState<Record<string, ExecutionEvidenceDraft>>({});

  const createRun = async () => {
    const trimmedName = form.name.trim();
    const trimmedBuildVersion = form.buildVersion.trim();
    const trimmedAssignedTester = form.assignedTester.trim();
    if (!selectedProjectId || !selectedModuleId) {
      toast.error("Select project and module before creating a test run.");
      return;
    }
    if (!trimmedName) {
      toast.error("Enter a test run name.");
      return;
    }
    if (!trimmedBuildVersion) {
      toast.error("Enter a build version.");
      return;
    }
    if (!trimmedAssignedTester) {
      toast.error("Enter or select an assigned tester.");
      return;
    }
    if (!selectedHistoryIds.length) {
      toast.error("Select at least one approved test case version.");
      return;
    }
    await onCreateRun({
      name: trimmedName,
      projectId: selectedProjectId,
      moduleId: selectedModuleId,
      requirementId: selectedRequirementId || undefined,
      environment: form.environment,
      buildVersion: trimmedBuildVersion,
      assignedTester: trimmedAssignedTester,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description.trim(),
      historyIds: selectedHistoryIds,
    });
    setIsCreateOpen(false);
    setSelectedHistoryIds([]);
    setForm((value) => ({ ...value, name: "", buildVersion: "", assignedTester: currentUserName, description: "" }));
  };

  const draftFor = (execution: TestExecution) =>
    executionDrafts[execution.id] ?? {
      status: execution.status,
      actualResult: execution.actualResult,
      comments: execution.comments,
      bugId: execution.bugId ?? "",
      jiraBugId: execution.jiraBugId ?? execution.bugId ?? "",
      jiraBugUrl: execution.jiraBugUrl ?? "",
      screenshotUrl: execution.screenshotUrl ?? "",
      videoUrl: execution.videoUrl ?? "",
      logUrl: execution.logUrl ?? "",
      executionTime: execution.executionTime ? String(execution.executionTime) : "",
      browser: execution.browser ?? "",
      operatingSystem: execution.operatingSystem ?? "",
      buildNumber: execution.buildNumber ?? detail?.buildVersion ?? "",
      environment: execution.environment ?? detail?.environment ?? "",
    };

  const setDraft = (executionId: string, patch: Partial<ExecutionEvidenceDraft>) => {
    setExecutionDrafts((current) => ({
      ...current,
      [executionId]: {
        status: "Not Executed",
        actualResult: "",
        comments: "",
        bugId: "",
        jiraBugId: "",
        jiraBugUrl: "",
        screenshotUrl: "",
        videoUrl: "",
        logUrl: "",
        executionTime: "",
        browser: "",
        operatingSystem: "",
        buildNumber: detail?.buildVersion ?? "",
        environment: detail?.environment ?? "",
        ...current[executionId],
        ...patch,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <ClipboardCheck className="mr-1 size-3" /> Manual execution
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Test Execution</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Create manual test runs from approved test cases, update execution results, and track QA progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />}
            Refresh
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-primary-foreground shadow-glow">
                <Plus className="size-4" />
                Create Test Run
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create Test Run</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Test run name" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} />
                <Input placeholder="Build version" value={form.buildVersion} onChange={(event) => setForm((value) => ({ ...value, buildVersion: event.target.value }))} />
                <Select value={selectedProjectId} onValueChange={onProjectChange}>
                  <SelectTrigger><SelectValue placeholder="Project" /></SelectTrigger>
                  <SelectContent>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedModuleId} onValueChange={onModuleChange} disabled={!selectedProjectId}>
                  <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
                  <SelectContent>{modules.map((moduleItem) => <SelectItem key={moduleItem.id} value={moduleItem.id}>{moduleItem.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedRequirementId || "all"} onValueChange={(value) => onRequirementChange(value === "all" ? "" : value)} disabled={!selectedModuleId}>
                  <SelectTrigger><SelectValue placeholder="Requirement optional" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All requirements</SelectItem>
                    {requirements.map((requirement) => <SelectItem key={requirement.id} value={requirement.id}>{requirement.title}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={form.environment} onValueChange={(environment) => setForm((value) => ({ ...value, environment: environment as typeof form.environment }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["QA", "UAT", "Staging", "Production"].map((environment) => <SelectItem key={environment} value={environment}>{environment}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Assigned tester" value={form.assignedTester} onChange={(event) => setForm((value) => ({ ...value, assignedTester: event.target.value }))} />
                <Input type="date" value={form.startDate} onChange={(event) => setForm((value) => ({ ...value, startDate: event.target.value }))} />
                <Input type="date" value={form.endDate} onChange={(event) => setForm((value) => ({ ...value, endDate: event.target.value }))} />
                <Textarea className="md:col-span-2" placeholder="Description" value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} />
              </div>
              <div className="rounded-xl border border-border/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">Approved test case versions</p>
                  <Badge variant="outline">{selectedHistoryIds.length} selected</Badge>
                </div>
                <div className="max-h-60 space-y-2 overflow-y-auto pr-2">
                  {filteredApprovedVersions.length ? filteredApprovedVersions.map((version) => (
                    <button
                      key={version.id}
                      type="button"
                      onClick={() =>
                        setSelectedHistoryIds((current) =>
                          current.includes(version.id) ? current.filter((id) => id !== version.id) : [...current, version.id],
                        )
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm",
                        selectedHistoryIds.includes(version.id) ? "border-primary/50 bg-primary/10" : "border-border/40 bg-surface/40",
                      )}
                    >
                      <span>
                        <span className="font-medium">{version.requirementTitle}</span>
                        <span className="block text-xs text-muted-foreground">Version {version.version} / {version.totalTestCases} cases / {version.coverageScore}% coverage</span>
                      </span>
                      <Badge variant="outline" className={cn("text-xs", executionStatusClass(version.reviewStatus))}>{version.reviewStatus}</Badge>
                    </button>
                  )) : (
                    <p className="rounded-lg border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
                      No approved test case versions found for the selected filters.
                    </p>
                  )}
                </div>
              </div>
              <Button onClick={createRun} className="bg-gradient-primary text-primary-foreground">Create Test Run</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="runs" className="space-y-5">
        <TabsList>
          <TabsTrigger value="runs">Test Runs</TabsTrigger>
          <TabsTrigger value="dashboard">Execution Dashboard</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>
        <TabsContent value="runs" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-7">
            {detail && [
              ["Total", detail.totalTestCases],
              ["Passed", detail.passed],
              ["Failed", detail.failed],
              ["Blocked", detail.blocked],
              ["Skipped", detail.skipped],
              ["Not Executed", detail.notExecuted],
              ["Pass Rate", `${detail.passRate}%`],
            ].map(([label, value]) => (
              <Card key={label} className="app-card p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <Card className="app-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Test Runs</h2>
                <Badge variant="outline">{testRuns.length} runs</Badge>
              </div>
              <div className="space-y-3">
                {testRuns.length ? testRuns.map((run) => (
                  <button
                    key={run.id}
                    type="button"
                    onClick={() => onSelectRun(run.id)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-colors",
                      selectedTestRunId === run.id ? "border-primary/50 bg-primary/10" : "border-border/50 bg-surface/40 hover:bg-surface/70",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{run.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{run.projectName} / {run.environment} / {run.buildVersion}</p>
                      </div>
                      <Badge variant="outline" className={executionStatusClass(run.status)}>{run.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-5 gap-2 text-xs text-muted-foreground">
                      <span>P {run.passed}</span><span>F {run.failed}</span><span>B {run.blocked}</span><span>S {run.skipped}</span><span>NE {run.notExecuted}</span>
                    </div>
                    <Progress value={run.progress} className="mt-3 h-2" />
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); onSelectRun(run.id); }}>Start Execution</Button>
                      <Button size="sm" variant="ghost" onClick={(event) => { event.stopPropagation(); onExportRun(run.id, "pdf"); }}>PDF</Button>
                      <Button size="sm" variant="ghost" onClick={(event) => { event.stopPropagation(); onDeleteRun(run.id); }}><Trash2 className="size-4" /></Button>
                    </div>
                  </button>
                )) : (
                  <p className="rounded-xl border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
                    No test runs yet. Create a run from approved test cases.
                  </p>
                )}
              </div>
            </Card>

            <Card className="app-card p-5">
              {detail ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{detail.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{detail.moduleName} / {detail.assignedTester}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onExportRun(detail.id, "excel")}><Download className="size-4" />Excel</Button>
                      <Button size="sm" variant="outline" onClick={() => onExportRun(detail.id, "pdf")}><Download className="size-4" />PDF</Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {detail.executions.map((execution) => {
                      const draft = draftFor(execution);
                      return (
                        <div key={execution.id} className="rounded-xl border border-border/50 bg-surface/35 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{execution.testCaseId}</p>
                              <p className="mt-1 font-semibold">{execution.title}</p>
                              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{execution.description}</p>
                              <p className="mt-2 text-sm"><span className="text-muted-foreground">Expected:</span> {execution.expectedResult}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline" className={priorityClass(execution.priority)}>{execution.priority}</Badge>
                              <Badge variant="outline" className={executionStatusClass(execution.status)}>{execution.status}</Badge>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-12 gap-3">
                            <div className="col-span-12 min-w-0 md:col-span-4 2xl:col-span-2">
                              <Select value={draft.status} onValueChange={(status) => setDraft(execution.id, { status: status as TestExecutionStatus })}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Not Executed", "Passed", "Failed", "Blocked", "Skipped"].map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <Input
                              className="col-span-12 min-w-0 md:col-span-4 2xl:col-span-3"
                              placeholder="Actual result"
                              value={draft.actualResult}
                              onChange={(event) => setDraft(execution.id, { actualResult: event.target.value })}
                            />
                            <Input
                              className="col-span-12 min-w-0 md:col-span-4 2xl:col-span-3"
                              placeholder="Comments"
                              value={draft.comments}
                              onChange={(event) => setDraft(execution.id, { comments: event.target.value })}
                            />
                            <Input
                              className="col-span-12 min-w-0 md:col-span-6 2xl:col-span-2"
                              placeholder="Bug ID"
                              value={draft.bugId}
                              onChange={(event) => setDraft(execution.id, { bugId: event.target.value })}
                            />
                            <Button
                              className="col-span-12 md:col-span-6 2xl:col-span-2"
                              onClick={() => onUpdateExecution(execution, draft)}
                            >
                              Update
                            </Button>
                          </div>
                          <details className="mt-4 rounded-lg border border-border/40 bg-background/60 p-4">
                            <summary className="cursor-pointer text-sm font-semibold">Execution Evidence</summary>
                            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                              <Input
                                placeholder="Screenshot URL"
                                value={draft.screenshotUrl}
                                onChange={(event) => setDraft(execution.id, { screenshotUrl: event.target.value })}
                              />
                              <Input
                                placeholder="Video URL"
                                value={draft.videoUrl}
                                onChange={(event) => setDraft(execution.id, { videoUrl: event.target.value })}
                              />
                              <Input
                                placeholder="Log file URL"
                                value={draft.logUrl}
                                onChange={(event) => setDraft(execution.id, { logUrl: event.target.value })}
                              />
                              <Input
                                placeholder="Jira Bug ID"
                                value={draft.jiraBugId}
                                onChange={(event) => setDraft(execution.id, { jiraBugId: event.target.value, bugId: event.target.value })}
                              />
                              <Input
                                placeholder="Jira Bug URL"
                                value={draft.jiraBugUrl}
                                onChange={(event) => setDraft(execution.id, { jiraBugUrl: event.target.value })}
                              />
                              <Input
                                type="number"
                                min="0"
                                placeholder="Execution time in minutes"
                                value={draft.executionTime}
                                onChange={(event) => setDraft(execution.id, { executionTime: event.target.value })}
                              />
                              <Select value={draft.browser || "none"} onValueChange={(browser) => setDraft(execution.id, { browser: browser === "none" ? "" : browser as ExecutionEvidenceDraft["browser"] })}>
                                <SelectTrigger><SelectValue placeholder="Browser" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Browser not set</SelectItem>
                                  {["Chrome", "Firefox", "Safari", "Edge"].map((browser) => <SelectItem key={browser} value={browser}>{browser}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select value={draft.operatingSystem || "none"} onValueChange={(operatingSystem) => setDraft(execution.id, { operatingSystem: operatingSystem === "none" ? "" : operatingSystem as ExecutionEvidenceDraft["operatingSystem"] })}>
                                <SelectTrigger><SelectValue placeholder="Operating System" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">OS not set</SelectItem>
                                  {["Windows", "macOS", "Linux", "Android", "iOS"].map((operatingSystem) => <SelectItem key={operatingSystem} value={operatingSystem}>{operatingSystem}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Build number"
                                value={draft.buildNumber}
                                onChange={(event) => setDraft(execution.id, { buildNumber: event.target.value })}
                              />
                              <Select value={draft.environment || "QA"} onValueChange={(environment) => setDraft(execution.id, { environment: environment as ExecutionEvidenceDraft["environment"] })}>
                                <SelectTrigger><SelectValue placeholder="Environment" /></SelectTrigger>
                                <SelectContent>{["QA", "UAT", "Staging", "Production"].map((environment) => <SelectItem key={environment} value={environment}>{environment}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                            <p className="mt-3 text-xs leading-5 text-muted-foreground">
                              Failed tests require actual result, comments, and screenshot/log/Jira evidence. Blocked tests require comments or blocker reason.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                              {execution.screenshotUrl && <a className="text-primary underline" href={execution.screenshotUrl} target="_blank" rel="noreferrer">Screenshot</a>}
                              {execution.videoUrl && <a className="text-primary underline" href={execution.videoUrl} target="_blank" rel="noreferrer">Video</a>}
                              {execution.logUrl && <a className="text-primary underline" href={execution.logUrl} target="_blank" rel="noreferrer">Log</a>}
                              {execution.jiraBugUrl && <a className="text-primary underline" href={execution.jiraBugUrl} target="_blank" rel="noreferrer">Jira Bug</a>}
                            </div>
                          </details>
                          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Executed by {execution.executedBy ?? "-"}</span>
                            <span>{execution.executedAt ? formatDate(execution.executedAt) : "Not executed"}</span>
                            <button className="text-primary" onClick={() => onLoadExecutionHistory(execution.id)}>View history</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border/50 p-10 text-center text-sm text-muted-foreground">
                  Select a test run to view and update executions.
                </p>
              )}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="dashboard" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["Total Runs", dashboard?.totalTestRuns ?? 0],
              ["Active", dashboard?.activeTestRuns ?? 0],
              ["Completed", dashboard?.completedTestRuns ?? 0],
              ["Pass Rate", `${dashboard?.passRate ?? 0}%`],
              ["Failed", dashboard?.failedTestCases ?? 0],
              ["Blocked", dashboard?.blockedTestCases ?? 0],
              ["Failed w/ Evidence", dashboard?.failedTestsWithEvidence ?? 0],
              ["Linked Bugs", dashboard?.testsLinkedToBugs ?? 0],
              ["Avg Exec Time", `${dashboard?.averageExecutionTime ?? 0}m`],
            ].map(([label, value]) => (
              <Card key={label} className="app-card p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="app-card p-5">
              <h3 className="font-semibold">Pass vs Fail</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dashboard?.passFailChart ?? []} dataKey="value" nameKey="name" outerRadius={90} label>
                      {(dashboard?.passFailChart ?? []).map((_, index) => <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="app-card p-5">
              <h3 className="font-semibold">Daily Execution Trend</h3>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard?.dailyExecutionTrend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="executions" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.18} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          <Card className="app-card p-5">
            <h3 className="font-semibold">Tester-wise Execution Summary</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(dashboard?.testerSummary ?? []).map((tester) => (
                <div key={tester.tester} className="rounded-xl border border-border/50 bg-surface/40 p-4">
                  <p className="font-medium">{tester.tester}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Executed {tester.total} / Passed {tester.passed} / Failed {tester.failed}</p>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="app-card p-5">
              <h3 className="font-semibold">Browser-wise Failures</h3>
              <div className="mt-4 space-y-2">
                {(dashboard?.browserWiseFailures ?? []).length ? dashboard?.browserWiseFailures?.map((item) => (
                  <div key={item.browser} className="flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 px-3 py-2 text-sm">
                    <span>{item.browser}</span><Badge variant="outline">{item.failures}</Badge>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No browser failure data yet.</p>}
              </div>
            </Card>
            <Card className="app-card p-5">
              <h3 className="font-semibold">OS-wise Failures</h3>
              <div className="mt-4 space-y-2">
                {(dashboard?.osWiseFailures ?? []).length ? dashboard?.osWiseFailures?.map((item) => (
                  <div key={item.operatingSystem} className="flex items-center justify-between rounded-lg border border-border/40 bg-surface/40 px-3 py-2 text-sm">
                    <span>{item.operatingSystem}</span><Badge variant="outline">{item.failures}</Badge>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No OS failure data yet.</p>}
              </div>
            </Card>
            <Card className="app-card p-5">
              <h3 className="font-semibold">Build-wise Pass Rate</h3>
              <div className="mt-4 space-y-2">
                {(dashboard?.buildWisePassRate ?? []).length ? dashboard?.buildWisePassRate?.map((item) => (
                  <div key={item.buildNumber} className="rounded-lg border border-border/40 bg-surface/40 p-3 text-sm">
                    <div className="mb-2 flex items-center justify-between"><span>{item.buildNumber}</span><span>{item.passRate}%</span></div>
                    <Progress value={item.passRate} className="h-2" />
                  </div>
                )) : <p className="text-sm text-muted-foreground">No build pass-rate data yet.</p>}
              </div>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card className="app-card p-5">
            <h2 className="font-semibold">Execution History</h2>
            <div className="mt-4 space-y-3">
              {historyItems.length ? historyItems.map((item) => (
                <div key={item.id} className="rounded-xl border border-border/50 bg-surface/40 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{item.oldStatus}</Badge>
                    <span className="text-xs text-muted-foreground">to</span>
                    <Badge variant="outline" className={executionStatusClass(item.newStatus)}>{item.newStatus}</Badge>
                    <span className="ml-auto text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm">Updated by {item.updatedBy}</p>
                  {item.comment && <p className="mt-1 text-sm text-muted-foreground">{item.comment}</p>}
                  {item.bugId && <p className="mt-1 text-xs text-muted-foreground">Bug: {item.bugId}</p>}
                </div>
              )) : (
                <p className="rounded-xl border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
                  Select “View history” on an execution row to see status changes.
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const QUICK_CHAT_PROMPTS = [
  "What test cases are missing?",
  "Improve coverage score",
  "Generate more security test cases",
  "Generate API test cases",
  "Suggest edge cases",
  "Create regression test cases",
  "Explain this requirement",
  "Generate Playwright tests",
];

function AIChatPage({
  projects,
  projectDetail,
  selectedProjectId,
  selectedModuleId,
  selectedRequirementId,
  activeChat,
  chatHistory,
  message,
  selectedHistoryVersionId,
  isLoading,
  onProjectChange,
  onModuleChange,
  onRequirementChange,
  onMessageChange,
  onHistoryVersionChange,
  onSend,
  onOpenChat,
  onDeleteChat,
  onNewChat,
  onSaveAsVersion,
}: {
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
  selectedProjectId: string;
  selectedModuleId: string;
  selectedRequirementId: string;
  activeChat: AIChat | null;
  chatHistory: AIChatSummary[];
  message: string;
  selectedHistoryVersionId: string;
  isLoading: boolean;
  onProjectChange: (projectId: string) => void;
  onModuleChange: (moduleId: string) => void;
  onRequirementChange: (requirementId: string) => void;
  onMessageChange: (message: string) => void;
  onHistoryVersionChange: (historyVersionId: string) => void;
  onSend: (prompt?: string) => void;
  onOpenChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  onSaveAsVersion: () => void;
}) {
  const modules = projectDetail?.modules.filter((moduleItem) => moduleItem.status === "Active") ?? [];
  const requirements =
    projectDetail?.requirements.filter((item) => item.moduleId === selectedModuleId) ?? [];
  const versions =
    projectDetail?.histories
      .filter((item) => item.requirementId === selectedRequirementId)
      .sort((a, b) => b.version - a.version) ?? [];
  const hasContext = selectedProjectId && selectedModuleId && selectedRequirementId;

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
          <Bot className="mr-1 size-3" /> Context-aware QA assistant
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">AI Chat</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Chat with AI using the selected project, module, requirement, and generated test cases as context.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban className="size-4 text-primary" />
                <h2 className="font-semibold">Context</h2>
              </div>
              <Button variant="outline" size="sm" onClick={onNewChat}>
                <Plus className="size-3.5" />
                New
              </Button>
            </div>
            <div className="space-y-3">
              <Select value={selectedProjectId} onValueChange={onProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedModuleId} onValueChange={onModuleChange} disabled={!selectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((moduleItem) => (
                    <SelectItem key={moduleItem.id} value={moduleItem.id}>
                      {moduleItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedRequirementId}
                onValueChange={onRequirementChange}
                disabled={!selectedModuleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select requirement" />
                </SelectTrigger>
                <SelectContent>
                  {requirements.map((requirement) => (
                    <SelectItem key={requirement.id} value={requirement.id}>
                      {requirement.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={(activeChat?.historyVersionId ?? selectedHistoryVersionId) || "latest"}
                onValueChange={(value) => onHistoryVersionChange(value === "latest" ? "" : value)}
                disabled={!versions.length || Boolean(activeChat)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Latest test version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest generated version</SelectItem>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      Version {version.version} ({version.coverageScore}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <h2 className="font-semibold">Previous Chats</h2>
            </div>
            {chatHistory.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border/50 p-5 text-sm text-muted-foreground">
                No chat history yet.
              </p>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="rounded-lg border border-border/40 bg-surface/40 p-3">
                    <p className="text-sm font-medium">{chat.requirementTitle}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{chat.lastMessage}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(chat.updatedAt)}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onOpenChat(chat.id)}>
                        View Chat
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteChat(chat.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="flex min-h-[720px] min-w-0 flex-col overflow-hidden border-border/60 bg-card/70 backdrop-blur-xl shadow-card">
          {!hasContext ? (
            <div className="flex flex-1 items-center justify-center p-10 text-center">
              <div>
                <Bot className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 font-medium">Select a project, module, and requirement to start chatting.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI answers will be limited to the selected requirement context.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-border/40 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{activeChat?.title ?? "New requirement chat"}</h2>
                    <p className="text-xs text-muted-foreground">
                      {projectDetail?.project.name} / {modules.find((item) => item.id === selectedModuleId)?.name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSaveAsVersion}
                    disabled={!activeChat || isLoading}
                  >
                    <History className="size-3.5" />
                    Save as New Version
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK_CHAT_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      onClick={() => onSend(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-5 overflow-y-auto p-5 md:p-6">
                {!activeChat?.messages.length ? (
                  <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
                    <Bot className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Ask about missing cases, risks, coverage, security testing, API scenarios, or Playwright code.
                    </p>
                  </div>
                ) : (
                  activeChat.messages.map((chatItem, index) => (
                    <ChatBubble key={`${chatItem.createdAt}-${index}`} message={chatItem} />
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg border border-border/40 bg-surface/50 p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        AI Copilot
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="size-2 animate-pulse rounded-full bg-primary" />
                        <span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                        <span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                        <span className="ml-2">Analyzing selected requirement context...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border/40 p-5 md:p-6">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                  <Textarea
                    value={message}
                    onChange={(event) => onMessageChange(event.target.value)}
                    placeholder="Ask AI about this requirement..."
                    className="min-h-[72px] flex-1 resize-none border-border/60 bg-input/40"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) onSend();
                    }}
                  />
                  <Button
                    className="self-end bg-gradient-primary text-primary-foreground shadow-glow sm:shrink-0"
                    disabled={isLoading || !message.trim()}
                    onClick={() => onSend()}
                  >
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: { role: "user" | "assistant"; content: string } }) {
  const isUser = message.role === "user";
  const copy = () => {
    navigator.clipboard.writeText(message.content);
    toast.success("Copied response");
  };

  return (
    <div className={cn("flex min-w-0", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "min-w-0 max-w-[92%] overflow-hidden rounded-xl border p-4 text-sm shadow-sm md:max-w-[86%] md:p-5",
          isUser
            ? "border-primary/40 bg-primary/10"
            : "border-border/60 bg-surface/50",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {isUser ? "You" : "AI Copilot"}
          </span>
          {!isUser && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy response">
                <Copy className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast.success("Marked helpful")} aria-label="Like response">
                <CheckCircle2 className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast.message("Feedback noted")} aria-label="Dislike response">
                <XCircle className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
        <div className="min-w-0 overflow-hidden">
          <MarkdownLite content={message.content} />
        </div>
      </div>
    </div>
  );
}

function MarkdownLite({ content }: { content: string }) {
  const blocks = content.split(/```/);
  return (
    <div className="min-w-0 space-y-4">
      {blocks.map((block, index) => {
        if (index % 2 === 1) {
          const code = block.replace(/^[a-zA-Z]+\n/, "");
          return (
            <div key={index} className="min-w-0 overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950">
              <div className="flex justify-end border-b border-slate-700/80 px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-200 hover:bg-slate-800 hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast.success("Copied code");
                  }}
                >
                  <Copy className="size-3.5" />
                  Copy code
                </Button>
              </div>
              <pre className="max-w-full overflow-x-auto p-4 font-mono text-xs leading-5 text-slate-100">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        return (
          <div key={index} className="max-w-full whitespace-pre-wrap break-words leading-7 [overflow-wrap:anywhere]">
            {block}
          </div>
        );
      })}
    </div>
  );
}

function Hero() {
  const proofPoints = [
    { label: "Coverage scoring", value: "Live" },
    { label: "Review workflow", value: "Ready" },
    { label: "Export reports", value: "PDF/XLSX" },
  ];
  return (
    <Card id="generator" className="app-card p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1 size-3" /> AI-powered QA workflow
          </Badge>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">
            Turn requirements into governed, export-ready QA assets.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            Generate test cases, acceptance criteria, test data, coverage insight, Playwright skeletons, and review-ready versions in one workspace.
          </p>
        </div>
        <div className="grid min-w-[280px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {proofPoints.map((item) => (
            <div key={item.label} className="rounded-lg border border-border/40 bg-surface/40 p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-display text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function FeatureGrid() {
  const items = [
    { icon: CheckCircle2, label: "Positive cases", color: "text-success" },
    { icon: XCircle, label: "Negative cases", color: "text-destructive" },
    { icon: AlertTriangle, label: "Edge cases", color: "text-warning" },
    { icon: Database, label: "Test data", color: "text-accent" },
    { icon: ClipboardCheck, label: "Acceptance criteria", color: "text-primary" },
    { icon: Code2, label: "Playwright skeleton", color: "text-primary-glow" },
  ];
  return (
    <Card id="features" className="border-border/50 bg-card/60 p-6 backdrop-blur-xl shadow-card">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary" />
        <h2 className="text-base font-semibold">What you get</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-border/40 bg-surface/40 px-3 py-3 transition-colors hover:border-primary/40 hover:bg-surface-elevated/60"
          >
            <Icon className={cn("size-4", color)} />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Rocket className="mt-0.5 size-4 text-primary" />
          <div>
            <p className="text-sm font-medium">Built for QA, Dev & BA teams</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Slash test-design time. Standardize coverage. Ship faster with confidence.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="app-card p-10">
      <ProfessionalEmptyState
        icon={Beaker}
        title="No test plan generated yet"
        message="Select a project and module, enter a requirement, and generate a structured QA pack ready for review and export."
        actionLabel="Start with Generate & Save Test Cases"
      />
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <Card className="app-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Loader2 className="size-5 animate-spin" />
        </div>
        <div>
          <p className="font-semibold">AI is building your QA pack</p>
          <p className="text-sm text-muted-foreground">Analyzing requirement, scenarios, risks, and coverage.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        <Skeleton className="h-3 w-full shimmer" />
        <Skeleton className="h-3 w-4/5 shimmer" />
        <Skeleton className="h-24 w-full shimmer" />
        <Skeleton className="h-24 w-full shimmer" />
      </div>
    </Card>
  );
}

function priorityClass(p: TestCase["priority"]) {
  switch (p) {
    case "High":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Medium":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-muted-foreground/30 bg-muted/30 text-muted-foreground";
  }
}

function riskLevelClass(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case "High":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Medium":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-success/40 bg-success/10 text-success";
  }
}

function regressionPriorityClass(priority: RegressionPriority) {
  switch (priority) {
    case "High":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Medium":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-success/40 bg-success/10 text-success";
  }
}

function releaseRecommendationClass(status: ReleaseRecommendationStatus) {
  switch (status) {
    case "Full Regression Testing Required":
      return "border-destructive/40 bg-destructive/10 text-destructive";
    case "Release with Caution":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-success/40 bg-success/10 text-success";
  }
}

function coverageStatusClass(status: CoverageStatus | OverallCoverageStatus) {
  switch (status) {
    case "Excellent":
    case "Covered":
      return "border-success/40 bg-success/10 text-success";
    case "Good":
      return "border-primary/40 bg-primary/10 text-primary";
    case "Fair":
    case "Partial":
      return "border-warning/40 bg-warning/10 text-warning";
    default:
      return "border-destructive/40 bg-destructive/10 text-destructive";
  }
}

function CaseList({ cases, accent }: { cases: TestCase[]; accent: string }) {
  if (!cases?.length) {
    return <p className="text-sm text-muted-foreground">No cases generated.</p>;
  }
  return (
    <div className="space-y-3">
      {cases.map((tc) => (
        <div
          key={tc.id}
          className="rounded-lg border border-border/40 bg-surface/40 p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={cn("rounded-md border px-2 py-0.5 font-mono text-xs", accent)}>
                {tc.id}
              </span>
              <h4 className="text-sm font-semibold">{tc.title}</h4>
            </div>
            <Badge variant="outline" className={cn("text-xs", priorityClass(tc.priority))}>
              {tc.priority}
            </Badge>
          </div>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary">
            {tc.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <div className="mt-3 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-xs">
            <span className="font-semibold text-success">Expected: </span>
            <span className="text-foreground/90">{tc.expected}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExportDropdown({
  label = "Export",
  disabled,
  onExport,
}: {
  label?: string;
  disabled?: boolean;
  onExport: (format: ExportFormat) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="border-border/60">
          {disabled ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onExport("excel")}>
          <Download className="size-4" />
          Export as Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("pdf")}>
          <Download className="size-4" />
          Export as PDF (.pdf)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Results({
  plan,
  onExport,
  isExporting,
  githubConfig,
  repositoryAnalysis,
  isPushingPlaywright,
  onPushPlaywright,
  validationJob,
  isValidatingPlaywright,
  onValidatePlaywright,
}: {
  plan: TestPlan;
  onExport?: (format: ExportFormat) => void;
  isExporting?: boolean;
  githubConfig?: GitHubAutomationConfig | null;
  repositoryAnalysis?: RepositoryAnalysis | null;
  isPushingPlaywright?: boolean;
  onPushPlaywright?: (fileName: string) => void;
  validationJob?: PlaywrightValidationJob | null;
  isValidatingPlaywright?: boolean;
  onValidatePlaywright?: (fileName: string) => void;
}) {
  const [isGitHubDialogOpen, setIsGitHubDialogOpen] = useState(false);
  const defaultSpecExtension = repositoryAnalysis?.language === "JavaScript" ? "js" : "ts";
  const [githubFileName, setGithubFileName] = useState(`generated-playwright.spec.${defaultSpecExtension}`);
  useEffect(() => {
    setGithubFileName((current) => current === "generated-playwright.spec.ts" || current === "generated-playwright.spec.js"
      ? `generated-playwright.spec.${defaultSpecExtension}`
      : current);
  }, [defaultSpecExtension]);
  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
    toast.success("Copied JSON to clipboard");
  };
  const copyPlaywright = () => {
    navigator.clipboard.writeText(plan.playwright);
    toast.success("Copied Playwright test to clipboard");
  };
  const validationStatus = validationJob?.result?.status ?? validationJob?.status;
  const validationTone =
    validationStatus === "Passed"
      ? "border-success/30 bg-success/10 text-success"
      : validationStatus === "Warning"
        ? "border-warning/30 bg-warning/10 text-warning"
        : validationStatus === "Failed" || validationStatus === "Error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-primary/30 bg-primary/10 text-primary";

  return (
    <Card className="min-w-0 overflow-hidden border-border/50 bg-card/70 p-6 backdrop-blur-xl shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="font-display text-xl font-semibold">Generated Test Plan</h2>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onExport && <ExportDropdown disabled={isExporting} onExport={onExport} />}
          <Button variant="outline" size="sm" onClick={copyJson} className="border-border/60">
            <Copy className="size-3.5" /> Copy JSON
          </Button>
        </div>
      </div>

      <Tabs defaultValue="positive" className="mt-6 max-w-full overflow-hidden">
        <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto overflow-y-hidden bg-surface/60 p-1">
          <TabsTrigger value="positive" className="shrink-0 whitespace-nowrap text-sm">
            <CheckCircle2 className="size-3.5 text-success" /> Positive (
            {plan.positive?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="negative" className="shrink-0 whitespace-nowrap text-sm">
            <XCircle className="size-3.5 text-destructive" /> Negative ({plan.negative?.length ?? 0}
            )
          </TabsTrigger>
          <TabsTrigger value="edge" className="shrink-0 whitespace-nowrap text-sm">
            <AlertTriangle className="size-3.5 text-warning" /> Edge ({plan.edge?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="data" className="shrink-0 whitespace-nowrap text-sm">
            <Database className="size-3.5 text-accent" /> Test Data
          </TabsTrigger>
          <TabsTrigger value="criteria" className="shrink-0 whitespace-nowrap text-sm">
            <ClipboardCheck className="size-3.5 text-primary" /> Acceptance Criteria
          </TabsTrigger>
          <TabsTrigger value="code" className="shrink-0 whitespace-nowrap text-sm">
            <Code2 className="size-3.5 text-primary-glow" /> Playwright
          </TabsTrigger>
          <TabsTrigger value="regression" className="shrink-0 whitespace-nowrap text-sm">
            <Layers className="size-3.5 text-primary" /> Regression Impact Analysis
          </TabsTrigger>
          <TabsTrigger value="coverage" className="shrink-0 whitespace-nowrap text-sm">
            <Gauge className="size-3.5 text-success" /> Test Coverage Score
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positive" className="mt-4 max-w-full overflow-hidden">
          <CaseList cases={plan.positive} accent="border-success/40 bg-success/10 text-success" />
        </TabsContent>
        <TabsContent value="negative" className="mt-4 max-w-full overflow-hidden">
          <CaseList
            cases={plan.negative}
            accent="border-destructive/40 bg-destructive/10 text-destructive"
          />
        </TabsContent>
        <TabsContent value="edge" className="mt-4 max-w-full overflow-hidden">
          <CaseList cases={plan.edge} accent="border-warning/40 bg-warning/10 text-warning" />
        </TabsContent>

        <TabsContent value="data" className="mt-4 max-w-full overflow-hidden">
          {plan.testData?.length ? (
            <div className="overflow-hidden rounded-lg border border-border/40">
              <table className="w-full text-sm">
                <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left">Field</th>
                    <th className="px-3 py-2 text-left">Valid</th>
                    <th className="px-3 py-2 text-left">Invalid</th>
                    <th className="px-3 py-2 text-left">Boundary</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.testData.map((d, i) => (
                    <tr key={i} className="border-t border-border/40 align-top">
                      <td className="px-3 py-2 font-mono text-xs text-primary">{d.field}</td>
                      <td className="px-3 py-2 text-xs">{d.valid?.join(", ")}</td>
                      <td className="px-3 py-2 text-xs">{d.invalid?.join(", ")}</td>
                      <td className="px-3 py-2 text-xs">{d.boundary?.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No test data suggestions.</p>
          )}
        </TabsContent>

        <TabsContent value="criteria" className="mt-4 max-w-full overflow-hidden">
          {plan.acceptanceCriteria?.length > 0 ? (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <ClipboardCheck className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Acceptance Criteria</h3>
              </div>
              <ul className="space-y-1.5 text-sm">
                {plan.acceptanceCriteria.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No acceptance criteria generated.</p>
          )}
        </TabsContent>

        <TabsContent value="code" className="mt-4 max-w-full overflow-hidden">
          <div className="mb-4 max-w-full overflow-hidden rounded-lg border border-border/50 bg-surface/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">AI Test Validation</h3>
                  {validationStatus && (
                    <Badge variant="outline" className={validationTone}>
                      {validationStatus}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 max-w-4xl break-words text-sm leading-6 text-muted-foreground">
                  Validate generated Playwright code for structure, assertions, locator quality, and PR readiness before pushing to GitHub.
                </p>
              </div>
              {onValidatePlaywright && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onValidatePlaywright(githubFileName || `generated-playwright.spec.${defaultSpecExtension}`)}
                  disabled={isValidatingPlaywright}
                >
                  {isValidatingPlaywright ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                  Run AI Test Validation
                </Button>
              )}
            </div>

            {validationJob?.result ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
                <div className="rounded-md border border-border/40 bg-card/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Validation Score</p>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-3xl font-semibold">{validationJob.result.score}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
                  </div>
                  <Progress value={validationJob.result.score} className="mt-3 h-2" />
                  <p className="mt-3 text-sm text-muted-foreground">{validationJob.result.summary}</p>
                </div>
                <div className="space-y-3">
                  {validationJob.result.issues.length > 0 ? (
                    validationJob.result.issues.map((issue) => (
                      <div key={issue.id} className="rounded-md border border-border/40 bg-card/70 p-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={
                            issue.severity === "Error"
                              ? "border-destructive/30 bg-destructive/10 text-destructive"
                              : issue.severity === "Warning"
                                ? "border-warning/30 bg-warning/10 text-warning"
                                : "border-primary/30 bg-primary/10 text-primary"
                          }>
                            {issue.severity}
                          </Badge>
                          <span className="font-medium">{issue.category}</span>
                          {issue.line && <span className="text-xs text-muted-foreground">Line {issue.line}</span>}
                        </div>
                        <p className="mt-2 text-foreground">{issue.message}</p>
                        <p className="mt-1 text-muted-foreground">{issue.recommendation}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
                      No blocking validation issues were found.
                    </div>
                  )}
                  {validationJob.result.recommendations.length > 0 && (
                    <div className="rounded-md border border-border/40 bg-card/70 p-3">
                      <p className="text-sm font-medium">Reviewer Notes</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {validationJob.result.recommendations.map((recommendation) => (
                          <li key={recommendation} className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-dashed border-border/60 bg-card/40 p-3 text-sm text-muted-foreground">
                Run validation to review Playwright quality before creating a GitHub pull request.
              </div>
            )}
          </div>

          <div className="max-w-full overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 px-4 py-2">
              <span className="font-mono text-xs text-slate-300">playwright.spec.ts</span>
              <div className="flex flex-wrap gap-2">
                {onPushPlaywright && (
                  <Dialog open={isGitHubDialogOpen} onOpenChange={setIsGitHubDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-slate-800 hover:text-white">
                        <Github className="size-3.5" /> Push to GitHub
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Push Playwright Test to GitHub</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {githubConfig ? (
                          <>
                            <div className="rounded-lg border border-border/40 bg-surface/40 p-3 text-sm">
                              <p className="font-medium">{githubConfig.owner}/{githubConfig.repo}</p>
                              <p className="mt-1 text-muted-foreground">A new branch and pull request will be created from <span className="font-mono">{githubConfig.defaultBranch}</span>.</p>
                            </div>
                            <Input
                              value={githubFileName}
                              onChange={(event) => setGithubFileName(event.target.value)}
                              placeholder="login.spec.ts"
                            />
                            <p className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
                              Target path: <span className="font-mono text-foreground">{repositoryAnalysis?.testFolderPath || githubConfig.testFolderPath}/{githubFileName || `file.spec.${defaultSpecExtension}`}</span>
                            </p>
                            <p className={cn("rounded-md border p-3 text-sm", validationTone)}>
                              Validation status: <strong>{validationStatus || "Not Run"}</strong>
                              {validationJob?.result ? ` · Score ${validationJob.result.score}/100` : " · Run AI Test Validation before creating the PR for best results."}
                            </p>
                            {repositoryAnalysis && (
                              <div className="grid gap-2 rounded-md border border-border/40 bg-surface/40 p-3 text-xs text-muted-foreground sm:grid-cols-2">
                                <span>Framework: <strong className="text-foreground">{repositoryAnalysis.framework}</strong></span>
                                <span>Language: <strong className="text-foreground">{repositoryAnalysis.language}</strong></span>
                                <span>Pattern: <strong className="text-foreground">{repositoryAnalysis.pattern}</strong></span>
                                <span>Confidence: <strong className="text-foreground">{repositoryAnalysis.confidenceScore}%</strong></span>
                              </div>
                            )}
                            <p className="text-xs leading-5 text-muted-foreground">
                              If this file already exists, AI QA Copilot will stop and ask you to rename it. It will not overwrite silently.
                            </p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setIsGitHubDialogOpen(false)}>Cancel</Button>
                              <Button
                                onClick={() => {
                                  onPushPlaywright(githubFileName);
                                  setIsGitHubDialogOpen(false);
                                }}
                                disabled={isPushingPlaywright || !githubFileName}
                              >
                                {isPushingPlaywright ? <Loader2 className="size-4 animate-spin" /> : <GitBranch className="size-4" />}
                                Create PR
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                            Please configure GitHub repository integration first in Repository Intelligence → Automation Repository.
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="ghost" size="sm" className="text-slate-200 hover:bg-slate-800 hover:text-white" onClick={copyPlaywright}>
                  <Copy className="size-3.5" /> Copy
                </Button>
              </div>
            </div>
            <pre className="max-h-[520px] max-w-full overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-100">
              <code>{plan.playwright}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="regression" className="mt-4 max-w-full overflow-hidden">
          <RegressionImpactAnalysisTab analysis={plan.regressionImpact} />
        </TabsContent>

        <TabsContent value="coverage" className="mt-4 max-w-full overflow-hidden">
          <TestCoverageScoreTab analysis={plan.coverageAnalysis} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function TestCoverageScoreTab({ analysis }: { analysis: TestCoverageScoreAnalysis }) {
  return (
    <div className="space-y-5">
      <CoverageSummaryCard analysis={analysis} />
      <div className="grid gap-5 lg:grid-cols-2">
        <CoverageAreasCard
          title="Covered Areas"
          icon="check"
          areas={analysis.coveredAreas}
          emptyText="No fully covered areas detected yet."
        />
        <CoverageAreasCard
          title="Missing Test Areas"
          icon="warning"
          areas={analysis.missingAreas}
          emptyText="No missing areas detected."
        />
      </div>
      <CoverageBreakdownTable analysis={analysis} />
      <CoverageRecommendationsCard recommendations={analysis.recommendations} />
    </div>
  );
}

function CoverageSummaryCard({ analysis }: { analysis: TestCoverageScoreAnalysis }) {
  const summaryItems = [
    { label: "Total Test Cases", value: String(analysis.totalGeneratedTestCases) },
    { label: "Covered Areas", value: String(analysis.coveredAreas.length) },
    { label: "Missing Areas", value: String(analysis.missingAreas.length) },
    { label: "Coverage Score", value: `${analysis.coverageScore}%` },
  ];

  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-success" />
            <h3 className="text-sm font-semibold">Coverage Summary</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Overall requirement coverage based on generated test scenarios
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn("text-sm", coverageStatusClass(analysis.coverageStatus))}
        >
          {analysis.coverageStatus}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="rounded-lg border border-border/40 bg-card/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Coverage Score</span>
          <span className="font-mono text-xs text-muted-foreground">{analysis.coverageScore}%</span>
        </div>
        <Progress value={analysis.coverageScore} className="h-2.5" />
      </div>
    </div>
  );
}

function CoverageAreasCard({
  title,
  icon,
  areas,
  emptyText,
}: {
  title: string;
  icon: "check" | "warning";
  areas: string[];
  emptyText: string;
}) {
  const Icon = icon === "check" ? CheckCircle2 : AlertTriangle;
  const iconClass = icon === "check" ? "text-success" : "text-warning";

  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("size-4", iconClass)} />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {areas.length ? (
        <ul className="space-y-2">
          {areas.map((area) => (
            <li key={area} className="flex items-start gap-2 text-sm">
              <Icon className={cn("mt-0.5 size-4 shrink-0", iconClass)} />
              <span>{area}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );
}

function CoverageBreakdownTable({ analysis }: { analysis: TestCoverageScoreAnalysis }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40">
      <div className="flex items-center gap-2 border-b border-border/40 bg-surface/60 px-4 py-3">
        <CircleHelp className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Coverage Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Coverage Status</th>
              <th className="px-3 py-2 text-left">Coverage Percentage</th>
            </tr>
          </thead>
          <tbody>
            {analysis.breakdown.map((item) => (
              <tr key={item.category} className="border-t border-border/40 align-top">
                <td className="px-3 py-3 font-medium">{item.category}</td>
                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", coverageStatusClass(item.status))}
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex min-w-[180px] items-center gap-3">
                    <Progress value={item.percentage} className="h-2" />
                    <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">
                      {item.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CoverageRecommendationsCard({ recommendations }: { recommendations: string[] }) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Coverage Recommendations</h3>
      </div>
      <ul className="space-y-2">
        {recommendations.map((recommendation) => (
          <li key={recommendation} className="flex items-start gap-2 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
            <span>{recommendation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RegressionImpactAnalysisTab({ analysis }: { analysis: RegressionImpactAnalysis }) {
  return (
    <div className="space-y-5">
      <ImpactSummaryCards analysis={analysis} />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ImpactedModulesList impactedModules={analysis.impactedModules} />
        <RiskAssessmentCard analysis={analysis} />
      </div>
      <RegressionAreasTable regressionAreas={analysis.regressionAreas} />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <QAFocusChecklist qaFocusAreas={analysis.qaFocusAreas} />
        <ReleaseRecommendationCard analysis={analysis} />
      </div>
    </div>
  );
}

function ImpactSummaryCards({ analysis }: { analysis: RegressionImpactAnalysis }) {
  const summaryCards = [
    {
      label: "Risk Level",
      value: analysis.riskLevel,
      detail: "Overall change impact",
      badgeClass: riskLevelClass(analysis.riskLevel),
    },
    {
      label: "Risk Score",
      value: `${analysis.riskScore}/100`,
      detail: "Keyword-based estimate",
      badgeClass: "border-primary/40 bg-primary/10 text-primary",
    },
    {
      label: "Impacted Modules",
      value: String(analysis.impactedModules.length),
      detail: "Modules and flows",
      badgeClass: "border-accent/40 bg-accent/10 text-accent",
    },
    {
      label: "Regression Areas",
      value: String(analysis.regressionAreas.length),
      detail: "Recommended coverage",
      badgeClass: "border-warning/40 bg-warning/10 text-warning",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => (
        <div key={card.label} className="rounded-lg border border-border/40 bg-surface/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {card.label}
          </p>
          <div className="mt-3">
            <Badge variant="outline" className={cn("text-sm", card.badgeClass)}>
              {card.value}
            </Badge>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{card.detail}</p>
        </div>
      ))}
    </div>
  );
}

function ImpactedModulesList({ impactedModules }: { impactedModules: string[] }) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Impacted Modules</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {impactedModules.map((module) => (
          <Badge
            key={module}
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary"
          >
            {module}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function RegressionAreasTable({
  regressionAreas,
}: {
  regressionAreas: RegressionImpactAnalysis["regressionAreas"];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/40">
      <div className="flex items-center gap-2 border-b border-border/40 bg-surface/60 px-4 py-3">
        <ClipboardCheck className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Regression Test Areas</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Area</th>
              <th className="px-3 py-2 text-left">Priority</th>
              <th className="px-3 py-2 text-left">Recommended Test Coverage</th>
            </tr>
          </thead>
          <tbody>
            {regressionAreas.map((item) => (
              <tr key={item.area} className="border-t border-border/40 align-top">
                <td className="px-3 py-3 font-medium">{item.area}</td>
                <td className="px-3 py-3">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", regressionPriorityClass(item.priority))}
                  >
                    {item.priority}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{item.coverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RiskAssessmentCard({ analysis }: { analysis: RegressionImpactAnalysis }) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning" />
            <h3 className="text-sm font-semibold">Risk Assessment</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Regression risk for this change</p>
        </div>
        <Badge variant="outline" className={cn("text-xs", riskLevelClass(analysis.riskLevel))}>
          {analysis.riskLevel}
        </Badge>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Risk Score</span>
          <span className="font-mono text-xs text-muted-foreground">{analysis.riskScore}/100</span>
        </div>
        <Progress value={analysis.riskScore} className="h-2.5" />
      </div>
      <div className="mt-4 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-sm">
        <span className="font-semibold text-warning">Reason: </span>
        <span className="text-foreground/90">{analysis.riskReason}</span>
      </div>
    </div>
  );
}

function QAFocusChecklist({ qaFocusAreas }: { qaFocusAreas: string[] }) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="size-4 text-success" />
        <h3 className="text-sm font-semibold">Recommended QA Focus Areas</h3>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {qaFocusAreas.map((area) => (
          <li key={area} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            <span>{area}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReleaseRecommendationCard({ analysis }: { analysis: RegressionImpactAnalysis }) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Rocket className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Release Recommendation</h3>
      </div>
      <Badge
        variant="outline"
        className={cn("text-sm", releaseRecommendationClass(analysis.releaseRecommendation.status))}
      >
        {analysis.releaseRecommendation.status}
      </Badge>
      <p className="mt-4 text-sm text-muted-foreground">{analysis.releaseRecommendation.reason}</p>
    </div>
  );
}
