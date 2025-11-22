"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Link as LinkIcon,
  Users,
  RefreshCw,
  Mail,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock lecturer data - In real app, this would come from auth context
const currentLecturer = {
  id: "LEC-001",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@university.edu",
  inviteToken: "inv_lec001_abc123xyz", // Unique token for this lecturer
};

// Mock pending registrations
const pendingRegistrations = [
  {
    id: 1,
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@student.edu",
    phone: "+1 (555) 123-4567",
    major: "Computer Science",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Lee",
    email: "david.lee@student.edu",
    phone: "+1 (555) 234-5678",
    major: "Data Science",
    submittedAt: "5 hours ago",
    status: "pending",
  },
  {
    id: 3,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@student.edu",
    phone: "+1 (555) 345-6789",
    major: "Information Systems",
    submittedAt: "1 day ago",
    status: "approved",
  },
];

export default function StudentInvitePage() {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  useEffect(() => {
    // Generate the full invite link
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    setInviteLink(`${baseUrl}/register/${currentLecturer.inviteToken}`);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const regenerateLink = () => {
    // In real app, this would call API to generate new token
    const newToken = `inv_lec001_${Math.random().toString(36).substring(2, 15)}`;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    setInviteLink(`${baseUrl}/register/${newToken}`);
  };

  const handleApprove = (id: number) => {
    console.log("Approve student:", id);
    // API call to approve
  };

  const handleReject = (id: number) => {
    console.log("Reject student:", id);
    // API call to reject
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />
      
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

      <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/dashboard/students"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Student Invitation Link 🔗
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Share your unique link with students to let them register themselves
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Invitation Link */}
            <div className="space-y-6 lg:col-span-2">
              {/* Your Unique Link */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                    <LinkIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Your Invitation Link
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This link is unique to you
                    </p>
                  </div>
                </div>

                {/* Link Display */}
                <div className="mb-4 rounded-2xl border border-white/20 bg-white/5 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Share this link with students
                  </div>
                  <div className="break-all font-mono text-sm text-neutral-900 dark:text-white">
                    {inviteLink}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={regenerateLink}
                    className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </button>
                  <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                  <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>

                {/* Info */}
                <div className="mt-6 rounded-xl bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400">
                  <div className="mb-1 font-semibold">How it works:</div>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• Students click your unique link</li>
                    <li>• They fill out their registration details</li>
                    <li>• You receive their submissions for approval</li>
                    <li>• Students cannot submit twice with the same email</li>
                  </ul>
                </div>
              </motion.div>

              {/* Pending Registrations */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Pending Registrations
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Review and approve student submissions
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-600 dark:text-orange-400">
                    {pendingRegistrations.filter((r) => r.status === "pending").length}
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingRegistrations.map((student, index) => (
                    <motion.div
                      key={student.id}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className={`rounded-2xl border p-4 transition ${
                        student.status === "pending"
                          ? "border-orange-500/30 bg-orange-500/10"
                          : "border-white/10 bg-white/5 opacity-50"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {student.email}
                            </div>
                          </div>
                        </div>
                        {student.status === "pending" ? (
                          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                            Pending
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                            Approved
                          </span>
                        )}
                      </div>

                      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">Phone:</span>{" "}
                          <span className="text-neutral-900 dark:text-white">{student.phone}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600 dark:text-neutral-400">Major:</span>{" "}
                          <span className="text-neutral-900 dark:text-white">{student.major}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-neutral-600 dark:text-neutral-400">Submitted:</span>{" "}
                          <span className="text-neutral-900 dark:text-white">{student.submittedAt}</span>
                        </div>
                      </div>

                      {student.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(student.id)}
                            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 text-xs font-semibold text-white transition hover:bg-green-700"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(student.id)}
                            className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-xs font-semibold text-white transition hover:bg-red-700"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                          <Link
                            href={`/dashboard/students/pending/${student.id}`}
                            className="flex h-9 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              {/* Statistics */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Total Submissions
                    </h3>
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {pendingRegistrations.length}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Via your invitation link
                  </p>
                </div>

                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Pending Review
                    </h3>
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {pendingRegistrations.filter((r) => r.status === "pending").length}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Awaiting your approval
                  </p>
                </div>

                <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      Approved
                    </h3>
                  </div>
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                    {pendingRegistrations.filter((r) => r.status === "approved").length}
                  </div>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Students enrolled
                  </p>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">
                  💡 Pro Tips
                </h3>
                <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Share the link via email, LMS, or social media</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Students can only submit once per email address</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Regenerate link if you suspect it's compromised</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600 dark:text-purple-400">•</span>
                    <span>Review submissions regularly to avoid delays</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

