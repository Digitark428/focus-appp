// ============================================================
//  TempoLogo — reproduction SVG du logo officiel Tempo.
//
//  Logo : un carré arrondi sombre avec dégradé bleu nuit → doré
//  glow, contenant trois "barres" stylisées (les 2 supérieures
//  longues, la 3ᵉ courte) + un point doré (le ".").
//  Composant réutilisable, animable, sans dépendance externe.
// ============================================================
import { TEMPO } from "../utils/tempoTheme";

export default function TempoLogo({
  size = 96,
  glow = true,
  animated = false,
  className = "",
  style = {},
}) {
  const uid = `tempo-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {/* Halo doré derrière le logo */}
      {glow && (
        <div
          className="absolute inset-0 rounded-[28%] pointer-events-none"
          style={{
            background:
              `radial-gradient(circle at 70% 30%, ${TEMPO.goldGlow}55 0%, ${TEMPO.gold}22 30%, transparent 60%)`,
            filter: "blur(18px)",
            transform: "scale(1.15)",
            opacity: 0.9,
            animation: animated ? "tempo-pulse 4s ease-in-out infinite" : undefined,
          }}
        />
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative"
        style={{ filter: glow ? `drop-shadow(0 8px 24px ${TEMPO.bg}cc)` : undefined }}
      >
        <defs>
          {/* Gradient principal du carré : nuit profonde → halo doré */}
          <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#0E2148" />
            <stop offset="55%" stopColor="#0B1D3A" />
            <stop offset="100%" stopColor="#1F2C44" />
          </linearGradient>

          {/* Lumière dorée en haut-droite */}
          <radialGradient id={`${uid}-light`} cx="78%" cy="28%" r="60%">
            <stop offset="0%"  stopColor={TEMPO.goldGlow} stopOpacity="0.55" />
            <stop offset="40%" stopColor={TEMPO.gold}     stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000"           stopOpacity="0" />
          </radialGradient>

          {/* Bordure subtile */}
          <linearGradient id={`${uid}-edge`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#4A5A78" stopOpacity="0.7" />
            <stop offset="100%" stopColor={TEMPO.gold} stopOpacity="0.4" />
          </linearGradient>

          {/* Métal doré pour les barres */}
          <linearGradient id={`${uid}-bar`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#E8DCC4" />
            <stop offset="55%"  stopColor="#F2E0BA" />
            <stop offset="100%" stopColor="#C9A877" />
          </linearGradient>

          {/* Métal doré vertical pour la 3ᵉ barre courte */}
          <linearGradient id={`${uid}-bar2`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#F2E0BA" />
            <stop offset="100%" stopColor="#B88E45" />
          </linearGradient>

          {/* Glow doré pour le point */}
          <radialGradient id={`${uid}-dot`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={TEMPO.goldGlow} />
            <stop offset="60%" stopColor={TEMPO.gold} />
            <stop offset="100%" stopColor={TEMPO.goldDeep} />
          </radialGradient>
        </defs>

        {/* Carré arrondi de fond */}
        <rect
          x="8" y="8" width="84" height="84" rx="22" ry="22"
          fill={`url(#${uid}-bg)`}
        />
        {/* Lumière dorée superposée */}
        <rect
          x="8" y="8" width="84" height="84" rx="22" ry="22"
          fill={`url(#${uid}-light)`}
        />
        {/* Liseré du carré */}
        <rect
          x="8.5" y="8.5" width="83" height="83" rx="21.5" ry="21.5"
          fill="none" stroke={`url(#${uid}-edge)`} strokeWidth="0.8"
        />

        {/* Barre 1 (la plus longue, en haut) — parallélogramme arrondi */}
        <path
          d="M 26 32 L 70 32 Q 75 32 75 36.5 Q 75 41 70 41 L 30 41 Q 25 41 25 36.5 Q 25 32 30 32 Z"
          fill={`url(#${uid}-bar)`}
          transform="skewX(-12) translate(7,0)"
        />

        {/* Barre 2 (milieu, longue) */}
        <path
          d="M 26 49 L 68 49 Q 73 49 73 53.5 Q 73 58 68 58 L 30 58 Q 25 58 25 53.5 Q 25 49 30 49 Z"
          fill={`url(#${uid}-bar)`}
          transform="skewX(-12) translate(8,0)"
        />

        {/* Barre 3 (courte, en bas) */}
        <path
          d="M 26 66 L 48 66 Q 53 66 53 70.5 Q 53 75 48 75 L 30 75 Q 25 75 25 70.5 Q 25 66 30 66 Z"
          fill={`url(#${uid}-bar)`}
          transform="skewX(-12) translate(9,0)"
        />

        {/* Le point doré (le ".") à droite de la 3ᵉ barre */}
        <circle
          cx="65" cy="70.5" r="4.2"
          fill={`url(#${uid}-dot)`}
          style={{ filter: `drop-shadow(0 0 4px ${TEMPO.gold}aa)` }}
        />

        {/* Highlight subtil en haut-droite des barres */}
        <path
          d="M 60 33.5 L 73 33.5"
          stroke={TEMPO.goldGlow} strokeWidth="0.6"
          opacity="0.7" strokeLinecap="round"
          transform="skewX(-12) translate(7,0)"
        />
      </svg>

      {animated && (
        <style>{`
          @keyframes tempo-pulse {
            0%, 100% { opacity: 0.55; transform: scale(1.15); }
            50%      { opacity: 1;    transform: scale(1.25); }
          }
        `}</style>
      )}
    </div>
  );
}

// Variante compacte sans halo, utile en header / nav
export function TempoLogoMini({ size = 28, className = "" }) {
  return <TempoLogo size={size} glow={false} className={className} />;
}
