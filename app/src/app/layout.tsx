import "./globals.css";

import { Inter, Poppins } from "next/font/google";

import { ThemeScript } from "@/providers/theme-script";

import { Providers } from "./providers";

import type { Metadata } from "next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lecturer Management System",
    template: "%s | Lecturer Management System",
  },
  description:
    "An enterprise-grade platform for lecturer, student, and course management with real-time insights.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
