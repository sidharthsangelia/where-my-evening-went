"use server";

import prisma from "@/lib/prisma";
import { toDateParam } from "@/lib/week";

export async function getUserStats(userId: string) {
  // Grab all completed entries, newest first
  const entries = await prisma.entry.findMany({
    where: { userId, deletedAt: null, status: "COMPLETED" },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const total = entries.length;

  // De-dupe to one entry per day (YYYY-MM-DD strings), descending
  const uniqueDays = [
    ...new Set(entries.map((e) => toDateParam(new Date(e.createdAt)))),
  ].sort((a, b) => (a > b ? -1 : 1));

  // Streak — walk backwards from today (or yesterday if today not logged yet)
  let streak = 0;
  const today = new Date();
  const todayStr = toDateParam(today);

  const cursor = new Date(today);
  if (!uniqueDays.includes(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  for (const day of uniqueDays) {
    if (day === toDateParam(cursor)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (day < toDateParam(cursor)) {
      break;
    }
  }

  return { total, streak };
}