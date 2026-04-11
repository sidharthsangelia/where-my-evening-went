import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getWeek, buildStatusMap } from "@/lib/week";
import { getWeeklyLoggedDates } from "@/actions/activity";
import WeekStrip from "./WeekStipe";
import UserMenu from "@/components/UserMenu"; // 👈 new

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

  return (
    <header className="bg-[var(--color-neutral)] pt-6 pb-0">
      {/* ── Greeting row ─────────────────────────────── */}
      <div className="flex items-center justify-between px-4 mb-6">
        <h1
          className="text-[28px] font-bold leading-tight tracking-tight"
          style={{ color: "var(--color-neutral-900)" }}
        >
          Hey, <span className="capitalize">{firstName}</span>!
        </h1>

        {/* Clerk avatar – handles profile, sign-out, and custom pages */}
        <UserMenu />
      </div>

      {/* ── Week strip ───────────────────────────────── */}
      <WeekStrip week={week} statusMap={statusMap} />
    </header>
  );
}