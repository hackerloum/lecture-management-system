"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Search,
  Download,
  Upload,
  Edit,
  Check,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Star,
  Sparkles,
  Settings,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { ExportModal } from "@/components/grades/ExportModal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Course {
  id: string;
  code: string;
  name: string;
}

interface Assignment {
  id: string;
  title: string;
  due_date: string | null;
  max_points: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  assignments: (number | null)[];
  avgGrade: number;
  trend: "up" | "down";
  status: "excellent" | "good" | "warning" | "critical";
}

function GradesPageContent() {
  const prefersReducedMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseIdParam || "");
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState({
    classAverage: 0,
    highestGrade: 0,
    lowestGrade: 0,
    totalStudents: 0,
  });

  // Fetch courses and data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch courses where user is a collaborator
        const { data: courseCollaborators, error: coursesError } = await supabase
          .from("course_collaborators")
          .select(`
            course_id,
            courses (
              id,
              code,
              name
            )
          `)
          .eq("profile_id", user.id);

        if (coursesError) {
          console.error("Courses error:", coursesError);
        }

        const fetchedCourses: Course[] = (courseCollaborators || [])
          .map((cc: any) => ({
            id: cc.courses.id,
            code: cc.courses.code,
            name: cc.courses.name,
          }))
          .filter((c: Course) => c.id);

        setCourses(fetchedCourses);

        // Auto-select first course if available
        if (fetchedCourses.length > 0 && !selectedCourseId) {
          setSelectedCourseId(fetchedCourses[0].id);
        }

        // Fetch data for selected course
        if (selectedCourseId || (fetchedCourses.length > 0 && fetchedCourses[0].id)) {
          const courseId = selectedCourseId || fetchedCourses[0].id;
          await fetchCourseData(courseId);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch course data when course selection changes
  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseData(selectedCourseId);
    }
  }, [selectedCourseId]);

  async function fetchCourseData(courseId: string) {
    try {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      // Fetch enrolled students
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("course_enrollments")
        .select(`
          student_id,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq("course_id", courseId)
        .eq("status", "active");

      if (enrollmentsError) {
        console.error("Enrollments error:", enrollmentsError);
      }

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("id, title, due_date, max_points")
        .eq("course_id", courseId)
        .eq("status", "published")
        .order("due_date", { ascending: true });

      if (assignmentsError) {
        console.error("Assignments error:", assignmentsError);
      }

      const fetchedAssignments: Assignment[] = (assignmentsData || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        due_date: a.due_date,
        max_points: Number(a.max_points) || 100,
      }));

      setAssignments(fetchedAssignments);

      // Fetch grades for all students and assignments
      const studentIds = (enrollments || []).map((e: any) => e.student_id).filter(Boolean);
      const assignmentIds = fetchedAssignments.map((a) => a.id);

      let gradesData: any[] = [];
      if (studentIds.length > 0 && assignmentIds.length > 0) {
        const { data: grades, error: gradesError } = await supabase
          .from("grades")
          .select("assignment_id, student_id, percentage, points_earned, points_possible")
          .eq("course_id", courseId)
          .in("student_id", studentIds)
          .in("assignment_id", assignmentIds);

        if (gradesError) {
          console.error("Grades error:", gradesError);
        } else {
          gradesData = grades || [];
        }
      }

      // Build student data with grades
      const studentsData: Student[] = (enrollments || []).map((enrollment: any) => {
        const profile = enrollment.profiles;
        if (!profile) return null;

        const studentId = profile.id;
        const nameParts = profile.full_name?.split(" ") || [];
        const avatar = nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
          : nameParts[0]?.[0]?.toUpperCase() || "U";

        // Get grades for this student
        const studentGrades = gradesData.filter((g) => g.student_id === studentId);
        const assignmentGrades: (number | null)[] = fetchedAssignments.map((assignment) => {
          const grade = studentGrades.find((g) => g.assignment_id === assignment.id);
          if (grade && grade.percentage != null) {
            return Number(grade.percentage);
          }
          return null;
        });

        // Calculate average
        const validGrades = assignmentGrades.filter((g) => g !== null) as number[];
        const avgGrade = validGrades.length > 0
          ? validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length
          : 0;

        // Determine trend (simplified - compare first half vs second half)
        const firstHalf = validGrades.slice(0, Math.ceil(validGrades.length / 2));
        const secondHalf = validGrades.slice(Math.ceil(validGrades.length / 2));
        const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, g) => s + g, 0) / firstHalf.length : 0;
        const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, g) => s + g, 0) / secondHalf.length : 0;
        const trend: "up" | "down" = secondAvg >= firstAvg ? "up" : "down";

        // Determine status
        let status: "excellent" | "good" | "warning" | "critical";
        if (avgGrade >= 90) {
          status = "excellent";
        } else if (avgGrade >= 80) {
          status = "good";
        } else if (avgGrade >= 60) {
          status = "warning";
        } else {
          status = "critical";
        }

        return {
          id: studentId,
          name: profile.full_name || "Unknown",
          email: profile.email || "",
          avatar,
          assignments: assignmentGrades,
          avgGrade,
          trend,
          status,
        };
      }).filter((s): s is Student => s !== null);

      setStudents(studentsData);

      // Calculate statistics
      const allGrades = studentsData.flatMap((s) => s.assignments.filter((g) => g !== null) as number[]);
      const classAverage = allGrades.length > 0
        ? allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length
        : 0;
      const highestGrade = allGrades.length > 0 ? Math.max(...allGrades) : 0;
      const avgGrades = studentsData.map((s) => s.avgGrade).filter((g) => g > 0);
      const lowestGrade = avgGrades.length > 0 ? Math.min(...avgGrades) : 0;

      setStats({
        classAverage,
        highestGrade,
        lowestGrade,
        totalStudents: studentsData.length,
      });
    } catch (err) {
      console.error("Error fetching course data:", err);
    } finally {
      setLoading(false);
    }
  }

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
              {/* Course Selection */}
              {courses.length > 0 && (
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              )}

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
                href={`/dashboard/grades/configure${selectedCourseId ? `?courseId=${selectedCourseId}` : ""}`}
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
              { label: "Class Average", value: `${stats.classAverage.toFixed(1)}%`, icon: Award, color: "from-green-500 to-emerald-500" },
              { label: "Highest Grade", value: `${stats.highestGrade.toFixed(1)}%`, icon: Star, color: "from-yellow-500 to-orange-500" },
              { label: "Lowest Grade", value: `${stats.lowestGrade.toFixed(1)}%`, icon: AlertCircle, color: "from-red-500 to-pink-500" },
              { label: "Total Students", value: stats.totalStudents.toString(), icon: Sparkles, color: "from-blue-500 to-cyan-500" },
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
                    {assignments.map((assignment) => {
                      const dueDate = assignment.due_date
                        ? new Date(assignment.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "No due date";
                      return (
                        <th
                          key={assignment.id}
                          className="px-4 py-4 text-center text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                        >
                          <div>{assignment.title}</div>
                          <div className="text-xs font-normal text-neutral-500">{dueDate}</div>
                        </th>
                      );
                    })}
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
                          {grade !== null ? (
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
                              {grade.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-400">-</span>
                          )}
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

            {loading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
                <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  Loading grades...
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div className="py-16 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
                <div className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                  No courses found
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  You need to be assigned to a course to view grades
                </div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                  No students found
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Try adjusting your search or filters
                </div>
              </div>
            ) : null}
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

export default function GradesPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                Loading grades...
              </p>
            </div>
          </div>
        </main>
      </div>
    }>
      <GradesPageContent />
    </Suspense>
  );
}
