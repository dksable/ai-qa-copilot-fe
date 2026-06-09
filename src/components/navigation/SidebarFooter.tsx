import type { AuthContextResponse } from "@/services/projects";

import { UserProfile } from "./UserProfile";

export function SidebarFooter({
  auth,
  isCollapsed = false,
}: {
  auth: AuthContextResponse | null;
  isCollapsed?: boolean;
}) {
  return (
    <div className="border-t border-border/40 p-4">
      <UserProfile auth={auth} isCollapsed={isCollapsed} />
    </div>
  );
}
