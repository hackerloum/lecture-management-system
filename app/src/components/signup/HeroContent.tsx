"use client";

/* eslint-disable @typescript-eslint/consistent-type-definitions */

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  Variants,
} from "framer-motion";
import {
  BarChart3,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useMemo, useRef, type ReactNode } from "react";

type Benefit = {
  icon: ReactNode;
  title: string;
  description: string[];
};

const trustIndicators = [
  "500+ Institutions Trust Us",
  "99.9% System Uptime",
  "Enterprise Security (SOC 2 Compliant)",
  "GDPR & FERPA Compliant",
];

const benefits: Benefit[] = [
  {
    icon: <Timer className="h-10 w-10 text-brand-gradientEnd" strokeWidth={1.8} />,
    title: "Save 5+ Hours Weekly",
    description: [
      "Automate grading, attendance & reports",
      "Reduce administrative burden instantly",
    ],
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-brand-gradientEnd" strokeWidth={1.8} />,
    title: "Powerful Analytics",
    description: [
      "Real-time insights into student performance",
      "Data-driven decisions for better outcomes",
    ],
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-brand-gradientEnd" strokeWidth={1.8} />,
    title: "Designed By Educators",
    description: [
      "Built by academics, for educators",
      "Every feature solves real problems",
    ],
  },
  {
    icon: <Rocket className="h-10 w-10 text-brand-gradientEnd" strokeWidth={1.8} />,
    title: "30-Min Setup",
    description: [
      "Import student data and start in minutes",
      "Expert onboarding support included",
    ],
  },
];

const trustBadgeVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + index * 0.1,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const benefitVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6 + index * 0.1,
      duration: 0.45,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const assurances = [
  {
    title: "Launch Success Plan",
    description:
      "Dedicated onboarding specialists guide your first 30 days with checklists, milestone reviews, and tailored resources.",
  },
  {
    title: "Enterprise Safeguards",
    description:
      "SOC 2 controls, FERPA compliance, and 99.9% SLA uptime built into every trial environment—no exceptions.",
  },
  {
    title: "Unified Integrations",
    description:
      "Pre-built SIS, LMS, and HR connectors activate instantly so your data flows on day one—no middleware or hidden fees.",
  },
  {
    title: "Human Support",
    description:
      "Live onboarding concierge, office hours, and a curated success library ensure every stakeholder sees value fast.",
  },
] as const;

