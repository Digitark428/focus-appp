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
import AddTaskTypeChooser from "../components/modals/AddTaskTypeChooser";
import AddEditTaskModal from "../components/modals/AddEditTaskModal";
import CategoryPickerModal from "../components/modals/CategoryPickerModal";
import CustomTaskTemplateEditor from "../components/modals/CustomTaskTemplateEditor";
import EndTaskPopup from "../components/modals/EndTaskPopup";
import DaySummaryModal from "../components/modals/DaySummaryModal";
import ConflictDialog from "../components/modals/ConflictDialog";
import ResetDayConfirm from "../components/modals/ResetDayConfirm";
import { NoTasksWarning, PauseConfirm } from "../components/modals/PauseAndNoTasksDialogs";
import MenuDrawer from "../components/MenuDrawer";
import FloatingTaskDetailModal from "../components/modals/FloatingTaskDetailModal";

// Overlays
import {
  DragGhost, SwapToast, TaskTransition, ValidationBurst,
} from "../components/overlays/AnimatedOverlays";

// ============================================================
//  MainScreen — Dashboard Tempo.
//  Écran principal de l'application : aperçu du jour, timeline
//  des tâches, démarrage de la journée, modaux d'édition.
// ============================================================
export default function MainScreen() {
  const { isRunning } = useFocus();

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

      {/* ════════════════════════════════════════════════════════════
          Layout responsive :
          • < lg (téléphone / tablette portrait) → colonne unique max-w-md,
            comportement actuel strictement préservé.
          • ≥ lg (desktop) → grille 3 colonnes :
              ┌─────────────┬──────────────────┬─────────────┐
              │ Header      │  Timer ring      │ Timeline    │
              │ Week        │  Ambient picker  │ Floating    │
              │ Goal        │  Start day btn   │ tasks       │
              └─────────────┴──────────────────┴─────────────┘
          Aucun composant n'est dupliqué : ils sont juste réorganisés
          via grid sans toucher à leur logique interne.
      ════════════════════════════════════════════════════════════ */}
      <div
        className="
          relative z-10 mx-auto pt-10 lg:pt-14
          px-6 max-w-md
          lg:px-10 lg:max-w-[1280px]
        "
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 9rem)" }}
      >
        {/* Bandeaux globaux (toujours pleine largeur) */}
        <MainHeader />
        <TrialBanner />
        <ConflictsBanner />
        <DemoBanner />

        {/* Grid desktop / stack mobile */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* ── Colonne gauche (desktop) ───────────────────────── */}
          <div className="lg:col-span-3 lg:sticky lg:top-6 lg:self-start lg:space-y-6">
            <WeekSelector />
            <GoalProgress />
            <AmbientSoundPicker desktopSlot />
          </div>

          {/* ── Colonne centrale (desktop) ─────────────────────── */}
          <div className="lg:col-span-5 lg:flex lg:flex-col lg:items-center">
            {/* Mobile : musique sous le timer pendant la journée (préservé tel quel).
                Desktop : musique migrée dans la colonne gauche → on masque ici. */}
            {isRunning && (
              <div className="lg:hidden w-full">
                <AmbientSoundPicker />
              </div>
            )}
            <MainTimerRing />
            <StartDayButton />
          </div>

          {/* ── Colonne droite (desktop) ───────────────────────── */}
          <div className="lg:col-span-4">
            <Timeline />
            <FloatingTasksSection />
          </div>
        </div>

        {/* Modals & dialogs */}
        <AddTaskTypeChooser />
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
        <FloatingTaskDetailModal />

        {/* Animated overlays */}
        <ValidationBurst />
        <TaskTransition />
        <DragGhost />
        <SwapToast />
      </div>
    </div>
  );
}
