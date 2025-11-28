"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Search,
  QrCode,
  Clock,
  PlayCircle,
  StopCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  Shield,
  Printer,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Course interface
interface Course {
  id: string;
  code: string;
  name: string;
  students: number;
}

// Student interface
interface Student {
  id: string;
  name: string;
  avatar: string;
  studentId: string;
}

// Attendance session interface
interface AttendanceSession {
  id: string;
  token: string;
  session_date: string;
  start_time: string;
  end_time: string | null;
  status: string;
  time_limit_minutes: number;
}

// Attendance record interface
interface AttendanceRecord {
  id: string;
  student_id: string;
  status: string;
  check_in_time: string;
  student_name: string;
  student_identifier: string;
}

export default function AttendancePage() {
  const prefersReducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Session management
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [timeLimit, setTimeLimit] = useState(15); // minutes
  const [customTimeLimit, setCustomTimeLimit] = useState("");
  const [timeLimitUnit, setTimeLimitUnit] = useState<"minutes" | "hours" | "days">("minutes");
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [showQRModal, setShowQRModal] = useState(false);
  
  // Attendance tracking
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<{
    studentId: string;
    studentName: string;
    time: Date;
  }[]>([]);

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  const totalStudents = students.length;
  const presentCount = attendanceRecords.filter(r => r.status === "present" || r.status === "late").length;
  const absentCount = totalStudents - presentCount;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch courses where user is a collaborator
        const { data: collaborators, error: collaboratorsError } = await supabase
          .from("course_collaborators")
          .select("course_id")
          .eq("profile_id", user.id);

        if (collaboratorsError) throw collaboratorsError;

        if (collaborators && collaborators.length > 0) {
          const courseIds = collaborators.map(c => c.course_id);

          // Fetch course details
          const { data: coursesData, error: coursesError } = await supabase
            .from("courses")
            .select("id, code, name")
            .in("id", courseIds)
            .eq("status", "active")
            .order("code", { ascending: true });

          if (coursesError) throw coursesError;

          if (coursesData && coursesData.length > 0) {
            // Get student counts for each course
            const coursesWithStudents = await Promise.all(
              coursesData.map(async (course) => {
                const { data: enrollments, error: enrollmentsError } = await supabase
                  .from("course_enrollments")
                  .select("id")
                  .eq("course_id", course.id)
                  .eq("status", "active");

                if (enrollmentsError) throw enrollmentsError;

                return {
                  id: course.id,
                  code: course.code,
                  name: course.name,
                  students: enrollments?.length || 0,
                };
              })
            );

            setCourses(coursesWithStudents);
            if (coursesWithStudents.length > 0 && !selectedCourse) {
              setSelectedCourse(coursesWithStudents[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchCourses();
  }, []);

  // Fetch students when course changes
  useEffect(() => {
    async function fetchStudents() {
      if (!selectedCourse) return;

      try {
        const supabase = createSupabaseBrowserClient();

        // Fetch enrolled students
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from("course_enrollments")
          .select("student_id")
          .eq("course_id", selectedCourse)
          .eq("status", "active");

        if (enrollmentsError) throw enrollmentsError;

        if (enrollments && enrollments.length > 0) {
          // Fetch student profiles separately
          const studentIds = enrollments.map(e => e.student_id);
          
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, student_id")
            .in("id", studentIds);

          if (profilesError) throw profilesError;

          if (profiles) {
            const studentsList: Student[] = profiles.map((profile) => {
              const name = profile.full_name || "Unknown";
              const nameParts = name.split(" ");
              const avatar = nameParts.length >= 2
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : nameParts[0]?.[0]?.toUpperCase() || "U";

              return {
                id: profile.id,
                name: profile.full_name || "Unknown",
                avatar,
                studentId: profile.student_id || `STU-${profile.id.substring(0, 8).toUpperCase()}`,
              };
            });

            setStudents(studentsList);
          }
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }

    void fetchStudents();
  }, [selectedCourse]);

  // Check for active session and fetch attendance records
  useEffect(() => {
    async function fetchActiveSession() {
      if (!selectedCourse) return;

      try {
        const supabase = createSupabaseBrowserClient();

        // Check for active session
        const { data: activeSession, error: sessionError } = await supabase
          .from("attendance_sessions")
          .select("*")
          .eq("course_id", selectedCourse)
          .eq("status", "active")
          .order("start_time", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sessionError) throw sessionError;

        if (activeSession) {
          setCurrentSession(activeSession);
          setIsSessionActive(true);
          setSessionStartTime(new Date(activeSession.start_time));
          
          // Calculate time remaining
          const startTime = new Date(activeSession.start_time).getTime();
          const timeLimitMs = activeSession.time_limit_minutes * 60 * 1000;
          const endTime = startTime + timeLimitMs;
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          setTimeRemaining(remaining);

          // Set QR code URL
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const checkInUrl = `${baseUrl}/attendance/check-in/${activeSession.token}`;
          setQrCode(checkInUrl);

          // Fetch attendance records for this session
          await fetchAttendanceRecords(activeSession.id);
        } else {
          setIsSessionActive(false);
          setCurrentSession(null);
          setAttendanceRecords([]);
          setRecentCheckIns([]);
        }
      } catch (error) {
        console.error("Error fetching active session:", error);
      }
    }

    void fetchActiveSession();
  }, [selectedCourse]);

  // Fetch attendance records
  async function fetchAttendanceRecords(sessionId: string) {
    try {
      const supabase = createSupabaseBrowserClient();

      const { data: records, error: recordsError } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("session_id", sessionId)
        .order("check_in_time", { ascending: false });

      if (recordsError) throw recordsError;

      if (records) {
        setAttendanceRecords(records);

        // Update recent check-ins
        const recent = records
          .slice(0, 10)
          .map(record => ({
            studentId: record.student_id,
            studentName: record.student_name || "Unknown",
            time: new Date(record.check_in_time),
          }));
        setRecentCheckIns(recent);
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  }

  // Set up real-time subscription for attendance records
  useEffect(() => {
    if (!currentSession?.id) return;

    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel(`attendance-${currentSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendance_records",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () => {
          // Refresh attendance records when a new one is added
          void fetchAttendanceRecords(currentSession.id);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentSession?.id]);

  // Calculate total time in milliseconds
  const getTotalTimeInMs = () => {
    const limit = customTimeLimit ? parseInt(customTimeLimit) : timeLimit;
    switch (timeLimitUnit) {
      case "hours":
        return limit * 60 * 60 * 1000;
      case "days":
        return limit * 24 * 60 * 60 * 1000;
      default: // minutes
        return limit * 60 * 1000;
    }
  };

  // Generate QR code with unique URL
  const generateSessionToken = () => {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${selectedCourse}-${timestamp}-${randomPart}`;
  };

  // Start attendance session
  const startSession = async () => {
    if (!selectedCourse) return;

    try {
      const supabase = createSupabaseBrowserClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Not authenticated");
      }

      // Generate session token
      const sessionToken = generateSessionToken();
      
      // Calculate time limit in minutes
      const limit = customTimeLimit ? parseInt(customTimeLimit) : timeLimit;
      let timeLimitMinutes = limit;
      if (timeLimitUnit === "hours") {
        timeLimitMinutes = limit * 60;
      } else if (timeLimitUnit === "days") {
        timeLimitMinutes = limit * 24 * 60;
      }

      // Create session in database
      const { data: session, error: sessionError } = await supabase
        .from("attendance_sessions")
        .insert({
          course_id: selectedCourse,
          token: sessionToken,
          session_date: new Date().toISOString().split('T')[0],
          start_time: new Date().toISOString(),
          time_limit_minutes: timeLimitMinutes,
          status: "active",
          created_by: user.id,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      if (session) {
        setCurrentSession(session);
        setIsSessionActive(true);
        setSessionStartTime(new Date(session.start_time));
        
        const totalTimeMs = timeLimitMinutes * 60 * 1000;
        setTimeRemaining(Math.floor(totalTimeMs / 1000));
        
        // Set QR code URL
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const checkInUrl = `${baseUrl}/attendance/check-in/${sessionToken}`;
        setQrCode(checkInUrl);
        
        setAttendanceRecords([]);
        setRecentCheckIns([]);
        setShowQRModal(true);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start attendance session. Please try again.");
    }
  };

  // Stop attendance session
  const stopSession = async () => {
    if (!currentSession) return;

    try {
      const supabase = createSupabaseBrowserClient();

      // Update session status in database
      const { error: updateError } = await supabase
        .from("attendance_sessions")
        .update({
          status: "ended",
          end_time: new Date().toISOString(),
        })
        .eq("id", currentSession.id);

      if (updateError) throw updateError;

      setIsSessionActive(false);
      setCurrentSession(null);
      setSessionStartTime(null);
      setQrCode(null);
      setTimeRemaining(0);
      setShowQRModal(false);
    } catch (error) {
      console.error("Error stopping session:", error);
      alert("Failed to stop attendance session. Please try again.");
    }
  };

  // Regenerate QR code (for security)
  const regenerateQRCode = async () => {
    if (!isSessionActive || !currentSession || !selectedCourse) return;

    try {
      const supabase = createSupabaseBrowserClient();

      // Generate new token
      const newToken = generateSessionToken();

      // Update session token in database
      const { error: updateError } = await supabase
        .from("attendance_sessions")
        .update({ token: newToken })
        .eq("id", currentSession.id);

      if (updateError) throw updateError;

      // Update QR code URL
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const checkInUrl = `${baseUrl}/attendance/check-in/${newToken}`;
      setQrCode(checkInUrl);

      // Update current session
      setCurrentSession({ ...currentSession, token: newToken });
    } catch (error) {
      console.error("Error regenerating QR code:", error);
      alert("Failed to regenerate QR code. Please try again.");
    }
  };

  // Countdown timer
  useEffect(() => {
    if (isSessionActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionActive, timeRemaining]);


  // Format time remaining
  const formatTime = (seconds: number) => {
    if (seconds >= 86400) { // More than a day
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      return `${days}d ${hours}h`;
    } else if (seconds >= 3600) { // More than an hour
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
  };

  // Print QR Code
  const handlePrintQRCode = async () => {
    if (!qrCode) return;

    // Dynamically import qrcode to generate QR code data URL
    const QRCodeLib = await import('qrcode');
    
    QRCodeLib.toDataURL(qrCode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, (error: unknown, url: string) => {
      if (error) {
        console.error('Error generating QR code:', error);
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Attendance QR Code - ${selectedCourseData?.code}</title>
          <style>
            @media print {
              @page { 
                margin: 0.5in;
                size: letter portrait;
              }
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 40px;
              background: white;
              color: #333;
            }
            .container {
              text-align: center;
              max-width: 650px;
              width: 100%;
            }
            .header {
              margin-bottom: 30px;
            }
            h1 {
              color: #2c3e50;
              font-size: 36px;
              margin: 0 0 15px 0;
              font-weight: 600;
            }
            .course-info {
              color: #555;
              font-size: 22px;
              line-height: 1.6;
            }
            .course-code {
              font-weight: bold;
              color: #2c3e50;
              font-size: 24px;
            }
            .qr-container {
              background: white;
              padding: 30px;
              border-radius: 15px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              display: inline-block;
              margin: 30px 0;
              border: 2px solid #e0e0e0;
            }
            .qr-container img {
              display: block;
              width: 400px;
              height: 400px;
            }
            .validity {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-weight: 600;
              font-size: 20px;
              padding: 20px;
              border-radius: 10px;
              margin: 30px 0;
            }
            .validity small {
              display: block;
              margin-top: 8px;
              font-size: 16px;
              opacity: 0.9;
            }
            .instructions {
              background: #f8f9fa;
              padding: 25px;
              border-radius: 12px;
              margin: 30px 0;
              text-align: left;
              border: 1px solid #e0e0e0;
            }
            .instructions h3 {
              margin: 0 0 15px 0;
              color: #2c3e50;
              font-size: 20px;
            }
            .instructions ol {
              color: #555;
              line-height: 2;
              padding-left: 25px;
              margin: 0;
              font-size: 16px;
            }
            .instructions li {
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              color: #999;
              font-size: 14px;
              line-height: 1.6;
            }
            .important-note {
              background: #fff3cd;
              border: 2px solid #ffc107;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
              color: #856404;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📱 Scan to Mark Attendance</h1>
              <div class="course-info">
                <div class="course-code">${selectedCourseData?.code}</div>
                ${selectedCourseData?.name}
              </div>
            </div>
            
            <div class="qr-container">
              <img src="${url}" alt="Attendance QR Code" />
            </div>
            
            <div class="validity">
              ⏰ Valid for: ${customTimeLimit ?? timeLimit} ${timeLimitUnit}
              <small>Expires: ${new Date(Date.now() + getTotalTimeInMs()).toLocaleString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</small>
            </div>

            <div class="important-note">
              <strong>⚠️ Important:</strong> This QR code is unique and time-limited. Do not share the link manually.
            </div>
            
            <div class="instructions">
              <h3>📋 How to Check In:</h3>
              <ol>
                <li><strong>Open</strong> your phone camera or QR code scanner app</li>
                <li><strong>Point</strong> your camera at the QR code above</li>
                <li><strong>Tap</strong> the notification or link that appears on your screen</li>
                <li><strong>Enter</strong> your Student ID and Full Name</li>
                <li><strong>Submit</strong> to mark your attendance</li>
              </ol>
            </div>
            
            <div class="footer">
              <strong>Generated:</strong> ${new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}<br>
              <strong>System:</strong> Lecturer Management System<br>
              <strong>Session ID:</strong> ${qrCode.split('/').pop()?.substring(0, 12)}...
            </div>
          </div>
          <script>
            // Auto-print after a short delay
            setTimeout(() => {
              window.print();
            }, 250);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    });
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentStudentIds = new Set(
    attendanceRecords
      .filter(r => r.status === "present" || r.status === "late")
      .map(r => r.student_id)
  );

  const presentStudentsList = filteredStudents.filter(s => presentStudentIds.has(s.id));
  const absentStudentsList = filteredStudents.filter(s => !presentStudentIds.has(s.id));

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
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                  QR Attendance System
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Fast, secure, and automated attendance tracking
                </p>
              </div>
              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading courses...</span>
                  </div>
                ) : courses.length > 0 ? (
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    No courses available
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Session Control */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    isSessionActive 
                      ? "animate-pulse bg-gradient-to-br from-green-500 to-emerald-500" 
                      : "bg-gradient-to-br from-neutral-400 to-neutral-500"
                  }`}>
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {isSessionActive ? "Session Active" : "No Active Session"}
                    </h2>
                    {isSessionActive && sessionStartTime && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Started at {sessionStartTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                {isSessionActive && (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {formatTime(timeRemaining)}
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">remaining</span>
                    </div>
                    <div className="h-6 w-px bg-white/20 dark:bg-white/10" />
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        QR refreshes every 2 min
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {!isSessionActive ? (
                  <>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Time Limit:
                      </div>
                      <div className="flex gap-2">
                        {/* Quick Select */}
                        <select
                          value={timeLimit}
                          onChange={(e) => {
                            setTimeLimit(Number(e.target.value));
                            setCustomTimeLimit("");
                            setTimeLimitUnit("minutes");
                          }}
                          className="h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                        >
                          <option value={5}>5 minutes</option>
                          <option value={10}>10 minutes</option>
                          <option value={15}>15 minutes</option>
                          <option value={20}>20 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={180}>3 hours</option>
                        </select>
                        
                        {/* Or Custom */}
                        <span className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">or</span>
                        
                        <input
                          type="number"
                          min="1"
                          placeholder="Custom"
                          value={customTimeLimit}
                          onChange={(e) => setCustomTimeLimit(e.target.value)}
                          className="h-11 w-20 rounded-xl border border-white/20 bg-white/10 px-3 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                        
                        <select
                          value={timeLimitUnit}
                          onChange={(e) => setTimeLimitUnit(e.target.value as "minutes" | "hours" | "days")}
                          disabled={!customTimeLimit}
                          className="h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={startSession}
                      className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <PlayCircle className="h-5 w-5" />
                      Start Attendance Session
                    </button>
                    
                    {/* Time Limit Info */}
                    {customTimeLimit && (
                      <div className="w-full rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-blue-900 dark:text-blue-300">
                        <div className="flex items-start gap-2">
                          <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>
                            QR code will be valid for <strong>{customTimeLimit} {timeLimitUnit}</strong>.
                            {parseInt(customTimeLimit) >= 60 && timeLimitUnit === "minutes" && " Perfect for printing and posting in classroom."}
                            {timeLimitUnit === "hours" && " Ideal for printed QR codes valid for multiple class periods."}
                            {timeLimitUnit === "days" && " Extended validity for multi-day events or makeup sessions."}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowQRModal(true)}
                      className="flex h-12 items-center gap-2 rounded-xl border border-purple-600/50 bg-purple-600/10 px-6 text-sm font-semibold text-purple-600 backdrop-blur-sm transition hover:bg-purple-600/20 dark:text-purple-400"
                    >
                      <QrCode className="h-5 w-5" />
                      Show QR Code
                    </button>
                    <button
                      onClick={() => { void handlePrintQRCode(); }}
                      className="flex h-12 items-center gap-2 rounded-xl border border-blue-600/50 bg-blue-600/10 px-6 text-sm font-semibold text-blue-600 backdrop-blur-sm transition hover:bg-blue-600/20 dark:text-blue-400"
                    >
                      <Printer className="h-5 w-5" />
                      Print QR Code
                    </button>
                    <button
                      onClick={regenerateQRCode}
                      className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Regenerate
                    </button>
                    <button
                      onClick={stopSession}
                      className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-8 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <StopCircle className="h-5 w-5" />
                      End Session
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-white/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 backdrop-blur-sm dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Total Students
                  </p>
                  <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">
                    {totalStudents}
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-white/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Present
                  </p>
                  <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                    {presentCount}
                  </p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl border border-white/20 bg-gradient-to-br from-red-500/10 to-rose-500/10 p-6 backdrop-blur-sm dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Absent
                  </p>
                  <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                    {absentCount}
                  </p>
                </div>
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 backdrop-blur-sm dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Attendance Rate
                  </p>
                  <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {attendanceRate}%
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-purple-500" />
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Student List */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2 rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Student Attendance
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Present Students */}
                {presentStudentsList.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
                      <UserCheck className="h-4 w-4" />
                      Present ({presentStudentsList.length})
                    </h3>
                    <div className="space-y-2">
                      {presentStudentsList.map((student, index) => (
                        <motion.div
                          key={student.id}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-sm font-bold text-white">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {student.studentId}
                              </div>
                            </div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Absent Students */}
                {isSessionActive && absentStudentsList.length > 0 && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                      <UserX className="h-4 w-4" />
                      Absent ({absentStudentsList.length})
                    </h3>
                    <div className="space-y-2">
                      {absentStudentsList.map((student, index) => (
                        <motion.div
                          key={student.id}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                          animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-sm font-bold text-white opacity-50">
                              {student.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {student.studentId}
                              </div>
                            </div>
                          </div>
                          <XCircle className="h-5 w-5 text-red-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {!isSessionActive && (
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
                    <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">
                      No active session
                    </p>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                      Start a session to begin tracking attendance
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Check-ins Feed */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <h2 className="mb-6 text-xl font-bold text-neutral-900 dark:text-white">
                Recent Check-ins
              </h2>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {recentCheckIns.map((checkIn) => (
                    <motion.div
                      key={`${checkIn.studentId}-${checkIn.time.getTime()}`}
                      initial={{ opacity: 0, x: 50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-sm font-bold text-white">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {checkIn.studentName}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          {checkIn.time.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {recentCheckIns.length === 0 && (
                  <div className="py-8 text-center">
                    <Activity className="mx-auto mb-3 h-12 w-12 text-neutral-400" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No check-ins yet
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && qrCode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQRModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-white p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900"
              >
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Scan QR Code to Check In
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedCourseData?.code} - {selectedCourseData?.name}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center rounded-2xl bg-white p-8">
                  <QRCodeSVG
                    value={qrCode}
                    size={300}
                    level="H"
                    includeMargin
                    className="rounded-xl"
                  />
                </div>

                <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/20">
                  <p className="text-center text-sm font-medium text-blue-900 dark:text-blue-300">
                    Students can scan this code with their mobile devices
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 rounded-xl border border-neutral-300 bg-white py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={regenerateQRCode}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    Regenerate Code
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
