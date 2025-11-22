"use client";

/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";
type ButtonState = "default" | "loading" | "success" | "error";
type FieldErrorState = {
  email: string | null;
  password: string | null;
};

type LoginResponse =
  | { status: "success"; requiresTwoFactor: false }
  | { status: "success"; requiresTwoFactor: true }
  | { status: "error"; reason: "invalid_credentials" | "locked" | "network" | "server" };

const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

const rememberMeStorageKey = "lms:remember-me";

const initialErrors: FieldErrorState = {
  email: null,
  password: null,
};

interface FormState {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

type FormAction =
  | { type: "SET_FIELD"; field: keyof FormState; value: string | boolean }
  | { type: "RESET_PASSWORD" }
  | { type: "LOAD"; payload: Partial<FormState> };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET_PASSWORD":
      return {
        ...state,
        password: "",
      };
    case "LOAD":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const hashPassword = async (raw: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const simulateLogin = async (payload: FormState): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const email = payload.email.trim().toLowerCase();
  if (email.includes("locked")) {
    return { status: "error", reason: "locked" };
  }
  if (email.includes("network")) {
    return { status: "error", reason: "network" };
  }
  if (email.includes("server")) {
    return { status: "error", reason: "server" };
  }
  if (email.includes("invalid") || payload.password.trim().length === 0) {
    return { status: "error", reason: "invalid_credentials" };
  }
  if (email.includes("2fa")) {
    return { status: "success", requiresTwoFactor: true };
  }

  return { status: "success", requiresTwoFactor: false };
};

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  const initialEmailFromQuery = searchParams.get("email") ?? "";

  const [formState, dispatch] = useReducer(formReducer, {
    email: initialEmailFromQuery,
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [buttonState, setButtonState] = useState<ButtonState>("default");
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isPrefilling, setIsPrefilling] = useState(true);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enableMotion = hasMounted && !prefersReducedMotion;

  // Hydrate remember-me preference & email
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(rememberMeStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<FormState>;
        dispatch({
          type: "LOAD",
          payload: {
            rememberMe: Boolean(parsed.rememberMe),
            email: parsed.email && !initialEmailFromQuery ? parsed.email : formState.email,
          },
        });
      }
    } catch (error) {
      console.warn("[login] Unable to parse remember-me preference", error);
    } finally {
      setIsPrefilling(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = useCallback((field: keyof FormState, value: string | boolean) => {
    dispatch({ type: "SET_FIELD", field, value });
  }, []);

  const validateEmail = useCallback((value: string) => {
    if (!value || value.trim().length === 0) {
      return "Please enter your email address";
    }
    if (!emailRegex.test(value.trim())) {
      return "Please enter a valid email address";
    }
    return null;
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value || value.trim().length === 0) {
      return "Email or password is incorrect";
    }
    return null;
  }, []);

  const updateError = useCallback(
    (field: keyof FieldErrorState, value: string) => {
      setErrors((prev) => ({
        ...prev,
        [field]: field === "email" ? validateEmail(value) : validatePassword(value),
      }));
    },
    [validateEmail, validatePassword],
  );

  const handleBlur = (field: keyof FieldErrorState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    updateError(field, formState[field]);
  };

  const isFieldValid = (field: keyof FieldErrorState) =>
    touched[field] && !errors[field] && formState[field].trim().length > 0;

  const buttonLabel = useMemo(() => {
    switch (buttonState) {
      case "loading":
        return "Signing in...";
      case "success":
        return "✓ Signing you in...";
      case "error":
        return "✗ Sign In Failed";
      default:
        return "Sign In";
    }
  }, [buttonState]);

  const handleRememberMeChange = (checked: boolean) => {
    setField("rememberMe", checked);
    setTimeout(() => {
      try {
        if (checked) {
          window.localStorage.setItem(
            rememberMeStorageKey,
            JSON.stringify({ rememberMe: true, email: formState.email }),
          );
        } else {
          window.localStorage.removeItem(rememberMeStorageKey);
        }
      } catch (error) {
        console.warn("[login] Unable to persist remember-me preference", error);
      }
    }, 0);
  };

  const focusFirstError = () => {
    if (!formRef.current) return;
    const invalidElement = formRef.current.querySelector<HTMLElement>('[aria-invalid="true"]');
    invalidElement?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPrefilling) return;

    setTouched({
      email: true,
      password: true,
    });

    const nextErrors: FieldErrorState = {
      email: validateEmail(formState.email),
      password: validatePassword(formState.password),
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      setStatus("error");
      setButtonState("error");
      setFormMessage("Email or password is incorrect");
      focusFirstError();
      return;
    }

    setStatus("loading");
    setButtonState("loading");
    setFormMessage(null);

    try {
      const hashedPassword = await hashPassword(formState.password);
      const response = await simulateLogin(formState);
      console.info("[login] Submitting payload", {
        email: formState.email,
        remember: formState.rememberMe,
        passwordDigest: hashedPassword,
      });

      if (response.status === "success") {
        setStatus("success");
        setButtonState("success");
        if (formState.rememberMe) {
          window.localStorage.setItem(
            rememberMeStorageKey,
            JSON.stringify({ rememberMe: true, email: formState.email }),
          );
        }

        setTimeout(() => {
          if (response.requiresTwoFactor) {
            router.push(`/auth/2fa?email=${encodeURIComponent(formState.email)}`);
            return;
          }
          router.push("/dashboard");
        }, 1200);
        return;
      }

      setStatus("error");
      setButtonState("error");

      switch (response.reason) {
        case "locked":
          setFormMessage(
            "This account has been temporarily locked due to multiple failed attempts. Try again in 15 minutes or contact support.",
          );
          break;
        case "network":
          setFormMessage("Connection lost. Please check your internet and try again.");
          break;
        case "server":
          setFormMessage("Something went wrong. Please try again later. Error: 500");
          break;
        case "invalid_credentials":
        default:
          setFormMessage("Email or password is incorrect");
      }

      dispatch({ type: "RESET_PASSWORD" });
      focusFirstError();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setButtonState("error");
      setFormMessage("Something went wrong. Please try again later.");
    }
  };

