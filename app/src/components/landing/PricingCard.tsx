"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PricingCardProps {
  tier: string;
  description: string;
  price: string;
  cadence?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

export const PricingCard = ({
  tier,
  description,
  price,
  cadence = "month",
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
  badge,
}: PricingCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`relative flex h-full flex-col rounded-3xl border p-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-transform duration-300 ${
        highlighted
          ? "border-transparent bg-gradient-to-br from-brand-gradientStart via-brand-light to-brand-gradientEnd text-white shadow-[0_30px_60px_rgba(76,44,217,0.35)]"
          : "border-neutral-200/70 bg-white text-neutral-900 dark:border-white/10 dark:bg-[#0f172a] dark:text-white"
      }`}
      initial={
        shouldReduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.95 }
      }
      whileInView={
        shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {badge ? (
        <span
          className={`absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-widest ${
            highlighted
              ? "border-white/60 bg-white/10 text-white/90"
              : "border-brand-light/40 bg-brand-light/10 text-brand-light"
          }`}
        >
          {badge}
        </span>
      ) : null}
      <div className="space-y-3 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]">
          {tier}
        </p>
        <h3 className="text-2xl font-semibold">{description}</h3>
        <div>
          <span className="text-4xl font-bold sm:text-5xl">{price}</span>
          <span className="ml-1 text-base font-medium opacity-80">
            / {cadence}
          </span>
        </div>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                highlighted
                  ? "bg-white/15 text-white"
                  : "bg-brand-light/10 text-brand-light"
              }`}
            >
              <Check aria-hidden className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        asChild
        size="lg"
        variant={highlighted ? "default" : "outline"}
        className={`mt-8 h-12 rounded-full font-semibold ${
          highlighted
            ? "bg-white text-brand-dark hover:bg-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-light"
            : "border-brand-light/50 text-brand-light hover:bg-brand-light/10"
        }`}
      >
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </motion.article>
  );
};

