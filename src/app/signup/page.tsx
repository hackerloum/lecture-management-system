"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";
import { HeroContent } from "@/components/signup/HeroContent";
import { SignupForm } from "@/components/signup/SignupForm";

const backgroundDots =
  "bg-[radial-gradient(circle_at_top_left,_rgba(76,44,217,0.08),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_55%),linear-gradient(180deg,rgba(15,23,42,0.85)_0%,rgba(5,8,22,0.95)_100%)]";

export default function SignupPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 antialiased transition-colors duration-300 dark:bg-[#050816] dark:text-white">
      <Navigation />
      <main className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
        <div
          aria-hidden
          className={`absolute inset-0 ${backgroundDots}`}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/10 via-transparent to-transparent dark:from-black/40"
        />

        <div className="relative z-10">
          <div className="container">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr),24rem] lg:gap-20 xl:grid-cols-[minmax(0,1fr),25rem]">
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, x: -24 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="order-2 space-y-16 lg:order-1"
              >
                <HeroContent />
              </motion.div>
              <div className="order-1 lg:order-2">
                <SignupForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


