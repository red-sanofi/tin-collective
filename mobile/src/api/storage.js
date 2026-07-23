import * as SecureStore from "expo-secure-store";

const KEYS = {
  access: "access_token",
  refresh: "refresh_token",
  language: "app_language",
};

export async function getAccessToken() {
  return SecureStore.getItemAsync(KEYS.access);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(KEYS.refresh);
}

export async function setTokens(access, refresh) {
  await SecureStore.setItemAsync(KEYS.access, access);
  await SecureStore.setItemAsync(KEYS.refresh, refresh);
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(KEYS.access);
  await SecureStore.deleteItemAsync(KEYS.refresh);
}

export async function getStoredLanguage() {
  return SecureStore.getItemAsync(KEYS.language);
}

export async function setStoredLanguage(language) {
  await SecureStore.setItemAsync(KEYS.language, language);
}
