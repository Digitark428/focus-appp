// === BRAIN — 28-day habit cycles ===
// A habit cycle lasts 28 days. Each validated day (>=80% completion) adds a
// neuron. Twelve cycles in total — each with its own color.

export const BRAIN_CYCLE_DAYS = 28;
export const BRAIN_NODES_PER_CYCLE = 70; // total nodes added during one cycle (~2-3 per day)

// 12 cycle colors (one per cycle, then loops).
export const BRAIN_CYCLE_COLORS = [
  "#A78BFA", // 1  — violet
  "#60A5FA", // 2  — blue
  "#34D399", // 3  — green
  "#FBBF24", // 4  — amber
  "#FB923C", // 5  — orange
  "#F472B6", // 6  — pink
  "#F87171", // 7  — red
  "#22D3EE", // 8  — cyan
  "#A3E635", // 9  — lime
  "#FBBF77", // 10 — peach
  "#C084FC", // 11 — magenta
  "#FFFFFF", // 12 — white (legendary final cycle)
];
