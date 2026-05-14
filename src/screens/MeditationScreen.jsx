import { X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { MEDITATIONS } from "../constants/tasks";

export default function MeditationScreen() {
  const { activeMeditation, setActiveMeditation } = useFocus();
  const med = MEDITATIONS.find((m) => m.id === activeMeditation);
  if (!med) return null;
  const Icon = med.icon;

  return (
    <div className="fixed inset-0 bg-neutral-950 text-white flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl animate-pulse"
          style={{ background: med.color, animationDuration: "4s" }}
        />
      </div>

      <button
        onClick={() => setActiveMeditation(null)}
        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 backdrop-blur flex items-center justify-center hover:bg-white/10 transition z-10"
      >
        <X size={18} />
      </button>

      <div className="relative z-10 text-center px-8 max-w-md">
        <Icon size={48} style={{ color: med.color }} className="mx-auto mb-6" />
        <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">Méditation guidée</p>
        <h2 className="text-3xl font-light mb-2">{med.name}</h2>
        <p className="text-sm text-white/50 mb-1">{med.description}</p>
        <p className="text-xs text-white/30 mb-10">{med.duration} min</p>

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
              <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">respirez</p>
              <p className="text-lg font-light" style={{ color: med.color }}>en suivant le cercle</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/60 italic mb-8 leading-relaxed">"{med.script}"</p>

        <button
          onClick={() => setActiveMeditation(null)}
          className="px-8 py-3 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition"
        >
          Terminer la séance
        </button>
      </div>
    </div>
  );
}
