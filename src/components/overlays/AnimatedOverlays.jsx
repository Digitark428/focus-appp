import { Check, ChevronRight } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TASK_CATEGORIES } from "../../constants/tasks";
import { BRAIN_CYCLE_DAYS } from "../../constants/brain";

// === VALIDATION BURST ===
// Halo + 16 confetti particles + checkmark when a task is marked done.
export function ValidationBurst() {
  const { validationBurst } = useFocus();
  if (!validationBurst) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] flex items-center justify-center">
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: `radial-gradient(circle, ${validationBurst.color}40 0%, transparent 70%)`,
          animation: "burst-fade 1.6s ease-out forwards",
        }}
      />
      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const distance = 90 + Math.random() * 40;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
              background: validationBurst.color,
              boxShadow: `0 0 8px ${validationBurst.color}`,
              transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
              animation: "confetti-out 1.4s ease-out forwards",
              animationDelay: `${i * 0.02}s`,
            }}
          />
        );
      })}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: validationBurst.color,
          boxShadow: `0 0 40px ${validationBurst.color}, 0 0 80px ${validationBurst.color}60`,
          animation: "check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <Check size={28} strokeWidth={3} className="text-black" />
      </div>
    </div>
  );
}

// === TASK TRANSITION OVERLAY (5s between two tasks) ===
export function TaskTransition() {
  const { taskTransition, setTaskTransition } = useFocus();
  if (!taskTransition) return null;

  return (
    <div className="fixed inset-0 z-[88] flex items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(15,15,20,0.6) 0%, rgba(0,0,0,0.85) 80%)",
          animation: "burst-fade 5s ease-out forwards",
        }}
      />
      <div
        className="relative max-w-sm w-full px-8 text-center pointer-events-auto"
        style={{ animation: "check-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: taskTransition.fromColor }}
          />
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-60"
            style={{ background: taskTransition.fromColor }}
          />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: taskTransition.fromColor,
              boxShadow: `0 0 40px ${taskTransition.fromColor}, 0 0 80px ${taskTransition.fromColor}60`,
            }}
          >
            <Check size={32} strokeWidth={3} className="text-black" />
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Tâche terminée</p>
        <p className="text-xl font-light mb-8" style={{ color: taskTransition.fromColor }}>
          {taskTransition.fromName}
        </p>

        <div className="flex items-center justify-center gap-2 mb-6 opacity-60">
          <div
            className="h-px w-12"
            style={{ background: `linear-gradient(90deg, transparent, ${taskTransition.toColor})` }}
          />
          <ChevronRight size={14} style={{ color: taskTransition.toColor }} />
          <div
            className="h-px w-12"
            style={{ background: `linear-gradient(90deg, ${taskTransition.toColor}, transparent)` }}
          />
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Prochaine tâche</p>
        <p className="text-2xl font-light mb-1" style={{ color: taskTransition.toColor }}>
          {taskTransition.toName}
        </p>
        <p className="text-xs text-white/40 font-mono tabular-nums">{taskTransition.toStart}</p>

        <button
          onClick={() => setTaskTransition(null)}
          className="mt-8 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition"
        >
          Passer
        </button>
      </div>
    </div>
  );
}

// === DRAG GHOST OVERLAY ===
export function DragGhost() {
  const { dragState, tasks } = useFocus();
  if (!dragState) return null;

  const draggingTask = tasks.find((t) => String(t.id) === String(dragState.taskId));
  if (!draggingTask) return null;
  const cat = draggingTask.category ? TASK_CATEGORIES.find((c) => c.id === draggingTask.category) : null;
  const GhostIcon = cat?.icon;
  const targetTask = dragState.overTaskId
    ? tasks.find((t) => String(t.id) === String(dragState.overTaskId))
    : null;

  return (
    <div
      className="fixed z-[200] pointer-events-none"
      style={{ top: dragState.currentY - 28, left: "50%", transform: "translateX(-50%)" }}
    >
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(20,20,28,0.95) 100%)",
          borderColor: draggingTask.color + "70",
          boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 20px ${draggingTask.color}40`,
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: draggingTask.color + "25" }}
        >
          {GhostIcon
            ? <GhostIcon size={13} style={{ color: draggingTask.color }} />
            : <div className="w-1 h-4 rounded-full" style={{ background: draggingTask.color }} />}
        </div>
        <div>
          <p className="text-xs font-medium text-white leading-tight">{draggingTask.name}</p>
          <p className="text-[10px] font-mono tabular-nums" style={{ color: draggingTask.color }}>
            {draggingTask.start} – {draggingTask.end}
          </p>
        </div>
        {targetTask && (
          <div className="flex items-center gap-1.5 ml-1 pl-2.5 border-l border-white/10">
            <ChevronRight size={10} className="text-white/40" />
            <p className="text-[10px] text-white/60 max-w-[80px] truncate">{targetTask.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// === SWAP TOAST ===
export function SwapToast() {
  const { swapToast } = useFocus();
  if (!swapToast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[199] pointer-events-none">
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border backdrop-blur-md"
        style={{
          background: "rgba(15,15,20,0.95)",
          borderColor: "rgba(255,255,255,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          animation: "check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
          <Check size={11} className="text-green-400" strokeWidth={3} />
        </div>
        <p className="text-xs text-white/80 whitespace-nowrap">
          <span className="font-medium text-white">{swapToast.nameA}</span>
          <span className="text-white/40 mx-1.5">↔</span>
          <span className="font-medium text-white">{swapToast.nameB}</span>
          <span className="text-white/50 ml-1.5">échangées</span>
        </p>
      </div>
    </div>
  );
}

// === BRAIN NEW NODE BURST ===
export function BrainNewNodeBurst() {
  const {
    brainNewNodeBurst, setBrainNewNodeBurst, setShowBrain,
    brainCurrentColor, brainDayInCycle, brainCurrentCycleIdx,
  } = useFocus();
  if (!brainNewNodeBurst) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[95] flex items-end justify-center pb-32 sm:pb-40">
      <button
        onClick={() => { setBrainNewNodeBurst(null); setShowBrain(true); }}
        className="pointer-events-auto rounded-2xl border px-5 py-4 backdrop-blur-md flex items-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${brainCurrentColor}25 0%, rgba(15,15,20,0.95) 100%)`,
          borderColor: brainCurrentColor + "60",
          boxShadow: `0 20px 60px ${brainCurrentColor}50, 0 0 40px ${brainCurrentColor}30`,
          animation: "burst-fade 2.4s ease-out forwards",
        }}
      >
        <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ background: brainCurrentColor }} />
          <div
            className="relative w-5 h-5 rounded-full"
            style={{ background: brainCurrentColor, boxShadow: `0 0 16px ${brainCurrentColor}` }}
          />
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: brainCurrentColor }}>
            Nouvelle connexion
          </p>
          <p className="text-sm font-medium text-white">
            Jour {brainDayInCycle}/{BRAIN_CYCLE_DAYS} · Cycle {brainCurrentCycleIdx + 1}
          </p>
        </div>
        <ChevronRight size={14} className="text-white/40 shrink-0" />
      </button>
    </div>
  );
}
