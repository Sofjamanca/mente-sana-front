import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { formatLocalDate, type WeekDaySlot } from "../utils/checkinWeek";

type CheckinWeekToggleProps = {
  days: WeekDaySlot[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  variant: "home" | "summary";
};

export function CheckinWeekToggle({
  days,
  selectedIndex,
  onSelect,
  variant,
}: CheckinWeekToggleProps) {
  const root = variant === "home" ? "checkin-week-toggle" : "ds-checkin-week-toggle";
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const todayStr = formatLocalDate(new Date());

  const selectedDay = days[selectedIndex];
  const isTriggerToday = selectedDay?.dateStr === todayStr;
  const triggerLabel =
    isTriggerToday ? "Hoy" : (selectedDay?.full ?? "Elegir día");

  useEffect(() => {
    if (!open) return;

    const onDocPointer = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`${root}${open ? " is-open" : ""}`}
    >
      <button
        type="button"
        className={`${root}__trigger`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`${root}__trigger-label${isTriggerToday ? ` ${root}__trigger-label--today` : ""}`}
        >
          {isTriggerToday ? (
            <>
              <CalendarDays
                size={18}
                strokeWidth={2}
                className={`${root}__trigger-cal`}
                aria-hidden
              />
              {triggerLabel}
            </>
          ) : (
            triggerLabel
          )}
        </span>
        <ChevronDown size={18} strokeWidth={2} className={`${root}__chevron`} aria-hidden />
      </button>

      {open ? (
        <div
          id={listId}
          className={`${root}__menu`}
          role="listbox"
          aria-label="Días de la semana"
        >
          {days.map((day, index) => {
            const isSel = index === selectedIndex;
            const isDayToday = day.dateStr === todayStr;
            const isFuture = day.dateStr > todayStr;
            return (
              <button
                key={day.dateStr}
                type="button"
                role="option"
                aria-selected={isSel}
                disabled={isFuture}
                title={isFuture ? "No podés registrar días futuros" : undefined}
                className={`${root}__option${isSel ? " is-active" : ""}${
                  isDayToday ? " is-today-option" : ""
                }${isFuture ? " is-future" : ""}`}
                onClick={() => {
                  if (isFuture) return;
                  onSelect(index);
                  setOpen(false);
                }}
              >
                {isDayToday ? (
                  <>
                    <span className={`${root}__option-main`}>Hoy</span>
                  </>
                ) : (
                  <span className={`${root}__option-main`}>{day.full}</span>
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
