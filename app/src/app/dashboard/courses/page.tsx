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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  year: number;
  students: number;
  schedule: string;
  room: string | null;
  progress: number;
  nextClass: string;
  assignments: number;
  completedAssignments: number;
  avgGrade: number;
  color: string;
  collaborators: string[];
  unreadMessages: number;
  recentActivity: string;
}

const colorMap = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CoursesPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeAssignments: 0,
    avgCompletion: 0,
  });

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch courses where user is a collaborator
        const { data: collaborators } = await supabase
          .from("course_collaborators")
          .select(`
            course_id,
            courses (
              id,
              code,
              name,
              semester,
              year,
              room,
              color,
              status
            )
          `)
          .eq("profile_id", user.id);

        // Also check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        let courseIds: string[] = [];
        let coursesData: any[] = [];

        if ((profile as any)?.role === "admin") {
          // Admin can see all active courses
          const { data: allCourses } = await supabase
            .from("courses")
            .select("*")
            .eq("status", "active");
          coursesData = (allCourses as any) || [];
          courseIds = coursesData.map((c: any) => c.id);
        } else {
          // Regular user sees only their courses
          coursesData = ((collaborators as any) || [])
            .map((c: any) => c.courses)
            .filter((c: any) => c && c.status === "active");
          courseIds = coursesData.map((c: any) => c.id);
        }

        if (courseIds.length === 0) {
          setCourses([]);
          setStats({
            totalCourses: 0,
            totalStudents: 0,
            activeAssignments: 0,
            avgCompletion: 0,
          });
          setLoading(false);
          return;
        }

        // Fetch enrollments for all courses
        const { data: enrollments } = await supabase
          .from("course_enrollments")
          .select("course_id, student_id, status")
          .in("course_id", courseIds)
          .eq("status", "active");

        // Fetch assignments
        const { data: assignments } = await supabase
          .from("assignments")
          .select("id, course_id, status")
          .in("course_id", courseIds);

        // Fetch student progress
        const { data: progressData } = await supabase
          .from("student_progress")
          .select("course_id, assignments_completed, assignments_total")
          .in("course_id", courseIds);

        // Fetch schedules
        const { data: schedules } = await supabase
          .from("schedules")
          .select("course_id, day_of_week, start_time, recurring")
          .in("course_id", courseIds)
          .eq("recurring", true);

        // Fetch collaborators for each course
        const { data: allCollaborators } = await supabase
          .from("course_collaborators")
          .select(`
            course_id,
            profile_id,
            profiles (
              full_name,
              role
            )
          `)
          .in("course_id", courseIds);

        // Fetch unread messages count (simplified - you may want to implement this properly)
        const unreadCounts: Record<string, number> = {};

        // Process courses
        const processedCourses: Course[] = await Promise.all(
          coursesData.map(async (course: any, index: number) => {
            const courseId = course.id;
            const courseEnrollments = (enrollments as any)?.filter((e: any) => e.course_id === courseId) || [];
            const students = courseEnrollments.length;

            const courseAssignments = (assignments as any)?.filter((a: any) => a.course_id === courseId) || [];
            const totalAssignments = courseAssignments.length;
            const completedAssignments = courseAssignments.filter((a: any) => a.status === "closed").length;

            const courseProgress = (progressData as any)?.filter((p: any) => p.course_id === courseId) || [];
            const avgProgress = courseProgress.length > 0
              ? Math.round(
                  courseProgress.reduce((sum: number, p: any) => {
                    const studentProgress = p.assignments_total > 0
                      ? (p.assignments_completed / p.assignments_total) * 100
                      : 0;
                    return sum + studentProgress;
                  }, 0) / courseProgress.length
                )
              : 0;

            // Calculate average grade
            const { data: gradeData } = await supabase
              .from("student_progress")
              .select("current_grade")
              .eq("course_id", courseId)
              .not("current_grade", "is", null);

            const avgGrade = (gradeData as any)?.length > 0
              ? Math.round(
                  (gradeData as any).reduce((sum: number, g: any) => sum + (g.current_grade || 0), 0) /
                  (gradeData as any).length
                )
              : 0;

            // Get schedule
            const courseSchedules = (schedules as any)?.filter((s: any) => s.course_id === courseId) || [];
            let scheduleText = "Not scheduled";
            let nextClassText = "No upcoming classes";

            if (courseSchedules.length > 0) {
              const scheduleParts = courseSchedules.map((s: any) => {
                const dayName = dayNames[s.day_of_week];
                const startTime = new Date(`2000-01-01T${s.start_time}`);
                return `${dayName} ${startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
              });
              scheduleText = scheduleParts.join(", ");

              // Find next class
              const today = new Date();
              const currentDay = today.getDay();
              const currentTime = today.getHours() * 60 + today.getMinutes();

              const upcomingSchedules = courseSchedules
                .map((s: any) => {
                  const startMinutes = new Date(`2000-01-01T${s.start_time}`).getHours() * 60 +
                    new Date(`2000-01-01T${s.start_time}`).getMinutes();
                  return { ...s, startMinutes };
                })
                .filter((s: any) => {
                  if (s.day_of_week > currentDay) return true;
                  if (s.day_of_week === currentDay && s.startMinutes > currentTime) return true;
                  return false;
                })
                .sort((a: any, b: any) => {
                  if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
                  return a.startMinutes - b.startMinutes;
                });

              if (upcomingSchedules.length > 0) {
                const next = upcomingSchedules[0];
                const dayName = dayNames[next.day_of_week];
                const startTime = new Date(`2000-01-01T${next.start_time}`);
                nextClassText = `${dayName}, ${startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
              } else if (courseSchedules.length > 0) {
                const nextWeekSchedule = courseSchedules[0];
                const dayName = dayNames[nextWeekSchedule.day_of_week];
                const startTime = new Date(`2000-01-01T${nextWeekSchedule.start_time}`);
                nextClassText = `Next ${dayName}, ${startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
              }
            }

            // Get collaborators
            const courseCollaborators = ((allCollaborators as any) || [])
              .filter((c: any) => c.course_id === courseId)
              .map((c: any) => {
                const profile = c.profiles;
                if (!profile) return null;
                const role = (profile as any).role;
                const name = (profile as any).full_name || "Unknown";
                if (role === "ta") return `TA: ${name}`;
                return name;
              })
              .filter(Boolean) as string[];

            // Get recent activity (latest announcement or assignment)
            const { data: recentAnnouncement } = await supabase
              .from("announcements")
              .select("title, created_at")
              .eq("course_id", courseId)
              .order("created_at", { ascending: false })
              .limit(1)
              .single();

            let recentActivity = "No recent activity";
            if (recentAnnouncement) {
              const createdDate = new Date((recentAnnouncement as any).created_at);
              const now = new Date();
              const diffHours = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
              if (diffHours < 24) {
                recentActivity = `New announcement: ${(recentAnnouncement as any).title}`;
              }
            }

            // Get color
            const colorIndex = course.color ? parseInt(course.color) % colorMap.length : index % colorMap.length;
            const color = colorMap[colorIndex] || colorMap[0];

            return {
              id: courseId,
              code: course.code,
              name: course.name,
              semester: `${course.semester} ${course.year}`,
              year: course.year,
              students,
              schedule: scheduleText,
              room: course.room,
              progress: avgProgress,
              nextClass: nextClassText,
              assignments: totalAssignments,
              completedAssignments,
              avgGrade,
              color,
              collaborators: courseCollaborators,
              unreadMessages: unreadCounts[courseId] || 0,
              recentActivity,
            };
          })
        );

        setCourses(processedCourses);

        // Calculate stats
        const totalStudents = new Set((enrollments as any)?.map((e: any) => e.student_id) || []).size;
        const activeAssignments = (assignments as any)?.filter((a: any) => a.status === "published").length || 0;
        const avgCompletion = processedCourses.length > 0
          ? Math.round(processedCourses.reduce((sum, c) => sum + c.progress, 0) / processedCourses.length)
          : 0;

        setStats({
          totalCourses: processedCourses.length,
          totalStudents,
          activeAssignments,
          avgCompletion,
        });

        setLoading(false);
      } catch (err) {
        console.error("Courses fetch error:", err);
        setLoading(false);
      }
    }

    void fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
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

          {loading && (
            <div className="py-16 text-center">
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">Loading courses...</div>
            </div>
          )}

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
          {!loading && (
            <div className="mb-8 grid gap-6 sm:grid-cols-4">
            {[
              { label: "Total Courses", value: stats.totalCourses.toString(), icon: BookOpen, color: "from-blue-500 to-cyan-500" },
              { label: "Total Students", value: stats.totalStudents.toString(), icon: Users, color: "from-purple-500 to-pink-500" },
              { label: "Active Assignments", value: stats.activeAssignments.toString(), icon: FileText, color: "from-green-500 to-emerald-500" },
              { label: "Avg. Completion", value: `${stats.avgCompletion}%`, icon: CheckCircle, color: "from-orange-500 to-red-500" },
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

          {/* Courses Grid */}
          {!loading && (
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
          )}

          {!loading && filteredCourses.length === 0 && (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">📚</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                {courses.length === 0 ? "No courses yet" : "No courses found"}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {courses.length === 0 
                  ? "Create your first course to get started"
                  : "Try a different search query"}
              </div>
              {courses.length === 0 && (
                <Link
                  href="/dashboard/courses/create"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Course
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

