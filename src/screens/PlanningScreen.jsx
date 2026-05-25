import { CheckCircle2, ChevronLeft, Clock } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TASK_CATEGORIES } from "../constants/tasks";
import { toMin } from "../utils/time";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

// ============================================================
//  PlanningScreen — Vue semaine complète, lecture seule.
//
//  Sert de miroir / historique : l'utilisateur visualise toutes
//  les tâches programmées sur les 7 jours, mais NE PEUT PAS les
//  modifier ici. Les modifications restent centralisées dans le
//  dashboard principal (cohérence et garde-fou conformément aux
//  exigences produit).
// ============================================================
export default function PlanningScreen() {
  const {
    activeDayThemes, weekTasks, weekFloatingTasks, completions,
    setShowPlanning, setSelectedDay, setShowProfile, setShowStats,
  } = useFocus();

  // Compte tâches totales / accomplies sur la semaine pour le résumé en tête.
  let totalTasks = 0;
  let doneTasks = 0;
  Object.entries(weekTasks).forEach(([idx, list]) => {
    totalTasks += list.length;
    const comp = completions[idx] || {};
    doneTasks += list.filter((t) => comp[t.id] === "done").length;
  });
  const weekPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Quand on clique sur une carte tâche : on bascule sur le dashboard
  // du bon jour (où la modification reste possible).
  const jumpToDay = (dayIdx) => {
    setSelectedDay(dayIdx);
    setShowPlanning(false);
    setShowProfile(false);
    setShowStats(false);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      {/* Halo doré ambiant */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: TEMPO.gold }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 9rem)" }}>
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowPlanning(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
          >
            <ChevronLeft size={18} style={{ color: TEMPO.text }} />
          </button>
          <h2 className="text-lg font-light" style={{ color: TEMPO.text }}>Planning</h2>
          <div className="w-10" />
        </header>

        {/* Résumé semaine */}
        <div
          className="rounded-3xl p-5 mb-6"
          style={{
            background: TEMPO_GRADIENTS.cardAccent,
            border: `1px solid ${TEMPO.border}`,
            boxShadow: TEMPO_SHADOWS.card,
          }}
        >
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: TEMPO.textDim }}>
              Vue de la semaine
            </p>
            <p className="text-xs font-mono tabular-nums" style={{ color: TEMPO.gold }}>
              {weekPercent}<span style={{ color: TEMPO.textMuted }}>%</span>
              <span className="ml-1.5" style={{ color: TEMPO.textMuted }}>
                · {doneTasks}/{totalTasks}
              </span>
            </p>
          </div>

          <div
            className="relative h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${weekPercent}%`,
                background: TEMPO_GRADIENTS.gold,
                boxShadow: `0 0 12px ${TEMPO.gold}aa`,
                transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          <p className="text-[11px] mt-3" style={{ color: TEMPO.textDim }}>
            Cet écran est en lecture seule. Pour modifier une tâche, ouvrez le jour concerné depuis le dashboard.
          </p>
        </div>

        {/* Liste des jours */}
        <div className="space-y-4">
          {activeDayThemes.map((theme, dayIdx) => {
            const tasks = [...(weekTasks[dayIdx] || [])].sort(
              (a, b) => toMin(a.start) - toMin(b.start),
            );
            const floats = weekFloatingTasks[dayIdx] || [];
            const dayComp = completions[dayIdx] || {};
            const accent = theme.accent;

            return (
              <button
                key={dayIdx}
                onClick={() => jumpToDay(dayIdx)}
                className="w-full text-left rounded-2xl border p-4 transition hover:bg-white/[0.03]"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
                  borderColor: TEMPO.border,
                }}
              >
                {/* Header jour */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
                    />
                    <p className="text-sm font-medium" style={{ color: TEMPO.text }}>
                      {theme.name}
                    </p>
                    <p className="text-[10px] italic" style={{ color: TEMPO.textDim }}>
                      · {theme.mood}
                    </p>
                  </div>
                  <p className="text-[11px] font-mono tabular-nums" style={{ color: TEMPO.textDim }}>
                    {tasks.length} {tasks.length > 1 ? "tâches" : "tâche"}
                  </p>
                </div>

                {/* Liste compacte */}
                {tasks.length === 0 && floats.length === 0 ? (
                  <p className="text-[11px] italic" style={{ color: TEMPO.textMuted }}>
                    Aucune tâche programmée pour ce jour.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {tasks.map((task) => {
                      const cat = task.category
                        ? TASK_CATEGORIES.find((c) => c.id === task.category)
                        : null;
                      const status = dayComp[task.id];
                      const isDone = status === "done";
                      const isSkipped = status === "skipped";

                      return (
                        <div
                          key={task.id}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg"
                          style={{
                            background: task.color + "10",
                            border: `1px solid ${task.color}25`,
                            opacity: isSkipped ? 0.55 : 1,
                          }}
                        >
                          <span
                            className="w-1 h-6 rounded-full shrink-0"
                            style={{ background: task.color, boxShadow: `0 0 6px ${task.color}80` }}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[12px] font-medium truncate flex items-center gap-1.5"
                              style={{ color: TEMPO.text }}
                            >
                              {task.name}
                              {isDone && <CheckCircle2 size={10} style={{ color: TEMPO.success }} />}
                              {isSkipped && (
                                <span className="text-[10px]" style={{ color: TEMPO.textMuted }}>×</span>
                              )}
                            </p>
                            {cat && (
                              <p className="text-[10px] truncate" style={{ color: TEMPO.textDim }}>
                                {cat.name}{task.subcategory ? ` · ${task.subcategory}` : ""}
                              </p>
                            )}
                          </div>
                          <span
                            className="text-[10px] font-mono tabular-nums whitespace-nowrap"
                            style={{ color: TEMPO.textDim }}
                          >
                            {task.start}–{task.end}
                          </span>
                        </div>
                      );
                    })}

                    {floats.length > 0 && (
                      <div className="pt-1.5 mt-1.5 border-t" style={{ borderColor: TEMPO.border }}>
                        <p
                          className="text-[10px] uppercase tracking-[0.18em] mb-1.5 flex items-center gap-1.5"
                          style={{ color: TEMPO.textDim }}
                        >
                          <Clock size={10} /> À programmer ({floats.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {floats.map((f) => (
                            <span
                              key={f.id}
                              className="text-[10px] px-2 py-1 rounded-full"
                              style={{
                                background: f.color + "15",
                                border: `1px solid ${f.color}30`,
                                color: TEMPO.text,
                              }}
                            >
                              {f.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
