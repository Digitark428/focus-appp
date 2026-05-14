import { BarChart3, Home, Plus, User, CalendarDays } from "lucide-react";
import { useFocus } from "../context/FocusContext";

export default function BottomNav() {
  const {
    dayTheme,
    showStats, setShowStats,
    showProfile, setShowProfile,
    setProfileDraft, user,
    setShowAdd, setEditingTask, setIsFloatingForm,
    focusMode, activeMeditation, showBrain, showCustomization,
    showSubscription,
    selectedDay, setSelectedDay,
  } = useFocus();

  // Hide on non-main screens (full screen replacements)
  const isHidden = focusMode || activeMeditation || showBrain || showCustomization || showSubscription;
  if (isHidden) return null;

  const isStats = showStats;
  const isProfile = showProfile;
  const isDashboard = !showStats && !showProfile;

  // Dashboard sub-tab: planning vs timer ring — we treat selectedDay navigation
  // as "planning" (any day other than today) vs "home" (today).
  // For now: home = dashboard main, planning = week/task planner (same screen,
  // just scrolls to timeline — we toggle a context flag later if needed).

  const accent = dayTheme?.accent ?? "#A78BFA";

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
      active: false, // future screen
      onPress: () => {
        setShowStats(false);
        if (showProfile) setShowProfile(false);
        // Scroll-to-timeline or future PlanningScreen
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
        className="pointer-events-auto flex items-center gap-1 px-3 py-2.5 rounded-[28px] border border-white/[0.08]"
        style={{
          background: "rgba(14,14,14,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset",
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
                  background: `linear-gradient(135deg, ${accent}ee, ${accent}99)`,
                  boxShadow: `0 0 20px ${accent}55, 0 4px 12px rgba(0,0,0,0.4)`,
                  flexShrink: 0,
                }}
              >
                <Plus size={22} strokeWidth={2.5} className="text-white" />
              </button>
            );
          }

          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onPress}
              className="flex flex-col items-center justify-center gap-0.5 transition-all active:scale-90"
              style={{ flex: 1, minWidth: 48, paddingTop: 4, paddingBottom: 4 }}
            >
              <Icon
                size={20}
                strokeWidth={item.active ? 2 : 1.5}
                style={{
                  color: item.active ? accent : "rgba(255,255,255,0.35)",
                  transition: "color 0.2s, opacity 0.2s",
                }}
              />
              {item.label ? (
                <span
                  className="text-[9px] tracking-wide font-medium leading-none"
                  style={{
                    color: item.active ? accent : "rgba(255,255,255,0.28)",
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
                    background: accent,
                    opacity: 0.7,
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
