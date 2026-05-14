import { Zap } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { formatTime } from "../utils/time";

export function DemoBanner() {
  const { demoMode } = useFocus();
  if (!demoMode) return null;
  return (
    <div className="mb-6 px-4 py-2.5 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-xs text-yellow-200 flex items-center gap-2">
      <Zap size={12} /> Mode démo : chaque tâche dure 30 secondes
    </div>
  );
}

export function CurrentTaskTopBar() {
  const { isRunning, currentTask, remainingSec } = useFocus();
  if (!isRunning || !currentTask) return null;
  return (
    <div className="relative z-10 bg-black/60 backdrop-blur-xl border-b border-white/5 px-5 py-2 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: currentTask.color }} />
        <span className="font-medium tracking-wide">{currentTask.name}</span>
      </div>
      <div className="font-mono tabular-nums text-white/80">{formatTime(remainingSec)} restant</div>
    </div>
  );
}
