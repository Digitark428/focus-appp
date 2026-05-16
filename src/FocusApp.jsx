import { useState } from "react";
import { FocusProvider, useFocus } from "./context/FocusContext";
import BrainScreen from "./screens/BrainScreen";
import CustomizationScreen from "./screens/CustomizationScreen";
import FocusModeScreen from "./screens/FocusModeScreen";
import MainScreen from "./screens/MainScreen";
import MeditationScreen from "./screens/MeditationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import SplashScreen from "./screens/SplashScreen";
import StatsScreen from "./screens/StatsScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";
import BottomNav from "./components/BottomNav";

// ───────────────────────────────────────────────────────────────
//  Router conditionnel.
//  Ordre : Splash → Signup → Subscription → Focus → Meditation
//          → Stats / Profile / Brain / Customization → Main.
//  La BottomNav n'apparaît qu'une fois l'utilisateur connecté
//  (et masquée pendant Splash / Signup / Subscription).
// ───────────────────────────────────────────────────────────────
function Router() {
  const {
    user, trialExpired, showSubscription, focusMode, activeMeditation,
    showStats, showProfile, showBrain, showCustomization,
  } = useFocus();

  if (!user) return <SignupScreen />;
  if (trialExpired || showSubscription) return <SubscriptionScreen />;
  if (focusMode) return <FocusModeScreen />;
  if (activeMeditation) return <MeditationScreen />;
  if (showStats) return <StatsScreen />;
  if (showProfile) return <ProfileScreen />;
  if (showBrain) return <BrainScreen />;
  if (showCustomization) return <CustomizationScreen />;
  return <MainScreen />;
}

// BottomNav masquée tant que l'utilisateur n'est pas connecté
// (splash, signup, subscription).
function BottomNavGate() {
  const { user, showSubscription, trialExpired } = useFocus();
  if (!user || showSubscription || trialExpired) return null;
  return <BottomNav />;
}

export default function FocusApp() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return (
    <FocusProvider>
      <Router />
      <BottomNavGate />
    </FocusProvider>
  );
}