export const HeroContent = () => {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "end 0.4"],
  });

  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -60]);
  const quoteParallax = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -40]);

  const gradientOverlay = useMemo(
    () =>
      "bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.28),_transparent_65%)]",
    []
  );

  return (
    <div ref={containerRef} className="space-y-16 lg:space-y-20">
      <section className="relative overflow-hidden rounded-[36px] border border-white/20 bg-gradient-to-br from-white via-[#eef2ff] to-[#f5fafe] p-10 text-[#111b2c] shadow-[0_45px_95px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0d192f] dark:via-[#101f3f] dark:to-[#0b162d] sm:p-14">
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 opacity-90 mix-blend-screen ${gradientOverlay}`}
        />
        <motion.div
          style={{ y: heroParallax }}
          className="relative z-10 space-y-8"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="space-y-4">
            <motion.h1
              className="max-w-2xl font-heading text-4xl font-semibold leading-tight tracking-tight text-[#0d1a33] dark:text-white sm:text-5xl lg:text-6xl"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="bg-gradient-to-r from-brand-gradientStart via-[#4f46e5] to-brand-gradientEnd bg-clip-text text-transparent">
                Join Educators Transforming Academic Management
              </span>
            </motion.h1>
            <motion.p
              className="text-lg text-[#425066] dark:text-neutral-200 sm:text-xl"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              14 days free. No credit card required. Cancel anytime.
            </motion.p>
          </div>

          <motion.ul className="flex flex-wrap items-center gap-4 text-sm text-[#4a5873] dark:text-white/70">
            {trustIndicators.map((indicator, index) => (
              <motion.li
                key={indicator}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={trustBadgeVariants}
                className="flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/80 px-4 py-2 text-neutral-600 shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:border-brand-gradientEnd/60 hover:bg-white hover:text-neutral-900 dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:border-white/40 dark:hover:text-white"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-200">
                  ✓
                </span>
                <span>{indicator}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <div aria-hidden className="pointer-events-none absolute -left-10 top-1/3 h-36 w-36 rounded-full bg-brand-gradientEnd/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 top-10 h-48 w-48 rounded-full bg-cyan-400/15 blur-[120px]" />
      </section>

      <section aria-labelledby="benefits-heading" className="space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-brand-light/30 bg-brand-light/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-brand-light">
            Why Choose Lecturer System?
          </div>
          <h2
            id="benefits-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl"
          >
            Purpose-built tools for modern institutions
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Automate the busywork and empower every faculty member to focus on teaching.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={benefitVariants}
              className="group relative overflow-hidden rounded-2xl border border-white/35 bg-gradient-to-br from-white via-[#f7f5ff] to-white p-6 shadow-[0_28px_65px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1b33]/85 dark:via-[#0c1529]/85 dark:to-[#0a1324]/85"
            >
              <div className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-gradient-to-b from-brand-gradientStart to-brand-gradientEnd opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="flex h-full flex-col gap-4">
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gradientStart/12 to-brand-gradientEnd/18 text-brand-gradientEnd shadow-[0_15px_30px_rgba(76,44,217,0.25)] transition duration-300 group-hover:scale-110 group-hover:rotate-2"
                  whileInView={prefersReducedMotion ? undefined : { scale: [0.92, 1] }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  {benefit.icon}
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {benefit.title}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                    {benefit.description.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <motion.blockquote
        style={{ y: quoteParallax }}
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-white via-[#f4f3ff] to-white p-8 shadow-[0_45px_95px_rgba(15,23,42,0.12)] dark:border-brand-gradientStart/30 dark:from-white/5 dark:via-[#0b1326] dark:to-brand-gradientEnd/10"
      >
        <div className="absolute inset-0 -left-5 w-1 rounded-full bg-gradient-to-b from-brand-gradientStart via-[#4f46e5] to-brand-gradientEnd" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-transparent bg-gradient-to-br from-brand-gradientStart to-brand-gradientEnd p-[2px] shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-2xl text-brand-gradientStart dark:bg-[#0f172a] dark:text-white">
              SJ
            </div>
            <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs text-white shadow-md">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="space-y-3 text-neutral-700 dark:text-neutral-100">
            <p className="text-lg italic leading-relaxed text-neutral-700/80 dark:text-neutral-100/80">
              “Lecturer System cut our grading time by 60%. Our students love the mobile app for checking grades
              and our staff couldn’t imagine going back.”
            </p>
            <footer className="space-y-1 text-sm">
              <div className="font-semibold text-neutral-800 dark:text-white">Dr. Sarah Johnson</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">
                Department Head, Harvard University
              </div>
            </footer>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {assurances.map((assurance, index) => (
            <motion.div
              key={assurance.title}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.24, 0.82, 0.165, 1] }}
              className="group flex flex-col gap-3 rounded-2xl border border-neutral-200/70 bg-gradient-to-br from-white via-[#f7f8ff] to-white px-5 py-6 text-neutral-700 shadow-[0_28px_60px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 hover:border-brand-gradientEnd/40 hover:shadow-[0_36px_80px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1b33]/85 dark:via-[#0c1529]/85 dark:to-[#0a1324]/85 dark:text-slate-200"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light/15 text-sm text-brand-gradientEnd shadow-[0_12px_24px_rgba(76,44,217,0.25)]">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-800 dark:text-white/85">
                  {assurance.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-slate-300">
                {assurance.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.blockquote>

    </div>
  );
};


