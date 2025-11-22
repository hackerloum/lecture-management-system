"use client";

/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2, Mail, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

interface FormState {
  readonly email: string;
}

type FormAction = { type: "SET_EMAIL"; value: string };

const reducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.value };
    default:
      return state;
  }
};

const resetPassword = async (email: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  if (email.toLowerCase().includes("error")) {
    throw new Error("server");
  }
  return true as const;
};

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  const [formState, dispatch] = useReducer(reducer, { email: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [secondsToResend, setSecondsToResend] = useState<number | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (redirectCountdown === null || status !== "success") return;
    if (redirectCountdown === 0) {
      router.push("/auth/login");
      return;
    }
    const timer = window.setTimeout(() => {
      setRedirectCountdown((prev) => (prev ? prev - 1 : null));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [redirectCountdown, router, status]);

  useEffect(() => {
    if (secondsToResend === null) return;
    if (secondsToResend === 0) {
      setSecondsToResend(null);
      return;
    }
    const timer = window.setTimeout(() => {
      setSecondsToResend((prev) => (prev ? prev - 1 : null));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [secondsToResend]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enableMotion = hasMounted && !prefersReducedMotion;

  const validateEmail = useCallback((value: string) => {
    if (!value || value.trim().length === 0) {
      return "Please enter your email address";
    }
    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address";
    }
    return null;
  }, []);

  const emailError = useMemo(() => {
    if (!touched) return null;
    return validateEmail(formState.email);
  }, [formState.email, touched, validateEmail]);

  const isValid = !validateEmail(formState.email);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    setError(null);

    const nextError = validateEmail(formState.email);
    if (nextError) {
      setError(nextError);
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      await resetPassword(formState.email);
      setStatus("success");
      setSecondsToResend(60);
      setRedirectCountdown(3);
    } catch (caught) {
      console.error(caught);
      setStatus("error");
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleResend = async () => {
    if (secondsToResend !== null && secondsToResend > 0) {
      return;
    }
    setStatus("loading");
    try {
      await resetPassword(formState.email);
      setStatus("success");
      setSecondsToResend(60);
    } catch (caught) {
      console.error(caught);
      setStatus("error");
      setError("Something went wrong. Please try again later.");
    }
  };

  const getFieldState = (): "default" | "success" | "error" => {
    if (status === "error" && emailError) return "error";
    if (status === "success") return "success";
    return "default";
  };

  const getFieldWrapperClasses = (state: "default" | "success" | "error") =>
    cn(
      "group/form-field flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-gradient-to-br from-white/97 via-white/94 to-white/90 px-3 py-2 shadow-[0_22px_48px_rgba(15,23,42,0.08)] transition focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-transparent dark:bg-[#0d1a33]/85",
      state === "success" &&
        "border-success/70 focus-within:border-success focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.22)]",
      state === "error" &&
        "border-error/70 bg-error/5 focus-within:border-error focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.18)] dark:bg-error/10",
    );

  return (
    <motion.form
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-purple-50/5 to-blue-50/10 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:from-neutral-900/20 dark:via-purple-900/10 dark:to-blue-900/10"
      initial={enableMotion ? { opacity: 0, scale: 0.97, y: 20 } : undefined}
      animate={enableMotion ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={enableMotion ? { delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] } : undefined}
      noValidate
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 10%, rgba(124, 58, 237, 0.16), transparent 55%), radial-gradient(circle at 82% 20%, rgba(6, 182, 212, 0.16), transparent 52%), radial-gradient(circle at 50% 100%, rgba(59, 130, 246, 0.18), transparent 60%)",
        }}
      />
      <div className="relative flex flex-col gap-6 p-6 sm:p-8">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="forgot-password-email"
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
            >
              Email Address
            </label>
            <div className={getFieldWrapperClasses(getFieldState())}>
              <Mail className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <input
                id="forgot-password-email"
                type="email"
                className="flex-1 h-12 border-0 bg-transparent px-2 text-sm text-neutral-900 transition duration-150 placeholder:text-neutral-400 focus-visible:outline-none dark:text-neutral-100"
                placeholder="your.email@institution.edu"
                value={formState.email}
                onChange={(event) => {
                  dispatch({ type: "SET_EMAIL", value: event.target.value });
                  if (touched) {
                    setError(validateEmail(event.target.value));
                  }
                }}
                onBlur={() => setTouched(true)}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "forgot-password-error" : undefined}
              />
              {status === "success" ? <Check className="h-4 w-4 text-success" /> : null}
              {status === "error" && emailError ? <AlertCircle className="h-4 w-4 text-error" /> : null}
            </div>
            {emailError ? (
              <motion.p
                id="forgot-password-error"
                role="alert"
                className="flex items-center gap-1 text-xs font-medium text-error"
                initial={enableMotion ? { opacity: 0, y: -6 } : undefined}
                animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
              >
                <AlertCircle className="h-4 w-4" />
                {emailError}
              </motion.p>
            ) : null}
          </div>

          {/* Success Message */}
          {status === "success" ? (
            <motion.div
              className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-success"
              initial={enableMotion ? { opacity: 0, y: -6 } : undefined}
              animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
            >
              Check your email for reset instructions. Redirecting to sign in
              {redirectCountdown ? (
                <>
                  {" "}
                  in <strong>{redirectCountdown}</strong>s
                </>
              ) : (
                "..."
              )}
            </motion.div>
          ) : null}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={status === "loading" || status === "success" || !isValid}
            className={cn(
              "flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-gradientStart via-[#4f46e5] to-brand-gradientEnd text-sm font-semibold text-white shadow-[0_18px_45px_rgba(76,44,217,0.35)] transition-all duration-200",
              "hover:shadow-[0_20px_50px_rgba(76,44,217,0.4)] hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gradientEnd",
              "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0",
              status === "success" && "bg-success shadow-[0_18px_45px_rgba(16,185,129,0.35)]",
            )}
          >
            {status === "loading" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {status === "success" ? "✓ Email Sent" : "Send Reset Link"}
          </motion.button>

          {/* Back to Login Link */}
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="group relative font-semibold text-brand-gradientEnd transition-colors hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Back to sign in
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </p>

          {/* Resend Option */}
          {status === "success" ? (
            <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              Didn&apos;t receive it?{" "}
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-brand-gradientEnd transition hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={secondsToResend !== null && secondsToResend > 0}
                onClick={() => {
                  void handleResend();
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {secondsToResend ? `Resend in ${secondsToResend}s` : "Resend"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.form>
  );
};


