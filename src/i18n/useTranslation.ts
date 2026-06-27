import { useSettingsStore } from "../store/settingsStore";
import { translations, type TranslationKey } from "./translations";

type TranslationParams = Record<string, string | number>;

export function useTranslation() {
  const language = useSettingsStore((state) => state.settings.language);

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const template = translations[language][key] ?? translations.en[key];
    if (!params) return template;
    return Object.entries(params).reduce<string>(
      (result, [name, value]) => result.replace(`{${name}}`, String(value)),
      template
    );
  };

  const locale = language === "ru" ? "ru-RU" : "en-US";

  return { t, language, locale };
}
