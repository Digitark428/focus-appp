import { ChevronRight, Clock, Pencil, Sparkles, X } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../../utils/tempoTheme";

// ============================================================
//  AddTaskTypeChooser
//
//  Écran 0 du wizard d'ajout. Affiché uniquement quand
//  addFlowMode === "chooser".
//
//  Présente 3 options strictement séparées :
//    1) Tâche personnalisée  (libre)
//    2) Tâches prédéfinies   (catégories Tempo)
//    3) Tâche sans horaire   (flottante)
//
//  Chaque option déclenche son propre flow ; aucun state n'est
//  partagé entre les flows. C'est l'unique source d'entrée pour
//  garantir l'isolation.
// ============================================================
export default function AddTaskTypeChooser() {
  const {
    addFlowMode, closeAddFlow,
    startCustomFlow, startPredefinedFlow, startFloatingFlow,
    dayTheme,
  } = useFocus();

  if (addFlowMode !== "chooser") return null;

  const Option = ({ icon: Icon, accent, title, desc, onClick }) => (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-2xl border transition hover:scale-[1.01] active:scale-[0.99] flex items-center gap-3 text-left"
      style={{ background: accent + "0E", borderColor: accent + "40" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent + "20", border: `1px solid ${accent}40` }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: TEMPO.text }}>{title}</p>
        <p className="text-[11px] mt-0.5 leading-snug" style={{ color: TEMPO.textDim }}>{desc}</p>
      </div>
      <ChevronRight size={14} style={{ color: TEMPO.textMuted }} className="shrink-0" />
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center backdrop-blur-sm overflow-y-auto"
      style={{
        background: "rgba(7,19,38,0.7)",
        paddingTop: "max(16px, env(safe-area-inset-top))",
        paddingBottom: "max(120px, calc(env(safe-area-inset-bottom) + 120px))",
        paddingLeft: 16,
        paddingRight: 16,
      }}
      onClick={closeAddFlow}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm my-auto relative"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.borderStrong}`,
          boxShadow: TEMPO_SHADOWS.cardHi,
          maxHeight: "calc(100dvh - 160px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          onClick={closeAddFlow}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-white/5"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${TEMPO.border}` }}
          aria-label="Fermer"
        >
          <X size={14} style={{ color: TEMPO.textDim }} />
        </button>

        <h3 className="text-lg font-light mb-1 pr-8" style={{ color: TEMPO.text }}>
          Nouvelle tâche
        </h3>
        <p className="text-xs mb-5" style={{ color: TEMPO.textDim }}>
          {dayTheme.name} · choisissez le type
        </p>

        <div className="space-y-2.5">
          <Option
            icon={Pencil}
            accent={TEMPO.text}
            title="Tâche personnalisée"
            desc="Saisissez un nom libre et des horaires précis"
            onClick={startCustomFlow}
          />
          <Option
            icon={Sparkles}
            accent={TEMPO.gold}
            title="Tâches prédéfinies"
            desc="Sport, travail, méditation, repas, étude…"
            onClick={startPredefinedFlow}
          />
          <Option
            icon={Clock}
            accent="#E2B872"
            title="Sans horaire"
            desc="À placer plus tard dans la journée"
            onClick={startFloatingFlow}
          />
        </div>

        <button
          onClick={closeAddFlow}
          className="w-full mt-5 py-3 rounded-xl text-sm transition hover:bg-white/5"
          style={{ border: `1px solid ${TEMPO.border}`, color: TEMPO.textDim }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
