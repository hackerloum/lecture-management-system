"use client";

import { motion, useReducedMotion } from "framer-motion";

import { CTASection } from "@/components/landing/CTASection";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navigation } from "@/components/landing/Navigation";
import { PricingCard } from "@/components/landing/PricingCard";
import { StatCard } from "@/components/landing/StatCard";
import { Testimonial } from "@/components/landing/TestimonialCard";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";

const featureCards = [
  {
    icon: "👥",
    title: "Student Management",
    description:
      "Instantly manage student profiles, track enrollment, and monitor progress.",
    href: "/features",
  },
  {
    icon: "📊",
    title: "Smart Grading",
    description:
      "Automated grade calculations, weighted assignments, and performance analytics.",
    href: "/features",
  },
  {
    icon: "📅",
    title: "Real-time Attendance",
    description:
      "Track attendance patterns, generate reports, and identify trends automatically.",
    href: "/features",
  },
];

const statistics = [
  {
    icon: "📊",
    value: 10000,
    suffix: "+",
    label: "Student records managed daily",
  },
  {
    icon: "⏱️",
    value: 40,
    suffix: " minutes",
    label: "Time saved per lecturer every week",
  },
  {
    icon: "🎓",
    value: 500,
    suffix: "+",
    label: "Institutions trust our platform",
  },
  {
    icon: "🚀",
    value: 99.9,
    suffix: "%",
    label: "Guaranteed system uptime",
  },
];

const pricingTiers = [
  {
    tier: "Free",
    description: "Perfect for trying out the platform",
    price: "$0",
    cadence: "forever",
    features: [
      "Up to 50 students",
      "1 active course",
      "Basic attendance tracking",
      "Simple grade management",
      "Email support",
    ],
    ctaLabel: "Start Free",
    ctaHref: "/signup",
  },
  {
    tier: "Professional",
    description: "For individual lecturers",
    price: "$29",
    cadence: "month",
    features: [
      "Unlimited students & courses",
      "QR code attendance system",
      "AI-powered insights",
      "Real-time analytics",
      "Priority support",
      "Mobile app access",
    ],
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    tier: "Organization",
    description: "For universities & institutions",
    price: "$99+",
    cadence: "month",
    features: [
      "1-10+ lecturers",
      "Up to 500+ students",
      "Centralized admin dashboard",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
    ],
    ctaLabel: "View Plans",
    ctaHref: "/pricing",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "This platform has saved me five hours per week. The interface is intuitive and the support team is fantastic.",
    name: "Dr. Sarah Johnson",
    title: "Department Head, Harvard University",
    avatarInitials: "SJ",
  },
  {
    quote:
      "Finally, a system built by educators for educators. Every feature we asked for is here.",
    name: "Prof. Michael Chen",
    title: "Lecturer, Stanford University",
    avatarInitials: "MC",
  },
  {
    quote:
      "Our entire department transitioned in two weeks. Onboarding was seamless and students adopted it immediately.",
    name: "Dr. Emily Rodriguez",
    title: "Academic Coordinator, MIT",
    avatarInitials: "ER",
  },
];

const dashboardBadges = [
  "📊 Real-time Analytics",
  "🔄 Live Updates",
  "📱 Mobile Responsive",
  "🎨 Customizable Dashboard",
  "⚡ Lightning Fast",
  "🔐 Bank-level Security",
];

