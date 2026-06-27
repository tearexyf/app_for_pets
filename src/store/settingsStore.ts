import { create } from "zustand";
import {
  getSettings,
  updateSettings as persistSettings,
} from "../services/storage";
import type { AppSettings } from "../types/Settings";
import { applySettingsEffects } from "../utils/settingsEffects";

interface SettingsState {
  settings: AppSettings;
  patchSettings: (updates: Partial<AppSettings>) => AppSettings;
  reloadSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: getSettings(),
  patchSettings: (updates) => {
    const next = persistSettings(updates);
    applySettingsEffects(next);
    set({ settings: next });
    return next;
  },
  reloadSettings: () => {
    const next = getSettings();
    applySettingsEffects(next);
    set({ settings: next });
  },
}));
