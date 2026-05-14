import { BarChart3 } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { toMin } from "../../utils/time";

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
  let coachColor = dayTheme.accent;

  if (completionRate === 100 && delayMin === 0) {
    coachTitle = "Journée parfaite ! 🎯";
    coachMessage = "Vous avez tout accompli, sans aucun retard. Quelle régularité ! Continuez sur cette lancée, c'est exactement ce qui fait la différence.";
    coachColor = "#34D399";
  } else if (completionRate >= 80) {
    coachTitle = "Excellente journée 👏";
    coachMessage = `Vous avez accompli ${doneTasks} tâches sur ${totalTasks}. C'est une journée très solide. ${
      delayMin > 0 ? `Le petit retard de ${delayMin} min est tout à fait normal.` : "Bravo pour la précision !"
    }`;
    coachColor = "#34D399";
  } else if (completionRate >= 50) {
    coachTitle = "Bonne journée 👍";
    coachMessage = `${doneTasks} tâches accomplies sur ${totalTasks}, c'est une moitié pleine. Demain, essayez peut-être de réduire le nombre de tâches ou d'allonger leur durée pour finir en beauté.`;
    coachColor = "#FBBF24";
  } else if (completionRate > 0) {
    coachTitle = "Une journée d'apprentissage";
    coachMessage = `Vous avez validé ${doneTasks} tâche${doneTasks > 1 ? "s" : ""} sur ${totalTasks}. Pas de jugement : peut-être que votre planning était trop ambitieux. Réajustez pour demain, c'est ça qui compte.`;
    coachColor = "#FB923C";
  } else {
    coachTitle = "Demain est un nouveau jour";
    coachMessage = "Aucune tâche validée aujourd'hui. C'est OK, ça arrive. L'important c'est de revenir demain avec un plan plus simple. Petits pas, grandes victoires.";
    coachColor = "#F472B6";
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-end sm:items-center justify-center p-4">
      <div
        className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm max-h-[92vh] overflow-y-auto"
        style={{ borderColor: dayTheme.accent + "50", boxShadow: `0 20px 80px ${dayTheme.accent}40` }}
      >
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
            Bilan · {dayTheme.name}
          </p>
          <h3 className="text-2xl font-light mb-3">{coachTitle}</h3>

          <div className="relative w-36 h-36 mx-auto my-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
              <circle cx="72" cy="72" r="64" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
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
                {completionRate}<span className="text-xl text-white/40">%</span>
              </p>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">respecté</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed text-center px-2 mb-6 italic">
          {coachMessage}
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div
            className="rounded-xl p-3 border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Validées</p>
            <p className="text-lg font-light">
              <span style={{ color: dayTheme.accent }}>{doneTasks}</span>
              <span className="text-white/40"> / {totalTasks}</span>
            </p>
          </div>
          <div
            className="rounded-xl p-3 border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Travail</p>
            <p className="text-lg font-light font-mono tabular-nums">
              {Math.floor(workMin / 60)}h{String(workMin % 60).padStart(2, "0")}
            </p>
          </div>
          <div
            className="rounded-xl p-3 border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Pause</p>
            <p className="text-lg font-light font-mono tabular-nums">
              {pauseMin > 0 ? `${pauseMin} min` : "Aucune"}
            </p>
          </div>
          <div
            className="rounded-xl p-3 border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1">Retard</p>
            <p
              className="text-lg font-light font-mono tabular-nums"
              style={{ color: delayMin > 30 ? "#F87171" : delayMin > 10 ? "#FBBF24" : "#FFFFFF" }}
            >
              {delayMin > 0 ? `+${delayMin} min` : "0"}
            </p>
          </div>
        </div>

        {skippedTasks > 0 && (
          <p className="text-[11px] text-white/40 text-center mb-4 italic">
            {skippedTasks} tâche{skippedTasks > 1 ? "s" : ""} passée{skippedTasks > 1 ? "s" : ""}
          </p>
        )}

        <button
          onClick={() => { setShowDaySummary(false); setShowStats(true); }}
          className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{ background: dayTheme.accent, color: "#000" }}
        >
          <BarChart3 size={14} />
          Voir mes stats de la semaine
        </button>
        <button
          onClick={() => setShowDaySummary(false)}
          className="w-full mt-2 py-2.5 text-xs text-white/40 hover:text-white/70 transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
