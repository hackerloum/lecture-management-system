import { Loader2 } from "lucide-react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export default function SettingsLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />
      <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              Loading settings...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

