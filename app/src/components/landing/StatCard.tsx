"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const formatNumber = (input: number) => {
  const hasFraction = Math.abs(input % 1) > Number.EPSILON;
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: hasFraction ? 1 : 0,
    minimumFractionDigits: hasFraction ? 1 : 0,
  }).format(input);
};

export const StatCard = ({
  icon,
  label,
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
}: StatCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 75,
    damping: 20,
    duration,
  });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");

  useMotionValueEvent(springValue, "change", (latest) => {
    setDisplayValue(formatNumber(latest));
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      motionValue.set(value);
      return;
    }

    if (isInView && !hasAnimated) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [hasAnimated, isInView, motionValue, shouldReduceMotion, value]);

  const cardBackground = useMemo(
    () =>
      "bg-gradient-to-br from-brand-gradientStart/10 via-brand-light/5 to-transparent dark:from-brand-gradientStart/20 dark:via-brand-light/10 dark:to-transparent",
    [],
  );

  return (
    <motion.div
      ref={ref}
      className={`flex h-full flex-col justify-between rounded-3xl border border-white/20 ${cardBackground} p-6 shadow-[0_15px_35px_rgba(15,23,42,0.18)] backdrop-blur-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(15,23,42,0.28)] dark:border-white/10 ${className ?? ""}`}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
    >
      <div className="flex items-center gap-3 text-brand-light">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-gradientStart via-brand-light to-brand-gradientEnd text-xl text-white shadow-[0_15px_28px_rgba(76,44,217,0.35)]">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-[0.22em] text-white/70 dark:text-white/60">
          Metric
        </span>
      </div>
      <div className="mt-8 space-y-2">
        <motion.div
          className="text-4xl font-semibold text-white md:text-5xl"
          aria-live="polite"
          aria-label={`${label} ${prefix}${value}${suffix}`}
        >
          {prefix}
          {shouldReduceMotion ? formatNumber(value) : displayValue}
          {suffix}
        </motion.div>
        <p className="text-sm text-white/70 dark:text-white/60">{label}</p>
      </div>
    </motion.div>
  );
};

