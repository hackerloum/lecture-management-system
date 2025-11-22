"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/impact", label: "Impact" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/", label: "Home" },
      { href: "/contact", label: "Contact Us" },
      { href: "/auth/signup", label: "Sign Up" },
      { href: "/auth/login", label: "Sign In" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/features", label: "Documentation" },
      { href: "/pricing", label: "Pricing Plans" },
      { href: "/contact", label: "Support" },
      { href: "/testimonials", label: "Customer Stories" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="mt-24 bg-[#050816] text-neutral-300">
      <div className="container px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd text-xl text-white shadow-[0_20px_40px_rgba(76,44,217,0.36)]">
                LMS
              </span>
              <span className="font-heading text-xl text-white">
                Lecturer System
              </span>
            </div>
            <p className="max-w-xs text-sm text-neutral-400">
              Enterprise-grade management platform powering modern academic
              institutions with insights and automation.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition hover:border-brand-light hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
              >
                <Linkedin aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition hover:border-brand-light hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
              >
                <Twitter aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition hover:border-brand-light hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
              >
                <Github aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {footerLinks.map((column) => (
            <div key={column.heading} className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {column.heading}
              </h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
                    >
                      <span className="h-2 w-2 rounded-full bg-brand-light opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        © 2025 Lecturer System. All rights reserved.
      </div>
    </footer>
  );
};

