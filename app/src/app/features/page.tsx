"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  BarChart3,
  Calendar,
  Users,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  Bell,
  Download,
} from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";

const mainFeatures = [
  {
    icon: Users,
    title: "Student Management",
    description: "Comprehensive student profiles with enrollment tracking, progress monitoring, and detailed academic history.",
    features: [
      "Unlimited student records",
      "Profile management & photos",
      "Enrollment tracking",
      "Academic history logs",
      "Parent/guardian info",
      "Custom field support",
    ],
  },
  {
    icon: BarChart3,
    title: "Smart Grading",
    description: "Automated grade calculations with weighted assignments, rubrics, and performance analytics at your fingertips.",
    features: [
      "Weighted calculations",
      "Letter & percentage grading",
      "Custom rubrics",
      "Bulk grade import (CSV)",
      "Performance analytics",
      "Export-ready transcripts",
    ],
  },
  {
    icon: Calendar,
    title: "Real-time Attendance",
    description: "Track attendance patterns, generate compliance reports, and identify at-risk students automatically.",
    features: [
      "Live attendance tracking",
      "Biometric & RFID support",
      "Automated reports",
      "Risk pattern detection",
      "Smart notifications",
      "LMS/SIS integration",
    ],
  },
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Organize courses, manage curricula, and track learning outcomes with powerful planning tools.",
    features: [
      "Course planning tools",
      "Curriculum mapping",
      "Learning outcomes",
      "Schedule management",
      "Resource allocation",
      "Section management",
    ],
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Real-time dashboards and insights to track performance, engagement, and institutional metrics.",
    features: [
      "Real-time dashboards",
      "Performance metrics",
      "Engagement tracking",
      "Custom reports",
      "Data visualizations",
      "Trend analysis",
    ],
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Bank-level encryption, SOC 2 certification, and FERPA/GDPR compliance built into every feature.",
    features: [
      "Bank-level encryption",
      "SOC 2 Type II certified",
      "FERPA compliant",
      "GDPR compliant",
      "Role-based access",
      "Audit logs",
    ],
  },
];

const additionalFeatures = [
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on assignments and projects",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Automated alerts for grades, attendance, and deadlines",
  },
  {
    icon: Download,
    title: "Bulk Export",
    description: "Export data in CSV, PDF, and Excel formats",
  },
  {
    icon: FileText,
    title: "Report Generation",
    description: "Automated compliance and performance reports",
  },
];

export default function FeaturesPage() {
  const prefersReducedMotion = useReducedMotion();

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

      <main className="relative z-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-16 text-center"
          >
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-white/10 dark:text-purple-400"
              initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Zap className="h-4 w-4" />
              Powerful Features
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Manage Your Classes
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              From student management to advanced analytics, our platform provides all the tools educators need to succeed.
            </p>
          </motion.div>

          {/* Main Features Grid */}
          <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  {/* Icon */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Icon className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2">
                    {feature.features.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Features */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="mb-8 text-center text-3xl font-bold text-neutral-900 dark:text-white">
              And Much More...
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {additionalFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                        <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-12 text-center backdrop-blur-sm"
          >
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
                Ready to Transform Your Workflow?
              </h2>
              <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
                Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/pricing"
                  className="flex h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

