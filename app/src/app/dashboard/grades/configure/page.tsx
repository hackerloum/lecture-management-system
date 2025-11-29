"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Percent,
  Award,
  FileText,
  Trash2,
  GripVertical,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  color: string;
  assignments: Assignment[];
  dbId?: string; // Database ID for existing categories
}

interface Assignment {
  id: string;
  name: string;
  maxPoints: number;
  dueDate: string;
  dbId?: string; // Database ID for existing assignments
}

interface Course {
  id: string;
  code: string;
  name: string;
}

function ConfigureGradesPageContent() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("courseId");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseIdParam || "");
  const [categories, setCategories] = useState<GradeCategory[]>([]);
  const [gradingScale, setGradingScale] = useState("letter");
  const [passingGrade, setPassingGrade] = useState(60);
  
  // Add new category
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryWeight, setNewCategoryWeight] = useState(10);

  // Edit assignment
  const [_editingAssignment, _setEditingAssignment] = useState<{
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

  // Fetch courses and load data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("Not authenticated");
        }

        // Fetch courses where user is a collaborator
        const { data: courseCollaborators, error: coursesError } = await supabase
          .from("course_collaborators")
          .select(`
            course_id,
            courses (
              id,
              code,
              name
            )
          `)
          .eq("profile_id", user.id);

        if (coursesError) {
          console.error("Courses error:", coursesError);
        }

        const fetchedCourses: Course[] = (courseCollaborators || [])
          .map((cc: any) => ({
            id: cc.courses.id,
            code: cc.courses.code,
            name: cc.courses.name,
          }))
          .filter((c: Course) => c.id);

        setCourses(fetchedCourses);

        // Auto-select first course if available and none selected
        if (fetchedCourses.length > 0 && !selectedCourseId) {
          setSelectedCourseId(fetchedCourses[0].id);
        }

        // Load data for selected course
        if (selectedCourseId || (fetchedCourses.length > 0 && fetchedCourses[0].id)) {
          const courseId = selectedCourseId || fetchedCourses[0].id;
          await loadCourseData(courseId);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Load course data when course selection changes
  useEffect(() => {
    if (selectedCourseId) {
      loadCourseData(selectedCourseId);
    }
  }, [selectedCourseId]);

  async function loadCourseData(courseId: string) {
    try {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();

      // Fetch grade categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("grade_categories")
        .select("id, name, weight, color, display_order")
        .eq("course_id", courseId)
        .order("display_order", { ascending: true });

      if (categoriesError) {
        console.error("Categories error:", categoriesError);
      }

      // Fetch assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from("assignments")
        .select("id, title, max_points, due_date, category_id")
        .eq("course_id", courseId)
        .order("due_date", { ascending: true });

      if (assignmentsError) {
        console.error("Assignments error:", assignmentsError);
      }

      // Map color names to gradient classes
      const colorNameMap: Record<string, string> = {
        blue: "from-blue-500 to-cyan-500",
        green: "from-green-500 to-emerald-500",
        orange: "from-orange-500 to-red-500",
        purple: "from-purple-500 to-pink-500",
        yellow: "from-yellow-500 to-orange-500",
        indigo: "from-indigo-500 to-purple-500",
      };

      // Build categories with assignments
      const loadedCategories: GradeCategory[] = (categoriesData || []).map((cat: any) => {
        const categoryAssignments = (assignmentsData || [])
          .filter((a: any) => a.category_id === cat.id)
          .map((a: any) => ({
            id: `a-${a.id}`,
            name: a.title,
            maxPoints: Number(a.max_points) || 100,
            dueDate: a.due_date ? new Date(a.due_date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            dbId: a.id,
          }));

        return {
          id: `c-${cat.id}`,
          name: cat.name,
          weight: Number(cat.weight) || 0,
          color: colorNameMap[cat.color] || colorOptions[0],
          assignments: categoryAssignments,
          dbId: cat.id,
        };
      });

      // If no categories exist, create default structure
      if (loadedCategories.length === 0) {
        setCategories([]);
      } else {
        setCategories(loadedCategories);
      }
    } catch (err) {
      console.error("Error loading course data:", err);
    } finally {
      setLoading(false);
    }
  }

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: GradeCategory = {
        id: `temp-${Date.now()}`,
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
      id: `temp-${Date.now()}`,
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

  const handleSave = async () => {
    if (!selectedCourseId) {
      alert("Please select a course");
      return;
    }

    if (totalWeight !== 100) {
      alert("Total weight must equal 100%");
      return;
    }

    try {
      setSaving(true);
      const supabase = createSupabaseBrowserClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Not authenticated");
      }

      // Save categories and assignments
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        let categoryDbId = category.dbId;

        // Extract color name from gradient class
        const colorName = category.color.includes("blue") ? "blue" :
          category.color.includes("green") ? "green" :
          category.color.includes("orange") ? "orange" :
          category.color.includes("purple") ? "purple" :
          category.color.includes("yellow") ? "yellow" :
          category.color.includes("indigo") ? "indigo" : "blue";

        // Create or update category
        if (categoryDbId) {
          // Update existing category
          const { error: updateError } = await supabase
            .from("grade_categories")
            .update({
              name: category.name,
              weight: category.weight,
              color: colorName,
              display_order: i,
              updated_at: new Date().toISOString(),
            })
            .eq("id", categoryDbId);

          if (updateError) {
            console.error("Error updating category:", updateError);
          }
        } else {
          // Create new category
          const { data: newCategory, error: createError } = await supabase
            .from("grade_categories")
            .insert({
              course_id: selectedCourseId,
              name: category.name,
              weight: category.weight,
              color: colorName,
              display_order: i,
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating category:", createError);
            continue;
          }

          categoryDbId = newCategory.id;
        }

        // Save assignments for this category
        for (const assignment of category.assignments) {
          if (assignment.dbId) {
            // Update existing assignment
            const { error: updateError } = await supabase
              .from("assignments")
              .update({
                title: assignment.name,
                max_points: assignment.maxPoints,
                due_date: assignment.dueDate ? new Date(assignment.dueDate).toISOString() : null,
                category_id: categoryDbId,
                updated_at: new Date().toISOString(),
              })
              .eq("id", assignment.dbId);

            if (updateError) {
              console.error("Error updating assignment:", updateError);
            }
          } else {
            // Create new assignment
            const { error: createError } = await supabase
              .from("assignments")
              .insert({
                course_id: selectedCourseId,
                category_id: categoryDbId,
                title: assignment.name,
                max_points: assignment.maxPoints,
                due_date: assignment.dueDate ? new Date(assignment.dueDate).toISOString() : null,
                type: "assignment",
                status: "published",
                created_by: user.id,
              });

            if (createError) {
              console.error("Error creating assignment:", createError);
            }
          }
        }
      }

      // Delete categories that were removed (if any)
      // Note: This is simplified - in production, you'd want to track deleted items
      
      router.push(`/dashboard/grades?courseId=${selectedCourseId}`);
    } catch (err) {
      console.error("Error saving configuration:", err);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setSaving(false);
    }
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
          {loading && !selectedCourseId ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
                <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  Loading configuration...
                </div>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
                <div className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                  No courses found
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  You need to be assigned to a course to configure grades
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* Back Button */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link
              href={`/dashboard/grades${selectedCourseId ? `?courseId=${selectedCourseId}` : ""}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-purple-600 dark:text-neutral-300 dark:hover:text-purple-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Grade Book
            </Link>
          </motion.div>

          {/* Course Selection */}
          {courses.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <label htmlFor="course-select" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Select Course
              </label>
              <select
                id="course-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="h-12 w-full max-w-md rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

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
                    <label htmlFor="scale-type" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Scale Type
                    </label>
                    <select
                      id="scale-type"
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
                    <label htmlFor="passing-grade" className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Passing Grade (%)
                    </label>
                    <input
                      id="passing-grade"
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
                        <label htmlFor="category-name" className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Category Name
                        </label>
                        <input
                          id="category-name"
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Homework"
                          className="h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                        />
                      </div>
                      <div>
                        <label htmlFor="category-weight" className="mb-2 block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Weight (%)
                        </label>
                        <input
                          id="category-weight"
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
                  disabled={totalWeight !== 100 || !selectedCourseId || saving || loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Configuration
                    </>
                  )}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Force dynamic rendering to prevent static generation issues with useSearchParams
export const dynamic = 'force-dynamic';

export default function ConfigureGradesPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
        <DashboardNavigation />
        <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
                <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                  Loading configuration...
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    }>
      <ConfigureGradesPageContent />
    </Suspense>
  );
}
