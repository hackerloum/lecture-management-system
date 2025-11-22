"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  Clock,
  Star,
  Globe,
  Zap,
  CheckCircle2,
  Target,
} from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";

const primaryStats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Student Records Managed Daily",
    description: "Active students using our platform worldwide",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Educational Institutions",
    description: "Universities and schools trust our system",
  },
  {
    icon: Clock,
    value: "40 min",
    label: "Time Saved Per Week",
    description: "Average time saved per lecturer",
  },
  {
    icon: Star,
    value: "99.9%",
    label: "System Uptime",
    description: "Guaranteed reliability and availability",
  },
];

const achievements = [
  {
    icon: Award,
    title: "Industry Recognition",
    stats: [
      "Best EdTech Platform 2024",
      "Innovation Award Winner",
      "Top 10 Education Tools",
    ],
  },
  {
    icon: Globe,
    title: "Global Reach",
    stats: [
      "Available in 50+ countries",
      "Support for 20+ languages",
      "24/7 customer support",
    ],
  },
  {
    icon: TrendingUp,
    title: "Growth Impact",
    stats: [
      "300% YoY growth",
      "95% customer retention",
      "4.9/5 average rating",
    ],
  },
  {
    icon: Target,
    title: "Customer Success",
    stats: [
      "10,000+ educators served",
      "2M+ grades processed",
      "500K+ attendance records",
    ],
  },
];

const impactMetrics = [
  {
    metric: "Time Efficiency",
    value: "85%",
    description: "Reduction in administrative tasks",
    icon: Clock,
  },
  {
    metric: "Student Engagement",
    value: "92%",
    description: "Increase in student engagement",
    icon: Users,
  },
  {
    metric: "Data Accuracy",
    value: "99.8%",
    description: "Error-free record keeping",
    icon: CheckCircle2,
  },
  {
    metric: "Cost Savings",
    value: "$15K",
    description: "Average annual savings per institution",
    icon: TrendingUp,
  },
];

const testimonialHighlights = [
  {
    quote: "This platform has transformed how we manage our classes.",
    author: "Dr. Sarah Johnson",
    role: "Department Head, Harvard University",
  },
  {
    quote: "The time savings alone make this worth every penny.",
    author: "Prof. Michael Chen",
    role: "Lecturer, Stanford University",
  },
  {
    quote: "Our entire department adopted it in just two weeks.",
    author: "Dr. Emily Rodriguez",
    role: "Academic Coordinator, MIT",
  },
];

export default function ImpactPage() {
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
              Our Impact
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              Transforming Education
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                One Classroom at a Time
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Join thousands of educators who are saving time, improving outcomes, and making a real impact on student success.
            </p>
          </motion.div>

          {/* Primary Stats Grid */}
          <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {primaryStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>

                  {/* Value */}
                  <div className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="mb-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {stat.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Achievements */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900 dark:text-white">
              Achievements & Recognition
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.title}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                      {achievement.title}
                    </h3>
                    <ul className="space-y-2">
                      {achievement.stats.map((stat) => (
                        <li
                          key={stat}
                          className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          <span>{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900 dark:text-white">
              Measurable Impact
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impactMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <motion.div
                    key={metric.metric}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                        <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div className="mb-2 text-5xl font-bold text-neutral-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="mb-2 text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                      {metric.metric}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {metric.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Testimonial Highlights */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-20"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900 dark:text-white">
              What Educators Are Saying
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonialHighlights.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-sm italic text-neutral-700 dark:text-neutral-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {testimonial.role}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-12 text-center backdrop-blur-sm"
          >
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
                Join Our Growing Community
              </h2>
              <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
                Be part of the education revolution. Start your free trial today.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/testimonials"
                  className="flex h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Read More Reviews
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

