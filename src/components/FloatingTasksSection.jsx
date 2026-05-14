import { CalendarPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TASK_CATEGORIES } from "../constants/tasks";
import { toMin } from "../utils/time";

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
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FB923C" }} />
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">
            À programmer · En attente
          </h3>
          {floatingTasks.length > 0 && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(251,146,60,0.2)", color: "#FB923C" }}
            >
              {floatingTasks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => openAddFloating()}
          className="text-[11px] text-white/40 hover:text-orange-400 transition flex items-center gap-1"
        >
          <Plus size={12} /> Ajouter
        </button>
      </div>

      {floatingTasks.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-6 text-center"
          style={{ borderColor: "rgba(251,146,60,0.25)", background: "rgba(251,146,60,0.03)" }}
        >
          <p className="text-xs text-white/40 leading-relaxed">
            Aucune tâche en attente.<br />
            <button
              onClick={() => openAddFloating()}
              className="text-orange-400/80 hover:text-orange-400 underline underline-offset-2 transition mt-1"
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
                  background: "linear-gradient(135deg, rgba(251,146,60,0.10) 0%, rgba(251,146,60,0.04) 100%)",
                  borderColor: "rgba(251,146,60,0.30)",
                }}
              >
                <div
                  className="absolute left-0 inset-y-0 w-0.5 rounded-r-full"
                  style={{ background: "linear-gradient(180deg, #FB923C, #F97316, #EA580C)" }}
                />

                <div
                  className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}
                >
                  {CatIcon ? <CatIcon size={14} style={{ color: "#FB923C" }} /> : <span className="text-base">🔖</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{task.name}</p>
                  {task.subcategory && (
                    <p className="text-[11px] text-white/40 truncate">{task.subcategory}</p>
                  )}
                  {task.notes && (
                    <p className="text-[11px] text-white/30 truncate mt-0.5 italic">{task.notes}</p>
                  )}
                </div>

                <span
                  className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: "rgba(251,146,60,0.15)",
                    color: "#FB923C",
                    border: "1px solid rgba(251,146,60,0.3)",
                  }}
                >
                  En attente
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => scheduleFloating(task)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110"
                    style={{ background: "rgba(251,146,60,0.2)", color: "#FB923C" }}
                    title="Planifier cette tâche"
                  >
                    <CalendarPlus size={13} />
                  </button>
                  <button
                    onClick={() => openEdit(task, true)}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition text-white/30 hover:text-white/60"
                    title="Modifier"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setFloatingTasks(floatingTasks.filter((t) => t.id !== task.id))}
                    className="w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center transition text-white/30 hover:text-red-400"
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
