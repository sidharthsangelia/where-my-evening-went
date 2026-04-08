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
        const status = statusMap[day.label] ?? "empty";
        const isToday = day.isToday;
        const isActive =
          activeDateParam === day.dateParam ||
          (!activeDateParam && isToday);

        return (
          <Link
            key={day.dateParam}
            href={`/dashboard/${day.dateParam}`}
            prefetch={true}
            className="flex flex-col items-center focus:outline-none"
          >
            {/* Pill — sized to content, not to the cell */}
            <div
              className={`
                flex flex-col items-center gap-1 px-2 py-2
                transition-all duration-200
                ${isActive ? "bg-[#621100] rounded-4xl" : ""}
              `}
            >
              {/* Day label */}
              <span
                className={`text-[11px] font-semibold tracking-wide leading-none ${
                  isActive ? "text-white" : "text-[#9a9185]"
                }`}
              >
                {day.label}
              </span>

              {/* Status circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-colors duration-200
                  ${
                    status === "logged"
                      ? isActive
                        ? "bg-white"
                        : "bg-[#f5b21b]"
                      : status === "missed"
                        ? "bg-[#e0ddd5]"
                        : isActive
                          ? "bg-white/30"
                          : "border-2 border-[#e0ddd5]"
                  }
                `}
              >
                {status === "logged" && (
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3.5 h-3.5 stroke-2 ${
                      isActive ? "stroke-[#621100]" : "stroke-white"
                    }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === "missed" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 stroke-[#b0a89e] stroke-2"
                    fill="none"
                    strokeLinecap="round"
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