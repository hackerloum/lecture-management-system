"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Tag,
  Plus,
  X,
  Sparkles,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

interface Collaborator {
  id: string;
  name: string;
  role: string;
}

export default function CreateCoursePage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  // Form state
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("Spring 2025");
  const [credits, setCredits] = useState("3");
  const [department, setDepartment] = useState("Computer Science");
  const [level, setLevel] = useState("Undergraduate");
  const [maxStudents, setMaxStudents] = useState("50");
  const [room, setRoom] = useState("");
  const [schedule, setSchedule] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [selectedColor, setSelectedColor] = useState("from-blue-500 to-cyan-500");

  // Dynamic departments and levels
  const [departments, setDepartments] = useState<string[]>([
    "Computer Science",
    "Mathematics",
    "Engineering",
    "Business",
    "Arts & Sciences",
  ]);
  const [levels, setLevels] = useState<string[]>([
    "Undergraduate",
    "Graduate",
    "PhD",
  ]);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddLevel, setShowAddLevel] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newLevel, setNewLevel] = useState("");

  const colorOptions = [
    { name: "Blue", gradient: "from-blue-500 to-cyan-500" },
    { name: "Purple", gradient: "from-purple-500 to-pink-500" },
    { name: "Green", gradient: "from-green-500 to-emerald-500" },
    { name: "Orange", gradient: "from-orange-500 to-red-500" },
    { name: "Yellow", gradient: "from-yellow-500 to-orange-500" },
    { name: "Indigo", gradient: "from-indigo-500 to-purple-500" },
  ];

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !prerequisites.includes(newPrerequisite.trim())) {
      setPrerequisites([...prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (prereq: string) => {
    setPrerequisites(prerequisites.filter((p) => p !== prereq));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const addDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()]);
      setDepartment(newDepartment.trim());
      setNewDepartment("");
      setShowAddDepartment(false);
    }
  };

  const addLevel = () => {
    if (newLevel.trim() && !levels.includes(newLevel.trim())) {
      setLevels([...levels, newLevel.trim()]);
      setLevel(newLevel.trim());
      setNewLevel("");
      setShowAddLevel(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log({
      courseCode,
      courseName,
      description,
      semester,
      credits,
      department,
      level,
      maxStudents,
      room,
      schedule,
      startDate,
      endDate,
      prerequisites,
      tags,
      collaborators,
      color: selectedColor,
    });
    // Redirect to courses page
    router.push("/dashboard/courses");
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
              href="/dashboard/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
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
              Course Creation
            </div>
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Create New Course 📚
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Set up your course with all the details
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
            {/* Basic Information */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Basic Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Course Code */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="CS 101"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Course Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="Introduction to Computer Science"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Department *
                  </label>
                  {!showAddDepartment ? (
                    <div className="flex gap-2">
                      <select
                        value={department}
                        onChange={(e) => {
                          if (e.target.value === "__add_new__") {
                            setShowAddDepartment(true);
                          } else {
                            setDepartment(e.target.value);
                          }
                        }}
                        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add New Department</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDepartment())}
                        placeholder="Enter new department name"
                        autoFocus
                        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                      <button
                        type="button"
                        onClick={addDepartment}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white transition hover:bg-green-700"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddDepartment(false);
                          setNewDepartment("");
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Level *
                  </label>
                  {!showAddLevel ? (
                    <div className="flex gap-2">
                      <select
                        value={level}
                        onChange={(e) => {
                          if (e.target.value === "__add_new__") {
                            setShowAddLevel(true);
                          } else {
                            setLevel(e.target.value);
                          }
                        }}
                        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                      >
                        {levels.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add New Level</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLevel())}
                        placeholder="Enter new level name"
                        autoFocus
                        className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                      />
                      <button
                        type="button"
                        onClick={addLevel}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white transition hover:bg-green-700"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddLevel(false);
                          setNewLevel("");
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Credits */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Credits *
                  </label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    min="1"
                    max="6"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Max Students */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Max Students *
                  </label>
                  <input
                    type="number"
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                    min="1"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Course Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of the course..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                />
              </div>
            </div>

            {/* Schedule & Location */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Schedule & Location
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Semester */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Semester *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                  >
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2025">Summer 2025</option>
                    <option value="Fall 2025">Fall 2025</option>
                    <option value="Winter 2026">Winter 2026</option>
                  </select>
                </div>

                {/* Schedule */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Schedule *
                  </label>
                  <input
                    type="text"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="Mon/Wed 10:00 AM - 11:30 AM"
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>

                {/* Room */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Room/Location *
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Engineering 201"
                    required
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

                {/* End Date */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>
            </div>

            {/* Prerequisites & Tags */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Prerequisites & Tags
              </h2>

              {/* Prerequisites */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Prerequisites
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPrerequisite())}
                    placeholder="Add prerequisite course (e.g., CS 100)"
                    className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                  <button
                    type="button"
                    onClick={addPrerequisite}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {prerequisites.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {prerequisites.map((prereq) => (
                      <span
                        key={prereq}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {prereq}
                        <button
                          type="button"
                          onClick={() => removePrerequisite(prereq)}
                          className="text-neutral-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tags (e.g., Programming, Theory, Lab)"
                    className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-purple-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Departments & Levels Overview */}
            {(departments.length > 5 || levels.length > 3) && (
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Custom Options Overview
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Departments */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      All Departments ({departments.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <span
                          key={dept}
                          className={`rounded-lg px-3 py-1 text-sm font-medium ${
                            dept === department
                              ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                              : "border border-white/10 bg-white/5 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Levels */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      All Levels ({levels.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((lvl) => (
                        <span
                          key={lvl}
                          className={`rounded-lg px-3 py-1 text-sm font-medium ${
                            lvl === level
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "border border-white/10 bg-white/5 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Course Color
              </h2>

              <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                {colorOptions.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.gradient)}
                    className={`group relative h-20 overflow-hidden rounded-2xl border-4 transition ${
                      selectedColor === color.gradient
                        ? "border-purple-600 shadow-lg dark:border-purple-400"
                        : "border-white/20 hover:border-purple-400"
                    }`}
                  >
                    <div className={`h-full w-full bg-gradient-to-br ${color.gradient}`} />
                    {selectedColor === color.gradient && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="rounded-full bg-white p-1">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard/courses")}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Save className="h-4 w-4" />
                Create Course
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}

