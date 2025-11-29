"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Settings page error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />
      <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle className="mb-4 h-16 w-16 text-red-600 dark:text-red-400" />
            <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
              Something went wrong!
            </h2>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              {error.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

