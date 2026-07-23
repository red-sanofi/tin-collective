import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import {
  DEFAULT_THEME,
  THEME_IDS,
  THEME_SITE_VERSION_KEY,
  THEME_STORAGE_KEY,
  THEME_USER_OVERRIDE_KEY,
  THEMES,
} from "../constants/themes";

const ThemeContext = createContext(null);

function normalizeTheme(themeId) {
  return THEME_IDS.includes(themeId) ? themeId : DEFAULT_THEME;
}

function resolveThemeFromSettings(settings) {
  const siteDefault = normalizeTheme(settings?.default_theme || DEFAULT_THEME);
  const userOverride = localStorage.getItem(THEME_USER_OVERRIDE_KEY) === "1";
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const storedVersion = localStorage.getItem(THEME_SITE_VERSION_KEY);
  const siteVersion = settings?.updated_at || "";

  if (userOverride && THEME_IDS.includes(storedTheme)) {
    return storedTheme;
  }

  if (siteVersion && storedVersion !== siteVersion) {
    localStorage.setItem(THEME_SITE_VERSION_KEY, siteVersion);
  }

  return siteDefault;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [siteDefaultTheme, setSiteDefaultTheme] = useState(DEFAULT_THEME);
  const [siteSettings, setSiteSettings] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSiteTheme() {
      try {
        const settings = await api.getSiteSettings();
        if (cancelled) {
          return;
        }
        setSiteSettings(settings);
        setSiteDefaultTheme(normalizeTheme(settings.default_theme));
        setThemeState(resolveThemeFromSettings(settings));
      } catch {
        if (!cancelled) {
          setThemeState(normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY)));
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    loadSiteTheme();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, ready]);

  const setTheme = useCallback((nextTheme) => {
    const normalized = normalizeTheme(nextTheme);
    localStorage.setItem(THEME_USER_OVERRIDE_KEY, "1");
    setThemeState(normalized);
  }, []);

  const applySiteDefaultTheme = useCallback((settings) => {
    const normalized = normalizeTheme(settings?.default_theme || DEFAULT_THEME);
    localStorage.removeItem(THEME_USER_OVERRIDE_KEY);
    if (settings?.updated_at) {
      localStorage.setItem(THEME_SITE_VERSION_KEY, settings.updated_at);
    }
    setSiteSettings(settings);
    setSiteDefaultTheme(normalized);
    setThemeState(normalized);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themeMeta: THEMES[theme],
      themes: THEMES,
      siteDefaultTheme,
      siteSettings,
      ready,
      setTheme,
      applySiteDefaultTheme,
    }),
    [theme, siteDefaultTheme, siteSettings, ready, setTheme, applySiteDefaultTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
