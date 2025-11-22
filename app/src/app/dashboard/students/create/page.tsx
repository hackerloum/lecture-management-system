"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Upload,
  Save,
  Sparkles,
  Users,
  Building,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

export default function CreateStudentPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [avatar, setAvatar] = useState("");

  // Academic Information
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("Computer Science");
  const [minor, setMinor] = useState("");
  const [year, setYear] = useState("Freshman");
  const [enrollmentStatus, setEnrollmentStatus] = useState("Full-time");
  const [startDate, setStartDate] = useState("");
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [gpa, setGpa] = useState("");
  const [advisor, setAdvisor] = useState("");

  // Contact Information
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyEmail, setEmergencyEmail] = useState("");

  // Dynamic majors and years
  const [majors, setMajors] = useState<string[]>([
    "Computer Science",
    "Mathematics",
    "Engineering",
    "Business Administration",
    "Data Science",
    "Information Systems",
  ]);
  const [years, setYears] = useState<string[]>([
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Graduate",
  ]);
  const [showAddMajor, setShowAddMajor] = useState(false);
  const [showAddYear, setShowAddYear] = useState(false);
  const [newMajor, setNewMajor] = useState("");
  const [newYear, setNewYear] = useState("");

  const addMajor = () => {
    if (newMajor.trim() && !majors.includes(newMajor.trim())) {
      setMajors([...majors, newMajor.trim()]);
      setMajor(newMajor.trim());
      setNewMajor("");
      setShowAddMajor(false);
    }
  };

  const addYear = () => {
    if (newYear.trim() && !years.includes(newYear.trim())) {
      setYears([...years, newYear.trim()]);
      setYear(newYear.trim());
      setNewYear("");
      setShowAddYear(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log({
      firstName,
      lastName,
      preferredName,
      email,
      phone,
      dateOfBirth,
      gender,
      studentId,
      major,
      minor,
      year,
      enrollmentStatus,
      startDate,
      expectedGraduation,
      gpa,
      advisor,
      address,
      city,
      state,
      zipCode,
      country,
      emergencyName,
      emergencyRelation,
      emergencyPhone,
      emergencyEmail,
    });
    // Redirect to students page
    router.push("/dashboard/students");
  };

  const generateAvatarInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return "?";
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

      <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/dashboard/students"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/80 px-4 py-2 text-xs font-semibold text-purple-600 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-white/10 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
              Student Enrollment
            </div>
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Add New Student 👤
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Complete student profile and enrollment details
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Personal Information */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Personal Information
              </h2>

              {/* Avatar Preview */}
              <div className="mb-6 flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-3xl font-bold text-white shadow-lg">
                  {generateAvatarInitials()}
                </div>
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Profile Photo
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </button>
                    <p className="flex items-center text-xs text-neutral-600 dark:text-neutral-400">
                      JPG, PNG or GIF (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Preferred Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="Optional"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                  >
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@university.edu"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Date of Birth */}
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
                {/* Student ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="STU-2025-001"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Enrollment Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Enrollment Status *
                  </label>
                  <select
                    value={enrollmentStatus}
                    onChange={(e) => setEnrollmentStatus(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Exchange">Exchange</option>
                    <option value="Online">Online</option>
                  </select>
                </div>

                {/* Major */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Major *
                  </label>
                  {!showAddMajor ? (
                    <select
                      value={major}
                      onChange={(e) => {
                        if (e.target.value === "__add_new__") {
                          setShowAddMajor(true);
                        } else {
                          setMajor(e.target.value);
                        }
                      }}
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                    >
                      {majors.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                      <option value="__add_new__">+ Add New Major</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMajor}
                        onChange={(e) => setNewMajor(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMajor())}
                        placeholder="Enter new major"
                        autoFocus
                        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                      <button
                        type="button"
                        onClick={addMajor}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white transition hover:bg-green-700"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddMajor(false);
                          setNewMajor("");
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Minor */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Minor (Optional)
                  </label>
                  <input
                    type="text"
                    value={minor}
                    onChange={(e) => setMinor(e.target.value)}
                    placeholder="Mathematics"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Academic Year *
                  </label>
                  {!showAddYear ? (
                    <select
                      value={year}
                      onChange={(e) => {
                        if (e.target.value === "__add_new__") {
                          setShowAddYear(true);
                        } else {
                          setYear(e.target.value);
                        }
                      }}
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                      <option value="__add_new__">+ Add New Year</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newYear}
                        onChange={(e) => setNewYear(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addYear())}
                        placeholder="Enter new year level"
                        autoFocus
                        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                      <button
                        type="button"
                        onClick={addYear}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white transition hover:bg-green-700"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddYear(false);
                          setNewYear("");
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Advisor */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Academic Advisor
                  </label>
                  <input
                    type="text"
                    value={advisor}
                    onChange={(e) => setAdvisor(e.target.value)}
                    placeholder="Dr. Smith"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Expected Graduation */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Expected Graduation *
                  </label>
                  <input
                    type="date"
                    value={expectedGraduation}
                    onChange={(e) => setExpectedGraduation(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Current GPA */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Current GPA (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="3.5"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Contact Information
              </h2>

              <div className="grid gap-6">
                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, Apt 4B"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* City */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="NY"
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Zip/Postal Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="10001"
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="United States"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <div className="mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Emergency Contact
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Emergency Contact Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Relationship */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Relationship *
                  </label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    placeholder="Mother"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Emergency Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Emergency Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emergencyEmail}
                    onChange={(e) => setEmergencyEmail(e.target.value)}
                    placeholder="jane.doe@email.com"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/students")}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Save className="h-4 w-4" />
                Add Student
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}

