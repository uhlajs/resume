(() => {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = "system";

  try {
    const stored = localStorage.getItem("theme");
    const legacy = localStorage.getItem("darkMode");
    if (["system", "light", "dark"].includes(stored)) {
      preference = stored;
    } else if (legacy === "true" || legacy === "false") {
      preference = legacy === "true" ? "dark" : "light";
    }
  } catch {
    // Follow the system when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = preference === "system"
      ? (systemTheme.matches ? "dark" : "light")
      : preference;
    document.documentElement.setAttribute("data-bs-theme", theme);
    const button = document.getElementById("theme-toggle");
    if (button) {
      const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.querySelector("use").setAttribute("href", theme === "dark" ? "#icon-sun" : "#icon-moon");
    }
  }

  applyTheme();
  systemTheme.addEventListener("change", applyTheme);
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    document.getElementById("theme-toggle").addEventListener("click", () => {
      preference = document.documentElement.getAttribute("data-bs-theme") === "dark"
        ? "light" : "dark";
      applyTheme();
      try {
        localStorage.setItem("theme", preference);
      } catch {
        // Keep the toggle usable without persistent storage.
      }
    });
  });
})();
