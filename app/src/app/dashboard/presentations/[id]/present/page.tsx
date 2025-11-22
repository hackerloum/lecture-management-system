"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
  Clock,
  MousePointer,
  FileText,
  Grid3x3,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Monitor,
  Pen,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

// Mock slides data
const mockSlides = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  content: `Slide ${i + 1}`,
  notes: `Speaker notes for slide ${i + 1}. This is where you can add detailed notes that only you can see while presenting.`,
  thumbnail: `https://via.placeholder.com/800x600/667eea/ffffff?text=Slide+${i + 1}`,
}));

export default function PresentationViewerPage() {
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [laserPointer, setLaserPointer] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prevSlide();
          break;
        case "Home":
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case "End":
          e.preventDefault();
          setCurrentSlide(mockSlides.length - 1);
          break;
        case "Escape":
          if (isFullscreen) {
            exitFullscreen();
          } else {
            handleExit();
          }
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "l":
        case "L":
          e.preventDefault();
          setLaserPointer((prev) => !prev);
          break;
        case "d":
        case "D":
          e.preventDefault();
          setDrawing((prev) => !prev);
          break;
        case "n":
        case "N":
          e.preventDefault();
          setShowNotes((prev) => !prev);
          break;
        case "t":
        case "T":
          e.preventDefault();
          setShowThumbnails((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, currentSlide]);

  // Mouse tracking for laser pointer
  useEffect(() => {
    if (!laserPointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [laserPointer]);

  // Prevent navigation away during presentation (security)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < mockSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const handleExit = () => {
    const confirmExit = window.confirm(
      "Are you sure you want to exit the presentation? Your progress will be lost."
    );
    if (confirmExit) {
      router.push("/dashboard/presentations");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* Main Presentation Area */}
      <div className="flex h-full">
        {/* Slide View */}
        <div className={`relative ${showNotes ? "w-2/3" : "w-full"} flex flex-col`}>
          {/* Top Controls */}
          <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleExit}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                title="Exit (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                <Clock className="h-4 w-4" />
                {formatTime(elapsedTime)}
              </div>

              <div className="text-sm font-semibold text-white">
                Slide {currentSlide + 1} of {mockSlides.length}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition ${
                  showThumbnails
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title="Thumbnails (T)"
              >
                <Grid3x3 className="h-5 w-5" />
              </button>

              <button
                onClick={() => setLaserPointer(!laserPointer)}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition ${
                  laserPointer
                    ? "bg-red-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title="Laser Pointer (L)"
              >
                <MousePointer className="h-5 w-5" />
              </button>

              <button
                onClick={() => setDrawing(!drawing)}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition ${
                  drawing
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title="Draw (D)"
              >
                <Pen className="h-5 w-5" />
              </button>

              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition ${
                  showNotes
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title="Notes (N)"
              >
                <FileText className="h-5 w-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                title="Fullscreen (F)"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Slide Content */}
          <div className="flex flex-1 items-center justify-center p-4 pt-20 pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full max-w-6xl"
              >
                <img
                  src={mockSlides[currentSlide].thumbnail}
                  alt={`Slide ${currentSlide + 1}`}
                  className="h-full w-full rounded-lg object-contain shadow-2xl"
                />
                
                {/* Drawing Canvas Overlay */}
                {drawing && (
                  <canvas
                    className="absolute inset-0 cursor-crosshair"
                    style={{ mixBlendMode: "multiply" }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setElapsedTime(0);
                }}
                className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                {timerRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </button>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === mockSlides.length - 1}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Speaker Notes Panel */}
        {showNotes && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="w-1/3 border-l border-white/10 bg-neutral-900 p-6 overflow-y-auto"
          >
            <h3 className="mb-4 text-lg font-bold text-white">Speaker Notes</h3>
            <div className="mb-6 rounded-lg bg-white/5 p-4">
              <p className="text-sm leading-relaxed text-neutral-300">
                {mockSlides[currentSlide].notes}
              </p>
            </div>

            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Next Slide
            </h4>
            {currentSlide < mockSlides.length - 1 && (
              <div className="rounded-lg bg-white/5 p-3">
                <img
                  src={mockSlides[currentSlide + 1].thumbnail}
                  alt="Next slide"
                  className="mb-2 w-full rounded"
                />
                <p className="text-xs text-neutral-400">
                  {mockSlides[currentSlide + 1].content}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Keyboard Shortcuts
              </h4>
              <div className="space-y-2 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Next Slide</span>
                  <span className="font-mono text-neutral-500">→ / Space</span>
                </div>
                <div className="flex justify-between">
                  <span>Previous Slide</span>
                  <span className="font-mono text-neutral-500">← / PageUp</span>
                </div>
                <div className="flex justify-between">
                  <span>Fullscreen</span>
                  <span className="font-mono text-neutral-500">F</span>
                </div>
                <div className="flex justify-between">
                  <span>Laser Pointer</span>
                  <span className="font-mono text-neutral-500">L</span>
                </div>
                <div className="flex justify-between">
                  <span>Draw Mode</span>
                  <span className="font-mono text-neutral-500">D</span>
                </div>
                <div className="flex justify-between">
                  <span>Toggle Notes</span>
                  <span className="font-mono text-neutral-500">N</span>
                </div>
                <div className="flex justify-between">
                  <span>Exit</span>
                  <span className="font-mono text-neutral-500">Esc</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Thumbnails Overlay */}
      <AnimatePresence>
        {showThumbnails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={() => setShowThumbnails(false)}
          >
            <div className="flex h-full flex-col p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">All Slides</h2>
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid flex-1 grid-cols-4 gap-4 overflow-y-auto">
                {mockSlides.map((slide, index) => (
                  <motion.button
                    key={slide.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                      setShowThumbnails(false);
                    }}
                    className={`group relative aspect-video overflow-hidden rounded-lg border-2 transition ${
                      currentSlide === index
                        ? "border-purple-500 ring-4 ring-purple-500/50"
                        : "border-white/10 hover:border-purple-500/50"
                    }`}
                  >
                    <img
                      src={slide.thumbnail}
                      alt={slide.content}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="text-sm font-semibold text-white">{index + 1}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Laser Pointer */}
      {laserPointer && (
        <div
          className="pointer-events-none fixed z-[100]"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="h-6 w-6 animate-pulse rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
        </div>
      )}
    </div>
  );
}

