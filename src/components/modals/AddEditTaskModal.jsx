import { ChevronLeft, Clock, Pencil, Sparkles, X } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TASK_CATEGORIES } from "../../constants/tasks";
import { toMin } from "../../utils/time";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../../utils/tempoTheme";

const FLOAT_ACCENT = "#E2B872";

// ============================================================
//  AddEditTaskModal
//
//  Modal de SAISIE des tâches. Affiché uniquement quand
//  showAdd === true ET addFlowMode ∈ {custom, predefined,
//  floating, edit}. Chaque mode change l'apparence et les
//  champs visibles, mais le state reste isolé.
//
//  IMPORTANT : ce modal ne contient PLUS de bouton "Tâches
//  prédéfinies" ni de bascule entre flows. Pour changer de
//  flow, l'utilisateur ferme et passe par AddTaskTypeChooser.
//  Cela élimine définitivement la fuite d'état historique.
// ============================================================
export default function AddEditTaskModal() {
  const {
    showAdd, addFlowMode, closeAddFlow,
    editingTask, isFloatingForm,
    taskForm, setTaskForm, saveTask,
    setShowAdd, setShowCategoryPicker, setPickerStep, setPickedCategory,
    sortedTasks, dayTheme,
  } = useFocus();

  // N'affiche le modal de saisie que si on est dans un mode pertinent.
  if (!showAdd) return null;
  if (!["custom", "predefined", "floating", "edit"].includes(addFlowMode)) return null;

  const isPredefined = addFlowMode === "predefined";
  const isFloating = addFlowMode === "floating" || (addFlowMode === "edit" && isFloatingForm);
  const isEdit = addFlowMode === "edit";

  const cat = taskForm.category ? TASK_CATEGORIES.find((c) => c.id === taskForm.category) : null;
  const CatIcon = cat?.icon;

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };

  // Bouton retour : pour le flow "predefined", revient au picker.
  // Pour les autres flows, revient au chooser (re-démarre la sélection
  // de type sans tout fermer).
  const goBack = () => {
    if (isEdit) {
      closeAddFlow();
      return;
    }
    if (isPredefined) {
      setShowAdd(false);
      setPickerStep("category");
      setPickedCategory(null);
      setShowCategoryPicker(true);
    } else {
      closeAddFlow();
    }
  };

  // Titre dynamique selon le flow.
  const title = isEdit
    ? "Modifier la tâche"
    : isPredefined
      ? "Détails de la tâche"
      : isFloating
        ? "Nouvelle tâche sans horaire"
        : "Nouvelle tâche personnalisée";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center backdrop-blur-sm overflow-y-auto"
      style={{
        background: "rgba(7,19,38,0.7)",
        paddingTop: "max(16px, env(safe-area-inset-top))",
        paddingBottom: "max(120px, calc(env(safe-area-inset-bottom) + 120px))",
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={closeAddFlow}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm my-auto relative"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.borderStrong}`,
          boxShadow: TEMPO_SHADOWS.cardHi,
          maxHeight: "calc(100dvh - 160px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Header : retour + titre + close */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {!isEdit && (
              <button
                onClick={goBack}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition hover:bg-white/5 -ml-1"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${TEMPO.border}` }}
                aria-label="Retour"
              >
                <ChevronLeft size={14} style={{ color: TEMPO.textDim }} />
              </button>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-light truncate" style={{ color: TEMPO.text }}>{title}</h3>
              <p className="text-xs" style={{ color: TEMPO.textDim }}>{dayTheme.name}</p>
            </div>
          </div>
          <button
            onClick={closeAddFlow}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition hover:bg-white/5"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${TEMPO.border}` }}
            aria-label="Fermer"
          >
            <X size={14} style={{ color: TEMPO.textDim }} />
          </button>
        </div>

        {/* Catégorie sélectionnée (uniquement en mode predefined) — non éditable
            ici, l'utilisateur doit revenir au picker pour la changer. */}
        {isPredefined && cat && (
          <div
            className="mb-4 p-3.5 rounded-xl flex items-center gap-3"
            style={{
              background: cat.color + "15",
              border: `1px solid ${cat.color}40`,
            }}
          >
            {CatIcon && <CatIcon size={18} style={{ color: cat.color }} />}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: TEMPO.textDim }}>
                {cat.name}
              </p>
              <p className="text-sm font-medium truncate" style={{ color: cat.color }}>
                {taskForm.subcategory || cat.name}
              </p>
            </div>
            <button
              onClick={goBack}
              className="text-[11px] px-2.5 py-1 rounded-full transition"
              style={{ background: cat.color + "20", color: cat.color }}
            >
              Changer
            </button>
          </div>
        )}

        {/* Encart contextuel : flow custom (avec horaire) — heure suggérée */}
        {addFlowMode === "custom" && !isEdit && sortedTasks.length > 0 && (() => {
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
                  Dernière tâche jusqu'à{" "}
                  <span className="font-mono tabular-nums font-medium" style={{ color: TEMPO.text }}>
                    {lastTask.end}
                  </span>
                </p>
                <p className="mt-0.5" style={{ color: TEMPO.textDim }}>
                  L'heure de début est pré-remplie pour enchaîner.
                </p>
              </div>
            </div>
          );
        })()}

        {/* Encart contextuel : flow floating */}
        {isFloating && (
          <div
            className="mb-4 px-3.5 py-2.5 rounded-xl flex items-start gap-2.5 border"
            style={{ background: FLOAT_ACCENT + "10", borderColor: FLOAT_ACCENT + "30" }}
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

        {/* ===== CHAMPS DU FORMULAIRE ===== */}
        <div className="space-y-3">
          <div>
            <label className="text-xs mb-1 block flex items-center gap-1.5" style={{ color: TEMPO.textDim }}>
              {isPredefined ? <Sparkles size={10} style={{ color: TEMPO.gold }} /> : <Pencil size={10} />}
              Nom de la tâche
            </label>
            <input
              type="text"
              placeholder={isPredefined ? "Personnalisez le nom si besoin" : "Ex. Séance de yoga"}
              value={taskForm.name}
              onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
              className={inputCls}
              style={inputStyle}
            />
          </div>

          {!isFloating && (
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
              placeholder="Ajoutez des notes, sous-tâches, rappels..."
              value={taskForm.notes}
              onChange={(e) => setTaskForm({ ...taskForm, notes: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={closeAddFlow}
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
            {isEdit ? "Enregistrer" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
