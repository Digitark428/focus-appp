import { useEffect, useState } from "react";
import { TUTORIAL_STEPS } from "../constants/tutorial";

// Tracks the bounding rect of the currently-spotlighted tutorial target.
// Returns null when no spotlight is active (centered modal step).
export function useTutorialTarget(tutorialStep) {
  const [tutorialRect, setTutorialRect] = useState(null);

  useEffect(() => {
    if (tutorialStep === null) {
      setTutorialRect(null);
      return;
    }
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step?.target) {
      setTutorialRect(null);
      return;
    }

    const measure = () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) {
        setTutorialRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const isVisible = r.top >= 0 && r.bottom <= viewportH;
      if (!isVisible) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Re-measure after the scroll completes.
        setTimeout(() => {
          const r2 = el.getBoundingClientRect();
          setTutorialRect({ top: r2.top, left: r2.left, width: r2.width, height: r2.height });
        }, 400);
      } else {
        setTutorialRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [tutorialStep]);

  return tutorialRect;
}
