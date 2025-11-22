"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

import type { ReactNode } from "react";

interface FeatureBullet {
  label: string;
}

interface FeatureShowcaseProps {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: FeatureBullet[];
  ctaLabel: string;
  ctaHref: string;
  media: ReactNode;
  reverse?: boolean;
}

export const FeatureShowcase = ({
  id,
  label,
  title,
  description,
  bullets,
  ctaLabel,
  ctaHref,
  media,
  reverse = false,
}: FeatureShowcaseProps) => {
  const shouldReduceMotion = useReducedMotion();

  const baseAnimation: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <section
      id={id}
      className="relative overflow-hidden rounded-3xl border border-neutral-200/40 bg-white/95 p-8 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-sm transition-colors dark:border-white/10 dark:bg-[#0f172a]/90 lg:p-16"
    >
      <div
        className={`flex flex-col items-center gap-12 lg:flex-row ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <motion.div
          initial={shouldReduceMotion ? undefined : "hidden"}
          whileInView={shouldReduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.4 }}
          variants={baseAnimation}
          className="w-full max-w-xl space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-light/40 bg-brand-light/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-light">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gradientEnd" />
            {label}
          </span>
          <h3 className="font-heading text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            {title}
          </h3>
          <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
            {description}
          </p>
          <ul className="grid grid-cols-1 gap-3 text-sm text-neutral-700 dark:text-neutral-200 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li key={bullet.label} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-light/15 text-brand-light">
                  <Check aria-hidden className="h-3.5 w-3.5" />
                </span>
                <span>{bullet.label}</span>
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-light transition-colors hover:text-brand-gradientEnd focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
          >
            {ctaLabel}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
          whileInView={
            shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative w-full max-w-xl"
        >
          {media}
        </motion.div>
      </div>
    </section>
  );
};

