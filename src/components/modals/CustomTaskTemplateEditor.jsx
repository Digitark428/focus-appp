import { ChevronDown, Trash2, Zap } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { CUSTOM_TASK_COLORS, CUSTOM_TASK_ICONS } from "../../constants/tasks";

export default function CustomTaskTemplateEditor() {
  const {
    showCustomTaskEditor, setShowCustomTaskEditor,
    editingTemplate, templateForm, setTemplateForm,
    saveTemplate, deleteTemplate,
  } = useFocus();

  if (!showCustomTaskEditor) return null;

  const iconDef = CUSTOM_TASK_ICONS.find((i) => i.key === templateForm.iconKey);
  const PreviewIcon = iconDef?.icon || Zap;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[65] flex items-end sm:items-center justify-center p-4"
      onClick={() => setShowCustomTaskEditor(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-lg font-light mb-1">
          {editingTemplate ? "Modifier la tâche" : "Nouvelle tâche personnalisée"}
        </h3>
        <p className="text-xs text-white/40 mb-5">
          Cette tâche sera disponible à tout moment dans votre bibliothèque.
        </p>

        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Nom</label>
          <input
            type="text" placeholder="Ex : Uber Eats, Montage vidéo…" value={templateForm.name}
            onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">
            Durée par défaut
          </label>
          <div className="relative">
            <select
              value={templateForm.durationMin}
              onChange={(e) => setTemplateForm({ ...templateForm, durationMin: parseInt(e.target.value, 10) })}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none cursor-pointer"
              style={{ color: templateForm.color }}
            >
              {[5, 10, 15, 20, 25, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m} className="bg-neutral-900 text-white">
                  {m} minutes
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Icône</label>
          <div className="grid grid-cols-6 gap-1.5">
            {CUSTOM_TASK_ICONS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTemplateForm({ ...templateForm, iconKey: key })}
                className="aspect-square rounded-xl flex items-center justify-center transition hover:scale-110"
                style={{
                  background: templateForm.iconKey === key ? templateForm.color + "30" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${templateForm.iconKey === key ? templateForm.color + "70" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: templateForm.iconKey === key ? `0 0 12px ${templateForm.color}50` : "none",
                }}
              >
                <Icon
                  size={15}
                  style={{ color: templateForm.iconKey === key ? templateForm.color : "rgba(255,255,255,0.5)" }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 block">Couleur</label>
          <div className="grid grid-cols-10 gap-1.5">
            {CUSTOM_TASK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setTemplateForm({ ...templateForm, color: c })}
                className="aspect-square rounded-full transition hover:scale-125"
                style={{
                  background: c,
                  boxShadow: templateForm.color === c
                    ? `0 0 0 2px rgba(0,0,0,0.8), 0 0 0 3.5px ${c}`
                    : "none",
                  transform: templateForm.color === c ? "scale(1.2)" : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="mb-5 p-3.5 rounded-2xl border flex items-center gap-3"
          style={{ background: templateForm.color + "12", borderColor: templateForm.color + "40" }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: templateForm.color + "25" }}
          >
            <PreviewIcon size={18} style={{ color: templateForm.color }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: templateForm.color }}>
              {templateForm.name || "Nom de la tâche"}
            </p>
            <p className="text-[11px] text-white/40">{templateForm.durationMin} min · Tâche personnalisée</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCustomTaskEditor(false)}
            className="flex-1 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition"
          >
            Annuler
          </button>
          {editingTemplate && (
            <button
              onClick={() => { deleteTemplate(editingTemplate.id); setShowCustomTaskEditor(false); }}
              className="w-10 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={saveTemplate}
            disabled={!templateForm.name.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02] disabled:opacity-40"
            style={{ background: templateForm.color, color: "#000" }}
          >
            {editingTemplate ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
