import { Maximize2, Play, RotateCcw } from "lucide-react";
import { useFocus } from "../context/FocusContext";

export default function StartDayButton() {
  const {
    sortedTasks, dayTheme, isRunning, pausedAt, dayCompletions,
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
          background: `linear-gradient(135deg, ${dayTheme.accent}25 0%, ${dayTheme.accent}10 50%, transparent 100%)`,
          border: `1px solid ${dayTheme.accent}40`,
          boxShadow: `0 0 30px ${dayTheme.accent}20, inset 0 1px 0 ${dayTheme.accent}30`,
        }}
      >
        <div
          className="absolute inset-y-0 w-1/3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${dayTheme.accent}40 50%, transparent 100%)`,
            animation: "goal-shimmer 2s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: dayTheme.accent }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ background: dayTheme.accent, animationDuration: "3s" }}
              />
              <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: dayTheme.accent + "60" }}
              />
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${dayTheme.accent} 0%, ${dayTheme.accent}80 100%)`,
                  boxShadow: `0 0 20px ${dayTheme.accent}80`,
                }}
              >
                <Play size={14} fill="black" className="ml-0.5 text-black" />
              </div>
            </div>

            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-0.5">
                {sortedTasks.length > 0 ? "Tout est prêt" : "Aucune tâche"}
              </p>
              <p className="text-base font-medium" style={{ color: dayTheme.accent }}>
                Démarrer la journée
              </p>
            </div>
          </div>

          {sortedTasks.length > 0 ? (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">Première</p>
              <p className="text-xs font-medium text-white/80 truncate max-w-[120px]">
                {sortedTasks[0]?.name}
              </p>
              <p className="text-[10px] font-mono text-white/40 tabular-nums">
                {sortedTasks[0]?.start}
              </p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/40">0 tâche</p>
              <p className="text-[10px] text-white/40 italic mt-0.5">à programmer</p>
            </div>
          )}
        </div>
      </button>

      <button
        onClick={() => setFocusMode(true)}
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/40 hover:text-white/70 transition"
      >
        <Maximize2 size={11} />
        Mode plein écran
      </button>

      {(sortedTasks.length > 0 || Object.keys(dayCompletions).length > 0) && (
        <button
          onClick={() => setShowResetConfirm(true)}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/25 hover:text-red-400/70 transition"
        >
          <RotateCcw size={10} />
          Réinitialiser la journée
        </button>
      )}
    </div>
  );
}
