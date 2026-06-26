import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SidebarHeader({
  isCollapsed = false,
  onToggleCollapsed,
  mobile = false,
}: {
  isCollapsed?: boolean;
  onToggleCollapsed?: () => void;
  mobile?: boolean;
}) {
  return (
    <div className="flex h-16 items-center gap-3 border-b border-border/40 px-4">
      {(!isCollapsed || mobile) && (
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold">AI QA Copilot</p>
          <p className="truncate text-xs leading-5 text-muted-foreground">Enterprise QA intelligence</p>
        </div>
      )}
      {onToggleCollapsed && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          className="ml-auto size-9"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      )}
    </div>
  );
}
