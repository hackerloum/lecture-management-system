const script = `
(function() {
  try {
    var storageKey = "lms-theme";
    var stored = localStorage.getItem(storageKey);
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    var resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
    var root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  } catch (error) {
    console.warn("Failed to apply stored theme:", error);
  }
})();`;

export const ThemeScript = () => {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
};

