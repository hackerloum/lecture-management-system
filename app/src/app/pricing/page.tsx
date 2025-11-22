"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, X, Zap, HelpCircle, User, Building2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";
import { cn } from "@/lib/utils";

const individualPricing = [
  {
    name: "Free",
    description: "Perfect for trying out the platform",
    price: "$0",
    cadence: "forever",
    features: [
      "Up to 50 students",
      "1 active course",
      "Basic attendance tracking",
      "Simple grade management",
      "Email support",
      "Mobile app access",
    ],
    notIncluded: [
      "QR code attendance",
      "AI-powered insights",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Start Free",
    href: "/signup",
  },
  {
    name: "Professional",
    description: "For individual lecturers",
    price: "$29",
    cadence: "month",
    features: [
      "Unlimited students",
      "Unlimited courses",
      "QR code attendance system",
      "Advanced grade calculations",
      "Real-time analytics",
      "AI-powered insights",
      "Priority email support",
      "Mobile app (all devices)",
      "File storage (10GB)",
      "Custom branding",
    ],
    notIncluded: [
      "White-label options",
      "Custom integrations",
      "Dedicated support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Premium",
    description: "For power users",
    price: "$59",
    cadence: "month",
    features: [
      "Everything in Professional",
      "Presentation system with projector mode",
      "Virtual meeting rooms",
      "Advanced AI predictions",
      "Custom integrations & API access",
      "Priority chat & phone support",
      "File storage (50GB)",
      "White-label options",
      "Data export (all formats)",
      "Custom training sessions",
    ],
    notIncluded: [],
    cta: "Start Free Trial",
    href: "/signup",
  },
];

const organizationPricing = [
  {
    name: "Small Team",
    description: "1-10 Lecturers",
    price: "$99",
    cadence: "month",
    lecturers: "Up to 10 lecturers",
    students: "Up to 500 students",
    features: [
      "All Professional features per lecturer",
      "Centralized admin dashboard",
      "Department management",
      "Basic analytics dashboard",
      "Email support",
      "File storage (50GB)",
      "Data export",
    ],
    notIncluded: [
      "Advanced analytics",
      "SSO integration",
      "Dedicated success manager",
    ],
    cta: "Start Free Trial",
    href: "/signup",
  },
  {
    name: "Medium Team",
    description: "11-50 Lecturers",
    price: "$399",
    cadence: "month",
    lecturers: "Up to 50 lecturers",
    students: "Up to 2,500 students",
    features: [
      "All Premium features per lecturer",
      "Advanced analytics dashboard",
      "Multi-department management",
      "Role-based permissions",
      "Priority email & chat support",
      "File storage (200GB)",
      "SSO integration (SAML, OAuth)",
      "Custom reports",
      "API access",
    ],
    notIncluded: [
      "Dedicated success manager",
      "Custom SLA",
      "On-premise deployment",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Large Institution",
    description: "51-200 Lecturers",
    price: "$1,299",
    cadence: "month",
    lecturers: "Up to 200 lecturers",
    students: "Up to 10,000 students",
    features: [
      "Everything in Medium Team",
      "AI-powered institutional insights",
      "Advanced security features",
      "Custom integrations",
      "24/7 priority support",
      "File storage (1TB)",
      "Dedicated success manager",
      "Custom training sessions",
      "SLA-backed 99.9% uptime",
      "Data migration assistance",
    ],
    notIncluded: [
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
  {
    name: "Enterprise",
    description: "200+ Lecturers",
    price: "Custom",
    cadence: "",
    lecturers: "Unlimited lecturers",
    students: "Unlimited students",
    features: [
      "Everything in Large Institution",
      "On-premise deployment option",
      "Custom feature development",
      "White-label entire platform",
      "Dedicated infrastructure",
      "Unlimited storage",
      "24/7 dedicated support team",
      "Custom SLA agreements",
      "Executive business reviews",
      "Compliance assistance",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    href: "/contact",
  },
];

const faqs = [
  {
    question: "Can I switch between plans?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start. The Free plan is available forever.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and can arrange bank transfers for Enterprise customers.",
  },
  {
    question: "What happens after my trial ends?",
    answer: "You'll be prompted to choose a plan. If you don't select one, your account will revert to the Free plan with limited features.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your subscription at any time from your account settings. No questions asked, no cancellation fees.",
  },
  {
    question: "Do you offer educational discounts?",
    answer: "Yes! We offer special pricing for verified educational institutions and non-profits. Contact our sales team for details.",
  },
  {
    question: "What's included in the organization plans?",
    answer: "Organization plans include all features from the corresponding individual plan for each lecturer, plus centralized management, analytics, and dedicated support.",
  },
  {
    question: "Can we add more lecturers later?",
    answer: "Yes! You can easily add or remove lecturer accounts. If you exceed your plan's limit, we'll automatically upgrade you to the next tier.",
  },
];

export default function PricingPage() {
  const prefersReducedMotion = useReducedMotion();
  const [pricingType, setPricingType] = useState<"individual" | "organization">("individual");

  const currentPricing = pricingType === "individual" ? individualPricing : organizationPricing;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/40 text-neutral-900 antialiased transition-colors duration-300 dark:from-[#0a0f1f] dark:via-[#0d1525] dark:to-[#0a0f1f] dark:text-white">
      <Navigation />
      
      {/* Static Background Elements */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20" />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 dark:opacity-10"
        aria-hidden
      />

      <main className="relative z-10 px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-16 text-center"
          >
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200/50 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600 shadow-sm backdrop-blur-sm dark:border-purple-500/30 dark:bg-white/10 dark:text-purple-400"
              initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Zap className="h-4 w-4" />
              Simple & Transparent Pricing
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl lg:text-6xl">
              Choose the Right Plan
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                For Your Needs
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              Start with a 14-day free trial. No credit card required. Cancel anytime.
            </p>
          </motion.div>

          {/* Pricing Type Toggle */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex justify-center"
          >
            <div className="inline-flex gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <button
                onClick={() => setPricingType("individual")}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                  pricingType === "individual"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-neutral-600 hover:bg-white/10 dark:text-neutral-400"
                }`}
              >
                <User className="h-5 w-5" />
                Individual Lecturer
              </button>
              <button
                onClick={() => setPricingType("organization")}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition ${
                  pricingType === "organization"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-neutral-600 hover:bg-white/10 dark:text-neutral-400"
                }`}
              >
                <Building2 className="h-5 w-5" />
                University / Organization
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className={`mb-20 grid gap-8 ${currentPricing.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {currentPricing.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border p-8 backdrop-blur-sm",
                  tier.highlighted
                    ? "border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-blue-500/10 shadow-xl"
                    : "border-white/20 bg-white/10 dark:border-white/10 dark:bg-white/5"
                )}
              >
                {/* Badge */}
                {tier.badge ? (
                  <div className="absolute right-8 top-8">
                    <span className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      {tier.badge}
                    </span>
                  </div>
                ) : null}

                {/* Header */}
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-neutral-900 dark:text-white">
                      {tier.price}
                    </span>
                    {tier.cadence && (
                      <span className="text-neutral-600 dark:text-neutral-400">
                        /{tier.cadence}
                      </span>
                    )}
                  </div>
                  {pricingType === "organization" && (
                    <div className="mt-3 space-y-1">
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {tier.lecturers}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {tier.students}
                      </p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {tier.notIncluded.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-neutral-500 dark:text-neutral-500"
                    >
                      <X className="mt-0.5 h-5 w-5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={tier.href}
                  className={cn(
                    "flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    tier.highlighted
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-purple-600"
                      : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 focus-visible:ring-neutral-900 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  )}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <h2 className="mb-12 text-center text-3xl font-bold text-neutral-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                  className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-12 text-center backdrop-blur-sm"
          >
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-white">
                Still Have Questions?
              </h2>
              <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
                Our team is here to help you find the perfect plan for your needs.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                >
                  Contact Sales
                </Link>
                <Link
                  href="/signup"
                  className="flex h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
