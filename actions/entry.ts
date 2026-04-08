"use server";

import prisma from "@/lib/prisma";

export async function getDayEntry(userId: string, date: string) {
  // date is "YYYY-MM-DD" — match the full day in UTC
  const start = new Date(`${date}T00:00:00.000Z`);
  const end   = new Date(`${date}T23:59:59.999Z`);

  return prisma.entry.findFirst({
    where: {
      userId,
      deletedAt: null,
      createdAt: { gte: start, lte: end },
    },
    select: {
      id:              true,
      audioUrl:        true,
      userMood:        true,   // user-selected mood
      vibe:            true,   // AI-detected vibe
      alignment:       true,   // aligned | mixed | contrasting
      insight:         true,   // replaces summary/reflection
      pattern:         true,   // key pattern
      themes:          true,   // replaces emotions + tags
      transcript:      true,
      durationSeconds: true,
      status:          true,
      createdAt:       true,
    },
    orderBy: { createdAt: "desc" },
  });
}