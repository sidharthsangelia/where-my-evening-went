import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getWeek, buildStatusMap } from "@/lib/week";
import { getWeeklyLoggedDates } from "@/actions/activity";
import WeekStrip from "./WeekStipe";
 

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
 <header className="bg-[#f4f1e8] pb-2 pt-3">
  <h1 className="text-3xl font-semibold mb-4 px-3">
    Hey, {user?.name?.split(" ")[0] ?? "there"}
  </h1>
  <WeekStrip week={week} statusMap={statusMap} />
</header>
  );
}