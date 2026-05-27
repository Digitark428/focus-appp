import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { todayIndex } from "../utils/time";
import { TEMPO } from "../utils/tempoTheme";

export default function WeekSelector() {
  const { activeDayThemes, selectedDay, setSelectedDay, weekTasks, dayTheme } = useFocus();
  const today = todayIndex();
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Détecte si un scroll horizontal est encore possible vers la droite
  // pour afficher un indicateur visuel discret (desktop + mobile).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
      setCanScrollRight(remaining > 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [activeDayThemes.length]);

  return (
    <div data-tour="week" className="mb-6 -mx-6 px-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: TEMPO.textDim }}>
          Semaine
        </p>
        <div className="flex items-center gap-3">
          {selectedDay !== today && (
            <button
              onClick={() => setSelectedDay(today)}
              className="text-[10px] uppercase tracking-[0.15em] transition flex items-center gap-1"
              style={{ color: TEMPO.textDim }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: TEMPO.gold, boxShadow: `0 0 4px ${TEMPO.gold}` }}
              />
              Aujourd'hui
            </button>
          )}
          <p className="text-xs italic" style={{ color: TEMPO.gold + "aa" }}>{dayTheme.mood}</p>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {activeDayThemes.map((day, idx) => {
            const isSelected = selectedDay === idx;
            const isToday = idx === today;
            const count = (weekTasks[idx] || []).length;
            const dots = Math.min(count, 5);
            const accent = day.accent;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`shrink-0 snap-start flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all ${
                  isSelected ? "scale-105" : ""
                }`}
                style={{
                  background: isSelected
                    ? `linear-gradient(180deg, ${accent}28 0%, ${accent}10 100%)`
                    : "rgba(255,255,255,0.025)",
                  borderColor: isSelected ? accent + "70" : TEMPO.border,
                  boxShadow: isSelected
                    ? `0 0 20px ${accent}40, inset 0 1px 0 ${accent}30`
                    : "none",
                }}
              >
                <span
                  className="text-[10px] uppercase tracking-widest font-medium mb-2"
                  style={{ color: isSelected ? accent : TEMPO.textDim }}
                >
                  {day.short}
                </span>
                <div className="flex items-center gap-0.5 h-5">
                  {count === 0 ? (
                    <div className="w-3 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                  ) : (
                    <>
                      {[...Array(dots)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full"
                          style={{
                            background: isSelected ? accent : TEMPO.textDim,
                            opacity: isSelected ? 1 : 0.6,
                          }}
                        />
                      ))}
                      {count > 5 && (
                        <span
                          className="text-[8px] ml-0.5"
                          style={{ color: isSelected ? accent : TEMPO.textDim }}
                        >
                          +
                        </span>
                      )}
                    </>
                  )}
                </div>
                {isToday && (
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 4px ${accent}` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Indicateur de scroll horizontal — fade + flèche dorée discrète.
            Visible uniquement quand il reste du contenu à droite. */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-[calc(100%-8px)] w-14 flex items-center justify-end pr-1 transition-opacity duration-300"
          style={{
            opacity: canScrollRight ? 1 : 0,
            background: `linear-gradient(90deg, transparent 0%, ${TEMPO.bg}cc 70%, ${TEMPO.bg} 100%)`,
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full"
            style={{
              background: TEMPO.gold + "18",
              border: `1px solid ${TEMPO.gold}50`,
              boxShadow: `0 0 10px ${TEMPO.gold}40`,
              animation: "week-scroll-hint 2.2s ease-in-out infinite",
            }}
          >
            <ChevronRight size={12} style={{ color: TEMPO.gold }} />
          </span>
        </div>
      </div>
    </div>
  );
}
