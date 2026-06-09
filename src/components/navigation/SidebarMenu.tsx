import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import type { ActiveView } from "@/types/app";

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
  return (
    <nav className={compact ? "space-y-1 p-3" : "flex-1 space-y-1 overflow-y-auto p-3"}>
      {NAV_ITEMS.map(({ label, value, icon: Icon, description }) => (
        <button
          key={value}
          type="button"
          onClick={() => onNavigate(value)}
          className={cn(
            compact
              ? "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors"
              : "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
              {!compact && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
