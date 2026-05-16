import { RotateCcw } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TEMPO, TEMPO_SHADOWS } from "../../utils/tempoTheme";

export default function ResetDayConfirm() {
  const { showResetConfirm, setShowResetConfirm, resetDay } = useFocus();
  if (!showResetConfirm) return null;

  return (
    <div
      className="fixed inset-0 z-[79] flex items-center justify-center p-6 backdrop-blur-md"
      style={{ background: "rgba(7,19,38,0.8)" }}
      onClick={() => setShowResetConfirm(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-xs text-center"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.borderStrong}`,
          boxShadow: TEMPO_SHADOWS.cardHi,
        }}
      >
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}
        >
          <RotateCcw size={22} style={{ color: TEMPO.danger }} />
        </div>
        <h3 className="text-lg font-light mb-2" style={{ color: TEMPO.text }}>
          Réinitialiser la journée ?
        </h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: TEMPO.textDim }}>
          Toutes les tâches du jour seront supprimées et la progression effacée.
          Cette action est irréversible.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResetConfirm(false)}
            className="flex-1 py-3 rounded-xl border text-sm transition hover:bg-white/5"
            style={{ borderColor: TEMPO.border, color: TEMPO.text }}
          >
            Annuler
          </button>
          <button
            onClick={resetDay}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition"
            style={{
              background: "rgba(248,113,113,0.20)",
              border: "1px solid rgba(248,113,113,0.4)",
              color: TEMPO.danger,
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
