import { Award, ChevronLeft, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useFocus } from "../context/FocusContext";

export default function StatsScreen() {
  const { setShowStats, computeStats, dayTheme, user } = useFocus();
  const firstName = user?.firstName || "";
  const { stats, topCategories, totalWeekTasks, totalWeekMinutes, avgCompletion, bestDay } = computeStats();
  const maxBar = Math.max(...stats.map((s) => s.totalMinutes), 1);

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: dayTheme.glow }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-28">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowStats(false)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-light">Statistiques</h2>
            {firstName && avgCompletion >= 50 && (
              <p className="text-[10px] mt-0.5" style={{ color: dayTheme.accent + "99" }}>
                Belle progression, {firstName}
              </p>
            )}
          </div>
          <div className="w-10" />
        </header>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
              <TrendingUp size={12} /> Taux d'accomplissement
            </div>
            <p className="text-3xl font-extralight" style={{ color: dayTheme.accent }}>
              {Math.round(avgCompletion) || 0}<span className="text-lg text-white/40">%</span>
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
              <CheckCircle2 size={12} /> Tâches semaine
            </div>
            <p className="text-3xl font-extralight">{totalWeekTasks}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
              <Clock size={12} /> Temps planifié
            </div>
            <p className="text-3xl font-extralight">
              {Math.floor(totalWeekMinutes / 60)}<span className="text-lg text-white/40">h</span>
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider mb-2">
              <Award size={12} /> Meilleur jour
            </div>
            <p className="text-2xl font-light" style={{ color: bestDay?.accent }}>{bestDay?.short}</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Volume par jour</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {stats.map((s) => {
              const height = s.totalMinutes > 0 ? (s.totalMinutes / maxBar) * 100 : 4;
              return (
                <div key={s.idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[10px] text-white/40 font-mono">
                    {s.totalMinutes > 0 ? `${Math.floor(s.totalMinutes / 60)}h` : ""}
                  </div>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, ${s.accent}cc 0%, ${s.accent}40 100%)`,
                      minHeight: "4px",
                    }}
                  />
                  <p className="text-[10px] uppercase tracking-wider text-white/50">{s.short}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Accomplissement par jour</h3>
          <div className="space-y-3">
            {stats.map((s) => (
              <div key={s.idx} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-10">{s.short}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.completion}%`, background: s.accent }}
                  />
                </div>
                <span className="text-xs font-mono tabular-nums w-10 text-right" style={{ color: s.accent }}>
                  {s.completion}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-5">Activités principales</h3>
          <div className="space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-sm text-white/40 italic">Pas encore de données</p>
            ) : (
              topCategories.map(([name, mins], idx) => {
                const colors = ["#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#F472B6"];
                return (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: colors[idx] }} />
                      <span className="text-sm">{name}</span>
                    </div>
                    <span className="text-xs text-white/50 font-mono">
                      {Math.floor(mins / 60)}h {mins % 60}min
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="text-[11px] text-white/30 text-center mb-6 italic">
          Calculs locaux, sans serveur.
        </p>
      </div>
    </div>
  );
}
