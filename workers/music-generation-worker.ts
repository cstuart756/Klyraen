import 'dotenv/config';
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
      const generation = await prisma.generation.update({
        where: { id: generationId },
        data: { status: "PROCESSING" },
      });

      // Simulate AI generation time based on genre complexity
      const isComplex = generation.prompt.includes("Cinematic") || generation.prompt.includes("EDM");
      const waitTime = isComplex ? 7000 : 5000; 
      
      console.log(`Generating ${generation.prompt.split(']')[0]}] audio (takes ${waitTime}ms)...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      
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