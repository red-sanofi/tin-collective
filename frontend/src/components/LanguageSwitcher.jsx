import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="language-switcher" aria-label={t("language.label")}>
      {supportedLanguages.map((language) => (
        <button
          key={language.code}
          type="button"
          className={i18n.language === language.code ? "is-active" : ""}
          onClick={() => i18n.changeLanguage(language.code)}
        >
          {language.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
