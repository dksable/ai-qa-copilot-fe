import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { NAV_ITEMS } from "@/shared/constants/navigation";
import { cn } from "@/shared/utils";
import type { ActiveView } from "@/shared/types/app";

export function SidebarMenu({
  activeView,
  isCollapsed = false,
  compact = false,
  onNavigate,
}: {
  activeView: ActiveView;
  isCollapsed?: boolean;
  compact?: boolean;
  onNavigate: (view: ActiveView) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Set<ActiveView>>(new Set());

  useEffect(() => {
    const activeGroup = NAV_ITEMS.find((item) => item.children?.some((child) => child.value === activeView));
    if (!activeGroup) return;
    setOpenGroups((current) => {
      if (current.has(activeGroup.value)) return current;
      const next = new Set(current);
      next.add(activeGroup.value);
      return next;
    });
  }, [activeView]);

  return (
    <nav className={compact ? "space-y-1.5 p-4" : "flex-1 space-y-1.5 overflow-y-auto p-4"}>
      {NAV_ITEMS.map(({ label, value, icon: Icon, description, children }) => {
        const childIsActive = children?.some((child) => child.value === activeView) ?? false;
        const isActive = activeView === value || childIsActive;
        const hasChildren = Boolean(children?.length);
        const isOpen = openGroups.has(value) || childIsActive;

        return (
          <div key={value} className="space-y-1">
            <button
              type="button"
              onClick={() => {
                if (hasChildren) {
                  setOpenGroups((current) => {
                    const next = new Set(current);
                    if (next.has(value)) next.delete(value);
                    else next.add(value);
                    return next;
                  });
                  return;
                }
                onNavigate(value);
              }}
              className={cn(
                compact
                  ? "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors"
                  : "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-primary/12 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
                  : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
                isCollapsed && "justify-center px-2",
              )}
              title={isCollapsed ? label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
              {!isCollapsed && (
                <span className="min-w-0">
                  <span className="block font-medium">{label}</span>
                  {!compact && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
                </span>
              )}
              {!isCollapsed && hasChildren && (
                <ChevronDown
                  className={cn(
                    "ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180 text-primary",
                  )}
                />
              )}
            </button>

            {!isCollapsed && children?.length && isOpen ? (
              <div className={cn("ml-5 space-y-1 border-l border-border/50 pl-3", compact && "ml-4 pl-2")}>
                {children.map(({ label: childLabel, value: childValue, icon: ChildIcon }) => (
                  <button
                    key={childValue}
                    type="button"
                    onClick={() => onNavigate(childValue)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      activeView === childValue
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
                    )}
                    aria-current={activeView === childValue ? "page" : undefined}
                  >
                    <ChildIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{childLabel}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
