"use client";

/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

type EmailPreferences = {
  updates: boolean;
  content: boolean;
  promotions: boolean;
};

type InstitutionOption = {
  id: string;
  name: string;
  domain: string;
  size: string;
};

type FieldName =
  | "fullName"
  | "email"
  | "password"
  | "institution"
  | "role"
  | "institutionSize"
  | "heardFrom"
  | "terms";

const institutionDirectory: InstitutionOption[] = [
  { id: "harvard", name: "Harvard University", domain: "harvard.edu", size: "10,000+" },
  { id: "mit", name: "Massachusetts Institute of Technology", domain: "mit.edu", size: "10,000+" },
  { id: "stanford", name: "Stanford University", domain: "stanford.edu", size: "10,000+" },
  { id: "cambridge", name: "University of Cambridge", domain: "cam.ac.uk", size: "10,000+" },
  { id: "oxford", name: "University of Oxford", domain: "ox.ac.uk", size: "10,000+" },
  { id: "ucla", name: "University of California, Los Angeles", domain: "ucla.edu", size: "10,000+" },
  { id: "nanyang", name: "Nanyang Technological University", domain: "ntu.edu.sg", size: "10,000+" },
  { id: "melbourne", name: "University of Melbourne", domain: "unimelb.edu.au", size: "10,000+" },
  { id: "capeTown", name: "University of Cape Town", domain: "uct.ac.za", size: "10,000+" },
  { id: "iitd", name: "Indian Institute of Technology Delhi", domain: "iitd.ac.in", size: "10,000+" },
];

const roles = [
  "Lecturer / Professor",
  "Department Head",
  "Academic Coordinator",
  "System Administrator",
  "Registrar",
  "Other (please specify)",
];

const institutionSizes = [
  "Under 1,000 students",
  "1,000 - 5,000 students",
  "5,000 - 10,000 students",
  "10,000+ students",
];

const heardFromOptions = [
  "Search engine (Google, etc.)",
  "Social media",
  "Colleague recommendation",
  "Conference/Event",
  "Ad",
  "Other",
];

const securityBadges = [
  {
    icon: Shield,
    label: "Bank-Level Security",
  },
  {
    icon: Check,
    label: "GDPR Compliant",
  },
  {
    icon: Sparkles,
    label: "Enterprise SSO",
  },
];

const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

