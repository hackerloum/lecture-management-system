"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  Key,
  Smartphone,
  Save,
  Camera,
  Edit,
} from "lucide-react";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export default function SettingsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications" | "security" | "privacy">("profile");

  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    title: "Professor",
    department: "Computer Science",
    bio: "Experienced educator with a passion for computer science and software engineering.",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email: {
      newStudent: true,
      assignmentSubmission: true,
      gradeUpdate: false,
      attendanceAlert: true,
      systemUpdates: false,
    },
    push: {
      newStudent: false,
      assignmentSubmission: true,
      gradeUpdate: true,
      attendanceAlert: true,
      systemUpdates: true,
    },
  });

  // Security state
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-15",
  });

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "privacy" as const, label: "Privacy", icon: Lock },
  ];

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving settings...");
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

      <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
                Settings
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Manage your account settings and preferences
              </p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-2 overflow-x-auto rounded-3xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "text-neutral-700 hover:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                        Profile Information
                      </h2>

                      {/* Avatar Section */}
                      <div className="mb-8 flex items-center gap-6">
                        <div className="relative">
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-2xl font-bold text-white">
                            {profile.firstName[0]}
                            {profile.lastName[0]}
                          </div>
                          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-white transition hover:bg-purple-700 dark:border-neutral-800">
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {profile.title} • {profile.department}
                          </p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Phone
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                          />
                        </div>
                        <div>
                          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Title
                          </label>
                          <input
                            id="title"
                            type="text"
                            value={profile.title}
                            onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                          />
                        </div>
                        <div>
                          <label htmlFor="department" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Department
                          </label>
                          <input
                            id="department"
                            type="text"
                            value={profile.department}
                            onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                            className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          rows={4}
                          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="space-y-8">
                    <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                      Preferences
                    </h2>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="theme" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Theme
                        </label>
                        <select
                          id="theme"
                          value={preferences.theme}
                          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                          className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="language" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Language
                        </label>
                        <select
                          id="language"
                          value={preferences.language}
                          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                          className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="timezone" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Timezone
                        </label>
                        <select
                          id="timezone"
                          value={preferences.timezone}
                          onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                          className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="space-y-8">
                    <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                      Notification Preferences
                    </h2>
                    <div className="space-y-8">
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                          <Mail className="h-5 w-5" />
                          Email Notifications
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(notifications.email).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  setNotifications({
                                    ...notifications,
                                    email: { ...notifications.email, [key]: e.target.checked },
                                  })
                                }
                                className="h-5 w-5 rounded border-neutral-300 text-purple-600 focus:ring-purple-600"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                          <Bell className="h-5 w-5" />
                          Push Notifications
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(notifications.push).map(([key, value]) => (
                            <label key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  setNotifications({
                                    ...notifications,
                                    push: { ...notifications.push, [key]: e.target.checked },
                                  })
                                }
                                className="h-5 w-5 rounded border-neutral-300 text-purple-600 focus:ring-purple-600"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-8">
                    <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                      Security Settings
                    </h2>
                    <div className="space-y-6">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                              <Key className="h-5 w-5" />
                              Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button
                            onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                            className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
                              security.twoFactorEnabled
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                            }`}
                          >
                            {security.twoFactorEnabled ? "Enabled" : "Enable"}
                          </button>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                          <Lock className="h-5 w-5" />
                          Change Password
                        </h3>
                        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                          Last changed: {security.lastPasswordChange}
                        </p>
                        <button className="rounded-xl border border-purple-600/50 bg-purple-600/10 px-6 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-600/20 dark:text-purple-400">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div className="space-y-8">
                    <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                      Privacy Settings
                    </h2>
                    <div className="space-y-6">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                          Data Privacy
                        </h3>
                        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                          Manage how your data is used and stored
                        </p>
                        <button className="rounded-xl border border-purple-600/50 bg-purple-600/10 px-6 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-600/20 dark:text-purple-400">
                          View Privacy Policy
                        </button>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                          Account Deletion
                        </h3>
                        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                          Permanently delete your account and all associated data
                        </p>
                        <button className="rounded-xl border border-red-600/50 bg-red-600/10 px-6 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600/20 dark:text-red-400">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
        </div>
      </main>
    </div>
  );
}

