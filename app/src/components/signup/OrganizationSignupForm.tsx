"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  User,
  Phone,
  MapPin,
  Globe,
  Users,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Pricing tiers based on number of lecturers
const pricingTiers = [
  {
    range: "1-10",
    lecturers: "1-10 Lecturers",
    price: 99,
    features: ["Up to 10 lecturer accounts", "Up to 500 students", "Basic analytics", "Email support"],
  },
  {
    range: "11-50",
    lecturers: "11-50 Lecturers",
    price: 399,
    features: ["Up to 50 lecturer accounts", "Up to 2,500 students", "Advanced analytics", "Priority support"],
    popular: true,
  },
  {
    range: "51-200",
    lecturers: "51-200 Lecturers",
    price: 1299,
    features: ["Up to 200 lecturer accounts", "Up to 10,000 students", "AI-powered insights", "24/7 dedicated support"],
  },
  {
    range: "200+",
    lecturers: "200+ Lecturers",
    price: null,
    features: ["Unlimited lecturer accounts", "Unlimited students", "Custom integrations", "Enterprise support"],
    custom: true,
  },
];

export function OrganizationSignupForm() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Organization Info, 2: Admin Info, 3: Plan Selection

  // Organization Info
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("university");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [lecturerCount, setLecturerCount] = useState("");

  // Admin Info
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminTitle, setAdminTitle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Organization signup:", {
        organization: { orgName, orgType, orgEmail, orgPhone, orgAddress, orgWebsite, lecturerCount },
        admin: { adminFirstName, adminLastName, adminEmail, adminPhone, adminTitle },
        plan: selectedPlan,
      });
      setIsLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 md:p-12">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition ${
                  step >= stepNum
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : "bg-white/20 text-neutral-400"
                }`}
              >
                {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={`mx-2 h-1 flex-1 rounded transition ${
                    step > stepNum ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <span>Organization</span>
          <span>Admin Details</span>
          <span>Choose Plan</span>
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
        {/* Step 1: Organization Information */}
        {step === 1 && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
              Organization Information
            </h2>

            {/* Organization Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Organization / University Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g., Harvard University"
                  className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* Organization Type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Organization Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                className="h-14 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="school">School</option>
                <option value="training-center">Training Center</option>
                <option value="corporate">Corporate Training</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Number of Lecturers */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Number of Lecturers <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="number"
                  required
                  min="1"
                  value={lecturerCount}
                  onChange={(e) => setLecturerCount(e.target.value)}
                  placeholder="e.g., 50"
                  className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Organization Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Organization Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="admin@university.edu"
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Organization Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-neutral-400" />
                <textarea
                  required
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="123 University Ave, Cambridge, MA 02138"
                  rows={3}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pl-12 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Website (Optional)
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="url"
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(e.target.value)}
                  placeholder="https://university.edu"
                  className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Administrator Information */}
        {step === 2 && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
              Administrator Information
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={adminFirstName}
                    onChange={(e) => setAdminFirstName(e.target.value)}
                    placeholder="John"
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminLastName}
                  onChange={(e) => setAdminLastName(e.target.value)}
                  placeholder="Doe"
                  className="h-14 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* Admin Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Title / Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={adminTitle}
                onChange={(e) => setAdminTitle(e.target.value)}
                placeholder="e.g., Dean of Technology, IT Director"
                className="h-14 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Admin Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="john.doe@university.edu"
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>

              {/* Admin Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-12 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="h-14 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-12 text-neutral-900 backdrop-blur-sm transition focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Plan Selection */}
        {step === 3 && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-6 text-2xl font-bold text-neutral-900 dark:text-white">
              Choose Your Plan
            </h2>

            <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <strong>Organization:</strong> {orgName} ({lecturerCount} lecturers)
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.range}
                  onClick={() => setSelectedPlan(tier.range)}
                  className={`cursor-pointer rounded-2xl border-2 p-6 transition ${
                    selectedPlan === tier.range
                      ? "border-purple-600 bg-purple-500/10 shadow-lg"
                      : "border-white/20 bg-white/5 hover:bg-white/10"
                  } ${tier.popular ? "ring-2 ring-purple-600/50" : ""}`}
                >
                  {tier.popular && (
                    <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs font-bold text-white">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">
                    {tier.lecturers}
                  </h3>
                  <div className="mb-4">
                    {tier.custom ? (
                      <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                        Custom Pricing
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-neutral-900 dark:text-white">
                          ${tier.price}
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400">/month</span>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="flex-1 rounded-xl border border-white/20 bg-white/10 py-4 font-semibold transition hover:bg-white/20"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || (step === 3 && !selectedPlan)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : step === 3 ? (
              <>
                Complete Registration <CreditCard className="h-5 w-5" />
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

