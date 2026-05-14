import { Plus, Sparkles } from "lucide-react";
import { useFocus } from "../context/FocusContext";
import { TASK_CATEGORIES } from "../constants/tasks";
import PauseTaskCard from "./PauseTaskCard";
import TaskCard from "./TaskCard";

export default function Timeline() {
  const { sortedTasks, dayTheme, openAdd } = useFocus();

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">
          Timeline · {dayTheme.name}
        </h3>
        <button
          onClick={openAdd}
          data-tour="addBtn"
          className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition hover:scale-[1.05] active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${dayTheme.accent}50 0%, ${dayTheme.accent}25 100%)`,
            border: `1.5px solid ${dayTheme.accent}80`,
            boxShadow: `0 4px 24px ${dayTheme.accent}40, inset 0 1px 0 rgba(255,255,255,0.20)`,
            color: "white",
          }}
        >
          <span
            className="absolute inset-x-0 top-0 h-1/2 rounded-full pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)" }}
          />
          <Plus size={15} strokeWidth={2.8} className="relative z-10" />
          <span className="relative z-10 tracking-wide">Ajouter</span>
        </button>
      </div>

      <div data-tour="timeline">
        {sortedTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: dayTheme.accent + "15", border: `1px solid ${dayTheme.accent}30` }}
            >
              <Sparkles size={18} style={{ color: dayTheme.accent }} />
            </div>
            <p className="text-base font-light mb-1">
              Programmez votre {dayTheme.name.toLowerCase()}
            </p>
            <p className="text-xs text-white/40 mb-5">
              Ajoutez votre première tâche pour démarrer
            </p>
            <button
              onClick={openAdd}
              className="text-xs px-5 py-2.5 rounded-full transition inline-flex items-center gap-1.5 font-medium"
              style={{
                background: dayTheme.accent + "20",
                border: `1px solid ${dayTheme.accent}50`,
                color: dayTheme.accent,
              }}
            >
              <Plus size={13} /> Ajouter une tâche
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Début de la journée */}
            <div className="flex items-center gap-3 py-1 mb-1">
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className="w-2 h-2 rounded-full border-2"
                  style={{ borderColor: dayTheme.accent, background: dayTheme.accent + "40" }}
                />
                <div
                  className="w-px flex-1 min-h-[10px]"
                  style={{ background: `linear-gradient(180deg, ${dayTheme.accent}60 0%, transparent 100%)` }}
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Début de la journée</p>
                <p
                  className="text-xs font-mono tabular-nums font-medium mt-0.5"
                  style={{ color: dayTheme.accent }}
                >
                  {sortedTasks[0].start}
                </p>
              </div>
            </div>

            {sortedTasks.map((task) => {
              const cat = task.category ? TASK_CATEGORIES.find((c) => c.id === task.category) : null;
              if (cat?.isPause) return <PauseTaskCard key={task.id} task={task} />;
              return <TaskCard key={task.id} task={task} />;
            })}

            {/* Fin de la journée */}
            <div className="flex items-center gap-3 py-1 mt-1">
              <div className="flex flex-col items-center gap-0.5">
                <div
                  className="w-px flex-1 min-h-[10px]"
                  style={{ background: `linear-gradient(180deg, transparent 0%, ${dayTheme.accent}60 100%)` }}
                />
                <div
                  className="w-2 h-2 rounded-full border-2"
                  style={{ borderColor: dayTheme.accent, background: dayTheme.accent + "40" }}
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Fin de la journée</p>
                <p
                  className="text-xs font-mono tabular-nums font-medium mt-0.5"
                  style={{ color: dayTheme.accent }}
                >
                  {sortedTasks[sortedTasks.length - 1].end}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
