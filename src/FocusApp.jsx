import { useState } from "react";
import { FocusProvider, useFocus } from "./context/FocusContext";
import { useAmbientAudio } from "./hooks/useAmbientAudio";
import { useCustomAudio } from "./hooks/useCustomAudio";
import { useNotifications } from "./hooks/useNotifications";
import CustomizationScreen from "./screens/CustomizationScreen";
import FocusModeScreen from "./screens/FocusModeScreen";
import MainScreen from "./screens/MainScreen";
import MeditationScreen from "./screens/MeditationScreen";
import PlanningScreen from "./screens/PlanningScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import SplashScreen from "./screens/SplashScreen";
import StatsScreen from "./screens/StatsScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import BottomNav from "./components/BottomNav";
import ErrorBoundary from "./components/ErrorBoundary";

// Mounted once at root: keeps custom music playing across screen changes
// and re-arms scheduled notifications when tasks change.
function GlobalAudioController() {
  const { activeAmbient, ambientVolume, activeCustomTrack, customTracks } = useFocus();
  useAmbientAudio(activeAmbient, ambientVolume);
  useCustomAudio(activeCustomTrack, customTracks, ambientVolume);
  useNotifications();
  return null;
}

// ───────────────────────────────────────────────────────────────
//  Router conditionnel.
//
//  Ordre : Splash → (hydratation Supabase) → (si non connecté)
//  SignupScreen → Subscription → Focus → Meditation → Stats /
//  Planning / Profile / Customization → Main.
// ───────────────────────────────────────────────────────────────
function Router() {
  const {
    user, authReady, trialExpired, showSubscription, focusMode, activeMeditation,
    showStats, showPlanning, showProfile, showCustomization,
  } = useFocus();

  // Tant que la session n'est pas hydratée, on garde le splash visuel.
  if (!authReady) return <SplashScreen onDone={() => {}} />;

  if (!user) return <SignupScreen />;
  if (trialExpired || showSubscription) return <SubscriptionScreen />;
  if (focusMode) return <FocusModeScreen />;
  if (activeMeditation) return <MeditationScreen />;
  if (showStats) return <StatsScreen />;
  if (showPlanning) return <PlanningScreen />;
  if (showProfile) return <ProfileScreen />;
  if (showCustomization) return <CustomizationScreen />;
  return <MainScreen />;
}

// BottomNav masquée tant que l'utilisateur n'est pas connecté
// (splash, signup, subscription).
function BottomNavGate() {
  const { user, authReady, showSubscription, trialExpired } = useFocus();
  if (!authReady || !user || showSubscription || trialExpired) return null;
  return <BottomNav />;
}

export default function FocusApp() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return (
    <ErrorBoundary>
      <FocusProvider>
        <GlobalAudioController />
        <Router />
        <BottomNavGate />
      </FocusProvider>
    </ErrorBoundary>
  );
}
