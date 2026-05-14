import { ChevronLeft, ChevronRight, Moon, Pencil, Plus, Sparkles, Trash2, Zap } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { CUSTOM_TASK_ICONS, TASK_CATEGORIES } from "../../constants/tasks";

export default function CategoryPickerModal() {
  const {
    showCategoryPicker, setShowCategoryPicker,
    pickerStep, setPickerStep,
    pickedCategory, setPickedCategory,
    customTaskTemplates, openNewTemplate, openEditTemplate, deleteTemplate, insertTemplate,
    taskForm, setTaskForm,
  } = useFocus();

  if (!showCategoryPicker) return null;

  const close = () => {
    setShowCategoryPicker(false);
    setPickedCategory(null);
    setPickerStep("category");
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto"
      >
        {pickerStep === "category" ? (
          <>
            {/* === MES TÂCHES (custom templates) === */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#A78BFA,#60A5FA)" }}
                  >
                    <Plus size={9} className="text-black" strokeWidth={3} />
                  </div>
                  <h3 className="text-sm font-medium">Mes tâches</h3>
                </div>
                <button
                  onClick={openNewTemplate}
                  className="text-[11px] text-white/50 hover:text-white transition flex items-center gap-1"
                >
                  <Plus size={11} /> Créer
                </button>
              </div>

              {customTaskTemplates.length === 0 ? (
                <button
                  onClick={openNewTemplate}
                  className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-xs text-white/40 hover:text-white/60 hover:border-white/20 transition flex items-center justify-center gap-2"
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
                          <p className="text-[10px] text-white/40 mt-0.5">{tpl.durationMin} min</p>
                        </button>
                        <div className="absolute top-1.5 right-1.5 gap-0.5 hidden group-hover:flex">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditTemplate(tpl); }}
                            className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center text-white/60 hover:text-white transition"
                          >
                            <Pencil size={10} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteTemplate(tpl.id); }}
                            className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur flex items-center justify-center text-white/40 hover:text-red-400 transition"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={openNewTemplate}
                    className="p-3.5 rounded-2xl border border-dashed border-white/10 hover:border-white/20 transition flex flex-col items-center justify-center gap-1 text-white/30 hover:text-white/50"
                  >
                    <Plus size={16} />
                    <span className="text-[10px]">Nouvelle</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Prédéfinies</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-violet-400" />
              <h3 className="text-lg font-light">Tâches prédéfinies</h3>
            </div>
            <p className="text-xs text-white/40 mb-5">Choisis une catégorie</p>

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
                        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                        borderColor: "rgba(255,255,255,0.18)",
                        boxShadow: "0 4px 20px rgba(255,255,255,0.04)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        <Moon size={18} className="text-white/80" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">Pause</p>
                        <p className="text-[11px] text-white/45 italic leading-snug mt-0.5">
                          {cat.tagline}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-white/30 shrink-0" />
                    </button>
                  );
                }
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setPickedCategory(cat); setPickerStep("subcategory"); }}
                    className="p-4 rounded-2xl border border-white/10 hover:border-white/20 transition flex flex-col items-start gap-2"
                    style={{ background: cat.color + "08" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: cat.color + "25" }}
                    >
                      <Icon size={16} style={{ color: cat.color }} />
                    </div>
                    <p className="text-sm font-medium">{cat.name}</p>
                    <p className="text-[10px] text-white/40">
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
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white mb-3 transition"
            >
              <ChevronLeft size={14} /> Retour aux catégories
            </button>
            <div className="flex items-center gap-2 mb-1">
              {(() => {
                const Icon = pickedCategory.icon;
                return <Icon size={16} style={{ color: pickedCategory.color }} />;
              })()}
              <h3 className="text-lg font-light">{pickedCategory.name}</h3>
            </div>
            <p className="text-xs text-white/40 mb-5">Choisis une activité</p>
            <div className="grid grid-cols-2 gap-2">
              {pickedCategory.subcategories.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setTaskForm({
                        ...taskForm,
                        name: sub.name,
                        category: pickedCategory.id,
                        subcategory: sub.name,
                        meditationId: sub.meditationId || taskForm.meditationId,
                      });
                      setShowCategoryPicker(false);
                      setPickedCategory(null);
                      setPickerStep("category");
                    }}
                    className="p-3 rounded-2xl border border-white/10 hover:border-white/20 transition flex items-center gap-2.5 text-left"
                    style={{ background: pickedCategory.color + "08" }}
                  >
                    <Icon size={14} style={{ color: pickedCategory.color }} className="shrink-0" />
                    <span className="text-xs truncate">{sub.name}</span>
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
