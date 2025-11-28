"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Video,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Plus,
  Bell,
  Grid3x3,
  List,
  AlertCircle,
  CheckCircle,
  Copy,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Time slots for the timetable
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
];

// Color mapping for courses
const colorMap = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-yellow-500 to-orange-500",
  "from-teal-500 to-cyan-500",
];

interface ScheduleItem {
  id: string;
  course: string;
  title: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  students: number | null;
  instructor: string;
  color: string;
  type: string;
  recurring: boolean;
  semester: string;
  courseId: string;
}

// Helper function to convert TIME to 12-hour format
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour.toString().padStart(2, "0")}:${minutes} ${period}`;
};

// Helper function to convert day_of_week (0-6, 0=Sunday) to day name
const getDayName = (dayOfWeek: number): string => {
  // Database: 0=Sunday, 1=Monday, ..., 6=Saturday
  // Our array: Monday=0, Tuesday=1, ..., Sunday=6
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Map DB day to array index
  return daysOfWeek[dayMap[dayOfWeek]] || daysOfWeek[0];
};

// Helper function to get color for course
const getCourseColor = (courseId: string, courseColor?: string): string => {
  if (courseColor) {
    // Map common color names to gradient classes
    const colorNameMap: Record<string, string> = {
      blue: "from-blue-500 to-cyan-500",
      purple: "from-purple-500 to-pink-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-500 to-red-500",
      yellow: "from-yellow-500 to-orange-500",
      indigo: "from-indigo-500 to-purple-500",
      teal: "from-teal-500 to-cyan-500",
    };
    return colorNameMap[courseColor] || colorMap[0];
  }
  // Use hash of courseId to get consistent color
  const hash = courseId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorMap[hash % colorMap.length];
};

// Helper function to format schedule type
const formatScheduleType = (type: string): string => {
  const typeMap: Record<string, string> = {
    lecture: "Lecture",
    lab: "Lab Session",
    tutorial: "Tutorial",
    office_hours: "Office Hours",
    exam: "Exam",
    meeting: "Meeting",
  };
  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

export default function SchedulePage() {
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<"week" | "list">("week");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  // Get current date
  const today = new Date();
  const currentDayName = daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];

  // Fetch schedule data from database
  useEffect(() => {
    async function fetchScheduleData() {
      try {
        setLoading(true);
        setError(null);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch courses where user is a collaborator
        const { data: collaboratorData, error: collaboratorError } = await supabase
          .from("course_collaborators")
          .select("course_id")
          .eq("profile_id", user.id);

        if (collaboratorError) {
          throw new Error("Failed to fetch courses");
        }

        const courseIds = collaboratorData?.map((c) => c.course_id) || [];

        if (courseIds.length === 0) {
          setScheduleData([]);
          setUpcomingEvents([]);
          setLoading(false);
          return;
        }

        // Fetch schedules for these courses
        const { data: schedules, error: schedulesError } = await supabase
          .from("schedules")
          .select(`
            id,
            course_id,
            day_of_week,
            start_time,
            end_time,
            room,
            building,
            type,
            recurring,
            instructor_id,
            courses (
              id,
              code,
              name,
              color,
              semester,
              year
            )
          `)
          .in("course_id", courseIds)
          .order("day_of_week", { ascending: true })
          .order("start_time", { ascending: true });

        // Fetch instructor profiles separately
        const instructorIds = [...new Set((schedules || []).map((s: any) => s.instructor_id).filter(Boolean))];
        const instructorProfiles = new Map<string, { full_name: string }>();
        
        if (instructorIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", instructorIds);

          if (!profilesError && profiles) {
            profiles.forEach((profile) => {
              instructorProfiles.set(profile.id, { full_name: profile.full_name });
            });
          }
        }

        if (schedulesError) {
          throw new Error("Failed to fetch schedules");
        }

        // Fetch student counts for each course
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from("course_enrollments")
          .select("course_id, student_id")
          .in("course_id", courseIds)
          .eq("status", "active");

        if (enrollmentsError) {
          console.error("Error fetching enrollments:", enrollmentsError);
        }

        // Count students per course
        const studentCounts = new Map<string, number>();
        enrollments?.forEach((enrollment) => {
          const count = studentCounts.get(enrollment.course_id) || 0;
          studentCounts.set(enrollment.course_id, count + 1);
        });

        // Transform database data to UI format
        const transformedSchedules: ScheduleItem[] = (schedules || []).map((schedule: any) => {
          const course = schedule.courses;
          const instructor = schedule.instructor_id ? instructorProfiles.get(schedule.instructor_id) : null;
          const studentCount = studentCounts.get(schedule.course_id) || null;

          return {
            id: schedule.id,
            course: course?.code || "Unknown",
            title: course?.name || "Unknown Course",
            day: getDayName(schedule.day_of_week),
            startTime: formatTime(schedule.start_time),
            endTime: formatTime(schedule.end_time),
            room: schedule.room || "TBA",
            building: schedule.building || "",
            students: schedule.type === "office_hours" ? null : studentCount,
            instructor: instructor?.full_name || "TBA",
            color: getCourseColor(schedule.course_id, course?.color),
            type: formatScheduleType(schedule.type),
            recurring: schedule.recurring ?? true,
            semester: course ? `${course.semester} ${course.year}` : "",
            courseId: schedule.course_id,
          };
        });

        setScheduleData(transformedSchedules);

        // Generate upcoming events from schedules
        const events: any[] = [];
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        transformedSchedules.forEach((schedule) => {
          const scheduleDayIndex = daysOfWeek.indexOf(schedule.day);
          const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
          const daysUntil = (scheduleDayIndex - currentDayIndex + 7) % 7;

          if (daysUntil <= 7) {
            const eventDate = new Date(now);
            eventDate.setDate(now.getDate() + daysUntil);

            let dateLabel = "";
            if (daysUntil === 0) {
              dateLabel = "Today";
            } else if (daysUntil === 1) {
              dateLabel = "Tomorrow";
            } else {
              dateLabel = schedule.day;
            }

            events.push({
              id: schedule.id,
              title: `${schedule.course} - ${schedule.type}`,
              date: `${dateLabel}, ${schedule.startTime}`,
              location: schedule.room,
              type: schedule.type.toLowerCase(),
              priority: schedule.type === "Exam" ? "high" : "medium",
            });
          }
        });

        setUpcomingEvents(events.slice(0, 5)); // Limit to 5 events
        setLoading(false);
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        setError(err instanceof Error ? err.message : "Failed to load schedule");
        setLoading(false);
      }
    }

    void fetchScheduleData();
  }, []);

  // Helper to convert time to 24-hour format for comparison
  const timeTo24Hour = (time: string) => {
    const [timePart, period] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Calculate time slot position
  const getTimeSlotPosition = (startTime: string, endTime: string) => {
    const dayStart = timeTo24Hour("08:00 AM");
    const classStart = timeTo24Hour(startTime);
    const classEnd = timeTo24Hour(endTime);
    
    const topPosition = ((classStart - dayStart) / 60) * 80; // 80px per hour
    const height = ((classEnd - classStart) / 60) * 80;
    
    return { top: topPosition, height };
  };

  // Filter schedule by day
  const getScheduleForDay = (day: string) => {
    return scheduleData.filter((item) => item.day === day);
  };

  // Get classes for a specific day
  const getDayClasses = (day: string) => {
    return scheduleData.filter((item) => item.day === day);
  };

  // Calculate weekly stats
  const weeklyStats = {
    totalClasses: scheduleData.filter((s) => s.type === "Lecture").length,
    totalHours: scheduleData.reduce((acc, item) => {
      const duration = (timeTo24Hour(item.endTime) - timeTo24Hour(item.startTime)) / 60;
      return acc + duration;
    }, 0),
    totalStudents: [...new Set(scheduleData.filter((s) => s.students).map((s) => s.courseId))].reduce((acc, courseId) => {
      const courseData = scheduleData.find((s) => s.courseId === courseId && s.students);
      return acc + (courseData?.students || 0);
    }, 0),
    officeHours: scheduleData.filter((s) => s.type === "Office Hours").length,
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:py-32">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Loading schedule...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:py-32">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            <p className="text-lg text-neutral-600 dark:text-neutral-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
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
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                  📅 My Schedule
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 rounded-xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <button
                    onClick={() => setViewMode("week")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      viewMode === "week"
                        ? "bg-purple-600 text-white"
                        : "text-neutral-700 hover:bg-white/10 dark:text-neutral-300"
                    }`}
                  >
                    <Grid3x3 className="h-4 w-4" />
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      viewMode === "list"
                        ? "bg-purple-600 text-white"
                        : "text-neutral-700 hover:bg-white/10 dark:text-neutral-300"
                    }`}
                  >
                    <List className="h-4 w-4" />
                    List
                  </button>
                </div>

                <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                  <Download className="h-4 w-4" />
                  Export
                </button>

                <Link
                  href="/dashboard/schedule/create"
                  className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Weekly Stats */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 grid gap-6 sm:grid-cols-4"
          >
            {[
              { label: "Classes This Week", value: weeklyStats.totalClasses, icon: BookOpen, color: "from-blue-500 to-cyan-500" },
              { label: "Teaching Hours", value: `${weeklyStats.totalHours}h`, icon: Clock, color: "from-purple-500 to-pink-500" },
              { label: "Total Students", value: weeklyStats.totalStudents, icon: Users, color: "from-green-500 to-emerald-500" },
              { label: "Office Hours", value: weeklyStats.officeHours, icon: Calendar, color: "from-orange-500 to-yellow-500" },
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
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Schedule Area */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {viewMode === "week" ? (
                  <motion.div
                    key="week"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
                      Weekly Timetable
                    </h2>

                    {/* Timetable Grid */}
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        {/* Days Header */}
                        <div className="mb-4 grid grid-cols-8 gap-2">
                          <div className="text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                            Time
                          </div>
                          {daysOfWeek.slice(0, 5).map((day, index) => (
                            <div
                              key={day}
                              className={`rounded-xl border p-3 text-center ${
                                day === currentDayName
                                  ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                                  : "border-white/10 bg-white/5 dark:border-white/10 dark:bg-white/5"
                              }`}
                            >
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {dayShortNames[index]}
                              </div>
                              <div className={`mt-1 text-sm font-bold ${
                                day === currentDayName
                                  ? "text-purple-600 dark:text-purple-400"
                                  : "text-neutral-900 dark:text-white"
                              }`}>
                                {day}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Timetable */}
                        <div className="relative">
                          {/* Time Grid */}
                          <div className="grid grid-cols-8 gap-2">
                            {/* Time Column */}
                            <div className="space-y-2">
                              {timeSlots.map((time, idx) => (
                                <div
                                  key={idx}
                                  className="flex h-[80px] items-start justify-end pr-2 text-xs font-medium text-neutral-600 dark:text-neutral-400"
                                >
                                  {time}
                                </div>
                              ))}
                            </div>

                            {/* Days Columns */}
                            {daysOfWeek.slice(0, 5).map((day) => (
                              <div key={day} className="relative">
                                {/* Time Slots Background */}
                                {timeSlots.map((_, idx) => (
                                  <div
                                    key={idx}
                                    className="h-[80px] border-b border-white/10 dark:border-white/5"
                                  />
                                ))}

                                {/* Classes */}
                                <div className="absolute inset-0">
                                  {getDayClasses(day).map((classItem) => {
                                    const { top, height } = getTimeSlotPosition(
                                      classItem.startTime,
                                      classItem.endTime
                                    );
                                    return (
                                      <motion.div
                                        key={classItem.id}
                                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                                        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        style={{
                                          top: `${top}px`,
                                          height: `${height}px`,
                                        }}
                                        className="group absolute left-0 right-0 overflow-hidden rounded-lg border border-white/20 backdrop-blur-sm"
                                      >
                                        <div className={`h-full bg-gradient-to-br ${classItem.color} p-2 opacity-90 transition hover:opacity-100`}>
                                          <div className="flex h-full flex-col justify-between">
                                            <div>
                                              <div className="mb-1 text-xs font-bold text-white">
                                                {classItem.course}
                                              </div>
                                              <div className="mb-1 line-clamp-2 text-xs text-white/90">
                                                {classItem.title}
                                              </div>
                                            </div>
                                            <div className="text-xs text-white/80">
                                              {classItem.room}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-4"
                  >
                    {daysOfWeek.slice(0, 5).map((day, dayIndex) => {
                      const dayClasses = getDayClasses(day);
                      if (dayClasses.length === 0) return null;

                      return (
                        <motion.div
                          key={day}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 + dayIndex * 0.1 }}
                          className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                        >
                          <h3 className={`mb-4 text-xl font-bold ${
                            day === currentDayName
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-neutral-900 dark:text-white"
                          }`}>
                            {day}
                            {day === currentDayName && (
                              <span className="ml-2 rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white">
                                Today
                              </span>
                            )}
                          </h3>
                          <div className="space-y-3">
                            {dayClasses.map((classItem, idx) => (
                              <motion.div
                                key={classItem.id}
                                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + dayIndex * 0.1 + idx * 0.05 }}
                                className="group overflow-hidden rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
                              >
                                <div className={`h-1 bg-gradient-to-r ${classItem.color}`} />
                                <div className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="mb-2 flex items-center gap-2">
                                        <div className={`rounded-lg bg-gradient-to-br ${classItem.color} px-3 py-1 text-sm font-bold text-white`}>
                                          {classItem.course}
                                        </div>
                                        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                          {classItem.type}
                                        </span>
                                      </div>
                                      <h4 className="mb-3 font-bold text-neutral-900 dark:text-white">
                                        {classItem.title}
                                      </h4>
                                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4" />
                                          {classItem.startTime} - {classItem.endTime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-4 w-4" />
                                          {classItem.room}
                                        </div>
                                        {classItem.students && (
                                          <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {classItem.students} students
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Link
                                        href={`/dashboard/courses/${classItem.courseId}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
                                      >
                                        <BookOpen className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                      </Link>
                                      <Link
                                        href={`/dashboard/courses/${classItem.courseId}/meet`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
                                      >
                                        <Video className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar - Upcoming Events */}
            <div className="space-y-8">
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-white">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 dark:bg-white/5"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {event.title}
                        </h3>
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                          event.priority === "high"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {event.priority}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "Print Schedule", icon: Download, href: "#" },
                    { label: "Share Calendar", icon: Copy, href: "#" },
                    { label: "Sync with Google", icon: Calendar, href: "#" },
                  ].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        href={action.href}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 dark:bg-white/5"
                      >
                        <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {action.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

