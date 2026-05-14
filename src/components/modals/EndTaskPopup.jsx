import { Check, CheckCircle2, ChevronDown, Clock, Plus } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { toMin } from "../../utils/time";

export default function EndTaskPopup() {
  const {
    endTaskPopup, setEndTaskPopup,
    showExtendChoice, setShowExtendChoice,
    extendMinutes, setExtendMinutes,
    currentTask, demoMode, demoElapsed, now,
    markTaskDone, markTaskSkipped, extendTask, finishEarly,
    popupOpenedAtRef, popupTriggerKindRef, DEMO_TASK_DURATION,
  } = useFocus();

  if (!endTaskPopup) return null;

  const isInProgress = currentTask?.id === endTaskPopup.id;

  // Minutes saved when finishing the current task early.
  let minutesSaved = 0;
  if (isInProgress) {
    const taskEnd = toMin(endTaskPopup.end);
    let nowMinutes;
    if (demoMode) {
      const elapsedInTask = demoElapsed % DEMO_TASK_DURATION;
      const fakeProgressRatio = elapsedInTask / DEMO_TASK_DURATION;
      const taskDur = toMin(endTaskPopup.end) - toMin(endTaskPopup.start);
      nowMinutes = toMin(endTaskPopup.start) + fakeProgressRatio * taskDur;
    } else {
      nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    }
    minutesSaved = Math.max(0, Math.round(taskEnd - nowMinutes));
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-end sm:items-center justify-center p-4">
      <div
        className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
        style={{
          borderColor: endTaskPopup.color + "60",
          boxShadow: `0 20px 60px ${endTaskPopup.color}30`,
        }}
      >
        {!showExtendChoice ? (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: endTaskPopup.color + "20",
                  boxShadow: `0 0 30px ${endTaskPopup.color}40`,
                }}
              >
                <CheckCircle2 size={28} style={{ color: endTaskPopup.color }} />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                {isInProgress ? "Tâche en cours" : "Tâche terminée"}
              </p>
              <h3 className="text-2xl font-light mb-2">{endTaskPopup.name}</h3>
              <p className="text-sm text-white/60">
                {isInProgress ? "Avez-vous déjà fini votre objectif ?" : "Avez-vous rempli votre objectif ?"}
              </p>
              {!isInProgress && (
                <p className="text-[11px] text-white/30 italic mt-3 px-2">
                  Prenez votre temps · vos prochaines tâches sont en pause
                </p>
              )}
            </div>

            <div className="space-y-2">
              {isInProgress && minutesSaved > 0 && (
                <button
                  onClick={() => finishEarly(endTaskPopup)}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                  style={{ background: endTaskPopup.color, color: "#000" }}
                >
                  <Check size={16} strokeWidth={2.5} />
                  <span className="text-sm font-medium">
                    J'ai déjà fini · gagner {minutesSaved} min
                  </span>
                </button>
              )}

              {(!isInProgress || minutesSaved === 0) && (
                <button
                  onClick={() => markTaskDone(endTaskPopup.id)}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                  style={{ background: endTaskPopup.color, color: "#000" }}
                >
                  <Check size={16} strokeWidth={2.5} />
                  <span className="text-sm font-medium">Oui, c'est fait</span>
                </button>
              )}

              <button
                onClick={() => setShowExtendChoice(true)}
                className="w-full py-3.5 rounded-xl border border-white/15 text-sm text-white/80 hover:bg-white/5 transition flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                {isInProgress ? "Pas encore, ajouter du temps" : "Non, ajouter du temps"}
              </button>

              <button
                onClick={() => {
                  if (isInProgress) {
                    popupOpenedAtRef.current = null;
                    popupTriggerKindRef.current = null;
                    setEndTaskPopup(null);
                  } else {
                    markTaskSkipped(endTaskPopup.id);
                  }
                }}
                className="w-full py-2.5 text-xs text-white/40 hover:text-white/70 transition"
              >
                {isInProgress ? "Continuer normalement" : "Passer à la prochaine tâche"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} style={{ color: endTaskPopup.color }} />
              <h3 className="text-lg font-light">Combien de temps ajouter ?</h3>
            </div>
            <p className="text-xs text-white/40 mb-5">
              Les tâches suivantes seront décalées automatiquement
            </p>

            <div className="mb-5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">
                Durée supplémentaire
              </label>
              <div className="relative">
                <select
                  value={extendMinutes}
                  onChange={(e) => setExtendMinutes(parseInt(e.target.value, 10))}
                  className="w-full appearance-none bg-white/5 border rounded-xl pl-4 pr-10 py-3.5 text-base font-medium focus:outline-none cursor-pointer transition"
                  style={{ borderColor: endTaskPopup.color + "50", color: endTaskPopup.color }}
                >
                  {[1, 2, 3, 5, 7, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 75, 90, 105, 120, 150, 180].map((min) => (
                    <option key={min} value={min} className="bg-neutral-900 text-white">
                      +{min} minute{min > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: endTaskPopup.color }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowExtendChoice(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
              >
                Retour
              </button>
              <button
                onClick={() => extendTask(endTaskPopup, extendMinutes)}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
                style={{ background: endTaskPopup.color, color: "#000" }}
              >
                Confirmer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
