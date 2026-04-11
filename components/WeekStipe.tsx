"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { WeekDay, DayStatus } from "@/lib/week";

interface WeekStripProps {
  week: WeekDay[];
  statusMap: Record<string, DayStatus>;
}

export default function WeekStrip({ week, statusMap }: WeekStripProps) {
  const params = useParams();
  const activeDateParam = params?.date as string | undefined;

  return (
    <div className="flex justify-between w-full px-1">
      {week.map((day) => {
        const status   = statusMap[day.label] ?? "empty";
        const isActive = activeDateParam === day.dateParam || (!activeDateParam && day.isToday);

        return (
          <Link
            key={day.dateParam}
            href={`/dashboard/${day.dateParam}`}
            prefetch={true}
            className="flex flex-col items-center focus:outline-none"
          >
            <div
              className="flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200 rounded-[2rem]"
              style={isActive ? { background: "var(--color-primary)" } : {}}
            >
              {/* Day label */}
              <span
                className="text-[11px] font-semibold tracking-wide leading-none"
                style={{
                  fontFamily: "var(--font-body)",
                  color: isActive
                    ? "var(--primary-foreground)"
                    : "var(--color-neutral-600)",
                }}
              >
                {day.label}
              </span>

              {/* Status circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{
                  background:
                    status === "logged"
                      ? isActive
                        ? "white"
                        : "var(--color-primary)"
                      : status === "missed"
                        ? "var(--color-neutral-300)"
                        : isActive
                          ? "rgba(255,255,255,0.25)"
                          : "transparent",
                  border:
                    status === "empty" && !isActive
                      ? "2px solid var(--color-neutral-300)"
                      : "none",
                }}
              >
                {status === "logged" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 stroke-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      stroke: isActive
                        ? "var(--color-primary)"
                        : "white",
                    }}
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === "missed" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 stroke-2"
                    fill="none"
                    strokeLinecap="round"
                    style={{ stroke: "var(--color-neutral-500)" }}
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}