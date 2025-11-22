"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Video,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Download,
  Share2,
  Plus,
  Edit,
  Star,
  Award,
  BookOpen,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock course data
const coursesData: Record<string, any> = {
  "1": {
    id: 1,
    code: "CS 101",
    name: "Introduction to Computer Science",
    semester: "Spring 2025",
    students: 45,
    schedule: "Mon/Wed 10:00 AM - 11:30 AM",
    room: "Engineering 201",
    progress: 68,
    nextClass: "Monday, 10:00 AM",
    assignments: 12,
    completedAssignments: 8,
    avgGrade: 88,
    color: "from-blue-500 to-cyan-500",
    description: "An introductory course covering fundamental concepts of computer science including programming basics, algorithms, and problem-solving techniques.",
    syllabus: "Week 1-4: Programming Basics, Week 5-8: Data Structures, Week 9-12: Algorithms, Week 13-16: Projects",
    announcements: [
      { id: 1, title: "Midterm Exam Scheduled", date: "2 days ago", content: "The midterm exam is scheduled for next Wednesday." },
      { id: 2, title: "New Assignment Posted", date: "5 days ago", content: "Assignment 3 is now available in the Assignments section." },
    ],
    upcomingDeadlines: [
      { id: 1, title: "Assignment 3: Sorting Algorithms", date: "Nov 15, 2025", type: "assignment" },
      { id: 2, title: "Midterm Exam", date: "Nov 18, 2025", type: "exam" },
      { id: 3, title: "Project Proposal", date: "Nov 22, 2025", type: "project" },
    ],
    recentMaterials: [
      { id: 1, title: "Lecture 10: Binary Search Trees", type: "slides", date: "Yesterday" },
      { id: 2, title: "Week 5 Tutorial Video", type: "video", date: "3 days ago" },
      { id: 3, title: "Reading: Chapter 7", type: "document", date: "5 days ago" },
    ],
  },
  // Add other courses as needed
};

export default function CourseDetailsPage() {
  const prefersReducedMotion = useReducedMotion();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const course = coursesData[courseId] || coursesData["1"];

  const [activeTab, setActiveTab] = useState<"overview" | "materials" | "announcements" | "students">("overview");

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

      <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Back Button & Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/dashboard/courses"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-purple-600 dark:text-neutral-400 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
            
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <div className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${course.color} px-3 py-1 text-sm font-bold text-white`}>
                    {course.code}
                  </div>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{course.semester}</span>
                </div>
                <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                  {course.name}
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  {course.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push(`/dashboard/courses/${courseId}/meet`)}
                  className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Video className="h-5 w-5" />
                  Start Meeting
                </button>
                <button
                  onClick={() => router.push(`/dashboard/courses/${courseId}/chat`)}
                  className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  <MessageSquare className="h-5 w-5" />
                  Open Chat
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { label: "Students", value: course.students, icon: Users, color: "from-blue-500 to-cyan-500" },
              { label: "Avg Grade", value: `${course.avgGrade}%`, icon: Star, color: "from-green-500 to-emerald-500" },
              { label: "Progress", value: `${course.progress}%`, icon: TrendingUp, color: "from-purple-500 to-pink-500" },
              { label: "Assignments", value: `${course.completedAssignments}/${course.assignments}`, icon: CheckCircle, color: "from-orange-500 to-red-500" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`rounded-2xl border border-white/20 bg-gradient-to-br ${stat.color} p-6 text-white backdrop-blur-sm`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold opacity-90">{stat.label}</span>
                    <Icon className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Course Info Cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">{course.schedule}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Class Schedule</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">{course.room}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Location</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">{course.nextClass}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Next Class</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {course.upcomingDeadlines.map((deadline: any) => (
                  <div key={deadline.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <CheckCircle className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900 dark:text-white">{deadline.title}</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{deadline.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Recent Materials</h3>
              <div className="space-y-3">
                {course.recentMaterials.map((material: any) => (
                  <div key={material.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <FileText className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-900 dark:text-white">{material.title}</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{material.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { label: "Presentations", icon: BookOpen, href: "/dashboard/presentations", color: "from-blue-500 to-cyan-500" },
              { label: "Attendance", icon: Users, href: "/dashboard/attendance", color: "from-purple-500 to-pink-500" },
              { label: "Grades", icon: BarChart3, href: "/dashboard/grades", color: "from-green-500 to-emerald-500" },
              { label: "Analytics", icon: Award, href: "/dashboard/analytics", color: "from-orange-500 to-red-500" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`group rounded-2xl border border-white/20 bg-gradient-to-br ${action.color} p-6 text-white backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-xl`}
                >
                  <Icon className="mb-3 h-8 w-8" />
                  <div className="text-lg font-bold">{action.label}</div>
                  <div className="text-sm opacity-80">Manage {action.label.toLowerCase()}</div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

