import { Bell, ChevronDown, Keyboard, Menu, Moon, Search, Sun, UserCircle, XCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import type { AuthContextResponse } from "@/shared/services/projects";
import type { Theme } from "@/shared/types/app";

export function TopHeader({
  theme,
  isCollapsed,
  auth,
  onMobileOpen,
  onToggleTheme,
  onSearchOpen,
  onShortcutsOpen,
  onLogin,
  onProfile,
  onLogout,
}: {
  theme: Theme;
  isCollapsed: boolean;
  auth: AuthContextResponse | null;
  onMobileOpen: () => void;
  onToggleTheme: () => void;
  onSearchOpen: () => void;
  onShortcutsOpen: () => void;
  onLogin: () => void;
  onProfile: () => void;
  onLogout: () => void;
}) {
  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-30 border-b border-border/40 bg-background/75 backdrop-blur-xl transition-[padding] duration-300",
        isCollapsed ? "lg:pl-20" : "lg:pl-72",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 lg:hidden"
          onClick={onMobileOpen}
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </Button>

        <button
          type="button"
          onClick={onSearchOpen}
          className="hidden h-10 min-w-0 flex-1 items-center gap-3 rounded-lg border border-border/50 bg-surface/60 px-3 text-left text-sm text-muted-foreground shadow-sm transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:flex"
          aria-label="Open global search"
        >
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search projects, requirements, repositories, validations...</span>
          <kbd className="ml-auto rounded border border-border/60 bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">/</kbd>
        </button>

        <div className="ml-auto flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
            onClick={onShortcutsOpen}
          >
            <Keyboard className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" className="size-10" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="size-10"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          {auth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="h-10 gap-2.5 px-3.5">
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
            <Button type="button" className="h-10 bg-gradient-primary text-primary-foreground" onClick={onLogin}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
