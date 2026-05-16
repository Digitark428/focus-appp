import { Zap } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { formatTime } from "../utils/time";
import { TEMPO } from "../utils/tempoTheme";

export function DemoBanner() {
  const { demoMode } = useFocus();
  if (!demoMode) return null;
  return (
    <div
      className="mb-6 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
      style={{
        background: TEMPO.gold + "12",
        border: `1px solid ${TEMPO.gold}30`,
        color: TEMPO.goldGlow,
      }}
    >
      <Zap size={12} /> Mode démo : chaque tâche dure 30 secondes
    </div>
  );
}

export function CurrentTaskTopBar() {
  const { isRunning, currentTask, remainingSec } = useFocus();
  if (!isRunning || !currentTask) return null;
  return (
    <div
      className="relative z-10 backdrop-blur-xl px-5 py-2 flex items-center justify-between text-xs"
      style={{
        background: "rgba(7,19,38,0.7)",
        borderBottom: `1px solid ${TEMPO.border}`,
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: currentTask.color, boxShadow: `0 0 6px ${currentTask.color}` }}
        />
        <span className="font-medium tracking-wide" style={{ color: TEMPO.text }}>
          {currentTask.name}
        </span>
      </div>
      <div className="font-mono tabular-nums" style={{ color: TEMPO.textDim }}>
        {formatTime(remainingSec)} restant
      </div>
    </div>
  );
}
