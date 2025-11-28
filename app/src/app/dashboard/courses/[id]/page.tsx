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
  Star,
  Award,
  BookOpen,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Course data interface
interface CourseData {
  id: string;
  code: string;
  name: string;
  semester: string;
  year: number;
  color: string;
  description: string | null;
  students: number;
  avgGrade: number;
  progress: number;
  completedAssignments: number;
  assignments: number;
  schedule: string;
  room: string | null;
  nextClass: string;
  syllabus?: string | null;
  announcements: { id: string; title: string; date: string; content: string }[];
  upcomingDeadlines: { id: string; title: string; date: string; type?: string }[];
  recentMaterials: { id: string; title: string; date: string; type?: string }[];
}

const colorMap = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function CourseDetailsPage() {
  const prefersReducedMotion = useReducedMotion();
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch course data
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        if (courseError || !courseData) {
          throw new Error("Course not found");
        }

        // Check if user has access to this course
        const { data: collaborator } = await supabase
          .from("course_collaborators")
          .select("id")
          .eq("course_id", courseId)
          .eq("profile_id", user.id)
          .single();

        if (!collaborator) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if ((profile as any)?.role !== "admin") {
            throw new Error("You don't have access to this course");
          }
        }

        // Fetch student count
        const { data: enrollments } = await supabase
          .from("course_enrollments")
          .select("id")
          .eq("course_id", courseId)
          .eq("status", "active");

        const students = (enrollments as any)?.length || 0;

        // Fetch assignments
        const { data: assignments } = await supabase
          .from("assignments")
          .select("id, title, due_date, type, status")
          .eq("course_id", courseId);

        const assignmentsList = (assignments as any) || [];
        const totalAssignments = assignmentsList.length;
        const completedAssignments = assignmentsList.filter((a: any) => a.status === "closed").length;

        // Fetch upcoming deadlines (next 30 days)
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const upcomingDeadlines = assignmentsList
          .filter((a: any) => a.due_date && a.status === "published")
          .map((a: any) => {
            const dueDate = new Date(a.due_date);
            if (dueDate >= now && dueDate <= thirtyDaysFromNow) {
              return {
                id: a.id,
                title: a.title,
                date: dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                type: a.type || "assignment",
              };
            }
            return null;
          })
          .filter(Boolean)
          .slice(0, 5) as { id: string; title: string; date: string; type?: string }[];

        // Fetch average grade from student progress
        const { data: progressData } = await supabase
          .from("student_progress")
          .select("current_grade, assignments_completed, assignments_total")
          .eq("course_id", courseId)
          .not("current_grade", "is", null);

        const progressList = (progressData as any) || [];
        const avgGrade = progressList.length > 0
          ? Math.round(
              progressList.reduce((sum: number, p: any) => sum + (p.current_grade || 0), 0) / progressList.length
            )
          : 0;

        // Calculate progress (average of all students' progress)
        const progress = progressList.length > 0
          ? Math.round(
              progressList.reduce((sum: number, p: any) => {
                const studentProgress = p.assignments_total > 0
                  ? (p.assignments_completed / p.assignments_total) * 100
                  : 0;
                return sum + studentProgress;
              }, 0) / progressList.length
            )
          : 0;

        // Fetch schedule
        const { data: schedules } = await supabase
          .from("schedules")
          .select("day_of_week, start_time, end_time, room")
          .eq("course_id", courseId)
          .eq("recurring", true)
          .order("day_of_week", { ascending: true })
          .order("start_time", { ascending: true });

        const schedulesList = (schedules as any) || [];
        let scheduleText = "Not scheduled";
        let nextClassText = "No upcoming classes";
        const room = (courseData as any).room || schedulesList[0]?.room || "TBD";

        if (schedulesList.length > 0) {
          const scheduleParts = schedulesList.map((s: any) => {
            const dayName = dayNames[s.day_of_week];
            const startTime = new Date(`2000-01-01T${s.start_time}`);
            const endTime = new Date(`2000-01-01T${s.end_time}`);
            return `${dayName} ${startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${endTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
          });
          scheduleText = scheduleParts.join(", ");

          // Find next class
          const today = new Date();
          const currentDay = today.getDay();
          const currentTime = today.getHours() * 60 + today.getMinutes();

          const upcomingSchedules = schedulesList
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
          } else {
            // Next week
            const nextWeekSchedule = schedulesList[0];
            const dayName = dayNames[nextWeekSchedule.day_of_week];
            const startTime = new Date(`2000-01-01T${nextWeekSchedule.start_time}`);
            nextClassText = `Next ${dayName}, ${startTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
          }
        }

        // Fetch announcements
        const { data: announcements } = await supabase
          .from("announcements")
          .select("id, title, content, created_at")
          .eq("course_id", courseId)
          .order("created_at", { ascending: false })
          .limit(5);

        const formattedAnnouncements = ((announcements as any) || []).map((a: any) => {
          const createdDate = new Date(a.created_at);
          const now = new Date();
          const diffMs = now.getTime() - createdDate.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          
          let dateText = "";
          if (diffDays === 0) dateText = "Today";
          else if (diffDays === 1) dateText = "Yesterday";
          else if (diffDays < 7) dateText = `${diffDays} days ago`;
          else dateText = createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return {
            id: a.id,
            title: a.title,
            date: dateText,
            content: a.content,
          };
        });

        // Fetch recent materials
        const { data: materials } = await supabase
          .from("course_materials")
          .select("id, title, type, created_at")
          .eq("course_id", courseId)
          .order("created_at", { ascending: false })
          .limit(5);

        const formattedMaterials = ((materials as any) || []).map((m: any) => {
          const createdDate = new Date(m.created_at);
          const now = new Date();
          const diffMs = now.getTime() - createdDate.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          
          let dateText = "";
          if (diffDays === 0) dateText = "Today";
          else if (diffDays === 1) dateText = "Yesterday";
          else if (diffDays < 7) dateText = `${diffDays} days ago`;
          else dateText = createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return {
            id: m.id,
            title: m.title,
            date: dateText,
            type: m.type,
          };
        });

        // Format semester string
        const semesterText = `${(courseData as any).semester} ${(courseData as any).year}`;

        // Get color (use course color or default)
        const colorIndex = (courseData as any).color ? parseInt((courseData as any).color) % colorMap.length : 0;
        const color = colorMap[colorIndex] || colorMap[0];

        setCourse({
          id: (courseData as any).id,
          code: (courseData as any).code,
          name: (courseData as any).name,
          semester: semesterText,
          year: (courseData as any).year,
          color,
          description: (courseData as any).description,
          students,
          avgGrade,
          progress,
          completedAssignments,
          assignments: totalAssignments,
          schedule: scheduleText,
          room,
          nextClass: nextClassText,
          syllabus: (courseData as any).syllabus,
          announcements: formattedAnnouncements,
          upcomingDeadlines,
          recentMaterials: formattedMaterials,
        });

        setLoading(false);
      } catch (err) {
        console.error("Course data fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch course data");
        setLoading(false);
      }
    }

    if (courseId) {
      void fetchCourseData();
    }
  }, [courseId]);

  const [_activeTab, _setActiveTab] = useState<"overview" | "materials" | "announcements" | "students">("overview");

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-16">
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">Loading course...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-16">
              <div className="mb-4 text-6xl">⚠️</div>
              <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                {error || "Course not found"}
              </div>
              <Link
                href="/dashboard/courses"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                {course.description && (
                  <p className="text-lg text-neutral-600 dark:text-neutral-400">
                    {course.description}
                  </p>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { void router.push(`/dashboard/courses/${courseId}/meet`); }}
                  className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Video className="h-5 w-5" />
                  Start Meeting
                </button>
                <button
                  onClick={() => { void router.push(`/dashboard/courses/${courseId}/chat`); }}
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
                {course.upcomingDeadlines.length > 0 ? (
                  course.upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <CheckCircle className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white">{deadline.title}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">{deadline.date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">No upcoming deadlines</div>
                )}
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
                {course.recentMaterials.length > 0 ? (
                  course.recentMaterials.map((material) => (
                    <div key={material.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                      <FileText className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white">{material.title}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">{material.date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">No materials available</div>
                )}
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

