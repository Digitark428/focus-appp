import { useAmbientAudio } from "../hooks/useAmbientAudio";
import { useCustomAudio } from "../hooks/useCustomAudio";
import { useFocus } from "../context/FocusContext";
import { TEMPO_GRADIENTS } from "../utils/tempoTheme";

// Layout & banners
import MainHeader from "../components/MainHeader";
import { TrialBanner, ConflictsBanner } from "../components/Banners";
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

// ============================================================
//  MainScreen — Dashboard Tempo.
//  Le SolarAmbianceLayer (soleil dynamique) et le BrainBanner
//  (cerveau dans le dashboard) ont été retirés du flux visuel
//  selon la nouvelle direction artistique. Le BrainScreen reste
//  accessible via le menu / paramètres.
// ============================================================
export default function MainScreen() {
  const { activeAmbient, ambientVolume, activeCustomTrack, customTracks, isRunning } = useFocus();

  useAmbientAudio(activeAmbient, ambientVolume);
  useCustomAudio(activeCustomTrack, customTracks, ambientVolume);

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: TEMPO_GRADIENTS.bgRadial }}
    >
      {/* Texture grain premium (overlay subtil) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <CurrentTaskTopBar />

      <div className="relative z-10 max-w-md mx-auto px-6 pt-14 pb-32">
        <MainHeader />
        <TrialBanner />
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
