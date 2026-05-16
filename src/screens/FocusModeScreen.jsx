import { X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { formatTime } from "../utils/time";
import { AMBIENT_SOUNDS } from "../constants/tasks";
import { TEMPO, TEMPO_GRADIENTS } from "../utils/tempoTheme";

export default function FocusModeScreen() {
  const {
    setFocusMode, currentTask, nextTask, progress, remainingSec,
    activeAmbient, activeCustomTrack, customTracks,
  } = useFocus();

  const bigRadius = 160;
  const bigCircumference = 2 * Math.PI * bigRadius;
  const bigOffset = bigCircumference - (progress / 100) * bigCircumference;
  const accent = currentTask?.color || TEMPO.gold;

  const activeSound = activeAmbient
    ? AMBIENT_SOUNDS.find((s) => s.id === activeAmbient)?.name
    : activeCustomTrack
      ? customTracks.find((t) => t.id === activeCustomTrack)?.name
      : null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: accent }}
        />
      </div>

      <button
        onClick={() => setFocusMode(false)}
        className="absolute top-6 right-6 w-11 h-11 rounded-full backdrop-blur flex items-center justify-center transition z-10 hover:bg-white/10"
        style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
      >
        <X size={18} style={{ color: TEMPO.text }} />
      </button>

      {activeSound && (
        <div
          className="absolute top-6 left-6 px-3 py-2 rounded-full backdrop-blur border flex items-center gap-2 text-xs"
          style={{ background: "rgba(255,255,255,0.05)", borderColor: TEMPO.border }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: accent, boxShadow: `0 0 4px ${accent}` }}
          />
          <span className="truncate max-w-[160px]" style={{ color: TEMPO.text + "b0" }}>
            {activeSound}
          </span>
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
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: TEMPO.textDim }}
              >
                {currentTask.name}
              </p>
              <div
                className="text-7xl font-extralight font-mono tabular-nums tracking-tight"
                style={{ color: accent }}
              >
                {formatTime(remainingSec)}
              </div>
              <div
                className="text-3xl font-light mt-3 tabular-nums"
                style={{ color: TEMPO.text + "b0" }}
              >
                {Math.round(progress)}%
              </div>
            </>
          ) : (
            <>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: TEMPO.textDim }}
              >
                en attente
              </p>
              <div className="text-5xl font-extralight" style={{ color: TEMPO.textDim }}>—</div>
            </>
          )}
        </div>
      </div>

      {nextTask && (
        <p
          className="absolute bottom-12 text-xs tracking-widest uppercase"
          style={{ color: TEMPO.textMuted }}
        >
          Ensuite · <span style={{ color: TEMPO.textDim }}>{nextTask.name}</span>
        </p>
      )}
    </div>
  );
}
