import { ChevronDown, Clock, Sparkles } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TASK_CATEGORIES } from "../../constants/tasks";
import { toMin } from "../../utils/time";

export default function AddEditTaskModal() {
  const {
    showAdd, setShowAdd,
    editingTask, isFloatingForm, setIsFloatingForm,
    taskForm, setTaskForm, saveTask,
    setShowCategoryPicker, setPickerStep,
    sortedTasks, dayTheme,
  } = useFocus();

  if (!showAdd) return null;

  const cat = taskForm.category ? TASK_CATEGORIES.find((c) => c.id === taskForm.category) : null;
  const CatIcon = cat?.icon;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={() => setShowAdd(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-lg font-light mb-1">
          {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
        </h3>
        <p className="text-xs text-white/40 mb-4">{dayTheme.name}</p>

        {/* Toggle Avec/Sans horaire */}
        {!editingTask && (
          <div className="flex mb-5 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
            <button
              onClick={() => setIsFloatingForm(false)}
              className="flex-1 py-2.5 text-xs font-medium transition"
              style={!isFloatingForm
                ? { background: dayTheme.accent + "25", color: dayTheme.accent, borderRight: `1px solid ${dayTheme.accent}30` }
                : { color: "rgba(255,255,255,0.4)" }}
            >
              Avec horaire
            </button>
            <button
              onClick={() => setIsFloatingForm(true)}
              className="flex-1 py-2.5 text-xs font-medium transition"
              style={isFloatingForm
                ? { background: "#FB923C25", color: "#FB923C" }
                : { color: "rgba(255,255,255,0.4)" }}
            >
              Sans horaire
            </button>
          </div>
        )}

        {/* Hint */}
        {!editingTask && !isFloatingForm && sortedTasks.length > 0 && (() => {
          const lastTask = sortedTasks.reduce(
            (latest, t) => (toMin(t.end) > toMin(latest.end) ? t : latest),
            sortedTasks[0],
          );
          return (
            <div
              className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
              style={{ background: dayTheme.accent + "10", borderColor: dayTheme.accent + "30" }}
            >
              <Clock size={13} className="shrink-0 mt-0.5" style={{ color: dayTheme.accent }} />
              <div className="text-[11px] leading-relaxed">
                <p className="text-white/70">
                  Votre dernière tâche se termine à{" "}
                  <span className="font-mono tabular-nums font-medium text-white">{lastTask.end}</span>
                </p>
                <p className="text-white/40 mt-0.5">L'heure de début est pré-remplie pour enchaîner</p>
              </div>
            </div>
          );
        })()}

        {isFloatingForm && (
          <div
            className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
            style={{ background: "rgba(251,146,60,0.1)", borderColor: "rgba(251,146,60,0.3)" }}
          >
            <span className="text-base shrink-0">🔖</span>
            <div className="text-[11px] leading-relaxed">
              <p className="text-white/70">Cette tâche n'a pas d'horaire.</p>
              <p className="text-white/40 mt-0.5">
                Elle apparaîtra dans la section "À programmer" sans impacter votre planning.
              </p>
            </div>
          </div>
        )}

        {/* Category picker entry */}
        <button
          onClick={() => { setShowCategoryPicker(true); setPickerStep("category"); }}
          className="w-full mb-4 p-3.5 rounded-xl border flex items-center gap-3 transition hover:bg-white/5"
          style={{
            borderColor: cat ? cat.color + "60" : "rgba(167,139,250,0.4)",
            background: cat ? cat.color + "10" : "rgba(167,139,250,0.08)",
          }}
        >
          {cat ? (
            <>
              {CatIcon && <CatIcon size={18} style={{ color: cat.color }} />}
              <div className="flex-1 text-left">
                <p className="text-sm font-medium" style={{ color: cat.color }}>{cat.name}</p>
                {taskForm.subcategory && (
                  <p className="text-[11px] text-white/60">{taskForm.subcategory}</p>
                )}
              </div>
              <span className="text-xs text-white/40">Changer</span>
            </>
          ) : (
            <>
              <Sparkles size={18} className="text-violet-400" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-violet-300">Tâches prédéfinies</p>
                <p className="text-[11px] text-white/50">Choisir parmi les catégories prédéfinies</p>
              </div>
              <ChevronDown size={14} className="text-white/40 -rotate-90" />
            </>
          )}
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-white/30 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <div className="space-y-3">
          <input
            type="text" placeholder="Nom de la tâche (libre)" value={taskForm.name}
            onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
          />

          {!isFloatingForm && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Début</label>
                <input
                  type="time" value={taskForm.start}
                  onChange={(e) => setTaskForm({ ...taskForm, start: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Fin</label>
                <input
                  type="time" value={taskForm.end}
                  onChange={(e) => setTaskForm({ ...taskForm, end: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-white/40 mb-1 block">Notes / sous-tâches</label>
            <textarea
              placeholder="Ajoute des notes, sous-tâches, rappels..." value={taskForm.notes}
              onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })} rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowAdd(false)}
            className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
          >
            Annuler
          </button>
          <button
            onClick={saveTask}
            className="flex-1 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition"
          >
            {editingTask ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
