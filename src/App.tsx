import { useEffect, useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const onGenerate = async () => {
    if (requirement.trim().length < 10) {
      toast.error("Please describe the requirement (at least 10 characters).");
      return;
    }
    try {
      setIsGenerating(true);
      const generatedPlan = await generateTestCases({ requirement, testType });
      setPlan(generatedPlan);
      toast.success("Test plan generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-mesh blur-3xl opacity-60" />

      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-10 lg:pt-16">
        <Hero />

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <Card className="border-border/50 bg-card/70 p-6 backdrop-blur-xl shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="size-4 text-primary" />
                <h2 className="text-base font-semibold">Input</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRequirement(EXAMPLE)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Load example
              </Button>
            </div>

            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              User story, requirement, or acceptance criteria
            </label>
            <Textarea
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="As a user, I want to ... so that ..."
              className="min-h-[260px] resize-y border-border/60 bg-input/40 font-mono text-sm leading-relaxed focus-visible:ring-primary"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Test focus</span>
                <Select value={testType} onValueChange={(v) => setTestType(v as typeof testType)}>
                  <SelectTrigger className="h-9 w-[160px] border-border/60 bg-input/40 text-sm">
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
                    Generate Test Cases
                  </>
                )}
              </Button>
            </div>
          </Card>

          <FeatureGrid />
        </section>

        <section className="mt-10">
          {isGenerating && <ResultSkeleton />}
          {plan && <Results plan={plan} />}
          {!isGenerating && !plan && <EmptyState />}
        </section>
      </main>

      <Toaster richColors theme={theme} position="top-right" />
    </div>
  );
}

function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const isDark = theme === "dark";

  return (
    <header className="relative z-10 border-b border-border/40 bg-background/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-gradient-primary shadow-glow">
            <Beaker className="size-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            AI QA <span className="text-gradient">Copilot</span>
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#generator" className="hover:text-foreground">
              Generator
            </a>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              Powered by AI
            </Badge>
          </nav>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="size-9 border-border/60 bg-background/60 backdrop-blur"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div id="generator" className="mx-auto max-w-3xl text-center">
      <Badge variant="outline" className="mb-5 border-primary/30 bg-primary/10 text-primary">
        <Sparkles className="mr-1 size-3" /> AI-powered QA workflow
      </Badge>
      <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
        Turn requirements into a <span className="text-gradient">complete test plan</span> in
        seconds.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
        Paste a user story or acceptance criteria. Get positive, negative & edge cases, test data
        suggestions, and a runnable Playwright skeleton — instantly.
      </p>
    </div>
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
    <Card className="border-dashed border-border/50 bg-card/30 p-10 text-center backdrop-blur">
      <Beaker className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">
        Your generated test plan will appear here.
      </p>
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <Card className="border-border/50 bg-card/60 p-6 backdrop-blur">
      <Skeleton className="h-6 w-48" />
      <div className="mt-4 grid gap-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
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

function Results({ plan }: { plan: TestPlan }) {
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
        <Button variant="outline" size="sm" onClick={copyJson} className="border-border/60">
          <Copy className="size-3.5" /> Copy JSON
        </Button>
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
