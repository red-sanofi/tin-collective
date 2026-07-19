import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const { theme, themes, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="theme-switcher">
      <button
        type="button"
        className="theme-switcher-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {t("themes.button")}
      </button>

      {open && (
        <div className="theme-switcher-panel" role="dialog" aria-label={t("themes.panelTitle")}>
          <div className="theme-switcher-head">
            <strong>{t("themes.panelTitle")}</strong>
            <button type="button" className="theme-switcher-close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <p className="theme-switcher-copy">{t("themes.panelCopy")}</p>
          <div className="theme-switcher-grid">
            {Object.values(themes).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`theme-option${theme === item.id ? " is-active" : ""}`}
                onClick={() => {
                  setTheme(item.id);
                  setOpen(false);
                }}
              >
                <span className={`theme-option-preview ${item.previewClass}`} aria-hidden="true" />
                <span className="theme-option-body">
                  <strong>{t(item.labelKey)}</strong>
                  <small>{t(item.descriptionKey)}</small>
                </span>
                {theme === item.id && <span className="theme-option-badge">{t("themes.active")}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
