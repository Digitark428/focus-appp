import { useFocus } from "../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS } from "../utils/tempoTheme";

export function TrialBanner() {
  const { user, trialDaysLeft, setShowSubscription } = useFocus();
  if (user.isSubscribed || trialDaysLeft <= 0) return null;

  return (
    <button
      onClick={() => setShowSubscription(true)}
      className="w-full mb-3 px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 transition hover:scale-[1.01]"
      style={{
        background: TEMPO_GRADIENTS.cardAccent,
        border: `1px solid ${TEMPO.gold}30`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: TEMPO.gold, boxShadow: `0 0 6px ${TEMPO.gold}` }}
        />
        <p className="text-xs" style={{ color: TEMPO.textDim }}>
          Essai gratuit ·{" "}
          <span className="font-medium" style={{ color: TEMPO.text }}>
            {trialDaysLeft} {trialDaysLeft > 1 ? "jours" : "jour"} restant{trialDaysLeft > 1 ? "s" : ""}
          </span>
        </p>
      </div>
      <span className="text-[11px] font-medium" style={{ color: TEMPO.gold }}>
        Activer →
      </span>
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
        background: "linear-gradient(135deg, rgba(248,113,113,0.10) 0%, rgba(248,113,113,0.03) 100%)",
        borderColor: "rgba(248,113,113,0.35)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(248,113,113,0.18)", border: "1px solid rgba(248,113,113,0.35)" }}
        >
          <span className="text-base">⚠️</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1" style={{ color: "#FCA5A5" }}>
            {existingConflicts.length} conflit{existingConflicts.length > 1 ? "s" : ""} d'horaire
            détecté{existingConflicts.length > 1 ? "s" : ""}
          </p>
          <div className="space-y-0.5">
            {existingConflicts.slice(0, 3).map((c, i) => (
              <p key={i} className="text-[11px]" style={{ color: TEMPO.textDim }}>
                <span style={{ color: c.taskA.color }}>{c.taskA.name}</span>
                {" "}({c.taskA.start}-{c.taskA.end}) chevauche{" "}
                <span style={{ color: c.taskB.color }}>{c.taskB.name}</span>
                {" "}({c.taskB.start}-{c.taskB.end})
              </p>
            ))}
            {existingConflicts.length > 3 && (
              <p className="text-[11px] italic" style={{ color: TEMPO.textMuted }}>
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
          background: "rgba(248,113,113,0.20)",
          color: "#FCA5A5",
          border: "1px solid rgba(248,113,113,0.35)",
        }}
      >
        Réparer automatiquement
      </button>
    </div>
  );
}