const SectionHeading = ({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) => (
  <div className="mx-auto max-w-3xl text-center">
    <span className="inline-flex items-center justify-center rounded-full border border-brand-light/40 bg-brand-light/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-light">
      {label}
    </span>
    <h2 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
      {title}
    </h2>
    <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
      {description}
    </p>
  </div>
);

const FeatureMedia = ({
  variant,
}: {
  variant: "grades" | "attendance" | "dashboard" | "analytics";
}) => {
  const shouldReduceMotion = useReducedMotion();

  const baseClasses =
    "relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/20 via-white/5 to-transparent p-8 shadow-[0_35px_80px_rgba(15,23,42,0.2)] backdrop-blur-xl dark:border-white/10 dark:from-white/5 dark:via-white/5 dark:to-white/[0.02]";

  if (variant === "grades") {
    return (
      <motion.div
        className={baseClasses}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-gradientStart/30 to-transparent" />
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white/70">
                Weighted Average
              </p>
              <p className="text-3xl font-bold text-white">92.4%</p>
            </div>
            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
              +8.2% YoY
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            <table className="w-full text-left text-sm text-white/80">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-white/50">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Coursework</th>
                  <th className="px-4 py-3">Midterm</th>
                  <th className="px-4 py-3">Final</th>
                  <th className="px-4 py-3 text-right">Grade</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["A. Simmons", "88%", "90%", "95%", "A"],
                  ["R. Patel", "94%", "92%", "93%", "A"],
                  ["M. Okafor", "86%", "88%", "90%", "A-"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-white/5 transition hover:bg-white/10"
                  >
                    {row.map((cell, idx) => (
                      <td
                        key={cell}
                        className={`px-4 py-3 ${idx === row.length - 1 ? "text-right font-semibold" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Rubrics Applied", value: "24 templates" },
              { label: "Bulk Imports", value: "1,240 records" },
              { label: "Feedback Delivered", value: "642 comments" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white/80"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "attendance") {
    return (
      <motion.div
        className={baseClasses}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative z-10 space-y-6 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">Real-time Attendance Flow</p>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
              Sync enabled
            </span>
          </div>
          <div className="space-y-4">
            {[
              {
                time: "08:00",
                course: "Quantum Mechanics",
                status: "98% present",
              },
              {
                time: "10:00",
                course: "Data Structures",
                status: "92% present",
              },
              {
                time: "13:00",
                course: "Educational Psychology",
                status: "96% present",
              },
            ].map((item) => (
              <div
                key={item.course}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light/20 text-sm font-semibold text-white">
                  {item.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.course}</p>
                  <p className="text-xs text-white/60">{item.status}</p>
                </div>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-medium text-emerald-200">
                  Trend ↑
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Alerts
              </p>
              <p className="mt-2 text-lg font-semibold">Early interventions</p>
              <p className="mt-1 text-sm text-white/70">
                12 students flagged this week
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Insights
              </p>
              <p className="mt-2 text-lg font-semibold">Attendance heatmap</p>
              <p className="mt-1 text-sm text-white/70">
                Identify trends across cohorts instantly
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "dashboard") {
  return (
      <motion.div
        className={baseClasses}
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative z-10 space-y-5 text-white">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active Lecturers", value: "248" },
              { label: "Courses Live", value: "1,120" },
              { label: "Assessments", value: "6,542" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4"
                initial={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, y: 20, scale: 0.95 }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 1, y: 0, scale: 1 }
                }
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.45,
                  delay: shouldReduceMotion ? 0 : index * 0.08,
                  ease: [0.24, 0.82, 0.165, 1],
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -8, scale: 1.02, transition: { duration: 0.25 } }
                }
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="rounded-2xl border border-white/10 bg-gradient-to-tr from-brand-gradientStart/40 via-transparent to-transparent p-6"
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { y: -6, scale: 1.01, transition: { duration: 0.2 } }
            }
          >
            <p className="text-sm text-white/70">Engagement Overview</p>
            <motion.div
              className="relative mt-4 h-32 overflow-hidden rounded-xl bg-[linear-gradient(135deg,rgba(124,58,237,0.15),rgba(6,182,212,0.25))] backdrop-blur-sm"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      backgroundPosition: ["0% 60%", "100% 40%", "0% 60%"],
                    }
              }
              transition={{
                duration: 18,
                repeat: shouldReduceMotion ? 0 : Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: "250% 200%" }}
            >
              <svg
                role="img"
                aria-label="Engagement trend line over time"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="engagementLine"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(124,58,237,0.9)" />
                    <stop offset="50%" stopColor="rgba(6,182,212,0.9)" />
                    <stop offset="100%" stopColor="rgba(20,184,166,0.9)" />
                  </linearGradient>
                  <linearGradient
                    id="engagementFill"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(124,58,237,0.28)" />
                    <stop offset="100%" stopColor="rgba(14,165,233,0)" />
                  </linearGradient>
                </defs>
                {!shouldReduceMotion ? (
                  <>
                    <motion.path
                      d="M5 70 C 20 45, 32 85, 47 52 S 72 58, 95 35"
                      fill="url(#engagementFill)"
                      stroke="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2.8,
                        ease: [0.22, 1, 0.36, 1],
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 1.4,
                      }}
                      style={{ pathLength: 1 }}
                    />
                    <motion.path
                      d="M5 70 C 20 45, 32 85, 47 52 S 72 58, 95 35"
                      stroke="url(#engagementLine)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      fill="transparent"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        ease: [0.23, 1, 0.32, 1],
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 1.2,
                      }}
                    />
                    <motion.circle
                      r="2.8"
                      fill="rgba(255,255,255,0.95)"
                      stroke="rgba(124,58,237,0.6)"
                      strokeWidth="1.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 2,
                        ease: [0.23, 1, 0.32, 1],
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 1.2,
                      }}
                    >
                      <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        path="M5 70 C 20 45, 32 85, 47 52 S 72 58, 95 35"
                      />
                    </motion.circle>
                  </>
                ) : (
                  <>
                    <path
                      d="M5 70 C 20 45, 32 85, 47 52 S 72 58, 95 35"
                      stroke="url(#engagementLine)"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    <circle
                      cx="95"
                      cy="35"
                      r="2.6"
                      fill="rgba(255,255,255,0.95)"
                      stroke="rgba(124,58,237,0.6)"
                      strokeWidth="1.4"
                    />
                  </>
                )}
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#050816]/70 to-transparent" />
            </motion.div>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/10 p-4"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.24, 0.82, 0.165, 1] }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -6, scale: 1.01, transition: { duration: 0.2 } }
              }
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Upcoming events
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>Curriculum review — Tomorrow</li>
                <li>Faculty sync — Thursday</li>
                <li>Governance quarterly — Next Tuesday</li>
              </ul>
            </motion.div>
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/10 p-4"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: [0.24, 0.82, 0.165, 1] }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -6, scale: 1.01, transition: { duration: 0.2 } }
              }
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Response time
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">2m 14s</p>
              <p className="text-xs text-emerald-200">Support SLA maintained</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative z-10 space-y-5 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/70">Predictive Analytics</p>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/60">
            AI-Assisted
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: "At-risk alerts", value: "34 flagged" },
            { label: "Intervention success", value: "87%" },
            { label: "Retention forecast", value: "94%" },
            { label: "Funding alignment", value: "98%" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/10 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-brand-gradientStart/40 via-brand-light/25 to-transparent p-6">
          <p className="text-sm text-white/70">Insights timeline</p>
          <div className="mt-4 space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
              <p>
                Forecast predicts 12% increase in lecture attendance with
                adaptive scheduling.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
              <p>
                Departmental analytics recommend reallocating 5 instructors to
                high-demand courses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardPreviewSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="preview"
      className="relative overflow-hidden rounded-[36px] border border-neutral-200/60 bg-white p-6 shadow-[0_45px_90px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#0d1529] lg:p-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,44,217,0.12),transparent_60%)]"
      />
      <div className="relative z-10 space-y-10">
        <h3 className="text-center font-heading text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          See It In Action
        </h3>
        <div className="relative overflow-hidden rounded-[28px] border border-neutral-200/60 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 shadow-[0_35px_85px_rgba(15,23,42,0.18)] dark:border-white/10 dark:from-white/5 dark:via-white/5 dark:to-white/5">
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-[28px] bg-white/80 p-8 dark:bg-[#0d1428]/80"
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <div className="space-y-5">
                <div className="rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#111a30]">
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
                    Department Health
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-neutral-900 dark:text-white">
                    96% Efficiency
                  </p>
                  <div className="mt-4 h-32 rounded-2xl bg-[linear-gradient(135deg,#1e3a8a33,#7c3aed22)] dark:bg-[linear-gradient(135deg,#1e3a8a66,#7c3aed33)]" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: "Live Alerts",
                      value: "3",
                      accent: "bg-rose-500/15 text-rose-500",
                    },
                    {
                      label: "Faculty Satisfaction",
                      value: "4.9 ★",
                      accent: "bg-emerald-500/15 text-emerald-400",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-3xl border border-neutral-200/70 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#111a30]"
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-300">
                        {item.label}
                      </p>
                      <p className={`mt-3 text-2xl font-semibold ${item.accent}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  "Data flows automatically from your SIS with zero manual imports.",
                  "Interactive dashboards update in real time across devices.",
                  "Role-based access ensures sensitive data stays secure.",
                ].map((copy) => (
                  <motion.div
                    key={copy}
                    className="rounded-3xl border border-neutral-200/70 bg-white p-5 text-sm leading-relaxed text-neutral-600 shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#111a30] dark:text-neutral-200"
                    initial={shouldReduceMotion ? undefined : { opacity: 0, x: 30 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {copy}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                aria-hidden
                className="absolute -right-20 top-10 h-44 w-44 rounded-full bg-brand-light/20 blur-3xl"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: ["0%", "12%", "0%"],
                        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                      }
                }
              />
            </div>
          </motion.div>
        </div>
        <div className="grid gap-3 text-sm text-neutral-700 dark:text-neutral-200 sm:grid-cols-3">
          {dashboardBadges.map((badge) => (
            <div
              key={badge}
              className="flex items-center justify-center rounded-full border border-neutral-200/70 bg-white px-4 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-[#101a2f]"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <Navigation />
      
      {/* Static Background Elements */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-10"
        aria-hidden
      />

      <main className="relative z-10 flex flex-col gap-28 pb-24 pt-20 sm:gap-32 sm:pt-24">
        <HeroSection />

        <section id="features" className="container space-y-16">
          <SectionHeading
            label="Why Lecturers Choose Us"
            title="The only platform built specifically for educators"
            description="From enrollment to analytics, every workflow is crafted to help teams move faster while staying compliant."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={<span aria-hidden>{feature.icon}</span>}
                title={feature.title}
                description={feature.description}
                href={feature.href}
              />
            ))}
          </div>
        </section>

        <section
          id="stats"
          className="container space-y-12 rounded-[32px] border border-white/20 bg-white/10 p-10 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          <SectionHeading
            label="Proven Impact"
            title="Transform academic operations at scale"
            description="Performance-driven institutions rely on our platform to reduce admin time, increase student success, and maintain governance."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {statistics.map((stat) => (
              <StatCard
                key={stat.label}
                icon={<span aria-hidden>{stat.icon}</span>}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </section>

        <section id="security" className="container space-y-14">
          <SectionHeading
            label="Powerful Features"
            title="Designed for the entire academic lifecycle"
            description="Four foundational pillars keep educators, administrators, and students aligned without adding to your workload."
          />
          <div className="space-y-16">
            <FeatureShowcase
              id="grading"
              label="Grade Intelligence"
              title="Intelligent Grade Tracking"
              description="Automatically calculate weighted grades, apply rubrics, and provide feedback to students. No more spreadsheet chaos or manual audits."
              bullets={[
                { label: "Weighted assignment calculations" },
                { label: "Letter & percentage grading" },
                { label: "Bulk grade import (CSV)" },
                { label: "Export-ready transcripts (PDF)" },
              ]}
              ctaLabel="Explore Grading →"
              ctaHref="#grading"
              media={<FeatureMedia variant="grades" />}
            />
            <FeatureShowcase
              id="attendance"
              reverse
              label="Attendance Automation"
              title="Live Attendance & Intervention"
              description="Monitor attendance in real time, flag risk patterns automatically, and sync records with your LMS and SIS without duplicate entry."
              bullets={[
                { label: "Biometric & RFID integrations" },
                { label: "Automated compliance reporting" },
                { label: "Smart nudges & notifications" },
                { label: "Analytics-ready exports" },
              ]}
              ctaLabel="Learn about Attendance →"
              ctaHref="#attendance"
              media={<FeatureMedia variant="attendance" />}
            />
            <FeatureShowcase
              id="dashboard"
              label="Unified Command Center"
              title="Executive Dashboard for Every Role"
              description="A single view that brings faculty, departmental, and institutional metrics together. Tailored access ensures teams see exactly what they need."
              bullets={[
                { label: "Role-based dashboards" },
                { label: "Automated reporting cadences" },
                { label: "Cross-campus collaboration" },
                { label: "Custom widgets & KPIs" },
              ]}
              ctaLabel="Host a Live Walkthrough →"
              ctaHref="#preview"
              media={<FeatureMedia variant="dashboard" />}
              reverse
            />
            <FeatureShowcase
              id="analytics"
              label="Predictive Analytics"
              title="Insights that Drive Student Success"
              description="AI-powered analytics detect patterns before they become problems, helping administrators respond with proactive support and resource allocation."
              bullets={[
                { label: "Predictive at-risk detection" },
                { label: "Institution-wide benchmarks" },
                { label: "Automated intervention workflows" },
                { label: "Export to BI tools" },
              ]}
              ctaLabel="Dive into Analytics →"
              ctaHref="#analytics"
              media={<FeatureMedia variant="analytics" />}
            />
          </div>
        </section>

        <section id="api" className="container space-y-16">
          <DashboardPreviewSection />
        </section>

        <section
          id="testimonials"
          className="container space-y-16 rounded-[32px] border border-white/20 bg-white/10 p-12 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          <SectionHeading
            label="Loved by Educators Worldwide"
            title="Trusted by the world’s leading institutions"
            description="From Ivy League universities to international academies, Lecturer System delivers results educators can feel."
          />
          <TestimonialCarousel testimonials={testimonials} />
        </section>

        <section id="pricing" className="container space-y-16">
          <SectionHeading
            label="Simple, Transparent Pricing"
            title="Choose the plan that fits your institution"
            description="Start with a free trial and scale confidently with flexible pricing for lecturers, departments, and entire institutions."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.tier} {...tier} />
            ))}
          </div>
        </section>

        <div className="container">
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
