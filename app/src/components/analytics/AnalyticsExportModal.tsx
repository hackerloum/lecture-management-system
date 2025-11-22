"use client";

import { useState } from "react";
import { X, FileText, FileSpreadsheet, Download, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalyticsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const analyticsDataSections = [
  { id: "performance", label: "Performance Trends", description: "Monthly performance metrics" },
  { id: "distribution", label: "Grade Distribution", description: "Student grade breakdown" },
  { id: "courses", label: "Course Performance", description: "Individual course statistics" },
  { id: "topPerformers", label: "Top Performers", description: "Leaderboard rankings" },
  { id: "insights", label: "Key Insights", description: "Performance indicators" },
  { id: "attendance", label: "Attendance Analytics", description: "Attendance trends and patterns" },
];

const excelTemplates = [
  { id: "professional", name: "Professional Report", description: "Formatted with charts and tables" },
  { id: "detailed", name: "Detailed Analysis", description: "Comprehensive data breakdown" },
  { id: "summary", name: "Executive Summary", description: "High-level overview" },
  { id: "comparison", name: "Comparative Analysis", description: "Side-by-side comparisons" },
];

const colorSchemes = [
  { id: "blue", name: "Professional Blue", colors: ["#1e3a8a", "#3b82f6", "#60a5fa"] },
  { id: "purple", name: "Modern Purple", colors: ["#6b21a8", "#9333ea", "#a855f7"] },
  { id: "green", name: "Success Green", colors: ["#065f46", "#059669", "#10b981"] },
  { id: "academic", name: "Academic Burgundy", colors: ["#881337", "#be123c", "#e11d48"] },
];

const chartTypes = [
  { id: "bar", name: "Bar Charts", icon: "📊" },
  { id: "line", name: "Line Charts", icon: "📈" },
  { id: "pie", name: "Pie Charts", icon: "🥧" },
  { id: "area", name: "Area Charts", icon: "📉" },
];

export default function AnalyticsExportModal({ isOpen, onClose }: AnalyticsExportModalProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("excel");
  const [selectedSections, setSelectedSections] = useState<string[]>(["performance", "distribution", "courses"]);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [selectedColorScheme, setSelectedColorScheme] = useState("blue");
  const [selectedCharts, setSelectedCharts] = useState<string[]>(["bar", "line", "pie"]);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [autoFitColumns, setAutoFitColumns] = useState(true);
  const [freezeHeaders, setFreezeHeaders] = useState(true);
  const [addFilters, setAddFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // PDF options
  const [pdfOrientation, setPdfOrientation] = useState<"portrait" | "landscape">("landscape");
  const [pdfPageSize, setPdfPageSize] = useState("A4");
  const [includeLogo, setIncludeLogo] = useState(true);

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const toggleChart = (chartId: string) => {
    setSelectedCharts((prev) =>
      prev.includes(chartId) ? prev.filter((id) => id !== chartId) : [...prev, chartId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Exporting analytics with:", {
      format: exportFormat,
      sections: selectedSections,
      template: exportFormat === "excel" ? selectedTemplate : null,
      colorScheme: exportFormat === "excel" ? selectedColorScheme : null,
      charts: exportFormat === "excel" ? selectedCharts : null,
      options: {
        includeCharts,
        includeRawData,
        includeSummary,
        autoFitColumns: exportFormat === "excel" ? autoFitColumns : null,
        freezeHeaders: exportFormat === "excel" ? freezeHeaders : null,
        addFilters: exportFormat === "excel" ? addFilters : null,
        pdfOrientation: exportFormat === "pdf" ? pdfOrientation : null,
        pdfPageSize: exportFormat === "pdf" ? pdfPageSize : null,
        includeLogo: exportFormat === "pdf" ? includeLogo : null,
      },
    });

    setIsExporting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Export Analytics Report
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Customize and download your analytics data
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Format Selection */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                    Export Format
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => setExportFormat("excel")}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                        exportFormat === "excel"
                          ? "border-green-600/50 bg-green-600/10 dark:border-green-500/50 dark:bg-green-500/10"
                          : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                      }`}
                    >
                      <FileSpreadsheet className={`h-6 w-6 ${exportFormat === "excel" ? "text-green-600 dark:text-green-400" : "text-neutral-600 dark:text-neutral-400"}`} />
                      <div className="text-left">
                        <div className="font-semibold text-neutral-900 dark:text-white">Excel (.xlsx)</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Professional spreadsheet with charts
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setExportFormat("pdf")}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition ${
                        exportFormat === "pdf"
                          ? "border-red-600/50 bg-red-600/10 dark:border-red-500/50 dark:bg-red-500/10"
                          : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                      }`}
                    >
                      <FileText className={`h-6 w-6 ${exportFormat === "pdf" ? "text-red-600 dark:text-red-400" : "text-neutral-600 dark:text-neutral-400"}`} />
                      <div className="text-left">
                        <div className="font-semibold text-neutral-900 dark:text-white">PDF Document</div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Print-ready report
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Data Sections */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                    Select Data to Include
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {analyticsDataSections.map((section) => (
                      <label
                        key={section.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                          selectedSections.includes(section.id)
                            ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                            : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSections.includes(section.id)}
                          onChange={() => toggleSection(section.id)}
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {section.label}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {section.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Excel-specific options */}
                {exportFormat === "excel" && (
                  <>
                    {/* Template Selection */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                        Excel Template
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {excelTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={`rounded-xl border p-3 text-left transition ${
                              selectedTemplate === template.id
                                ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                                : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                            }`}
                          >
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              {template.name}
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {template.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                        Color Scheme
                      </label>
                      <div className="grid gap-3 sm:grid-cols-4">
                        {colorSchemes.map((scheme) => (
                          <button
                            key={scheme.id}
                            onClick={() => setSelectedColorScheme(scheme.id)}
                            className={`rounded-xl border p-3 transition ${
                              selectedColorScheme === scheme.id
                                ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                                : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                            }`}
                          >
                            <div className="mb-2 flex gap-1">
                              {scheme.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="h-4 flex-1 rounded"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="text-xs font-medium text-neutral-900 dark:text-white">
                              {scheme.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Types */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                        Include Charts
                      </label>
                      <div className="grid gap-2 sm:grid-cols-4">
                        {chartTypes.map((chart) => (
                          <label
                            key={chart.id}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${
                              selectedCharts.includes(chart.id)
                                ? "border-purple-600/50 bg-purple-600/10 dark:border-purple-500/50 dark:bg-purple-500/10"
                                : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCharts.includes(chart.id)}
                              onChange={() => toggleChart(chart.id)}
                              className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                            />
                            <span className="text-lg">{chart.icon}</span>
                            <span className="text-xs font-medium text-neutral-900 dark:text-white">
                              {chart.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Excel Options */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                        Advanced Options
                      </label>
                      <div className="space-y-2">
                        {[
                          { state: autoFitColumns, setState: setAutoFitColumns, label: "Auto-fit column widths" },
                          { state: freezeHeaders, setState: setFreezeHeaders, label: "Freeze header rows" },
                          { state: addFilters, setState: setAddFilters, label: "Add auto-filters to tables" },
                          { state: includeRawData, setState: setIncludeRawData, label: "Include raw data sheet" },
                        ].map((option, idx) => (
                          <label
                            key={idx}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                          >
                            <input
                              type="checkbox"
                              checked={option.state}
                              onChange={(e) => option.setState(e.target.checked)}
                              className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                            />
                            <span className="text-sm text-neutral-900 dark:text-white">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* PDF-specific options */}
                {exportFormat === "pdf" && (
                  <>
                    {/* Page Setup */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-900 dark:text-white">
                          Orientation
                        </label>
                        <select
                          value={pdfOrientation}
                          onChange={(e) => setPdfOrientation(e.target.value as "portrait" | "landscape")}
                          className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-900 dark:text-white">
                          Page Size
                        </label>
                        <select
                          value={pdfPageSize}
                          onChange={(e) => setPdfPageSize(e.target.value)}
                          className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                        >
                          <option value="A4">A4</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>
                    </div>

                    {/* PDF Options */}
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-white">
                        PDF Options
                      </label>
                      <div className="space-y-2">
                        {[
                          { state: includeLogo, setState: setIncludeLogo, label: "Include institution logo" },
                          { state: includeSummary, setState: setIncludeSummary, label: "Include executive summary" },
                          { state: includeCharts, setState: setIncludeCharts, label: "Include visual charts" },
                        ].map((option, idx) => (
                          <label
                            key={idx}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                          >
                            <input
                              type="checkbox"
                              checked={option.state}
                              onChange={(e) => option.setState(e.target.checked)}
                              className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
                            />
                            <span className="text-sm text-neutral-900 dark:text-white">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {selectedSections.length} section{selectedSections.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 px-6 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || selectedSections.length === 0}
                  className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export {exportFormat === "excel" ? "Excel" : "PDF"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

