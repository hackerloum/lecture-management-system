import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export interface TrustBadgeProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  readonly icon: ReactNode;
  readonly label: string;
  readonly delay?: number;
}

export const TrustBadge = ({
  icon,
  label,
  className,
  delay = 0,
  ...props
}: TrustBadgeProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const enableMotion = hasMounted && !prefersReducedMotion;

  const animationProps = useMemo<Partial<HTMLMotionProps<"div">>>(
    () =>
      enableMotion
        ? {
            initial: { opacity: 0, y: 14 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.4 },
            transition: { delay, duration: 0.28, ease: [0.4, 0, 0.2, 1] },
          }
        : {},
    [delay, enableMotion],
  );

  return (
    <motion.div
      {...animationProps}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-white/35 bg-gradient-to-br from-white via-[#f7f5ff] to-white px-5 py-4 text-sm text-neutral-700 shadow-[0_28px_65px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1b33]/85 dark:via-[#0c1529]/85 dark:to-[#0a1324]/85 dark:text-slate-200",
        className,
      )}
      {...(props as Omit<typeof props, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration">)}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gradientStart/12 to-brand-gradientEnd/18 text-brand-gradientEnd shadow-[0_15px_30px_rgba(76,44,217,0.25)] transition-transform duration-300 group-hover:scale-110">
        <span className="text-sm leading-none">{icon}</span>
      </div>
      <span className="font-medium leading-tight text-neutral-900 dark:text-white">{label}</span>
    </motion.div>
  );
};


