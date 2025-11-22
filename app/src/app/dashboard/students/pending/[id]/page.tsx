"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  CheckCircle,
  XCircle,
  MapPin,
  Building,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock function to fetch student registration details
const getStudentRegistration = async (id: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Mock data
  const registrations: Record<string, any> = {
    "1": {
      id: 1,
      firstName: "Emily",
      lastName: "Chen",
      preferredName: "",
      email: "emily.chen@student.edu",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "2003-05-15",
      gender: "Female",
      studentId: "STU-2025-045",
      major: "Computer Science",
      minor: "Mathematics",
      year: "Freshman",
      enrollmentStatus: "Full-time",
      startDate: "2025-01-15",
      expectedGraduation: "2028-05-30",
      gpa: "",
      advisor: "",
      address: "123 College Street, Apt 4B",
      city: "Boston",
      state: "MA",
      zipCode: "02115",
      country: "United States",
      emergencyName: "Lisa Chen",
      emergencyRelation: "Mother",
      emergencyPhone: "+1 (555) 987-6543",
      emergencyEmail: "lisa.chen@email.com",
      submittedAt: "2025-01-10T14:30:00Z",
      status: "pending",
      lecturerName: "Dr. Sarah Johnson",
      lecturerDepartment: "Computer Science",
    },
    "2": {
      id: 2,
      firstName: "David",
      lastName: "Lee",
      preferredName: "Dave",
      email: "david.lee@student.edu",
      phone: "+1 (555) 234-5678",
      dateOfBirth: "2002-08-22",
      gender: "Male",
      studentId: "STU-2025-046",
      major: "Data Science",
      minor: "",
      year: "Sophomore",
      enrollmentStatus: "Full-time",
      startDate: "2025-01-15",
      expectedGraduation: "2027-05-30",
      gpa: "3.5",
      advisor: "Dr. Michael Brown",
      address: "456 University Ave",
      city: "Boston",
      state: "MA",
      zipCode: "02116",
      country: "United States",
      emergencyName: "Robert Lee",
      emergencyRelation: "Father",
      emergencyPhone: "+1 (555) 876-5432",
      emergencyEmail: "robert.lee@email.com",
      submittedAt: "2025-01-10T10:15:00Z",
      status: "pending",
      lecturerName: "Dr. Sarah Johnson",
      lecturerDepartment: "Computer Science",
    },
  };

  return registrations[id] || null;
};

export default function PendingStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [processing, setProcessing] = useState<"approve" | "reject" | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const data = await getStudentRegistration(id);
      setStudent(data);
      setLoading(false);
    };
    fetchStudent();
  }, [id]);

  const handleApprove = async () => {
    setProcessing("approve");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Approved student:", id);
    router.push("/dashboard/students/invite?approved=true");
  };

  const handleReject = async () => {
    setProcessing("reject");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Rejected student:", id);
    router.push("/dashboard/students/invite?rejected=true");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f]">
        <DashboardNavigation />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
            <p className="text-lg font-semibold text-neutral-900 dark:text-white">
              Loading student details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f]">
        <DashboardNavigation />
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-red-500/30 bg-white/10 p-8 text-center backdrop-blur-sm dark:border-red-500/20 dark:bg-white/5">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
              Registration Not Found
            </h1>
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              This registration doesn't exist or has been removed.
            </p>
            <Link
              href="/dashboard/students/invite"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Invitations
            </Link>
          </div>
        </div>
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

      <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/dashboard/students/invite"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Pending Registrations
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-2xl font-bold text-white shadow-lg">
                {student.firstName.charAt(0)}
                {student.lastName.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
                  {student.firstName} {student.lastName}
                  {student.preferredName && ` (${student.preferredName})`}
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Registration Details - Pending Approval
                </p>
              </div>
            </div>

            {/* Status & Submission Time */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                <Clock className="h-4 w-4" />
                Pending Review
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Submitted: {formatDate(student.submittedAt)}
              </span>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content - 2 columns */}
            <div className="space-y-8 lg:col-span-2">
              {/* Personal Information */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Personal Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Email Address
                    </div>
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                      <Mail className="h-4 w-4 text-neutral-500" />
                      {student.email}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Phone Number
                    </div>
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                      <Phone className="h-4 w-4 text-neutral-500" />
                      {student.phone}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Date of Birth
                    </div>
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      {formatDate(student.dateOfBirth)} ({calculateAge(student.dateOfBirth)} years old)
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Gender
                    </div>
                    <div className="text-neutral-900 dark:text-white">{student.gender}</div>
                  </div>
                </div>
              </motion.div>

              {/* Academic Information */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Academic Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Student ID
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.studentId || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Enrollment Status
                    </div>
                    <div className="text-neutral-900 dark:text-white">{student.enrollmentStatus}</div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Major
                    </div>
                    <div className="text-neutral-900 dark:text-white">{student.major}</div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Minor
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.minor || "None"}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Academic Year
                    </div>
                    <div className="text-neutral-900 dark:text-white">{student.year}</div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Current GPA
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.gpa || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Start Date
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {formatDate(student.startDate)}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Expected Graduation
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {formatDate(student.expectedGraduation)}
                    </div>
                  </div>

                  {student.advisor && (
                    <div className="sm:col-span-2">
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                        Academic Advisor
                      </div>
                      <div className="text-neutral-900 dark:text-white">{student.advisor}</div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                  <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {student.address && (
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                        Address
                      </div>
                      <div className="text-neutral-900 dark:text-white">
                        {student.address}
                        <br />
                        {student.city}, {student.state} {student.zipCode}
                        <br />
                        {student.country}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-3xl border border-red-500/30 bg-red-500/5 p-8 backdrop-blur-sm dark:border-red-500/20"
              >
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Emergency Contact
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Contact Name
                    </div>
                    <div className="text-neutral-900 dark:text-white">{student.emergencyName}</div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Relationship
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.emergencyRelation}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Phone Number
                    </div>
                    <div className="text-neutral-900 dark:text-white">{student.emergencyPhone}</div>
                  </div>

                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Email Address
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.emergencyEmail || "Not provided"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Actions */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">
                  Review Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={processing !== null}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing === "approve" ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Approve & Enroll
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={processing !== null}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processing === "reject" ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Reject Registration
                      </>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submission Info */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="mb-4 font-semibold text-neutral-900 dark:text-white">
                  Submission Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Submitted To
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.lecturerName}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Department
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {student.lecturerDepartment}
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                      Submission Time
                    </div>
                    <div className="text-neutral-900 dark:text-white">
                      {new Date(student.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 backdrop-blur-sm"
              >
                <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                  💡 Review Tips
                </h3>
                <ul className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
                  <li>• Verify email matches student records</li>
                  <li>• Check if student ID is correct</li>
                  <li>• Confirm major and year are appropriate</li>
                  <li>• Ensure emergency contact is valid</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

