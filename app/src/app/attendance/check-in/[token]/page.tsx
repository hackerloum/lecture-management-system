"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  BookOpen,
  Loader2,
  Shield,
  MapPin,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SessionData {
  sessionId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  lecturerName: string;
  startTime: string;
  expiresAt: number;
  location: string;
  isActive: boolean;
}

export default function TokenizedCheckInPage() {
  const prefersReducedMotion = useReducedMotion();
  const params = useParams();
  const token = params.token as string;
  
  const [step, setStep] = useState<"validating" | "form" | "success" | "error">("validating");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Student form
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  
  // Session data from token validation
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Validate token on mount
  useEffect(() => {
    void validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (sessionData && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setError("This attendance session has expired.");
            setStep("error");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionData, timeRemaining]);

  const validateToken = async () => {
    try {
      // Simulate API call to validate token
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real app, this would be an API call to your backend:
      // const response = await fetch(`/api/attendance/validate-token/${token}`);
      // const data = await response.json();
      
      // Mock validation logic
      if (!token || token.length < 10) {
        throw new Error("Invalid attendance link");
      }
      
      // Mock session data
      const mockSessionData: SessionData = {
        sessionId: token,
        courseId: "CS101",
        courseCode: "CS 101",
        courseName: "Introduction to Computer Science",
        lecturerName: "Dr. Sarah Johnson",
        startTime: new Date().toLocaleTimeString(),
        expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes from now
        location: "Room A-204",
        isActive: true,
      };
      
      // Check if expired
      if (mockSessionData.expiresAt < Date.now()) {
        throw new Error("This attendance session has expired. Please ask your lecturer to start a new session.");
      }
      
      // Check if active
      if (!mockSessionData.isActive) {
        throw new Error("This attendance session is no longer active.");
      }
      
      setSessionData(mockSessionData);
      setTimeRemaining(Math.floor((mockSessionData.expiresAt - Date.now()) / 1000));
      setStep("form");
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid or expired attendance link";
      setError(errorMessage);
      setStep("error");
    }
  };

  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId.trim() || !studentName.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real app, send to backend:
      // - Verify token is still valid
      // - Check student is enrolled in the course
      // - Check student hasn't already checked in for this session
      // - Mark attendance in database
      // - Send real-time update to lecturer's dashboard via WebSocket/SSE
      
      // Simulate duplicate check
      const isDuplicate = Math.random() > 0.8; // 20% chance for demo
      if (isDuplicate) {
        throw new Error("You have already checked in for this session.");
      }
      
      console.log("Attendance marked:", {
        token,
        sessionId: sessionData?.sessionId,
        courseId: sessionData?.courseId,
        studentId,
        studentName,
        timestamp: Date.now(),
        ipAddress: "xxx.xxx.xxx.xxx", // In real app, capture for security
      });
      
      setStep("success");
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark attendance. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 text-2xl font-bold text-white shadow-[0_20px_50px_rgba(139,92,246,0.4)]">
                LMS
              </div>
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Attendance Check-In
            </h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Mark your attendance for today&apos;s class
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
            {/* Step 1: Validating Token */}
            {step === "validating" && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <div className="rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 p-8 dark:from-purple-950/30 dark:to-blue-950/30">
                    <Shield className="h-32 w-32 animate-pulse text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Validating Session
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Please wait while we verify your attendance link...
                  </p>
                </div>

                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
              </motion.div>
            )}

            {/* Step 2: Attendance Form */}
            {step === "form" && sessionData && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                className="space-y-6"
              >
                {/* Session Info Header */}
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                        Secure Session
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1 dark:bg-white/10">
                      <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-bold text-purple-900 dark:text-purple-300">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <div className="flex-1">
                        <p className="text-xs text-purple-700 dark:text-purple-400">Course</p>
                        <p className="font-semibold text-purple-900 dark:text-purple-200">
                          {sessionData.courseCode} - {sessionData.courseName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="mt-0.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <div className="flex-1">
                        <p className="text-xs text-purple-700 dark:text-purple-400">Lecturer</p>
                        <p className="font-semibold text-purple-900 dark:text-purple-200">
                          {sessionData.lecturerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <div className="flex-1">
                        <p className="text-xs text-purple-700 dark:text-purple-400">Location</p>
                        <p className="font-semibold text-purple-900 dark:text-purple-200">
                          {sessionData.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Form */}
                <form onSubmit={(e) => { void handleSubmitAttendance(e); }} className="space-y-4">
                  <div>
                    <label
                      htmlFor="student-id"
                      className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Student ID *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="student-id"
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g., STU-2025-001"
                        required
                        className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="student-name"
                      className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="student-name"
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 p-4"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Marking Attendance...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Mark My Attendance
                      </>
                    )}
                  </button>

                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs text-blue-900 dark:text-blue-300">
                        Your attendance will be recorded securely. This link expires in{" "}
                        <span className="font-bold">{formatTime(timeRemaining)}</span>.
                      </p>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === "success" && sessionData && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <motion.div
                    initial={prefersReducedMotion ? undefined : { scale: 0 }}
                    animate={prefersReducedMotion ? undefined : { scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="rounded-full bg-gradient-to-br from-green-500 to-emerald-500 p-6"
                  >
                    <CheckCircle className="h-16 w-16 text-white" />
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Attendance Marked!
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Your presence has been successfully recorded
                  </p>
                </div>

                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-left">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Student</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">{studentName}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{studentId}</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/20 dark:bg-white/10" />
                    <div className="flex items-start gap-3">
                      <BookOpen className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Course</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {sessionData.courseName}
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-white/20 dark:bg-white/10" />
                    <div className="flex items-start gap-3">
                      <Clock className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Check-in Time</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-white/20 dark:bg-white/10" />
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Location</p>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {sessionData.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">
                    ✓ You can now close this page
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Error */}
            {step === "error" && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-red-500 to-rose-500 p-6">
                    <XCircle className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Access Denied
                  </h2>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error ?? "This attendance link is invalid or has expired."}
                  </p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-left">
                  <h3 className="mb-3 font-semibold text-neutral-900 dark:text-white">
                    Common reasons:
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-red-500">•</span>
                      <span>The attendance session has ended or expired</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-red-500">•</span>
                      <span>The link was not scanned from the lecturer&apos;s QR code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-red-500">•</span>
                      <span>You may have already checked in for this session</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-red-500">•</span>
                      <span>The link was shared and is no longer valid</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    💡 Please scan the QR code directly from your lecturer&apos;s screen
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Security Notice */}
          {step === "form" && (
            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 backdrop-blur-sm">
              <div className="flex gap-3">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <div className="text-sm text-yellow-900 dark:text-yellow-300">
                  <p className="font-semibold">Security Notice</p>
                  <p className="mt-1">
                    Do not share this link with others. Each QR code is unique and time-limited for your protection.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

