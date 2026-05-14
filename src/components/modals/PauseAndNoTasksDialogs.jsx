import { Pause, Plus, Target } from "lucide-react";
import { useFocus } from "../../context/FocusContext";

export function PauseConfirm() {
  const {
    showPauseConfirm, setShowPauseConfirm,
    skipPauseConfirm, setSkipPauseConfirm,
    confirmPause, dayTheme,
  } = useFocus();
  if (!showPauseConfirm) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[75] flex items-end sm:items-center justify-center p-4"
      onClick={() => setShowPauseConfirm(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
        style={{ borderColor: dayTheme.accent + "40", boxShadow: `0 20px 60px ${dayTheme.accent}30` }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: dayTheme.accent + "15", border: `1px solid ${dayTheme.accent}40` }}
          >
            <Pause size={20} style={{ color: dayTheme.accent }} fill={dayTheme.accent} />
          </div>
          <h3 className="text-xl font-light mb-2">Mettre en pause ?</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Toutes les tâches restantes de la journée seront décalées du temps de votre pause.
          </p>
        </div>

        <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={skipPauseConfirm}
            onChange={(e) => setSkipPauseConfirm(e.target.checked)}
            className="w-4 h-4 rounded accent-white/60 cursor-pointer"
          />
          <span className="text-xs text-white/50">Ne plus me demander</span>
        </label>

        <div className="space-y-2">
          <button
            onClick={confirmPause}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
            style={{ background: dayTheme.accent, color: "#000" }}
          >
            Mettre en pause
          </button>
          <button
            onClick={() => setShowPauseConfirm(false)}
            className="w-full py-2.5 text-xs text-white/40 hover:text-white/70 transition"
          >
            Continuer la journée
          </button>
        </div>
      </div>
    </div>
  );
}

export function NoTasksWarning() {
  const { showNoTasksWarning, setShowNoTasksWarning, openAdd, dayTheme } = useFocus();
  if (!showNoTasksWarning) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[75] flex items-end sm:items-center justify-center p-4"
      onClick={() => setShowNoTasksWarning(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
        style={{ borderColor: dayTheme.accent + "40", boxShadow: `0 20px 60px ${dayTheme.accent}30` }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: dayTheme.accent + "15", border: `1px solid ${dayTheme.accent}40` }}
          >
            <Target size={22} style={{ color: dayTheme.accent }} />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">{dayTheme.name}</p>
          <h3 className="text-xl font-light mb-2">Aucune tâche programmée</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Programme au moins une tâche pour démarrer la journée.
          </p>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => { setShowNoTasksWarning(false); openAdd(); }}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02] font-medium text-sm"
            style={{ background: dayTheme.accent, color: "#000" }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Programmer une tâche
          </button>
          <button
            onClick={() => setShowNoTasksWarning(false)}
            className="w-full py-2.5 text-xs text-white/40 hover:text-white/70 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
