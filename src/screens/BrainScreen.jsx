import { Check, ChevronLeft } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { BRAIN_CYCLE_COLORS, BRAIN_CYCLE_DAYS } from "../constants/brain";
import { generateBrainGeometry } from "../utils/brainGeometry";
import { TEMPO, TEMPO_GRADIENTS } from "../utils/tempoTheme";

export default function BrainScreen() {
  const {
    setShowBrain, brainTotalDays, brainPreviewCycle, setBrainPreviewCycle,
  } = useFocus();

  const displayedDays = brainPreviewCycle !== null
    ? brainPreviewCycle * BRAIN_CYCLE_DAYS
    : brainTotalDays;

  const { nodes, links } = generateBrainGeometry(displayedDays);

  const displayedCycleIdx = Math.floor(displayedDays / BRAIN_CYCLE_DAYS)
    - (displayedDays > 0 && displayedDays % BRAIN_CYCLE_DAYS === 0 ? 1 : 0);
  const displayedDayInCycle = displayedDays === 0 ? 0 : ((displayedDays - 1) % BRAIN_CYCLE_DAYS) + 1;
  const displayedCycleProgress = displayedDays === 0 ? 0 : ((displayedDays - 1) % BRAIN_CYCLE_DAYS) / BRAIN_CYCLE_DAYS;
  const displayedColor = BRAIN_CYCLE_COLORS[Math.max(0, displayedCycleIdx) % BRAIN_CYCLE_COLORS.length];
  const totalCycles = Math.max(1, displayedCycleIdx + 1);
  const isNewCycleStart = displayedDayInCycle === 0 && displayedDays > 0;

  const statCard = {
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${TEMPO.border}`,
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: displayedColor }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => { setShowBrain(false); setBrainPreviewCycle(null); }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
          >
            <ChevronLeft size={18} style={{ color: TEMPO.text }} />
          </button>
          <h2 className="text-lg font-light" style={{ color: TEMPO.text }}>Mon cerveau</h2>
          <div className="w-10" />
        </header>

        {brainPreviewCycle !== null && (
          <div
            className="mb-4 px-3 py-2 rounded-xl border flex items-center justify-between"
            style={{
              borderColor: "rgba(250,204,21,0.3)",
              background: "rgba(250,204,21,0.06)",
            }}
          >
            <span className="text-[11px]" style={{ color: "rgba(253,224,71,0.85)" }}>
              🧪 Aperçu cycle {brainPreviewCycle} (bêta)
            </span>
            <button
              onClick={() => setBrainPreviewCycle(null)}
              className="text-[10px] underline transition hover:opacity-100"
              style={{ color: "rgba(253,224,71,0.7)" }}
            >
              Quitter l'aperçu
            </button>
          </div>
        )}

        <div className="text-center mb-3">
          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-1"
            style={{ color: TEMPO.textDim }}
          >
            Cycle {Math.max(1, displayedCycleIdx + 1)} sur 12
          </p>
          <p className="text-2xl font-extralight" style={{ color: displayedColor }}>
            {displayedDays === 0 ? "Pas encore commencé" : `Jour ${displayedDayInCycle} / ${BRAIN_CYCLE_DAYS}`}
          </p>
        </div>

        {/* Brain visualization */}
        <div
          className="relative aspect-square mb-6 rounded-3xl overflow-hidden"
          style={{
            background: "radial-gradient(circle at center, rgba(11,29,58,1) 0%, rgba(7,19,38,1) 100%)",
            border: `1px solid ${displayedColor}30`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3/4 h-3/4 rounded-full blur-3xl opacity-20" style={{ background: displayedColor }} />
          </div>

          <svg viewBox="0 0 200 220" className="relative w-full h-full">
            <defs>
              <filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#neonGlow)" stroke="rgba(245,247,250,0.85)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 100 18 C 70 18, 48 32, 44 60 C 42 72, 44 88, 50 102 L 50 114 C 46 116, 44 122, 46 128 C 48 134, 53 136, 56 134 L 58 138 C 60 152, 68 168, 78 176 C 80 178, 78 184, 82 186 C 88 192, 96 194, 100 194 C 104 194, 112 192, 118 186 C 122 184, 120 178, 122 176 C 132 168, 140 152, 142 138 L 144 134 C 147 136, 152 134, 154 128 C 156 122, 154 116, 150 114 L 150 102 C 156 88, 158 72, 156 60 C 152 32, 130 18, 100 18 Z" />
              <path d="M 73 88 Q 80 84, 88 88" />
              <path d="M 112 88 Q 120 84, 127 88" />
              <path d="M 100 95 L 96 125 Q 96 130, 102 130" />
              <path d="M 88 152 Q 100 156, 112 152" />
              <path d="M 92 158 Q 100 162, 108 158" opacity="0.6" />
            </g>

            <g>
              {links.map((link, i) => {
                const from = nodes[link.from];
                const to = nodes[link.to];
                if (!from || !to) return null;
                return (
                  <line
                    key={`l${i}`}
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={link.color}
                    strokeWidth={link.isBridge ? "0.7" : "0.45"}
                    opacity={link.isBridge ? "0.85" : "0.6"}
                    style={{ filter: `drop-shadow(0 0 1.5px ${link.color})` }}
                  />
                );
              })}
            </g>

            <g filter="url(#nodeGlow)">
              {nodes.map((node, i) => (
                <circle
                  key={`n${i}`}
                  cx={node.x} cy={node.y} r={node.size} fill={node.color}
                  style={{ filter: `drop-shadow(0 0 3px ${node.color})` }}
                >
                  <animate
                    attributeName="opacity"
                    values="0.55;1;0.55"
                    dur={`${2 + (i % 4) * 0.5}s`}
                    repeatCount="indefinite"
                    begin={`${node.twinkleDelay}s`}
                  />
                </circle>
              ))}
            </g>

            <ellipse cx="100" cy="210" rx="50" ry="3" fill={displayedColor} opacity="0.55" style={{ filter: "blur(3px)" }} />
            <ellipse cx="100" cy="211" rx="30" ry="1.5" fill={displayedColor} opacity="0.9" style={{ filter: "blur(1px)" }} />
          </svg>

          {displayedDays === 0 && (
            <div className="absolute inset-x-0 bottom-12 text-center px-6">
              <p
                className="text-xs italic leading-relaxed"
                style={{ color: TEMPO.textDim }}
              >
                Validez au moins 80% de vos tâches aujourd'hui<br />
                pour activer votre première connexion.
              </p>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="rounded-xl p-3 text-center" style={statCard}>
            <p
              className="text-[9px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Jours
            </p>
            <p
              className="text-xl font-light font-mono tabular-nums"
              style={{ color: displayedColor }}
            >
              {displayedDays}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={statCard}>
            <p
              className="text-[9px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Connexions
            </p>
            <p
              className="text-xl font-light font-mono tabular-nums"
              style={{ color: TEMPO.text }}
            >
              {nodes.length + links.length}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={statCard}>
            <p
              className="text-[9px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Cycles
            </p>
            <p
              className="text-xl font-light font-mono tabular-nums"
              style={{ color: TEMPO.text }}
            >
              {totalCycles}<span className="text-sm" style={{ color: TEMPO.textMuted }}>/12</span>
            </p>
          </div>
        </div>

        {/* Cycle progress */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-2">
            <p
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: TEMPO.textDim }}
            >
              Progression du cycle
            </p>
            <p
              className="text-xs font-mono tabular-nums"
              style={{ color: displayedColor }}
            >
              {Math.round(displayedCycleProgress * 100)}%
            </p>
          </div>
          <div
            className="relative h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all"
              style={{
                width: `${displayedCycleProgress * 100}%`,
                background: displayedColor,
                boxShadow: `0 0 10px ${displayedColor}`,
              }}
            />
          </div>
          <p className="text-[11px] mt-2 italic" style={{ color: TEMPO.textDim }}>
            {displayedDays === 0 && "Chaque journée validée fait grandir votre cerveau."}
            {displayedDays > 0 && displayedCycleProgress < 0.5 && "Vous bâtissez vos premières habitudes. Continuez."}
            {displayedCycleProgress >= 0.5 && displayedCycleProgress < 1 && "Plus que quelques jours pour terminer ce cycle."}
            {isNewCycleStart && "Nouveau cycle ✨ Une nouvelle couleur, de nouvelles connexions."}
          </p>
        </div>

        {/* Cycle legend */}
        <div className="rounded-2xl p-4 mb-4" style={statCard}>
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: TEMPO.textDim }}
          >
            Vos cycles
          </p>
          <div className="flex flex-wrap gap-2">
            {[...Array(12)].map((_, i) => {
              const isCompleted = i < displayedCycleIdx;
              const isCurrent = i === displayedCycleIdx && displayedDays > 0;
              const isLocked = i > displayedCycleIdx || displayedDays === 0;
              const c = BRAIN_CYCLE_COLORS[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 h-6 rounded-full border flex items-center justify-center"
                    style={{
                      background: isLocked ? "rgba(255,255,255,0.03)" : c + "30",
                      borderColor: isLocked ? TEMPO.border : c,
                      boxShadow: isCurrent ? `0 0 12px ${c}` : "none",
                    }}
                  >
                    {isCompleted && <Check size={10} style={{ color: c }} />}
                    {isCurrent && (
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c }} />
                    )}
                  </div>
                  <p
                    className="text-[8px] font-mono tabular-nums"
                    style={{ color: TEMPO.textMuted }}
                  >
                    {i + 1}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Beta tester cycle preview */}
        <div
          className="rounded-2xl border-2 border-dashed p-4 mb-4"
          style={{
            borderColor: "rgba(250,204,21,0.3)",
            background: "rgba(250,204,21,0.03)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🧪</span>
            <p
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(253,224,71,0.85)" }}
            >
              Aperçu bêta · à supprimer en prod
            </p>
          </div>
          <p
            className="text-[11px] mb-3 leading-relaxed"
            style={{ color: TEMPO.textDim }}
          >
            Visualisez à quoi ressemblera le cerveau après chaque cycle complet.
          </p>
          <div className="grid grid-cols-6 gap-1.5">
            {[...Array(12)].map((_, i) => {
              const cycleNum = i + 1;
              const c = BRAIN_CYCLE_COLORS[i];
              const isActive = brainPreviewCycle === cycleNum;
              return (
                <button
                  key={i}
                  onClick={() => setBrainPreviewCycle(cycleNum)}
                  className="aspect-square rounded-lg border text-[11px] font-mono tabular-nums transition hover:scale-105"
                  style={{
                    background: isActive ? c + "30" : "rgba(255,255,255,0.025)",
                    borderColor: isActive ? c : c + "40",
                    color: isActive ? c : TEMPO.text + "a0",
                    boxShadow: isActive ? `0 0 12px ${c}70` : "none",
                  }}
                >
                  {cycleNum}
                </button>
              );
            })}
          </div>
          <p
            className="text-[10px] italic mt-3 text-center"
            style={{ color: TEMPO.textMuted }}
          >
            Chaque bouton = {BRAIN_CYCLE_DAYS} jours validés × le cycle choisi
          </p>
        </div>

        <p
          className="text-[11px] text-center italic px-4 leading-relaxed"
          style={{ color: TEMPO.textMuted }}
        >
          Un cycle = 28 jours. Le temps qu'il faut pour ancrer une habitude.
          <br />Chaque journée validée à 80% ou plus active une nouvelle connexion.
        </p>
      </div>
    </div>
  );
}
