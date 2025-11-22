"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const trustBadges = [
  { label: "🏫 Used by 500+ institutions" },
  { label: "⭐ 4.9/5 rating from educators" },
  { label: "🔒 Enterprise-grade security" },
];

const floatingCards = [
  {
    title: "Faculty Performance",
    metric: "+18%",
    description: "Improvement year over year",
    delay: 0.2,
  },
  {
    title: "Student Satisfaction",
    metric: "94%",
    description: "Course feedback score",
    delay: 0.4,
  },
  {
    title: "Compliance Checks",
    metric: "100%",
    description: "Automated oversight",
    delay: 0.6,
  },
];

export const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const containerAnimation = useMemo<Variants | undefined>(
    () =>
      shouldReduceMotion
        ? undefined
        : {
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          },
    [shouldReduceMotion],
  );

  return (
    <section
      id="hero"
      className="relative overflow-hidden text-neutral-900 dark:text-white"
    >
      <div className="relative z-10 min-h-[90vh]">
        <div className="container flex min-h-screen flex-col items-center justify-center gap-20 pb-24 pt-40 lg:flex-row lg:items-start lg:pt-48 xl:min-h-[110vh]">
          <div className="flex w-full max-w-2xl flex-col items-center gap-10 text-center lg:items-start lg:text-left">
            <motion.div
              initial={shouldReduceMotion ? undefined : "hidden"}
              animate={shouldReduceMotion ? undefined : "visible"}
              variants={containerAnimation}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/80 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-white/10 dark:text-purple-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Enterprise-ready in every way
              </div>
              <motion.h1
                className={cn(
                  "text-4xl font-bold leading-tight tracking-tight text-[#0b1630] sm:text-5xl md:text-7xl",
                  "drop-shadow-[0_14px_36px_rgba(15,23,42,0.18)] dark:text-white dark:drop-shadow-[0_14px_36px_rgba(15,23,42,0.6)]",
                )}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Break Up with Spreadsheets. Pick Your Plan Today.
              </motion.h1>
              <motion.p
                className="max-w-xl text-lg text-[#40506b] sm:text-xl dark:text-white/70"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                animate={
                  shouldReduceMotion ? undefined : { opacity: 1, y: 0 }
                }
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Complete lecturer, student & grade management without Excel
                chaos. Choose a pricing plan in minutes and give your department
                the system it deserves.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="group h-14 w-full rounded-full bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd text-base font-semibold text-white shadow-[0_25px_45px_rgba(76,44,217,0.35)] transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111c3b] sm:flex-1"
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight
                    aria-hidden
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full rounded-full border border-white/20 bg-white/10 text-base font-semibold text-neutral-900 backdrop-blur-sm transition-all hover:bg-white/20 sm:flex-1 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <a
                  href="https://example.com/demo"
                  aria-label="Watch product demo video"
                >
                  <Play aria-hidden className="mr-2 h-4 w-4 fill-brand-gradientEnd dark:fill-white/90" />
                  Watch Demo
                </a>
              </Button>
            </motion.div>

            <motion.ul
              className="grid w-full gap-4 sm:grid-cols-3"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
            >
              {trustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-neutral-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-neutral-300"
                >
                  {badge.label}
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative flex w-full max-w-xl justify-center lg:max-w-2xl">
            <motion.div
              className="group relative h-[520px] w-full max-w-[520px] rounded-[32px] border border-white/20 bg-white/10 p-[1px] shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 40 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-white/80 backdrop-blur-sm dark:bg-neutral-900/80">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.18),_transparent_55%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,182,212,0.12),transparent_60%)]" />
                <div className="relative z-10 flex h-full flex-col gap-6 p-8">
                  <header className="flex items-center justify-between text-sm text-[#56617d] dark:text-white/60">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-light/15 text-xs font-semibold text-brand-light">
                        LIVE
                      </span>
                      <div>
                        <p className="text-[#18233b] dark:text-white/80">Academic Overview</p>
                        <p className="text-xs text-[#78829f] dark:text-white/50">
                          Updated 2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 px-3 py-1 text-[#42506b] dark:border-white/10 dark:text-white/80">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Synced
                    </div>
                  </header>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm text-[#56617d] dark:text-white/60">Lecturer Load</p>
                        <p className="mt-2 text-3xl font-semibold text-[#111b2c] dark:text-white">
                          86%
                        </p>
                        <p className="text-xs text-emerald-500 dark:text-emerald-300">+12% efficiency</p>
                      </div>
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                        <p className="text-sm text-[#56617d] dark:text-white/60">Student Success</p>
                        <p className="mt-2 text-3xl font-semibold text-[#111b2c] dark:text-white">
                          92%
                        </p>
                        <p className="text-xs text-sky-500 dark:text-cyan-300">
                          Automated insights
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200/70 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-center justify-between text-sm text-[#56617d] dark:text-white/60">
                        <span>Engagement Trends</span>
                        <span>Last 30 days</span>
                      </div>
                      <div className="mt-3 h-32 rounded-xl bg-gradient-to-tr from-brand-gradientStart/25 via-brand-light/18 to-transparent dark:from-brand-gradientStart/30 dark:via-brand-light/20" />
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-3 gap-3">
                    {floatingCards.map((card) => (
                      <motion.div
                        key={card.title}
                        className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
                        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.5 + card.delay,
                          duration: 0.6,
                          ease: [0.215, 0.61, 0.355, 1],
                        }}
                      >
                        <p className="text-xs text-[#5b6786] dark:text-white/50">{card.title}</p>
                        <p className="mt-1 text-xl font-semibold text-[#111b2c] dark:text-white">{card.metric}</p>
                        <p className="text-xs text-[#737f9c] dark:text-white/60">{card.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              aria-hidden
              className="absolute -left-10 top-16 hidden h-32 w-32 rounded-full bg-gradient-to-br from-brand-gradientStart via-brand-light to-brand-gradientEnd opacity-30 blur-3xl lg:block"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: ["0%", "14%", "0%"], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
              }
            />
            <motion.div
              aria-hidden
              className="absolute -right-12 -top-12 hidden h-40 w-40 rounded-full bg-cyan-500/30 opacity-30 blur-[90px] lg:block"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: ["0%", "-12%", "0%"], transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

