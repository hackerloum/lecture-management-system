"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const highlightPills = [
  {
    title: "Secure by default",
    subtitle: "SOC 2 & FERPA compliant from day one.",
  },
  {
    title: "Realtime visibility",
    subtitle: "Dashboards that surface what matters.",
  },
  {
    title: "Faculty-first UX",
    subtitle: "Crafted for lecturers, registrars, and admins.",
  },
] as const;

export const HeroContent = () => {
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enableMotion = hasMounted && !prefersReducedMotion;

  return (
    <div className="relative flex flex-col gap-8">
      <div className="space-y-6">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/90 backdrop-blur-sm"
          initial={enableMotion ? { opacity: 0, y: -8 } : undefined}
          animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
          transition={enableMotion ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] } : undefined}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-gradientStart via-brand-light to-brand-gradientEnd text-sm text-white shadow-lg">
            LMS
          </span>
          Lecturer System
        </motion.div>

        <div className="space-y-4">
          <motion.h2
            className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl"
            initial={enableMotion ? { opacity: 0, y: -12 } : undefined}
            animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
            transition={enableMotion ? { delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] } : undefined}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Your Academic Hub
            </span>
          </motion.h2>
          <motion.p
            className="max-w-md text-lg leading-relaxed text-white/80"
            initial={enableMotion ? { opacity: 0, y: -8 } : undefined}
            animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
            transition={enableMotion ? { delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] } : undefined}
          >
            Access student records, grades, attendance, and more—all within a secure platform designed for
            modern academic teams.
          </motion.p>
        </div>

        <motion.ul
          className="grid gap-3 sm:grid-cols-2"
          initial={enableMotion ? { opacity: 0, y: 12 } : undefined}
          animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
          transition={enableMotion ? { delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] } : undefined}
        >
          {highlightPills.map((pill) => (
            <li
              key={pill.title}
              className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white/90 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {pill.title}
              </span>
              <span className="leading-relaxed text-sm">{pill.subtitle}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/80 backdrop-blur-sm"
        initial={enableMotion ? { opacity: 0, y: 12 } : undefined}
        animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
        transition={enableMotion ? { delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] } : undefined}
      >
        <span>Don&apos;t have an account?</span>
        <Link
          href="/signup"
          className="group relative font-semibold text-white transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          Create one now
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-blue-200 to-purple-200 transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
        </Link>
      </motion.div>
    </div>
  );
};


