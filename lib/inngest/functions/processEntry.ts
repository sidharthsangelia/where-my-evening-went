import prisma from "@/lib/prisma";
import { inngest } from "../client";

export const processEntry = inngest.createFunction(
  { id: "process-entry" },
  { event: "entry/created" },

  async ({ event, step }) => {
    const { entryId } = event.data;

    // Fetch entry
    const entry = await step.run("fetch-entry", async () => {
      return prisma.entry.findUnique({
        where: { id: entryId },
      });
    });

    if (!entry) {
      throw new Error("Entry not found ❌");
    }

    //  update status -> Processing

    await step.run("mark-processign", async () => {
      await prisma.entry.update({
        where: { id: entryId },
        data: { status: "PROCESSING" },
      });
    });

    console.log("Entry marked as PROCESSING:", entryId);
  },
);
