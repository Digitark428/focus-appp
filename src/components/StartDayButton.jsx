import { Maximize2, Play, RotateCcw } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function StartDayButton() {
  const {
    sortedTasks, isRunning, pausedAt, dayCompletions, user,
    startDay, setShowNoTasksWarning, setFocusMode, setShowResetConfirm,
  } = useFocus();

  if (isRunning || pausedAt) return null;

  return (
    <div className="mt-10 mb-4 flex flex-col items-center">
      <button
        onClick={() => {
          if (sortedTasks.length === 0) setShowNoTasksWarning(true);
          else startDay();
        }}
        data-tour="startBtn"
        className="group relative w-full overflow-hidden rounded-2xl px-6 py-5 transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: TEMPO_GRADIENTS.cardAccent,
          border: `1px solid ${TEMPO.gold}40`,
          boxShadow: `0 0 30px ${TEMPO.gold}18, inset 0 1px 0 ${TEMPO.gold}25`,
        }}
      >
        <div
          className="absolute inset-y-0 w-1/3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${TEMPO.gold}40 50%, transparent 100%)`,
            animation: "goal-shimmer 2s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: TEMPO.gold }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-25"
                style={{ background: TEMPO.gold, animationDuration: "3s" }}
              />
              <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: TEMPO.gold + "60" }}
              />
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: TEMPO_GRADIENTS.gold,
                  boxShadow: TEMPO_SHADOWS.gold,
                }}
              >
                <Play size={14} fill="#1A1206" className="ml-0.5" style={{ color: "#1A1206" }} />
              </div>
            </div>

            <div className="text-left">
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-0.5"
                style={{ color: TEMPO.textDim }}
              >
                {sortedTasks.length > 0
                  ? (user?.firstName ? `Prêt ${user.firstName} ?` : "Tout est prêt")
                  : "Aucune tâche"}
              </p>
              <p className="text-base font-medium" style={{ color: TEMPO.gold }}>
                Démarrer la journée
              </p>
            </div>
          </div>

          {sortedTasks.length > 0 ? (
            <div className="text-right">
              <p
                className="text-[10px] uppercase tracking-widest mb-0.5"
                style={{ color: TEMPO.textDim }}
              >
                Première
              </p>
              <p className="text-xs font-medium truncate max-w-[120px]" style={{ color: TEMPO.text }}>
                {sortedTasks[0]?.name}
              </p>
              <p className="text-[10px] font-mono tabular-nums" style={{ color: TEMPO.textMuted }}>
                {sortedTasks[0]?.start}
              </p>
            </div>
          ) : (
            <div className="text-right">
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: TEMPO.textDim }}
              >
                0 tâche
              </p>
              <p className="text-[10px] italic mt-0.5" style={{ color: TEMPO.textMuted }}>
                à programmer
              </p>
            </div>
          )}
        </div>
      </button>

      <button
        onClick={() => setFocusMode(true)}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition"
        style={{ color: TEMPO.textDim }}
      >
        <Maximize2 size={11} />
        Mode plein écran
      </button>

      {(sortedTasks.length > 0 || Object.keys(dayCompletions).length > 0) && (
        <button
          onClick={() => setShowResetConfirm(true)}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] transition hover:text-red-400/70"
          style={{ color: TEMPO.textMuted }}
        >
          <RotateCcw size={10} />
          Réinitialiser la journée
        </button>
      )}
    </div>
  );
}
