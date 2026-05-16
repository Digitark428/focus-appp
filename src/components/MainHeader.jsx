import { ChevronDown } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TempoLogoMini } from "./TempoLogo";
import { TEMPO } from "../utils/tempoTheme";

export default function MainHeader() {
  const { user, now, dayTheme, setShowMenu, handleLogoTap } = useFocus();

  const hour = now.getHours();
  const greeting = hour < 5 ? "Bonne nuit" : hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const firstName = user?.firstName || "";

  return (
    <header className="flex items-start justify-between mb-8">
      <button onClick={handleLogoTap} className="text-left flex items-center gap-3">
        <TempoLogoMini size={40} />
        <div>
          <h1
            className="text-3xl tracking-tight leading-none"
            style={{ fontWeight: 300, letterSpacing: "-0.02em", color: TEMPO.text }}
          >
            Tempo<span style={{ color: TEMPO.gold }}>.</span>
          </h1>
          <p
            className="text-[10px] mt-1.5 uppercase"
            style={{ color: TEMPO.textDim, letterSpacing: "0.18em" }}
          >
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {firstName && (
            <p className="text-[11px] mt-1 font-light" style={{ color: TEMPO.gold + "cc" }}>
              {greeting}, {firstName}
            </p>
          )}
        </div>
      </button>

      <button
        onClick={() => setShowMenu(true)}
        data-tour="menu"
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full backdrop-blur transition hover:scale-[1.03]"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${TEMPO.border}`,
        }}
      >
        <div
          className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-medium"
          style={{ background: TEMPO.gold + "25", border: `1px solid ${TEMPO.gold}40` }}
        >
          {user.photo ? (
            <img src={user.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: TEMPO.gold }}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          )}
        </div>
        <ChevronDown size={12} style={{ color: TEMPO.textDim }} />
      </button>
    </header>
  );
}
