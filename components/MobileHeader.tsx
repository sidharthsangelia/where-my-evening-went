import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getWeek, buildStatusMap } from "@/lib/week";
import { getWeeklyLoggedDates } from "@/actions/activity";
 
import WeekStrip from "./WeekStipe";
import { getUserStats } from "@/actions/stats";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return "Up late?";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function MobileHeader() {
  const { userId } = await auth();

  const [user, loggedDates, stats] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId ?? undefined },
      select: { name: true },
    }),
    getWeeklyLoggedDates(userId ?? ""),
    getUserStats(userId ?? ""),
  ]);

  const week = getWeek();
  const statusMap = buildStatusMap(week, loggedDates);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initials = user?.name ? getInitials(user.name) : "?";
  const thisWeekCount = loggedDates.size;

  return (
    <header className="bg-[#FDF8F5] pt-4 pb-3">
      {/* ── Greeting row ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 mb-5">
        <div>
          {/* <p className="text-xs font-semibold text-[#9a9185] tracking-wide uppercase">
            {getGreeting()}
          </p> */}
          <h1 className="text-[26px] font-bold text-[#2d2a24] tracking-tight leading-tight">
            Hey, <span className="capitalize">{firstName}</span> 👋
          </h1>
        </div>

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-[#621100] flex items-center justify-center shadow-md shadow-[#f5b21b]/30 shrink-0">
          <span className="text-white font-bold text-[15px] leading-none">
            {initials}
          </span>
        </div>
      </div>


      {/* ── Week strip ────────────────────── */}
      <WeekStrip week={week} statusMap={statusMap} />
    </header>
  );
}

function StatCard({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/60 border border-[#e8e4da] px-3 py-2.5 flex flex-col items-center gap-0.5">
      <span className="text-lg leading-none">{emoji}</span>
      <span className="text-xl font-bold text-[#2d2a24] leading-tight tabular-nums">
        {value}
      </span>
      <span className="text-[10px] font-medium text-[#9a9185] text-center leading-tight">
        {label}
      </span>
    </div>
  );
}