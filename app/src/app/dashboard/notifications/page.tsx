"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Check,
  CheckCircle,
  Trash2,
  Search,
  RefreshCw,
  MessageSquare,
  Award,
  Calendar,
  AlertCircle,
  BookOpen,
  TrendingUp,
  FileText,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

interface Notification {
  id: string;
  type: "message" | "grade" | "attendance" | "assignment" | "alert" | "achievement" | "course";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  link: string;
}

// Mock notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "assignment",
    title: "New Assignment Submission",
    message: "Emily Chen submitted Assignment 5 for CS 301",
    time: "5 minutes ago",
    read: false,
    priority: "high",
    link: "/dashboard/grades",
  },
  {
    id: "2",
    type: "attendance",
    title: "Low Attendance Alert",
    message: "John Smith has been absent for 3 consecutive classes in CS 201",
    time: "1 hour ago",
    read: false,
    priority: "high",
    link: "/dashboard/attendance",
  },
  {
    id: "3",
    type: "message",
    title: "New Message from Student",
    message: "David Lee sent you a message about the midterm exam",
    time: "2 hours ago",
    read: false,
    priority: "medium",
    link: "/dashboard/messages",
  },
  {
    id: "4",
    type: "grade",
    title: "Grading Deadline Approaching",
    message: "3 assignments need to be graded by tomorrow for CS 101",
    time: "3 hours ago",
    read: false,
    priority: "high",
    link: "/dashboard/grades",
  },
  {
    id: "5",
    type: "achievement",
    title: "Student Achievement",
    message: "Lisa Park achieved a perfect score on Quiz 4",
    time: "5 hours ago",
    read: false,
    priority: "low",
    link: "/dashboard/students/5",
  },
  {
    id: "6",
    type: "course",
    title: "Course Material Updated",
    message: "New lecture notes added to CS 301 - Database Systems",
    time: "1 day ago",
    read: true,
    priority: "medium",
    link: "/dashboard/courses/3",
  },
  {
    id: "7",
    type: "alert",
    title: "System Maintenance",
    message: "Platform will be under maintenance on Saturday, 2 AM - 4 AM",
    time: "2 days ago",
    read: true,
    priority: "medium",
    link: "/dashboard",
  },
  {
    id: "8",
    type: "message",
    title: "New Message from Student",
    message: "Sarah Johnson asked about office hours availability",
    time: "3 days ago",
    read: true,
    priority: "low",
    link: "/dashboard/messages",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return MessageSquare;
    case "grade":
      return Award;
    case "attendance":
      return Calendar;
    case "assignment":
      return FileText;
    case "alert":
      return AlertCircle;
    case "achievement":
      return TrendingUp;
    case "course":
      return BookOpen;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "message":
      return "from-blue-500 to-cyan-500";
    case "grade":
      return "from-green-500 to-emerald-500";
    case "attendance":
      return "from-orange-500 to-yellow-500";
    case "assignment":
      return "from-purple-500 to-pink-500";
    case "alert":
      return "from-red-500 to-pink-500";
    case "achievement":
      return "from-yellow-500 to-orange-500";
    case "course":
      return "from-blue-500 to-purple-500";
    default:
      return "from-neutral-500 to-neutral-600";
  }
};

export default function NotificationsPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter = filter === "all" || (filter === "unread" && !notif.read) || notif.type === filter;
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    router.push(notification.link);
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                  🔔 Notifications
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark all as read
                  </button>
                )}
                <button className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto">
                {["all", "unread", "message", "grade", "attendance", "assignment"].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      filter === filterType
                        ? "bg-purple-600 text-white"
                        : "border border-white/20 text-neutral-700 hover:bg-white/10 dark:border-white/10 dark:text-neutral-300"
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-12 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <Bell className="mx-auto mb-4 h-16 w-16 text-neutral-300 dark:text-neutral-600" />
                <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">
                  No notifications found
                </p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                  {filter === "unread"
                    ? "You're all caught up!"
                    : "Try adjusting your filters"}
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const color = getNotificationColor(notification.type);

                return (
                  <motion.div
                    key={notification.id}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                    className={`group relative overflow-hidden rounded-3xl border border-white/20 backdrop-blur-sm transition hover:shadow-lg dark:border-white/10 ${
                      notification.read
                        ? "bg-white/10 dark:bg-white/5"
                        : "bg-blue-50/70 dark:bg-blue-950/20"
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-blue-600" />
                    )}

                    {/* Content */}
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="w-full px-6 py-6 text-left transition hover:bg-white/10 dark:hover:bg-white/5"
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex items-start justify-between gap-4">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {notification.priority !== "low" && (
                              <span className={`shrink-0 rounded border px-2 py-0.5 text-xs font-bold uppercase ${
                                notification.priority === "high"
                                  ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                                  : "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                              }`}>
                                {notification.priority}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
                            <Clock className="h-3.5 w-3.5" />
                            {notification.time}
                            <span>•</span>
                            <span className="text-blue-600 dark:text-blue-400">Click to view →</span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Actions */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500 text-white shadow-lg transition hover:bg-green-600"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg transition hover:bg-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

