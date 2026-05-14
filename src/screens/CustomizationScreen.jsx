import { Check, ChevronLeft } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { CUSTOM_THEMES, DAY_NAMES } from "../constants/days";

export default function CustomizationScreen() {
  const { setShowCustomization, customTheme, setCustomTheme, dayTheme } = useFocus();

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: dayTheme.glow }}
        />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowCustomization(false)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-lg font-light">Personnalisation</h2>
          <div className="w-10" />
        </header>

        <p className="text-sm text-white/60 text-center mb-8 leading-relaxed">
          Choisissez l'ambiance visuelle qui vous ressemble.
          <br />
          Chaque thème redéfinit les couleurs des 7 jours de la semaine.
        </p>

        <div className="space-y-3 mb-6">
          {Object.entries(CUSTOM_THEMES).map(([key, theme]) => {
            const isActive = customTheme === key;
            return (
              <button
                key={key}
                onClick={() => setCustomTheme(key)}
                className="w-full text-left rounded-2xl border p-4 transition hover:scale-[1.01]"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${theme.colors[0]}20 0%, ${theme.colors[3]}10 100%)`
                    : "rgba(255,255,255,0.025)",
                  borderColor: isActive ? theme.colors[0] + "60" : "rgba(255,255,255,0.08)",
                  boxShadow: isActive ? `0 8px 32px ${theme.colors[0]}30` : "none",
                }}
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex-1">
                    <p className="text-base font-medium">{theme.label}</p>
                    <p className="text-xs text-white/50 mt-0.5">{theme.description}</p>
                  </div>
                  {isActive && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: theme.colors[0] }}
                    >
                      <Check size={12} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 mt-3">
                  {theme.colors.map((c, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className="w-full h-7 rounded-md"
                        style={{
                          background: `linear-gradient(135deg, ${c} 0%, ${c}99 100%)`,
                          boxShadow: isActive ? `0 0 12px ${c}60` : "none",
                        }}
                      />
                      <p className="text-[8px] uppercase tracking-wider text-white/40">
                        {DAY_NAMES[i].short}
                      </p>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-white/30 text-center italic px-4 leading-relaxed">
          Les thèmes ne modifient pas les couleurs de votre cerveau ni des catégories de tâches —
          <br />
          uniquement l'ambiance générale de l'application.
        </p>

        <p className="text-[10px] text-white/20 text-center mt-8 italic">
          Plus de personnalisation arrivera dans une prochaine mise à jour.
        </p>
      </div>
    </div>
  );
}
