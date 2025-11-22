"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
  Brain,
  Sparkles,
  Bell,
  ArrowRight,
  Clock,
  Target,
  Zap,
  Star,
  Activity,
  FileText,
  MessageSquare,
  Video,
  BarChart3,
  Plus,
  ArrowUpRight,
  MapPin,
  TrendingDown as Minus,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock data - Replace with real API calls
const dashboardStats = [
  {
    icon: Users,
    label: "Total Students",
    value: "143",
    change: "+12",
    changePercent: "+9.2%",
    trend: "up" as const,
    color: "from-blue-500 to-cyan-500",
    description: "Across all courses",
  },
  {
    icon: BookOpen,
    label: "Active Courses",
    value: "4",
    change: "+1",
    changePercent: "+33%",
    trend: "up" as const,
    color: "from-purple-500 to-pink-500",
    description: "This semester",
  },
  {
    icon: Target,
    label: "Avg. Performance",
    value: "86.5%",
    change: "+3.2%",
    changePercent: "+3.8%",
    trend: "up" as const,
    color: "from-green-500 to-emerald-500",
    description: "Class average",
  },
  {
    icon: Calendar,
    label: "Attendance Rate",
    value: "91.2%",
    change: "+2.5%",
    changePercent: "+2.8%",
    trend: "up" as const,
    color: "from-orange-500 to-yellow-500",
    description: "This week",
  },
];

const todaySchedule = [
  {
    id: 1,
    course: "CS 101",
    title: "Introduction to Computer Science",
    time: "10:00 AM - 11:30 AM",
    room: "Engineering 201",
    students: 45,
    status: "upcoming",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    course: "CS 201",
    title: "Data Structures & Algorithms",
    time: "2:00 PM - 3:30 PM",
    room: "Engineering 305",
    students: 38,
    status: "upcoming",
    color: "from-purple-500 to-pink-500",
  },
];

const upcomingDeadlines = [
  {
    id: 1,
    title: "CS 301 - Assignment 5",
    dueDate: "Tomorrow, 11:59 PM",
    submissions: "28/32",
    percentage: 87.5,
    priority: "high",
  },
  {
    id: 2,
    title: "CS 101 - Quiz 3 Grading",
    dueDate: "In 3 days",
    submissions: "45/45",
    percentage: 100,
    priority: "medium",
  },
  {
    id: 3,
    title: "CS 201 - Project Milestone",
    dueDate: "In 5 days",
    submissions: "15/38",
    percentage: 39.5,
    priority: "medium",
  },
];

const recentSubmissions = [
  {
    student: "Emily Chen",
    course: "CS 301",
    assignment: "Assignment 5",
    grade: 98,
    time: "10 minutes ago",
    avatar: "EC",
  },
  {
    student: "David Lee",
    course: "CS 201",
    assignment: "Quiz 4",
    grade: 92,
    time: "25 minutes ago",
    avatar: "DL",
  },
  {
    student: "Sarah Johnson",
    course: "CS 101",
    assignment: "Lab 3",
    grade: 88,
    time: "1 hour ago",
    avatar: "SJ",
  },
  {
    student: "Mike Brown",
    course: "CS 301",
    assignment: "Assignment 4",
    grade: 75,
    time: "2 hours ago",
    avatar: "MB",
  },
];

const coursesOverview = [
  {
    code: "CS 101",
    name: "Intro to Computer Science",
    students: 45,
    avgGrade: 88,
    attendance: 98,
    pending: 3,
    color: "from-blue-500 to-cyan-500",
    trend: "up",
  },
  {
    code: "CS 201",
    name: "Data Structures",
    students: 38,
    avgGrade: 82,
    attendance: 92,
    pending: 8,
    color: "from-purple-500 to-pink-500",
    trend: "up",
  },
  {
    code: "CS 301",
    name: "Database Systems",
    students: 32,
    avgGrade: 85,
    attendance: 95,
    pending: 4,
    color: "from-green-500 to-emerald-500",
    trend: "up",
  },
  {
    code: "CS 401",
    name: "Machine Learning",
    students: 28,
    avgGrade: 90,
    attendance: 89,
    pending: 5,
    color: "from-orange-500 to-red-500",
    trend: "down",
  },
];

const aiInsights = [
  {
    type: "warning",
    title: "5 Students Need Attention",
    description: "Performance dropped significantly in the past 2 weeks",
    students: ["Mike Brown", "John Smith", "Alex Turner"],
    action: "View Details",
    confidence: 92,
    icon: AlertCircle,
    color: "from-red-500 to-pink-500",
  },
  {
    type: "success",
    title: "Peak Engagement Detected",
    description: "Tuesday 2-4 PM shows highest student participation",
    action: "Optimize Schedule",
    confidence: 88,
    icon: Activity,
    color: "from-green-500 to-emerald-500",
  },
];

const quickActions = [
  { label: "Start Attendance", href: "/dashboard/attendance", icon: Calendar, count: 2, color: "from-blue-500 to-cyan-500" },
  { label: "Grade Assignments", href: "/dashboard/grades", icon: FileText, count: 12, color: "from-purple-500 to-pink-500" },
  { label: "Create Course", href: "/dashboard/courses/create", icon: Plus, count: null, color: "from-green-500 to-emerald-500" },
  { label: "View Messages", href: "/dashboard/messages", icon: MessageSquare, count: 8, color: "from-orange-500 to-yellow-500" },
];

