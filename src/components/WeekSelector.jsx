import { useFocus } from "../context/FocusContext";
import { todayIndex } from "../utils/time";

export default function WeekSelector() {
  const { activeDayThemes, selectedDay, setSelectedDay, weekTasks, dayTheme } = useFocus();
  const today = todayIndex();

  return (
    <div data-tour="week" className="mb-6 -mx-6 px-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Semaine</p>
        <div className="flex items-center gap-3">
          {selectedDay !== today && (
            <button
              onClick={() => setSelectedDay(today)}
              className="text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition flex items-center gap-1"
            >
              <span className="w-1 h-1 rounded-full" style={{ background: activeDayThemes[today].accent }} />
              Aujourd'hui
            </button>
          )}
          <p className="text-xs text-white/40 italic">{dayTheme.mood}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory no-scrollbar">
        {activeDayThemes.map((day, idx) => {
          const isSelected = selectedDay === idx;
          const isToday = idx === today;
          const count = (weekTasks[idx] || []).length;
          const dots = Math.min(count, 5);

          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`shrink-0 snap-start flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all ${
                isSelected ? "scale-105" : "hover:bg-white/5"
              }`}
              style={{
                background: isSelected ? day.accent + "20" : "rgba(255,255,255,0.03)",
                borderColor: isSelected ? day.accent + "60" : "rgba(255,255,255,0.08)",
                boxShadow: isSelected ? `0 0 20px ${day.accent}40` : "none",
              }}
            >
              <span
                className="text-[10px] uppercase tracking-widest font-medium mb-2"
                style={{ color: isSelected ? day.accent : "rgba(255,255,255,0.5)" }}
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
                          background: isSelected ? day.accent : "rgba(255,255,255,0.5)",
                          opacity: isSelected ? 1 : 0.7,
                        }}
                      />
                    ))}
                    {count > 5 && (
                      <span
                        className="text-[8px] ml-0.5"
                        style={{ color: isSelected ? day.accent : "rgba(255,255,255,0.5)" }}
                      >
                        +
                      </span>
                    )}
                  </>
                )}
              </div>
              {isToday && <span className="mt-1.5 w-1 h-1 rounded-full" style={{ background: day.accent }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
