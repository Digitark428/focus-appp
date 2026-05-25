import { Headphones, Upload, X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TEMPO } from "../utils/tempoTheme";

export default function AmbientSoundPicker() {
  const {
    activeCustomTrack, ambientVolume, setAmbientVolume,
    customTracks, activateCustom,
    handleMusicUpload, removeCustomTrack,
  } = useFocus();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: TEMPO.textDim }}>
          Musique
        </p>
        {activeCustomTrack && (
          <input
            type="range" min="0" max="1" step="0.05" value={ambientVolume}
            onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
            className="w-24"
            style={{ accentColor: TEMPO.gold }}
          />
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-6 px-6 pb-2 no-scrollbar">
        {customTracks.map((track) => {
          const isActive = activeCustomTrack === track.id;
          return (
            <div
              key={track.id}
              className="shrink-0 flex items-center gap-1 rounded-full border transition-all"
              style={{
                background: isActive ? TEMPO.gold + "20" : "rgba(255,255,255,0.025)",
                borderColor: isActive ? TEMPO.gold + "60" : TEMPO.border,
              }}
            >
              <button onClick={() => activateCustom(track.id)} className="flex items-center gap-2 pl-4 pr-2 py-2.5">
                <Headphones size={14} style={{ color: isActive ? TEMPO.gold : TEMPO.textDim }} />
                <span
                  className="text-xs max-w-[140px] truncate"
                  style={{ color: isActive ? TEMPO.gold : TEMPO.text + "b0" }}
                >
                  {track.name}
                </span>
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: TEMPO.gold, boxShadow: `0 0 4px ${TEMPO.gold}` }}
                  />
                )}
              </button>
              <button
                onClick={() => removeCustomTrack(track.id)}
                className="pr-3 hover:text-red-400 transition"
                style={{ color: TEMPO.textDim }}
                aria-label="Supprimer la musique"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <label
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed transition cursor-pointer hover:bg-white/5"
          style={{ borderColor: TEMPO.borderStrong }}
        >
          <Upload size={14} style={{ color: TEMPO.textDim }} />
          <span className="text-xs" style={{ color: TEMPO.text + "b0" }}>Ajouter ma musique</span>
          <input type="file" accept="audio/*" multiple className="hidden" onChange={handleMusicUpload} />
        </label>
      </div>
    </div>
  );
}
