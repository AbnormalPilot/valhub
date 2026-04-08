window.tailwind = window.tailwind || {};

window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        "val-dark": "var(--theme-dark)",
        "val-card": "var(--theme-card)",
        "val-modal": "var(--theme-modal)",
        "val-text": "var(--theme-text)",
        "val-muted": "var(--theme-muted)",
        "val-dim": "var(--theme-dim)",
        "val-red": "#ff4655",
        "val-green": "#37b39d"
      },
      fontFamily: {
        teko: ["Teko", "sans-serif"],
        dm: ["DM Sans", "sans-serif"]
      }
    }
  }
};
