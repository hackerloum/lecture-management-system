"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Star,
  Sparkles,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { ExportModal } from "@/components/grades/ExportModal";

// Mock data
const students = [
  {
    id: 1,
    name: "Emily Chen",
    email: "emily.chen@university.edu",
    avatar: "EC",
    assignments: [98, 95, 92, 97, 96],
    avgGrade: 95.6,
    trend: "up",
    status: "excellent",
  },
  {
    id: 2,
    name: "David Lee",
    email: "david.lee@university.edu",
    avatar: "DL",
    assignments: [88, 92, 90, 91, 89],
    avgGrade: 90.0,
    trend: "up",
    status: "good",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    avatar: "SJ",
    assignments: [85, 87, 89, 91, 88],
    avgGrade: 88.0,
    trend: "up",
    status: "good",
  },
  {
    id: 4,
    name: "Mike Brown",
    email: "mike.brown@university.edu",
    avatar: "MB",
    assignments: [78, 75, 72, 70, 68],
    avgGrade: 72.6,
    trend: "down",
    status: "warning",
  },
  {
    id: 5,
    name: "Lisa Park",
    email: "lisa.park@university.edu",
    avatar: "LP",
    assignments: [92, 94, 93, 95, 96],
    avgGrade: 94.0,
    trend: "up",
    status: "excellent",
  },
  {
    id: 6,
    name: "John Smith",
    email: "john.smith@university.edu",
    avatar: "JS",
    assignments: [55, 52, 48, 50, 45],
    avgGrade: 50.0,
    trend: "down",
    status: "critical",
  },
];

const assignments = [
  { id: 1, name: "Assignment 1", dueDate: "Jan 15", maxScore: 100 },
  { id: 2, name: "Assignment 2", dueDate: "Jan 29", maxScore: 100 },
  { id: 3, name: "Assignment 3", dueDate: "Feb 12", maxScore: 100 },
  { id: 4, name: "Assignment 4", dueDate: "Feb 26", maxScore: 100 },
  { id: 5, name: "Assignment 5", dueDate: "Mar 12", maxScore: 100 },
];

export default function GradesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "from-green-500 to-emerald-500";
      case "good":
        return "from-blue-500 to-cyan-500";
      case "warning":
        return "from-orange-500 to-yellow-500";
      case "critical":
        return "from-red-500 to-pink-500";
      default:
        return "from-neutral-500 to-neutral-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "⭐ Excellent";
      case "good":
        return "✓ Good";
      case "warning":
        return "⚠ Warning";
      case "critical":
        return "🚨 At Risk";
      default:
        return status;
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
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Grade Book ✓
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Manage and track student performance
            </p>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
              >
                <option value="all">All Students</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="warning">Warning</option>
                <option value="critical">At Risk</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/dashboard/grades/configure"
                className="flex h-11 items-center gap-2 rounded-xl border border-purple-600/50 bg-purple-600/10 px-4 text-sm font-semibold text-purple-600 backdrop-blur-sm transition hover:bg-purple-600/20 dark:text-purple-400"
              >
                <Settings className="h-4 w-4" />
                Configure
              </Link>
              <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button 
                onClick={() => setIsExportModalOpen(true)}
                className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </motion.div>

          {/* Grade Statistics */}
          <div className="mb-8 grid gap-6 sm:grid-cols-4">
            {[
              { label: "Class Average", value: "81.5%", icon: Award, color: "from-green-500 to-emerald-500" },
              { label: "Highest Grade", value: "95.6%", icon: Star, color: "from-yellow-500 to-orange-500" },
              { label: "Lowest Grade", value: "50.0%", icon: AlertCircle, color: "from-red-500 to-pink-500" },
              { label: "Total Students", value: "6", icon: Sparkles, color: "from-blue-500 to-cyan-500" },
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

          {/* Grade Table */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 dark:bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Student
                    </th>
                    {assignments.map((assignment) => (
                      <th
                        key={assignment.id}
                        className="px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        <div>{assignment.name}</div>
                        <div className="text-xs font-normal text-neutral-500">{assignment.dueDate}</div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Average
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                            {student.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      {student.assignments.map((grade, idx) => (
                        <td key={idx} className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center rounded-lg px-3 py-1 text-sm font-semibold ${
                              grade >= 90
                                ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                : grade >= 80
                                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : grade >= 70
                                ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                : grade >= 60
                                ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                : "bg-red-500/20 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                      ))}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-bold text-neutral-900 dark:text-white">
                            {student.avgGrade.toFixed(1)}%
                          </span>
                          {student.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${getStatusColor(
                            student.status
                          )} px-3 py-1 text-xs font-semibold text-white`}
                        >
                          {getStatusLabel(student.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-600 transition hover:bg-blue-500/30 dark:text-blue-400">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20 text-green-600 transition hover:bg-green-500/30 dark:text-green-400">
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                  No students found
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Try adjusting your search or filters
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </div>
  );
}

