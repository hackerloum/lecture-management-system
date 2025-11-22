import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

export interface QuickAccessCardProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  readonly icon: ReactNode;
  readonly title: string;
  readonly description: string;
  readonly delay?: number;
}

export const QuickAccessCard = ({
  icon,
  title,
  description,
  className,
  delay = 0,
  ...props
}: QuickAccessCardProps) => {
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
            animate: { opacity: 1, y: 0 },
            transition: {
              duration: 0.3,
              delay,
              ease: [0.4, 0, 0.2, 1],
            },
          }
        : {},
    [delay, enableMotion],
  );

  return (
    <motion.div
      {...animationProps}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/35 bg-gradient-to-br from-white via-[#f7f5ff] to-white p-6 text-neutral-700 shadow-[0_28px_65px_rgba(15,23,42,0.09)] transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0f1b33]/85 dark:via-[#0c1529]/85 dark:to-[#0a1324]/85 dark:text-slate-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gradientEnd/70 focus-visible:ring-offset-2",
        className,
      )}
      {...(props as Omit<typeof props, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration">)}
    >
      <div className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-gradient-to-b from-brand-gradientStart to-brand-gradientEnd opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gradientStart/12 to-brand-gradientEnd/18 text-brand-gradientEnd shadow-[0_15px_30px_rgba(76,44,217,0.25)] transition duration-300 group-hover:scale-110 group-hover:rotate-2">
            <span className="text-xl leading-none">{icon}</span>
          </div>
          <motion.span
            aria-hidden
            className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gradientEnd"
            initial={enableMotion ? { opacity: 0, x: 12 } : undefined}
            animate={enableMotion ? { opacity: 1, x: 0 } : undefined}
            transition={
              enableMotion ? { delay: delay + 0.2, duration: 0.28, ease: [0.4, 0, 0.2, 1] } : undefined
            }
          >
            After Login
          </motion.span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};


