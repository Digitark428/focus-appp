import { CheckCircle2, Clock, X } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TASK_CATEGORIES } from "../../constants/tasks";
import { toMin, weekdayIndex } from "../../utils/time";
import { TEMPO, TEMPO_SHADOWS } from "../../utils/tempoTheme";

const FLOAT = "#E2B872";
const SUCCESS_SOFT = "#86EFAC";

// ============================================================
//  PlanningTaskDetailModal
//
//  Détail d'une tâche affiché DANS l'écran planning (lecture
//  seule). Ne navigue pas vers le dashboard : reste dans le
//  planning, conformément à l'UX demandée.
//
//  Source : planningDetail = { task, dayIdx, isFloating, status }
// ============================================================
export default function PlanningTaskDetailModal() {
  const {
    planningDetail, closePlanningDetail,
    activeDayThemes, selectDate,
    setShowPlanning, setShowProfile, setShowStats,
  } = useFocus();

  if (!planningDetail) return null;

  const { task, dateKey, isFloating, status } = planningDetail;
  const isDone = status === "done";
  const isSkipped = status === "skipped";
  const cat = task.category ? TASK_CATEGORIES.find((c) => c.id === task.category) : null;
  const CatIcon = cat?.icon;
  const theme = activeDayThemes[weekdayIndex(dateKey)];

  // Couleur accent : verte si terminée, sinon couleur de tâche.
  const baseColor = isFloating ? (task.color || FLOAT) : task.color;
  const accent = isDone ? SUCCESS_SOFT : baseColor;

  let durationLabel = null;
  if (!isFloating && task.start && task.end) {
    const dur = toMin(task.end) - toMin(task.start);
    const h = Math.floor(dur / 60);
    const m = dur % 60;
    durationLabel = h > 0 ? `${h}h${m ? ` ${m}min` : ""}` : `${m} min`;
  }

  const jumpToDay = () => {
    selectDate(dateKey);
    setShowPlanning(false);
    setShowProfile(false);
    setShowStats(false);
    closePlanningDetail();
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
      onClick={closePlanningDetail}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm my-auto relative"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${accent}55`,
          boxShadow: `0 20px 60px ${accent}25, ${TEMPO_SHADOWS.cardHi}`,
          maxHeight: "calc(100dvh - 160px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          onClick={closePlanningDetail}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${TEMPO.border}` }}
          aria-label="Fermer"
        >
          <X size={14} style={{ color: TEMPO.textDim }} />
        </button>

        {/* Badge statut */}
        <div className="flex items-center gap-2 mb-4 pr-8 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full flex items-center gap-1.5"
            style={{
              background: accent + "1F",
              border: `1px solid ${accent}55`,
              color: accent,
            }}
          >
            {isDone
              ? <><CheckCircle2 size={11} /> Terminée</>
              : isSkipped
                ? <>Non terminée</>
                : isFloating
                  ? <>Sans horaire</>
                  : <>Programmée</>}
          </span>
          {theme && (
            <span
              className="text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${TEMPO.border}`,
                color: TEMPO.textDim,
              }}
            >
              {theme.name}
            </span>
          )}
        </div>

        {/* Icône + titre complet (jamais tronqué) */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center"
            style={{
              background: accent + "1F",
              border: `1px solid ${accent}55`,
            }}
          >
            {CatIcon
              ? <CatIcon size={20} style={{ color: accent }} />
              : <span className="text-xl">{isFloating ? "🔖" : "✦"}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-light leading-tight break-words"
              style={{
                color: TEMPO.text,
                textDecoration: isDone ? "line-through" : "none",
                textDecorationColor: isDone ? SUCCESS_SOFT + "AA" : undefined,
                textDecorationThickness: "1px",
                opacity: isDone ? 0.9 : 1,
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

        {/* Horaires (programmée uniquement) */}
        {!isFloating && task.start && task.end && (
          <div
            className="rounded-2xl p-3.5 mb-3 flex items-center gap-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${TEMPO.border}`,
            }}
          >
            <Clock size={16} style={{ color: accent }} />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: TEMPO.textDim }}>
                Horaires
              </p>
              <p className="text-sm font-mono tabular-nums mt-0.5" style={{ color: TEMPO.text }}>
                {task.start} – {task.end}
                {durationLabel && (
                  <span className="ml-2 text-xs" style={{ color: TEMPO.textDim }}>
                    · {durationLabel}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

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

        {!task.notes && <div className="mb-5" />}

        {/* Actions — lecture seule : pas d'édition ici, on propose juste
            de basculer vers le jour pour modifier si besoin. */}
        <div className="space-y-2">
          <button
            onClick={jumpToDay}
            className="w-full py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
            style={{
              background: TEMPO.gold,
              color: "#1A1206",
              boxShadow: `0 6px 18px ${TEMPO.gold}40`,
            }}
          >
            Ouvrir ce jour
          </button>
          <button
            onClick={closePlanningDetail}
            className="w-full py-2.5 rounded-xl text-sm transition hover:bg-white/5"
            style={{ border: `1px solid ${TEMPO.border}`, color: TEMPO.textDim }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
