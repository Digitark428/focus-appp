import { FocusProvider, useFocus } from "./context/FocusContext";
import BrainScreen from "./screens/BrainScreen";
import CustomizationScreen from "./screens/CustomizationScreen";
import FocusModeScreen from "./screens/FocusModeScreen";
import MainScreen from "./screens/MainScreen";
import MeditationScreen from "./screens/MeditationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import StatsScreen from "./screens/StatsScreen";
import SubscriptionScreen from "./screens/SubscriptionScreen";

// Conditional router. Order matches the original priority:
//   1. No user → Signup
//   2. Subscription required (forced or requested) → Subscription
//   3. Focus mode → full-screen timer
//   4. Active meditation → meditation overlay
//   5. Stats / Profile / Brain / Customization → standalone screens
//   6. Otherwise → Home (MainScreen)
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

export default function FocusApp() {
  return (
    <FocusProvider>
      <Router />
    </FocusProvider>
  );
}
