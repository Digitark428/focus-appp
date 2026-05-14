import { ChevronRight } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { BRAIN_CYCLE_COLORS } from "../constants/brain";

export function TrialBanner() {
  const { user, trialDaysLeft, setShowSubscription, dayTheme } = useFocus();
  if (user.isSubscribed || trialDaysLeft <= 0) return null;

  return (
    <button
      onClick={() => setShowSubscription(true)}
      className="w-full mb-3 px-4 py-2.5 rounded-2xl border flex items-center justify-between gap-3 transition hover:bg-white/[0.04]"
      style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dayTheme.accent }} />
        <p className="text-xs text-white/70">
          Essai gratuit · <span className="font-medium text-white">
            {trialDaysLeft} {trialDaysLeft > 1 ? "jours" : "jour"} restant{trialDaysLeft > 1 ? "s" : ""}
          </span>
        </p>
      </div>
      <span className="text-[11px] font-medium" style={{ color: dayTheme.accent }}>
        Activer →
      </span>
    </button>
  );
}

export function BrainBanner() {
  const {
    setShowBrain, brainTotalDays, brainCurrentCycleIdx, brainDayInCycle,
    brainCycleProgress, brainCurrentColor,
  } = useFocus();

  return (
    <button
      onClick={() => setShowBrain(true)}
      data-tour="brain"
      className="w-full mb-6 px-4 py-3 rounded-2xl border flex items-center gap-3 transition hover:bg-white/[0.04] group"
      style={{
        background: `linear-gradient(135deg, ${brainCurrentColor}10 0%, transparent 70%)`,
        borderColor: brainCurrentColor + "30",
      }}
    >
      <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full blur-md opacity-50" style={{ background: brainCurrentColor }} />
        <svg viewBox="0 0 60 60" className="relative w-full h-full">
          <path
            d="M 30 10 C 18 10, 10 16, 10 26 C 8 32, 12 38, 18 42 C 22 46, 26 47, 30 46 C 34 47, 38 46, 42 42 C 48 38, 52 32, 50 26 C 50 16, 42 10, 30 10 Z"
            fill="none" stroke={brainCurrentColor} strokeWidth="0.8" opacity="0.7"
          />
          {[...Array(Math.min(brainTotalDays, 12))].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const r = 10 + (i % 3) * 3;
            return (
              <circle
                key={i}
                cx={30 + Math.cos(angle) * r}
                cy={26 + Math.sin(angle) * r * 0.7}
                r="1.3"
                fill={BRAIN_CYCLE_COLORS[Math.floor((i / Math.max(brainTotalDays, 1)) * (brainCurrentCycleIdx + 1)) % BRAIN_CYCLE_COLORS.length]}
              >
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur={`${1.5 + (i % 3) * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.1}s`}
                />
              </circle>
            );
          })}
        </svg>
      </div>

      <div className="flex-1 text-left min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5">Mon cerveau</p>
        <p className="text-sm font-medium" style={{ color: brainCurrentColor }}>
          {brainTotalDays === 0
            ? "Validez votre première journée"
            : `Cycle ${brainCurrentCycleIdx + 1} · Jour ${brainDayInCycle + (brainTotalDays > 0 ? 1 : 0)}/28`}
        </p>
      </div>

      {brainTotalDays > 0 && (
        <div className="w-12 h-1 rounded-full overflow-hidden bg-white/10 shrink-0">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${brainCycleProgress * 100}%`,
              background: brainCurrentColor,
              boxShadow: `0 0 6px ${brainCurrentColor}`,
            }}
          />
        </div>
      )}

      <ChevronRight size={14} className="text-white/40 shrink-0" />
    </button>
  );
}

export function ConflictsBanner() {
  const { existingConflicts, autoRepairConflicts, setConflictDialog } = useFocus();
  if (existingConflicts.length === 0) return null;

  return (
    <div
      className="mb-6 rounded-2xl border p-4"
      style={{
        background: "linear-gradient(135deg, rgba(248,113,113,0.12) 0%, rgba(248,113,113,0.04) 100%)",
        borderColor: "rgba(248,113,113,0.4)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(248,113,113,0.2)", border: "1px solid rgba(248,113,113,0.4)" }}
        >
          <span className="text-base">⚠️</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-300 mb-1">
            {existingConflicts.length} conflit{existingConflicts.length > 1 ? "s" : ""} d'horaire
            détecté{existingConflicts.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-0.5">
            {existingConflicts.slice(0, 3).map((c, i) => (
              <p key={i} className="text-[11px] text-white/60">
                <span style={{ color: c.taskA.color }}>{c.taskA.name}</span>
                {" "}({c.taskA.start}-{c.taskA.end}) chevauche{" "}
                <span style={{ color: c.taskB.color }}>{c.taskB.name}</span>
                {" "}({c.taskB.start}-{c.taskB.end})
              </p>
            ))}
            {existingConflicts.length > 3 && (
              <p className="text-[11px] text-white/40 italic">
                …et {existingConflicts.length - 3} autre{existingConflicts.length - 3 > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          const ok = autoRepairConflicts();
          if (!ok) {
            setConflictDialog({
              type: "repairFailed",
              message: "Impossible de réparer automatiquement : le décalage nécessaire dépasse minuit.",
            });
          }
        }}
        className="w-full py-2.5 rounded-xl text-xs font-medium transition hover:scale-[1.01]"
        style={{
          background: "rgba(248,113,113,0.25)",
          color: "#FCA5A5",
          border: "1px solid rgba(248,113,113,0.4)",
        }}
      >
        Réparer automatiquement
      </button>
    </div>
  );
}
