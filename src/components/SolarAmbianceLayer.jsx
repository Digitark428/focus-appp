import { useFocus } from "../context/FocusContext";
import { getSolarAmbiance } from "../utils/solar";

export default function SolarAmbianceLayer() {
  const { now, dayTheme, currentTask } = useFocus();
  const solar = getSolarAmbiance(now);

  return (
    <>
      {/* Solar layer */}
      {solar.glowIntensity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-0"
          style={{ transition: "opacity 4s ease-in-out" }}
        >
          {/* Primary halo */}
          <div
            className="absolute left-1/2 w-[140vw] max-w-[700px]"
            style={{
              top: `${solar.sunY - 18}%`,
              height: "55vw",
              maxHeight: "340px",
              transform: "translateX(-50%)",
              background: solar.bgGradient,
              transition: "top 180s linear, background 900s linear",
              filter: "blur(2px)",
            }}
          />

          {/* Core glow */}
          <div
            className="absolute left-1/2"
            style={{
              top: `${solar.sunY}%`,
              width: "60vw",
              maxWidth: "320px",
              height: "32vw",
              maxHeight: "200px",
              transform: "translateX(-50%) translateY(-50%)",
              background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${solar.glowColor} 0%, transparent 70%)`,
              opacity: solar.coreOpacity,
              filter: "blur(32px)",
              transition: "top 180s linear, opacity 900s linear",
              animation: "solar-breathe 8s ease-in-out infinite",
            }}
          />

          {/* Lens flare streak */}
          {solar.coreOpacity > 0.15 && (
            <div
              className="absolute left-0 right-0"
              style={{
                top: `${solar.sunY}%`,
                height: "1px",
                background: `linear-gradient(90deg, transparent 0%, ${solar.glowColor} 30%, rgba(255,255,255,${solar.coreOpacity * 0.4}) 50%, ${solar.glowColor} 70%, transparent 100%)`,
                opacity: solar.coreOpacity * 0.6,
                filter: "blur(1px)",
                animation: "solar-shimmer 6s ease-in-out infinite",
                animationDelay: "2s",
              }}
            />
          )}

          {/* Soft screen-tint */}
          <div
            className="absolute inset-0"
            style={{
              background:
                solar.phase === "dawn" || solar.phase === "sunset"
                  ? `linear-gradient(180deg, rgba(251,146,60,${solar.glowIntensity * 0.07}) 0%, transparent 40%)`
                  : solar.phase === "morning" || solar.phase === "midday"
                    ? `linear-gradient(180deg, rgba(253,230,138,${solar.glowIntensity * 0.05}) 0%, transparent 35%)`
                    : "transparent",
              transition: "background 900s linear",
            }}
          />
        </div>
      )}

      {/* Day-theme glow */}
      <div className="absolute inset-0 opacity-50 pointer-events-none transition-all duration-1000 z-0">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000"
          style={{ background: dayTheme.glow }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: currentTask ? currentTask.color : dayTheme.accent }}
        />
      </div>
    </>
  );
}
