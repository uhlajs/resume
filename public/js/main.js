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
      button.querySelector(".theme-label").textContent = theme === "dark" ? "Light mode" : "Dark mode";
      button.querySelector("use").setAttribute("href", theme === "dark" ? "#icon-sun" : "#icon-moon");
    }
  }

  applyTheme();
  systemTheme.addEventListener("change", applyTheme);
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme();

    const header = document.querySelector(".site-header");
    const menuButton = document.getElementById("menu-toggle");
    const navigation = document.getElementById("contact-menu");
    const mobile = window.matchMedia("(max-width: 575px)");
    const themeButton = document.getElementById("theme-toggle");
    const headerActions = document.querySelector(".header-actions");

    function setMenuOpen(open) {
      if (!open && mobile.matches && navigation.contains(document.activeElement)) {
        menuButton.focus();
      }
      header.setAttribute("data-menu-open", String(open));
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close contact menu" : "Open contact menu");
      menuButton.querySelector("use").setAttribute("href", open ? "#icon-close" : "#icon-menu");
    }

    function updateHeaderLayout() {
      const focused = document.activeElement;
      if (mobile.matches) navigation.append(themeButton);
      else headerActions.prepend(themeButton);
      setMenuOpen(false);
      if (focused === themeButton || (!mobile.matches && focused === menuButton)) {
        (mobile.matches ? menuButton : themeButton).focus();
      }
    }

    updateHeaderLayout();
    header.setAttribute("data-navigation-ready", "");
    menuButton.addEventListener("click", () => {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });
    header.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
    navigation.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false);
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) setMenuOpen(false);
    });
    header.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenuOpen(false);
    });
    mobile.addEventListener("change", updateHeaderLayout);

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
