import { CalendarPlus, Check, CheckCircle2, Pencil, Trash2, X } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TASK_CATEGORIES } from "../../constants/tasks";
import { toMin } from "../../utils/time";
import { TEMPO, TEMPO_SHADOWS } from "../../utils/tempoTheme";

const FLOAT = "#E2B872";
// Vert pastel premium pour les états "terminé" (cohérent avec TEMPO.success
// déjà utilisé pour les check-icons des tâches programmées).
const SUCCESS_SOFT = "#86EFAC";

// ============================================================
//  FloatingTaskDetailModal
//
//  Détail d'une tâche sans horaire (lecture + actions).
//  Affiché uniquement quand floatingDetail !== null.
//
//  Permet :
//    - de consulter titre / sous-cat / notes / statut complet
//      (titre long entièrement visible, jamais tronqué)
//    - de marquer la tâche comme terminée (vert pastel premium)
//    - de la planifier (réinjecte dans le form custom)
//    - de la modifier ou la supprimer
// ============================================================
export default function FloatingTaskDetailModal() {
  const {
    floatingDetail, closeFloatingDetail,
    floatingTasks, setFloatingTasks,
    dayFloatingCompletions, markFloatingDone, unmarkFloatingDone,
    openEdit, setIsFloatingForm, setEditingTask, setTaskForm,
    setShowAdd, setAddFlowMode, sortedTasks,
  } = useFocus();

  if (!floatingDetail) return null;

  // On relit la version actuelle de la tâche dans la liste pour refléter
  // toute mutation faite ailleurs (édition, etc.) sans fermer le modal.
  const task = floatingTasks.find((t) => t.id === floatingDetail.id) || floatingDetail;
  const cat = task.category ? TASK_CATEGORIES.find((c) => c.id === task.category) : null;
  const CatIcon = cat?.icon;
  const isDone = dayFloatingCompletions[task.id] === "done";

  const handleSchedule = () => {
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
    setAddFlowMode("custom");
    setShowAdd(true);
    closeFloatingDetail();
  };

  const handleEdit = () => {
    closeFloatingDetail();
    openEdit(task, true);
  };

  const handleDelete = () => {
    setFloatingTasks(floatingTasks.filter((t) => t.id !== task.id));
    closeFloatingDetail();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center backdrop-blur-md overflow-y-auto"
      style={{
        background: "rgba(7,19,38,0.82)",
        paddingTop: "max(16px, env(safe-area-inset-top))",
        paddingBottom: "max(120px, calc(env(safe-area-inset-bottom) + 120px))",
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={closeFloatingDetail}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm my-auto relative"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${isDone ? SUCCESS_SOFT + "55" : FLOAT + "40"}`,
          boxShadow: isDone
            ? `0 20px 60px ${SUCCESS_SOFT}1A, ${TEMPO_SHADOWS.cardHi}`
            : `0 20px 60px ${FLOAT}25, ${TEMPO_SHADOWS.cardHi}`,
          maxHeight: "calc(100dvh - 160px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          onClick={closeFloatingDetail}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${TEMPO.border}` }}
          aria-label="Fermer"
        >
          <X size={14} style={{ color: TEMPO.textDim }} />
        </button>

        {/* Badge statut */}
        <div className="flex items-center gap-2 mb-4 pr-8">
          <span
            className="text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full flex items-center gap-1.5"
            style={{
              background: isDone ? SUCCESS_SOFT + "1F" : FLOAT + "1A",
              border: `1px solid ${isDone ? SUCCESS_SOFT + "55" : FLOAT + "35"}`,
              color: isDone ? SUCCESS_SOFT : FLOAT,
            }}
          >
            {isDone
              ? <><CheckCircle2 size={11} /> Terminée</>
              : <>Sans horaire · En attente</>}
          </span>
        </div>

        {/* Icône + titre complet (jamais tronqué) */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center"
            style={{
              background: isDone ? SUCCESS_SOFT + "1F" : FLOAT + "1A",
              border: `1px solid ${isDone ? SUCCESS_SOFT + "55" : FLOAT + "35"}`,
            }}
          >
            {CatIcon
              ? <CatIcon size={20} style={{ color: isDone ? SUCCESS_SOFT : FLOAT }} />
              : <span className="text-xl">🔖</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-light leading-tight break-words"
              style={{
                color: TEMPO.text,
                textDecoration: isDone ? "line-through" : "none",
                textDecorationColor: isDone ? SUCCESS_SOFT + "AA" : undefined,
                textDecorationThickness: "1px",
                opacity: isDone ? 0.85 : 1,
              }}
            >
              {task.name}
            </h3>
            {cat && (
              <p className="text-xs mt-1" style={{ color: TEMPO.textDim }}>
                {cat.name}{task.subcategory ? ` · ${task.subcategory}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Description complète si présente */}
        {task.notes && (
          <div
            className="rounded-2xl p-3.5 mb-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${TEMPO.border}`,
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.22em] mb-1.5"
              style={{ color: TEMPO.textDim }}
            >
              Description
            </p>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap break-words"
              style={{ color: TEMPO.text }}
            >
              {task.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {!isDone ? (
            <button
              onClick={() => markFloatingDone(task.id)}
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02]"
              style={{
                background: SUCCESS_SOFT,
                color: "#0B2415",
                boxShadow: `0 6px 18px ${SUCCESS_SOFT}40`,
              }}
            >
              <Check size={16} strokeWidth={2.5} />
              <span className="text-sm font-medium">Tâche terminée</span>
            </button>
          ) : (
            <button
              onClick={() => unmarkFloatingDone(task.id)}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition hover:bg-white/5"
              style={{
                border: `1px solid ${SUCCESS_SOFT}55`,
                color: SUCCESS_SOFT,
                background: SUCCESS_SOFT + "0E",
              }}
            >
              <span className="text-sm">Marquer à refaire</span>
            </button>
          )}

          <button
            onClick={handleSchedule}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition hover:bg-white/5"
            style={{ border: `1px solid ${TEMPO.borderStrong}`, color: TEMPO.text }}
          >
            <CalendarPlus size={14} />
            <span className="text-sm">Planifier cette tâche</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition hover:bg-white/5"
              style={{ border: `1px solid ${TEMPO.border}`, color: TEMPO.textDim }}
            >
              <Pencil size={12} />
              <span className="text-xs">Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition hover:bg-red-500/10 hover:text-red-400"
              style={{ border: `1px solid ${TEMPO.border}`, color: TEMPO.textDim }}
            >
              <Trash2 size={12} />
              <span className="text-xs">Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
