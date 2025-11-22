"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Trash2,
  Bell,
  MessageSquare,
  Award,
  Calendar,
  AlertCircle,
  BookOpen,
  Users,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Notification {
  id: string;
  type: "message" | "grade" | "attendance" | "assignment" | "alert" | "achievement" | "course";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  link: string; // The page to navigate to
  icon?: React.ElementType;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

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

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400";
    case "medium":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400";
    case "low":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400";
    default:
      return "bg-neutral-500/10 text-neutral-600 border-neutral-500/20 dark:text-neutral-400";
  }
};

export default function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsPanelProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((notif) =>
    filter === "unread" ? !notif.read : true
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    // Close panel
    onClose();
    // Navigate to the page
    router.push(notification.link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-4 top-20 z-50 w-full max-w-md"
          >
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-neutral-700 dark:bg-neutral-900/95">
              {/* Header */}
              <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Notifications
                    </h2>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  {/* Filter Tabs */}
                  <div className="flex flex-1 gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-800">
                    <button
                      onClick={() => setFilter("all")}
                      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        filter === "all"
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setFilter("unread")}
                      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                        filter === "unread"
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  {/* Mark All as Read */}
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      title="Mark all as read"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mark all
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Bell className="mb-3 h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                      {filter === "unread" ? "No unread notifications" : "No notifications"}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                      {filter === "unread"
                        ? "You're all caught up!"
                        : "New notifications will appear here"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {filteredNotifications.map((notification, index) => {
                      const Icon = notification.icon || getNotificationIcon(notification.type);
                      const color = getNotificationColor(notification.type);

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`group relative ${
                            notification.read ? "bg-transparent" : "bg-blue-50/50 dark:bg-blue-950/10"
                          }`}
                        >
                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600" />
                          )}

                          {/* Notification Content - Clickable */}
                          <button
                            onClick={() => handleNotificationClick(notification)}
                            className="w-full px-6 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                          >
                            <div className="flex gap-3">
                              {/* Icon */}
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="mb-1 flex items-start justify-between gap-2">
                                  <h3 className={`text-sm font-semibold ${
                                    notification.read
                                      ? "text-neutral-700 dark:text-neutral-300"
                                      : "text-neutral-900 dark:text-white"
                                  }`}>
                                    {notification.title}
                                  </h3>
                                  {notification.priority !== "low" && (
                                    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${getPriorityBadge(notification.priority)}`}>
                                      {notification.priority}
                                    </span>
                                  )}
                                </div>
                                <p className="mb-2 text-xs text-neutral-600 dark:text-neutral-400">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-500">
                                    <Clock className="h-3 w-3" />
                                    {notification.time}
                                  </div>
                                  <div className="text-[10px] text-neutral-400 dark:text-neutral-600">•</div>
                                  <div className="text-[10px] text-blue-600 dark:text-blue-400">
                                    Click to view →
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>

                          {/* Actions - Visible on hover */}
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-green-600 shadow-sm transition hover:bg-green-50 dark:bg-neutral-800 dark:text-green-400 dark:hover:bg-green-950/20"
                                title="Mark as read"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(notification.id);
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm transition hover:bg-red-50 dark:bg-neutral-800 dark:text-red-400 dark:hover:bg-red-950/20"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-neutral-200 px-6 py-3 dark:border-neutral-800">
                  <Link
                    href="/dashboard/notifications"
                    onClick={onClose}
                    className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    View all notifications
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

