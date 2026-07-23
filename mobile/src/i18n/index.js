import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getStoredLanguage } from "../api/storage";
import en from "./locales/en.json";
import tr from "./locales/tr.json";

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "tr",
  fallbackLng: "tr",
  interpolation: { escapeValue: false },
});

getStoredLanguage().then((language) => {
  if (language === "en" || language === "tr") {
    i18n.changeLanguage(language);
  }
});

export default i18n;
