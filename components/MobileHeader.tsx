import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getWeek, buildStatusMap } from "@/lib/week";
import { getWeeklyLoggedDates } from "@/actions/activity";
import WeekStrip from "./WeekStipe";

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

  const [user, loggedDates] = await Promise.all([
    prisma.user.findFirst({
      where: { id: userId ?? undefined },
      select: { name: true },
    }),
    getWeeklyLoggedDates(userId ?? ""),
  ]);

  const week      = getWeek();
  const statusMap = buildStatusMap(week, loggedDates);
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const initials  = user?.name ? getInitials(user.name) : "?";

  return (
    <header className="bg-[var(--color-neutral)] pt-6 pb-0">
      {/* ── Greeting row ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 mb-6">
        <h1
          className="text-[28px] font-bold leading-tight tracking-tight"
          style={{
           
            color: "var(--color-neutral-900)",
          }}
        >
          Hey, <span className="capitalize">{firstName}</span>!
        </h1>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--color-primary)" }}
        >
          <span
            className="font-bold text-[13px] leading-none tracking-wider"
            style={{
              color: "var(--primary-foreground)",
            
            }}
          >
            {initials}
          </span>
        </div>
      </div>

      {/* ── Week strip ───────────────────────────────── */}
      <WeekStrip week={week} statusMap={statusMap} />
    </header>
  );
}