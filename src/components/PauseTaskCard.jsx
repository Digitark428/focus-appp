import { CheckCircle2, ChevronDown, Moon, Pencil, Trash2, X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TASK_CATEGORIES } from "../constants/tasks";
import { TEMPO } from "../utils/tempoTheme";

export default function PauseTaskCard({ task }) {
  const {
    currentTask, expandedId, setExpandedId, dayCompletions,
    dragState, dragRefs, startLongPress, cancelLongPress,
    getTaskProgress, isPastTask,
    setEndTaskPopup, openEdit, deleteTask,
    popupOpenedAtRef, popupTriggerKindRef,
  } = useFocus();

  const isCurrent = currentTask?.id === task.id;
  const taskProg = getTaskProgress(task);
  const isPast = isPastTask(task) && !isCurrent;
  const isExpanded = expandedId === task.id;
  const completion = dayCompletions[task.id];
  const cat = TASK_CATEGORIES.find((c) => c.isPause);
  const isDragging = dragState?.taskId === task.id;
  const isDropTarget = String(dragState?.overTaskId) === String(task.id);

  return (
    <div
      ref={(el) => { dragRefs.current[task.id] = el; }}
      onMouseDown={(e) => { if (e.button === 0) startLongPress(task, e.clientY); }}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onTouchStart={(e) => startLongPress(task, e.touches[0].clientY)}
      onTouchEnd={cancelLongPress}
      onTouchCancel={cancelLongPress}
      className={`group relative rounded-2xl overflow-hidden transition-all select-none ${
        isDragging ? "scale-[1.03] z-20 opacity-90"
          : isDropTarget ? "scale-[1.01]"
          : isCurrent ? "scale-[1.02]" : ""
      }`}
      style={{
        background: isCurrent
          ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: `1px solid ${isCurrent ? "rgba(255,255,255,0.20)" : TEMPO.border}`,
        boxShadow: isCurrent ? "0 8px 28px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
        opacity: isPast && !isCurrent && !completion ? 0.55 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {taskProg > 0 && (
        <div
          className="absolute inset-y-0 left-0 pointer-events-none transition-all"
          style={{
            width: `${taskProg}%`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.12) 100%)",
            transition: "width 1s linear",
          }}
        />
      )}

      <button
        onClick={() => { if (dragState) return; setExpandedId(isExpanded ? null : task.id); }}
        className="relative w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <div className={`shrink-0 flex flex-col gap-[3px] transition-opacity ${
          isDragging ? "opacity-50" : "opacity-0 group-hover:opacity-20"
        }`}>
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex gap-[3px]">
              <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
              <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
            </div>
          ))}
        </div>

        <div
          className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${TEMPO.borderStrong}` }}
        >
          <Moon size={16} style={{ color: TEMPO.textDim }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-medium" style={{ color: TEMPO.text }}>Pause</h4>
              {(completion === "done" || (isPast && !isCurrent && !completion)) && (
                <CheckCircle2 size={12} className="shrink-0" style={{ color: TEMPO.textDim }} />
              )}
              {completion === "skipped" && <X size={12} className="shrink-0" style={{ color: TEMPO.textMuted }} />}
            </div>
            <span
              className="text-xs font-mono tabular-nums whitespace-nowrap"
              style={{ color: TEMPO.textDim }}
            >
              {task.start} – {task.end}
            </span>
          </div>
          <p className="text-[11px] leading-tight italic" style={{ color: TEMPO.textMuted }}>
            {cat?.tagline}
          </p>
        </div>

        <ChevronDown
          size={15}
          className="shrink-0 transition-transform"
          style={{
            color: TEMPO.textMuted,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      {isExpanded && (
        <div className="px-5 pb-4 space-y-2 pt-3" style={{ borderTop: `1px solid ${TEMPO.border}` }}>
          {task.notes && (
            <p className="text-xs italic leading-relaxed mb-3" style={{ color: TEMPO.textDim }}>
              {task.notes}
            </p>
          )}

          {isCurrent && !completion && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  popupOpenedAtRef.current = null;
                  popupTriggerKindRef.current = "manual";
                  setEndTaskPopup(task);
                }}
                className="flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition hover:bg-white/10"
                style={{
                  borderColor: TEMPO.borderStrong,
                  background: "rgba(255,255,255,0.05)",
                  color: TEMPO.text,
                }}
              >
                <CheckCircle2 size={14} />
                <span className="text-xs font-medium">Terminer</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                className="flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition"
                style={{
                  borderColor: TEMPO.border,
                  background: "rgba(255,255,255,0.025)",
                  color: TEMPO.textDim,
                }}
              >
                <Pencil size={13} />
                <span className="text-xs font-medium">Modifier</span>
              </button>
            </div>
          )}

          <div className="flex justify-end gap-1 pt-1">
            {!isCurrent && (
              <button
                onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                className="w-8 h-8 rounded-full hover:bg-white/5 transition flex items-center justify-center"
                style={{ color: TEMPO.textMuted }}
              >
                <Pencil size={13} />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
              className="w-8 h-8 rounded-full hover:bg-red-500/10 transition flex items-center justify-center hover:text-red-400"
              style={{ color: TEMPO.textMuted }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
