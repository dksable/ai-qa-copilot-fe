import {
  BarChart3,
  Bot,
  Building2,
  ClipboardList,
  CreditCard,
  FolderKanban,
  GitBranch,
  GitCompare,
  GitPullRequest,
  History,
  LayoutDashboard,
  PlayCircle,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import type { ActiveView } from "@/types/app";

export type NavigationItem = {
  label: string;
  value: ActiveView;
  icon: LucideIcon;
  description: string;
  children?: NavigationItem[];
};

export const NAV_ITEMS: NavigationItem[] = [
  { label: "Dashboard", value: "dashboard", icon: LayoutDashboard, description: "Workspace overview" },
  { label: "Projects", value: "projects", icon: FolderKanban, description: "Projects and modules" },
  {
    label: "AI Test Design",
    value: "generator",
    icon: Wand2,
    description: "Generate, chat, review",
    children: [
      { label: "Test Generator", value: "generator", icon: Wand2, description: "Create AI QA assets" },
      { label: "AI Chat", value: "chat", icon: Bot, description: "Requirement assistant" },
      { label: "Test History", value: "history", icon: History, description: "Versions and exports" },
      { label: "Review Queue", value: "review", icon: ClipboardList, description: "Approvals" },
    ],
  },
  {
    label: "Repository Intelligence",
    value: "repository-automation",
    icon: GitBranch,
    description: "Repos, impact, PRs",
    children: [
      { label: "Application Repositories", value: "repository-application", icon: GitBranch, description: "Frontend/backend repos" },
      { label: "Automation Repository", value: "repository-automation", icon: GitPullRequest, description: "Playwright repo setup" },
      { label: "Repository Activity", value: "repository-activity", icon: GitCompare, description: "Webhook events" },
      { label: "AI Impact Analysis", value: "repository-impact", icon: ShieldCheck, description: "Map changes to tests" },
      { label: "Playwright Update Workflow", value: "repository-playwright", icon: GitPullRequest, description: "Validate and create PRs" },
    ],
  },
  { label: "Manual Test Execution", value: "execution", icon: PlayCircle, description: "Manual test runs" },
  { label: "Analytics", value: "analytics", icon: BarChart3, description: "Coverage and productivity" },
  { label: "Team Workspace", value: "workspace", icon: Users, description: "Members and roles" },
  {
    label: "Settings",
    value: "settings-profile",
    icon: Settings,
    description: "Admin and account",
    children: [
      { label: "AI Providers", value: "settings-ai-providers", icon: Bot, description: "BYOAI configuration" },
      { label: "Profile", value: "settings-profile", icon: UserCircle, description: "Account settings" },
      { label: "Workspace", value: "settings-workspace", icon: Building2, description: "Workspace settings" },
      { label: "Billing", value: "settings-billing", icon: CreditCard, description: "Plans and usage" },
    ],
  },
];

export const FLAT_NAV_ITEMS = NAV_ITEMS.flatMap((item) => [item, ...(item.children ?? [])]);
