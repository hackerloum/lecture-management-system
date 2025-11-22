"use client";

import { motion, useReducedMotion } from "framer-motion";

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatarInitials?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index?: number;
}

const getInitials = (name: string, fallback?: string) => {
  if (fallback) return fallback.toUpperCase();
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const TestimonialCard = ({
  testimonial,
  index = 0,
}: TestimonialCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const delay = shouldReduceMotion ? 0 : index * 0.12;

  return (
    <motion.article
      className="flex h-full flex-col gap-6 rounded-3xl border border-neutral-200/50 bg-white/95 p-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_28px_60px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#101a2f]/95"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.96 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
    >
      <div className="flex items-center gap-1 text-lg text-amber-400" aria-hidden>
        {"★★★★★"}
      </div>
      <p className="text-lg italic leading-relaxed text-neutral-700 dark:text-neutral-200">
        “{testimonial.quote}”
      </p>
      <div className="mt-auto flex items-center gap-4">
        <div className="relative h-12 w-12">
          <span className="absolute inset-0 rounded-full border border-transparent bg-gradient-to-br from-brand-gradientStart via-brand-light to-brand-gradientEnd p-[2px]">
            <span className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-brand-light dark:bg-[#0f172a]">
              {getInitials(testimonial.name, testimonial.avatarInitials)}
            </span>
          </span>
        </div>
        <div>
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            {testimonial.name}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {testimonial.title}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

