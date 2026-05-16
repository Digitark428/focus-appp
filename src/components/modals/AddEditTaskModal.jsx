import { ChevronDown, Clock, Sparkles } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TASK_CATEGORIES } from "../../constants/tasks";
import { toMin } from "../../utils/time";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../../utils/tempoTheme";

const FLOAT = "#E2B872";

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

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(7,19,38,0.7)" }}
      onClick={() => setShowAdd(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.borderStrong}`,
          boxShadow: TEMPO_SHADOWS.cardHi,
        }}
      >
        <h3 className="text-lg font-light mb-1" style={{ color: TEMPO.text }}>
          {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
        </h3>
        <p className="text-xs mb-4" style={{ color: TEMPO.textDim }}>{dayTheme.name}</p>

        {!editingTask && (
          <div
            className="flex mb-5 rounded-xl overflow-hidden"
            style={{ border: `1px solid ${TEMPO.border}`, background: "rgba(255,255,255,0.025)" }}
          >
            <button
              onClick={() => setIsFloatingForm(false)}
              className="flex-1 py-2.5 text-xs font-medium transition"
              style={!isFloatingForm
                ? { background: TEMPO.gold + "25", color: TEMPO.gold, borderRight: `1px solid ${TEMPO.gold}30` }
                : { color: TEMPO.textDim }}
            >
              Avec horaire
            </button>
            <button
              onClick={() => setIsFloatingForm(true)}
              className="flex-1 py-2.5 text-xs font-medium transition"
              style={isFloatingForm
                ? { background: FLOAT + "25", color: FLOAT }
                : { color: TEMPO.textDim }}
            >
              Sans horaire
            </button>
          </div>
        )}

        {!editingTask && !isFloatingForm && sortedTasks.length > 0 && (() => {
          const lastTask = sortedTasks.reduce(
            (latest, t) => (toMin(t.end) > toMin(latest.end) ? t : latest),
            sortedTasks[0],
          );
          return (
            <div
              className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
              style={{ background: TEMPO.gold + "10", borderColor: TEMPO.gold + "30" }}
            >
              <Clock size={13} className="shrink-0 mt-0.5" style={{ color: TEMPO.gold }} />
              <div className="text-[11px] leading-relaxed">
                <p style={{ color: TEMPO.text + "c0" }}>
                  Votre dernière tâche se termine à{" "}
                  <span className="font-mono tabular-nums font-medium" style={{ color: TEMPO.text }}>
                    {lastTask.end}
                  </span>
                </p>
                <p className="mt-0.5" style={{ color: TEMPO.textDim }}>
                  L'heure de début est pré-remplie pour enchaîner
                </p>
              </div>
            </div>
          );
        })()}

        {isFloatingForm && (
          <div
            className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
            style={{ background: FLOAT + "10", borderColor: FLOAT + "30" }}
          >
            <span className="text-base shrink-0">🔖</span>
            <div className="text-[11px] leading-relaxed">
              <p style={{ color: TEMPO.text + "c0" }}>Cette tâche n'a pas d'horaire.</p>
              <p className="mt-0.5" style={{ color: TEMPO.textDim }}>
                Elle apparaîtra dans la section "À programmer" sans impacter votre planning.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => { setShowCategoryPicker(true); setPickerStep("category"); }}
          className="w-full mb-4 p-3.5 rounded-xl border flex items-center gap-3 transition hover:bg-white/5"
          style={{
            borderColor: cat ? cat.color + "60" : TEMPO.gold + "40",
            background: cat ? cat.color + "10" : TEMPO.gold + "08",
          }}
        >
          {cat ? (
            <>
              {CatIcon && <CatIcon size={18} style={{ color: cat.color }} />}
              <div className="flex-1 text-left">
                <p className="text-sm font-medium" style={{ color: cat.color }}>{cat.name}</p>
                {taskForm.subcategory && (
                  <p className="text-[11px]" style={{ color: TEMPO.textDim }}>{taskForm.subcategory}</p>
                )}
              </div>
              <span className="text-xs" style={{ color: TEMPO.textDim }}>Changer</span>
            </>
          ) : (
            <>
              <Sparkles size={18} style={{ color: TEMPO.gold }} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium" style={{ color: TEMPO.gold }}>Tâches prédéfinies</p>
                <p className="text-[11px]" style={{ color: TEMPO.textDim }}>
                  Choisir parmi les catégories prédéfinies
                </p>
              </div>
              <ChevronDown size={14} className="-rotate-90" style={{ color: TEMPO.textDim }} />
            </>
          )}
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px" style={{ background: TEMPO.border }} />
          <span className="text-[10px] uppercase tracking-widest" style={{ color: TEMPO.textMuted }}>ou</span>
          <div className="flex-1 h-px" style={{ background: TEMPO.border }} />
        </div>

        <div className="space-y-3">
          <input
            type="text" placeholder="Nom de la tâche (libre)" value={taskForm.name}
            onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
            className={inputCls} style={inputStyle}
          />

          {!isFloatingForm && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs mb-1 block" style={{ color: TEMPO.textDim }}>Début</label>
                <input
                  type="time" value={taskForm.start}
                  onChange={(e) => setTaskForm({ ...taskForm, start: e.target.value })}
                  className="w-full rounded-xl px-3 py-3 text-sm focus:outline-none transition"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs mb-1 block" style={{ color: TEMPO.textDim }}>Fin</label>
                <input
                  type="time" value={taskForm.end}
                  onChange={(e) => setTaskForm({ ...taskForm, end: e.target.value })}
                  className="w-full rounded-xl px-3 py-3 text-sm focus:outline-none transition"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs mb-1 block" style={{ color: TEMPO.textDim }}>
              Notes / sous-tâches
            </label>
            <textarea
              placeholder="Ajoute des notes, sous-tâches, rappels..." value={taskForm.notes}
              onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })} rows={4}
              className={`${inputCls} resize-none`} style={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowAdd(false)}
            className="flex-1 py-3 rounded-xl text-sm transition hover:bg-white/5"
            style={{ border: `1px solid ${TEMPO.border}`, color: TEMPO.text }}
          >
            Annuler
          </button>
          <button
            onClick={saveTask}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition active:scale-[0.98]"
            style={{
              background: TEMPO_GRADIENTS.gold,
              color: "#1A1206",
              boxShadow: TEMPO_SHADOWS.gold,
            }}
          >
            {editingTask ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
