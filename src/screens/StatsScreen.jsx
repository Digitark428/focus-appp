import { Award, ChevronLeft, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS } from "../utils/tempoTheme";

// Palette dédiée aux activités principales : nuances dorées + neutres.
const ACT_COLORS = ["#D9B36A", "#F2D28F", "#E2B872", "#C9A361", "#B8C0CC"];

export default function StatsScreen() {
  const { setShowStats, computeStats, user } = useFocus();
  const firstName = user?.firstName || "";
  const {
    stats, topCategories, totalWeekTasks, totalWeekMinutes, avgCompletion, bestDay,
  } = computeStats();
  const maxBar = Math.max(...stats.map((s) => s.totalMinutes), 1);

  const cardStyle = {
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${TEMPO.border}`,
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: TEMPO.gold }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-28">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowStats(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
          >
            <ChevronLeft size={18} style={{ color: TEMPO.text }} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-light" style={{ color: TEMPO.text }}>Statistiques</h2>
            {firstName && avgCompletion >= 50 && (
              <p className="text-[10px] mt-0.5" style={{ color: TEMPO.gold + "cc" }}>
                Belle progression, {firstName}
              </p>
            )}
          </div>
          <div className="w-10" />
        </header>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-2"
              style={{ color: TEMPO.textDim }}
            >
              <TrendingUp size={12} /> Taux d'accomplissement
            </div>
            <p className="text-3xl font-extralight" style={{ color: TEMPO.gold }}>
              {Math.round(avgCompletion) || 0}
              <span className="text-lg" style={{ color: TEMPO.textDim }}>%</span>
            </p>
          </div>
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-2"
              style={{ color: TEMPO.textDim }}
            >
              <CheckCircle2 size={12} /> Tâches semaine
            </div>
            <p className="text-3xl font-extralight" style={{ color: TEMPO.text }}>
              {totalWeekTasks}
            </p>
          </div>
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-2"
              style={{ color: TEMPO.textDim }}
            >
              <Clock size={12} /> Temps planifié
            </div>
            <p className="text-3xl font-extralight" style={{ color: TEMPO.text }}>
              {Math.floor(totalWeekMinutes / 60)}
              <span className="text-lg" style={{ color: TEMPO.textDim }}>h</span>
            </p>
          </div>
          <div className="rounded-2xl p-4" style={cardStyle}>
            <div
              className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-2"
              style={{ color: TEMPO.textDim }}
            >
              <Award size={12} /> Meilleur jour
            </div>
            <p className="text-2xl font-light" style={{ color: bestDay?.accent || TEMPO.gold }}>
              {bestDay?.short}
            </p>
          </div>
        </div>

        {/* Volume par jour */}
        <div className="rounded-2xl p-5 mb-6" style={cardStyle}>
          <h3
            className="text-[10px] uppercase tracking-[0.22em] mb-5"
            style={{ color: TEMPO.textDim }}
          >
            Volume par jour
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {stats.map((s) => {
              const height = s.totalMinutes > 0 ? (s.totalMinutes / maxBar) * 100 : 4;
              return (
                <div key={s.idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="text-[10px] font-mono"
                    style={{ color: TEMPO.textDim }}
                  >
                    {s.totalMinutes > 0 ? `${Math.floor(s.totalMinutes / 60)}h` : ""}
                  </div>
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, ${s.accent}cc 0%, ${s.accent}40 100%)`,
                      boxShadow: s.totalMinutes > 0 ? `0 0 8px ${s.accent}40` : "none",
                      minHeight: "4px",
                    }}
                  />
                  <p
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: TEMPO.textDim }}
                  >
                    {s.short}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accomplissement par jour */}
        <div className="rounded-2xl p-5 mb-6" style={cardStyle}>
          <h3
            className="text-[10px] uppercase tracking-[0.22em] mb-5"
            style={{ color: TEMPO.textDim }}
          >
            Accomplissement par jour
          </h3>
          <div className="space-y-3">
            {stats.map((s) => (
              <div key={s.idx} className="flex items-center gap-3">
                <span className="text-xs w-10" style={{ color: TEMPO.textDim }}>{s.short}</span>
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${s.completion}%`,
                      background: s.accent,
                      boxShadow: s.completion > 0 ? `0 0 6px ${s.accent}80` : "none",
                    }}
                  />
                </div>
                <span
                  className="text-xs font-mono tabular-nums w-10 text-right"
                  style={{ color: s.accent }}
                >
                  {s.completion}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activités principales */}
        <div className="rounded-2xl p-5 mb-6" style={cardStyle}>
          <h3
            className="text-[10px] uppercase tracking-[0.22em] mb-5"
            style={{ color: TEMPO.textDim }}
          >
            Activités principales
          </h3>
          <div className="space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-sm italic" style={{ color: TEMPO.textDim }}>
                Pas encore de données
              </p>
            ) : (
              topCategories.map(([name, mins], idx) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: ACT_COLORS[idx % ACT_COLORS.length],
                        boxShadow: `0 0 4px ${ACT_COLORS[idx % ACT_COLORS.length]}`,
                      }}
                    />
                    <span className="text-sm" style={{ color: TEMPO.text }}>{name}</span>
                  </div>
                  <span
                    className="text-xs font-mono"
                    style={{ color: TEMPO.textDim }}
                  >
                    {Math.floor(mins / 60)}h {mins % 60}min
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <p
          className="text-[11px] text-center mb-6 italic"
          style={{ color: TEMPO.textMuted }}
        >
          Calculs locaux, sans serveur.
        </p>
      </div>
    </div>
  );
}
