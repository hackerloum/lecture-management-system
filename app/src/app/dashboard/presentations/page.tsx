"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Upload,
  FileText,
  Presentation,
  Video,
  Image as ImageIcon,
  Trash2,
  Play,
  Edit,
  Download,
  Share2,
  Clock,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock data
interface Presentation {
  id: string;
  title: string;
  type: "ppt" | "pdf" | "video" | "images";
  thumbnail: string;
  slides: number;
  duration: string;
  lastModified: Date;
  fileSize: string;
  course: string;
}

const mockPresentations: Presentation[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    type: "ppt",
    thumbnail: "https://via.placeholder.com/400x300/667eea/ffffff?text=Algorithms",
    slides: 45,
    duration: "50 min",
    lastModified: new Date("2025-11-08"),
    fileSize: "12.5 MB",
    course: "CS 201",
  },
  {
    id: "2",
    title: "Data Structures Overview",
    type: "pdf",
    thumbnail: "https://via.placeholder.com/400x300/f093fb/ffffff?text=Data+Structures",
    slides: 32,
    duration: "40 min",
    lastModified: new Date("2025-11-05"),
    fileSize: "8.3 MB",
    course: "CS 201",
  },
  {
    id: "3",
    title: "Database Design Tutorial",
    type: "video",
    thumbnail: "https://via.placeholder.com/400x300/4facfe/ffffff?text=Database+Video",
    slides: 1,
    duration: "1h 15min",
    lastModified: new Date("2025-11-03"),
    fileSize: "245 MB",
    course: "CS 301",
  },
  {
    id: "4",
    title: "Software Architecture Diagrams",
    type: "images",
    thumbnail: "https://via.placeholder.com/400x300/00f2fe/ffffff?text=Architecture",
    slides: 18,
    duration: "25 min",
    lastModified: new Date("2025-11-01"),
    fileSize: "5.7 MB",
    course: "CS 401",
  },
];

export default function PresentationsPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  
  const [presentations, setPresentations] = useState(mockPresentations);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"all" | "ppt" | "pdf" | "video" | "images">("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredPresentations = presentations.filter((pres) => {
    const matchesSearch = pres.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pres.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || pres.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ppt":
        return <Presentation className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "images":
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ppt":
        return "from-orange-500 to-red-500";
      case "pdf":
        return "from-red-500 to-pink-500";
      case "video":
        return "from-blue-500 to-cyan-500";
      case "images":
        return "from-purple-500 to-pink-500";
      default:
        return "from-neutral-500 to-neutral-600";
    }
  };

  const handlePresent = (id: string) => {
    router.push(`/dashboard/presentations/${id}/present`);
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
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-white">
                  My Presentations
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Upload, manage, and present your course materials
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Upload className="h-5 w-5" />
                Upload Presentation
              </button>
            </div>
          </motion.div>

          {/* Filters & Search */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search presentations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-4 text-sm backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="h-12 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="images">Images</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-neutral-600 hover:bg-white/20 dark:text-neutral-400"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-neutral-600 hover:bg-white/20 dark:text-neutral-400"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Presentations Grid/List */}
          {filteredPresentations.length === 0 ? (
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center rounded-3xl border border-white/20 bg-white/10 p-16 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
            >
              <FolderOpen className="mb-4 h-20 w-20 text-neutral-400" />
              <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
                No presentations found
              </h2>
              <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                Upload your first presentation to get started
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Upload className="h-5 w-5" />
                Upload Presentation
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPresentations.map((pres, index) => (
                <motion.div
                  key={pres.id}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className="group rounded-2xl border border-white/20 bg-white/10 overflow-hidden backdrop-blur-sm transition hover:border-purple-500/50 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900">
                    <img
                      src={pres.thumbnail}
                      alt={pres.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => handlePresent(pres.id)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-purple-600 shadow-lg transition hover:bg-white hover:scale-110"
                        title="Present"
                      >
                        <Play className="h-6 w-6" />
                      </button>
                      <button
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-lg transition hover:bg-white hover:scale-110"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Type Badge */}
                    <div className={`absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-gradient-to-r ${getTypeColor(pres.type)} px-3 py-1 text-xs font-semibold text-white shadow-lg`}>
                      {getTypeIcon(pres.type)}
                      {pres.type.toUpperCase()}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
                      {pres.title}
                    </h3>
                    <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {pres.course}
                    </p>
                    
                    <div className="mb-4 flex items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {pres.slides} slides
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pres.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 dark:text-neutral-500">
                        {pres.lastModified.toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400"
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-500/10 dark:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPresentations.map((pres, index) => (
                <motion.div
                  key={pres.id}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition hover:border-purple-500/50 hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getTypeColor(pres.type)} text-white`}>
                    {getTypeIcon(pres.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="mb-1 font-bold text-neutral-900 dark:text-white">
                      {pres.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                      <span>{pres.course}</span>
                      <span>•</span>
                      <span>{pres.slides} slides</span>
                      <span>•</span>
                      <span>{pres.duration}</span>
                      <span>•</span>
                      <span>{pres.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePresent(pres.id)}
                      className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      <Play className="h-4 w-4" />
                      Present
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-neutral-600 transition hover:bg-white/20 dark:text-neutral-400">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal (placeholder) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-white p-8 shadow-2xl dark:bg-neutral-900"
          >
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
              Upload Presentation
            </h2>
            
            <div className="mb-6 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-700 dark:bg-neutral-800">
              <Upload className="mx-auto mb-4 h-16 w-16 text-neutral-400" />
              <p className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white">
                Drag & drop your files here
              </p>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                or click to browse
              </p>
              <p className="text-xs text-neutral-500">
                Supports: PPT, PPTX, PDF, MP4, JPG, PNG (Max 500MB)
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

