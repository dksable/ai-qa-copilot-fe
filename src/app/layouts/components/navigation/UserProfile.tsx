import { cn } from "@/shared/utils";
import type { AuthContextResponse } from "@/shared/services/projects";

export function UserProfile({
  auth,
  isCollapsed = false,
}: {
  auth: AuthContextResponse | null;
  isCollapsed?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-xl bg-surface/50 p-3", isCollapsed && "justify-center p-2")}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
        DS
      </div>
      {!isCollapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{auth?.user.fullName ?? "Guest"}</p>
          <p className="truncate text-xs leading-5 text-muted-foreground">{auth?.role ?? "Public visitor"}</p>
        </div>
      )}
    </div>
  );
}
