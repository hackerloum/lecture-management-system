"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  Award,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import AnalyticsExportModal from "@/components/analytics/AnalyticsExportModal";

// Mock data for charts
const performanceData = [
  { month: "Jan", avgGrade: 78, attendance: 92, engagement: 85 },
  { month: "Feb", avgGrade: 82, attendance: 89, engagement: 88 },
  { month: "Mar", avgGrade: 85, attendance: 94, engagement: 90 },
  { month: "Apr", avgGrade: 88, attendance: 91, engagement: 92 },
  { month: "May", avgGrade: 87, attendance: 95, engagement: 94 },
];

const gradeDistribution = [
  { grade: "A (90-100)", students: 145, percentage: 35, color: "from-green-500 to-emerald-500" },
  { grade: "B (80-89)", students: 180, percentage: 43, color: "from-blue-500 to-cyan-500" },
  { grade: "C (70-79)", students: 65, percentage: 16, color: "from-yellow-500 to-orange-500" },
  { grade: "D (60-69)", students: 18, percentage: 4, color: "from-orange-500 to-red-500" },
  { grade: "F (<60)", students: 8, percentage: 2, color: "from-red-500 to-pink-500" },
];

const coursePerformance = [
  { course: "CS 101", students: 45, avgGrade: 88, attendance: 94, trend: "up" },
  { course: "CS 201", students: 38, avgGrade: 82, attendance: 89, trend: "up" },
  { course: "CS 301", students: 32, avgGrade: 85, attendance: 92, trend: "down" },
  { course: "CS 401", students: 28, avgGrade: 90, attendance: 96, trend: "up" },
];

const topPerformers = [
  { rank: 1, name: "Emily Chen", grade: 96, courses: 5, badge: "🥇" },
  { rank: 2, name: "David Lee", grade: 94, courses: 5, badge: "🥈" },
  { rank: 3, name: "Lisa Park", grade: 92, courses: 4, badge: "🥉" },
  { rank: 4, name: "Sarah Johnson", grade: 91, courses: 5, badge: "4️⃣" },
  { rank: 5, name: "Mike Brown", grade: 90, courses: 4, badge: "5️⃣" },
];

const insightCards = [
  {
    icon: TrendingUp,
    title: "Performance Trending Up",
    value: "+12.5%",
    description: "Average grades improved this semester",
    color: "from-green-500 to-emerald-500",
    trend: "positive",
  },
  {
    icon: Users,
    title: "High Engagement",
    value: "94%",
    description: "Students actively participating",
    color: "from-blue-500 to-cyan-500",
    trend: "positive",
  },
  {
    icon: Target,
    title: "At-Risk Students",
    value: "12",
    description: "Need immediate intervention",
    color: "from-orange-500 to-red-500",
    trend: "negative",
  },
  {
    icon: Award,
    title: "Course Completion",
    value: "98%",
    description: "On track for graduation",
    color: "from-purple-500 to-pink-500",
    trend: "positive",
  },
];

export default function AnalyticsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [exportModalOpen, setExportModalOpen] = useState(false);

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
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                Advanced Analytics 📊
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Deep insights into student performance and engagement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition hover:bg-white/20 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
                <option value="year">This Year</option>
              </select>
              <button 
                onClick={() => setExportModalOpen(true)}
                className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Insight Cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {insightCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5 transition-opacity group-hover:opacity-10`}
                  />
                  
                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {card.trend === "positive" ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="mb-1 text-3xl font-bold text-neutral-900 dark:text-white">
                      {card.value}
                    </div>
                    <div className="mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                      {card.title}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Charts */}
            <div className="space-y-8 lg:col-span-2">
              {/* Performance Trend Chart */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                      Performance Trends
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      5-month comparison of key metrics
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>

                {/* Simple Bar Chart Visualization */}
                <div className="space-y-6">
                  {performanceData.map((data, index) => (
                    <div key={data.month}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {data.month}
                        </span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-green-500">Grade: {data.avgGrade}%</span>
                          <span className="text-blue-500">Attend: {data.attendance}%</span>
                          <span className="text-purple-500">Engage: {data.engagement}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="h-8 overflow-hidden rounded-lg bg-white/20 dark:bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${data.avgGrade}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="h-8 overflow-hidden rounded-lg bg-white/20 dark:bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${data.attendance}%` }}
                              transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="h-8 overflow-hidden rounded-lg bg-white/20 dark:bg-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${data.engagement}%` }}
                              transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-6 border-t border-white/10 pt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">Average Grade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">Attendance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    <span className="text-neutral-600 dark:text-neutral-400">Engagement</span>
                  </div>
                </div>
              </motion.div>

              {/* Grade Distribution */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                      Grade Distribution
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      416 students across all courses
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="space-y-4">
                  {gradeDistribution.map((item, index) => (
                    <div key={item.grade} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                          {item.grade}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {item.students} students
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-10 overflow-hidden rounded-xl bg-white/20 dark:bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                          className={`flex h-full items-center justify-end bg-gradient-to-r ${item.color} px-4 text-sm font-bold text-white`}
                        >
                          {item.percentage}%
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Course Performance Table */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                    Course Performance
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Comparative analysis across courses
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-sm">
                        <th className="pb-3 font-semibold text-neutral-700 dark:text-neutral-300">Course</th>
                        <th className="pb-3 font-semibold text-neutral-700 dark:text-neutral-300">Students</th>
                        <th className="pb-3 font-semibold text-neutral-700 dark:text-neutral-300">Avg. Grade</th>
                        <th className="pb-3 font-semibold text-neutral-700 dark:text-neutral-300">Attendance</th>
                        <th className="pb-3 font-semibold text-neutral-700 dark:text-neutral-300">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursePerformance.map((course, index) => (
                        <motion.tr
                          key={course.course}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                          className="border-b border-white/5 transition hover:bg-white/5"
                        >
                          <td className="py-4 font-semibold text-neutral-900 dark:text-white">
                            {course.course}
                          </td>
                          <td className="py-4 text-neutral-600 dark:text-neutral-400">
                            {course.students}
                          </td>
                          <td className="py-4">
                            <span className="rounded-lg bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-600 dark:text-green-400">
                              {course.avgGrade}%
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="rounded-lg bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                              {course.attendance}%
                            </span>
                          </td>
                          <td className="py-4">
                            {course.trend === "up" ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-semibold">Up</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-500">
                                <TrendingDown className="h-4 w-4" />
                                <span className="text-sm font-semibold">Down</span>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Leaderboard & Insights */}
            <div className="space-y-8">
              {/* Top Performers Leaderboard */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center gap-3">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                    🏆 Top Performers
                  </h2>
                </div>

                <div className="space-y-3">
                  {topPerformers.map((student, index) => (
                    <motion.div
                      key={student.rank}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className={`flex items-center gap-3 rounded-2xl border p-4 transition hover:bg-white/5 ${
                        student.rank <= 3
                          ? "border-yellow-500/30 bg-yellow-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="text-2xl">{student.badge}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {student.name}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {student.courses} courses
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-neutral-900 dark:text-white">
                          {student.grade}%
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:shadow-lg">
                  View Full Leaderboard
                  <Zap className="h-4 w-4" />
                </button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                  Quick Insights
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Activity className="mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        Peak Engagement Time
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Tuesdays 10-11 AM (92% active)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        Most Challenging Course
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        CS 301 (Avg: 85%, needs review)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        Upcoming Deadlines
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        3 assignments due this week
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Export Modal */}
      <AnalyticsExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}

