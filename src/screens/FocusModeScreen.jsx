import { X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { formatTime } from "../utils/time";
import { AMBIENT_SOUNDS } from "../constants/tasks";

export default function FocusModeScreen() {
  const {
    setFocusMode, currentTask, nextTask, progress, remainingSec,
    activeAmbient, activeCustomTrack, customTracks, dayTheme,
  } = useFocus();

  const bigRadius = 160;
  const bigCircumference = 2 * Math.PI * bigRadius;
  const bigOffset = bigCircumference - (progress / 100) * bigCircumference;
  const accent = currentTask?.color || dayTheme.accent;

  const activeSound = activeAmbient
    ? AMBIENT_SOUNDS.find((s) => s.id === activeAmbient)?.name
    : activeCustomTrack
      ? customTracks.find((t) => t.id === activeCustomTrack)?.name
      : null;

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: accent }}
        />
      </div>

      <button
        onClick={() => setFocusMode(false)}
        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 backdrop-blur flex items-center justify-center hover:bg-white/10 transition z-10"
      >
        <X size={18} />
      </button>

      {activeSound && (
        <div className="absolute top-6 left-6 px-3 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          <span className="text-white/70 truncate max-w-[160px]">{activeSound}</span>
        </div>
      )}

      <div className="relative w-[360px] h-[360px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 360 360">
          <circle cx="180" cy="180" r={bigRadius} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
          {currentTask && (
            <circle
              cx="180" cy="180" r={bigRadius} stroke={accent} strokeWidth="4" fill="none"
              strokeLinecap="round"
              strokeDasharray={bigCircumference} strokeDashoffset={bigOffset}
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.6s ease",
                filter: `drop-shadow(0 0 12px ${accent}80)`,
              }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {currentTask ? (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">{currentTask.name}</p>
              <div className="text-7xl font-extralight font-mono tabular-nums tracking-tight" style={{ color: accent }}>
                {formatTime(remainingSec)}
              </div>
              <div className="text-3xl font-light mt-3 text-white/70 tabular-nums">{Math.round(progress)}%</div>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">en attente</p>
              <div className="text-5xl font-extralight text-white/40">—</div>
            </>
          )}
        </div>
      </div>

      {nextTask && (
        <p className="absolute bottom-12 text-xs text-white/30 tracking-widest uppercase">
          Ensuite · {nextTask.name}
        </p>
      )}
    </div>
  );
}
