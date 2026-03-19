export type DayStatus = "logged" | "missed" | "empty";

export type WeekDay = {
  label: string;      // "Sun", "Mon", etc.
  fullDate: string;   // e.g. "Thu Jan 23 2025"
  dateParam: string;  // "2025-01-23" — used in URL, timezone-safe
  date: Date;
  isToday: boolean;
  isPast: boolean;
};

/**
 * Format a local Date as YYYY-MM-DD without UTC conversion.
 * Using toISOString() would shift the date in negative-offset timezones.
 */
export function toDateParam(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getWeek(): WeekDay[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay()); // Sunday

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: d.toDateString(),
      dateParam: toDateParam(d),
      date: d,
      isToday: d.toDateString() === today.toDateString(),
      isPast: d < today && d.toDateString() !== today.toDateString(),
    };
  });
}

export function buildStatusMap(
  week: WeekDay[],
  loggedDates: Set<string>
): Record<string, DayStatus> {
  const map: Record<string, DayStatus> = {};

  for (const day of week) {
    if (loggedDates.has(day.date.toDateString())) {
      map[day.label] = "logged";
    } else if (day.isPast) {
      map[day.label] = "missed";
    } else {
      map[day.label] = "empty";
    }
  }

  return map;
}

/** Parse a YYYY-MM-DD dateParam back to a local Date */
export function parseDateParam(dateParam: string): Date {
  const [y, m, d] = dateParam.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Today's dateParam string */
export function todayParam(): string {
  return toDateParam(new Date());
}