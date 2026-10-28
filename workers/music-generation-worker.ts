import 'dotenv/config'; // <--- ADD THIS LINE AT THE VERY TOP
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../lib/prisma";

// ... rest of your code ...

console.log("Starting the Klyraen worker..."); // Debug line to prove it's running

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// We are hardcoding the string "generation-queue" right here.
// This guarantees BullMQ receives a valid string.
const worker = new Worker(
  "generation-queue", 
  async (job) => {
    const { generationId } = job.data;
    console.log(`Processing generation: ${generationId}`);

    try {
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "PROCESSING" },
      });

      // Simulate AI generation (5 seconds)
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

worker.on("ready", () => {
  console.log("✅ Worker is connected to Redis and ready to process jobs!");
});