// worker/index.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../lib/prisma";

// Explicitly define the queue name
const QUEUE_NAME = "generation-queue"; 

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  QUEUE_NAME, // Pass the constant variable here
  async (job) => {
    const { generationId } = job.data;
    console.log(`Processing generation: ${generationId}`);

    try {
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "PROCESSING" },
      });

      // Simulate AI generation time
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const mockStorageKey = `audio-${generationId}`;

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

console.log(`Generation Worker is running and listening to [${QUEUE_NAME}]...`);