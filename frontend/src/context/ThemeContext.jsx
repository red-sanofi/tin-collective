import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, THEME_IDS, THEME_STORAGE_KEY, THEMES } from "../constants/themes";

const ThemeContext = createContext(null);

function readStoredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_IDS.includes(stored) ? stored : DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      themeMeta: THEMES[theme],
      themes: THEMES,
      setTheme: setThemeState,
    }),
    [theme],
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
