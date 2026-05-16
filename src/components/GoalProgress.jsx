import { useFocus } from "../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS } from "../utils/tempoTheme";

export default function GoalProgress() {
  const { dailyGoal, weeklyGoal, user } = useFocus();
  const firstName = user?.firstName || "";
  if (dailyGoal.percent === 0 && weeklyGoal.percent === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      {/* Progression journée — accent doré */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: TEMPO.textDim }}>
            {dailyGoal.percent === 100 && firstName
              ? `Journée accomplie, ${firstName} ✦`
              : "Progression journée"}
          </p>
          <p className="text-xs font-mono tabular-nums" style={{ color: TEMPO.gold }}>
            {dailyGoal.percent}
            <span style={{ color: TEMPO.textMuted }}>%</span>
            <span className="ml-1.5" style={{ color: TEMPO.textMuted }}>
              · {dailyGoal.done}/{dailyGoal.total}
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
              width: `${dailyGoal.percent}%`,
              background: TEMPO_GRADIENTS.gold,
              boxShadow: `0 0 12px ${TEMPO.gold}aa`,
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {dailyGoal.percent > 0 && dailyGoal.percent < 100 && (
            <div
              className="absolute inset-y-0 w-1/4 pointer-events-none"
              style={{
                left: 0,
                background: `linear-gradient(90deg, transparent 0%, ${TEMPO.goldGlow}99 50%, transparent 100%)`,
                animation: "goal-shimmer 2.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </div>

      {/* Progression semaine — texte clair neutre */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: TEMPO.textDim }}>
            Progression semaine
          </p>
          <p className="text-xs font-mono tabular-nums" style={{ color: TEMPO.text }}>
            {weeklyGoal.percent}
            <span style={{ color: TEMPO.textMuted }}>%</span>
            <span className="ml-1.5" style={{ color: TEMPO.textMuted }}>
              · {weeklyGoal.done}/{weeklyGoal.total}
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
              width: `${weeklyGoal.percent}%`,
              background: `linear-gradient(90deg, ${TEMPO.text} 0%, ${TEMPO.textDim} 100%)`,
              boxShadow: "0 0 8px rgba(245,247,250,0.3)",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {weeklyGoal.percent > 0 && weeklyGoal.percent < 100 && (
            <div
              className="absolute inset-y-0 w-1/4 pointer-events-none"
              style={{
                left: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
                animation: "goal-shimmer 3s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
