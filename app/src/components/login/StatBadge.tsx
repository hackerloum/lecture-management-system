import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export interface StatBadgeProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  readonly icon: ReactNode;
  readonly highlight: string;
  readonly label: string;
  readonly delay?: number;
}

export const StatBadge = ({
  icon,
  highlight,
  label,
  className,
  delay = 0,
  ...props
}: StatBadgeProps) => {
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
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.5 },
            transition: { delay, duration: 0.32, ease: [0.4, 0, 0.2, 1] },
          }
        : {},
    [delay, enableMotion],
  );

  return (
    <motion.div
      {...animationProps}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-white/35 bg-gradient-to-br from-white via-[#f7f5ff] to-white px-5 py-4 text-left text-neutral-700 shadow-[0_28px_65px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1b33]/85 dark:via-[#0c1529]/85 dark:to-[#0a1324]/85 dark:text-slate-200",
        className,
      )}
      {...(props as Omit<typeof props, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration">)}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gradientStart/12 to-brand-gradientEnd/18 text-brand-gradientEnd shadow-[0_15px_30px_rgba(76,44,217,0.25)] transition-transform duration-300 group-hover:scale-110">
        <span className="text-sm leading-none">{icon}</span>
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-neutral-900 dark:text-white">{highlight}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{label}</p>
      </div>
    </motion.div>
  );
};


