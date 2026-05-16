import { X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { MEDITATIONS } from "../constants/tasks";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function MeditationScreen() {
  const { activeMeditation, setActiveMeditation } = useFocus();
  const med = MEDITATIONS.find((m) => m.id === activeMeditation);
  if (!med) return null;
  const Icon = med.icon;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial, color: TEMPO.text }}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse"
          style={{ background: med.color, animationDuration: "4s" }}
        />
      </div>

      <button
        onClick={() => setActiveMeditation(null)}
        className="absolute top-6 right-6 w-11 h-11 rounded-full backdrop-blur flex items-center justify-center transition z-10 hover:bg-white/10"
        style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${TEMPO.border}` }}
      >
        <X size={18} style={{ color: TEMPO.text }} />
      </button>

      <div className="relative z-10 text-center px-8 max-w-md">
        <Icon size={48} style={{ color: med.color }} className="mx-auto mb-6" />
        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-3"
          style={{ color: TEMPO.textDim }}
        >
          Méditation guidée
        </p>
        <h2 className="text-3xl font-light mb-2" style={{ color: TEMPO.text }}>{med.name}</h2>
        <p className="text-sm mb-1" style={{ color: TEMPO.textDim }}>{med.description}</p>
        <p className="text-xs mb-10" style={{ color: TEMPO.textMuted }}>{med.duration} min</p>

        <div className="relative w-48 h-48 mx-auto mb-10">
          <div
            className="absolute inset-0 rounded-full border-2 animate-pulse"
            style={{ borderColor: med.color + "60", animationDuration: "4s" }}
          />
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: `radial-gradient(circle, ${med.color}30 0%, transparent 70%)` }}
          >
            <div className="text-center">
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-1"
                style={{ color: TEMPO.textDim }}
              >
                respirez
              </p>
              <p className="text-lg font-light" style={{ color: med.color }}>
                en suivant le cercle
              </p>
            </div>
          </div>
        </div>

        <p
          className="text-sm italic mb-8 leading-relaxed"
          style={{ color: TEMPO.text + "b0" }}
        >
          "{med.script}"
        </p>

        <button
          onClick={() => setActiveMeditation(null)}
          className="px-8 py-3 rounded-full text-sm font-medium transition hover:scale-105"
          style={{
            background: TEMPO_GRADIENTS.gold,
            color: "#1A1206",
            boxShadow: TEMPO_SHADOWS.gold,
          }}
        >
          Terminer la séance
        </button>
      </div>
    </div>
  );
}
