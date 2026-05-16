import { BarChart3 } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { toMin } from "../../utils/time";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../../utils/tempoTheme";

export default function DaySummaryModal() {
  const {
    showDaySummary, setShowDaySummary, setShowStats,
    tasks, dayCompletions, dayMetrics, selectedDay, dayTheme,
  } = useFocus();

  if (!showDaySummary) return null;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => dayCompletions[t.id] === "done").length;
  const skippedTasks = tasks.filter((t) => dayCompletions[t.id] === "skipped").length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const metrics = dayMetrics[selectedDay] || {};
  const pauseMin = metrics.pauseMin || 0;
  const original = metrics.originalTasks || [];

  const workMin = tasks
    .filter((t) => dayCompletions[t.id] === "done")
    .reduce((sum, t) => {
      const orig = original.find((o) => o.id === t.id);
      if (orig) return sum + (toMin(orig.end) - toMin(orig.start));
      return sum + (toMin(t.end) - toMin(t.start));
    }, 0);

  let delayMin = 0;
  if (original.length > 0) {
    original.forEach((o) => {
      const current = tasks.find((t) => t.id === o.id);
      if (current) {
        const diff = toMin(current.end) - toMin(o.end);
        if (diff > delayMin) delayMin = diff;
      }
    });
  }

  // Coaching message based on completion rate.
  let coachTitle = "";
  let coachMessage = "";
  let coachColor = TEMPO.gold;

  if (completionRate === 100 && delayMin === 0) {
    coachTitle = "Journée parfaite ! 🎯";
    coachMessage = "Vous avez tout accompli, sans aucun retard. Quelle régularité ! Continuez sur cette lancée, c'est exactement ce qui fait la différence.";
    coachColor = TEMPO.success;
  } else if (completionRate >= 80) {
    coachTitle = "Excellente journée 👏";
    coachMessage = `Vous avez accompli ${doneTasks} tâches sur ${totalTasks}. C'est une journée très solide. ${
      delayMin > 0 ? `Le petit retard de ${delayMin} min est tout à fait normal.` : "Bravo pour la précision !"
    }`;
    coachColor = TEMPO.success;
  } else if (completionRate >= 50) {
    coachTitle = "Bonne journée 👍";
    coachMessage = `${doneTasks} tâches accomplies sur ${totalTasks}, c'est une moitié pleine. Demain, essayez peut-être de réduire le nombre de tâches ou d'allonger leur durée pour finir en beauté.`;
    coachColor = TEMPO.gold;
  } else if (completionRate > 0) {
    coachTitle = "Une journée d'apprentissage";
    coachMessage = `Vous avez validé ${doneTasks} tâche${doneTasks > 1 ? "s" : ""} sur ${totalTasks}. Pas de jugement : peut-être que votre planning était trop ambitieux. Réajustez pour demain, c'est ça qui compte.`;
    coachColor = "#E2B872";
  } else {
    coachTitle = "Demain est un nouveau jour";
    coachMessage = "Aucune tâche validée aujourd'hui. C'est OK, ça arrive. L'important c'est de revenir demain avec un plan plus simple. Petits pas, grandes victoires.";
    coachColor = TEMPO.textDim;
  }

  const statCard = {
    background: "rgba(255,255,255,0.025)",
    border: `1px solid ${TEMPO.border}`,
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(7,19,38,0.85)" }}
    >
      <div
        className="rounded-3xl p-6 w-full max-w-sm max-h-[92vh] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.gold}50`,
          boxShadow: `0 20px 80px ${TEMPO.gold}30, ${TEMPO_SHADOWS.cardHi}`,
        }}
      >
        <div className="text-center mb-6">
          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-2"
            style={{ color: TEMPO.textDim }}
          >
            Bilan · {dayTheme.name}
          </p>
          <h3 className="text-2xl font-light mb-3" style={{ color: TEMPO.text }}>
            {coachTitle}
          </h3>

          <div className="relative w-36 h-36 mx-auto my-6">
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${coachColor}25 0%, transparent 65%)`,
                filter: "blur(16px)",
              }}
            />
            <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
              <circle
                cx="72" cy="72" r="64" stroke={coachColor} strokeWidth="6" fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 - (completionRate / 100) * 2 * Math.PI * 64}
                style={{
                  filter: `drop-shadow(0 0 12px ${coachColor})`,
                  transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-extralight font-mono tabular-nums" style={{ color: coachColor }}>
                {completionRate}
                <span className="text-xl" style={{ color: TEMPO.textDim }}>%</span>
              </p>
              <p
                className="text-[10px] uppercase tracking-widest mt-1"
                style={{ color: TEMPO.textDim }}
              >
                respecté
              </p>
            </div>
          </div>
        </div>

        <p
          className="text-sm leading-relaxed text-center px-2 mb-6 italic"
          style={{ color: TEMPO.text + "c0" }}
        >
          {coachMessage}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="rounded-xl p-3" style={statCard}>
            <p
              className="text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Validées
            </p>
            <p className="text-lg font-light">
              <span style={{ color: TEMPO.gold }}>{doneTasks}</span>
              <span style={{ color: TEMPO.textDim }}> / {totalTasks}</span>
            </p>
          </div>
          <div className="rounded-xl p-3" style={statCard}>
            <p
              className="text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Travail
            </p>
            <p className="text-lg font-light font-mono tabular-nums" style={{ color: TEMPO.text }}>
              {Math.floor(workMin / 60)}h{String(workMin % 60).padStart(2, "0")}
            </p>
          </div>
          <div className="rounded-xl p-3" style={statCard}>
            <p
              className="text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Pause
            </p>
            <p className="text-lg font-light font-mono tabular-nums" style={{ color: TEMPO.text }}>
              {pauseMin > 0 ? `${pauseMin} min` : "Aucune"}
            </p>
          </div>
          <div className="rounded-xl p-3" style={statCard}>
            <p
              className="text-[10px] uppercase tracking-[0.15em] mb-1"
              style={{ color: TEMPO.textDim }}
            >
              Retard
            </p>
            <p
              className="text-lg font-light font-mono tabular-nums"
              style={{ color: delayMin > 30 ? TEMPO.danger : delayMin > 10 ? TEMPO.warning : TEMPO.text }}
            >
              {delayMin > 0 ? `+${delayMin} min` : "0"}
            </p>
          </div>
        </div>

        {skippedTasks > 0 && (
          <p
            className="text-[11px] text-center mb-4 italic"
            style={{ color: TEMPO.textDim }}
          >
            {skippedTasks} tâche{skippedTasks > 1 ? "s" : ""} passée{skippedTasks > 1 ? "s" : ""}
          </p>
        )}

        <button
          onClick={() => { setShowDaySummary(false); setShowStats(true); }}
          className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{
            background: TEMPO_GRADIENTS.gold,
            color: "#1A1206",
            boxShadow: TEMPO_SHADOWS.gold,
          }}
        >
          <BarChart3 size={14} />
          Voir mes stats de la semaine
        </button>
        <button
          onClick={() => setShowDaySummary(false)}
          className="w-full mt-2 py-2.5 text-xs transition"
          style={{ color: TEMPO.textDim }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
