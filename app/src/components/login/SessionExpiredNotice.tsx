"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, History } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SessionExpiredNotice = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  const [countdown, setCountdown] = useState(15);

  const emailPrefill = searchParams.get("email") ?? "";

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          router.push(`/auth/login${emailPrefill ? `?email=${encodeURIComponent(emailPrefill)}` : ""}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [emailPrefill, router]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enableMotion = hasMounted && !prefersReducedMotion;

  return (
    <motion.section
      className="mx-auto mt-16 w-full max-w-2xl space-y-8 rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-[0_28px_90px_-45px_rgba(37,64,120,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0c152b]/95 dark:shadow-[0_55px_140px_-60px_rgba(13,25,58,0.9)]"
      initial={enableMotion ? { opacity: 0, y: 18 } : undefined}
      animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
      transition={enableMotion ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] } : undefined}
    >
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-warning shadow-sm">
        Session Timeout
      </div>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/15 text-warning shadow-inner shadow-warning/20">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">Your session has expired</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          For security reasons we signed you out. Please sign in again to continue.
        </p>
        {emailPrefill ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Email pre-filled for quick sign in:{" "}
            <span className="font-semibold text-neutral-600 dark:text-neutral-200">{emailPrefill}</span>
          </p>
        ) : null}
      </div>
      <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
        <p>We&apos;ll redirect you to the secure login page in {countdown}s.</p>
        <button
          type="button"
          onClick={() =>
            router.push(`/auth/login${emailPrefill ? `?email=${encodeURIComponent(emailPrefill)}` : ""}`)
          }
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 font-semibold text-brand-gradientEnd transition hover:border-brand-gradientEnd hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-[#101c36] dark:text-neutral-100"
        >
          <History className="h-4 w-4" />
          Sign in now
        </button>
      </div>
      <footer className="text-xs text-neutral-500 dark:text-neutral-400">
        Need help?{" "}
        <Link
          href="/support"
          className="font-semibold text-brand-gradientEnd transition hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2"
        >
          Contact support
        </Link>
        .
      </footer>
    </motion.section>
  );
};


