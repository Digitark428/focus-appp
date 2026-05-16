// ============================================================
//  TEMPO. — Identité visuelle officielle
//  Palette / tokens centralisés pour toute l'application.
// ============================================================

export const TEMPO = {
  // Fonds
  bg:        "#071326", // Fond principal
  bgAlt:     "#0B1D3A", // Fond secondaire (cartes / surfaces)

  // Accents dorés
  gold:      "#D9B36A", // Accent doré principal
  goldGlow:  "#F2D28F", // Glow doré (highlights)
  goldDeep:  "#B88E45", // Doré profond (ombres)

  // Texte
  text:      "#F5F7FA", // Texte principal
  textDim:   "#B8C0CC", // Texte secondaire
  textMuted: "#7A8494", // Texte tertiaire

  // Surfaces
  surface:        "rgba(255,255,255,0.04)",
  surfaceStrong:  "rgba(255,255,255,0.07)",
  border:         "rgba(255,255,255,0.08)",
  borderStrong:   "rgba(255,255,255,0.14)",

  // États
  danger:  "#F87171",
  success: "#86EFAC",
  warning: "#FBBF24",
};

// Gradients prêts à l'emploi
export const TEMPO_GRADIENTS = {
  // Fond global immersif
  bgRadial:
    "radial-gradient(ellipse at top right, rgba(217,179,106,0.10) 0%, transparent 45%), radial-gradient(ellipse at bottom left, rgba(11,29,58,0.6) 0%, transparent 50%), linear-gradient(180deg, #071326 0%, #050E1F 100%)",

  // Gradient doré pour CTA / accents
  gold:
    "linear-gradient(135deg, #F2D28F 0%, #D9B36A 50%, #B88E45 100%)",
  goldSoft:
    "linear-gradient(135deg, rgba(242,210,143,0.25) 0%, rgba(217,179,106,0.12) 100%)",

  // Carte (surface premium)
  card:
    "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%)",
  cardAccent:
    "linear-gradient(135deg, rgba(217,179,106,0.10) 0%, rgba(11,29,58,0.4) 100%)",
};

// Ombres premium
export const TEMPO_SHADOWS = {
  card:    "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
  cardHi:  "0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
  gold:    "0 8px 28px rgba(217,179,106,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
  goldSm:  "0 4px 14px rgba(217,179,106,0.30)",
};
