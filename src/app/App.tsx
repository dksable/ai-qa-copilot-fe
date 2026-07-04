import { lazy, Suspense } from "react";

import { AppProviders } from "@/app/providers/AppProviders";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";

const AppShell = lazy(() => import("@/app/layouts/AppShell"));

export default function App() {
  return (
    <AppProviders>
      <DashboardLayout>
        <Suspense fallback={null}>
          <AppShell />
        </Suspense>
      </DashboardLayout>
    </AppProviders>
  );
}
