"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Testimonial, TestimonialCard } from "./TestimonialCard";

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    const updateMatches = (next: boolean) => setMatches(next);

    updateMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => updateMatches(event.matches);

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", listener);
      return () => mediaQueryList.removeEventListener("change", listener);
    }

    // Fallback for older browsers
    mediaQueryList.addListener(listener);
    return () => mediaQueryList.removeListener(listener);
  }, [query]);

  return matches;
};

export const TestimonialCarousel = ({
  testimonials,
}: TestimonialCarouselProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const total = testimonials.length;
  const clampedIndex = useMemo(
    () => Math.min(activeIndex, total - 1),
    [activeIndex, total],
  );

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (!isMobile || shouldReduceMotion) {
      return;
    }

    const timer = window.setInterval(advance, 5000);
    return () => window.clearInterval(timer);
  }, [advance, isMobile, shouldReduceMotion]);

  useEffect(() => {
    if (!isMobile) {
      setActiveIndex(0);
    }
  }, [isMobile]);

  if (!isMobile) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden">
        <motion.div
          className="flex"
          animate={{
            x: shouldReduceMotion ? 0 : `-${clampedIndex * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
          }}
          style={{ width: `${total * 100}%` }}
        >
          {testimonials.map((testimonial) => (
            <div className="w-full flex-shrink-0 px-1" key={testimonial.name}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex items-center justify-center gap-3">
        {testimonials.map((testimonial, index) => {
          const isActive = clampedIndex === index;
          return (
            <button
              key={testimonial.name}
              type="button"
              className={`h-2.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 ${
                isActive ? "w-8 bg-brand-light" : "w-2.5 bg-neutral-300 dark:bg-neutral-600"
              }`}
              aria-label={`Show testimonial ${index + 1}`}
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
};

