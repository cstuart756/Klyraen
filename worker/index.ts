// worker/index.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../lib/prisma";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "generation-queue",
  async (job) => {
    const { generationId } = job.data;
    console.log(`Processing generation: ${generationId}`);

    try {
      // 1. Update status to PROCESSING
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "PROCESSING" },
      });

      // 2. Call the AI Provider (Mocked for 5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 3. Simulate saving audio file
      const mockStorageKey = `audio-${generationId}`;

      // 4. Update status to COMPLETED
      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: "COMPLETED",
          audioStorageKey: mockStorageKey,
          completedAt: new Date(),
        },
      });

      console.log(`Completed generation: ${generationId}`);
    } catch (error) {
      console.error(`Failed generation: ${generationId}`, error);
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "FAILED", errorMessage: "Provider API failed." },
      });
    }
  },
  { connection }
);

console.log("Generation Worker is running...");