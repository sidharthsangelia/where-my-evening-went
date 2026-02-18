import prisma from "@/lib/prisma";
import { inngest } from "../client";
import { transcribeAudio } from "@/lib/ai/transcribeAudio";
import { analyzeEntry } from "@/lib/ai/analyzeEntry";

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
          },
        });
        console.log("Transcription completed:", entryId);
      });

      // Entry Analysis
      const analysis = await step.run("analyze-entry", async () => {
        if (!transcript) {
          throw new Error("Transcript doesnot exist can proceed forward❌");
        }
        return await analyzeEntry(transcript);
      });
      // saving analysis in db and updating status to complete
      await step.run("save-analysis", async () => {
        await prisma.entry.update({
          where: { id: entryId },
          data: {
            summary: analysis.summary,
            reflection: analysis.reflection,
            emotions: analysis.emotions,
            tags: analysis.tags,
            processedAt: new Date(),
            status: "COMPLETED",
          },
        });
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
