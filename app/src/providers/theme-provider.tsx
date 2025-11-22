"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = Exclude<ThemeMode, "system">;

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const STORAGE_KEY = "lms-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps extends PropsWithChildren {
  defaultMode?: ThemeMode;
}

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return mode;
};

const applyThemeToDocument = (theme: ResolvedTheme) => {
  const root = window.document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

export const ThemeProvider = ({
  children,
  defaultMode = "system",
}: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>("light");
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    mediaQueryRef.current = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (
      storedValue === "light" ||
      storedValue === "dark" ||
      storedValue === "system"
    ) {
      setMode(storedValue);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const resolved = resolveTheme(mode);
    setResolvedTheme(resolved);
    applyThemeToDocument(resolved);
    window.localStorage.setItem(STORAGE_KEY, mode);

    const mediaQuery = mediaQueryRef.current;
    if (!mediaQuery) {
      return;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      if (mode === "system") {
        const nextResolved = event.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        applyThemeToDocument(nextResolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  const handleSetMode = useCallback((nextMode: ThemeMode) => {
    setMode(nextMode);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const resolved = resolveTheme(prev);
      if (prev === "system") {
        return resolved === "dark" ? "light" : "dark";
      }

      return prev === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode: handleSetMode,
      toggle,
    }),
    [mode, resolvedTheme, handleSetMode, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

