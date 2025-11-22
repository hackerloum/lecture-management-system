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
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayShortNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Time slots for the timetable
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
];

// Mock schedule data
const scheduleData = [
  {
    id: 1,
    course: "CS 101",
    title: "Introduction to Computer Science",
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    room: "Engineering 201",
    building: "Main Campus",
    students: 45,
    instructor: "Dr. Sarah Johnson",
    color: "from-blue-500 to-cyan-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 2,
    course: "CS 101",
    title: "Introduction to Computer Science",
    day: "Wednesday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    room: "Engineering 201",
    building: "Main Campus",
    students: 45,
    instructor: "Dr. Sarah Johnson",
    color: "from-blue-500 to-cyan-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 3,
    course: "CS 201",
    title: "Data Structures & Algorithms",
    day: "Tuesday",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    room: "Engineering 305",
    building: "Main Campus",
    students: 38,
    instructor: "Dr. Sarah Johnson",
    color: "from-purple-500 to-pink-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 4,
    course: "CS 201",
    title: "Data Structures & Algorithms",
    day: "Thursday",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    room: "Engineering 305",
    building: "Main Campus",
    students: 38,
    instructor: "Dr. Sarah Johnson",
    color: "from-purple-500 to-pink-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 5,
    course: "CS 301",
    title: "Database Management Systems",
    day: "Wednesday",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
    room: "Engineering 410",
    building: "Main Campus",
    students: 32,
    instructor: "Dr. Sarah Johnson",
    color: "from-green-500 to-emerald-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 6,
    course: "CS 301",
    title: "Database Management Systems",
    day: "Friday",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
    room: "Engineering 410",
    building: "Main Campus",
    students: 32,
    instructor: "Dr. Sarah Johnson",
    color: "from-green-500 to-emerald-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 7,
    course: "CS 401",
    title: "Machine Learning",
    day: "Monday",
    startTime: "03:00 PM",
    endTime: "04:30 PM",
    room: "Engineering 505",
    building: "Main Campus",
    students: 28,
    instructor: "Dr. Sarah Johnson",
    color: "from-orange-500 to-red-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 8,
    course: "CS 401",
    title: "Machine Learning",
    day: "Thursday",
    startTime: "03:00 PM",
    endTime: "04:30 PM",
    room: "Engineering 505",
    building: "Main Campus",
    students: 28,
    instructor: "Dr. Sarah Johnson",
    color: "from-orange-500 to-red-500",
    type: "Lecture",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 9,
    course: "Office Hours",
    title: "Student Consultations",
    day: "Tuesday",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    room: "Office 301",
    building: "Faculty Building",
    students: null,
    instructor: "Dr. Sarah Johnson",
    color: "from-yellow-500 to-orange-500",
    type: "Office Hours",
    recurring: true,
    semester: "Spring 2025",
  },
  {
    id: 10,
    course: "Office Hours",
    title: "Student Consultations",
    day: "Friday",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    room: "Office 301",
    building: "Faculty Building",
    students: null,
    instructor: "Dr. Sarah Johnson",
    color: "from-yellow-500 to-orange-500",
    type: "Office Hours",
    recurring: true,
    semester: "Spring 2025",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "CS 301 - Midterm Exam",
    date: "Tomorrow, 1:00 PM",
    location: "Engineering 410",
    type: "exam",
    priority: "high",
  },
  {
    id: 2,
    title: "Faculty Meeting",
    date: "Friday, 3:00 PM",
    location: "Conference Room A",
    type: "meeting",
    priority: "medium",
  },
  {
    id: 3,
    title: "CS 101 - Guest Lecture",
    date: "Next Monday, 10:00 AM",
    location: "Engineering 201",
    type: "lecture",
    priority: "medium",
  },
];

export default function SchedulePage() {
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<"week" | "list">("week");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);

  // Get current date
  const today = new Date();
  const currentDayName = daysOfWeek[today.getDay() === 0 ? 6 : today.getDay() - 1];

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
    totalStudents: [...new Set(scheduleData.filter((s) => s.students).map((s) => s.course))].reduce((acc, course) => {
      const courseData = scheduleData.find((s) => s.course === course);
      return acc + (courseData?.students || 0);
    }, 0),
    officeHours: scheduleData.filter((s) => s.type === "Office Hours").length,
  };

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
                                        href={`/dashboard/courses/${classItem.id}`}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
                                      >
                                        <BookOpen className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                                      </Link>
                                      <Link
                                        href={`/dashboard/courses/${classItem.id}/meet`}
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

