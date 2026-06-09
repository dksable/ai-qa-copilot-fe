import { lazy, Suspense } from "react";

import { AppProviders } from "@/contexts/AppProviders";
import { DashboardLayout } from "@/layouts/DashboardLayout";

const AppShell = lazy(() => import("@/pages/AppShell"));

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
