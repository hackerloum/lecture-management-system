"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Building2, User } from "lucide-react";

import { SignupForm } from "@/components/signup/SignupForm";
import { OrganizationSignupForm } from "@/components/signup/OrganizationSignupForm";

export default function SignupPage() {
  const prefersReducedMotion = useReducedMotion();
  const [accountType, setAccountType] = useState<"individual" | "organization">("individual");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
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

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          {/* Logo & Back Link */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-lg font-bold text-white shadow-lg shadow-purple-500/30">
                LMS
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white">
                Lecturer System
              </span>
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Already have an account? <span className="font-semibold text-purple-600 dark:text-purple-400">Sign in</span>
            </Link>
          </div>

          {/* Account Type Selector */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex justify-center">
              <div className="inline-flex gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <button
                  onClick={() => setAccountType("individual")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                    accountType === "individual"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-neutral-600 hover:bg-white/10 dark:text-neutral-400"
                  }`}
                >
                  <User className="h-5 w-5" />
                  Individual Lecturer
                </button>
                <button
                  onClick={() => setAccountType("organization")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                    accountType === "organization"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-neutral-600 hover:bg-white/10 dark:text-neutral-400"
                  }`}
                >
                  <Building2 className="h-5 w-5" />
                  University / Organization
                </button>
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h1 className="mb-3 text-4xl font-bold text-neutral-900 dark:text-white">
              {accountType === "individual" ? "Create Your Account" : "Register Your Organization"}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {accountType === "individual"
                ? "Join thousands of educators transforming their teaching experience"
                : "Empower your entire institution with our comprehensive LMS"}
            </p>
          </motion.div>

          {/* Forms */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {accountType === "individual" ? <SignupForm /> : <OrganizationSignupForm />}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"
          >
            By signing up, you agree to our{" "}
            <Link href="/terms" className="font-semibold text-purple-600 hover:underline dark:text-purple-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-purple-600 hover:underline dark:text-purple-400">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
