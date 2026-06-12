import { useEffect, useState, type ReactNode } from "react";
import {
  Sparkles,
  Brain,
  Wand2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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
  type AIProviderConfig,
  type AIProviderFeatureMapping,
  type AIProviderFeatureName,
  type AIProviderSettingsResponse,
  type AIProviderUsageLog,
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
  type Requirement,
  type RepositoryAnalysis,
  type RepositorySync,
  type ReviewDetail,
  type Workspace,
  type WorkspaceDetail,
  type WorkspaceMember,
  type WorkspaceRole,
  type Plan,
  type PlanId,
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
}

export default function AppShell() {
  const { theme, toggleTheme } = usePersistentTheme();
  const [requirement, setRequirement] = useState("");
  const [testType, setTestType] = useState<"functional" | "api" | "ui" | "integration">(
    "functional",
  );
  const [plan, setPlan] = useState<TestPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
  const [isIntegrationLoading, setIsIntegrationLoading] = useState(false);
  const [isPushingPlaywright, setIsPushingPlaywright] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const isAuthenticated = Boolean(auth?.user);

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
      const [config, analysis] = await Promise.all([
        projectApi.getGitHubAutomationConfig(workspaceId),
        projectApi.getGitHubRepositoryAnalysis(workspaceId),
      ]);
      const syncs = config ? await projectApi.listGitHubRepositorySyncs(workspaceId) : [];
      setGithubAutomationConfig(config);
      setRepositoryAnalysis(analysis);
      setRepositorySyncs(syncs);
    } catch {
      setGithubAutomationConfig(null);
      setRepositoryAnalysis(null);
      setRepositorySyncs([]);
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
      ] = await Promise.all([
        projectApi.getAnalyticsSummary(filters),
        projectApi.getAnalyticsCoverage(filters),
        projectApi.getAnalyticsGeneration(filters),
        projectApi.getAnalyticsReview(filters),
        projectApi.getAnalyticsProjectsHealth(filters),
        projectApi.getAnalyticsUsersProductivity(filters),
        projectApi.getAnalyticsAIUsage(filters),
        projectApi.getAnalyticsExports(filters),
      ]);
      setAnalytics({ summary, coverage, generation, review, projectHealth, userProductivity, aiUsage, exports });
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

  const applyAuth = (response: AuthResponse | AuthContextResponse) => {
    if ("accessToken" in response) localStorage.setItem("aiqa_access_token", response.accessToken);
    setAuth({
      user: response.user,
      workspace: response.workspace,
      member: response.member,
      role: response.role,
      permissions: response.permissions,
    });
    setActiveView("generator");
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
        onLogin={() => setActiveView("login")}
        onProfile={() => setActiveView("profile")}
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
        ) : activeView === "profile" ? (
          <ProfilePage
            auth={auth}
            selectedWorkspaceId={selectedWorkspaceId || auth?.workspace?.id || ""}
            aiProviderSettings={aiProviderSettings}
            aiProviderUsage={aiProviderUsage}
            isAIProviderLoading={isAIProviderLoading}
            githubAutomationConfig={githubAutomationConfig}
            repositoryAnalysis={repositoryAnalysis}
            repositorySyncs={repositorySyncs}
            isIntegrationLoading={isIntegrationLoading}
            onAuthChange={setAuth}
            onRefreshAIProviders={() => refreshAIProviders(selectedWorkspaceId || auth?.workspace?.id || "")}
            onRefreshIntegrations={() => refreshIntegrations(selectedWorkspaceId || auth?.workspace?.id || "")}
          />
        ) : activeView === "pricing" ? (
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
  onLogin: () => void;
  onProfile: () => void;
  onLogout: () => void;
}) {
  const activeWorkspace = workspaces.find((workspace) => workspace.id === selectedWorkspaceId);

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

        <div className="border-b border-border/40 p-4">
          <Select value={selectedWorkspaceId || "none"} onValueChange={onWorkspaceChange}>
            <SelectTrigger
              className={cn(
                "h-11 border-border/60 bg-surface/60",
                isCollapsed && "justify-center px-2 [&>span]:hidden",
              )}
              aria-label="Select workspace"
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                  {(activeWorkspace?.workspaceName ?? "W").slice(0, 1)}
                </div>
                {!isCollapsed && <SelectValue placeholder="Workspace" />}
              </div>
            </SelectTrigger>
            <SelectContent>
              {workspaces.length ? (
                workspaces.map((workspace) => (
                  <SelectItem key={workspace.id} value={workspace.id}>
                    {workspace.workspaceName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none">Default workspace</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

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
    <Card className="border-border/50 bg-card/70 p-6 backdrop-blur-xl shadow-card">
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">
            <LayoutDashboard className="mr-1 size-3" /> Dashboard
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Workspace Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Monitor QA coverage, projects, reviews, execution progress, and workspace usage from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
      <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
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
    <div className="rounded-lg border border-border/40 bg-surface/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold">{value}</p>
    </div>
  );
}

function ProfessionalEmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
}: {
  icon: typeof Wand2;
  title: string;
  message: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-surface/30 p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {actionLabel && (
        <Badge variant="outline" className="mt-4 border-primary/30 bg-primary/10 text-primary">
          {actionLabel}
        </Badge>
      )}
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

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
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
                    <div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedExportIds.includes(item.id)}
                          onChange={() => toggleExportSelection(item.id)}
                          aria-label={`Select version ${item.version} for export`}
                          className="size-4 accent-primary"
                        />
                        <button type="button" onClick={() => onSelectHistory(item.id)} className="text-left">
                          <p className="font-semibold">{item.requirementTitle}</p>
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
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

        <div className="space-y-5">
          {selectedHistory ? (
            <>
              <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedHistory.requirementTitle}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Version {selectedHistory.version} generated on {formatDate(selectedHistory.generatedAt)} by {selectedHistory.generatedBy}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">AI model: {selectedHistory.aiModelUsed}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
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
                <div className="mt-5 rounded-lg border border-border/40 bg-surface/40 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Requirement Input
                  </p>
                  <p className="whitespace-pre-wrap text-sm">{selectedHistory.requirementInput}</p>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Coverage Score</span>
                    <span className="font-mono text-xs text-muted-foreground">{selectedHistory.coverageScore}%</span>
                  </div>
                  <Progress value={selectedHistory.coverageScore} className="h-2.5" />
                </div>
              </Card>

              <Card className="border-border/50 bg-card/70 p-5 backdrop-blur">
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

              <Results plan={selectedHistory.output} />
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
  selectedWorkspaceId,
  aiProviderSettings,
  aiProviderUsage,
  isAIProviderLoading,
  githubAutomationConfig,
  repositoryAnalysis,
  repositorySyncs,
  isIntegrationLoading,
  onAuthChange,
  onRefreshAIProviders,
  onRefreshIntegrations,
}: {
  auth: AuthContextResponse | null;
  selectedWorkspaceId: string;
  aiProviderSettings: AIProviderSettingsResponse | null;
  aiProviderUsage: AIProviderUsageLog[];
  isAIProviderLoading: boolean;
  githubAutomationConfig: GitHubAutomationConfig | null;
  repositoryAnalysis: RepositoryAnalysis | null;
  repositorySyncs: RepositorySync[];
  isIntegrationLoading: boolean;
  onAuthChange: (auth: AuthContextResponse | null) => void;
  onRefreshAIProviders: () => void;
  onRefreshIntegrations: () => void;
}) {
  const [fullName, setFullName] = useState(auth?.user.fullName ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!auth) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">Settings</Badge>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage account identity, workspace settings, security, and AI provider configuration.</p>
      </div>
      <Tabs defaultValue="account" className="space-y-5">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="ai-providers">AI Providers</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
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
        <TabsContent value="ai-providers">
          <AIProvidersSettings
            workspaceId={selectedWorkspaceId}
            role={auth.role}
            settings={aiProviderSettings}
            usage={aiProviderUsage}
            isLoading={isAIProviderLoading}
            onRefresh={onRefreshAIProviders}
          />
        </TabsContent>
        <TabsContent value="integrations">
          <AutomationRepositorySettings
            workspaceId={selectedWorkspaceId}
            role={auth.role}
            config={githubAutomationConfig}
            analysis={repositoryAnalysis}
            syncs={repositorySyncs}
            isLoading={isIntegrationLoading}
            onRefresh={onRefreshIntegrations}
          />
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
};

function AutomationRepositorySettings({
  workspaceId,
  role,
  config,
  analysis,
  syncs,
  isLoading,
  onRefresh,
}: {
  workspaceId: string;
  role: WorkspaceRole;
  config: GitHubAutomationConfig | null;
  analysis: RepositoryAnalysis | null;
  syncs: RepositorySync[];
  isLoading: boolean;
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSyncId, setActiveSyncId] = useState("");
  const [isGeneratingSyncSuggestions, setIsGeneratingSyncSuggestions] = useState(false);
  const [isGeneratingSyncUpdates, setIsGeneratingSyncUpdates] = useState(false);
  const [isCreatingSyncPr, setIsCreatingSyncPr] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
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
    setForm((current) => ({
      token: "",
      owner: config?.owner ?? current.owner,
      repo: config?.repo ?? current.repo,
      defaultBranch: config?.defaultBranch ?? (current.defaultBranch || "main"),
      testFolderPath: config?.testFolderPath ?? (current.testFolderPath || "tests/e2e"),
    }));
  }, [config]);

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
      toast.error("Run Smart Repository Analysis before syncing repository changes.");
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

  const riskClass = (risk: string) =>
    risk === "High"
      ? "border-destructive/40 bg-destructive/10 text-destructive"
      : risk === "Medium"
        ? "border-warning/40 bg-warning/10 text-warning"
        : "border-success/40 bg-success/10 text-success";

  return (
    <div className="space-y-5">
      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">Automation Repository</Badge>
            <h2 className="font-display text-2xl font-semibold">GitHub Automation Repository</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Connect a GitHub automation repository so AI QA Copilot can create a feature branch, add generated Playwright specs, and raise a pull request for review.
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
                Save GitHub Config
              </Button>
              <Button variant="outline" onClick={testConnection} disabled={!config || isTesting}>
                {isTesting ? <Loader2 className="size-4 animate-spin" /> : <GitBranch className="size-4" />}
                Test Connection
              </Button>
              <Button variant="outline" onClick={analyzeRepository} disabled={!config || isAnalyzing}>
                {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                Analyze Repository
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
              <p className="text-sm leading-6 text-muted-foreground">Please configure GitHub repository integration first.</p>
            )}
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
              Tokens are encrypted in the backend and never displayed after saving. AI QA Copilot always creates a branch and pull request; it never pushes directly to the default branch.
            </div>
          </div>
        </div>
      </Card>

      <Card className="app-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold">Detected Repository Setup</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              AI QA Copilot uses this analysis to choose the target folder and describe the generated Pull Request.
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
                  <DialogTitle>Override Repository Analysis</DialogTitle>
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
            No repository analysis yet. Connect GitHub and click Analyze Repository.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
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
    { icon: Bot, label: "AI Chat with Requirements" },
    { icon: ShieldCheck, label: "Review & Approval Workflow" },
    { icon: Code2, label: "Playwright Test Generation" },
    { icon: BarChart3, label: "Analytics & Reporting" },
    { icon: Users, label: "Team Collaboration" },
    { icon: GitBranch, label: "Enterprise Integrations" },
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
      description: "Generate positive, negative, edge, API, UI, and regression scenarios.",
      icon: Wand2,
    },
    {
      title: "AI Chat with Requirement",
      description: "Ask context-aware QA questions against selected requirements and versions.",
      icon: Bot,
    },
    {
      title: "Test Coverage Score",
      description: "Quantify coverage and surface missing areas before release.",
      icon: Gauge,
    },
    {
      title: "Requirement Change Impact Analysis",
      description: "Understand what must be retested when requirements evolve.",
      icon: GitCompare,
    },
    {
      title: "Project Management",
      description: "Organize QA work by workspace, project, module, and requirement.",
      icon: FolderKanban,
    },
    {
      title: "Test Case History",
      description: "Version every generated output with status, model, and author metadata.",
      icon: History,
    },
    {
      title: "Review Workflow",
      description: "Submit, approve, reject, and lock official versions.",
      icon: ClipboardList,
    },
    {
      title: "Manual Test Execution",
      description: "Create test runs, execute approved test cases, track Pass/Fail/Blocked/Skipped status, and generate detailed execution reports.",
      icon: ClipboardCheck,
    },
    {
      title: "Team Collaboration",
      description: "Invite members, assign roles, and manage project access.",
      icon: Users,
    },
    {
      title: "Analytics Dashboard",
      description: "Track coverage, productivity, review queues, exports, and AI usage.",
      icon: BarChart3,
    },
    {
      title: "Smart Repository Analysis",
      description: "Analyze GitHub or Bitbucket automation repositories to detect framework, language, folder structure, Page Object Model usage, and coding conventions before generating Playwright tests.",
      icon: GitBranch,
      enterprise: true,
    },
    {
      title: "AI Repository Sync",
      description: "Continuously monitor connected GitHub repositories, detect application changes, identify impacted Playwright tests, generate AI-powered update suggestions, and create Pull Requests for review.",
      icon: RefreshCw,
      beta: true,
      enterprise: true,
    },
    {
      title: "Jira Integration",
      description: "Coming soon for issue sync and traceability.",
      icon: Rocket,
      comingSoon: true,
    },
    {
      title: "GitHub & Bitbucket Repository Integration",
      description: "Generate Playwright tests, create feature branches, and raise Pull Requests directly into connected automation repositories.",
      icon: GitPullRequest,
      comingSoon: true,
      enterprise: true,
    },
    {
      title: "AI Provider Flexibility",
      description: "Use AI QA Copilot’s default AI or connect your own AI provider such as OpenAI, Claude, Gemini, Groq, Azure OpenAI, or custom LLMs.",
      icon: Sparkles,
    },
  ];
  const whyChoose = [
    {
      title: "Faster Test Design",
      description: "Reduce repetitive QA documentation effort and help teams move from requirements to test coverage faster.",
      icon: Rocket,
    },
    {
      title: "Better Test Coverage",
      description: "Expose missing scenarios earlier so teams can improve confidence before development and release gates.",
      icon: Gauge,
    },
    {
      title: "End-to-End QA Governance",
      description: "Bring generation, review, approval, versioning, execution, and reporting into one controlled flow.",
      icon: ShieldCheck,
    },
    {
      title: "Manual + Automation Ready",
      description: "Support today’s manual execution needs while preparing teams for Playwright automation workflows.",
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
      title: "Requirement",
      description: "Capture user stories",
    },
    {
      title: "AI Test Generation",
      description: "Create structured QA coverage",
    },
    {
      title: "Review & Approval",
      description: "Govern versions and approvals",
    },
    {
      title: "Smart Repository Analysis",
      description: "Understand automation repo style",
    },
    {
      title: "Generate Playwright Tests",
      description: "Follow existing repo patterns",
    },
    {
      title: "Repository Sync",
      description: "Monitor latest code changes",
    },
    {
      title: "AI Detects Changes",
      description: "Find impacted automation",
    },
    {
      title: "Suggest Test Updates",
      description: "Recommend maintenance work",
    },
    {
      title: "Create Pull Request",
      description: "Branch and PR for review",
    },
    {
      title: "Analytics & Reports",
      description: "Measure coverage and progress",
    },
  ];
  const integrations = [
    { title: "Jira Integration", description: "Issue traceability and QA workflow sync.", icon: Rocket, status: "Coming Soon" },
    { title: "GitHub Repository", description: "Analyze automation structure, generate Playwright files, and raise Pull Requests.", icon: Github, status: "Enterprise" },
    { title: "Bitbucket Repository", description: "Connect automation repos and branch workflows.", icon: GitCompare, status: "Coming Soon" },
    { title: "Azure DevOps", description: "Enterprise delivery workflow support.", icon: Boxes, status: "Future" },
    { title: "CI/CD Pipeline", description: "Automation execution and release pipeline signals.", icon: TrendingUp, status: "Future" },
  ];
  const businessValue = [
    "Reduce manual test design effort",
    "Improve coverage quality",
    "Accelerate QA cycles",
    "Improve release confidence",
    "Centralize QA assets",
    "Enable better management reporting",
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
  const repositoryIntelligence = [
    {
      title: "Detect Framework",
      description: "Detect Playwright setup from config files and dependencies.",
      icon: Search,
    },
    {
      title: "Detect Language",
      description: "Identify JavaScript, TypeScript, or Java automation projects.",
      icon: Code2,
    },
    {
      title: "Detect Project Pattern",
      description: "Understand folder structure, naming conventions, fixtures, and Page Object Model usage.",
      icon: FolderKanban,
    },
    {
      title: "Generate Matching Tests",
      description: "Create Playwright tests that follow the existing repository style.",
      icon: GitPullRequest,
    },
  ];
  const repositorySyncBenefits = [
    {
      title: "Detect Code Changes",
      description: "Automatically detect changed modules, pages, APIs, and UI components.",
      icon: RefreshCw,
    },
    {
      title: "Identify Impacted Tests",
      description: "Find Playwright tests that may be affected by recent application changes.",
      icon: Search,
    },
    {
      title: "AI Update Suggestions",
      description: "Generate intelligent recommendations to update existing automation tests.",
      icon: Sparkles,
    },
    {
      title: "Create Pull Requests",
      description: "Create feature branches and Pull Requests for QA team review before merging.",
      icon: GitMerge,
    },
  ];
  const faqs = [
    ["What is AI QA Copilot?", "AI QA Copilot is an AI-powered QA lifecycle platform for test design, review, execution, collaboration, analytics, and reporting."],
    ["Can it generate Playwright tests?", "Yes. The product generates Playwright test skeletons today, with repository Pull Request workflows planned for GitHub and Bitbucket."],
    ["Can teams collaborate?", "Yes. Workspaces, roles, project access, review queues, and shared analytics support team-based QA work."],
    ["Does it support manual execution?", "Yes. Teams can create test runs, execute approved test cases, and track Passed, Failed, Blocked, Skipped, and Not Executed status."],
    ["Will it support Jira/GitHub/Bitbucket?", "Jira, GitHub, and Bitbucket are positioned as upcoming enterprise integrations for traceability and automation repository workflows."],
    ["Is it suitable for enterprise QA teams?", "Yes. The product is designed around governed workflows, role-based access, approval controls, analytics, and scalable QA asset management."],
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
            AI QA Copilot is an AI-powered Quality Engineering Platform that helps QA, Product, and Engineering teams generate, review, execute, analyze, and manage QA work across the complete software testing lifecycle, while understanding automation frameworks and keeping Playwright suites up to date.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={onStart}>
              <Rocket className="size-4" />
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={onBookDemo}>
              <CalendarDays className="size-4" />
              Book a Demo
            </Button>
            <Button size="lg" variant="ghost" onClick={() => document.getElementById("core-features")?.scrollIntoView({ behavior: "smooth" })}>
              <Layers3 className="size-4" />
              View Features
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
        description="A complete QA lifecycle platform for generating test assets, managing review, executing tests, collaborating across teams, and preparing for automation workflows."
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
        eyebrow="Repository Intelligence"
        title="Repository Intelligence for Automation Teams"
        description="AI QA Copilot understands your existing automation framework before generating new test files."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repositoryIntelligence.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-5">
              <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-5">
          <p className="max-w-5xl text-sm leading-6 text-muted-foreground">
            <span className="font-semibold text-foreground">Smart Repository Analysis</span> helps automation teams avoid generic generated code. AI QA Copilot adapts to the existing test framework, language, and coding standards, making generated Playwright tests easier to review, maintain, and merge.
          </p>
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="Repository Sync Beta"
        title="Keep Your Automation Suite Always Up-to-Date"
        description="AI QA Copilot continuously monitors repository changes and helps automation teams keep Playwright tests synchronized with the latest application updates."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {repositorySyncBenefits.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-5">
              <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-warning/10 text-warning">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-warning/30 bg-warning/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning">Beta</Badge>
            <h3 className="font-semibold">AI Repository Sync</h3>
          </div>
          <p className="max-w-5xl text-sm leading-6 text-muted-foreground">
            Reduce manual automation maintenance by automatically detecting application changes, identifying impacted Playwright tests, and generating AI-assisted update suggestions before creating Pull Requests.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Reduce automation maintenance effort",
              "Detect impacted tests automatically",
              "Improve regression test reliability",
              "Accelerate QA review cycles",
              "Minimize flaky and outdated tests",
              "Keep automation repositories synchronized",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-success" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="AI Providers / BYOAI"
        title="Choose Your AI. No Vendor Lock-In."
        description="Use AI QA Copilot’s built-in AI or connect your organization’s preferred AI provider for test generation, AI chat, impact analysis, and Playwright automation."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aiProviderCards.map(({ title, description, badge, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-5 transition-colors hover:border-primary/40">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                {badge && <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">{badge}</Badge>}
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-5">
          <div className="flex flex-wrap items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold">Bring Your Own AI</h3>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
                Enterprise teams can use their existing AI subscriptions, reduce vendor lock-in, control AI usage, and align with internal security policies.
              </p>
            </div>
          </div>
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="Why Choose AI QA Copilot"
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
        title="A Simple Path From Requirement to Quality Insight"
        description="AI QA Copilot connects the key stages of test design, review, execution, automation readiness, and reporting without forcing teams into fragmented tools."
      >
        <div className="rounded-lg border border-border/40 bg-card/60 p-3 md:p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="relative rounded-lg border border-border/40 bg-background/50 p-3.5">
                <div className="mb-2 flex items-start gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <h3 className="min-w-0 text-sm font-semibold leading-5">{step.title}</h3>
                </div>
                <p className="text-xs leading-4 text-muted-foreground">{step.description}</p>
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

      <LandingSection
        eyebrow="Business Value"
        title="Turn QA Effort Into Measurable Delivery Confidence"
        description="Give leaders a clearer view of quality readiness while helping teams reduce repetitive work and improve release decisions."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businessValue.map((value) => (
            <div key={value} className="flex items-start gap-3 rounded-lg border border-border/40 bg-card/60 p-5">
              <TrendingUp className="mt-0.5 size-5 shrink-0 text-success" />
              <p className="font-semibold">{value}</p>
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
          Move from manual QA documentation to an AI-powered QA lifecycle platform.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Help your QA and engineering teams design better tests, govern approvals, execute with visibility, and prepare for automation-ready delivery.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={onStart}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" onClick={onBookDemo}>
            Book Demo
          </Button>
        </div>
      </section>

      <footer className="flex flex-col gap-5 border-t border-border/40 pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base font-semibold text-foreground">AI QA Copilot</p>
          <p className="mt-1">AI-powered test design and QA management.</p>
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

  if (isLoading && !analytics) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-40 w-full" />
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
        <EmptyAnalyticsState label="No analytics data loaded yet." />
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

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
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
                    <div>
                      <p className="font-semibold">{item.requirementTitle}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
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
          <div className="space-y-5">
            <Card className="border-border/50 bg-card/70 p-5 backdrop-blur-xl shadow-card">
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
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
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
}: {
  plan: TestPlan;
  onExport?: (format: ExportFormat) => void;
  isExporting?: boolean;
  githubConfig?: GitHubAutomationConfig | null;
  repositoryAnalysis?: RepositoryAnalysis | null;
  isPushingPlaywright?: boolean;
  onPushPlaywright?: (fileName: string) => void;
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

  return (
    <Card className="border-border/50 bg-card/70 p-6 backdrop-blur-xl shadow-card">
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

      <Tabs defaultValue="positive" className="mt-6">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-surface/60">
          <TabsTrigger value="positive">
            <CheckCircle2 className="size-3.5 text-success" /> Positive (
            {plan.positive?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="negative">
            <XCircle className="size-3.5 text-destructive" /> Negative ({plan.negative?.length ?? 0}
            )
          </TabsTrigger>
          <TabsTrigger value="edge">
            <AlertTriangle className="size-3.5 text-warning" /> Edge ({plan.edge?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="size-3.5 text-accent" /> Test Data
          </TabsTrigger>
          <TabsTrigger value="criteria">
            <ClipboardCheck className="size-3.5 text-primary" /> Acceptance Criteria
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code2 className="size-3.5 text-primary-glow" /> Playwright
          </TabsTrigger>
          <TabsTrigger value="regression">
            <Layers className="size-3.5 text-primary" /> Regression Impact Analysis
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <Gauge className="size-3.5 text-success" /> Test Coverage Score
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positive" className="mt-4">
          <CaseList cases={plan.positive} accent="border-success/40 bg-success/10 text-success" />
        </TabsContent>
        <TabsContent value="negative" className="mt-4">
          <CaseList
            cases={plan.negative}
            accent="border-destructive/40 bg-destructive/10 text-destructive"
          />
        </TabsContent>
        <TabsContent value="edge" className="mt-4">
          <CaseList cases={plan.edge} accent="border-warning/40 bg-warning/10 text-warning" />
        </TabsContent>

        <TabsContent value="data" className="mt-4">
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

        <TabsContent value="criteria" className="mt-4">
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

        <TabsContent value="code" className="mt-4">
          <div className="overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-700/80 px-4 py-2">
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
                            Please configure GitHub repository integration first in Settings → Integrations → Automation Repository.
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
            <pre className="max-h-[520px] overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-100">
              <code>{plan.playwright}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="regression" className="mt-4">
          <RegressionImpactAnalysisTab analysis={plan.regressionImpact} />
        </TabsContent>

        <TabsContent value="coverage" className="mt-4">
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
