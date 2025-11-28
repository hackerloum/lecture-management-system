"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  avgPerformance: number;
  attendanceRate: number;
}

interface TodaySchedule {
  id: string;
  courseId: string;
  course: string;
  title: string;
  time: string;
  room: string;
  students: number;
  status: string;
  color: string;
}

interface UpcomingDeadline {
  id: string;
  title: string;
  dueDate: string;
  submissions: string;
  percentage: number;
  priority: string;
}

interface RecentSubmission {
  student: string;
  course: string;
  assignment: string;
  grade: number;
  time: string;
  avatar: string;
}

interface CourseOverview {
  id: string;
  code: string;
  name: string;
  students: number;
  avgGrade: number;
  attendance: number;
  pending: number;
  color: string;
  trend: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const colorMap = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
];

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [coursesOverview, setCoursesOverview] = useState<CourseOverview[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email, role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          throw new Error("Failed to fetch profile");
        }

        setProfile(profileData);

        // Fetch courses where user is a collaborator
        const { data: courses, error: coursesError } = await supabase
          .from("course_collaborators")
          .select(`
            course_id,
            courses (
              id,
              code,
              name,
              room,
              semester,
              year
            )
          `)
          .eq("profile_id", user.id);

        if (coursesError) {
          console.error("Courses error:", coursesError);
        }

        const courseIds = courses?.map((c: any) => c.courses.id) || [];

        if (courseIds.length === 0) {
          // No courses, return empty data
          setStats({
            totalStudents: 0,
            activeCourses: 0,
            avgPerformance: 0,
            attendanceRate: 0,
          });
          setLoading(false);
          return;
        }

        // Fetch total students across all courses
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from("course_enrollments")
          .select("student_id, course_id, status")
          .in("course_id", courseIds)
          .eq("status", "active");

        const totalStudents = new Set(enrollments?.map((e) => e.student_id) || []).size;

        // Fetch active courses count
        const { data: activeCoursesData, error: activeCoursesError } = await supabase
          .from("courses")
          .select("id")
          .in("id", courseIds)
          .eq("status", "active");

        const activeCourses = activeCoursesData?.length || 0;

        // Calculate average performance from student progress
        const { data: progressData, error: progressError } = await supabase
          .from("student_progress")
          .select("current_grade")
          .in("course_id", courseIds)
          .not("current_grade", "is", null);

        const avgPerformance =
          progressData && progressData.length > 0
            ? progressData.reduce((sum: number, p: any) => sum + (p.current_grade || 0), 0) /
              progressData.length
            : 0;

        // Calculate attendance rate
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("student_progress")
          .select("attendance_percentage")
          .in("course_id", courseIds)
          .not("attendance_percentage", "is", null);

        const attendanceRate =
          attendanceData && attendanceData.length > 0
            ? attendanceData.reduce((sum: number, a: any) => sum + (a.attendance_percentage || 0), 0) /
              attendanceData.length
            : 0;

        setStats({
          totalStudents,
          activeCourses,
          avgPerformance: Math.round(avgPerformance * 10) / 10,
          attendanceRate: Math.round(attendanceRate * 10) / 10,
        });

        // Fetch today's schedule
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

        const { data: schedules, error: schedulesError } = await supabase
          .from("schedules")
          .select(`
            id,
            day_of_week,
            start_time,
            end_time,
            room,
            courses (
              id,
              code,
              name
            )
          `)
          .in("course_id", courseIds)
          .eq("day_of_week", dayOfWeek);

        if (!schedulesError && schedules) {
          const scheduleItems: TodaySchedule[] = schedules.map((schedule: any, index: number) => {
            const course = schedule.courses;
            const startTime = new Date(`2000-01-01T${schedule.start_time}`);
            const endTime = new Date(`2000-01-01T${schedule.end_time}`);
            
            // Get enrollment count for this course
            const courseEnrollments = enrollments?.filter((e) => e.course_id === course.id) || [];
            
            return {
              id: schedule.id,
              courseId: course.id,
              course: course.code,
              title: course.name,
              time: `${startTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })} - ${endTime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}`,
              room: schedule.room || course.room || "TBD",
              students: courseEnrollments.length,
              status: "upcoming",
              color: colorMap[index % colorMap.length],
            };
          });

          // Sort by start time
          scheduleItems.sort((a, b) => {
            const timeA = a.time.split(" - ")[0];
            const timeB = b.time.split(" - ")[0];
            return timeA.localeCompare(timeB);
          });

          setTodaySchedule(scheduleItems);
        }

        // Fetch upcoming deadlines (assignments due in next 7 days)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const { data: assignments, error: assignmentsError } = await supabase
          .from("assignments")
          .select(`
            id,
            title,
            due_date,
            courses (
              code
            )
          `)
          .in("course_id", courseIds)
          .eq("status", "published")
          .gte("due_date", new Date().toISOString())
          .lte("due_date", sevenDaysFromNow.toISOString())
          .order("due_date", { ascending: true })
          .limit(5);

        if (!assignmentsError && assignments) {
          const deadlines: UpcomingDeadline[] = await Promise.all(
            assignments.map(async (assignment: any) => {
              // Count submissions
              const { data: submissions, error: subsError } = await supabase
                .from("submissions")
                .select("id")
                .eq("assignment_id", assignment.id)
                .eq("status", "submitted");

              const { data: enrollmentsCount } = await supabase
                .from("course_enrollments")
                .select("id")
                .eq("course_id", assignment.courses?.id || "")
                .eq("status", "active");

              const submissionsCount = submissions?.length || 0;
              const totalStudents = enrollmentsCount?.length || 1;
              const percentage = (submissionsCount / totalStudents) * 100;

              const dueDate = new Date(assignment.due_date);
              const now = new Date();
              const daysUntilDue = Math.ceil(
                (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
              );

              let dueDateText = "";
              if (daysUntilDue === 0) {
                dueDateText = "Today, " + dueDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
              } else if (daysUntilDue === 1) {
                dueDateText = "Tomorrow, " + dueDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
              } else {
                dueDateText = `In ${daysUntilDue} days`;
              }

              return {
                id: assignment.id,
                title: `${assignment.courses?.code || ""} - ${assignment.title}`,
                dueDate: dueDateText,
                submissions: `${submissionsCount}/${totalStudents}`,
                percentage: Math.round(percentage * 10) / 10,
                priority: daysUntilDue <= 1 ? "high" : "medium",
              };
            }),
          );

          setUpcomingDeadlines(deadlines);
        }

        // Fetch recent submissions (graded in last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: recentGrades, error: gradesError } = await supabase
          .from("grades")
          .select(`
            id,
            percentage,
            graded_at,
            student_id,
            submissions (
              assignment_id,
              submitted_at,
              assignments (
                title,
                courses (
                  code
                )
              )
            )
          `)
          .in("course_id", courseIds)
          .gte("graded_at", yesterday.toISOString())
          .order("graded_at", { ascending: false })
          .limit(4);

        if (!gradesError && recentGrades && recentGrades.length > 0) {
          // Fetch student profiles for the grades
          const studentIds = recentGrades.map((g: any) => g.student_id).filter(Boolean);
          
          const { data: studentProfiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", studentIds);

          const profilesMap = new Map(
            studentProfiles?.map((p: any) => [p.id, p.full_name]) || []
          );

          const submissions: RecentSubmission[] = recentGrades.map((grade: any) => {
            const submission = grade.submissions;
            const assignment = submission?.assignments;
            const studentName = profilesMap.get(grade.student_id) || "Unknown";
            const gradedAt = new Date(grade.graded_at || submission?.submitted_at || new Date());

            const timeDiff = Date.now() - gradedAt.getTime();
            const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutesAgo = Math.floor(timeDiff / (1000 * 60));

            let timeText = "";
            if (minutesAgo < 60) {
              timeText = `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
            } else if (hoursAgo < 24) {
              timeText = `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
            } else {
              timeText = `${Math.floor(hoursAgo / 24)} day${Math.floor(hoursAgo / 24) !== 1 ? "s" : ""} ago`;
            }

            const nameParts = studentName.split(" ");
            const avatar = nameParts.length >= 2
              ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
              : nameParts[0]?.[0]?.toUpperCase() || "U";

            return {
              student: studentName,
              course: assignment?.courses?.code || "",
              assignment: assignment?.title || "",
              grade: Math.round(grade.percentage || 0),
              time: timeText,
              avatar,
            };
          });

          setRecentSubmissions(submissions);
        }

        // Fetch courses overview
        const { data: coursesData, error: coursesDataError } = await supabase
          .from("courses")
          .select(`
            id,
            code,
            name,
            course_enrollments (
              student_id,
              status
            ),
            student_progress (
              current_grade,
              attendance_percentage
            ),
            assignments (
              id,
              submissions (
                id,
                status
              )
            )
          `)
          .in("id", courseIds)
          .eq("status", "active");

        if (!coursesDataError && coursesData) {
          const overview: CourseOverview[] = coursesData.map((course: any, index: number) => {
            const activeEnrollments = course.course_enrollments?.filter(
              (e: any) => e.status === "active",
            ) || [];
            const students = activeEnrollments.length;

            const grades = course.student_progress
              ?.map((p: any) => p.current_grade)
              .filter((g: any) => g != null) || [];
            const avgGrade =
              grades.length > 0
                ? grades.reduce((sum: number, g: number) => sum + g, 0) / grades.length
                : 0;

            const attendances = course.student_progress
              ?.map((p: any) => p.attendance_percentage)
              .filter((a: any) => a != null) || [];
            const attendance =
              attendances.length > 0
                ? attendances.reduce((sum: number, a: number) => sum + a, 0) / attendances.length
                : 0;

            // Count pending submissions (submitted but not graded)
            const allSubmissions = course.assignments?.flatMap((a: any) => a.submissions || []) || [];
            const pending = allSubmissions.filter(
              (s: any) => s.status === "submitted",
            ).length;

            return {
              id: course.id,
              code: course.code,
              name: course.name,
              students,
              avgGrade: Math.round(avgGrade * 10) / 10,
              attendance: Math.round(attendance * 10) / 10,
              pending,
              color: colorMap[index % colorMap.length],
              trend: "up",
            };
          });

          setCoursesOverview(overview);
        }

        setLoading(false);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return {
    loading,
    error,
    profile,
    stats,
    todaySchedule,
    upcomingDeadlines,
    recentSubmissions,
    coursesOverview,
  };
}

