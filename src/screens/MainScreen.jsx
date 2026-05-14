import { useAmbientAudio } from "../hooks/useAmbientAudio";
import { useCustomAudio } from "../hooks/useCustomAudio";
import { useFocus } from "../context/FocusContext";

// Layout & banners
import SolarAmbianceLayer from "../components/SolarAmbianceLayer";
import MainHeader from "../components/MainHeader";
import { TrialBanner, BrainBanner, ConflictsBanner } from "../components/Banners";
import { CurrentTaskTopBar, DemoBanner } from "../components/SmallBanners";
import WeekSelector from "../components/WeekSelector";
import GoalProgress from "../components/GoalProgress";
import AmbientSoundPicker from "../components/AmbientSoundPicker";

// Day flow
import MainTimerRing from "../components/MainTimerRing";
import Timeline from "../components/Timeline";
import FloatingTasksSection from "../components/FloatingTasksSection";
import StartDayButton from "../components/StartDayButton";

// Modals
import AddEditTaskModal from "../components/modals/AddEditTaskModal";
import CategoryPickerModal from "../components/modals/CategoryPickerModal";
import CustomTaskTemplateEditor from "../components/modals/CustomTaskTemplateEditor";
import EndTaskPopup from "../components/modals/EndTaskPopup";
import DaySummaryModal from "../components/modals/DaySummaryModal";
import ConflictDialog from "../components/modals/ConflictDialog";
import ResetDayConfirm from "../components/modals/ResetDayConfirm";
import { NoTasksWarning, PauseConfirm } from "../components/modals/PauseAndNoTasksDialogs";
import MenuDrawer from "../components/MenuDrawer";

// Overlays
import TutorialOverlay from "../components/overlays/TutorialOverlay";
import {
  BrainNewNodeBurst, DragGhost, SwapToast, TaskTransition, ValidationBurst,
} from "../components/overlays/AnimatedOverlays";

export default function MainScreen() {
  const { activeAmbient, ambientVolume, activeCustomTrack, customTracks, isRunning } = useFocus();

  // Audio hooks must be called inside the provider (i.e. inside MainScreen).
  useAmbientAudio(activeAmbient, ambientVolume);
  useCustomAudio(activeCustomTrack, customTracks, ambientVolume);

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <SolarAmbianceLayer />
      <CurrentTaskTopBar />

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-8">
        <MainHeader />
        <TrialBanner />
        <BrainBanner />
        <ConflictsBanner />
        <WeekSelector />
        <GoalProgress />
        {isRunning && <AmbientSoundPicker />}
        <DemoBanner />
        <MainTimerRing />
        <Timeline />
        <FloatingTasksSection />
        <StartDayButton />

        {/* Modals & dialogs */}
        <AddEditTaskModal />
        <CategoryPickerModal />
        <CustomTaskTemplateEditor />
        <EndTaskPopup />
        <DaySummaryModal />
        <ConflictDialog />
        <ResetDayConfirm />
        <PauseConfirm />
        <NoTasksWarning />
        <MenuDrawer />

        {/* Animated overlays */}
        <TutorialOverlay />
        <ValidationBurst />
        <TaskTransition />
        <DragGhost />
        <SwapToast />
        <BrainNewNodeBurst />
      </div>
    </div>
  );
}
