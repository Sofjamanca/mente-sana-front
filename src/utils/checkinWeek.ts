export const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Lunes = 0 … Domingo = 6 (alineado con getDay() de JS tras desplazar) */
export const getMondayBasedDayIndex = (d: Date) => (d.getDay() + 6) % 7;

export const parseLocalDate = (dateStr: string): Date => {
  const [y, m, day] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, day);
};

export type WeekDaySlot = {
  label: string;
  full: string;
  dateStr: string;
};

const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;
const WEEK_FULL = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

/** Semana que contiene `anchor` (lun–dom). */
export const buildWeekDaysForAnchor = (anchor: Date): WeekDaySlot[] => {
  const idx = getMondayBasedDayIndex(anchor);
  const monday = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - idx);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: WEEK_LABELS[i],
      full: WEEK_FULL[i],
      dateStr: formatLocalDate(d),
    };
  });
};
