import { useEffect, useState, type ReactNode } from "react";
import {
  Sparkles,
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
  Moon,
  Sun,
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
  GitCompare,
  Bot,
  Send,
  MessageSquare,
  ClipboardList,
  Users,
  BarChart3,
  TrendingUp,
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle,
  ChevronDown,
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
import { cn } from "@/lib/utils";

import { generateTestCases, type TestCase, type TestPlan } from "@/lib/api/testcases";
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
  type AuthContextResponse,
  type AuthResponse,
  type BillingCycle,
  type CreateProjectInput,
  type DashboardStats,
  type EntityStatus,
  type ExportFormat,
  type ExportHistoryRecord,
  type HistoryFilters,
  type HistoryStatus,
  type ModulePriority,
  type ProjectDetail,
  type ProjectDomain,
  type ProjectModule,
  type ProjectSummary,
  type Requirement,
  type ReviewDetail,
  type Workspace,
  type WorkspaceDetail,
  type WorkspaceMember,
  type WorkspaceRole,
  type Plan,
  type PlanId,
  type SubscriptionResponse,
  type TestCaseHistoryCompare,
  type TestCaseHistoryRecord,
  type TestCaseGenerationHistory,
} from "@/lib/api/projects";
import type {
  RegressionImpactAnalysis,
  RegressionPriority,
  RiskLevel,
  ReleaseRecommendationStatus,
} from "@/lib/api/regressionImpact";
import type {
  CoverageStatus,
  OverallCoverageStatus,
  TestCoverageScoreAnalysis,
} from "@/lib/api/coverageScore";

type Theme = "light" | "dark";
type ActiveView =
  | "landing"
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "profile"
  | "pricing"
  | "generator"
  | "projects"
  | "history"
  | "review"
  | "chat"
  | "workspace"
  | "analytics";

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

