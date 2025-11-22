"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, RefreshCw, Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

const verifyTwoFactorCode = async (code: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  if (code.includes("000000")) {
    throw new Error("expired");
  }
  if (code.includes("111111")) {
    throw new Error("locked");
  }
  if (code.endsWith("9")) {
    throw new Error("invalid");
  }
  return true as const;
};

export const TwoFactorForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  const [codes, setCodes] = useState<string[]>(() =>
    Array.from({ length: 6 }, (_, index) => (index === 0 ? "" : "")),
  );
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [cooldown, setCooldown] = useState<number | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown === null) return;
    if (cooldown === 0) {
      setCooldown(null);
      setAttemptsLeft(5);
      return;
    }
    const timer = window.setTimeout(() => {
      setCooldown((prev) => (prev ? prev - 1 : null));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enableMotion = hasMounted && !prefersReducedMotion;

  const focusInput = useCallback((index: number) => {
    const input = inputsRef.current[index];
    input?.focus();
    input?.select();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    setCodes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < codes.length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !codes[index] && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }
    if (event.key === "ArrowRight" && index < codes.length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const codeValue = useMemo(() => codes.join(""), [codes]);
  const isComplete = codeValue.length === 6 && !codeValue.includes("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isComplete || status === "loading") {
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      await verifyTwoFactorCode(codeValue);
      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (caught) {
      console.error(caught);
      setStatus("error");
      setCodes(Array.from({ length: 6 }, () => ""));
      focusInput(0);

      if (caught instanceof Error) {
        if (caught.message === "expired") {
          setError("Code expired, request a new one.");
        } else if (caught.message === "locked") {
          setError("Too many attempts. Account locked for 5 minutes.");
          setCooldown(300);
        } else {
          setError("Invalid code. Please try again.");
          setAttemptsLeft((prev) => Math.max(prev - 1, 0));
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <motion.form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[32px] border border-slate-200 bg-white p-10 shadow-[0_30px_90px_-45px_rgba(37,64,120,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0c152b]/95 dark:shadow-[0_55px_140px_-60px_rgba(13,25,58,0.9)]"
      initial={enableMotion ? { opacity: 0, y: 18 } : undefined}
      animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
      transition={enableMotion ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] } : undefined}
    >
      <header className="space-y-3 text-center">
        <motion.div
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gradientEnd shadow-sm dark:border-white/10 dark:bg-white/10"
          initial={enableMotion ? { opacity: 0, y: -6 } : undefined}
          animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
          transition={enableMotion ? { delay: 0.05, duration: 0.28, ease: [0.4, 0, 0.2, 1] } : undefined}
        >
          Step 2 · Verify
        </motion.div>
        <Shield className="mx-auto h-8 w-8 text-brand-gradientEnd" />
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">Verify Your Identity</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-300">
          Enter the 6-digit code from your authenticator app.
        </p>
        {searchParams.get("email") ? (
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Signing in as <span className="font-semibold text-neutral-500 dark:text-neutral-300">{searchParams.get("email")}</span>
          </p>
        ) : null}
      </header>

      <div className="mt-8 grid grid-cols-6 gap-3 sm:gap-4">
        {codes.map((value, index) => (
          <motion.div
            key={index}
            className={cn(
              "relative h-14 rounded-xl border-2 border-neutral-200/80 bg-white shadow-sm transition focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_4px_rgba(76,44,217,0.14)] dark:border-neutral-700 dark:bg-[#0f172a]",
              status === "error" && !prefersReducedMotion ? "animate-shake-x border-error" : "",
            )}
            initial={enableMotion ? { opacity: 0, scale: 0.95 } : undefined}
            animate={enableMotion ? { opacity: 1, scale: 1 } : undefined}
            transition={
              enableMotion ? { delay: 0.15 + index * 0.05, duration: 0.28, ease: [0.4, 0, 0.2, 1] } : undefined
            }
          >
            <input
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={1}
              value={value}
              onChange={(event) => handleChange(event.target.value, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="absolute inset-0 h-full w-full rounded-xl border-none bg-transparent text-center text-lg font-semibold text-neutral-900 outline-none focus:outline-none focus-visible:outline-none dark:text-neutral-100"
              aria-label={`Digit ${index + 1}`}
            />
            {value ? (
              <Check className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-success" />
            ) : null}
          </motion.div>
        ))}
      </div>

      {error ? (
        <motion.div
          role="alert"
          className="mt-4 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error"
          initial={enableMotion ? { opacity: 0, y: -6 } : undefined}
          animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          {attemptsLeft > 0 && cooldown === null ? (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Attempts remaining: {attemptsLeft}</p>
          ) : null}
          {cooldown !== null ? (
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Locked. Try again in {cooldown}s or contact support.
            </p>
          ) : null}
        </motion.div>
      ) : null}

      <motion.button
        type="submit"
        disabled={!isComplete || status === "loading" || cooldown !== null}
        className={cn(
          "mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd text-sm font-semibold text-white shadow-[0_18px_45px_rgba(76,44,217,0.35)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
          !prefersReducedMotion && status !== "loading" ? "hover:scale-[1.02]" : "",
        )}
      >
        {status === "loading" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {status === "success" ? "✓ Verified" : "Verify"}
      </motion.button>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-transparent text-sm font-semibold text-neutral-700 transition hover:border-brand-gradientEnd hover:text-brand-gradientEnd focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 dark:border-neutral-700 dark:text-neutral-100"
          onClick={() => {
            setCodes(Array.from({ length: 6 }, () => ""));
            focusInput(0);
          }}
        >
          <RefreshCw className="h-4 w-4" />
          Use backup code instead
        </button>
        <Link
          href="/auth/forgot-password"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-neutral-100 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 dark:bg-[#111d3c] dark:text-neutral-200"
        >
          <Smartphone className="h-4 w-4" />
          Try another method
        </Link>
      </div>

      <footer className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        Lost access?{" "}
        <Link
          href="/support"
          className="font-semibold text-brand-gradientEnd transition hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2"
        >
          Contact support
        </Link>
        .
      </footer>
    </motion.form>
  );
};


