"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Plus,
  Users,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Share2,
  MessageSquare,
  Star,
  Folder,
  FileText,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock courses data with collaboration features
const coursesData = [
  {
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
    collaborators: ["Dr. Smith", "TA: John"],
    unreadMessages: 5,
    recentActivity: "New assignment posted 2 hours ago",
  },
  {
    id: 2,
    code: "CS 201",
    name: "Data Structures & Algorithms",
    semester: "Spring 2025",
    students: 38,
    schedule: "Tue/Thu 2:00 PM - 3:30 PM",
    room: "Engineering 305",
    progress: 45,
    nextClass: "Tuesday, 2:00 PM",
    assignments: 10,
    completedAssignments: 4,
    avgGrade: 82,
    color: "from-purple-500 to-pink-500",
    collaborators: ["Dr. Johnson", "TA: Sarah"],
    unreadMessages: 12,
    recentActivity: "3 new submissions pending review",
  },
  {
    id: 3,
    code: "CS 301",
    name: "Database Management Systems",
    semester: "Spring 2025",
    students: 32,
    schedule: "Wed/Fri 1:00 PM - 2:30 PM",
    room: "Engineering 410",
    progress: 72,
    nextClass: "Wednesday, 1:00 PM",
    assignments: 8,
    completedAssignments: 6,
    avgGrade: 85,
    color: "from-green-500 to-emerald-500",
    collaborators: ["Dr. Lee"],
    unreadMessages: 3,
    recentActivity: "Quiz results published",
  },
  {
    id: 4,
    code: "CS 401",
    name: "Machine Learning",
    semester: "Spring 2025",
    students: 28,
    schedule: "Mon/Thu 3:00 PM - 4:30 PM",
    room: "Engineering 505",
    progress: 35,
    nextClass: "Monday, 3:00 PM",
    assignments: 15,
    completedAssignments: 5,
    avgGrade: 90,
    color: "from-orange-500 to-red-500",
    collaborators: ["Dr. Chen", "Dr. Park", "TA: Mike"],
    unreadMessages: 8,
    recentActivity: "Project teams assigned",
  },
];

export default function CoursesPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = coursesData.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              My Courses 📚
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Manage your courses and collaborate with your team
            </p>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
              />
            </div>

            {/* Create Course Button */}
            <Link
              href="/dashboard/courses/create"
              className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-4">
            {[
              { label: "Total Courses", value: "4", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
              { label: "Total Students", value: "143", icon: Users, color: "from-purple-500 to-pink-500" },
              { label: "Active Assignments", value: "20", icon: FileText, color: "from-green-500 to-emerald-500" },
              { label: "Avg. Completion", value: "55%", icon: CheckCircle, color: "from-orange-500 to-red-500" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`} />
                  <div className="relative">
                    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                    <div className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
              >
                {/* Gradient Accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-5 transition-opacity group-hover:opacity-10`} />

                {/* Header */}
                <div className="relative mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-lg bg-gradient-to-r ${course.color} px-3 py-1 text-xs font-bold text-white`}>
                        {course.code}
                      </span>
                      {course.unreadMessages > 0 && (
                        <span className="flex items-center gap-1 rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                          <MessageSquare className="h-3 w-3" />
                          {course.unreadMessages}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-neutral-900 dark:text-white">
                      {course.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {course.semester}
                    </p>
                  </div>
                  <button className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} transition hover:scale-110`}>
                    <Star className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Course Progress
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/20 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${course.color}`}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="relative mb-4 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5">
                  <div className="text-center">
                    <Users className="mx-auto mb-1 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">{course.students}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Students</div>
                  </div>
                  <div className="text-center">
                    <FileText className="mx-auto mb-1 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">
                      {course.completedAssignments}/{course.assignments}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Assignments</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="mx-auto mb-1 h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    <div className="text-lg font-bold text-neutral-900 dark:text-white">{course.avgGrade}%</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Avg. Grade</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="relative mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Calendar className="h-4 w-4" />
                    {course.schedule}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Clock className="h-4 w-4" />
                    Next class: <span className="font-semibold text-neutral-900 dark:text-white">{course.nextClass}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Folder className="h-4 w-4" />
                    Room: {course.room}
                  </div>
                </div>

                {/* Collaborators */}
                <div className="relative mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 dark:bg-white/5">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    <Share2 className="h-3.5 w-3.5" />
                    Collaborators
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.collaborators.map((collab, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {collab}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="relative mb-4 rounded-xl bg-blue-500/10 px-3 py-2 text-xs text-blue-600 dark:text-blue-400">
                  💡 {course.recentActivity}
                </div>

                {/* Actions */}
                <div className="relative grid grid-cols-3 gap-2">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Open clicked for course:', course.id);
                      router.push(`/dashboard/courses/${course.id}`);
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-white/10 dark:text-neutral-300"
                  >
                    <BookOpen className="h-4 w-4" />
                    Open
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Meet clicked for course:', course.id);
                      router.push(`/dashboard/courses/${course.id}/meet`);
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-white/10 dark:text-neutral-300"
                  >
                    <Video className="h-4 w-4" />
                    Meet
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Chat clicked for course:', course.id);
                      router.push(`/dashboard/courses/${course.id}/chat`);
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-white/10 dark:text-neutral-300"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                No courses found
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Try a different search query
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

