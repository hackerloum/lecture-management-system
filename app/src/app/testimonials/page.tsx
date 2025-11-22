"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star, Building2, Users, Award, Zap } from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";

const testimonials = [
  {
    quote:
      "This platform has completely transformed how we manage our department. The time savings alone have been incredible—I'm saving at least 5 hours per week. The interface is intuitive, and our entire team was up and running in days.",
    name: "Dr. Sarah Johnson",
    title: "Department Head",
    institution: "Harvard University",
    avatar: "SJ",
    rating: 5,
  },
  {
    quote:
      "Finally, a system that was actually built by educators for educators. Every feature we asked for is here, and the support team responds within hours. This is hands-down the best investment we've made in edtech.",
    name: "Prof. Michael Chen",
    title: "Senior Lecturer",
    institution: "Stanford University",
    avatar: "MC",
    rating: 5,
  },
  {
    quote:
      "Our entire department of 25 faculty members transitioned in just two weeks. The onboarding was seamless, students adopted it immediately, and we haven't looked back. The analytics features are phenomenal.",
    name: "Dr. Emily Rodriguez",
    title: "Academic Coordinator",
    institution: "MIT",
    avatar: "ER",
    rating: 5,
  },
  {
    quote:
      "The grading automation feature has been a game-changer. What used to take hours now takes minutes. Plus, the mobile app means I can update grades and attendance from anywhere.",
    name: "Prof. James Williams",
    title: "Associate Professor",
    institution: "University of Oxford",
    avatar: "JW",
    rating: 5,
  },
  {
    quote:
      "We evaluated five different platforms before choosing this one. The security features, compliance certifications, and dedicated support made it an easy decision for our institution.",
    name: "Dr. Lisa Zhang",
    title: "Director of IT",
    institution: "UCLA",
    avatar: "LZ",
    rating: 5,
  },
  {
    quote:
      "The real-time analytics help me identify at-risk students early. I can intervene before small issues become big problems. This platform has genuinely improved student outcomes in my courses.",
    name: "Dr. Ahmed Hassan",
    title: "Professor of Engineering",
    institution: "University of Cambridge",
    avatar: "AH",
    rating: 5,
  },
  {
    quote:
      "As someone who's not very tech-savvy, I was nervous about switching systems. But the training was excellent, and the interface is so straightforward that I was comfortable using it within a day.",
    name: "Prof. Maria Garcia",
    title: "Lecturer",
    institution: "University of Melbourne",
    avatar: "MG",
    rating: 5,
  },
  {
    quote:
      "The automated compliance reports have saved us countless hours. Everything we need for audits is right there, properly formatted and ready to submit. It's made my job so much easier.",
    name: "Dr. Robert Taylor",
    title: "Registrar",
    institution: "Yale University",
    avatar: "RT",
    rating: 5,
  },
  {
    quote:
      "I love that I can customize the grading rubrics to match my teaching style. The platform is flexible enough to accommodate different approaches while still maintaining consistency across the department.",
    name: "Dr. Priya Patel",
    title: "Assistant Professor",
    institution: "University of Toronto",
    avatar: "PP",
    rating: 5,
  },
];

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Educators",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Institutions",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
  },
  {
    icon: Award,
    value: "99%",
    label: "Would Recommend",
  },
];

export default function TestimonialsPage() {
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
              Testimonials
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              Trusted by Educators
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Around the World
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              See what educators at leading institutions are saying about our platform.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                      <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Testimonials Grid */}
          <div className="mb-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-purple-600 dark:text-purple-400 opacity-50" />
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-lg font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {testimonial.title}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-12 text-center backdrop-blur-sm"
          >
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
                Join Thousands of Satisfied Educators
              </h2>
              <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
                Start your free 14-day trial and see why educators love our platform.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="flex h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Contact Us
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

