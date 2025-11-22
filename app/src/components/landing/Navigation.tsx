"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "@/providers/theme-provider";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/features", label: "Features" },
  { href: "/impact", label: "Impact" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export const Navigation = () => {
  const { resolvedTheme, toggle } = useTheme();
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 120], [0.08, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 0.25]);

  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);
  const backgroundColor = useMotionTemplate`rgba(${
    isDark ? "11, 15, 35" : "255, 255, 255"
  }, ${backgroundOpacity})`;
  const borderColor = useMotionTemplate`rgba(${
    isDark ? "51, 65, 85" : "229, 231, 235"
  }, ${borderOpacity})`;
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      aria-label="Primary"
      className="fixed inset-x-0 top-0 z-50 border-b"
      style={{
        backgroundColor,
        borderColor,
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link
          href="/"
          aria-label="Lecturer Management System home"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd text-xl shadow-[0_15px_35px_rgba(30,58,138,0.35)]">
            LMS
          </span>
          <span className="hidden font-heading text-xl sm:block">
            Lecturer System
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-neutral-600 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 dark:text-neutral-200 dark:hover:text-neutral-50"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd transition-transform duration-200 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={toggle}
            className="hidden h-11 w-11 rounded-full border border-transparent bg-transparent text-neutral-500 transition-all hover:border-brand-light/40 hover:text-brand-light focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 lg:flex"
          >
            {isDark ? (
              <Sun aria-hidden className="h-5 w-5" />
            ) : (
              <Moon aria-hidden className="h-5 w-5" />
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="hidden h-11 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-neutral-900 backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-900 lg:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="hidden h-11 rounded-full bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(76,44,217,0.35)] transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-light lg:inline-flex"
          >
            <Link href="/signup">Start Free Trial</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/60 text-neutral-600 shadow-sm backdrop-blur lg:hidden dark:text-neutral-200"
                aria-label="Open navigation menu"
              >
                <Menu aria-hidden className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs border-border/60 bg-background/95 backdrop-blur-lg"
            >
              <SheetHeader className="items-start">
                <SheetTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd text-sm text-white shadow-[0_12px_25px_rgba(76,44,217,0.25)]">
                    LMS
                  </span>
                  Lecturer System
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4 text-base font-medium text-foreground">
                {navLinks.map((link) => (
                  <SheetClose
                    asChild
                    key={link.href}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between rounded-xl px-2 py-2 transition hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toggle();
                  }}
                  className="flex w-full items-center justify-between rounded-full border-border/60 bg-transparent text-sm text-foreground hover:border-brand-light/50 hover:text-brand-light"
                >
                  <span>Switch to {isDark ? "light" : "dark"} mode</span>
                  {isDark ? (
                    <Sun aria-hidden className="h-4 w-4" />
                  ) : (
                    <Moon aria-hidden className="h-4 w-4" />
                  )}
                </Button>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-full border border-white/20 bg-white/10 text-sm font-semibold text-neutral-900 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    asChild
                    size="lg"
                    className="h-12 w-full rounded-full bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd text-sm font-semibold text-white shadow-[0_16px_35px_rgba(76,44,217,0.28)]"
                  >
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

