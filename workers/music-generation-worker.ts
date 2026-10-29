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

      const output: any = await replicate.run(
        "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
        {
          input: {
            prompt: prompt,
            model_version: "stereo-melody-large",
            duration: 15,
            output_format: "mp3",
            normalization_strategy: "loudness",
          }
        }
      );

      const audioUrl = typeof output === 'string' ? output : (Array.isArray(output) ? output[0] : output.url);

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
    } catch (error: any) {
      console.error(`Failed generation: ${generationId}`, error);
      
      // Catch the 402 Payment Required error specifically
      let friendlyError = "AI generation failed. Please try again.";
      if (error.message && error.message.includes("402")) {
        friendlyError = "AI provider is out of credits. Please add billing info to Replicate.";
      } else if (error.message && error.message.includes("422")) {
        friendlyError = "Invalid prompt or model version.";
      }

      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "FAILED", errorMessage: friendlyError },
      });
    }
  },
  { connection }
);

worker.on("ready", () => {
  console.log("✅ Worker is connected to Redis and ready to process jobs!");
});