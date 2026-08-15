import { Worker } from "bullmq";
import { generationQueueName } from "@/lib/generation-queue";
import { getRedisConnection } from "@/lib/redis";
import prisma from "@/lib/prisma";
import { generateWithStableAudio } from "@/lib/stable-audio";
import { putAudio } from "@/lib/storage";

const worker = new Worker(
  generationQueueName,
  async (job) => {
    const generationId = String(job.data.generationId);
    const generation = await prisma.generation.update({
      where: { id: generationId },
      data: {
        status: "PROCESSING",
        processingStartedAt: new Date(),
        attemptCount: { increment: 1 },
        errorMessage: null,
      },
    });

    try {
      const result = await generateWithStableAudio({ prompt: generation.prompt });
      const storageKey = `generations/${generation.userId}/${generation.id}.mp3`;
      await putAudio(storageKey, result.audio, result.contentType);

      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          model: result.model,
          audioStorageKey: storageKey,
          audioBytes: result.audio.byteLength,
          errorMessage: null,
        },
      });
    } catch (error) {
      await prisma.generation.update({
        where: { id: generation.id },
        data: {
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message.slice(0, 1000) : "Generation failed.",
        },
      });
      throw error;
    }
  },
  { connection: getRedisConnection(), concurrency: 2 },
);

worker.on("completed", (job) => {
  console.log(`Generation ${job.data.generationId} completed.`);
});

worker.on("failed", (job, error) => {
  console.error(`Generation ${job?.data.generationId ?? "unknown"} failed: ${error.message}`);
});

console.log("Klyraen music worker starting...");
