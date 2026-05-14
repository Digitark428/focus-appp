import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useFocus } from "../../context/FocusContext";
import { useTutorialTarget } from "../../hooks/useTutorialTarget";
import { TUTORIAL_STEPS } from "../../constants/tutorial";

export default function TutorialOverlay() {
  const { tutorialStep, setTutorialStep, dayTheme } = useFocus();
  const tutorialRect = useTutorialTarget(tutorialStep);

  if (tutorialStep === null || !TUTORIAL_STEPS[tutorialStep]) return null;

  const step = TUTORIAL_STEPS[tutorialStep];
  const isFirst = tutorialStep === 0;
  const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;
  const hasTarget = step.target && tutorialRect;
  const padding = 8;

  // Bubble position relative to target (or centered).
  let bubbleStyle = {};
  let arrowPos = null;
  if (hasTarget) {
    const viewportH = window.innerHeight;
    const targetCenterY = tutorialRect.top + tutorialRect.height / 2;
    const targetIsInUpperHalf = targetCenterY < viewportH / 2;
    if (targetIsInUpperHalf) {
      bubbleStyle = {
        top: `${tutorialRect.top + tutorialRect.height + padding + 16}px`,
        left: "50%",
        transform: "translateX(-50%)",
      };
      arrowPos = "top";
    } else {
      bubbleStyle = {
        bottom: `${viewportH - tutorialRect.top + padding + 16}px`,
        left: "50%",
        transform: "translateX(-50%)",
      };
      arrowPos = "bottom";
    }
  } else {
    bubbleStyle = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }

  return (
    <div className="fixed inset-0 z-[100]" style={{ pointerEvents: "auto" }}>
      {hasTarget ? (
        <div
          className="fixed pointer-events-none transition-all duration-300"
          style={{
            top: `${tutorialRect.top - padding}px`,
            left: `${tutorialRect.left - padding}px`,
            width: `${tutorialRect.width + padding * 2}px`,
            height: `${tutorialRect.height + padding * 2}px`,
            borderRadius: "16px",
            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.85), inset 0 0 0 2px ${dayTheme.accent}, 0 0 30px ${dayTheme.accent}80`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      )}

      <div
        className="fixed max-w-[340px] w-[calc(100%-32px)] rounded-3xl p-5 border z-[110]"
        style={{
          ...bubbleStyle,
          background: "linear-gradient(135deg, rgba(20,20,25,0.97) 0%, rgba(15,15,20,0.97) 100%)",
          borderColor: dayTheme.accent + "50",
          boxShadow: `0 20px 80px ${dayTheme.accent}30, 0 0 60px ${dayTheme.accent}15`,
        }}
      >
        {arrowPos === "top" && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l"
            style={{ background: "rgba(20,20,25,0.97)", borderColor: dayTheme.accent + "50" }}
          />
        )}
        {arrowPos === "bottom" && (
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-b border-r"
            style={{ background: "rgba(20,20,25,0.97)", borderColor: dayTheme.accent + "50" }}
          />
        )}

        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} style={{ color: dayTheme.accent }} />
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: dayTheme.accent }}>
              Tutoriel · {tutorialStep + 1}/{TUTORIAL_STEPS.length}
            </p>
          </div>
          <button
            onClick={() => setTutorialStep(null)}
            className="text-[10px] text-white/40 hover:text-white/70 transition uppercase tracking-wider"
          >
            Passer
          </button>
        </div>

        <h3 className="text-lg font-light mb-2 leading-tight">{step.title}</h3>
        <p className="text-xs text-white/70 leading-relaxed mb-4">{step.body}</p>

        <div className="flex items-center justify-center gap-1.5 mb-4">
          {TUTORIAL_STEPS.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === tutorialStep ? "16px" : "5px",
                height: "5px",
                background: i === tutorialStep ? dayTheme.accent : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={() => setTutorialStep(tutorialStep - 1)}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs text-white/70 hover:bg-white/5 transition flex items-center justify-center gap-1"
            >
              <ChevronLeft size={12} /> Précédent
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) setTutorialStep(null);
              else setTutorialStep(tutorialStep + 1);
            }}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium transition hover:scale-[1.02] flex items-center justify-center gap-1"
            style={{ background: dayTheme.accent, color: "#000" }}
          >
            {isLast ? "C'est parti ✨" : "Suivant"}
            {!isLast && <ChevronRight size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}
