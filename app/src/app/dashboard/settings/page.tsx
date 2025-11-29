"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  User,
  Shield,
  Save,
  Camera,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const prefersReducedMotion = useReducedMotion();
  const { profile: profileData, loading: profileLoading, getAvatarInitials } = useUserProfile();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile state - initialized from database
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    department: "",
    bio: "",
    employee_id: "",
  });

  // Initialize profile from database
  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        department: profileData.department || "",
        bio: profileData.bio || "",
        employee_id: profileData.employee_id || "",
      });
    }
  }, [profileData]);

  // Security state from database
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (profileData) {
      setTwoFactorEnabled(profileData.two_factor_enabled || false);
    }
  }, [profileData]);

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
  ];

  const handleSaveProfile = async () => {
    if (!profileData) {
      toast.error("Profile data not available");
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await (supabase
        .from("profiles") as any)
        .update({
          full_name: profile.full_name.trim() || null,
          phone: profile.phone.trim() || null,
          department: profile.department.trim() || null,
          bio: profile.bio.trim() || null,
          employee_id: profile.employee_id.trim() || null,
        })
        .eq("id", profileData.id);

      if (error) {
        console.error("Error saving profile:", error);
        toast.error("Failed to save profile. Please try again.");
        return;
      }

      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    if (!profileData) {
      toast.error("Profile data not available");
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const newValue = !twoFactorEnabled;

      const { error } = await (supabase
        .from("profiles") as any)
        .update({
          two_factor_enabled: newValue,
        })
        .eq("id", profileData.id);

      if (error) {
        console.error("Error updating 2FA:", error);
        toast.error("Failed to update security settings. Please try again.");
        return;
      }

      setTwoFactorEnabled(newValue);
      toast.success(`Two-factor authentication ${newValue ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error updating 2FA:", error);
      toast.error("Failed to update security settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-16 pt-28 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-purple-600 dark:text-purple-400" />
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                Loading settings...
              </p>
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
            {activeTab === "profile" && (
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
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
                          {profileData ? getAvatarInitials(profileData.full_name) : "U"}
                        </div>
                        <button
                          disabled
                          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-white transition hover:bg-purple-700 dark:border-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Avatar upload coming soon"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {profileData?.full_name || "User"}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : ""}
                          {profileData?.department && ` • ${profileData.department}`}
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label htmlFor="full_name" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Full Name *
                        </label>
                        <input
                          id="full_name"
                          type="text"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          required
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
                          value={profileData?.email || ""}
                          disabled
                          className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition opacity-60 cursor-not-allowed dark:border-white/10 dark:bg-white/5"
                          title="Email cannot be changed"
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

                      <div>
                        <label htmlFor="employee_id" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Employee ID
                        </label>
                        <input
                          id="employee_id"
                          type="text"
                          value={profile.employee_id}
                          onChange={(e) => setProfile({ ...profile, employee_id: e.target.value })}
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
                        placeholder="Tell us about yourself..."
                      />
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
                            <Shield className="h-5 w-5" />
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button
                          onClick={handleToggleTwoFactor}
                          disabled={saving}
                          className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
                            twoFactorEnabled
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            twoFactorEnabled ? "Enabled" : "Enable"
                          )}
                        </button>
                      </div>
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
