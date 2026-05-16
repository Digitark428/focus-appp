import { Maximize2, Pause, Play } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { formatTime, toMin } from "../utils/time";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MainTimerRing() {
  const {
    isRunning, pausedAt, currentTask, nextTask, progress, remainingSec,
    now, demoMode, dayCompletions, togglePlay, setFocusMode, user,
  } = useFocus();

  if (!isRunning && !pausedAt) return null;

  const strokeOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  // Countdown waiting next task
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
  const accent = currentTask ? currentTask.color : nextTask ? nextTask.color : TEMPO.gold;
  const firstName = user?.firstName || "";

  const eased = Math.pow(countdownProgress / 100, 1.8);
  const particleCount = Math.max(1, Math.floor(1 + eased * 249));

  return (
    <div className="flex flex-col items-center mb-3">
      <div className="relative w-72 h-72">
        {/* Halo doré derrière l'anneau */}
        <div
          className="absolute inset-4 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${accent}20 0%, transparent 65%)`,
            filter: "blur(20px)",
          }}
        />

        <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 280 280">
          {/* Anneau de fond */}
          <circle
            cx="140" cy="140" r={RADIUS}
            stroke="rgba(255,255,255,0.06)" strokeWidth="2" fill="none"
          />
          {currentTask && (
            <circle
              cx="140" cy="140" r={RADIUS}
              stroke={currentTask.color} strokeWidth="3" fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
              style={{
                transition: "stroke-dashoffset 1s linear, stroke 0.6s ease",
                filter: `drop-shadow(0 0 10px ${currentTask.color}aa)`,
              }}
            />
          )}
          {!currentTask && nextTask && !demoMode && (
            <circle
              cx="140" cy="140" r={RADIUS}
              stroke={accent} strokeWidth="2" fill="none"
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
              const angle = ((i * 137.508) % 360);
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
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: TEMPO.textDim }}
              >
                en cours
              </p>
              <h2 className="text-2xl font-light mb-3" style={{ color: TEMPO.text }}>
                {currentTask.name}
              </h2>
              <div
                className="text-5xl font-extralight font-mono tabular-nums tracking-tight"
                style={{ color: currentTask.color }}
              >
                {formatTime(remainingSec)}
              </div>
              <p className="text-xs mt-3" style={{ color: TEMPO.textDim }}>
                {demoMode ? "démo" : `${currentTask.start} → ${currentTask.end}`}
              </p>
            </>
          ) : demoMode ? (
            <>
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: TEMPO.textDim }}
              >
                Journée terminée
              </p>
              <h2 className="text-2xl font-light" style={{ color: TEMPO.text + "a0" }}>
                {firstName ? `Bravo ${firstName} 🎉` : "Bravo 🎉"}
              </h2>
            </>
          ) : nextTask ? (
            <>
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: TEMPO.textDim }}
              >
                {Object.keys(dayCompletions).length > 0
                  ? "Ta prochaine tâche commence dans"
                  : firstName ? `Prêt ${firstName} ?` : "Ta journée commence dans"}
              </p>
              <div
                className="text-5xl font-extralight font-mono tabular-nums tracking-tight"
                style={{ color: accent }}
              >
                {formatTime(countdownSec)}
              </div>
              <p className="text-sm mt-4" style={{ color: TEMPO.text }}>
                <span style={{ color: TEMPO.textDim }}>{nextTask.name} · </span>
                <span className="font-mono tabular-nums">{nextTask.start}</span>
              </p>
            </>
          ) : (
            <>
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: TEMPO.textDim }}
              >
                Journée terminée
              </p>
              <h2 className="text-2xl font-light" style={{ color: TEMPO.text + "a0" }}>
                {firstName ? `Belle journée, ${firstName} 🎉` : "Bravo 🎉"}
              </h2>
              <p className="text-[11px] mt-3 px-4" style={{ color: TEMPO.textDim }}>
                {firstName ? `Toutes tes tâches sont passées.` : "Toutes les tâches sont passées"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full backdrop-blur border flex items-center justify-center transition active:scale-95"
          style={{
            background: pausedAt ? TEMPO_GRADIENTS.gold : "rgba(255,255,255,0.06)",
            borderColor: pausedAt ? TEMPO.gold : TEMPO.border,
            color: pausedAt ? "#1A1206" : TEMPO.text,
            boxShadow: pausedAt ? TEMPO_SHADOWS.goldSm : "none",
          }}
        >
          {pausedAt
            ? <Play size={16} fill="#1A1206" className="ml-0.5" style={{ color: "#1A1206" }} />
            : <Pause size={16} fill="#F5F7FA" style={{ color: TEMPO.text }} />}
        </button>
        <button
          onClick={() => setFocusMode(true)}
          className="px-4 py-2.5 rounded-full border backdrop-blur flex items-center gap-2 transition hover:bg-white/5"
          style={{ borderColor: TEMPO.gold + "40", background: TEMPO.gold + "10" }}
        >
          <Maximize2 size={12} style={{ color: TEMPO.gold }} />
          <span className="text-xs font-medium" style={{ color: TEMPO.gold }}>
            Plein écran
          </span>
        </button>
      </div>

      {pausedAt && (
        <p
          className="text-xs mt-3 tracking-[0.2em] uppercase flex items-center gap-2"
          style={{ color: TEMPO.textDim }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: TEMPO.gold, boxShadow: `0 0 6px ${TEMPO.gold}` }}
          />
          En pause
        </p>
      )}
    </div>
  );
}
