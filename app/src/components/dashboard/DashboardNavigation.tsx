"use client";

import { motion, useMotionTemplate, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  Moon, 
  Sun, 
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  Calendar,
  CalendarDays,
  ChevronDown,
  Monitor,
  Brain,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { useTheme } from "@/providers/theme-provider";
import NotificationsPanel, { Notification } from "./NotificationsPanel";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Loader2 } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
  category?: string;
}

const navLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, category: "main" },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarDays, category: "main" },
  { href: "/dashboard/courses", label: "Courses", icon: BookOpen, category: "main" },
  { href: "/dashboard/students", label: "Students", icon: Users, category: "main" },
  { href: "/dashboard/grades", label: "Grades", icon: ClipboardCheck, category: "tools" },
  { href: "/dashboard/attendance", label: "Attendance", icon: Calendar, category: "tools" },
  { href: "/dashboard/presentations", label: "Presentations", icon: Monitor, category: "tools" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, category: "insights" },
  { href: "/dashboard/ai-insights", label: "AI Insights", icon: Brain, category: "insights" },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, category: "main" },
];

// User profile will be fetched from hook

// Mock notifications with real page links
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
];

export const DashboardNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, toggle } = useTheme();
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 80], [0.7, 0.95]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.1, 0.3]);
  const { profile, loading: profileLoading, getAvatarInitials, getDisplayName } = useUserProfile();

  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);
  const backgroundColor = useMotionTemplate`rgba(${
    isDark ? "10, 15, 31" : "255, 255, 255"
  }, ${backgroundOpacity})`;
  const borderColor = useMotionTemplate`rgba(${
    isDark ? "71, 85, 105" : "229, 231, 235"
  }, ${borderOpacity})`;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Get user info with fallbacks
  const userAvatar = profile ? getAvatarInitials(profile.full_name) : "U";
  const userDisplayName = profile ? getDisplayName(profile.full_name, true) : "Lecturer";
  const userFullName = profile?.full_name || "User";
  const userEmail = profile?.email || "";
  const userRole = profile?.role || "Lecturer";

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("lms:remember-me");
    router.push("/auth/login");
  };

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Split navigation into primary and secondary
  const primaryLinks = navLinks.filter((link) => link.category === "main");
  const secondaryLinks = navLinks.filter((link) => link.category !== "main");

  const isActive = (href: string) => {
    // Special case for dashboard: only match exact path
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    // For other routes, match if pathname starts with the href
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <motion.header
        aria-label="Dashboard Navigation"
        className="fixed inset-x-0 top-0 z-50"
        style={{
          backgroundColor,
          borderBottom: `1px solid`,
          borderColor,
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/dashboard"
              className="flex min-w-[180px] shrink-0 items-center gap-2.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-base font-bold text-white shadow-lg shadow-purple-500/30">
                LMS
              </div>
              <span className="hidden whitespace-nowrap text-lg font-bold text-neutral-900 sm:block dark:text-white">
                Lecturer System
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-all ${
                      active
                        ? "bg-purple-600/10 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden xl:inline">{link.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 -z-10 rounded-lg bg-purple-600/10 dark:bg-purple-500/10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* More Menu */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-all ${
                    moreMenuOpen
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  }`}
                >
                  <span className="hidden xl:inline">More</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${moreMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {moreMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-neutral-700 dark:bg-neutral-900/95"
                    >
                      <div className="p-2">
                        {secondaryLinks.map((link) => {
                          const Icon = link.icon;
                          const active = isActive(link.href);
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setMoreMenuOpen(false)}
                              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                active
                                  ? "bg-purple-600/10 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                                  : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex min-w-fit shrink-0 items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Notifications */}
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggle}
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 sm:flex dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* User Profile - Desktop */}
              <div className="relative hidden min-w-fit lg:block" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex min-w-fit items-center gap-2 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 transition-all hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white">
                    {profileLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : userAvatar}
                  </div>
                  <div className="hidden flex-col items-start xl:flex">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {profileLoading ? "..." : userDisplayName}
                    </span>
                    <span className="text-[10px] text-neutral-600 dark:text-neutral-400">
                      {profileLoading ? "..." : userRole}
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-neutral-600 transition-transform dark:text-neutral-400 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-white/95 shadow-xl backdrop-blur-xl dark:border-neutral-700 dark:bg-neutral-900/95"
                    >
                      <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {profileLoading ? "Loading..." : userFullName}
                        </div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {profileLoading ? "..." : userEmail}
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-neutral-200 p-2 dark:border-neutral-700">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 lg:hidden dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                      {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : userAvatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {profileLoading ? "Loading..." : userFullName}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {profileLoading ? "..." : userRole}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 transition-all hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                  <div className="space-y-1">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                            active
                              ? "bg-purple-600/10 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                              : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile Footer */}
                <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        toggle();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <span>Switch to {isDark ? "light" : "dark"} mode</span>
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-between rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <span>Settings</span>
                      <Settings className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20"
                    >
                      <span>Sign Out</span>
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3 border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
                <Search className="h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search for courses, students, or features..."
                  autoFocus
                  className="flex-1 bg-transparent text-neutral-900 placeholder-neutral-500 outline-none dark:text-white dark:placeholder-neutral-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  ESC
                </button>
              </div>
              <div className="p-6">
                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                  Start typing to search...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDeleteNotification}
      />
    </>
  );
};
