"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Plus,
  X,
  Save,
  Copy,
  AlertCircle,
  Video,
  Bell,
  Repeat,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

const eventTypes = [
  { value: "lecture", label: "Lecture", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
  { value: "lab", label: "Lab Session", icon: BookOpen, color: "from-purple-500 to-pink-500" },
  { value: "office-hours", label: "Office Hours", icon: Users, color: "from-yellow-500 to-orange-500" },
  { value: "meeting", label: "Meeting", icon: Video, color: "from-green-500 to-emerald-500" },
  { value: "exam", label: "Exam", icon: AlertCircle, color: "from-red-500 to-pink-500" },
  { value: "other", label: "Other", icon: Tag, color: "from-neutral-500 to-neutral-600" },
];

const colorOptions = [
  { label: "Blue", value: "from-blue-500 to-cyan-500", preview: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  { label: "Purple", value: "from-purple-500 to-pink-500", preview: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { label: "Green", value: "from-green-500 to-emerald-500", preview: "bg-gradient-to-r from-green-500 to-emerald-500" },
  { label: "Orange", value: "from-orange-500 to-red-500", preview: "bg-gradient-to-r from-orange-500 to-red-500" },
  { label: "Yellow", value: "from-yellow-500 to-orange-500", preview: "bg-gradient-to-r from-yellow-500 to-orange-500" },
  { label: "Pink", value: "from-pink-500 to-rose-500", preview: "bg-gradient-to-r from-pink-500 to-rose-500" },
  { label: "Indigo", value: "from-indigo-500 to-purple-500", preview: "bg-gradient-to-r from-indigo-500 to-purple-500" },
  { label: "Teal", value: "from-teal-500 to-cyan-500", preview: "bg-gradient-to-r from-teal-500 to-cyan-500" },
];

const daysOfWeek = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

const recurrenceOptions = [
  { value: "once", label: "One-time event" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

export default function CreateEventPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [eventType, setEventType] = useState("lecture");
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:30");
  const [location, setLocation] = useState("");
  const [building, setBuilding] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [recurrence, setRecurrence] = useState("weekly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [enableReminder, setEnableReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("15");
  const [notes, setNotes] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Event created:", {
      eventType,
      title,
      courseCode,
      description,
      selectedDays,
      startTime,
      endTime,
      location,
      building,
      maxStudents,
      selectedColor,
      recurrence,
      startDate,
      endDate,
      enableReminder,
      reminderTime,
      notes,
    });

    setIsSaving(false);
    router.push("/dashboard/schedule");
  };

  const getEventTypeData = () => {
    return eventTypes.find((type) => type.value === eventType) || eventTypes[0];
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
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href="/dashboard/schedule"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Schedule
            </Link>
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Create New Event
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Add a new class, meeting, or event to your schedule
            </p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Form */}
              <div className="space-y-6 lg:col-span-2">
                {/* Event Type Selection */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                    Event Type
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {eventTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setEventType(type.value)}
                          className={`group relative overflow-hidden rounded-2xl border p-4 transition ${
                            eventType === type.value
                              ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                              : "border-white/20 bg-white/5 hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
                          }`}
                        >
                          <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${type.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {type.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Basic Information */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                    Basic Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Course Code
                        </label>
                        <input
                          type="text"
                          value={courseCode}
                          onChange={(e) => setCourseCode(e.target.value)}
                          placeholder="e.g., CS 101"
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Max Students
                        </label>
                        <input
                          type="number"
                          value={maxStudents}
                          onChange={(e) => setMaxStudents(e.target.value)}
                          placeholder="Optional"
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Introduction to Computer Science"
                        required
                        className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the event..."
                        rows={3}
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Schedule */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                    Schedule
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Days of Week <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleDay(day.value)}
                            className={`rounded-xl border p-3 text-center transition ${
                              selectedDays.includes(day.value)
                                ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                                : "border-white/20 bg-white/5 hover:bg-white/10 dark:border-white/10 dark:bg-white/5"
                            }`}
                          >
                            <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                              {day.short}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Recurrence
                      </label>
                      <select
                        value={recurrence}
                        onChange={(e) => setRecurrence(e.target.value)}
                        className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                      >
                        {recurrenceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                    Location
                  </h2>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Room/Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g., Engineering 201"
                          required
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Building
                        </label>
                        <input
                          type="text"
                          value={building}
                          onChange={(e) => setBuilding(e.target.value)}
                          placeholder="e.g., Main Campus"
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Color Selection */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                    Calendar Color
                  </h2>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`relative h-10 w-10 rounded-xl transition ${
                          selectedColor === color.value
                            ? "ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-neutral-900"
                            : ""
                        }`}
                      >
                        <div className={`h-full w-full rounded-xl ${color.preview}`} />
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Reminder */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                    Reminder
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enableReminder}
                        onChange={(e) => setEnableReminder(e.target.checked)}
                        className="h-5 w-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                      />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        Enable reminder
                      </span>
                    </label>
                    {enableReminder && (
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Remind me before
                        </label>
                        <select
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                        >
                          <option value="5">5 minutes</option>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="1440">1 day</option>
                        </select>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Notes */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                    Additional Notes
                  </h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information..."
                    rows={4}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-3"
                >
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Event
                      </>
                    )}
                  </button>
                  <Link
                    href="/dashboard/schedule"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Link>
                </motion.div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

