import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useFocus } from "../context/FocusContext";
import { TempoLogoMini } from "./TempoLogo";
import { TEMPO } from "../utils/tempoTheme";

// Indicateur de synchronisation cloud — discret, en haut à droite.
// Vert = sauvegardé / Jaune = en cours / Rouge = erreur (tap → détails + retry).
function SyncDot() {
  const { syncStatus, forceSync } = useFocus();
  const [open, setOpen] = useState(false);
  const { status, error, lastSuccessAt } = syncStatus || {};
  const color =
    status === "error" ? "#EF4444" :
    status === "saving" ? "#F2D28F" :
    status === "saved" ? "#86EFAC" : TEMPO.textDim;
  const visible = status !== "idle";
  if (!visible) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-2.5 h-2.5 rounded-full transition"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        aria-label="État de synchronisation"
        title={status === "error" ? `Erreur sync : ${error}` : status}
      />
      {open && (
        <div
          className="absolute right-0 mt-2 w-64 p-3 rounded-2xl text-xs z-50"
          style={{
            background: "rgba(7,19,38,0.96)",
            border: `1px solid ${TEMPO.border}`,
            color: TEMPO.text,
          }}
        >
          {status === "saving" && <p style={{ color: TEMPO.textDim }}>Sauvegarde en cours…</p>}
          {status === "saved" && (
            <p style={{ color: TEMPO.textDim }}>
              Synchronisé{lastSuccessAt ? ` à ${new Date(lastSuccessAt).toLocaleTimeString("fr-FR")}` : ""}.
            </p>
          )}
          {status === "error" && (
            <>
              <p className="mb-2" style={{ color: "#FCA5A5" }}>Sauvegarde cloud impossible</p>
              <p className="mb-3 break-words" style={{ color: TEMPO.textDim }}>{error}</p>
              <button
                onClick={() => { setOpen(false); forceSync(); }}
                className="w-full py-1.5 rounded-lg text-[11px]"
                style={{ background: TEMPO.gold + "20", border: `1px solid ${TEMPO.gold}50`, color: TEMPO.gold }}
              >
                Réessayer maintenant
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MainHeader() {
  const { user, now, setShowMenu, handleLogoTap, handlePhotoUpload } = useFocus();

  const hour = now.getHours();
  const greeting = hour < 5 ? "Bonne nuit" : hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const firstName = user?.firstName || "";

  return (
    <header className="flex items-start justify-between mb-6 lg:mb-8">
      <button onClick={handleLogoTap} className="text-left flex items-center gap-3">
        <TempoLogoMini size={36} className="lg:hidden" />
        <TempoLogoMini size={40} className="hidden lg:block" />
        <div>
          <h1
            className="text-[26px] lg:text-3xl tracking-tight leading-none"
            style={{ fontWeight: 300, letterSpacing: "-0.02em", color: TEMPO.text }}
          >
            Tempo<span style={{ color: TEMPO.gold }}>.</span>
          </h1>
          <p
            className="text-[10px] mt-1 lg:mt-1.5 uppercase"
            style={{ color: TEMPO.textDim, letterSpacing: "0.18em" }}
          >
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {firstName && (
            <p className="text-[11px] mt-0.5 lg:mt-1 font-light" style={{ color: TEMPO.gold + "cc" }}>
              {greeting}, {firstName}
            </p>
          )}
        </div>
      </button>

      <div className="flex items-center gap-2">
        <SyncDot />
        {/* Photo de profil cliquable — upload direct depuis le dashboard.
            Stop propagation pour ne pas ouvrir le menu. */}
        <label
          onClick={(e) => e.stopPropagation()}
          className="cursor-pointer w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex items-center justify-center text-sm font-medium transition hover:scale-[1.05]"
          style={{
            background: TEMPO.gold + "25",
            border: `1px solid ${TEMPO.gold}55`,
            boxShadow: `0 4px 16px ${TEMPO.gold}25`,
          }}
          title="Modifier ma photo"
        >
          {user.photo ? (
            <img src={user.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: TEMPO.gold }}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>

        <button
          onClick={() => setShowMenu(true)}
          className="flex items-center gap-1 pl-2 pr-2.5 py-1.5 rounded-full backdrop-blur transition hover:scale-[1.03]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${TEMPO.border}`,
          }}
        >
          <ChevronDown size={12} style={{ color: TEMPO.textDim }} />
        </button>
      </div>
    </header>
  );
}
