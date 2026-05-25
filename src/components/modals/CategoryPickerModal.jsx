import { ChevronLeft, ChevronRight, Moon, Pencil, Plus, Sparkles, Trash2, X, Zap } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { CUSTOM_TASK_ICONS, TASK_CATEGORIES } from "../../constants/tasks";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../../utils/tempoTheme";

// ============================================================
//  CategoryPickerModal
//
//  Étape de sélection catégorie → sous-catégorie. Utilisé
//  uniquement dans le flow "predefined".
//
//  - Sélection d'une sous-catégorie ⇒ ferme le picker et ouvre
//    le AddEditTaskModal pré-rempli (via applyPredefinedSelection).
//  - Fermeture (croix / backdrop) ⇒ closeAddFlow() complet pour
//    éviter qu'un picker orphelin reste accessible.
//  - Les templates "Mes tâches" déclenchent insertTemplate qui
//    bascule en flow custom avec pré-remplissage.
// ============================================================
export default function CategoryPickerModal() {
  const {
    showCategoryPicker, addFlowMode,
    pickerStep, setPickerStep,
    pickedCategory, setPickedCategory,
    customTaskTemplates, openNewTemplate, openEditTemplate, deleteTemplate, insertTemplate,
    applyPredefinedSelection, closeAddFlow,
  } = useFocus();

  // Affichage strictement contrôlé : visible uniquement en flow predefined
  // et quand showCategoryPicker est explicitement true.
  if (!showCategoryPicker || addFlowMode !== "predefined") return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center backdrop-blur-sm overflow-y-auto"
      style={{
        background: "rgba(7,19,38,0.85)",
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

        {pickerStep === "category" ? (
          <>
            {/* === MES TÂCHES (templates) === */}
            <div className="mb-5 pr-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: TEMPO_GRADIENTS.gold }}
                  >
                    <Plus size={9} style={{ color: "#1A1206" }} strokeWidth={3} />
                  </div>
                  <h3 className="text-sm font-medium" style={{ color: TEMPO.text }}>Mes tâches</h3>
                </div>
                <button
                  onClick={openNewTemplate}
                  className="text-[11px] transition flex items-center gap-1"
                  style={{ color: TEMPO.textDim }}
                >
                  <Plus size={11} /> Créer
                </button>
              </div>

              {customTaskTemplates.length === 0 ? (
                <button
                  onClick={openNewTemplate}
                  className="w-full py-4 rounded-2xl border border-dashed text-xs transition flex items-center justify-center gap-2 hover:bg-white/5"
                  style={{ borderColor: TEMPO.border, color: TEMPO.textDim }}
                >
                  <Plus size={13} />
                  Créer une tâche personnalisée réutilisable
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {customTaskTemplates.map((tpl) => {
                    const iconDef = CUSTOM_TASK_ICONS.find((i) => i.key === tpl.iconKey);
                    const TplIcon = iconDef?.icon || Zap;
                    return (
                      <div key={tpl.id} className="relative group">
                        <button
                          onClick={() => insertTemplate(tpl)}
                          className="w-full p-3.5 rounded-2xl border transition hover:scale-[1.02] text-left"
                          style={{ background: tpl.color + "12", borderColor: tpl.color + "40" }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                            style={{ background: tpl.color + "25" }}
                          >
                            <TplIcon size={15} style={{ color: tpl.color }} />
                          </div>
                          <p className="text-sm font-medium truncate" style={{ color: tpl.color }}>
                            {tpl.name}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: TEMPO.textDim }}>
                            {tpl.durationMin} min
                          </p>
                        </button>
                        <div className="absolute top-1.5 right-1.5 gap-0.5 hidden group-hover:flex">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditTemplate(tpl); }}
                            className="w-6 h-6 rounded-lg backdrop-blur flex items-center justify-center transition hover:scale-110"
                            style={{ background: "rgba(7,19,38,0.7)", color: TEMPO.textDim }}
                          >
                            <Pencil size={10} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteTemplate(tpl.id); }}
                            className="w-6 h-6 rounded-lg backdrop-blur flex items-center justify-center transition hover:scale-110 hover:text-red-400"
                            style={{ background: "rgba(7,19,38,0.7)", color: TEMPO.textDim }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={openNewTemplate}
                    className="p-3.5 rounded-2xl border border-dashed transition flex flex-col items-center justify-center gap-1 hover:bg-white/5"
                    style={{ borderColor: TEMPO.border, color: TEMPO.textDim }}
                  >
                    <Plus size={16} />
                    <span className="text-[10px]">Nouvelle</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1" style={{ background: TEMPO.border }} />
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: TEMPO.textMuted }}>
                Prédéfinies
              </span>
              <div className="h-px flex-1" style={{ background: TEMPO.border }} />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} style={{ color: TEMPO.gold }} />
              <h3 className="text-lg font-light" style={{ color: TEMPO.text }}>Tâches prédéfinies</h3>
            </div>
            <p className="text-xs mb-5" style={{ color: TEMPO.textDim }}>Choisis une catégorie</p>

            <div className="grid grid-cols-2 gap-2">
              {TASK_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                if (cat.isPause) {
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setPickedCategory(cat); setPickerStep("subcategory"); }}
                      className="col-span-2 p-4 rounded-2xl border transition flex items-center gap-4 hover:scale-[1.01]"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                        borderColor: TEMPO.borderStrong,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${TEMPO.borderStrong}` }}
                      >
                        <Moon size={18} style={{ color: TEMPO.textDim }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium" style={{ color: TEMPO.text }}>Pause</p>
                        <p className="text-[11px] italic leading-snug mt-0.5" style={{ color: TEMPO.textDim }}>
                          {cat.tagline}
                        </p>
                      </div>
                      <ChevronRight size={14} className="shrink-0" style={{ color: TEMPO.textMuted }} />
                    </button>
                  );
                }
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setPickedCategory(cat); setPickerStep("subcategory"); }}
                    className="p-4 rounded-2xl border transition flex flex-col items-start gap-2 hover:scale-[1.02]"
                    style={{ background: cat.color + "08", borderColor: TEMPO.border }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: cat.color + "25" }}
                    >
                      <Icon size={16} style={{ color: cat.color }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: TEMPO.text }}>{cat.name}</p>
                    <p className="text-[10px]" style={{ color: TEMPO.textDim }}>
                      {cat.subcategories.length} {cat.subcategories.length > 1 ? "options" : "option"}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => { setPickerStep("category"); setPickedCategory(null); }}
              className="flex items-center gap-1.5 text-xs mb-3 transition"
              style={{ color: TEMPO.textDim }}
            >
              <ChevronLeft size={14} /> Retour aux catégories
            </button>
            <div className="flex items-center gap-2 mb-1 pr-8">
              {(() => {
                const Icon = pickedCategory.icon;
                return <Icon size={16} style={{ color: pickedCategory.color }} />;
              })()}
              <h3 className="text-lg font-light truncate" style={{ color: TEMPO.text }}>{pickedCategory.name}</h3>
            </div>
            <p className="text-xs mb-5" style={{ color: TEMPO.textDim }}>Choisis une activité</p>
            <div className="grid grid-cols-2 gap-2">
              {pickedCategory.subcategories.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => applyPredefinedSelection(pickedCategory, sub)}
                    className="p-3 rounded-2xl border transition flex items-center gap-2.5 text-left hover:scale-[1.02]"
                    style={{ background: pickedCategory.color + "08", borderColor: TEMPO.border }}
                  >
                    <Icon size={14} style={{ color: pickedCategory.color }} className="shrink-0" />
                    <span className="text-xs truncate" style={{ color: TEMPO.text }}>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
