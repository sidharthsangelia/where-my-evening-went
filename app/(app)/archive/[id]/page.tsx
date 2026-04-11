import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EntryDetail from "@/components/archive/EntryDetail";
 

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArchiveEntryPage({ params }: Props) {
  const { id } = await params;          // ← await first
  const { userId } = await auth();
  if (!userId) return null;

  const entry = await prisma.entry.findFirst({
    where: { id, userId, deletedAt: null },
    select: {
      id:              true,
      audioUrl:        true,
      imageUrl:        true,
      userMood:        true,
      vibe:            true,
      alignment:       true,
      durationSeconds: true,
      fileSize:        true,
      transcript:      true,
      insight:         true,
      pattern:         true,
      themes:          true,
      status:          true,
      tokensUsed:      true,
      processedAt:     true,
      errorMessage:    true,
      createdAt:       true,
      updatedAt:       true,
    },
  });

  if (!entry) notFound();

  return <EntryDetail entry={entry} />;
}