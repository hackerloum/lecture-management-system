"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Zap,
  Trophy,
  Star,
  BarChart3,
  FileText,
  Edit,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock student data - In a real app, fetch based on ID
const studentsData: Record<string, any> = {
  "1": {
    id: 1,
    name: "Emily Chen",
    email: "emily.chen@university.edu",
    phone: "+1 (555) 123-4567",
    avatar: "EC",
    major: "Computer Science",
    year: "Junior",
    studentId: "CS-2023-001",
    enrollmentDate: "September 2022",
    gpa: 3.9,
    attendance: 98,
    submissions: "12/12",
    trend: "up",
    status: "active",
    badges: ["🏆 Top Performer", "🔥 7-Day Streak", "⭐ Perfect Attendance"],
    points: 2450,
    level: 15,
    lastActive: "2 hours ago",
    address: "123 Campus Drive, Building A, Apt 4B",
    dateOfBirth: "March 15, 2003",
    emergencyContact: {
      name: "Linda Chen",
      relationship: "Mother",
      phone: "+1 (555) 987-6543",
    },
    courses: [
      { code: "CS 301", name: "Algorithms", grade: "A", attendance: 100 },
      { code: "CS 302", name: "Database Systems", grade: "A-", attendance: 98 },
      { code: "CS 303", name: "Software Engineering", grade: "A", attendance: 96 },
      { code: "MATH 201", name: "Discrete Mathematics", grade: "B+", attendance: 100 },
    ],
    recentActivity: [
      { date: "2 hours ago", action: "Submitted Assignment 5 for CS 301", type: "success" },
      { date: "1 day ago", action: "Achieved Level 15", type: "achievement" },
      { date: "2 days ago", action: "Earned badge: 7-Day Streak", type: "achievement" },
      { date: "3 days ago", action: "Scored 98% on CS 302 Quiz", type: "success" },
    ],
    achievements: [
      { title: "Top Performer", description: "Maintained GPA above 3.8 for 2 consecutive semesters", icon: "🏆" },
      { title: "Perfect Attendance", description: "100% attendance in all courses this semester", icon: "⭐" },
      { title: "7-Day Streak", description: "Logged in and completed tasks for 7 days straight", icon: "🔥" },
      { title: "Fast Learner", description: "Completed 5 courses ahead of schedule", icon: "⚡" },
    ],
  },
  "2": {
    id: 2,
    name: "David Lee",
    email: "david.lee@university.edu",
    phone: "+1 (555) 234-5678",
    avatar: "DL",
    major: "Computer Science",
    year: "Senior",
    studentId: "CS-2021-045",
    enrollmentDate: "September 2021",
    gpa: 3.7,
    attendance: 92,
    submissions: "11/12",
    trend: "up",
    status: "active",
    badges: ["💡 Problem Solver", "📚 Bookworm"],
    points: 1980,
    level: 12,
    lastActive: "5 hours ago",
    address: "456 University Ave, Dorm C, Room 201",
    dateOfBirth: "July 22, 2001",
    emergencyContact: {
      name: "Michael Lee",
      relationship: "Father",
      phone: "+1 (555) 876-5432",
    },
    courses: [
      { code: "CS 401", name: "Machine Learning", grade: "A-", attendance: 95 },
      { code: "CS 402", name: "Computer Networks", grade: "B+", attendance: 90 },
      { code: "CS 403", name: "Capstone Project", grade: "A", attendance: 88 },
    ],
    recentActivity: [
      { date: "5 hours ago", action: "Submitted Project Milestone 3", type: "success" },
      { date: "1 day ago", action: "Completed CS 401 Quiz", type: "success" },
      { date: "2 days ago", action: "Joined study group for Networks", type: "info" },
    ],
    achievements: [
      { title: "Problem Solver", description: "Solved 100+ coding challenges", icon: "💡" },
      { title: "Bookworm", description: "Completed all required readings on time", icon: "📚" },
    ],
  },
  // Add more students as needed
};

export default function StudentProfilePage() {
  const params = useParams();
  const prefersReducedMotion = useReducedMotion();
  const studentId = params.id as string;

  // Get student data or fallback
  const student = studentsData[studentId] || {
    id: parseInt(studentId),
    name: "Student Not Found",
    email: "N/A",
    phone: "N/A",
    avatar: "?",
    major: "N/A",
    year: "N/A",
    studentId: "N/A",
    enrollmentDate: "N/A",
    gpa: 0,
    attendance: 0,
    submissions: "0/0",
    trend: "up",
    status: "active",
    badges: [],
    points: 0,
    level: 1,
    lastActive: "Never",
    address: "N/A",
    dateOfBirth: "N/A",
    emergencyContact: { name: "N/A", relationship: "N/A", phone: "N/A" },
    courses: [],
    recentActivity: [],
    achievements: [],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "from-green-500 to-emerald-500";
      case "warning":
        return "from-orange-500 to-yellow-500";
      case "critical":
        return "from-red-500 to-pink-500";
      default:
        return "from-neutral-500 to-neutral-600";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600 dark:text-green-400";
    if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400";
    if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "achievement":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
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
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link
              href="/dashboard/students"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </motion.div>

          {/* Header Card */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="relative h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
            </div>
            <div className="relative px-8 pb-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                {/* Avatar */}
                <div className="-mt-16 flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white bg-gradient-to-br from-purple-500 to-blue-500 text-5xl font-bold text-white shadow-xl dark:border-neutral-900">
                  {student.avatar}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {student.name}
                    </h1>
                    <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${getStatusColor(student.status)} px-3 py-1 text-xs font-semibold text-white`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </div>
                  </div>
                  <p className="mb-4 text-lg text-neutral-600 dark:text-neutral-400">
                    {student.major} • {student.year} • ID: {student.studentId}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Mail className="h-4 w-4" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Phone className="h-4 w-4" />
                      {student.phone}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                      <Calendar className="h-4 w-4" />
                      Enrolled: {student.enrollmentDate}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </button>
                  <button className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-8 lg:col-span-2">
              {/* Performance Stats */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  Performance Overview
                </h2>
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    { label: "GPA", value: student.gpa.toFixed(1), icon: Award, color: "from-purple-500 to-pink-500" },
                    { label: "Attendance", value: `${student.attendance}%`, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
                    { label: "Level", value: student.level.toString(), icon: Zap, color: "from-yellow-500 to-orange-500" },
                    { label: "XP Points", value: student.points.toString(), icon: Target, color: "from-blue-500 to-cyan-500" },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                        <div className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Current Courses */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  Current Courses
                </h2>
                <div className="space-y-3">
                  {student.courses.map((course: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white">
                          {course.code.split(" ")[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {course.code}: {course.name}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            Attendance: {course.attendance}%
                          </div>
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {student.recentActivity.map((activity: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5"
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm text-neutral-900 dark:text-white">{activity.action}</p>
                        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Personal Details */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  Personal Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Date of Birth</div>
                    <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {student.dateOfBirth}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Address</div>
                    <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {student.address}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Last Active</div>
                    <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {student.lastActive}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  Emergency Contact
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Name</div>
                    <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {student.emergencyContact.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Relationship</div>
                    <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {student.emergencyContact.relationship}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Phone</div>
                    <div className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                      {student.emergencyContact.phone}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  Achievements
                </h2>
                <div className="space-y-3">
                  {student.achievements.map((achievement: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5"
                    >
                      <div className="mb-2 text-2xl">{achievement.icon}</div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {achievement.title}
                      </div>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

