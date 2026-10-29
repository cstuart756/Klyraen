import 'dotenv/config';
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../lib/prisma";
import Replicate from "replicate";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
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

      const prompt = generation.prompt;
      console.log(`Sending to AI: ${prompt}`);

      // THE FIX: Using the correct and complete version hash
      const output = await replicate.run(
        "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
        {
          input: {
            prompt: prompt,
            model_version: "stereo-melody-large", // This is the recommended model
            duration: 15,
            output_format: "mp3",
            normalization_strategy: "loudness",
          }
        }
      );

      console.log(`AI Response:`, output);

      // The output is a URL string
      const audioUrl = typeof output === 'string' ? output : output[0];

      if (!audioUrl) throw new Error("No audio URL returned from AI");

      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: "COMPLETED",
          audioStorageKey: audioUrl,
          completedAt: new Date(),
        },
      });

      console.log(`Successfully completed generation: ${generationId}`);
    } catch (error) {
      console.error(`Failed generation: ${generationId}`, error);
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "FAILED", errorMessage: "AI Provider failed. Please try again." },
      });
    }
  },
  { connection }
);

worker.on("ready", () => {
  console.log("✅ Worker is connected to Redis and ready to process jobs!");
});