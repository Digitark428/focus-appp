import { CalendarPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TASK_CATEGORIES } from "../constants/tasks";
import { toMin } from "../utils/time";
import { TEMPO } from "../utils/tempoTheme";

// Couleur d'accent secondaire pour les tâches flottantes (légèrement
// distinguée du doré principal sans casser l'identité Tempo).
const FLOAT = "#E2B872";

export default function FloatingTasksSection() {
  const {
    floatingTasks, setFloatingTasks, openAddFloating, openEdit,
    sortedTasks, setIsFloatingForm, setEditingTask, setTaskForm, setShowAdd,
  } = useFocus();

  // Schedule a floating task: copy data into the scheduled task form.
  const scheduleFloating = (task) => {
    setFloatingTasks(floatingTasks.filter((t) => t.id !== task.id));
    setIsFloatingForm(false);
    setEditingTask(null);
    let suggestedStart = "";
    if (sortedTasks.length > 0) {
      const lastTask = sortedTasks.reduce(
        (latest, t) => (toMin(t.end) > toMin(latest.end) ? t : latest),
        sortedTasks[0],
      );
      suggestedStart = lastTask.end;
    }
    setTaskForm({
      name: task.name, start: suggestedStart, end: "",
      notes: task.notes || "", meditationId: null,
      category: task.category || null, subcategory: task.subcategory || null,
    });
    setShowAdd(true);
  };

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: FLOAT, boxShadow: `0 0 6px ${FLOAT}` }}
          />
          <h3 className="text-[10px] uppercase tracking-[0.22em]" style={{ color: TEMPO.textDim }}>
            À programmer · En attente
          </h3>
          {floatingTasks.length > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
              style={{ background: FLOAT + "22", color: FLOAT }}
            >
              {floatingTasks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => openAddFloating()}
          className="text-[11px] transition flex items-center gap-1"
          style={{ color: TEMPO.textDim }}
        >
          <Plus size={12} /> Ajouter
        </button>
      </div>

      {floatingTasks.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-6 text-center"
          style={{ borderColor: FLOAT + "25", background: FLOAT + "06" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: TEMPO.textDim }}>
            Aucune tâche en attente.<br />
            <button
              onClick={() => openAddFloating()}
              className="underline underline-offset-2 transition mt-1"
              style={{ color: FLOAT }}
            >
              Ajouter une tâche sans horaire
            </button>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {floatingTasks.map((task) => {
            const cat = TASK_CATEGORIES.find((c) => c.id === task.category);
            const CatIcon = cat?.icon;
            return (
              <div
                key={task.id}
                className="relative overflow-hidden rounded-2xl border flex items-center gap-3 px-4 py-3.5 group"
                style={{
                  background: `linear-gradient(135deg, ${FLOAT}10 0%, ${FLOAT}04 100%)`,
                  borderColor: FLOAT + "30",
                }}
              >
                <div
                  className="absolute left-0 inset-y-0 w-0.5 rounded-r-full"
                  style={{ background: `linear-gradient(180deg, ${FLOAT}, ${TEMPO.gold}, ${TEMPO.goldDeep})` }}
                />

                <div
                  className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: FLOAT + "18", border: `1px solid ${FLOAT}30` }}
                >
                  {CatIcon
                    ? <CatIcon size={14} style={{ color: FLOAT }} />
                    : <span className="text-base">🔖</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: TEMPO.text }}>
                    {task.name}
                  </p>
                  {task.subcategory && (
                    <p className="text-[11px] truncate" style={{ color: TEMPO.textDim }}>
                      {task.subcategory}
                    </p>
                  )}
                  {task.notes && (
                    <p className="text-[11px] truncate mt-0.5 italic" style={{ color: TEMPO.textMuted }}>
                      {task.notes}
                    </p>
                  )}
                </div>

                <span
                  className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: FLOAT + "18",
                    color: FLOAT,
                    border: `1px solid ${FLOAT}30`,
                  }}
                >
                  En attente
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => scheduleFloating(task)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                    style={{ background: FLOAT + "22", color: FLOAT }}
                    title="Planifier cette tâche"
                  >
                    <CalendarPlus size={13} />
                  </button>
                  <button
                    onClick={() => openEdit(task, true)}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition"
                    style={{ color: TEMPO.textDim }}
                    title="Modifier"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setFloatingTasks(floatingTasks.filter((t) => t.id !== task.id))}
                    className="w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center transition hover:text-red-400"
                    style={{ color: TEMPO.textDim }}
                    title="Supprimer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
