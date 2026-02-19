"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function saveRecording(audioUrl: string, fileSize:number, durationSeconds: number) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // Fetch user info from Clerk
  const clerkUser = await (await clerkClient()).users.getUser(userId);

  // ✅ Create user if not exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      name: clerkUser.firstName ?? "",
    },
  });

  // ✅ Now safe to create entry
  const entry = await prisma.entry.create({
    data: {
      userId,
      audioUrl,
      fileSize,
      durationSeconds,
      status: "UPLOADED",
    },
  });

  revalidatePath("/archive");

  return { success: true, entry };
}
