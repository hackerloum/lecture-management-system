"use client";

import { Suspense } from "react";
import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";
import { SessionExpiredNotice } from "@/components/login/SessionExpiredNotice";

const backgroundPattern =
  "bg-[radial-gradient(circle_at_top_left,_rgba(221,232,255,0.55),_transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(234,226,255,0.45),_transparent_60%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-neutral-900 antialiased transition-colors duration-300 dark:bg-[#040713] dark:text-white">
      <Navigation />
      <main className="relative overflow-hidden pb-24 pt-24 sm:pt-28 lg:pt-32">
        <div aria-hidden className={`absolute inset-0 ${backgroundPattern}`} />
        <div aria-hidden className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/70 via-transparent to-transparent dark:from-black/35" />
        <div className="absolute -top-16 left-1/3 h-[420px] w-[420px] rounded-full bg-amber-200/35 blur-[140px]" />
        <div className="relative z-10">
          <div className="container">
            <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
            <SessionExpiredNotice />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


