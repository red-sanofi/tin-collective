export const THEMES = {
  poster: {
    id: "poster",
    labelKey: "themes.poster.name",
    descriptionKey: "themes.poster.description",
    previewClass: "theme-preview-poster",
  },
  artisan: {
    id: "artisan",
    labelKey: "themes.artisan.name",
    descriptionKey: "themes.artisan.description",
    previewClass: "theme-preview-artisan",
  },
};

export const THEME_IDS = Object.keys(THEMES);
export const DEFAULT_THEME = "poster";
export const THEME_STORAGE_KEY = "tin-theme";
