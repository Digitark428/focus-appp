import {
  Brain, CheckCircle2, ChevronDown, Pencil, Play, StickyNote, Trash2,
} from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { MEDITATIONS, TASK_CATEGORIES } from "../constants/tasks";
import { TEMPO } from "../utils/tempoTheme";

export default function TaskCard({ task }) {
  const {
    currentTask, expandedId, setExpandedId, dayCompletions,
    dragState, dragRefs, startLongPress, cancelLongPress,
    getTaskProgress, isPastTask,
    setEndTaskPopup, openEdit, deleteTask, setActiveMeditation,
    popupOpenedAtRef, popupTriggerKindRef,
  } = useFocus();

  const isCurrent = currentTask?.id === task.id;
  const taskProg = getTaskProgress(task);
  const isPast = isPastTask(task) && !isCurrent;
  const isExpanded = expandedId === task.id;
  const linkedMed = task.meditationId ? MEDITATIONS.find((m) => m.id === task.meditationId) : null;
  const cat = task.category ? TASK_CATEGORIES.find((c) => c.id === task.category) : null;
  const CatIcon = cat?.icon;
  const completion = dayCompletions[task.id];

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
      className={`group relative rounded-2xl overflow-hidden border transition-all select-none ${
        isDragging
          ? "scale-[1.03] z-20 opacity-90"
          : isDropTarget
            ? "scale-[1.01]"
            : isCurrent
              ? "scale-[1.02]"
              : isPast
                ? "opacity-55"
                : ""
      }`}
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
        borderColor: isCurrent ? TEMPO.gold + "50" : TEMPO.border,
        boxShadow: isCurrent
          ? `0 8px 28px rgba(0,0,0,0.4), 0 0 24px ${task.color}25, inset 0 1px 0 ${TEMPO.gold}20`
          : "0 4px 14px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.03)",
        ...(isDropTarget && {
          borderColor: task.color + "80",
          boxShadow: `0 0 24px ${task.color}40, inset 0 0 0 2px ${task.color}50`,
        }),
        ...(isDragging && {
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 24px ${task.color}40`,
          cursor: "grabbing",
        }),
        ...(!isDragging && { cursor: "grab" }),
      }}
    >
      {/* Progress fill */}
      <div
        className="absolute inset-y-0 left-0 transition-all pointer-events-none"
        style={{
          width: `${taskProg}%`,
          background: `linear-gradient(90deg, ${task.color}15 0%, ${task.color}50 60%, ${task.color}85 100%)`,
          transition: "width 1s linear",
        }}
      />

      {/* Shimmer edge */}
      {taskProg > 0 && taskProg < 100 && (
        <div
          className="absolute inset-y-0 pointer-events-none"
          style={{ left: `calc(${taskProg}% - 24px)`, width: "48px", transition: "left 1s linear" }}
        >
          <div
            className="absolute inset-y-0 right-6 w-px"
            style={{
              background: task.color,
              boxShadow: `0 0 14px ${task.color}, 0 0 28px ${task.color}80`,
              animation: "shimmer-edge 1.4s ease-in-out infinite",
            }}
          />
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                background: task.color,
                right: `${4 + i * 5}px`,
                top: `${15 + ((i * 13) % 50)}%`,
                opacity: 0,
                animation: `float-up ${1.4 + i * 0.18}s ease-out infinite`,
                animationDelay: `${i * 0.15}s`,
                boxShadow: `0 0 6px ${task.color}`,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => {
          if (dragState) return;
          setExpandedId(isExpanded ? null : task.id);
        }}
        className="relative w-full flex items-center gap-3 p-4 min-h-[72px] text-left"
      >
        {/* Drag handle */}
        <div
          className={`shrink-0 flex flex-col gap-[3px] transition-opacity ${
            isDragging ? "opacity-70" : "opacity-0 group-hover:opacity-30"
          }`}
        >
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-[3px]">
              <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
              <div className="w-[3px] h-[3px] rounded-full bg-white/60" />
            </div>
          ))}
        </div>

        {CatIcon ? (
          <div
            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
            style={{
              background: task.color + "25",
              border: `1px solid ${task.color}30`,
            }}
          >
            <CatIcon size={16} style={{ color: task.color }} />
          </div>
        ) : (
          <div
            className="w-1 h-12 rounded-full shrink-0"
            style={{
              background: task.color,
              boxShadow: `0 0 8px ${task.color}80`,
            }}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={`font-medium flex items-start gap-1.5 leading-snug min-w-0 ${
                task.name.length > 28 ? "text-[13px]" : "text-sm"
              }`}
              style={{
                color: isCurrent ? TEMPO.text : TEMPO.text + "d0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.name}
              <span className="flex items-center gap-1 shrink-0 translate-y-[1px]">
                {(completion === "done" || (isPast && !isCurrent && !completion)) && (
                  <CheckCircle2 size={11} style={{ color: TEMPO.success }} />
                )}
                {completion === "skipped" && (
                  <span className="text-[10px]" style={{ color: TEMPO.textMuted }}>×</span>
                )}
                {task.notes && <StickyNote size={10} style={{ color: TEMPO.textMuted }} />}
                {linkedMed && <Brain size={10} style={{ color: linkedMed.color }} />}
              </span>
            </h4>
            <span
              className="text-[11px] font-mono tabular-nums whitespace-nowrap shrink-0 mt-0.5"
              style={{ color: TEMPO.textDim }}
            >
              {task.start}–{task.end}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: TEMPO.textDim }}>
              {completion === "done"
                ? "✓ Validée"
                : completion === "skipped"
                  ? "Non terminée"
                  : isPast && !isCurrent
                    ? "✓ Terminée"
                    : task.subcategory
                      ? task.subcategory
                      : isCurrent
                        ? "En cours"
                        : "À venir"}
            </span>
            <span
              className="font-mono tabular-nums font-medium"
              style={{ color: isCurrent ? task.color : TEMPO.textDim }}
            >
              {Math.round(taskProg)}%
            </span>
          </div>
        </div>

        <ChevronDown
          size={16}
          className="shrink-0 transition-transform"
          style={{
            color: TEMPO.textDim,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
          }}
        />
      </button>

      {isExpanded && (
        <div
          className="relative border-t backdrop-blur p-4 space-y-3"
          style={{
            borderColor: TEMPO.border,
            background: "rgba(7,19,38,0.4)",
          }}
        >
          {task.notes ? (
            <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: TEMPO.text + "d0" }}>
              {task.notes}
            </div>
          ) : (
            <p className="text-xs italic" style={{ color: TEMPO.textMuted }}>
              Aucune note pour cette tâche.
            </p>
          )}

          {linkedMed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMeditation(linkedMed.id);
              }}
              className="w-full p-3 rounded-xl border flex items-center gap-3 transition hover:bg-white/5"
              style={{ borderColor: linkedMed.color + "40", background: linkedMed.color + "10" }}
            >
              <linkedMed.icon size={18} style={{ color: linkedMed.color }} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium" style={{ color: linkedMed.color }}>{linkedMed.name}</p>
                <p className="text-[11px]" style={{ color: TEMPO.textDim }}>
                  {linkedMed.duration} min · {linkedMed.description}
                </p>
              </div>
              <Play size={14} style={{ color: linkedMed.color }} />
            </button>
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
                className="flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-2 transition hover:scale-[1.01]"
                style={{
                  background: task.color + "15",
                  borderColor: task.color + "50",
                  color: task.color,
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
                  background: "rgba(255,255,255,0.03)",
                  color: TEMPO.textDim,
                }}
              >
                <Pencil size={13} />
                <span className="text-xs font-medium">Modifier</span>
              </button>
            </div>
          )}

          <div className="flex justify-end gap-1 pt-1">
            <button
              onClick={(e) => { e.stopPropagation(); openEdit(task); }}
              className="w-8 h-8 rounded-full hover:bg-white/5 transition flex items-center justify-center"
              style={{ color: TEMPO.textDim }}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
              className="w-8 h-8 rounded-full hover:bg-red-500/10 transition flex items-center justify-center hover:text-red-400"
              style={{ color: TEMPO.textDim }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
