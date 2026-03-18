import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getWeek, buildStatusMap } from "@/lib/week";
import { getWeeklyLoggedDates } from "@/actions/activity";

export default async function MobileHeader() {
  const { userId } = await auth();

  const [user, loggedDates] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId ?? undefined },
      select: { name: true },
    }),
    getWeeklyLoggedDates(userId ?? ""),
  ]);

  const week = getWeek();
  const statusMap = buildStatusMap(week, loggedDates);

  return (
    <header className=" bg-[#f4f1e8]">
      <h1 className="text-3xl font-semibold mb-4 pt-3 pl-3">
        Hey, {user?.name ?? "there"}
      </h1>

      <div className="flex">
        {week.map((day) => {
          const status = statusMap[day.label] ?? "empty";
          const isToday = day.isToday;

          return (
            <div key={day.label} className="flex flex-col items-center">
              <div
                className={`flex flex-col items-center gap-1 px-2 py-2 transition-all ${
                  isToday ? "bg-[#f5b21b] rounded-full" : ""
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday ? "text-white" : "text-[#4a463f]"
                  }`}
                >
                  {day.label}
                </span>

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    status === "logged"
                      ? isToday
                        ? "bg-white"
                        : "bg-[#f5b21b]"
                      : status === "missed"
                        ? "bg-[#d9d6cd]"
                        : isToday
                          ? "bg-white/30"
                          : "border-2 border-[#d9d6cd]"
                  }`}
                >
                  {status === "logged" && (
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-4 h-4 stroke-2 ${
                        isToday ? "stroke-[#f5b21b]" : "stroke-white"
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
                      className="w-4 h-4 stroke-[#5a544a] stroke-2"
                      fill="none"
                      strokeLinecap="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </header>
  );
}