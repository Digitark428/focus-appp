import { ChevronDown } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TempoLogoMini } from "./TempoLogo";
import { TEMPO } from "../utils/tempoTheme";

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
