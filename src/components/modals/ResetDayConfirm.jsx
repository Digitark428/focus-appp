import { RotateCcw } from "lucide-react";
import { useFocus } from "../../context/FocusContext";

export default function ResetDayConfirm() {
  const { showResetConfirm, setShowResetConfirm, resetDay } = useFocus();
  if (!showResetConfirm) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[79] flex items-center justify-center p-6"
      onClick={() => setShowResetConfirm(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-xs text-center"
      >
        <div
          className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}
        >
          <RotateCcw size={22} className="text-red-400" />
        </div>
        <h3 className="text-lg font-light mb-2">Réinitialiser la journée ?</h3>
        <p className="text-sm text-white/50 leading-relaxed mb-6">
          Toutes les tâches du jour seront supprimées et la progression effacée.
          Cette action est irréversible.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResetConfirm(false)}
            className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
          >
            Annuler
          </button>
          <button
            onClick={resetDay}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}
