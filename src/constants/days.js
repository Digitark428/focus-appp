// Days of the week with their mood. Index 0 = Monday (custom ordering).
export const DAY_NAMES = [
  { name: "Lundi",    short: "Lun", mood: "Recommencement" },
  { name: "Mardi",    short: "Mar", mood: "Concentration" },
  { name: "Mercredi", short: "Mer", mood: "Équilibre" },
  { name: "Jeudi",    short: "Jeu", mood: "Élan" },
  { name: "Vendredi", short: "Ven", mood: "Énergie" },
  { name: "Samedi",   short: "Sam", mood: "Liberté" },
  { name: "Dimanche", short: "Dim", mood: "Repos" },
];

// Color palettes — each defines 7 colors (one per day of the week).
export const CUSTOM_THEMES = {
  default: {
    label: "Tempo",
    description: "Doré nuit · identité officielle Tempo",
    // 7 nuances dorées subtilement variées — une par jour, mais
    // toutes dans la famille Tempo pour préserver l'identité.
    colors: ["#D9B36A", "#E2C078", "#F2D28F", "#D9B36A", "#E8C684", "#F2D28F", "#C9A361"],
  },
  ocean: {
    label: "Océan",
    description: "Bleus profonds, calme et sérénité",
    colors: ["#67E8F9", "#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#A78BFA", "#C7D2FE"],
  },
  forest: {
    label: "Forêt",
    description: "Verts naturels, ancrage et croissance",
    colors: ["#86EFAC", "#34D399", "#10B981", "#059669", "#65A30D", "#A3E635", "#D9F99D"],
  },
  sunset: {
    label: "Crépuscule",
    description: "Couleurs chaudes du coucher de soleil",
    colors: ["#FCA5A5", "#F87171", "#FB923C", "#FBBF24", "#F59E0B", "#EC4899", "#F472B6"],
  },
  rose: {
    label: "Rose tendre",
    description: "Doux et romantique",
    colors: ["#FBCFE8", "#F9A8D4", "#F472B6", "#EC4899", "#DB2777", "#BE185D", "#FECDD3"],
  },
  monochrome: {
    label: "Monochrome",
    description: "Élégance pure, niveaux de gris",
    colors: ["#E5E5E5", "#D4D4D4", "#A3A3A3", "#737373", "#525252", "#404040", "#262626"],
  },
};
