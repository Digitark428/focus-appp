import { Pause, Plus, Target } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../../utils/tempoTheme";

export function PauseConfirm() {
  const {
    showPauseConfirm, setShowPauseConfirm,
    skipPauseConfirm, setSkipPauseConfirm,
    confirmPause,
  } = useFocus();
  if (!showPauseConfirm) return null;

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(7,19,38,0.8)" }}
      onClick={() => setShowPauseConfirm(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.gold}40`,
          boxShadow: `0 20px 60px ${TEMPO.gold}25, ${TEMPO_SHADOWS.cardHi}`,
        }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: TEMPO.gold + "15", border: `1px solid ${TEMPO.gold}40` }}
          >
            <Pause size={20} style={{ color: TEMPO.gold }} fill={TEMPO.gold} />
          </div>
          <h3 className="text-xl font-light mb-2" style={{ color: TEMPO.text }}>
            Mettre en pause ?
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: TEMPO.textDim }}>
            Toutes les tâches restantes de la journée seront décalées du temps de votre pause.
          </p>
        </div>

        <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={skipPauseConfirm}
            onChange={(e) => setSkipPauseConfirm(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{ accentColor: TEMPO.gold }}
          />
          <span className="text-xs" style={{ color: TEMPO.textDim }}>Ne plus me demander</span>
        </label>

        <div className="space-y-2">
          <button
            onClick={confirmPause}
            className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
            style={{
              background: TEMPO_GRADIENTS.gold,
              color: "#1A1206",
              boxShadow: TEMPO_SHADOWS.gold,
            }}
          >
            Mettre en pause
          </button>
          <button
            onClick={() => setShowPauseConfirm(false)}
            className="w-full py-2.5 text-xs transition"
            style={{ color: TEMPO.textDim }}
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
      className="fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(7,19,38,0.8)" }}
      onClick={() => setShowNoTasksWarning(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.gold}40`,
          boxShadow: `0 20px 60px ${TEMPO.gold}25, ${TEMPO_SHADOWS.cardHi}`,
        }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: TEMPO.gold + "15", border: `1px solid ${TEMPO.gold}40` }}
          >
            <Target size={22} style={{ color: TEMPO.gold }} />
          </div>
          <p
            className="text-[10px] uppercase tracking-[0.22em] mb-2"
            style={{ color: TEMPO.textDim }}
          >
            {dayTheme.name}
          </p>
          <h3 className="text-xl font-light mb-2" style={{ color: TEMPO.text }}>
            Aucune tâche programmée
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: TEMPO.textDim }}>
            Programme au moins une tâche pour démarrer la journée.
          </p>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => { setShowNoTasksWarning(false); openAdd(); }}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-[1.02] font-medium text-sm"
            style={{
              background: TEMPO_GRADIENTS.gold,
              color: "#1A1206",
              boxShadow: TEMPO_SHADOWS.gold,
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Programmer une tâche
          </button>
          <button
            onClick={() => setShowNoTasksWarning(false)}
            className="w-full py-2.5 text-xs transition"
            style={{ color: TEMPO.textDim }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
