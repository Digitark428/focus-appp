import { CUSTOM_THEMES, DAY_NAMES } from "../constants/days";

// Returns the resolved list of day themes (one per day of the week) based on
// the currently-selected color palette key.
export const getDayThemes = (themeKey) => {
  const palette = CUSTOM_THEMES[themeKey] || CUSTOM_THEMES.default;
  return DAY_NAMES.map((d, i) => ({
    ...d,
    glow: palette.colors[i],
    accent: palette.colors[i],
  }));
};
