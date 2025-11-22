"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Award, Sparkles } from "lucide-react";

const trialFeatureColumns = [
  {
    title: "All Features Access",
    items: ["All platform features", "No limitations", "Full API access"],
  },
  {
    title: "Full Student Roster",
    items: ["Import unlimited students", "Unlimited courses", "Unlimited assignments"],
  },
  {
    title: "Advanced Analytics",
    items: ["Performance insights", "Trend analysis", "Exportable reports"],
  },
  {
    title: "Dedicated Support",
    items: ["Email support", "Chat support", "Onboarding assistance"],
  },
  {
    title: "Team Collaboration",
    items: ["Multi-user access", "Role-based permissions", "Comprehensive audit logs"],
  },
  {
    title: "Mobile App Access",
    items: ["iOS & Android apps", "Offline mode", "Faculty & student portals"],
  },
] as const;

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + index * 0.1,
      duration: 0.4,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

export const TrialDetails = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="trial-details-heading" className="py-16">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-10 rounded-[32px] border border-neutral-200/70 bg-white/95 px-8 py-12 text-[#0f1a30] shadow-[0_45px_95px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.05] dark:text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-light/30 bg-brand-light/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-light">
              What’s Included
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500 dark:text-slate-300/80">
              Ready on Day One
            </p>
          </div>

          <div className="space-y-4">
            <h2 id="trial-details-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What&apos;s Included in Your Free Trial?
            </h2>
            <p className="max-w-3xl text-sm text-neutral-600 dark:text-slate-300">
              Everything your team needs to evaluate the platform thoroughly—unlocked features, unlimited data, and
              concierge onboarding without any hidden costs.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {trialFeatureColumns.map((column, index) => (
              <motion.div
                key={column.title}
                custom={index}
                initial={shouldReduceMotion ? undefined : "hidden"}
                whileInView={shouldReduceMotion ? undefined : "visible"}
                viewport={{ once: true, amount: 0.25 }}
                variants={columnVariants}
                className="group flex min-h-[200px] flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/95 px-5 py-6 text-neutral-700 shadow-[0_24px_48px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:border-brand-gradientEnd/40 hover:shadow-[0_35px_75px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light/15 text-sm text-brand-gradientEnd shadow-[0_12px_24px_rgba(76,44,217,0.25)]">
                    <Award className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-900 dark:text-white/85">
                    {column.title}
                  </h3>
                </div>
                <ul className="space-y-2 text-sm">
                  {column.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-semibold text-emerald-500 dark:text-emerald-300">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto h-px w-full rounded-full bg-gradient-to-r from-brand-gradientStart/10 via-brand-gradientEnd/15 to-transparent" />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300/80">
            <p>No feature limits</p>
            <p>Security & compliance included</p>
            <p>Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
};
