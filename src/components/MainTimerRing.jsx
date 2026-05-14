import { Maximize2, Pause, Play } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { formatTime, toMin } from "../utils/time";

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MainTimerRing() {
  const {
    isRunning, pausedAt, currentTask, nextTask, progress, remainingSec,
    now, demoMode, dayCompletions, dayTheme, togglePlay, setFocusMode,
  } = useFocus();

  if (!isRunning && !pausedAt) return null;

  const strokeOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  // Countdown when waiting for the next task.
  let countdownSec = 0;
  let totalWaitSec = 0;
  if (!currentTask && nextTask) {
    const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    countdownSec = Math.max(0, Math.floor((toMin(nextTask.start) - nowMin) * 60));
    totalWaitSec = Math.min(60 * 60, countdownSec + 1);
  }
  const countdownProgress = totalWaitSec > 0
    ? Math.max(0, ((totalWaitSec - countdownSec) / totalWaitSec) * 100)
    : 0;
  const countdownOffset = CIRCUMFERENCE - (countdownProgress / 100) * CIRCUMFERENCE;
  const accent = currentTask ? currentTask.color : nextTask ? nextTask.color : dayTheme.accent;

  // Particle field — 1 at 0%, ~250 at 100%.
  const eased = Math.pow(countdownProgress / 100, 1.8);
  const particleCount = Math.max(1, Math.floor(1 + eased * 249));

  return (
    <div className="flex flex-col items-center mb-3">
      <div className="relative w-72 h-72">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r={RADIUS} stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
          {currentTask && (
            <circle
              cx="140" cy="140" r={RADIUS} stroke={currentTask.color} strokeWidth="3" fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.6s ease" }}
            />
          )}
          {!currentTask && nextTask && !demoMode && (
            <circle
              cx="140" cy="140" r={RADIUS} stroke={accent} strokeWidth="2" fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={countdownOffset}
              style={{
                transition: "stroke-dashoffset 1s linear",
                filter: `drop-shadow(0 0 8px ${accent}80)`,
                opacity: 0.8,
              }}
            />
          )}
        </svg>

        {/* Countdown particle field */}
        {!currentTask && nextTask && !demoMode && (
          <div className="absolute inset-2 rounded-full overflow-hidden pointer-events-none">
            {Array.from({ length: particleCount }).map((_, i) => {
              const angle = ((i * 137.508) % 360); // golden angle
              const distRatio = 0.05 + ((i * 17) % 90) / 100;
              const x = 50 + Math.cos((angle * Math.PI) / 180) * distRatio * 47;
              const y = 50 + Math.sin((angle * Math.PI) / 180) * distRatio * 47;
              const size = 1 + ((i * 7) % 4);
              const duration = 1.5 + ((i * 11) % 30) / 10;
              const delay = ((i * 13) % 40) / 10;
              return (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: accent,
                    boxShadow: `0 0 ${3 + countdownProgress / 10}px ${accent}`,
                    opacity: 0.3 + countdownProgress / 150,
                    animation: `particle-pulse ${duration}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {currentTask ? (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">en cours</p>
              <h2 className="text-2xl font-light mb-3">{currentTask.name}</h2>
              <div
                className="text-5xl font-extralight font-mono tabular-nums tracking-tight"
                style={{ color: currentTask.color }}
              >
                {formatTime(remainingSec)}
              </div>
              <p className="text-xs text-white/40 mt-3">
                {demoMode ? "démo" : `${currentTask.start} → ${currentTask.end}`}
              </p>
            </>
          ) : demoMode ? (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Journée terminée</p>
              <h2 className="text-2xl font-light text-white/60">Bravo 🎉</h2>
            </>
          ) : nextTask ? (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                {Object.keys(dayCompletions).length > 0
                  ? "Votre prochaine tâche commence dans"
                  : "Votre journée commence dans"}
              </p>
              <div className="text-5xl font-extralight font-mono tabular-nums tracking-tight" style={{ color: accent }}>
                {formatTime(countdownSec)}
              </div>
              <p className="text-sm text-white/60 mt-4">
                <span className="text-white/40">{nextTask.name} · </span>
                <span className="font-mono tabular-nums">{nextTask.start}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Journée terminée</p>
              <h2 className="text-2xl font-light text-white/60">Bravo 🎉</h2>
              <p className="text-[11px] text-white/40 mt-3 px-4">Toutes les tâches sont passées</p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full backdrop-blur border flex items-center justify-center transition active:scale-95"
          style={{
            background: pausedAt ? dayTheme.accent : "rgba(255,255,255,0.1)",
            borderColor: pausedAt ? dayTheme.accent : "rgba(255,255,255,0.2)",
            color: pausedAt ? "#000" : "#fff",
          }}
        >
          {pausedAt ? <Play size={16} fill="#000" className="ml-0.5" /> : <Pause size={16} fill="#fff" />}
        </button>
        <button
          onClick={() => setFocusMode(true)}
          className="px-4 py-2.5 rounded-full border backdrop-blur flex items-center gap-2 transition hover:bg-white/5"
          style={{ borderColor: dayTheme.accent + "40", background: dayTheme.accent + "10" }}
        >
          <Maximize2 size={12} style={{ color: dayTheme.accent }} />
          <span className="text-xs font-medium" style={{ color: dayTheme.accent }}>
            Plein écran
          </span>
        </button>
      </div>

      {pausedAt && (
        <p className="text-xs text-white/50 mt-3 tracking-[0.2em] uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: dayTheme.accent }} />
          En pause
        </p>
      )}
    </div>
  );
}
