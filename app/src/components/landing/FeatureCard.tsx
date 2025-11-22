"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] },
  },
};

export const FeatureCard = ({
  icon,
  title,
  description,
  href,
  className,
}: FeatureCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      variants={shouldReduceMotion ? undefined : cardVariants}
      initial={shouldReduceMotion ? undefined : "initial"}
      whileInView={shouldReduceMotion ? undefined : "animate"}
      viewport={{ once: true, amount: 0.35 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/10 bg-white text-neutral-900 shadow-[0_10px_25px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-brand hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(15,23,42,0.2)] dark:border-white/5 dark:bg-[#111a2f] dark:text-white",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-gradient-to-b before:from-brand-gradientStart before:via-brand-light before:to-brand-gradientEnd before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
        className,
      )}
    >
      <div className="relative flex h-full flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-gradientStart via-brand-light/90 to-brand-gradientEnd text-2xl text-white shadow-[0_18px_32px_rgba(76,44,217,0.35)] transition-transform group-hover:-translate-y-1 group-hover:scale-110">
            <AnimatePresence mode="wait">
              <motion.span
                key={title}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden
              >
                {icon}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.div
            aria-hidden
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: -12 }}
            whileInView={
              shouldReduceMotion ? undefined : { opacity: 0.6, x: 0 }
            }
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500"
          >
            Educators
          </motion.div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
        </div>
        <Link
          href={href}
          aria-label={`Learn more about ${title}`}
          className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-light transition-colors hover:text-brand-gradientEnd focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 dark:text-brand-light dark:hover:text-brand-gradientEnd"
        >
          Learn more
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>
    </motion.article>
  );
};

