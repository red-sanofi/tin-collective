import i18n from "../i18n";

const localeMap = {
  tr: "tr-TR",
  en: "en-US",
};

export function getDateLocale(language = i18n.language) {
  return localeMap[language] || localeMap.tr;
}

export function formatDateTime(value, options = {}) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString(getDateLocale(), options);
}

export function formatDate(value, options = { dateStyle: "medium" }) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString(getDateLocale(), options);
}

export function translateCategory(t, category) {
  return t(`categories.${category}`, { defaultValue: category });
}

export function translateDeliveryMode(t, mode) {
  return t(`deliveryMode.${mode}`, { defaultValue: mode.replace("_", " ") });
}

export function translateRegistrationStatus(t, status) {
  return t(`registrationStatus.${status}`, { defaultValue: status });
}

export function translateInterestArea(t, area) {
  return t(`interestAreas.${area}`, { defaultValue: area });
}

export function translateApiError(t, error) {
  const detail = error?.data?.detail;
  if (typeof detail === "string") {
    const knownErrors = {
      "Education not found.": "errors.educationNotFound",
      "Eğitim bulunamadı.": "errors.educationNotFound",
      "You are already registered for this education.": "errors.alreadyRegistered",
      "Bu eğitime zaten kayıtlısınız.": "errors.alreadyRegistered",
      "Passwords do not match.": "errors.passwordMismatch",
      "Şifreler eşleşmiyor.": "errors.passwordMismatch",
    };

    if (knownErrors[detail]) {
      return t(knownErrors[detail]);
    }

    return detail;
  }

  if (error?.data && typeof error.data === "object") {
    const firstKey = Object.keys(error.data)[0];
    const firstValue = error.data[firstKey];
    if (Array.isArray(firstValue) && firstValue[0]) {
      return firstValue[0];
    }
  }

  return error?.message || t("errors.requestFailed");
}
