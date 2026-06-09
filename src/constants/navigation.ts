import {
  BarChart3,
  Bot,
  ClipboardList,
  FolderKanban,
  History,
  PlayCircle,
  Rocket,
  UserCircle,
  Users,
  Wand2,
} from "lucide-react";

import type { ActiveView } from "@/types/app";

export const NAV_ITEMS: Array<{
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
  { label: "Test Execution", value: "execution", icon: PlayCircle, description: "Manual test runs" },
  { label: "AI Chat", value: "chat", icon: Bot, description: "Requirement assistant" },
  { label: "Team Workspace", value: "workspace", icon: Users, description: "Members and roles" },
  { label: "Analytics", value: "analytics", icon: BarChart3, description: "Coverage and productivity" },
  { label: "Pricing", value: "pricing", icon: Rocket, description: "Plans and billing" },
  { label: "Profile", value: "profile", icon: UserCircle, description: "Account settings" },
];
