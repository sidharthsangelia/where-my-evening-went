export type DayStatus = "logged" | "missed" | "empty";

export type WeekDay = {
  label: string;
  fullDate: string;
  date: Date;
  isToday: boolean;
  isPast: boolean;
};

export function getWeek(): WeekDay[] {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: d.toDateString(),
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