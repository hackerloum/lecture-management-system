"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";
import { ForgotPasswordForm } from "@/components/login/ForgotPasswordForm";

export default function ForgotPasswordPage() {
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

      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 sm:px-6 lg:py-24">
        <div className="w-full max-w-md">
          {/* Welcome Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8 text-center"
          >
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-white/10 dark:text-purple-400"
              initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-[10px] font-bold text-white">
                LMS
              </span>
              Lecturer System
            </motion.div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Reset Password
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Enter your email to receive a password reset link
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30, scale: 0.95 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {/* Subtle glow effect behind card */}
            <div
              className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-purple-400/30 via-blue-400/30 to-cyan-400/30 blur-2xl opacity-40 dark:opacity-30"
              aria-hidden
            />
            
            <ForgotPasswordForm />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


