"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Target,
  Users,
  Award,
  Clock,
  Activity,
  ArrowRight,
  RefreshCw,
  Download,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { useState } from "react";

import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";

// Mock AI Insights Data
const aiInsights = {
  summary: {
    overallScore: 87,
    trend: "up",
    lastUpdated: "2 minutes ago",
    confidence: 94,
  },
  predictions: [
    {
      id: 1,
      type: "risk",
      title: "5 Students at Risk of Dropping Below Passing Grade",
      description: "Based on current performance trends, these students may need immediate intervention.",
      severity: "high",
      confidence: 92,
      students: ["Mike Brown", "John Smith", "Sarah Wilson", "Alex Turner", "Emma Davis"],
      action: "View At-Risk Students",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
    },
    {
      id: 2,
      type: "opportunity",
      title: "12 Students Ready for Advanced Material",
      description: "These students are excelling and would benefit from more challenging content.",
      severity: "medium",
      confidence: 88,
      students: ["Emily Chen", "David Lee", "Lisa Park"],
      action: "View High Performers",
      icon: Sparkles,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      type: "attendance",
      title: "Attendance Pattern Anomaly Detected",
      description: "CS 301 shows unusual attendance drop on Fridays. Consider rescheduling.",
      severity: "medium",
      confidence: 85,
      action: "View Attendance Report",
      icon: Users,
      color: "from-orange-500 to-yellow-500",
    },
  ],
  recommendations: [
    {
      id: 1,
      title: "Optimize Assignment Deadlines",
      description: "Students perform 23% better when deadlines are on Tuesday-Thursday vs. Monday/Friday.",
      impact: "High",
      effort: "Low",
      category: "Scheduling",
      icon: Calendar,
      stats: "+23% performance",
    },
    {
      id: 2,
      title: "Increase Quiz Frequency in CS 201",
      description: "Data shows students in courses with weekly quizzes retain 31% more information.",
      impact: "High",
      effort: "Medium",
      category: "Assessment",
      icon: Target,
      stats: "+31% retention",
    },
    {
      id: 3,
      title: "Add More Visual Content",
      description: "Courses with 40%+ visual content see 18% higher engagement rates.",
      impact: "Medium",
      effort: "Medium",
      category: "Content",
      icon: Lightbulb,
      stats: "+18% engagement",
    },
    {
      id: 4,
      title: "Implement Peer Review System",
      description: "Peer-reviewed assignments show 27% improvement in critical thinking skills.",
      impact: "High",
      effort: "High",
      category: "Pedagogy",
      icon: Users,
      stats: "+27% critical thinking",
    },
  ],
  trends: [
    {
      title: "Overall Class Performance",
      current: 82.5,
      previous: 78.3,
      change: "+5.4%",
      trend: "up",
      description: "Class average has improved consistently over the past 4 weeks.",
    },
    {
      title: "Assignment Submission Rate",
      current: 89,
      previous: 92,
      change: "-3.3%",
      trend: "down",
      description: "Slight decrease in on-time submissions. Consider deadline adjustments.",
    },
    {
      title: "Student Engagement",
      current: 76,
      previous: 74,
      change: "+2.7%",
      trend: "up",
      description: "Student participation in discussions and activities is increasing.",
    },
    {
      title: "Attendance Rate",
      current: 91,
      previous: 88,
      change: "+3.4%",
      trend: "up",
      description: "QR code attendance system has improved participation tracking.",
    },
  ],
  topInsights: [
    {
      id: 1,
      type: "success",
      title: "Gamification Boost",
      description: "Students with achievement badges complete 34% more optional assignments.",
      metric: "+34%",
      icon: Award,
    },
    {
      id: 2,
      type: "warning",
      title: "Late Night Submissions",
      description: "42% of assignments are submitted between 11 PM - 2 AM, indicating poor time management.",
      metric: "42%",
      icon: Clock,
    },
    {
      id: 3,
      type: "info",
      title: "Preferred Learning Time",
      description: "Peak engagement occurs between 2 PM - 4 PM. Schedule important topics accordingly.",
      metric: "2-4 PM",
      icon: Activity,
    },
  ],
  studentSegments: [
    {
      name: "High Performers",
      count: 18,
      percentage: 32,
      avgGpa: 3.8,
      color: "from-green-500 to-emerald-500",
      description: "Consistently excellent performance",
    },
    {
      name: "Steady Performers",
      count: 25,
      percentage: 44,
      avgGpa: 3.2,
      color: "from-blue-500 to-cyan-500",
      description: "Meeting expectations reliably",
    },
    {
      name: "Inconsistent",
      count: 9,
      percentage: 16,
      avgGpa: 2.6,
      color: "from-yellow-500 to-orange-500",
      description: "Variable performance patterns",
    },
    {
      name: "At Risk",
      count: 5,
      percentage: 8,
      avgGpa: 2.1,
      color: "from-red-500 to-pink-500",
      description: "Requires immediate attention",
    },
  ],
};