  const renderFieldStateIcon = (field: keyof FieldErrorState) => {
    if (errors[field]) {
      return <AlertCircle className="h-4 w-4 text-error" />;
    }
    if (isFieldValid(field)) {
      return <Check className="h-4 w-4 text-success" />;
    }
    return null;
  };

  const baseFieldClasses =
    "flex-1 h-12 border-0 bg-transparent px-2 text-sm text-neutral-900 transition duration-150 placeholder:text-neutral-400 focus-visible:outline-none dark:text-neutral-100";

  const focusRingClasses =
    "group-focus-within/form-field:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] group-focus-within/form-field:border-transparent";

  const getFieldWrapperClasses = (state: "default" | "success" | "error") =>
    cn(
      "group/form-field flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-gradient-to-br from-white/97 via-white/94 to-white/90 px-3 py-2 shadow-[0_22px_48px_rgba(15,23,42,0.08)] transition focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-transparent dark:bg-[#0d1a33]/85",
      state === "success" &&
        "border-success/70 focus-within:border-success focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.22)]",
      state === "error" &&
        "border-error/70 bg-error/5 focus-within:border-error focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.18)] dark:bg-error/10",
    );

  const labelClasses =
    "text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300";

  const getFieldState = (field: keyof FieldErrorState): "default" | "success" | "error" => {
    if (errors[field]) return "error";
    if (isFieldValid(field)) return "success";
    return "default";
  };

  const renderValidationMessage = (field: keyof FieldErrorState) => {
    if (errors[field] && touched[field]) {
      return (
        <motion.p
          role="alert"
          initial={enableMotion ? { opacity: 0, y: -6 } : undefined}
          animate={enableMotion ? { opacity: 1, y: 0 } : undefined}
          className="flex items-center gap-1 text-xs font-medium text-error"
          id={`${field}-error`}
        >
          <AlertCircle className="h-4 w-4" />
          {errors[field]}
        </motion.p>
      );
    }
    return null;
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      noValidate
      className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-purple-50/5 to-blue-50/10 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:from-neutral-900/20 dark:via-purple-900/10 dark:to-blue-900/10"
      initial={enableMotion ? { opacity: 0, scale: 0.97, y: 20 } : undefined}
      animate={enableMotion ? { opacity: 1, scale: 1, y: 0 } : undefined}
      transition={enableMotion ? { delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] } : undefined}
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
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className={labelClasses}>
              Email Address
            </label>
            <div className={getFieldWrapperClasses(getFieldState("email"))}>
              <Mail className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your.email@institution.edu"
                className={cn(baseFieldClasses, focusRingClasses)}
                value={formState.email}
                onChange={(event) => {
                  setField("email", event.target.value);
                  if (formState.rememberMe) {
                    window.localStorage.setItem(
                      rememberMeStorageKey,
                      JSON.stringify({ rememberMe: true, email: event.target.value }),
                    );
                  }
                  if (touched.email) updateError("email", event.target.value);
                }}
                onBlur={() => handleBlur("email")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {isFieldValid("email") ? <Check className="h-4 w-4 text-success" /> : null}
              {errors.email ? <AlertCircle className="h-4 w-4 text-error" /> : null}
            </div>
            {renderValidationMessage("email")}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <div className={getFieldWrapperClasses(getFieldState("password"))}>
              <Lock className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={cn(baseFieldClasses, focusRingClasses)}
                value={formState.password}
                onChange={(event) => {
                  setField("password", event.target.value);
                  if (touched.password) updateError("password", event.target.value);
                }}
                onBlur={() => handleBlur("password")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-full p-1.5 text-neutral-400 transition hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-1 dark:text-neutral-500 dark:hover:text-neutral-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {renderValidationMessage("password")}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={formState.rememberMe}
                onChange={(event) => handleRememberMeChange(event.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-brand-gradientEnd focus:ring-brand-gradientEnd dark:border-neutral-700 dark:bg-neutral-900"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="group relative font-medium text-brand-gradientEnd transition hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2"
            >
              Forgot password?
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={buttonState === "loading" || buttonState === "success"}
            className={cn(
              "flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-gradientStart via-[#4f46e5] to-brand-gradientEnd text-sm font-semibold text-white shadow-[0_18px_45px_rgba(76,44,217,0.35)] transition-all duration-200",
              "hover:shadow-[0_20px_50px_rgba(76,44,217,0.4)] hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gradientEnd",
              "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0",
              buttonState === "success" && "bg-success shadow-[0_18px_45px_rgba(16,185,129,0.35)]",
              buttonState === "error" && "bg-error",
            )}
          >
            {buttonState === "loading" ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            {buttonLabel}
          </motion.button>

          {/* Signup Link */}
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="group relative font-semibold text-brand-gradientEnd transition-colors hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 focus-visible:rounded"
            >
              Sign up
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </p>
        </div>
      </div>
    </motion.form>
  );
};


