import { useEffect, useState } from "react";
import TempoLogo from "../components/TempoLogo";
import { TEMPO, TEMPO_GRADIENTS } from "../utils/tempoTheme";

// ============================================================
//  SPLASH SCREEN — premier écran au lancement de l'application.
//  Affiche le logo Tempo, le wordmark et le tagline avec une
//  animation premium d'entrée, puis disparaît automatiquement.
// ============================================================
export default function SplashScreen({ onDone, duration = 2200 }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadingOut(true), duration - 500);
    const t2 = setTimeout(() => onDone?.(), duration);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [duration, onDone]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: TEMPO_GRADIENTS.bgRadial,
        opacity: fadingOut ? 0 : 1,
        transition: "opacity 500ms ease-out",
      }}
    >
      {/* Grain texture subtil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Halos dorés ambiants */}
      <div
        className="absolute top-1/4 right-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${TEMPO.gold}22 0%, transparent 60%)`,
          filter: "blur(60px)",
          animation: "splash-glow 5s ease-in-out infinite",
        }}
      />

      {/* Logo entrant */}
      <div style={{ animation: "splash-logo-in 900ms cubic-bezier(0.16,1,0.3,1) both" }}>
        <TempoLogo size={140} animated glow />
      </div>

      {/* Wordmark "Tempo." */}
      <h1
        className="mt-8 text-5xl tracking-tight"
        style={{
          fontWeight: 300,
          color: TEMPO.text,
          letterSpacing: "-0.02em",
          animation: "splash-text-in 800ms ease-out 300ms both",
        }}
      >
        Tempo<span style={{ color: TEMPO.gold }}>.</span>
      </h1>

      {/* Tagline */}
      <p
        className="mt-4 text-[11px] uppercase text-center px-8"
        style={{
          color: TEMPO.textDim,
          letterSpacing: "0.32em",
          fontWeight: 300,
          animation: "splash-text-in 800ms ease-out 600ms both",
        }}
      >
        Reprenez le contrôle<br />de votre journée
      </p>

      {/* Ligne dorée animée en bas */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-px overflow-hidden"
        style={{ animation: "splash-text-in 800ms ease-out 900ms both" }}
      >
        <div
          className="h-full w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${TEMPO.gold}, transparent)`,
            animation: "splash-line 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes splash-logo-in {
          0%   { opacity: 0; transform: translateY(20px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splash-text-in {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.15); }
        }
        @keyframes splash-line {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
