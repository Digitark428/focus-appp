import { Headphones, Upload, X } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { AMBIENT_SOUNDS } from "../constants/tasks";

export default function AmbientSoundPicker() {
  const {
    activeAmbient, activeCustomTrack, ambientVolume, setAmbientVolume,
    customTracks, activateAmbient, activateCustom,
    handleMusicUpload, removeCustomTrack,
  } = useFocus();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Ambiance sonore</p>
        {(activeAmbient || activeCustomTrack) && (
          <input
            type="range" min="0" max="1" step="0.05" value={ambientVolume}
            onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
            className="w-20 accent-white/60"
          />
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-6 px-6 pb-2 no-scrollbar">
        {AMBIENT_SOUNDS.map((sound) => {
          const Icon = sound.icon;
          const isActive = activeAmbient === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => activateAmbient(sound.id)}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all"
              style={{
                background: isActive ? sound.color + "20" : "rgba(255,255,255,0.03)",
                borderColor: isActive ? sound.color + "60" : "rgba(255,255,255,0.08)",
              }}
            >
              <Icon size={14} style={{ color: isActive ? sound.color : "rgba(255,255,255,0.6)" }} />
              <span className="text-xs" style={{ color: isActive ? sound.color : "rgba(255,255,255,0.7)" }}>
                {sound.name}
              </span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sound.color }} />}
            </button>
          );
        })}

        {customTracks.map((track) => {
          const isActive = activeCustomTrack === track.id;
          return (
            <div
              key={track.id}
              className="shrink-0 flex items-center gap-1 rounded-full border transition-all"
              style={{
                background: isActive ? "#FFFFFF20" : "rgba(255,255,255,0.03)",
                borderColor: isActive ? "#FFFFFF60" : "rgba(255,255,255,0.08)",
              }}
            >
              <button onClick={() => activateCustom(track.id)} className="flex items-center gap-2 pl-4 pr-2 py-2.5">
                <Headphones size={14} style={{ color: isActive ? "white" : "rgba(255,255,255,0.6)" }} />
                <span
                  className="text-xs max-w-[120px] truncate"
                  style={{ color: isActive ? "white" : "rgba(255,255,255,0.7)" }}
                >
                  {track.name}
                </span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" />}
              </button>
              <button
                onClick={() => removeCustomTrack(track.id)}
                className="pr-3 text-white/40 hover:text-red-400 transition"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        <label className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-white/15 hover:bg-white/5 hover:border-white/30 transition cursor-pointer">
          <Upload size={14} className="text-white/60" />
          <span className="text-xs text-white/70">Ajouter ma musique</span>
          <input type="file" accept="audio/*" multiple className="hidden" onChange={handleMusicUpload} />
        </label>
      </div>
    </div>
  );
}
