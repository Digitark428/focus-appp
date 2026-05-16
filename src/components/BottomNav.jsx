import { BarChart3, Home, Plus, User, CalendarDays } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TEMPO, TEMPO_GRADIENTS, TEMPO_SHADOWS } from "../utils/tempoTheme";

export default function BottomNav() {
  const {
    showStats, setShowStats,
    showProfile, setShowProfile,
    setProfileDraft, user,
    setShowAdd, setEditingTask, setIsFloatingForm,
    focusMode, activeMeditation, showBrain, showCustomization,
    showSubscription,
  } = useFocus();

  // Hide on non-main screens (full screen replacements)
  const isHidden = focusMode || activeMeditation || showBrain || showCustomization || showSubscription;
  if (isHidden) return null;

  const isStats = showStats;
  const isProfile = showProfile;
  const isDashboard = !showStats && !showProfile;

  const navItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Accueil",
      active: isDashboard && !isStats && !isProfile,
      onPress: () => {
        setShowStats(false);
        if (showProfile) setShowProfile(false);
      },
    },
    {
      id: "planning",
      icon: CalendarDays,
      label: "Planning",
      active: false,
      onPress: () => {
        setShowStats(false);
        if (showProfile) setShowProfile(false);
      },
    },
    { id: "add", icon: Plus, label: "", active: false, isCTA: true },
    {
      id: "stats",
      icon: BarChart3,
      label: "Stats",
      active: isStats,
      onPress: () => {
        setShowStats(true);
        if (showProfile) setShowProfile(false);
      },
    },
    {
      id: "profile",
      icon: User,
      label: "Profil",
      active: isProfile,
      onPress: () => {
        setProfileDraft(user);
        setShowProfile(true);
        setShowStats(false);
      },
    },
  ];

  const handleAdd = () => {
    setEditingTask(null);
    setIsFloatingForm(false);
    setShowStats(false);
    if (showProfile) setShowProfile(false);
    setShowAdd(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-5 px-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-1 px-3 py-2.5 rounded-[28px]"
        style={{
          background: "rgba(7,19,38,0.78)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: `1px solid ${TEMPO.border}`,
          boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          maxWidth: 340,
          width: "100%",
        }}
      >
        {navItems.map((item) => {
          if (item.isCTA) {
            return (
              <button
                key={item.id}
                onClick={handleAdd}
                className="relative flex items-center justify-center rounded-full transition-all active:scale-90 mx-1"
                style={{
                  width: 52,
                  height: 52,
                  background: TEMPO_GRADIENTS.gold,
                  boxShadow: TEMPO_SHADOWS.gold,
                  flexShrink: 0,
                }}
              >
                <Plus size={22} strokeWidth={2.5} style={{ color: "#1A1206" }} />
              </button>
            );
          }

          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onPress}
              className="relative flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90"
              style={{ flex: 1, minWidth: 48, paddingTop: 4, paddingBottom: 4 }}
            >
              <Icon
                size={20}
                strokeWidth={item.active ? 2 : 1.5}
                style={{
                  color: item.active ? TEMPO.gold : TEMPO.textDim + "80",
                  transition: "color 0.2s",
                }}
              />
              {item.label ? (
                <span
                  className="text-[9px] tracking-wide font-medium leading-none"
                  style={{
                    color: item.active ? TEMPO.gold : TEMPO.textDim + "70",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </span>
              ) : null}
              {item.active && (
                <span
                  className="absolute bottom-1.5 rounded-full"
                  style={{
                    width: 3,
                    height: 3,
                    background: TEMPO.gold,
                    boxShadow: `0 0 6px ${TEMPO.gold}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
