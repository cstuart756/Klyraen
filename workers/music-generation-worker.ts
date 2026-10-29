import 'dotenv/config';
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../lib/prisma";
import Replicate from "replicate";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const worker = new Worker(
  "generation-queue", 
  async (job) => {
    const { generationId } = job.data;
    console.log(`Processing generation: ${generationId}`);

    try {
      // 1. Update status to PROCESSING
      const generation = await prisma.generation.update({
        where: { id: generationId },
        data: { status: "PROCESSING" },
      });

      // 2. Extract the prompt (it includes the genre prefix from the API)
      const prompt = generation.prompt;
      console.log(`Sending to AI: ${prompt}`);

      // 3. Call the Replicate API (Meta MusicGen)
      // Note: MusicGen generates instrumentals. For vocals, you would use a different model like Suno (when they release their API).
      const output = await replicate.run(
        "meta/musicgen:671ac645ce5eb8a699dea9fb47b447830363e52ec03686d0829d1a5d22145b32",
        {
          input: {
            prompt: prompt,
            duration: 15, // Length of the track in seconds (keep low for testing to save money)
            temperature: 1,
            top_k: 250,
            top_p: 0,
            continuation: false,
            output_format: "mp3",
            normalization_strategy: "peak"
          }
        }
      );

      console.log(`AI Response:`, output);

      // The output is typically an array containing the audio URL
      const audioUrl = Array.isArray(output) ? output[0] : output;

      if (!audioUrl) throw new Error("No audio URL returned from AI");

      // 4. Update status to COMPLETED with the real audio URL
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