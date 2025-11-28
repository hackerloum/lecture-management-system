"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function StudentRegistrationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  // Validation state
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [inviterInfo, setInviterInfo] = useState<any>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [major, setMajor] = useState("Computer Science");
  const [year, setYear] = useState("Freshman");
  const [studentId, setStudentId] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState(false);

  useEffect(() => {
    async function validateToken() {
      try {
        const supabase = createSupabaseBrowserClient();

        // Validate invitation token
        const { data: invitationData, error: inviteError } = await supabase
          .from("invitations")
          .select("*")
          .eq("token", token)
          .eq("role", "student")
          .single();

        if (inviteError || !invitationData) {
          setTokenValid(false);
          setValidating(false);
          return;
        }

        // Check if invitation is expired
        const expiresAt = new Date(invitationData.expires_at);
        if (expiresAt < new Date()) {
          setTokenValid(false);
          setValidating(false);
          return;
        }

        // Check if invitation is cancelled
        if (invitationData.status === "cancelled") {
          setTokenValid(false);
          setValidating(false);
          return;
        }

        setInvitation(invitationData);
        setTokenValid(true);

        // Get inviter info
        if (invitationData.invited_by) {
          const { data: inviterProfile } = await supabase
            .from("profiles")
            .select("full_name, department")
            .eq("id", invitationData.invited_by)
            .single();

          if (inviterProfile) {
            setInviterInfo(inviterProfile);
          }
        }

        setValidating(false);
      } catch (err) {
        console.error("Error validating token:", err);
        setTokenValid(false);
        setValidating(false);
      }
    }

    void validateToken();
  }, [token]);

  const handleEmailBlur = async () => {
    if (email && email.includes("@")) {
      const supabase = createSupabaseBrowserClient();
      
      // Check if email already exists in profiles
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      if (existingProfile) {
        setDuplicate(true);
        setError("This email is already registered. Please sign in instead.");
      } else {
        setDuplicate(false);
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (duplicate) {
      setError("This email is already registered. Please sign in instead.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const fullName = `${firstName} ${lastName}`.trim();
      const emailLower = email.toLowerCase().trim();

      // Sign up the student with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: emailLower,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "student",
          },
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/login`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered") || signUpError.message.includes("already exists")) {
          setError("This email is already registered. Please sign in instead.");
        } else {
          setError(signUpError.message || "Failed to create account. Please try again.");
        }
        setSubmitting(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account. Please try again.");
        setSubmitting(false);
        return;
      }

      // Wait a moment for the profile trigger to create the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the profile with additional student information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: phone || null,
          major: major || null,
          year: year || null,
          student_id: studentId || null,
          organization_id: invitation.organization_id,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        // Continue anyway - the profile was created by trigger
      }

      // Update invitation to mark it as accepted
      await supabase
        .from("invitations")
        .update({
          email: emailLower,
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      setSubmitted(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push(`/auth/login?email=${encodeURIComponent(emailLower)}`);
      }, 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to complete registration. Please try again.");
      setSubmitting(false);
    }
  };

  if (validating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f]">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600" />
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            Validating invitation...
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 px-4 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md rounded-3xl border border-red-500/30 bg-white/10 p-8 text-center backdrop-blur-sm dark:border-red-500/20 dark:bg-white/5"
        >
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
            Invalid Invitation Link
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            This invitation link is invalid or has expired. Please contact your lecturer for a new link.
          </p>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 px-4 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md rounded-3xl border border-green-500/30 bg-white/10 p-8 text-center backdrop-blur-sm dark:border-green-500/20 dark:bg-white/5"
        >
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
            Registration Successful! ✅
          </h1>
          <p className="mb-4 text-neutral-600 dark:text-neutral-400">
            Your student account has been created successfully. You'll be redirected to the login page shortly.
          </p>
          <div className="rounded-xl bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400">
            Please check your email to verify your account. You can then sign in with your email and password.
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
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

      <main className="relative z-10 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/80 px-4 py-2 text-xs font-semibold text-purple-600 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-white/10 dark:text-purple-400">
              <GraduationCap className="h-4 w-4" />
              Student Registration
            </div>
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Student Registration 🎓
            </h1>
            {inviterInfo && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Invited by {inviterInfo.full_name}
                {inviterInfo.department && ` • ${inviterInfo.department}`}
              </p>
            )}
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-600 dark:text-blue-400"
          >
            <div className="mb-1 font-semibold">Welcome!</div>
            <p>
              Please fill out the form below to create your student account. You'll be able to access the system once your registration is complete.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Personal Information */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Personal Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    required
                    className={`h-12 w-full rounded-xl border px-4 text-sm backdrop-blur-sm transition focus:outline-none focus:ring-2 ${
                      duplicate
                        ? "border-red-500/50 bg-red-500/10 focus:border-red-600 focus:ring-red-600/20"
                        : "border-white/20 bg-white/10 focus:border-purple-600 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                    }`}
                  />
                  {duplicate && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      This email is already registered. Please sign in instead.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Academic Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Student ID (if known)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Optional"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Major *
                  </label>
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Information Systems">Information Systems</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Academic Year *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || duplicate}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Submit Registration
                </>
              )}
            </button>
          </motion.form>
        </div>
      </main>
    </div>
  );
}

