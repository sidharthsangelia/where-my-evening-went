"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleAiOptIn(currentValue: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: userId },
    data: {
      aiOptIn:   !currentValue,
      aiOptInAt: !currentValue ? new Date() : null,
    },
  });

  revalidatePath("/profile");
}