"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface SaveRecordingOptions {
  imageUrl?: string
  userMood?: string  // stored in emotions[] — the single selected mood for this entry
}

export async function saveRecording(
  audioUrl: string,
  fileSize: number,
  durationSeconds: number,
  options: SaveRecordingOptions = {},
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const { imageUrl, userMood } = options

  // Fetch user info from Clerk
  const clerkUser = await (await clerkClient()).users.getUser(userId);

  // Create user if not exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: clerkUser.firstName ?? "",
    },
  });

  // Create the entry with all available data
  const entry = await prisma.entry.create({
    data: {
      userId,
      audioUrl,
      fileSize,
      durationSeconds,
      status: "UPLOADED",
      // imageUrl is optional — only set if user added a photo
      ...(imageUrl ? { imageUrl } : {}),
      // mood goes into emotions[] — AI processing may add more emotions later
      // so we seed the array with the user's self-reported mood
      userMood,
    },
  });

  revalidatePath("/dashboard");

  return { success: true, entry };
}