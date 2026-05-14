import {
  BarChart3, Brain, LogOut, Palette, Pencil, Sparkles, Volume2, VolumeX,
} from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { CUSTOM_THEMES } from "../constants/days";

export default function MenuDrawer() {
  const {
    showMenu, setShowMenu, user, setUser, dayTheme,
    setShowProfile, setProfileDraft,
    setShowBrain, setShowStats, setShowCustomization, setShowSubscription,
    customTheme, brainTotalDays, brainCurrentColor,
    trialDaysLeft, voiceOn, toggleVoice, setTutorialStep,
  } = useFocus();

  if (!showMenu) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[65] flex items-start justify-end p-4 sm:p-6"
      onClick={() => setShowMenu(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/10 rounded-3xl p-3 w-full max-w-[260px] mt-16 shadow-2xl"
      >
        <button
          onClick={() => { setShowMenu(false); setProfileDraft(user); setShowProfile(true); }}
          className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition text-left"
        >
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-medium shrink-0"
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
            <p className="text-[11px] text-white/40 truncate">{user.email}</p>
          </div>
        </button>

        <div className="h-px bg-white/5 my-2" />

        <button
          onClick={() => { setShowMenu(false); setShowBrain(true); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          <Brain size={15} style={{ color: brainCurrentColor }} />
          <span className="text-sm flex-1">Mon cerveau</span>
          {brainTotalDays > 0 && (
            <span
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: brainCurrentColor + "20", color: brainCurrentColor }}
            >
              {brainTotalDays}j
            </span>
          )}
        </button>

        <button
          onClick={() => { setShowMenu(false); setShowStats(true); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          <BarChart3 size={15} className="text-white/60" />
          <span className="text-sm">Statistiques</span>
        </button>

        <button
          onClick={() => { setShowMenu(false); setProfileDraft(user); setShowProfile(true); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          <Pencil size={15} className="text-white/60" />
          <span className="text-sm">Modifier le profil</span>
        </button>

        <button
          onClick={() => { setShowMenu(false); setShowCustomization(true); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          <Palette size={15} className="text-white/60" />
          <span className="text-sm flex-1">Personnalisation</span>
          <div className="flex gap-0.5">
            {CUSTOM_THEMES[customTheme].colors.slice(0, 3).map((c, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </button>

        <button
          onClick={() => { setShowMenu(false); setShowSubscription(true); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          <Sparkles size={15} className="text-white/60" />
          <span className="text-sm flex-1">Mon abonnement</span>
          {user.isSubscribed ? (
            <span
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: dayTheme.accent + "20", color: dayTheme.accent }}
            >
              Actif
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-white/40">
              {trialDaysLeft > 0 ? `${trialDaysLeft}j` : "Expiré"}
            </span>
          )}
        </button>

        <button
          onClick={toggleVoice}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          {voiceOn
            ? <Volume2 size={15} className="text-white/60" />
            : <VolumeX size={15} className="text-white/60" />}
          <span className="text-sm flex-1">Voix de notification</span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">
            {voiceOn ? "ON" : "OFF"}
          </span>
        </button>

        <button
          onClick={() => { setShowMenu(false); setTutorialStep(0); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
        >
          <Sparkles size={15} className="text-white/60" />
          <span className="text-sm">Revoir le tutoriel</span>
        </button>

        <div className="h-px bg-white/5 my-2" />

        <button
          onClick={() => { setShowMenu(false); setUser(null); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition text-left text-red-400/80"
        >
          <LogOut size={15} />
          <span className="text-sm">Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}