const passwordChecks = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "Contains uppercase & lowercase",
    test: (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
  {
    label: "Contains numbers or symbols",
    test: (password: string) => /[\d!@#$%^&*]/.test(password),
  },
];

const passwordStrengthLevels = [
  { score: 0, label: "Weak", color: "bg-error/60" },
  { score: 1, label: "Fair", color: "bg-orange-400/70" },
  { score: 2, label: "Good", color: "bg-yellow-400/80" },
  { score: 3, label: "Strong", color: "bg-emerald-500/80" },
];

const getPasswordStrength = (password: string) => {
  const score = passwordChecks.reduce((acc, rule) => (rule.test(password) ? acc + 1 : acc), 0);
  return passwordStrengthLevels[Math.min(score, passwordStrengthLevels.length - 1)];
};

const todayPlus14Days = () => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const baseFieldClasses =
  "flex-1 h-12 border-0 bg-transparent px-2 text-sm text-neutral-900 transition duration-150 placeholder:text-neutral-400 focus-visible:outline-none dark:text-neutral-100";

const focusRingClasses =
  "group-focus-within/form-field:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] group-focus-within/form-field:border-transparent";

const successFieldClasses = "text-neutral-900 dark:text-neutral-100";

const errorFieldClasses = "text-neutral-900 dark:text-neutral-100";

const getFieldWrapperClasses = (state: "default" | "success" | "error") =>
  cn(
    "group/form-field flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-gradient-to-br from-white/97 via-white/94 to-white/90 px-3 py-2 shadow-[0_22px_48px_rgba(15,23,42,0.08)] transition focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_4px_rgba(79,70,229,0.12)] dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-transparent dark:bg-[#0d1a33]/85",
    state === "success" &&
      "border-success/70 focus-within:border-success focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.22)]",
    state === "error" &&
      "border-error/70 bg-error/5 focus-within:border-error focus-within:shadow-[0_0_0_4px_rgba(239,68,68,0.18)] dark:bg-error/10",
  );

const formSteps = [
  {
    key: "account",
    title: "Account",
    description: "Your personal login details",
  },
  {
    key: "institution",
    title: "Institution",
    description: "Tell us about your organisation",
  },
  {
    key: "preferences",
    title: "Preferences",
    description: "Stay in the loop with helpful updates",
  },
] as const;

const accountFields = [
  {
    name: "fullName" as const,
    label: "Full Name",
    placeholder: "e.g., Dr. Sarah Johnson",
    icon: Users,
    type: "text",
    autoComplete: "name",
    required: true,
    colSpan: "",
  },
  {
    name: "email" as const,
    label: "Email Address",
    placeholder: "your.email@institution.edu",
    icon: Mail,
    type: "email",
    autoComplete: "email",
    required: true,
    colSpan: "",
  },
  {
    name: "password" as const,
    label: "Create Password",
    placeholder: "Min. 8 characters",
    icon: Lock,
    type: "password",
    autoComplete: "new-password",
    required: true,
    colSpan: "",
  },
];

export const SignupForm = () => {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    institution: "",
    role: "",
    institutionSize: "",
    heardFrom: "",
    terms: false,
  });

  const [emailPreferences, setEmailPreferences] = useState<EmailPreferences>({
    updates: true,
    content: false,
    promotions: false,
  });

  const [errors, setErrors] = useState<Record<FieldName, string | null>>({
    fullName: null,
    email: null,
    password: null,
    institution: null,
    role: null,
    institutionSize: null,
    heardFrom: null,
    terms: null,
  });

  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    fullName: false,
    email: false,
    password: false,
    institution: false,
    role: false,
    institutionSize: false,
    heardFrom: false,
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [institutionQuery, setInstitutionQuery] = useState("");
  const [isInstitutionDropdownOpen, setIsInstitutionDropdownOpen] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(values.password),
    [values.password]
  );

  const filteredInstitutions = useMemo(() => {
    if (!institutionQuery) return institutionDirectory;
    return institutionDirectory.filter((institution) =>
      institution.name.toLowerCase().includes(institutionQuery.trim().toLowerCase())
    );
  }, [institutionQuery]);

  const validateField = useCallback(
    (name: FieldName, value: string | boolean) => {
      switch (name) {
        case "fullName":
          if (!value || typeof value !== "string" || value.trim().length < 2) {
            return "Please enter a valid name";
          }
          if (!/^[a-zA-Z\s.'-]{2,100}$/.test(value.trim())) {
            return "Name can only include letters and spaces";
          }
          return null;
        case "email":
          if (typeof value !== "string" || value.trim().length === 0) {
            return "Please enter your email address";
          }
          if (!emailRegex.test(value.trim())) {
            return "Please enter a valid email address";
          }
          if (value.trim().toLowerCase() === "already@registered.edu") {
            return "This email is already registered";
          }
          return null;
        case "password":
          if (typeof value !== "string" || value.length === 0) {
            return "Password is required";
          }
          for (const rule of passwordChecks) {
            if (!rule.test(value)) {
              return "Password must be at least 8 characters with uppercase, lowercase, and numbers";
            }
          }
          return null;
        case "institution":
          if (typeof value !== "string" || value.trim().length === 0) {
            return "Please select a valid institution";
          }
          return null;
        case "role":
          if (typeof value !== "string" || value.trim().length === 0) {
            return "Please select your role";
          }
          return null;
        case "terms":
          if (!value) {
            return "You must accept the terms to continue";
          }
          return null;
        case "institutionSize":
        case "heardFrom":
        default:
          return null;
      }
    },
    []
  );

  const handleBlur = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "email") {
      setIsEmailChecking(true);
      setTimeout(() => {
        setIsEmailChecking(false);
        setErrors((prev) => ({ ...prev, email: validateField("email", values.email) }));
      }, 350);
      return;
    }
    if (name === "institution") {
      setTimeout(() => setIsInstitutionDropdownOpen(false), 120);
    }
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values[name]),
    }));
  };

  const handleChange = (name: FieldName, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const nextTouched: Record<FieldName, boolean> = {
      fullName: true,
      email: true,
      password: true,
      institution: true,
      role: true,
      institutionSize: touched.institutionSize,
      heardFrom: touched.heardFrom,
      terms: true,
    };
    setTouched(nextTouched);

    const nextErrors = {
      fullName: validateField("fullName", values.fullName),
      email: validateField("email", values.email),
      password: validateField("password", values.password),
      institution: validateField("institution", values.institution),
      role: validateField("role", values.role),
      institutionSize: null,
      heardFrom: null,
      terms: validateField("terms", values.terms),
    } satisfies Record<FieldName, string | null>;

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some((error) => error !== null);
    if (hasErrors) {
      setFormStatus("error");
      setFormError("Please fix the highlighted fields before continuing.");
      return;
    }

    setFormStatus("loading");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormStatus("success");
      setTimeout(() => {
        router.push(`/auth/login?email=${encodeURIComponent(values.email)}`);
      }, 2000);
    } catch (error) {
      console.error(error);
      setFormStatus("error");
      setFormError("Something went wrong. Please try again later.");
    }
  };

  const isFieldValid = (name: FieldName) =>
    !!touched[name] && !errors[name] && Boolean(values[name]);

  const renderValidationMessage = (name: FieldName) => {
    if (errors[name]) {
      return (
        <motion.p
          role="alert"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs font-medium text-error"
          id={`${name}-error`}
        >
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </motion.p>
      );
    }
    if (isFieldValid(name)) {
      return (
        <motion.p
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-xs font-medium text-success"
          id={`${name}-success`}
        >
          <Check className="h-4 w-4" />
          Looks great!
        </motion.p>
      );
    }
    return null;
  };

  const handleInstitutionSelect = (institution: InstitutionOption) => {
    handleChange("institution", institution.name);
    setInstitutionQuery(institution.name);
    setIsInstitutionDropdownOpen(false);
  };

  const handleInstitutionInput = (value: string) => {
    setInstitutionQuery(value);
    handleChange("institution", value);
    setIsInstitutionDropdownOpen(true);
  };

  const getFieldStateClasses = (name: FieldName) => {
    if (errors[name]) return errorFieldClasses;
    if (isFieldValid(name)) return successFieldClasses;
    return "border-neutral-200 text-neutral-900 transition-colors dark:border-neutral-700 dark:text-neutral-100";
  };

  const submitButtonLabel = useMemo(() => {
    switch (formStatus) {
      case "loading":
        return "Creating account...";
      case "success":
        return "✓ Account Created!";
      case "error":
        return "✗ Please fix errors above";
      default:
        return "Create Account";
    }
  }, [formStatus]);

  const isPrimaryDisabled =
    formStatus === "loading" || formStatus === "success" || isEmailChecking;

  const institutionFieldState: "default" | "success" | "error" = errors.institution
    ? "error"
    : isFieldValid("institution")
      ? "success"
      : "default";
  const roleFieldState: "default" | "success" | "error" = errors.role
    ? "error"
    : isFieldValid("role")
      ? "success"
      : "default";
  const institutionSizeFieldState: "default" | "success" | "error" = errors.institutionSize
    ? "error"
    : isFieldValid("institutionSize")
      ? "success"
      : "default";
  const heardFromFieldState: "default" | "success" | "error" = errors.heardFrom
    ? "error"
    : isFieldValid("heardFrom")
      ? "success"
      : "default";

  return (
    <motion.section
      className="relative mx-auto w-full"
      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.97, y: 24 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-purple-50/5 to-blue-50/10 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:from-neutral-900/20 dark:via-purple-900/10 dark:to-blue-900/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 10%, rgba(124, 58, 237, 0.16), transparent 55%), radial-gradient(circle at 82% 20%, rgba(6, 182, 212, 0.16), transparent 52%), radial-gradient(circle at 50% 100%, rgba(59, 130, 246, 0.18), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
            noValidate
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Left Column - Personal Information */}
              <div className="space-y-4">
                {/* Full Name */}
            <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                  >
                    Full Name
                    <span aria-hidden className="text-error">*</span>
                  </label>
                  <div className={getFieldWrapperClasses(errors.fullName ? "error" : isFieldValid("fullName") ? "success" : "default")}>
                    <Users className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      value={values.fullName}
                      onChange={(event) => handleChange("fullName", event.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? "fullName-error" : isFieldValid("fullName") ? "fullName-success" : undefined}
                      placeholder="e.g., Dr. Sarah Johnson"
                      className={cn(baseFieldClasses, focusRingClasses, getFieldStateClasses("fullName"))}
                      required
                    />
                    {isFieldValid("fullName") ? <Check className="h-4 w-4 text-success" /> : null}
                    {errors.fullName ? <AlertCircle className="h-4 w-4 text-error" /> : null}
                  </div>
                  {renderValidationMessage("fullName")}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                  >
                    Email Address
                    <span aria-hidden className="text-error">*</span>
                  </label>
                  <div className={getFieldWrapperClasses(errors.email ? "error" : isFieldValid("email") ? "success" : "default")}>
                    <Mail className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      onBlur={() => handleBlur("email")}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : isFieldValid("email") ? "email-success" : undefined}
                      placeholder="your.email@institution.edu"
                      className={cn(baseFieldClasses, focusRingClasses, getFieldStateClasses("email"))}
                      required
                    />
                    {isEmailChecking ? <Loader2 className="h-4 w-4 animate-spin text-brand-gradientEnd" /> : null}
                    {isFieldValid("email") && !isEmailChecking ? <Check className="h-4 w-4 text-success" /> : null}
                    {errors.email && !isEmailChecking ? <AlertCircle className="h-4 w-4 text-error" /> : null}
                </div>
                  {renderValidationMessage("email")}
              </div>

                {/* Password */}
                <div className="space-y-2">
                      <label
                    htmlFor="password"
                        className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                      >
                    Create Password
                    <span aria-hidden className="text-error">*</span>
                      </label>
                  <div className={getFieldWrapperClasses(errors.password ? "error" : isFieldValid("password") ? "success" : "default")}>
                    <Lock className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                        <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={values.password}
                      onChange={(event) => handleChange("password", event.target.value)}
                      onBlur={() => handleBlur("password")}
                      aria-invalid={Boolean(errors.password)}
                      aria-describedby={errors.password ? "password-error" : isFieldValid("password") ? "password-success" : undefined}
                      placeholder="Min. 8 characters"
                      className={cn(baseFieldClasses, focusRingClasses, getFieldStateClasses("password"))}
                      required
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
                  {values.password.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-700">
                            {Array.from({ length: 4 }).map((_, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex-1 rounded-full transition-all duration-200",
                              index <= passwordStrength.score ? passwordStrength.color : "bg-transparent"
                                )}
                              />
                            ))}
                          </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {passwordStrength.label}
                      </span>
                        </div>
                      ) : null}
                  {renderValidationMessage("password")}
              </div>
            </div>

              {/* Right Column - Institution Information */}
              <div className="space-y-4">
                {/* Institution Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="institution"
                    className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                  >
                    Institution Name
                    <span aria-hidden className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className={getFieldWrapperClasses(institutionFieldState)}>
                      <Building2 className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                      <input
                        id="institution"
                        name="institution"
                        autoComplete="organization"
                        value={institutionQuery}
                        onChange={(event) => handleInstitutionInput(event.target.value)}
                        onFocus={() => setIsInstitutionDropdownOpen(true)}
                        onBlur={() => handleBlur("institution")}
                        aria-invalid={Boolean(errors.institution)}
                        aria-describedby={errors.institution ? "institution-error" : isFieldValid("institution") ? "institution-success" : undefined}
                        placeholder="Search for your institution..."
                        className={cn(baseFieldClasses, focusRingClasses, getFieldStateClasses("institution"))}
                        required
                      />
                      {isFieldValid("institution") ? <Check className="h-4 w-4 text-success" /> : null}
                      {errors.institution ? (
                        <AlertCircle className="h-4 w-4 text-error" />
                      ) : (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-neutral-400 transition-transform dark:text-neutral-500",
                            isInstitutionDropdownOpen && "rotate-180"
                          )}
                        />
                      )}
                    </div>
                    {isInstitutionDropdownOpen ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-60 overflow-y-auto rounded-2xl border border-neutral-200 bg-white/98 shadow-xl dark:border-neutral-700 dark:bg-[#0f172a]">
                        <ul className="py-2">
                          {filteredInstitutions.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                              No matches found. Keep typing to refine your search.
                            </li>
                          ) : (
                            filteredInstitutions.map((institution) => (
                              <li key={institution.id}>
                                <button
                                  type="button"
                                  className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm text-neutral-700 transition hover:bg-neutral-50 focus:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => handleInstitutionSelect(institution)}
                                >
                                  <span className="font-medium">{institution.name}</span>
                                  <span className="text-xs text-neutral-500">
                                    {institution.domain} · {institution.size} students
                                  </span>
                                </button>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  {renderValidationMessage("institution")}
                </div>

                {/* Your Role */}
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                  >
                    Your Role
                    <span aria-hidden className="text-error">*</span>
                  </label>
                  <div className={getFieldWrapperClasses(roleFieldState)}>
                    <GraduationCap className="h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <select
                      id="role"
                      name="role"
                      value={values.role}
                      onChange={(event) => handleChange("role", event.target.value)}
                      onBlur={() => handleBlur("role")}
                      aria-invalid={Boolean(errors.role)}
                      aria-describedby={errors.role ? "role-error" : isFieldValid("role") ? "role-success" : undefined}
                      className={cn(
                        baseFieldClasses,
                        "appearance-none pr-8 cursor-pointer",
                        "[&>option]:bg-white [&>option]:text-neutral-900 [&>option]:py-2",
                        "dark:[&>option]:bg-[#0f172a] dark:[&>option]:text-neutral-100",
                        getFieldStateClasses("role")
                      )}
                      required
                    >
                      <option value="" disabled className="text-neutral-400">
                        Select your role
                      </option>
                      {roles.map((role) => (
                        <option key={role} value={role} className="py-2">
                          {role}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-neutral-400 transition group-hover:text-neutral-600 dark:text-neutral-500" />
                  </div>
                  {renderValidationMessage("role")}
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={values.terms}
                  onChange={(event) => handleChange("terms", event.target.checked)}
                  onBlur={() => handleBlur("terms")}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border border-neutral-300 text-brand-gradientEnd transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-1"
                  required
                />
                <span className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a
                    href="/legal/terms"
                    className="font-semibold text-brand-gradientEnd underline underline-offset-2 hover:text-brand-gradientStart"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/legal/privacy"
                    className="font-semibold text-brand-gradientEnd underline underline-offset-2 hover:text-brand-gradientStart"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
              {renderValidationMessage("terms")}

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Free 14-day trial. No credit card required. Cancel anytime.
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                type="submit"
                disabled={isPrimaryDisabled}
                className={cn(
                  "flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-brand-gradientStart via-[#4f46e5] to-brand-gradientEnd text-sm font-semibold text-white shadow-[0_18px_45px_rgba(76,44,217,0.35)] transition-all duration-200",
                  "hover:shadow-[0_20px_50px_rgba(76,44,217,0.4)] hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gradientEnd",
                  "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0",
                  formStatus === "success" &&
                    "bg-success text-white shadow-[0_18px_45px_rgba(16,185,129,0.35)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)]",
                  formStatus === "error" && "animate-shake-x bg-error hover:bg-error"
                )}
              >
                {formStatus === "loading" ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {submitButtonLabel}
              </motion.button>

              <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                Already have an account?{" "}
              <a
                href="/auth/login"
                  className="group relative font-semibold text-brand-gradientEnd transition-colors hover:text-brand-gradientStart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 focus-visible:rounded"
              >
                  Sign in
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-gradientStart via-brand-light to-brand-gradientEnd transition-transform duration-200 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </a>
              </p>
            </div>

            {formError ? (
              <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
                {formError}
              </div>
            ) : null}

            <div className="grid gap-4 rounded-2xl border border-white/25 bg-gradient-to-br from-white/98 via-[#f5f1ff]/92 to-[#eef6ff]/88 p-4 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600 shadow-[0_35px_70px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-gradient-to-br dark:from-white/[0.08] dark:via-[#4c2cd9]/15 dark:to-[#0d1a33]/85 dark:text-neutral-300 sm:grid-cols-3">
              {securityBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.label}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200/60 bg-neutral-50/60 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] transition hover:border-brand-gradientEnd hover:bg-neutral-100 dark:border-neutral-700/60 dark:bg-[#111e3c]/60 dark:hover:border-brand-gradientEnd dark:hover:bg-[#111e3c]/80"
                  >
                    <Icon className="h-5 w-5 text-brand-gradientEnd" />
                    <span className="tracking-[0.25em]">{badge.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
};


