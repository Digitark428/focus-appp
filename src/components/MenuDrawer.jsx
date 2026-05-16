import {
  BarChart3, Brain, LogOut, Palette, Pencil, Sparkles, Volume2, VolumeX,
} from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { CUSTOM_THEMES } from "../constants/days";
import { TEMPO, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function MenuDrawer() {
  const {
    showMenu, setShowMenu, user, setUser,
    setShowProfile, setProfileDraft,
    setShowBrain, setShowStats, setShowCustomization, setShowSubscription,
    customTheme, brainTotalDays, brainCurrentColor,
    trialDaysLeft, voiceOn, toggleVoice, setTutorialStep,
  } = useFocus();

  if (!showMenu) return null;

  const itemCls = "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left hover:bg-white/5";

  return (
    <div
      className="fixed inset-0 z-[65] flex items-start justify-end p-4 sm:p-6 backdrop-blur-sm"
      style={{ background: "rgba(7,19,38,0.65)" }}
      onClick={() => setShowMenu(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-3xl p-3 w-full max-w-[260px] mt-16"
        style={{
          background: "linear-gradient(180deg, #0F2342 0%, #0B1D3A 100%)",
          border: `1px solid ${TEMPO.borderStrong}`,
          boxShadow: TEMPO_SHADOWS.cardHi,
        }}
      >
        {/* Profil */}
        <button
          onClick={() => { setShowMenu(false); setProfileDraft(user); setShowProfile(true); }}
          className="w-full flex items-center gap-3 p-3 rounded-2xl transition text-left hover:bg-white/5"
        >
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center font-medium shrink-0"
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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: TEMPO.text }}>
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[11px] truncate" style={{ color: TEMPO.textDim }}>{user.email}</p>
          </div>
        </button>

        <div className="h-px my-2" style={{ background: TEMPO.border }} />

        <button
          onClick={() => { setShowMenu(false); setShowBrain(true); }}
          className={itemCls}
        >
          <Brain size={15} style={{ color: brainCurrentColor }} />
          <span className="text-sm flex-1" style={{ color: TEMPO.text }}>Mon cerveau</span>
          {brainTotalDays > 0 && (
            <span
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: brainCurrentColor + "20", color: brainCurrentColor }}
            >
              {brainTotalDays}j
            </span>
          )}
        </button>

        <button onClick={() => { setShowMenu(false); setShowStats(true); }} className={itemCls}>
          <BarChart3 size={15} style={{ color: TEMPO.textDim }} />
          <span className="text-sm" style={{ color: TEMPO.text }}>Statistiques</span>
        </button>

        <button
          onClick={() => { setShowMenu(false); setProfileDraft(user); setShowProfile(true); }}
          className={itemCls}
        >
          <Pencil size={15} style={{ color: TEMPO.textDim }} />
          <span className="text-sm" style={{ color: TEMPO.text }}>Modifier le profil</span>
        </button>

        <button
          onClick={() => { setShowMenu(false); setShowCustomization(true); }}
          className={itemCls}
        >
          <Palette size={15} style={{ color: TEMPO.textDim }} />
          <span className="text-sm flex-1" style={{ color: TEMPO.text }}>Personnalisation</span>
          <div className="flex gap-0.5">
            {CUSTOM_THEMES[customTheme].colors.slice(0, 3).map((c, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </button>

        <button
          onClick={() => { setShowMenu(false); setShowSubscription(true); }}
          className={itemCls}
        >
          <Sparkles size={15} style={{ color: TEMPO.textDim }} />
          <span className="text-sm flex-1" style={{ color: TEMPO.text }}>Mon abonnement</span>
          {user.isSubscribed ? (
            <span
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: TEMPO.gold + "20", color: TEMPO.gold }}
            >
              Actif
            </span>
          ) : (
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{ color: TEMPO.textDim }}
            >
              {trialDaysLeft > 0 ? `${trialDaysLeft}j` : "Expiré"}
            </span>
          )}
        </button>

        <button onClick={toggleVoice} className={itemCls}>
          {voiceOn
            ? <Volume2 size={15} style={{ color: TEMPO.textDim }} />
            : <VolumeX size={15} style={{ color: TEMPO.textDim }} />}
          <span className="text-sm flex-1" style={{ color: TEMPO.text }}>Voix de notification</span>
          <span
            className="text-[10px] uppercase tracking-wider"
            style={{ color: voiceOn ? TEMPO.gold : TEMPO.textDim }}
          >
            {voiceOn ? "ON" : "OFF"}
          </span>
        </button>

        <button onClick={() => { setShowMenu(false); setTutorialStep(0); }} className={itemCls}>
          <Sparkles size={15} style={{ color: TEMPO.textDim }} />
          <span className="text-sm" style={{ color: TEMPO.text }}>Revoir le tutoriel</span>
        </button>

        <div className="h-px my-2" style={{ background: TEMPO.border }} />

        <button
          onClick={() => { setShowMenu(false); setUser(null); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition text-left"
          style={{ color: "#F87171cc" }}
        >
          <LogOut size={15} />
          <span className="text-sm">Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}
