import prisma from "@/lib/prisma";
import { inngest } from "../client";
import { transcribeAudio } from "@/lib/ai/transcribeAudio";

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

    //  update status to  Processing

    await step.run("mark-processign", async () => {
      await prisma.entry.update({
        where: { id: entryId },
        data: { status: "PROCESSING" },
      });
    });

    console.log("Entry marked as PROCESSING:", entryId);

    // Transcription
    try {
      const transcript = await step.run("transcription", async () => {
        return await transcribeAudio(entry.audioUrl);
      });

      await step.run("save-transcript", async () => {
        await prisma.entry.update({
          where: { id: entryId },
          data: {
            transcript,
            status: "COMPLETED",
          },
        });
        console.log("Transcription completed:", entryId);
      });
    } catch (error: any) {
      // marking transcription failed in db
      await step.run("mark-failed", async () => {
        await prisma.entry.update({
          where: { id: entryId },
          data: {
            status: "FAILED",
            errorMessage: error?.message ?? "Unkonown Error",
          },
        });
      });
      throw error;
    }
  },
);
