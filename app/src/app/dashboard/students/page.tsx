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
import { useState, useEffect } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Student data interface
interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string;
  major: string | null;
  year: string | null;
  gpa: number | null;
  attendance: number;
  submissions: string;
  trend: "up" | "down";
  status: "active" | "warning" | "critical";
  badges: string[];
  points: number;
  level: number;
  lastActive: string;
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper function to format time ago
function formatTimeAgo(date: Date | null): string {
  if (!date) return "Never";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

// Helper function to calculate student status
function calculateStatus(
  attendance: number,
  gpa: number | null,
  completedAssignments: number,
  totalAssignments: number
): "active" | "warning" | "critical" {
  const submissionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
  const gpaValue = gpa || 0;
  
  if (attendance < 60 || gpaValue < 2.0 || submissionRate < 50) {
    return "critical";
  }
  if (attendance < 75 || gpaValue < 2.5 || submissionRate < 70) {
    return "warning";
  }
  return "active";
}

export default function StudentsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Get user's profile to check role and organization
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id, role")
          .eq("id", user.id)
          .single();

        if (!profile) {
          throw new Error("Profile not found");
        }

        let studentsData: any[] = [];

        // If user is admin, fetch all students in their organization (if they have one)
        // Otherwise, fetch students from courses they teach
        if (profile.role === "admin" && profile.organization_id) {
          const { data: orgStudents, error: orgError } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "student")
            .eq("organization_id", profile.organization_id)
            .order("full_name", { ascending: true });

          if (orgError) {
            console.error("Error fetching org students:", orgError);
          } else {
            studentsData = orgStudents || [];
          }
        } else {
          // Fetch courses where user is a collaborator
          const { data: collaborations } = await supabase
            .from("course_collaborators")
            .select("course_id")
            .eq("profile_id", user.id);

          const courseIds = collaborations?.map((c) => c.course_id) || [];

          if (courseIds.length === 0) {
            // No courses, return empty list
            setStudents([]);
            setLoading(false);
            return;
          }

          // Fetch students enrolled in those courses
          const { data: enrollments } = await supabase
            .from("course_enrollments")
            .select("student_id")
            .in("course_id", courseIds)
            .eq("status", "active");

          const studentIds = [...new Set(enrollments?.map((e) => e.student_id) || [])];

          if (studentIds.length === 0) {
            setStudents([]);
            setLoading(false);
            return;
          }

          // Fetch student profiles
          const { data: courseStudents, error: studentsError } = await supabase
            .from("profiles")
            .select("*")
            .in("id", studentIds)
            .eq("role", "student")
            .order("full_name", { ascending: true });

          if (studentsError) {
            throw new Error("Failed to fetch students");
          }

          studentsData = courseStudents || [];
        }

        if (studentsData.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }

        // Fetch additional data for each student
        const studentsWithData = await Promise.all(
          studentsData.map(async (student) => {
            // Get enrollments to find courses
            const { data: enrollments } = await supabase
              .from("course_enrollments")
              .select("course_id")
              .eq("student_id", student.id)
              .eq("status", "active");

            const courseIds = enrollments?.map((e) => e.course_id) || [];

            // Calculate attendance across all courses
            let totalSessions = 0;
            let presentSessions = 0;

            if (courseIds.length > 0) {
              // Get all attendance sessions for enrolled courses
              const { data: sessions } = await supabase
                .from("attendance_sessions")
                .select("id")
                .in("course_id", courseIds)
                .eq("status", "ended");

              totalSessions = sessions?.length || 0;

              if (totalSessions > 0) {
                // Get attendance records for this student
                const sessionIds = sessions?.map((s) => s.id) || [];
                const { data: attendanceRecords } = await supabase
                  .from("attendance_records")
                  .select("status")
                  .in("session_id", sessionIds)
                  .eq("student_id", student.id);

                if (attendanceRecords) {
                  presentSessions = attendanceRecords.filter(
                    (r) => r.status === "present" || r.status === "late"
                  ).length;
                }
              }
            }

            const attendance = totalSessions > 0
              ? Math.round((presentSessions / totalSessions) * 100)
              : 0; // No sessions yet

            // Calculate submissions
            let completedAssignments = 0;
            let totalAssignments = 0;

            if (courseIds.length > 0) {
              const { data: assignments } = await supabase
                .from("assignments")
                .select("id")
                .in("course_id", courseIds)
                .eq("status", "published");

              totalAssignments = assignments?.length || 0;

              if (totalAssignments > 0) {
                const { data: submissions } = await supabase
                  .from("submissions")
                  .select("id")
                  .eq("student_id", student.id)
                  .in("course_id", courseIds)
                  .eq("status", "submitted");

                completedAssignments = submissions?.length || 0;
              }
            }

            const submissionsText = `${completedAssignments}/${totalAssignments}`;

            // Get badges
            const { data: badges } = await supabase
              .from("student_badges")
              .select("badge_name")
              .eq("student_id", student.id)
              .limit(5);

            const badgeNames = badges?.map((b) => b.badge_name) || [];

            // Get progress/points - aggregate across all courses
            const { data: progress } = await supabase
              .from("student_progress")
              .select("experience_points, level, last_active_at")
              .eq("student_id", student.id);

            // Sum all experience points and get max level
            const totalPoints = progress?.reduce((sum, p) => sum + (p.experience_points || 0), 0) || 0;
            const maxLevel = progress && progress.length > 0
              ? Math.max(...progress.map((p) => p.level || 1))
              : 1;
            
            // Get most recent activity
            const lastActive = progress && progress.length > 0
              ? progress.reduce((latest, p) => {
                  if (!p.last_active_at) return latest;
                  const pDate = new Date(p.last_active_at);
                  return !latest || pDate > latest ? pDate : latest;
                }, null as Date | null)
              : student.last_login_at
              ? new Date(student.last_login_at)
              : null;

            // Calculate status
            const status = calculateStatus(
              attendance,
              student.gpa,
              completedAssignments,
              totalAssignments
            );

            // Determine trend (simplified - could be improved with historical data)
            const trend: "up" | "down" = attendance >= 80 && (student.gpa || 0) >= 3.0 ? "up" : "down";

            return {
              id: student.id,
              name: student.full_name,
              email: student.email,
              phone: student.phone,
              avatar: getInitials(student.full_name),
              major: student.major,
              year: student.year,
              gpa: student.gpa ? Number(student.gpa) : null,
              attendance,
              submissions: submissionsText,
              trend,
              status,
              badges: badgeNames,
              points: totalPoints,
              level: maxLevel,
              lastActive: formatTimeAgo(lastActive),
            };
          })
        );

        setStudents(studentsWithData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch students");
        setLoading(false);
      }
    }

    void fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const atRiskStudents = students.filter((s) => s.status === "critical" || s.status === "warning").length;
  const avgGpa = students.length > 0
    ? (students.reduce((sum, s) => sum + (s.gpa || 0), 0) / students.length).toFixed(1)
    : "0.0";

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

          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">⏳</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                Loading students...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mb-8 py-8 text-center">
              <div className="mb-4 text-6xl">⚠️</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                {error}
              </div>
              <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                You can still add students manually or invite them.
              </div>
            </div>
          )}

          {/* Toolbar - Always show if not loading */}
          {!loading && (
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
          )}

          {/* Statistics Cards */}
          {!loading && students.length > 0 && (
          <div className="mb-8 grid gap-6 sm:grid-cols-4">
            {[
              { label: "Total Students", value: totalStudents.toString(), icon: Target, color: "from-blue-500 to-cyan-500" },
              { label: "Active", value: activeStudents.toString(), icon: CheckCircle, color: "from-green-500 to-emerald-500" },
              { label: "At Risk", value: atRiskStudents.toString(), icon: AlertCircle, color: "from-red-500 to-pink-500" },
              { label: "Avg. GPA", value: avgGpa, icon: Award, color: "from-purple-500 to-pink-500" },
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
          )}

          {/* Student Grid */}
          {!loading && students.length > 0 && (
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
                    {student.major && (
                      <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {student.major}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {student.year || "N/A"} • {student.lastActive}
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
                    <div className="mt-1 font-bold text-neutral-900 dark:text-white">
                      {student.gpa !== null ? student.gpa.toFixed(1) : "N/A"}
                    </div>
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
                  {student.phone && (
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Phone className="h-3.5 w-3.5" />
                      {student.phone}
                    </div>
                  )}
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
          )}

          {!loading && students.length === 0 && !error && (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">👥</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                No students yet
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Get started by adding students manually or inviting them via email
              </div>
              <div className="flex gap-3 justify-center">
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
            </div>
          )}

          {!loading && students.length > 0 && filteredStudents.length === 0 && (
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

