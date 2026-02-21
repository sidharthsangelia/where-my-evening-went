import prisma from "@/lib/prisma";

export function getWeekRange(): { weekStart: Date; weekEnd: Date } {
  const today = new Date();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

export async function getWeeklyLoggedDates(userId: string): Promise<Set<string>> {
  const { weekStart, weekEnd } = getWeekRange();

  const activity = await prisma.entry.findMany({
    where: {
      userId,
      createdAt: { gte: weekStart, lte: weekEnd },
    },
    select: { createdAt: true },
  });

  return new Set(activity.map((e) => e.createdAt.toDateString()));
}