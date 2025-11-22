"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      theme="system"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-border/60 bg-card/95 backdrop-blur-glass shadow-glass-lg px-4 py-3",
          actionButton:
            "rounded-lg bg-brand text-brand-foreground hover:bg-brand-light transition-colors duration-200 ease-brand",
          cancelButton:
            "rounded-lg border border-border bg-background hover:bg-muted transition-colors duration-200 ease-brand",
          description: "text-sm text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

