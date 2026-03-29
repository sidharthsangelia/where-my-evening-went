import prisma from "@/lib/prisma";
import { parseDateParam } from "@/lib/week";

export async function getDayEntry(userId: string, dateParam: string) {
  const date = parseDateParam(dateParam);

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.entry.findFirst({
    where: {
      userId,
      createdAt: { gte: start, lte: end },
      deletedAt: null,
    },
  });
}
