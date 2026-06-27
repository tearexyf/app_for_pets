export interface AppSettings {
  ownerName: string;
  theme: "light" | "dark";
  accentColor: string;
  taskReminders: boolean;
  weightUnit: "kg" | "lb";
  language: "en" | "ru";
}

export const DEFAULT_SETTINGS: AppSettings = {
  ownerName: "",
  theme: "light",
  accentColor: "#794d96",
  taskReminders: true,
  weightUnit: "kg",
  language: "en",
};
