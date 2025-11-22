"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Settings,
  Percent,
  Award,
  FileText,
  Edit,
  Trash2,
  GripVertical,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  color: string;
  assignments: Assignment[];
}

interface Assignment {
  id: string;
  name: string;
  maxPoints: number;
  dueDate: string;
}

const defaultCategories: GradeCategory[] = [
  {
    id: "1",
    name: "Assignments",
    weight: 40,
    color: "from-blue-500 to-cyan-500",
    assignments: [
      { id: "a1", name: "Assignment 1", maxPoints: 100, dueDate: "2025-01-15" },
      { id: "a2", name: "Assignment 2", maxPoints: 100, dueDate: "2025-01-29" },
    ],
  },
  {
    id: "2",
    name: "Quizzes",
    weight: 20,
    color: "from-green-500 to-emerald-500",
    assignments: [
      { id: "q1", name: "Quiz 1", maxPoints: 50, dueDate: "2025-01-20" },
      { id: "q2", name: "Quiz 2", maxPoints: 50, dueDate: "2025-02-10" },
    ],
  },
  {
    id: "3",
    name: "Midterm Exam",
    weight: 20,
    color: "from-orange-500 to-red-500",
    assignments: [
      { id: "m1", name: "Midterm Exam", maxPoints: 200, dueDate: "2025-03-15" },
    ],
  },
  {
    id: "4",
    name: "Final Exam",
    weight: 20,
    color: "from-purple-500 to-pink-500",
    assignments: [
      { id: "f1", name: "Final Exam", maxPoints: 200, dueDate: "2025-05-20" },
    ],
  },
];