export default function DashboardPage() {
  const prefersReducedMotion = useReducedMotion();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600 dark:text-green-400";
    if (grade >= 80) return "text-blue-600 dark:text-blue-400";
    if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid Pattern */}
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
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                  {getGreeting()}, Dr. Sarah! 👋
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Link
                  href="/dashboard/ai-insights"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Brain className="h-4 w-4" />
                  AI Insights
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
              
              return (
                <motion.div
                  key={stat.label}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 transition-opacity group-hover:opacity-10`}
                  />
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        <TrendIcon className="h-4 w-4" />
                        {stat.changePercent}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.label}
                    </div>
                    <div className="mt-1 text-3xl font-bold text-neutral-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                      {stat.description}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Primary Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Today's Schedule */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    📅 Today's Schedule
                  </h2>
                  <Link
                    href="/dashboard/courses"
                    className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                {todaySchedule.length > 0 ? (
                  <div className="space-y-4">
                    {todaySchedule.map((class_item, index) => (
                      <motion.div
                        key={class_item.id}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="group overflow-hidden rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className={`h-1 bg-gradient-to-r ${class_item.color}`} />
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <div className={`rounded-lg bg-gradient-to-br ${class_item.color} px-3 py-1 text-sm font-bold text-white`}>
                                  {class_item.course}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                                  <Users className="h-4 w-4" />
                                  {class_item.students} students
                                </div>
                              </div>
                              <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
                                {class_item.title}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {class_item.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {class_item.room}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/dashboard/courses/${class_item.id}`}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                              >
                                <BookOpen className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                              </Link>
                              <Link
                                href={`/dashboard/courses/${class_item.id}/meet`}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                              >
                                <Video className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
                    <p className="text-neutral-600 dark:text-neutral-400">
                      No classes scheduled for today
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Courses Overview */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    📚 Courses Overview
                  </h2>
                  <Link
                    href="/dashboard/courses"
                    className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {coursesOverview.map((course, index) => (
                    <motion.div
                      key={course.code}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="group overflow-hidden rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className={`h-1 bg-gradient-to-r ${course.color}`} />
                      <div className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className={`rounded-lg bg-gradient-to-br ${course.color} px-3 py-1 text-sm font-bold text-white`}>
                            {course.code}
                          </div>
                          {course.pending > 0 && (
                            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                              {course.pending} pending
                            </span>
                          )}
                        </div>
                        <h3 className="mb-3 font-bold text-neutral-900 dark:text-white">
                          {course.name}
                        </h3>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Students</div>
                            <div className="mt-1 font-bold text-neutral-900 dark:text-white">{course.students}</div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Avg Grade</div>
                            <div className="mt-1 font-bold text-neutral-900 dark:text-white">{course.avgGrade}%</div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">Attendance</div>
                            <div className="mt-1 font-bold text-neutral-900 dark:text-white">{course.attendance}%</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-8 backdrop-blur-sm"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        AI Insights
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Powered by machine learning
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/ai-insights"
                    className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {aiInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                        className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className={`h-1 bg-gradient-to-r ${insight.color}`} />
                        <div className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${insight.color}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="mb-1 font-bold text-neutral-900 dark:text-white">
                                  {insight.title}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {insight.description}
                                </p>
                                {insight.students && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {insight.students.map((student, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                      >
                                        {student}
                                      </span>
                                    ))}
                                    {insight.students.length > 3 && (
                                      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        +2 more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="text-xs text-neutral-500">Confidence</div>
                              <div className="text-xl font-bold text-neutral-900 dark:text-white">
                                {insight.confidence}%
                              </div>
                            </div>
                          </div>
                          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-600/50 bg-purple-600/10 px-4 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-600/20 dark:text-purple-400">
                            {insight.action}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Activity */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        href={action.href}
                        className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {action.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {action.count && (
                            <span className="rounded-full bg-purple-600 px-2.5 py-0.5 text-xs font-bold text-white">
                              {action.count}
                            </span>
                          )}
                          <ArrowRight className="h-4 w-4 text-neutral-600 transition group-hover:translate-x-1 dark:text-neutral-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* Upcoming Deadlines */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                  ⏰ Upcoming Deadlines
                </h2>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div
                      key={deadline.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 dark:bg-white/5"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {deadline.title}
                        </h3>
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                          deadline.priority === "high"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {deadline.priority}
                        </span>
                      </div>
                      <p className="mb-2 text-xs text-neutral-600 dark:text-neutral-400">
                        Due: {deadline.dueDate}
                      </p>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {deadline.submissions} submitted
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {deadline.percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/20 dark:bg-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${deadline.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Submissions */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                  📝 Recent Submissions
                </h2>
                <div className="space-y-3">
                  {recentSubmissions.map((submission, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 dark:bg-white/5"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                        {submission.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                            {submission.student}
                          </h3>
                          <span className={`shrink-0 text-sm font-bold ${getGradeColor(submission.grade)}`}>
                            {submission.grade}%
                          </span>
                        </div>
                        <p className="truncate text-xs text-neutral-600 dark:text-neutral-400">
                          {submission.course} • {submission.assignment}
                        </p>
                        <p className="text-xs text-neutral-500">{submission.time}</p>
                      </div>
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
