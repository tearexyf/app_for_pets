import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAllData } from "../../services/storage";
import type { AppSettings } from "../../types/Settings";
import { useSettingsStore } from "../../store/settingsStore";
import { useTranslation } from "../../i18n/useTranslation";
import { ensureNotificationPermission } from "../../services/notifications";
import BottomMenu from "../../components/BottomMenu/BottomMenu";
import "./Setting.css";

const ACCENTS = ["#794d96", "#8b8794", "#7aa6e9", "#9ad19a", "#e98ca6"];

function Setting() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const settings = useSettingsStore((state) => state.settings);
  const patchSettings = useSettingsStore((state) => state.patchSettings);
  const reloadSettings = useSettingsStore((state) => state.reloadSettings);
  const [savedFlash, setSavedFlash] = useState(false);
  const savedFlashTimer = useRef<number | null>(null);

  const apply = (updates: Partial<AppSettings>) => {
    patchSettings(updates);

    if (savedFlashTimer.current !== null) {
      window.clearTimeout(savedFlashTimer.current);
    }
    setSavedFlash(true);
    savedFlashTimer.current = window.setTimeout(() => {
      setSavedFlash(false);
      savedFlashTimer.current = null;
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (savedFlashTimer.current !== null) {
        window.clearTimeout(savedFlashTimer.current);
      }
    };
  }, []);

  const handleOwnerNameChange = (value: string) => {
    apply({ ownerName: value });
  };

  const handleThemeChange = (theme: AppSettings["theme"]) => {
    if (settings.theme === theme) return;
    apply({ theme });
  };

  const handleAccentChange = (accentColor: string) => {
    if (settings.accentColor === accentColor) return;
    apply({ accentColor });
  };

  const handleTaskRemindersChange = async (taskReminders: boolean) => {
    if (settings.taskReminders === taskReminders) return;
    if (taskReminders) {
      const granted = await ensureNotificationPermission();
      if (!granted) {
        alert(t("settings.notificationsDenied"));
        return;
      }
    }
    apply({ taskReminders });
  };

  const handleWeightUnitChange = (weightUnit: AppSettings["weightUnit"]) => {
    if (settings.weightUnit === weightUnit) return;
    apply({ weightUnit });
  };

  const handleLanguageChange = (language: AppSettings["language"]) => {
    if (settings.language === language) return;
    apply({ language });
  };

  const handleClearData = () => {
    const ok = window.confirm(t("settings.eraseConfirm"));
    if (!ok) return;
    clearAllData();
    reloadSettings();
    navigate("/");
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1 className="settings-title">{t("settings.title")}</h1>
        {savedFlash && <span className="settings-saved">{t("settings.saved")}</span>}
      </header>

      <section className="settings-section">
        <h2 className="settings-section__title">{t("settings.profile")}</h2>
        <label className="settings-field">
          <span>{t("settings.yourName")}</span>
          <input
            type="text"
            placeholder={t("settings.namePlaceholder")}
            value={settings.ownerName}
            onChange={(e) => handleOwnerNameChange(e.target.value)}
          />
        </label>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">{t("settings.appearance")}</h2>
        <div className="settings-row">
          <span>{t("settings.theme")}</span>
          <div className="settings-toggle-group">
            <button
              type="button"
              className={`settings-toggle-btn ${
                settings.theme === "light" ? "settings-toggle-btn--active" : ""
              }`}
              onClick={() => handleThemeChange("light")}
            >
              {t("settings.light")}
            </button>
            <button
              type="button"
              className={`settings-toggle-btn ${
                settings.theme === "dark" ? "settings-toggle-btn--active" : ""
              }`}
              onClick={() => handleThemeChange("dark")}
            >
              {t("settings.dark")}
            </button>
          </div>
        </div>

        <div className="settings-row">
          <span>{t("settings.accent")}</span>
          <div className="settings-color-group">
            {ACCENTS.map((color) => (
              <button
                key={color}
                type="button"
                className={`settings-color-dot ${
                  settings.accentColor === color
                    ? "settings-color-dot--active"
                    : ""
                }`}
                style={{ background: color }}
                onClick={() => handleAccentChange(color)}
                aria-label={`${t("settings.accent")} ${color}`}
                aria-pressed={settings.accentColor === color}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section__title">{t("settings.preferences")}</h2>
        <div className="settings-row">
          <span>{t("settings.taskReminders")}</span>
          <label className="settings-switch">
            <input
              type="checkbox"
              checked={settings.taskReminders}
              onChange={(e) => handleTaskRemindersChange(e.target.checked)}
            />
            <span className="settings-switch__track" />
          </label>
        </div>

        <div className="settings-row">
          <span>{t("settings.weightUnit")}</span>
          <div className="settings-toggle-group">
            <button
              type="button"
              className={`settings-toggle-btn ${
                settings.weightUnit === "kg" ? "settings-toggle-btn--active" : ""
              }`}
              onClick={() => handleWeightUnitChange("kg")}
            >
              kg
            </button>
            <button
              type="button"
              className={`settings-toggle-btn ${
                settings.weightUnit === "lb" ? "settings-toggle-btn--active" : ""
              }`}
              onClick={() => handleWeightUnitChange("lb")}
            >
              lb
            </button>
          </div>
        </div>

        <div className="settings-row">
          <span>{t("settings.language")}</span>
          <div className="settings-toggle-group">
            <button
              type="button"
              className={`settings-toggle-btn ${
                settings.language === "en" ? "settings-toggle-btn--active" : ""
              }`}
              onClick={() => handleLanguageChange("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`settings-toggle-btn ${
                settings.language === "ru" ? "settings-toggle-btn--active" : ""
              }`}
              onClick={() => handleLanguageChange("ru")}
            >
              RU
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section settings-section--danger">
        <h2 className="settings-section__title">{t("settings.dangerZone")}</h2>
        <button
          type="button"
          className="settings-danger-btn"
          onClick={handleClearData}
        >
          {t("settings.eraseAll")}
        </button>
      </section>

      <BottomMenu />
    </div>
  );
}

export default Setting;