export default function AIInsightsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "from-red-500 to-pink-500";
      case "medium":
        return "from-orange-500 to-yellow-500";
      case "low":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-neutral-500 to-neutral-600";
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      High: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      Medium: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      Low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    };
    return colors[impact as keyof typeof colors] || colors.Low;
  };

  const getEffortBadge = (effort: string) => {
    const colors = {
      High: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      Medium: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      Low: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    };
    return colors[effort as keyof typeof colors] || colors.Medium;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <DashboardNavigation />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-10"
        aria-hidden
      />

      <main className="relative z-10 px-4 py-24 sm:px-6 lg:py-32">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
                      AI Insights
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Updated {aiInsights.summary.lastUpdated} • {aiInsights.summary.confidence}% confidence
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="h-11 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white [&>option]:bg-white [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-800 dark:[&>option]:text-white"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-50 dark:border-white/10 dark:bg-white/5"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>
          </motion.div>

          {/* Overall Score Card */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm dark:border-white/10"
          >
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-lg text-neutral-600 dark:text-neutral-400">
                    Overall AI Performance Score
                  </h2>
                  <div className="flex items-end gap-4">
                    <div className="text-6xl font-bold text-neutral-900 dark:text-white">
                      {aiInsights.summary.overallScore}
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-2xl font-bold text-green-600 dark:text-green-400">
                      <TrendingUp className="h-6 w-6" />
                      +5.2
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Your teaching performance is excellent and improving steadily.
                  </p>
                </div>
                <div className="relative h-40 w-40">
                  <svg className="h-40 w-40 -rotate-90 transform">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="transparent"
                      className="text-white/20 dark:text-white/10"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 - (440 * aiInsights.summary.overallScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{
                        strokeDasharray: 440,
                      }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Key Trends */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">
              Key Performance Trends
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {aiInsights.trends.map((trend, index) => (
                <motion.div
                  key={trend.title}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {trend.current}%
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-bold ${
                        trend.trend === "up"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {trend.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {trend.change}
                    </div>
                  </div>
                  <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">
                    {trend.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    {trend.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Predictions & Recommendations */}
            <div className="space-y-8 lg:col-span-2">
              {/* AI Predictions */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">
                  🔮 AI Predictions & Alerts
                </h2>
                <div className="space-y-4">
                  {aiInsights.predictions.map((prediction, index) => {
                    const Icon = prediction.icon;
                    return (
                      <motion.div
                        key={prediction.id}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className={`h-1 bg-gradient-to-r ${prediction.color}`} />
                        <div className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${prediction.color}`}>
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="mb-1 text-lg font-bold text-neutral-900 dark:text-white">
                                  {prediction.title}
                                </h3>
                                <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                                  {prediction.description}
                                </p>
                                {prediction.students && (
                                  <div className="mb-3 flex flex-wrap gap-2">
                                    {prediction.students.slice(0, 3).map((student, idx) => (
                                      <span
                                        key={idx}
                                        className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                                      >
                                        {student}
                                      </span>
                                    ))}
                                    {prediction.students.length > 3 && (
                                      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        +{prediction.students.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className={`rounded-lg bg-gradient-to-r ${getSeverityColor(prediction.severity)} px-3 py-1 text-xs font-bold text-white`}>
                                {prediction.confidence}% confident
                              </div>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300">
                            {prediction.action}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* AI Recommendations */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">
                  💡 Smart Recommendations
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {aiInsights.recommendations.map((rec, index) => {
                    const Icon = rec.icon;
                    return (
                      <motion.div
                        key={rec.id}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-right">
                            <div className={`mb-1 inline-block rounded border px-2 py-0.5 text-xs font-bold ${getImpactBadge(rec.impact)}`}>
                              {rec.impact} Impact
                            </div>
                            <div className={`inline-block rounded border px-2 py-0.5 text-xs font-bold ${getEffortBadge(rec.effort)}`}>
                              {rec.effort} Effort
                            </div>
                          </div>
                        </div>
                        <h3 className="mb-2 font-bold text-neutral-900 dark:text-white">
                          {rec.title}
                        </h3>
                        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                          {rec.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
                            {rec.category}
                          </span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {rec.stats}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Insights & Segments */}
            <div className="space-y-8">
              {/* Top Insights */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  🎯 Quick Insights
                </h2>
                <div className="space-y-4">
                  {aiInsights.topInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <motion.div
                        key={insight.id}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 dark:bg-white/5"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <h3 className="font-semibold text-neutral-900 dark:text-white">
                              {insight.title}
                            </h3>
                          </div>
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {insight.metric}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {insight.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Student Segments */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              >
                <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-white">
                  👥 Student Segments
                </h2>
                <div className="space-y-4">
                  {aiInsights.studentSegments.map((segment, index) => (
                    <motion.div
                      key={segment.name}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {segment.name}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {segment.description}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-neutral-900 dark:text-white">
                            {segment.count}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            GPA: {segment.avgGpa}
                          </div>
                        </div>
                      </div>
                      <div className="relative h-3 overflow-hidden rounded-full bg-white/20 dark:bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${segment.percentage}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${segment.color}`}
                        />
                      </div>
                      <div className="mt-1 text-xs text-right font-medium text-neutral-600 dark:text-neutral-400">
                        {segment.percentage}% of students
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Status */}
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 backdrop-blur-sm dark:border-white/10"
              >
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                  <h3 className="font-bold text-neutral-900 dark:text-white">AI System Status</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Model Version</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">GPT-4.5 Turbo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Data Points</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">12,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Accuracy Rate</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Last Training</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">12 hours ago</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

