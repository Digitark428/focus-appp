import { ChevronDown } from "lucide-react";
import { useFocus } from "../context/FocusContext";

export default function MainHeader() {
  const { user, now, dayTheme, setShowMenu, handleLogoTap } = useFocus();

  const hour = now.getHours();
  const greeting = hour < 5 ? "Bonne nuit" : hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const firstName = user?.firstName || "";

  return (
    <header className="flex items-start justify-between mb-8">
      <button onClick={handleLogoTap} className="text-left">
        <h1 className="text-4xl font-light tracking-tight leading-none">
          focus<span style={{ color: dayTheme.accent }}>.</span>
        </h1>
        <p className="text-xs text-white/40 mt-2 tracking-widest uppercase">
          {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
        {firstName && (
          <p className="text-[11px] mt-1.5 font-light" style={{ color: dayTheme.accent + "bb" }}>
            {greeting}, {firstName}
          </p>
        )}
      </button>

      <button
        onClick={() => setShowMenu(true)}
        data-tour="menu"
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition"
      >
        <div
          className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-xs font-medium"
          style={{ background: dayTheme.accent + "30", border: `1px solid ${dayTheme.accent}40` }}
        >
          {user.photo ? (
            <img src={user.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: dayTheme.accent }}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          )}
        </div>
        <ChevronDown size={12} className="text-white/50" />
      </button>
    </header>
  );
}
