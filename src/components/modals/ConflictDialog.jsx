import { useFocus } from "../../context/FocusContext";

export default function ConflictDialog() {
  const { conflictDialog, setConflictDialog, applyEditWithCascade, dayTheme } = useFocus();
  if (!conflictDialog) return null;

  const closable = conflictDialog.type !== "overflow";

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[78] flex items-end sm:items-center justify-center p-4"
      onClick={() => closable && setConflictDialog(null)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border rounded-3xl p-6 w-full max-w-sm"
        style={{
          borderColor: "rgba(248,113,113,0.5)",
          boxShadow: "0 20px 60px rgba(248,113,113,0.25)",
        }}
      >
        <div className="flex flex-col items-center text-center mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-2xl"
            style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)" }}
          >
            ⚠️
          </div>
          <h3 className="text-xl font-light mb-2">
            {conflictDialog.type === "invalid" && "Horaires invalides"}
            {conflictDialog.type === "edit" && "Conflit d'horaire"}
            {conflictDialog.type === "fullyCovered" && "Tâche déjà programmée"}
            {conflictDialog.type === "overflow" && "Décalage impossible"}
            {conflictDialog.type === "repairFailed" && "Réparation impossible"}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            {conflictDialog.type === "invalid" && conflictDialog.message}
            {conflictDialog.type === "edit" && (
              <>
                Cette modification chevauche {conflictDialog.conflicts.length === 1 ? "la tâche" : "les tâches"}{" "}
                <span className="font-medium text-white">
                  {conflictDialog.conflicts.map((c) => c.name).join(", ")}
                </span>.
                {conflictDialog.overflow
                  ? " Décaler les tâches suivantes ferait dépasser minuit."
                  : ` Voulez-vous décaler ${conflictDialog.conflicts.length === 1 ? "cette tâche" : "ces tâches"} ainsi que toutes les suivantes de ${conflictDialog.shiftMin} min ?`}
              </>
            )}
            {conflictDialog.type === "fullyCovered" && (
              <>
                Le créneau choisi recouvre entièrement{" "}
                <span className="font-medium text-white">
                  {conflictDialog.conflicts.map((c) => c.name).join(", ")}
                </span>. Modifiez l'horaire ou supprimez la tâche existante d'abord.
              </>
            )}
            {conflictDialog.type === "overflow" && (
              <>
                L'ajout de cette tâche décalerait les suivantes au-delà de minuit
                (décalage de {conflictDialog.shiftMin} min nécessaire).
                Réduisez la durée ou choisissez un autre créneau.
              </>
            )}
            {conflictDialog.type === "repairFailed" && conflictDialog.message}
          </p>
        </div>

        {conflictDialog.type === "edit" && conflictDialog.conflicts && (
          <div
            className="rounded-xl border p-3 mb-4 space-y-1.5"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-1.5">Tâches impactées</p>
            {conflictDialog.conflicts.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                <span className="text-xs text-white/80 flex-1">{c.name}</span>
                <span className="text-[10px] text-white/40 font-mono tabular-nums">
                  {c.start} → {c.end}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {conflictDialog.type === "edit" && !conflictDialog.overflow && (
            <button
              onClick={applyEditWithCascade}
              className="w-full py-3.5 rounded-xl text-sm font-medium transition hover:scale-[1.02]"
              style={{ background: dayTheme.accent, color: "#000" }}
            >
              Décaler les tâches suivantes
            </button>
          )}

          <button
            onClick={() => setConflictDialog(null)}
            className="w-full py-3 rounded-xl text-sm font-medium transition hover:bg-white/5 border border-white/10 text-white/80"
          >
            {conflictDialog.type === "edit"
              || conflictDialog.type === "fullyCovered"
              || conflictDialog.type === "overflow"
              ? "Annuler"
              : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
