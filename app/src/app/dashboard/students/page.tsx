"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock student data with gamification
const studentsData = [
  {
    id: 1,
    name: "Emily Chen",
    email: "emily.chen@university.edu",
    phone: "+1 (555) 123-4567",
    avatar: "EC",
    major: "Computer Science",
    year: "Junior",
    gpa: 3.9,
    attendance: 98,
    submissions: "12/12",
    trend: "up",
    status: "active",
    badges: ["🏆 Top Performer", "🔥 7-Day Streak", "⭐ Perfect Attendance"],
    points: 2450,
    level: 15,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "David Lee",
    email: "david.lee@university.edu",
    phone: "+1 (555) 234-5678",
    avatar: "DL",
    major: "Computer Science",
    year: "Senior",
    gpa: 3.7,
    attendance: 92,
    submissions: "11/12",
    trend: "up",
    status: "active",
    badges: ["💡 Problem Solver", "📚 Bookworm"],
    points: 1980,
    level: 12,
    lastActive: "5 hours ago",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    phone: "+1 (555) 345-6789",
    avatar: "SJ",
    major: "Information Systems",
    year: "Sophomore",
    gpa: 3.5,
    attendance: 88,
    submissions: "10/12",
    trend: "up",
    status: "active",
    badges: ["🎯 Goal Getter"],
    points: 1650,
    level: 10,
    lastActive: "1 day ago",
  },
  {
    id: 4,
    name: "Mike Brown",
    email: "mike.brown@university.edu",
    phone: "+1 (555) 456-7890",
    avatar: "MB",
    major: "Computer Science",
    year: "Freshman",
    gpa: 2.8,
    attendance: 72,
    submissions: "7/12",
    trend: "down",
    status: "warning",
    badges: [],
    points: 850,
    level: 5,
    lastActive: "3 days ago",
  },
  {
    id: 5,
    name: "Lisa Park",
    email: "lisa.park@university.edu",
    phone: "+1 (555) 567-8901",
    avatar: "LP",
    major: "Data Science",
    year: "Junior",
    gpa: 3.8,
    attendance: 95,
    submissions: "12/12",
    trend: "up",
    status: "active",
    badges: ["🌟 Rising Star", "💪 Consistent Performer"],
    points: 2100,
    level: 13,
    lastActive: "1 hour ago",
  },
  {
    id: 6,
    name: "John Smith",
    email: "john.smith@university.edu",
    phone: "+1 (555) 678-9012",
    avatar: "JS",
    major: "Computer Science",
    year: "Sophomore",
    gpa: 2.1,
    attendance: 55,
    submissions: "4/12",
    trend: "down",
    status: "critical",
    badges: [],
    points: 350,
    level: 2,
    lastActive: "1 week ago",
  },
];

export default function StudentsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getLevelProgress = (level: number) => {
    // Calculate progress to next level (0-100%)
    return ((level % 10) / 10) * 100;
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
              Students 👥
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Manage student profiles and track performance
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
                <option value="active">Active</option>
                <option value="warning">Warning</option>
                <option value="critical">At Risk</option>
              </select>
            </div>

            {/* Add Student Buttons */}
            <div className="flex gap-3">
              <Link
                href="/dashboard/students/invite"
                className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
              >
                <Share2 className="h-4 w-4" />
                Invite Students
              </Link>
              <Link
                href="/dashboard/students/create"
                className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Add Manually
              </Link>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <div className="mb-8 grid gap-6 sm:grid-cols-4">
            {[
              { label: "Total Students", value: "6", icon: Target, color: "from-blue-500 to-cyan-500" },
              { label: "Active", value: "4", icon: CheckCircle, color: "from-green-500 to-emerald-500" },
              { label: "At Risk", value: "2", icon: AlertCircle, color: "from-red-500 to-pink-500" },
              { label: "Avg. GPA", value: "3.3", icon: Award, color: "from-purple-500 to-pink-500" },
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

          {/* Student Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.id}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
              >
                {/* Status Badge */}
                <div className="absolute right-4 top-4">
                  <div className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${getStatusColor(student.status)} px-3 py-1 text-xs font-semibold text-white`}>
                    {getStatusIcon(student.status)}
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </div>
                </div>

                {/* Avatar & Basic Info */}
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-xl font-bold text-white shadow-lg">
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold text-neutral-900 dark:text-white">
                      {student.name}
                    </h3>
                    <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {student.major}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {student.year} • {student.lastActive}
                    </p>
                  </div>
                </div>

                {/* Gamification: Level & Points */}
                <div className="mb-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Level {student.level}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {student.points} XP
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/20 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getLevelProgress(student.level)}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>

                {/* Badges */}
                {student.badges.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {student.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="mb-4 grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">GPA</div>
                    <div className="mt-1 font-bold text-neutral-900 dark:text-white">{student.gpa}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Attendance</div>
                    <div className="mt-1 font-bold text-neutral-900 dark:text-white">{student.attendance}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">Submissions</div>
                    <div className="mt-1 font-bold text-neutral-900 dark:text-white">{student.submissions}</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <Mail className="h-3.5 w-3.5" />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <Phone className="h-3.5 w-3.5" />
                    {student.phone}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="flex items-center gap-1 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    View Profile →
                  </Link>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
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
        </div>
      </main>
    </div>
  );
}

