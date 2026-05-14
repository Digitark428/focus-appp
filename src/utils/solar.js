// === SOLAR AMBIANCE ===
// Returns a light atmosphere object based on the current real hour.
// Sun position is expressed as a vertical percentage (0% = top, 100% = bottom).
export const getSolarAmbiance = (date) => {
  const h = date.getHours() + date.getMinutes() / 60; // fractional hour 0..24

  // Night: 0–5 and 22–24
  if (h < 5 || h >= 22) {
    return {
      phase: "night",
      sunY: 110, // off-screen below
      coreOpacity: 0,
      haloOpacity: 0,
      bgGradient: "transparent",
      glowColor: "transparent",
      glowIntensity: 0,
    };
  }

  // Dawn: 5–7
  if (h < 7) {
    const t = (h - 5) / 2; // 0→1
    return {
      phase: "dawn",
      sunY: 18 - t * 6, // 18% → 12%
      coreOpacity: 0.10 + t * 0.12,
      haloOpacity: 0.18 + t * 0.15,
      bgGradient: `radial-gradient(ellipse 80% 40% at 50% ${18 - t * 6}%, rgba(251,113,133,${0.10 + t * 0.08}) 0%, rgba(251,146,60,${0.07 + t * 0.06}) 30%, transparent 70%)`,
      glowColor: `rgba(251,146,60,${0.12 + t * 0.10})`,
      glowIntensity: 0.15 + t * 0.15,
      accentColor: "#FB923C",
    };
  }

  // Morning: 7–11
  if (h < 11) {
    const t = (h - 7) / 4;
    return {
      phase: "morning",
      sunY: 12 - t * 4, // 12% → 8%
      coreOpacity: 0.22 + t * 0.10,
      haloOpacity: 0.33 + t * 0.08,
      bgGradient: `radial-gradient(ellipse 70% 35% at 50% ${12 - t * 4}%, rgba(253,186,116,${0.12 + t * 0.06}) 0%, rgba(251,146,60,${0.08 + t * 0.04}) 35%, transparent 65%)`,
      glowColor: `rgba(253,186,116,${0.18 + t * 0.08})`,
      glowIntensity: 0.30 + t * 0.12,
      accentColor: "#FCD34D",
    };
  }

  // Midday: 11–14
  if (h < 14) {
    const t = (h - 11) / 3;
    return {
      phase: "midday",
      sunY: 8 + t * 8, // 8% → 16%
      coreOpacity: 0.32 + t * 0.04,
      haloOpacity: 0.41 - t * 0.04,
      bgGradient: `radial-gradient(ellipse 60% 30% at 50% ${8 + t * 8}%, rgba(253,230,138,${0.14}) 0%, rgba(251,191,36,${0.08}) 40%, transparent 65%)`,
      glowColor: `rgba(253,230,138,${0.22})`,
      glowIntensity: 0.42,
      accentColor: "#FDE68A",
    };
  }

  // Afternoon: 14–18
  if (h < 18) {
    const t = (h - 14) / 4;
    return {
      phase: "afternoon",
      sunY: 16 + t * 20, // 16% → 36%
      coreOpacity: 0.36 - t * 0.10,
      haloOpacity: 0.37 - t * 0.06,
      bgGradient: `radial-gradient(ellipse 65% 35% at 50% ${16 + t * 20}%, rgba(251,191,36,${0.12 - t * 0.04}) 0%, rgba(251,146,60,${0.08 - t * 0.02}) 40%, transparent 65%)`,
      glowColor: `rgba(251,146,60,${0.18 - t * 0.06})`,
      glowIntensity: 0.42 - t * 0.12,
      accentColor: "#FBBF24",
    };
  }

  // Sunset / dusk: 18–22
  const t = (h - 18) / 4;
  return {
    phase: "sunset",
    sunY: 36 + t * 40, // 36% → 76%
    coreOpacity: 0.26 - t * 0.20,
    haloOpacity: 0.31 - t * 0.25,
    bgGradient: `radial-gradient(ellipse 75% 40% at 50% ${36 + t * 40}%, rgba(251,113,133,${0.14 - t * 0.12}) 0%, rgba(251,146,60,${0.12 - t * 0.10}) 30%, rgba(180,83,9,${0.06 - t * 0.05}) 55%, transparent 70%)`,
    glowColor: `rgba(251,113,133,${0.16 - t * 0.14})`,
    glowIntensity: 0.30 - t * 0.28,
    accentColor: "#FB923C",
  };
};
