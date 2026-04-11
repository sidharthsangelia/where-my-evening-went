import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ArchivePage from "@/components/archive/ArchivePage";

export default async function Archive() {
  const { userId } = await auth();
  if (!userId) return null;

  const entries = await prisma.entry.findMany({
    where:   { userId, deletedAt: null, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    select: {
      id:              true,
      userMood:        true,
      vibe:            true,
      alignment:       true,
      durationSeconds: true,
      transcript:      true,
      themes:          true,
      insight:         true,
      pattern:         true,
      status:          true,
      createdAt:       true,
    },
  });

  return <ArchivePage entries={entries} />;
}