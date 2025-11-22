"use client";

import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
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
  // eslint-disable-next-line no-control-regex
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
  "relative z-10 flex h-11 w-full items-center rounded-lg border bg-white px-3 text-sm text-neutral-900 transition duration-150 placeholder:text-neutral-400 focus:outline-none dark:bg-[#101a2f] dark:text-neutral-100";

const focusRingClasses =
  "group-focus-within/form-field:shadow-[0_0_0_3px_rgba(79,70,229,0.15)] group-focus-within/form-field:border-transparent";

const successFieldClasses = "border-success text-neutral-900 dark:text-neutral-100";

const errorFieldClasses =
  "border-error bg-error/5 text-neutral-900 focus:outline-none dark:border-error/80 dark:bg-error/10";

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <motion.aside
      className="relative lg:sticky lg:top-24"
      initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative rounded-3xl border border-white/20 bg-white/92 p-10 shadow-[0_50px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0f172a]/92 sm:p-12">
        <motion.header
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-2 text-center sm:text-left"
        >
          <h2 className="font-heading text-3xl font-semibold text-neutral-900 dark:text-white">
            Start Your Free Trial
          </h2>
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
            No credit card needed
          </p>
        </motion.header>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit} noValidate>
          <section className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              Account Details
            </h3>

            <div className="space-y-4">
              {[
                {
                  name: "fullName" as const,
                  label: "Full Name",
                  placeholder: "e.g., Dr. Sarah Johnson",
                  icon: Users,
                  type: "text",
                  autoComplete: "name",
                  required: true,
                },
                {
                  name: "email" as const,
                  label: "Email Address",
                  placeholder: "your.email@institution.edu",
                  icon: Mail,
                  type: "email",
                  autoComplete: "email",
                  required: true,
                },
                {
                  name: "password" as const,
                  label: "Create Password",
                  placeholder: "Min. 8 characters",
                  icon: Lock,
                  type: showPassword ? "text" : "password",
                  autoComplete: "new-password",
                  required: true,
                },
              ].map((field) => {
                const Icon = field.icon;
                const fieldState = errors[field.name]
                  ? "error"
                  : isFieldValid(field.name)
                    ? "success"
                    : "default";

                return (
                  <div key={field.name} className="space-y-2">
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                    >
                      {field.label}
                      {field.required ? (
                        <span aria-hidden className="text-error">
                          *
                        </span>
                      ) : null}
                    </label>
                    <div
                      className={cn(
                        "group/form-field relative rounded-xl border border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent p-[2px] transition duration-150",
                        fieldState === "error" && "from-error/40 via-error/20 to-error/10",
                        fieldState === "success" && "from-emerald-500/50 via-emerald-400/40 to-transparent"
                      )}
                    >
                      <div
                        className={cn(
                          "group flex items-center rounded-[10px] border border-neutral-200/80 bg-white/95 transition duration-200 focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] dark:border-neutral-700/80 dark:bg-[#0f172a]/95",
                          fieldState === "success" && "border-success/80 focus-within:border-success",
                          fieldState === "error" &&
                            "border-error/80 bg-error/10 focus-within:border-error focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                        )}
                      >
                        <Icon className="ml-3 h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          autoComplete={field.autoComplete}
                          value={values[field.name]}
                          onChange={(event) => handleChange(field.name, event.target.value)}
                          onBlur={() => handleBlur(field.name)}
                          aria-invalid={Boolean(errors[field.name])}
                          aria-describedby={
                            errors[field.name]
                              ? `${field.name}-error`
                              : isFieldValid(field.name)
                                ? `${field.name}-success`
                                : undefined
                          }
                          placeholder={field.placeholder}
                          className={cn(
                            baseFieldClasses,
                            focusRingClasses,
                            getFieldStateClasses(field.name),
                            "bg-transparent pl-3"
                          )}
                          required={field.required}
                        />
                        {field.name === "password" ? (
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="mr-2 rounded-full p-1 text-neutral-400 transition hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-1 dark:text-neutral-500 dark:hover:text-neutral-300"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        ) : null}

                        {field.name === "email" && isEmailChecking ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin text-brand-gradientEnd" />
                        ) : null}
                        {isFieldValid(field.name) && !isEmailChecking ? (
                          <Check className="mr-2 h-4 w-4 text-success" />
                        ) : null}
                        {errors[field.name] && !isEmailChecking ? (
                          <AlertCircle className="mr-2 h-4 w-4 text-error" />
                        ) : null}
                      </div>
                    </div>
                    {field.name === "password" ? (
                      <div className="space-y-2 rounded-lg border border-neutral-200/80 bg-neutral-50/80 p-4 dark:border-neutral-700/70 dark:bg-[#0a1328]">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                          Strength
                          <span className="font-sans tracking-normal text-[11px] text-neutral-500 dark:text-neutral-400">
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="flex h-2 overflow-hidden rounded-full bg-neutral-200/80 dark:bg-neutral-700">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <div
                              key={index}
                              className={cn(
                                "flex-1 rounded-full transition-all duration-200",
                                index <= passwordStrength.score
                                  ? passwordStrength.color
                                  : "bg-transparent"
                              )}
                            />
                          ))}
                        </div>
                        <ul className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {passwordChecks.map((rule) => (
                            <li key={rule.label} className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-full border text-[9px]",
                                  rule.test(values.password)
                                    ? "border-success/60 bg-success/10 text-success"
                                    : "border-neutral-300 text-neutral-400"
                                )}
                              >
                                ✓
                              </div>
                              <span>{rule.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {renderValidationMessage(field.name)}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              Institution Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="institution"
                  className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                >
                  Institution Name
                  <span aria-hidden className="text-error">
                    *
                  </span>
                </label>
                <div
                  className={cn(
                    "group/form-field relative rounded-xl border border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent p-[2px] transition duration-150",
                    errors.institution && "from-error/40 via-error/20 to-error/10",
                    isFieldValid("institution") && "from-emerald-500/50 via-emerald-400/40 to-transparent"
                  )}
                  ref={dropdownRef}
                >
                  <div
                    className={cn(
                      "group flex items-center rounded-[10px] border border-neutral-200/80 bg-white/95 transition duration-200 focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] dark:border-neutral-700/80 dark:bg-[#0f172a]/95",
                      errors.institution &&
                        "border-error/80 bg-error/10 focus-within:border-error focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]",
                      isFieldValid("institution") &&
                        "border-success/80 focus-within:border-success focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
                    )}
                  >
                    <Building2 className="ml-3 h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <input
                      id="institution"
                      name="institution"
                      autoComplete="organization"
                      value={institutionQuery}
                      onChange={(event) => handleInstitutionInput(event.target.value)}
                      onFocus={() => setIsInstitutionDropdownOpen(true)}
                      onBlur={() => handleBlur("institution")}
                      aria-invalid={Boolean(errors.institution)}
                      aria-describedby={
                        errors.institution
                          ? "institution-error"
                          : isFieldValid("institution")
                            ? "institution-success"
                            : undefined
                      }
                      placeholder="Search for your institution..."
                      className={cn(
                        baseFieldClasses,
                        focusRingClasses,
                        getFieldStateClasses("institution"),
                        "bg-transparent pl-3"
                      )}
                      required
                    />
                    {isFieldValid("institution") ? (
                      <Check className="mr-2 h-4 w-4 text-success" />
                    ) : null}
                    {errors.institution ? (
                      <AlertCircle className="mr-2 h-4 w-4 text-error" />
                    ) : (
                      <ChevronDown
                        className={cn(
                          "mr-2 h-4 w-4 text-neutral-400 transition-transform dark:text-neutral-500",
                          isInstitutionDropdownOpen && "rotate-180"
                        )}
                      />
                    )}
                  </div>

                  {isInstitutionDropdownOpen ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-60 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-[#0f172a]">
                      <ul className="py-2">
                        {filteredInstitutions.length === 0 ? (
                          <li className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                            No matches found. Continue typing to refine your search.
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

              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                >
                  Your Role
                  <span aria-hidden className="text-error">
                    *
                  </span>
                </label>
                <div
                  className={cn(
                    "group/form-field relative rounded-xl border border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent p-[2px] transition duration-150",
                    errors.role && "from-error/40 via-error/20 to-error/10",
                    isFieldValid("role") && "from-emerald-500/50 via-emerald-400/40 to-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "group flex items-center rounded-[10px] border border-neutral-200/80 bg-white/95 transition duration-200 focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] dark:border-neutral-700/80 dark:bg-[#0f172a]/95",
                      errors.role &&
                        "border-error/80 bg-error/10 focus-within:border-error focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]",
                      isFieldValid("role") &&
                        "border-success/80 focus-within:border-success focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
                    )}
                  >
                    <GraduationCap className="ml-3 h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <select
                      id="role"
                      name="role"
                      value={values.role}
                      onChange={(event) => handleChange("role", event.target.value)}
                      onBlur={() => handleBlur("role")}
                      aria-invalid={Boolean(errors.role)}
                      aria-describedby={
                        errors.role
                          ? "role-error"
                          : isFieldValid("role")
                            ? "role-success"
                            : undefined
                      }
                      className={cn(
                        baseFieldClasses,
                        "bg-transparent pl-3 pr-8 appearance-none",
                        getFieldStateClasses("role")
                      )}
                      required
                    >
                      <option value="" disabled>
                        Select your role
                      </option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="mr-2 h-4 w-4 text-neutral-400 transition group-hover/form-field:text-neutral-600 dark:text-neutral-500" />
                  </div>
                </div>
                {renderValidationMessage("role")}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="institutionSize"
                  className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                >
                  Institution Size (Optional)
                </label>
                <div className="group/form-field relative rounded-xl border border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent p-[2px] transition duration-150">
                  <div className="group flex items-center rounded-[10px] border border-neutral-200/80 bg-white/95 transition duration-200 focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] dark:border-neutral-700/80 dark:bg-[#0f172a]/95">
                    <Users className="ml-3 h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <select
                      id="institutionSize"
                      name="institutionSize"
                      value={values.institutionSize}
                      onChange={(event) => handleChange("institutionSize", event.target.value)}
                      onBlur={() => handleBlur("institutionSize")}
                      className={cn(
                        baseFieldClasses,
                        "bg-transparent pl-3 pr-8 appearance-none",
                        getFieldStateClasses("institutionSize")
                      )}
                    >
                      <option value="">Select institution size (optional)</option>
                      {institutionSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="mr-2 h-4 w-4 text-neutral-400 transition group-hover/form-field:text-neutral-600 dark:text-neutral-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
              Preferences
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="heardFrom"
                  className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300"
                >
                  How did you hear about us? (Optional)
                </label>
                <div className="group/form-field relative rounded-xl border border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent p-[2px] transition duration-150">
                  <div className="group flex items-center rounded-[10px] border border-neutral-200/80 bg-white/95 transition duration-200 focus-within:border-brand-gradientEnd focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] dark:border-neutral-700/80 dark:bg-[#0f172a]/95">
                    <Megaphone className="ml-3 h-4.5 w-4.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                    <select
                      id="heardFrom"
                      name="heardFrom"
                      value={values.heardFrom}
                      onChange={(event) => handleChange("heardFrom", event.target.value)}
                      onBlur={() => handleBlur("heardFrom")}
                      className={cn(
                        baseFieldClasses,
                        "bg-transparent pl-3 pr-8 appearance-none",
                        getFieldStateClasses("heardFrom")
                      )}
                    >
                      <option value="">Select an option (optional)</option>
                      {heardFromOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="mr-2 h-4 w-4 text-neutral-400 transition group-hover/form-field:text-neutral-600 dark:text-neutral-500" />
                  </div>
                </div>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-300">
                  I want to receive emails about
                </legend>
                {[
                  { key: "updates", label: "Product updates & new features" },
                  { key: "content", label: "Educational content & tips" },
                  { key: "promotions", label: "Special offers & promotions" },
                ].map((preference) => (
                  <label
                    key={preference.key}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white/95 px-4 py-3 text-sm text-neutral-600 transition hover:border-brand-gradientEnd hover:bg-neutral-50 focus-within:border-brand-gradientEnd dark:border-neutral-700/70 dark:bg-[#0f172a]/95 dark:text-neutral-300 dark:hover:bg-[#111e3c]",
                      emailPreferences[preference.key as keyof EmailPreferences] &&
                        "border-brand-gradientEnd bg-brand-gradientEnd/5"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={emailPreferences[preference.key as keyof EmailPreferences]}
                      onChange={() =>
                        setEmailPreferences((prev) => ({
                          ...prev,
                          [preference.key]: !prev[preference.key as keyof EmailPreferences],
                        }))
                      }
                      className="h-5 w-5 rounded border border-neutral-300 text-brand-gradientEnd transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-1"
                    />
                    <span>{preference.label}</span>
                  </label>
                ))}
              </fieldset>
            </div>
          </section>

          <section className="space-y-4">
            <label className="flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={values.terms}
                onChange={(event) => handleChange("terms", event.target.checked)}
                onBlur={() => handleBlur("terms")}
                className="mt-0.5 h-5 w-5 rounded border border-neutral-300 text-brand-gradientEnd transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-1"
                required
              />
              <span className="leading-relaxed">
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
                .
              </span>
            </label>
            {renderValidationMessage("terms")}

            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/90 p-4 text-xs text-neutral-500 dark:border-neutral-700/70 dark:bg-[#0a1328]/95 dark:text-neutral-400">
              Free trial includes 14 days full access. Your trial ends on {todayPlus14Days()}. We&apos;ll remind
              you before renewal.
            </div>
          </section>

          <div className="space-y-4">
            <motion.button
              type="submit"
              disabled={isPrimaryDisabled}
              className={cn(
                "flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-brand-gradientStart via-[#4f46e5] to-brand-gradientEnd text-sm font-semibold text-white shadow-lg transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gradientEnd",
                "disabled:cursor-not-allowed disabled:opacity-70",
                formStatus === "success" &&
                  "bg-success text-white shadow-[0_18px_45px_rgba(16,185,129,0.35)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)]",
                formStatus === "error" && "animate-shake-x bg-error hover:bg-error"
              )}
            >
              {formStatus === "loading" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {submitButtonLabel}
            </motion.button>

            <a
              href="/auth/login"
              className="flex h-12 w-full items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-brand-gradientEnd transition hover:border-brand-gradientEnd hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-[#0f172a] dark:text-purple-200 dark:hover:bg-[#111e3c]"
            >
              Sign In
            </a>
          </div>

          {formError ? (
            <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
              {formError}
            </div>
          ) : null}

          <div className="relative grid gap-4 rounded-xl border border-neutral-200/80 bg-white/90 p-4 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-600 shadow-sm dark:border-neutral-700/70 dark:bg-[#0f172a]/95 dark:text-neutral-300 sm:grid-cols-3">
            {securityBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex items-center justify-center gap-2 rounded-lg border border-neutral-200/60 bg-neutral-50/60 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.28em] transition hover:border-brand-gradientEnd hover:bg-neutral-100 dark:border-neutral-700/60 dark:bg-[#111e3c]/60 dark:hover:border-brand-gradientEnd dark:hover:bg-[#111e3c]/80"
                >
                  <Icon className="h-5 w-5 text-brand-gradientEnd" />
                  <span className="tracking-[0.25em]">{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </form>
      </div>
    </motion.aside>
  );
};