export default function ConfigureGradesPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  const [categories, setCategories] = useState<GradeCategory[]>(defaultCategories);
  const [gradingScale, setGradingScale] = useState("letter");
  const [passingGrade, setPassingGrade] = useState(60);
  
  // Add new category
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryWeight, setNewCategoryWeight] = useState(10);

  // Edit assignment
  const [editingAssignment, setEditingAssignment] = useState<{
    categoryId: string;
    assignmentId: string;
  } | null>(null);

  const colorOptions = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-red-500",
    "from-purple-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
  ];

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: GradeCategory = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        weight: newCategoryWeight,
        color: colorOptions[categories.length % colorOptions.length],
        assignments: [],
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName("");
      setNewCategoryWeight(10);
      setShowAddCategory(false);
    }
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const updateCategoryWeight = (id: string, weight: number) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, weight } : cat))
    );
  };

  const addAssignment = (categoryId: string) => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: "New Assignment",
      maxPoints: 100,
      dueDate: new Date().toISOString().split("T")[0],
    };
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, assignments: [...cat.assignments, newAssignment] }
          : cat
      )
    );
  };

  const removeAssignment = (categoryId: string, assignmentId: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              assignments: cat.assignments.filter((a) => a.id !== assignmentId),
            }
          : cat
      )
    );
  };

  const updateAssignment = (
    categoryId: string,
    assignmentId: string,
    updates: Partial<Assignment>
  ) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              assignments: cat.assignments.map((a) =>
                a.id === assignmentId ? { ...a, ...updates } : a
              ),
            }
          : cat
      )
    );
  };

  const handleSave = () => {
    console.log("Saving grading configuration:", {
      categories,
      gradingScale,
      passingGrade,
    });
    router.push("/dashboard/grades");
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
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href="/dashboard/grades"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Grade Book
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
              Configure Grading System ⚙️
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Customize your gradebook structure and grading criteria
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Grading Scale */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Grading Scale
                </h2>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Scale Type
                    </label>
                    <select
                      value={gradingScale}
                      onChange={(e) => setGradingScale(e.target.value)}
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                    >
                      <option value="letter">Letter Grade (A-F)</option>
                      <option value="percentage">Percentage (0-100%)</option>
                      <option value="points">Points Based</option>
                      <option value="passfail">Pass/Fail</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Passing Grade (%)
                    </label>
                    <input
                      type="number"
                      value={passingGrade}
                      onChange={(e) => setPassingGrade(Number(e.target.value))}
                      min="0"
                      max="100"
                      className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                </div>

                {gradingScale === "letter" && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-5">
                    {[
                      { grade: "A", min: 90, color: "from-green-500 to-emerald-500" },
                      { grade: "B", min: 80, color: "from-blue-500 to-cyan-500" },
                      { grade: "C", min: 70, color: "from-yellow-500 to-orange-500" },
                      { grade: "D", min: 60, color: "from-orange-500 to-red-500" },
                      { grade: "F", min: 0, color: "from-red-500 to-pink-500" },
                    ].map((item) => (
                      <div
                        key={item.grade}
                        className={`rounded-2xl border border-white/20 bg-gradient-to-br ${item.color} p-4 text-center text-white`}
                      >
                        <div className="text-2xl font-bold">{item.grade}</div>
                        <div className="text-xs">{item.min}%+</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Grade Categories */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Grade Categories
                  </h2>
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </button>
                </div>

                {/* Add Category Form */}
                {showAddCategory && (
                  <div className="mb-6 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
                    <div className="mb-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Category Name
                        </label>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Homework"
                          className="h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Weight (%)
                        </label>
                        <input
                          type="number"
                          value={newCategoryWeight}
                          onChange={(e) => setNewCategoryWeight(Number(e.target.value))}
                          min="0"
                          max="100"
                          className="h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={addCategory}
                        className="flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategoryName("");
                          setNewCategoryWeight(10);
                        }}
                        className="flex h-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Categories List */}
                <div className="space-y-4">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm dark:border-white/10"
                    >
                      {/* Category Header */}
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 text-neutral-400" />
                            <div
                              className={`h-10 w-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white font-bold text-sm`}
                            >
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900 dark:text-white">
                              {category.name}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {category.assignments.length} assignment(s)
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeCategory(category.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Weight Slider */}
                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                            Weight
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white">
                            {category.weight}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={category.weight}
                          onChange={(e) =>
                            updateCategoryWeight(category.id, Number(e.target.value))
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 dark:bg-white/10"
                          style={{
                            background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${category.weight}%, rgba(255,255,255,0.2) ${category.weight}%, rgba(255,255,255,0.2) 100%)`,
                          }}
                        />
                      </div>

                      {/* Assignments */}
                      <div className="space-y-2">
                        {category.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 dark:bg-white/5"
                          >
                            <div className="flex-1">
                              <input
                                type="text"
                                value={assignment.name}
                                onChange={(e) =>
                                  updateAssignment(category.id, assignment.id, {
                                    name: e.target.value,
                                  })
                                }
                                className="w-full border-0 bg-transparent text-sm font-medium text-neutral-900 focus:outline-none dark:text-white"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                value={assignment.maxPoints}
                                onChange={(e) =>
                                  updateAssignment(category.id, assignment.id, {
                                    maxPoints: Number(e.target.value),
                                  })
                                }
                                className="w-20 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-center text-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                              />
                              <input
                                type="date"
                                value={assignment.dueDate}
                                onChange={(e) =>
                                  updateAssignment(category.id, assignment.id, {
                                    dueDate: e.target.value,
                                  })
                                }
                                className="w-32 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                              />
                              <button
                                onClick={() =>
                                  removeAssignment(category.id, assignment.id)
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-500/20"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addAssignment(category.id)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/30 bg-white/5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-white/10 dark:text-neutral-300"
                        >
                          <Plus className="h-4 w-4" />
                          Add Assignment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Summary */}
            <div className="space-y-6">
              {/* Weight Summary */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-neutral-900 dark:text-white">
                  <Percent className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Weight Summary
                </h3>

                <div className="mb-4 space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {cat.name}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {cat.weight}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      Total Weight
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        totalWeight === 100
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {totalWeight}%
                    </span>
                  </div>
                  {totalWeight !== 100 && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                      ⚠️ Total weight must equal 100%
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Save Button */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button
                  onClick={handleSave}
                  disabled={totalWeight !== 100}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <Save className="h-5 w-5" />
                  Save Configuration
                </button>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 backdrop-blur-sm"
              >
                <h3 className="mb-3 font-semibold text-blue-900 dark:text-blue-100">
                  💡 Configuration Tips
                </h3>
                <ul className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
                  <li>• Total category weights must equal 100%</li>
                  <li>• Drag categories to reorder them</li>
                  <li>• Add multiple assignments per category</li>
                  <li>• Set max points for each assignment</li>
                  <li>• Configure due dates for planning</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

