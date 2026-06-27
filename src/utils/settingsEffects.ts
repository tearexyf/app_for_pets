import type { AppSettings } from "../types/Settings";

const ACCENT_LIGHT: Record<string, string> = {
  "#794d96": "#b893d0",
  "#8b8794": "#c4c1ca",
  "#7aa6e9": "#b0c9f5",
  "#9ad19a": "#c8ebc8",
  "#e98ca6": "#f5b8cc",
};

export const applySettingsEffects = (settings: AppSettings) => {
  const root = document.documentElement;
  const accent = settings.accentColor;

  root.dataset.theme = settings.theme;
  root.style.setProperty("--accent", accent);
  root.style.setProperty(
    "--accent-light",
    ACCENT_LIGHT[accent] ?? accent
  );
  root.style.setProperty(
    "--accent-dark",
    `color-mix(in srgb, ${accent} 70%, black)`
  );
  root.style.setProperty(
    "--accent-hover",
    `color-mix(in srgb, ${accent} 80%, black)`
  );
  root.lang = settings.language;
};
