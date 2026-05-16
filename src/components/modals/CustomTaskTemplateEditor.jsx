import { ChevronDown, Trash2, Zap } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { CUSTOM_TASK_COLORS, CUSTOM_TASK_ICONS } from "../../constants/tasks";
import { TEMPO, TEMPO_SHADOWS } from "../../utils/tempoTheme";

export default function CustomTaskTemplateEditor() {
  const {
    showCustomTaskEditor, setShowCustomTaskEditor,
    editingTemplate, templateForm, setTemplateForm,
    saveTemplate, deleteTemplate,
  } = useFocus();

  if (!showCustomTaskEditor) return null;

  const iconDef = CUSTOM_TASK_ICONS.find((i) => i.key === templateForm.iconKey);
  const PreviewIcon = iconDef?.icon || Zap;

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${TEMPO.border}`,
    color: TEMPO.text,
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: "rgba(7,19,38,0.8)" }}
      onClick={() => setShowCustomTaskEditor(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.borderStrong}`,
          boxShadow: TEMPO_SHADOWS.cardHi,
        }}
      >
        <h3 className="text-lg font-light mb-1" style={{ color: TEMPO.text }}>
          {editingTemplate ? "Modifier la tâche" : "Nouvelle tâche personnalisée"}
        </h3>
        <p className="text-xs mb-5" style={{ color: TEMPO.textDim }}>
          Cette tâche sera disponible à tout moment dans votre bibliothèque.
        </p>

        <div className="mb-4">
          <label
            className="text-[10px] uppercase tracking-[0.22em] mb-2 block"
            style={{ color: TEMPO.textDim }}
          >
            Nom
          </label>
          <input
            type="text"
            placeholder="Ex : Uber Eats, Montage vidéo…"
            value={templateForm.name}
            onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition"
            style={inputStyle}
          />
        </div>

        <div className="mb-4">
          <label
            className="text-[10px] uppercase tracking-[0.22em] mb-2 block"
            style={{ color: TEMPO.textDim }}
          >
            Durée par défaut
          </label>
          <div className="relative">
            <select
              value={templateForm.durationMin}
              onChange={(e) => setTemplateForm({ ...templateForm, durationMin: parseInt(e.target.value, 10) })}
              className="w-full appearance-none rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${TEMPO.border}`,
                color: templateForm.color,
              }}
            >
              {[5, 10, 15, 20, 25, 30, 45, 60, 90, 120].map((m) => (
                <option key={m} value={m} style={{ background: TEMPO.bgAlt, color: TEMPO.text }}>
                  {m} minutes
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: TEMPO.textDim }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            className="text-[10px] uppercase tracking-[0.22em] mb-2 block"
            style={{ color: TEMPO.textDim }}
          >
            Icône
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {CUSTOM_TASK_ICONS.map(({ key, icon: Icon }) => {
              const active = templateForm.iconKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setTemplateForm({ ...templateForm, iconKey: key })}
                  className="aspect-square rounded-xl flex items-center justify-center transition hover:scale-110"
                  style={{
                    background: active ? templateForm.color + "30" : "rgba(255,255,255,0.035)",
                    border: `1px solid ${active ? templateForm.color + "70" : TEMPO.border}`,
                    boxShadow: active ? `0 0 12px ${templateForm.color}40` : "none",
                  }}
                >
                  <Icon
                    size={15}
                    style={{ color: active ? templateForm.color : TEMPO.textDim }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label
            className="text-[10px] uppercase tracking-[0.22em] mb-2 block"
            style={{ color: TEMPO.textDim }}
          >
            Couleur
          </label>
          <div className="grid grid-cols-10 gap-1.5">
            {CUSTOM_TASK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setTemplateForm({ ...templateForm, color: c })}
                className="aspect-square rounded-full transition hover:scale-125"
                style={{
                  background: c,
                  boxShadow: templateForm.color === c
                    ? `0 0 0 2px ${TEMPO.bg}, 0 0 0 3.5px ${c}`
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
            <p className="text-[11px]" style={{ color: TEMPO.textDim }}>
              {templateForm.durationMin} min · Tâche personnalisée
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCustomTaskEditor(false)}
            className="flex-1 py-3 rounded-xl border text-sm transition hover:bg-white/5"
            style={{ borderColor: TEMPO.border, color: TEMPO.text }}
          >
            Annuler
          </button>
          {editingTemplate && (
            <button
              onClick={() => { deleteTemplate(editingTemplate.id); setShowCustomTaskEditor(false); }}
              className="w-10 py-3 rounded-xl border hover:bg-red-500/10 transition flex items-center justify-center"
              style={{ borderColor: "rgba(248,113,113,0.3)", color: TEMPO.danger }}
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={saveTemplate}
            disabled={!templateForm.name.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition hover:scale-[1.02] disabled:opacity-40"
            style={{
              background: templateForm.color,
              color: "#1A1206",
              boxShadow: `0 6px 18px ${templateForm.color}50`,
            }}
          >
            {editingTemplate ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