const EXAMPLE = `As a registered user, I want to reset my password via email so that I can regain access to my account if I forget my credentials.

Acceptance Criteria:
- User can request a reset link from the login page
- Reset link expires after 30 minutes
- Password must be at least 8 chars with one number and one symbol
- User receives confirmation email after successful reset`;

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
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
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const isAuthenticated = Boolean(auth?.user);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

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

  const refreshWorkspace = async (workspaceId = selectedWorkspaceId) => {
    try {
      setIsWorkspaceLoading(true);
      const workspaceList = await projectApi.listWorkspaces();
      setWorkspaces(workspaceList);
      const nextWorkspaceId = workspaceId || workspaceList[0]?.id || "";
      setSelectedWorkspaceId(nextWorkspaceId);
      if (nextWorkspaceId) setWorkspaceDetail(await projectApi.getWorkspace(nextWorkspaceId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load workspace");
    } finally {
      setIsWorkspaceLoading(false);
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
      toast.success(`${label} export downloaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsExporting(false);
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
    void refreshWorkspace("");
    void refreshAnalytics({});
    void refreshPricing();
  };

  const refreshPricing = async (workspaceId = auth?.workspace?.id) => {
    try {
      setIsPricingLoading(true);
      const planList = await projectApi.listPlans();
      setPlans(planList);
      if (workspaceId) {
        const current = await projectApi.getCurrentSubscription(workspaceId);
        setSubscription(current);
        setBillingCycle(current.subscription.billingCycle);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load pricing");
    } finally {
      setIsPricingLoading(false);
    }
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
      toast.success("Test plan generated");
    } catch (error) {
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
          "relative min-h-screen px-4 pb-16 pt-24 transition-[padding] duration-300 sm:px-6 lg:pt-24",
          isSidebarCollapsed ? "lg:pl-28 lg:pr-8" : "lg:pl-80 lg:pr-8",
        )}
      >
        <div className="mx-auto max-w-[1480px]">
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
          <ProfilePage auth={auth} onAuthChange={setAuth} />
        ) : activeView === "pricing" ? (
          <PricingPage
            plans={plans}
            subscription={subscription}
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
              toast.success(`Plan updated to ${updated.plan.name}`);
            }}
          />
        ) : activeView === "generator" ? (
          <>
            <Hero />

            <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
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
                onLoadExample={() => setRequirement(EXAMPLE)}
                onGenerate={onGenerate}
              />

              <FeatureGrid />
            </section>

            <section className="mt-10">
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
            onRefresh={() => refreshProjects(selectedProjectId)}
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
              } catch (error) {
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
              const history = await projectApi.saveChatAsVersion(activeChat.id, activeChat.historyVersionId);
              toast.success(`Saved as Version ${history.version}`);
              await refreshHistory();
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
            isLoading={isWorkspaceLoading}
            onSelectWorkspace={(workspaceId) => void refreshWorkspace(workspaceId)}
            onRefresh={() => refreshWorkspace(selectedWorkspaceId)}
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
  const isDark = theme === "dark";
  const activeWorkspace = workspaces.find((workspace) => workspace.id === selectedWorkspaceId);
  const navItems: Array<{
    label: string;
    value: ActiveView;
    icon: typeof Wand2;
    description: string;
  }> = [
    { label: "Landing", value: "landing", icon: Rocket, description: "Marketing site" },
    { label: "Generator", value: "generator", icon: Wand2, description: "Create AI QA assets" },
    { label: "Projects", value: "projects", icon: FolderKanban, description: "Projects and modules" },
    { label: "Test History", value: "history", icon: History, description: "Versions and exports" },
    { label: "Review Queue", value: "review", icon: ClipboardList, description: "Approvals" },
    { label: "AI Chat", value: "chat", icon: Bot, description: "Requirement assistant" },
    { label: "Team Workspace", value: "workspace", icon: Users, description: "Members and roles" },
    { label: "Analytics", value: "analytics", icon: BarChart3, description: "Coverage and productivity" },
    { label: "Pricing", value: "pricing", icon: Rocket, description: "Plans and billing" },
    { label: "Profile", value: "profile", icon: UserCircle, description: "Account settings" },
  ];

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
        <div className="flex h-16 items-center gap-3 border-b border-border/40 px-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Beaker className="size-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold">AI QA Copilot</p>
              <p className="truncate text-xs text-muted-foreground">Enterprise QA intelligence</p>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleCollapsed}
            className="ml-auto size-8"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </Button>
        </div>

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

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ label, value, icon: Icon, description }) => (
            <button
              key={value}
              type="button"
              onClick={() => navigate(value)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeView === value
                  ? "bg-primary/12 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
                  : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
                isCollapsed && "justify-center px-2",
              )}
              title={isCollapsed ? label : undefined}
              aria-current={activeView === value ? "page" : undefined}
            >
              <Icon className={cn("size-4 shrink-0", activeView === value && "text-primary")} />
              {!isCollapsed && (
                <span className="min-w-0">
                  <span className="block font-medium">{label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{description}</span>
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border/40 p-3">
          <div className={cn("flex items-center gap-3 rounded-lg bg-surface/50 p-3", isCollapsed && "justify-center p-2")}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
              DS
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{auth?.user.fullName ?? "Guest"}</p>
                <p className="truncate text-xs text-muted-foreground">{auth?.role ?? "Public visitor"}</p>
              </div>
            )}
          </div>
        </div>
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
        <div className="flex h-16 items-center gap-3 border-b border-border/40 px-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Beaker className="size-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">AI QA Copilot</p>
            <p className="text-xs text-muted-foreground">Enterprise QA intelligence</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => navigate(value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                activeView === value ? "bg-primary/12 text-foreground" : "text-muted-foreground hover:bg-surface/70",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-30 border-b border-border/40 bg-background/70 backdrop-blur-xl transition-[padding] duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 lg:hidden"
            onClick={() => onMobileOpenChange(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </Button>

          <div className="hidden min-w-0 flex-1 md:block" />

          <div className="ml-auto flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" className="size-9" aria-label="Notifications">
              <Bell className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onToggleTheme}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="size-9"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            {auth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="h-9 gap-2 px-3">
                    <UserCircle className="size-4" />
                    <span className="text-sm">{auth.user.fullName?.split(" ")[0] ?? "User"}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onProfile}>
                    <UserCircle className="size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <XCircle className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button type="button" className="h-9 bg-gradient-primary text-primary-foreground" onClick={onLogin}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(value),
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
  onLoadExample,
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
  onLoadExample: () => void;
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
        <Button
          variant="ghost"
          size="sm"
          onClick={onLoadExample}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Load example
        </Button>
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

function ProjectsPage({
  dashboard,
  projects,
  projectDetail,
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
}: {
  dashboard: DashboardStats | null;
  projects: ProjectSummary[];
  projectDetail: ProjectDetail | null;
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
        />
      </div>

      <DashboardCards dashboard={dashboard} />

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

function ProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (project: ProjectSummary) => void;
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
              <button
                type="button"
                onClick={() => onSelectProject(project.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge variant="outline" className={cn("text-xs", health === "Healthy" ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning")}>
                        {health}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", statusClass(project.status))}>{project.status}</Badge>
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
          )})}
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
}: {
  projectId: string;
  selectedModule?: ProjectModule;
  requirements: Requirement[];
  selectedRequirementId: string;
  onSelectRequirement: (requirementId: string) => void;
  onRefresh: () => void;
  isExporting: boolean;
  onExportRequirement: (requirementId: string, format: ExportFormat) => void;
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

  const googleLogin = async () => {
    try {
      setIsSubmitting(true);
      const email = form.email || window.prompt("Google email for demo login") || "";
      const fullName = form.fullName || email.split("@")[0] || "Google User";
      if (!email) return;
      const response = await projectApi.googleLogin({
        email,
        fullName,
        googleId: `google-${email}`,
      });
      toast.success("Logged in with Google");
      onAuthenticated(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google login failed");
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
            {mode === "signup" ? "Start with a default owner workspace." : "Use email/password or Google demo login."}
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
          {(mode === "login" || mode === "signup") && (
            <Button className="w-full" variant="outline" onClick={googleLogin} disabled={isSubmitting}>
              <UserCircle className="size-4" />
              Continue with Google
            </Button>
          )}
          {resetLink && (
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
              Demo reset link: <span className="font-mono">{resetLink}</span>
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/10 text-primary">Account Settings</Badge>
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage account identity, workspace role, and password settings.</p>
      </div>
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
    { icon: Wand2, label: "AI Test Case Generation" },
    { icon: Bot, label: "AI Chat with Requirement" },
    { icon: Gauge, label: "Test Coverage Analysis" },
    { icon: ClipboardList, label: "Review & Approval Workflow" },
  ];
  const painPoints = [
    "Manual test case creation",
    "Coverage gaps",
    "Requirement changes",
    "Review bottlenecks",
    "Scattered QA documentation",
  ];
  const features = [
    ["AI Test Case Generation", "Generate positive, negative, edge, API, UI, and regression scenarios."],
    ["AI Chat with Requirement", "Ask context-aware QA questions against selected requirements and versions."],
    ["Test Coverage Score", "Quantify coverage and surface missing areas before release."],
    ["Requirement Change Impact Analysis", "Understand what must be retested when requirements evolve."],
    ["Project Management", "Organize QA work by workspace, project, module, and requirement."],
    ["Test Case History", "Version every generated output with status, model, and author metadata."],
    ["Review Workflow", "Submit, approve, reject, and lock official versions."],
    ["Team Collaboration", "Invite members, assign roles, and manage project access."],
    ["Analytics Dashboard", "Track coverage, productivity, review queues, exports, and AI usage."],
    ["Jira Integration", "Coming soon for issue sync and traceability."],
  ];
  const screenshots = [
    { title: "Dashboard", metric: "86%", caption: "Coverage and workflow KPIs" },
    { title: "AI Chat", metric: "12", caption: "Context-aware QA suggestions" },
    { title: "Project Management", metric: "48", caption: "Requirements and versions" },
    { title: "Analytics", metric: "+31%", caption: "Team productivity insights" },
  ];
  const benefits = [
    "80% Faster Test Design",
    "Better Test Coverage",
    "Faster Releases",
    "Improved QA Productivity",
    "Reduced Manual Effort",
  ];
  const faqs = [
    ["What is AI QA Copilot?", "AI QA Copilot is an AI-powered QA platform for generating, managing, reviewing, and analyzing test assets from requirements."],
    ["How does AI generate test cases?", "The platform analyzes requirement text, acceptance criteria, selected project context, and existing versions to produce structured QA scenarios."],
    ["Is Jira supported?", "Jira integration is planned and marked as coming soon for issue traceability and workflow sync."],
    ["Can teams collaborate?", "Yes. Team workspaces support roles, members, project assignments, review queues, and shared analytics."],
    ["Is my data secure?", "The product is designed for enterprise controls, workspace-level access, role-based permissions, and governed approval flows."],
  ];

  return (
    <div className="space-y-20 pb-10">
      <section className="grid min-h-[calc(100vh-7rem)] items-center gap-10 lg:grid-cols-[1fr_.95fr]">
        <div>
          <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1 size-3" /> Enterprise QA Intelligence
          </Badge>
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight md:text-6xl">
            AI-Powered Test Design & QA Management Platform
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Generate test cases, improve coverage, manage QA workflows, and accelerate software delivery with AI.
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
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {heroFeatures.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/60 p-3">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <LandingProductMockup />
      </section>

      <section className="space-y-5">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Future-ready for customer logos
        </p>
        <div className="grid gap-3 md:grid-cols-4">
          {["Enterprise Company 1", "Enterprise Company 2", "Enterprise Company 3", "Enterprise Company 4"].map((logo) => (
            <div key={logo} className="rounded-lg border border-border/40 bg-card/50 p-5 text-center text-sm font-semibold text-muted-foreground">
              {logo}
            </div>
          ))}
        </div>
      </section>

      <LandingSection
        eyebrow="The Problem"
        title="QA Teams Waste Hours Creating and Managing Test Cases"
        description="Manual QA design slows release cycles and leaves teams guessing where coverage, review, and documentation gaps are hiding."
      >
        <div className="grid gap-3 md:grid-cols-5">
          {painPoints.map((point) => (
            <div key={point} className="rounded-lg border border-border/40 bg-card/60 p-4">
              <AlertTriangle className="mb-3 size-4 text-warning" />
              <p className="text-sm font-medium">{point}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        eyebrow="The Solution"
        title="Meet AI QA Copilot"
        description="A governed workflow that converts requirement text into review-ready test assets and management-friendly quality insight."
      >
        <div className="grid gap-3 md:grid-cols-5">
          {["Requirement", "AI QA Copilot", "Generate Test Cases", "Review & Approval", "Export & Share"].map((step, index) => (
            <div key={step} className="relative rounded-lg border border-border/40 bg-card/60 p-5 text-center">
              <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <p className="text-sm font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection eyebrow="Features" title="Everything QA Teams Need to Move Faster" description="From AI generation to approvals, exports, collaboration, and analytics.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {features.map(([title, description], index) => (
            <div key={title} className="rounded-lg border border-border/40 bg-card/60 p-4 transition-colors hover:border-primary/40">
              <div className="mb-3 flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                {index === features.length - 1 ? <Rocket className="size-4" /> : <CheckCircle2 className="size-4" />}
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection eyebrow="Product" title="Built for Real QA Workflows" description="Responsive product previews for every part of the QA lifecycle.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {screenshots.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-lg border border-border/40 bg-card/60">
              <div className="border-b border-border/40 bg-surface/50 p-3">
                <p className="text-sm font-semibold">{item.title}</p>
              </div>
              <div className="space-y-3 p-4">
                <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                  <p className="font-display text-3xl font-semibold">{item.metric}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.caption}</p>
                </div>
                <div className="h-2 rounded-full bg-primary/20" />
                <div className="h-2 w-3/4 rounded-full bg-success/30" />
                <div className="h-2 w-1/2 rounded-full bg-warning/30" />
              </div>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection eyebrow="Benefits" title="Designed for Faster, Safer Releases" description="Make QA progress visible to engineers, QA leads, managers, and executives.">
        <div className="grid gap-4 md:grid-cols-5">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-lg border border-border/40 bg-card/60 p-5">
              <TrendingUp className="mb-4 size-5 text-success" />
              <p className="font-semibold">{benefit}</p>
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
        <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to Transform Your QA Process?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Launch a governed AI QA workflow that teams can use for generation, review, analytics, and customer-ready reporting.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" onClick={onStart}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" onClick={onBookDemo}>
            Contact Sales
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
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section>
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
  billingCycle,
  isLoading,
  workspaceId,
  onBillingCycleChange,
  onPlanChange,
}: {
  plans: Plan[];
  subscription: SubscriptionResponse | null;
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
  isLoading,
  onSelectWorkspace,
  onRefresh,
}: {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  detail: WorkspaceDetail | null;
  projects: ProjectSummary[];
  isLoading: boolean;
  onSelectWorkspace: (workspaceId: string) => void;
  onRefresh: () => void;
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

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
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

        <Card className="flex min-h-[720px] flex-col border-border/50 bg-card/70 backdrop-blur-xl shadow-card">
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

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
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

              <div className="border-t border-border/40 p-5">
                <div className="flex gap-3">
                  <Textarea
                    value={message}
                    onChange={(event) => onMessageChange(event.target.value)}
                    placeholder="Ask AI about this requirement..."
                    className="min-h-[72px] resize-none border-border/60 bg-input/40"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) onSend();
                    }}
                  />
                  <Button
                    className="self-end bg-gradient-primary text-primary-foreground shadow-glow"
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
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] rounded-lg border p-4 text-sm",
          isUser
            ? "border-primary/40 bg-primary/10"
            : "border-border/40 bg-surface/50",
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
        <MarkdownLite content={message.content} />
      </div>
    </div>
  );
}

function MarkdownLite({ content }: { content: string }) {
  const blocks = content.split(/```/);
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (index % 2 === 1) {
          const code = block.replace(/^[a-zA-Z]+\n/, "");
          return (
            <div key={index} className="overflow-hidden rounded-md border border-border/40 bg-[oklch(0.14_0.02_260)]">
              <div className="flex justify-end border-b border-border/40 px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    toast.success("Copied code");
                  }}
                >
                  <Copy className="size-3.5" />
                  Copy code
                </Button>
              </div>
              <pre className="overflow-auto p-3 font-mono text-xs text-foreground/90">
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        return (
          <div key={index} className="whitespace-pre-wrap leading-relaxed">
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
}: {
  plan: TestPlan;
  onExport?: (format: ExportFormat) => void;
  isExporting?: boolean;
}) {
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
          <div className="overflow-hidden rounded-lg border border-border/40 bg-[oklch(0.14_0.02_260)]">
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">playwright.spec.ts</span>
              <Button variant="ghost" size="sm" onClick={copyPlaywright}>
                <Copy className="size-3.5" /> Copy
              </Button>
            </div>
            <pre className="max-h-[520px] overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground/90">
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
