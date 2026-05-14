import { useFocus } from "../context/FocusContext";

export default function GoalProgress() {
  const { dailyGoal, weeklyGoal, dayTheme } = useFocus();
  if (dailyGoal.percent === 0 && weeklyGoal.percent === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Progression journée</p>
          <p className="text-xs font-mono tabular-nums" style={{ color: dayTheme.accent }}>
            {dailyGoal.percent}<span className="text-white/30">%</span>
            <span className="text-white/30 ml-1.5">· {dailyGoal.done}/{dailyGoal.total}</span>
          </p>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${dailyGoal.percent}%`,
              background: dayTheme.accent,
              boxShadow: `0 0 10px ${dayTheme.accent}80`,
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {dailyGoal.percent > 0 && dailyGoal.percent < 100 && (
            <div
              className="absolute inset-y-0 w-1/4 pointer-events-none"
              style={{
                left: 0,
                background: `linear-gradient(90deg, transparent 0%, ${dayTheme.accent}80 50%, transparent 100%)`,
                animation: "goal-shimmer 2.5s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Progression semaine</p>
          <p className="text-xs font-mono tabular-nums text-white/85">
            {weeklyGoal.percent}<span className="text-white/30">%</span>
            <span className="text-white/30 ml-1.5">· {weeklyGoal.done}/{weeklyGoal.total}</span>
          </p>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden bg-white/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${weeklyGoal.percent}%`,
              background: "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
              boxShadow: "0 0 8px rgba(255,255,255,0.4)",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          {weeklyGoal.percent > 0 && weeklyGoal.percent < 100 && (
            <div
              className="absolute inset-y-0 w-1/4 pointer-events-none"
              style={{
                left: 0,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                animation: "goal-shimmer 3s ease-in-out infinite",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
