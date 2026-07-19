import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import tr from "./locales/tr.json";

export const supportedLanguages = [
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "tin_language",
    },
  });

i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language;
});

document.documentElement.lang = i18n.language || "tr";

export default i18n;
