"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  FileSpreadsheet,
  Download,
  Check,
  Settings,
  Eye,
  Palette,
  Layout,
  Filter,
} from "lucide-react";
import { useState } from "react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal = ({ isOpen, onClose }: ExportModalProps) => {
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("excel");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "studentName",
    "studentId",
    "assignments",
    "quizzes",
    "midterm",
    "final",
    "average",
  ]);

  // Excel specific options
  const [excelStyle, setExcelStyle] = useState("professional");
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);
  const [includeStatistics, setIncludeStatistics] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [colorScheme, setColorScheme] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [freezePanes, setFreezePanes] = useState(true);
  const [autoFilter, setAutoFilter] = useState(true);
  const [columnWidth, setColumnWidth] = useState("auto");

  // PDF specific options
  const [pdfOrientation, setPdfOrientation] = useState("landscape");
  const [pdfPageSize, setPdfPageSize] = useState("A4");
  const [pdfIncludeLogo, setPdfIncludeLogo] = useState(true);

  const availableColumns = [
    { id: "studentName", label: "Student Name", category: "Basic" },
    { id: "studentId", label: "Student ID", category: "Basic" },
    { id: "email", label: "Email", category: "Basic" },
    { id: "assignments", label: "Assignments", category: "Grades" },
    { id: "quizzes", label: "Quizzes", category: "Grades" },
    { id: "midterm", label: "Midterm Exam", category: "Grades" },
    { id: "final", label: "Final Exam", category: "Grades" },
    { id: "average", label: "Average Grade", category: "Summary" },
    { id: "letterGrade", label: "Letter Grade", category: "Summary" },
    { id: "status", label: "Status", category: "Summary" },
    { id: "attendance", label: "Attendance %", category: "Additional" },
    { id: "trend", label: "Trend", category: "Additional" },
  ];

  const colorSchemes = [
    { id: "blue", name: "Professional Blue", primary: "#1e40af", secondary: "#3b82f6" },
    { id: "green", name: "Academic Green", primary: "#166534", secondary: "#22c55e" },
    { id: "purple", name: "Modern Purple", primary: "#6b21a8", secondary: "#a855f7" },
    { id: "gray", name: "Classic Gray", primary: "#374151", secondary: "#6b7280" },
    { id: "red", name: "Bold Red", primary: "#991b1b", secondary: "#ef4444" },
  ];

  const excelStyles = [
    {
      id: "professional",
      name: "Professional",
      description: "Corporate style with borders, alternating rows, and bold headers",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Traditional academic format with clean lines and serif fonts",
    },
    {
      id: "modern",
      name: "Modern Minimal",
      description: "Clean, minimalist design with subtle colors and sans-serif fonts",
    },
    {
      id: "colorful",
      name: "Colorful",
      description: "Vibrant colors with gradients and visual highlights",
    },
    {
      id: "compact",
      name: "Compact",
      description: "Dense layout with smaller fonts to fit more data",
    },
  ];

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns.map((col) => col.id));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExport = () => {
    const exportConfig = {
      format: exportFormat,
      columns: selectedColumns,
      ...(exportFormat === "excel" && {
        style: excelStyle,
        includeHeader,
        includeFooter,
        includeStatistics,
        includeCharts,
        colorScheme,
        fontSize,
        includeFormulas,
        freezePanes,
        autoFilter,
        columnWidth,
      }),
      ...(exportFormat === "pdf" && {
        orientation: pdfOrientation,
        pageSize: pdfPageSize,
        includeLogo: pdfIncludeLogo,
      }),
    };

    console.log("Exporting with configuration:", exportConfig);
    // Here you would call your export API
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/95"
            >
              {/* Header */}
              <div className="border-b border-neutral-200 bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-6 dark:border-neutral-700 dark:from-purple-950/30 dark:to-blue-950/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Export Grade Book
                    </h2>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      Customize your export with professional formatting options
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-neutral-600 transition hover:bg-white dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(90vh - 180px)" }}>
                <div className="grid gap-8 lg:grid-cols-3">
                  {/* Left Column - Format Selection */}
                  <div className="space-y-6">
                    {/* Format Selection */}
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Export Format
                      </h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setExportFormat("excel")}
                          className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition ${
                            exportFormat === "excel"
                              ? "border-purple-600 bg-purple-50 dark:border-purple-500 dark:bg-purple-950/30"
                              : "border-neutral-200 bg-white hover:border-purple-300 dark:border-neutral-700 dark:bg-neutral-800"
                          }`}
                        >
                          <FileSpreadsheet
                            className={`h-8 w-8 ${
                              exportFormat === "excel"
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-neutral-400"
                            }`}
                          />
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              Excel Spreadsheet
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              Professional formatted .xlsx
                            </div>
                          </div>
                          {exportFormat === "excel" && (
                            <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </button>

                        <button
                          onClick={() => setExportFormat("pdf")}
                          className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 transition ${
                            exportFormat === "pdf"
                              ? "border-purple-600 bg-purple-50 dark:border-purple-500 dark:bg-purple-950/30"
                              : "border-neutral-200 bg-white hover:border-purple-300 dark:border-neutral-700 dark:bg-neutral-800"
                          }`}
                        >
                          <FileText
                            className={`h-8 w-8 ${
                              exportFormat === "pdf"
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-neutral-400"
                            }`}
                          />
                          <div className="flex-1 text-left">
                            <div className="font-semibold text-neutral-900 dark:text-white">
                              PDF Document
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              Print-ready .pdf format
                            </div>
                          </div>
                          {exportFormat === "pdf" && (
                            <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Column Selection */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                          <Filter className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          Select Columns
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={selectAllColumns}
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400"
                          >
                            All
                          </button>
                          <span className="text-neutral-400">|</span>
                          <button
                            onClick={deselectAllColumns}
                            className="text-xs font-semibold text-neutral-600 hover:text-neutral-700 dark:text-neutral-400"
                          >
                            None
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {["Basic", "Grades", "Summary", "Additional"].map((category) => (
                          <div key={category}>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                              {category}
                            </div>
                            <div className="space-y-1">
                              {availableColumns
                                .filter((col) => col.category === category)
                                .map((column) => (
                                  <label
                                    key={column.id}
                                    className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 cursor-pointer transition hover:border-purple-300 dark:border-neutral-700 dark:bg-neutral-800"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedColumns.includes(column.id)}
                                      onChange={() => toggleColumn(column.id)}
                                      className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                                    />
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                      {column.label}
                                    </span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Middle & Right Columns - Format-Specific Options */}
                  <div className="space-y-6 lg:col-span-2">
                    {exportFormat === "excel" ? (
                      <>
                        {/* Excel Style */}
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                            <Layout className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Excel Style Template
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {excelStyles.map((style) => (
                              <button
                                key={style.id}
                                onClick={() => setExcelStyle(style.id)}
                                className={`rounded-2xl border-2 p-4 text-left transition ${
                                  excelStyle === style.id
                                    ? "border-purple-600 bg-purple-50 dark:border-purple-500 dark:bg-purple-950/30"
                                    : "border-neutral-200 bg-white hover:border-purple-300 dark:border-neutral-700 dark:bg-neutral-800"
                                }`}
                              >
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="font-semibold text-neutral-900 dark:text-white">
                                    {style.name}
                                  </span>
                                  {excelStyle === style.id && (
                                    <Check className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  )}
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {style.description}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Color Scheme */}
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                            <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Color Scheme
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {colorSchemes.map((scheme) => (
                              <button
                                key={scheme.id}
                                onClick={() => setColorScheme(scheme.id)}
                                className={`rounded-xl border-2 p-3 transition ${
                                  colorScheme === scheme.id
                                    ? "border-purple-600"
                                    : "border-neutral-200 hover:border-purple-300 dark:border-neutral-700"
                                }`}
                              >
                                <div className="mb-2 flex gap-2">
                                  <div
                                    className="h-8 w-8 rounded-lg"
                                    style={{ backgroundColor: scheme.primary }}
                                  />
                                  <div
                                    className="h-8 w-8 rounded-lg"
                                    style={{ backgroundColor: scheme.secondary }}
                                  />
                                </div>
                                <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                                  {scheme.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Excel Options */}
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Excel Options
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={includeHeader}
                                onChange={(e) => setIncludeHeader(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Include Header
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Course name & date
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={includeFooter}
                                onChange={(e) => setIncludeFooter(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Include Footer
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Page numbers & info
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={includeStatistics}
                                onChange={(e) => setIncludeStatistics(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Statistics Sheet
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Summary stats tab
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={includeCharts}
                                onChange={(e) => setIncludeCharts(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Include Charts
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Visualizations
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={includeFormulas}
                                onChange={(e) => setIncludeFormulas(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Excel Formulas
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Live calculations
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={freezePanes}
                                onChange={(e) => setFreezePanes(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Freeze Panes
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Lock header rows
                                </div>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={autoFilter}
                                onChange={(e) => setAutoFilter(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Auto Filter
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Enable filtering
                                </div>
                              </div>
                            </label>
                          </div>

                          {/* Additional Settings */}
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Font Size
                              </label>
                              <select
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              >
                                <option value="small">Small (9pt)</option>
                                <option value="medium">Medium (11pt)</option>
                                <option value="large">Large (13pt)</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Column Width
                              </label>
                              <select
                                value={columnWidth}
                                onChange={(e) => setColumnWidth(e.target.value)}
                                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              >
                                <option value="auto">Auto-fit</option>
                                <option value="fixed">Fixed Width</option>
                                <option value="wrap">Text Wrap</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* PDF Options */
                      <div className="space-y-6">
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
                            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            PDF Options
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Page Orientation
                              </label>
                              <select
                                value={pdfOrientation}
                                onChange={(e) => setPdfOrientation(e.target.value)}
                                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              >
                                <option value="landscape">Landscape</option>
                                <option value="portrait">Portrait</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Page Size
                              </label>
                              <select
                                value={pdfPageSize}
                                onChange={(e) => setPdfPageSize(e.target.value)}
                                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                              >
                                <option value="A4">A4</option>
                                <option value="Letter">US Letter</option>
                                <option value="Legal">Legal</option>
                              </select>
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 cursor-pointer dark:border-neutral-700 dark:bg-neutral-800">
                              <input
                                type="checkbox"
                                checked={pdfIncludeLogo}
                                onChange={(e) => setPdfIncludeLogo(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                              />
                              <div>
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Include Institution Logo
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  Add logo to header
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-200 bg-neutral-50 px-8 py-6 dark:border-neutral-700 dark:bg-neutral-800/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold">{selectedColumns.length}</span> columns selected
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex h-11 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExport}
                      disabled={selectedColumns.length === 0}
                      className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      <Download className="h-4 w-4" />
                      Export {exportFormat.toUpperCase()}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

