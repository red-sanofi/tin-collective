export function formatDateTime(value, locale = "tr-TR") {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function translateApiError(t, error) {
  if (!error) return t("errors.requestFailed");
  if (typeof error.message === "string" && error.message !== "Network request failed") {
    return error.message;
  }
  return t("errors.network");
}

export function translateCategory(t, category) {
  return t(`categories.${category}`, { defaultValue: category });
}

export function translateDeliveryMode(t, mode) {
  return t(`deliveryModes.${mode}`, { defaultValue: mode });
}

export function translateInterestArea(t, area) {
  return t(`interestAreas.${area}`, { defaultValue: area });
}

export function translateRegistrationStatus(t, status) {
  return t(`registrationStatus.${status}`, { defaultValue: status });
}

export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  return data?.results || [];
}
