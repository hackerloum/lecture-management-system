"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const CTASection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-gradientStart via-brand-light to-brand-gradientEnd text-white shadow-[0_35px_80px_rgba(76,44,217,0.38)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),transparent_55%)]"
      />
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-[-10%] h-64 w-64 rounded-full bg-white/25 blur-[140px]" />
        <div className="absolute right-[-12%] top-1/3 h-72 w-72 rounded-full bg-cyan-200/25 blur-[160px]" />
        <div className="absolute left-1/4 bottom-[-18%] h-60 w-60 rounded-full bg-purple-200/20 blur-[150px]" />
      </div>
      <div className="relative z-10 px-8 py-20 text-center sm:px-16">
        <motion.h2
          className="mx-auto max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-5xl"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Ready to Transform Your Academic Management?
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-lg text-white/85"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Join 500+ institutions and start your free trial today. Experience a
          platform crafted for lecturers, administrators, and students alike.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            asChild
            size="lg"
            className="h-14 min-w-[200px] rounded-full bg-white text-brand-dark hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Link href="/signup">Start Free Trial</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 min-w-[200px] rounded-full border-white/70 bg-transparent text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <Link href="mailto:sales@lecturersystem.com">Schedule Demo</Link>
          </Button>
        </motion.div>
        <p className="mt-6 text-sm text-white/80">
          ✓ No credit card required · ✓ 14-day free trial
        </p>
      </div>
    </section>
  );
};

