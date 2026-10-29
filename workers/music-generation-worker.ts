import 'dotenv/config';
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../lib/prisma";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// A list of different real audio tracks to mock the AI generation
const mockAudioTracks = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
];

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

      // Simulate AI generation time based on genre
      const isComplex = generation.prompt.includes("Cinematic") || generation.prompt.includes("EDM");
      const waitTime = isComplex ? 7000 : 5000; 
      
      console.log(`Generating ${generation.prompt.split(']')[0]}] audio (takes ${waitTime}ms)...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      
      // Randomly select one of the mock tracks to simulate different outputs
      const randomIndex = Math.floor(Math.random() * mockAudioTracks.length);
      const realAudioUrl = mockAudioTracks[randomIndex];

      await prisma.generation.update({
        where: { id: generationId },
        data: {
          status: "COMPLETED",
          audioStorageKey: realAudioUrl,
          completedAt: new Date(),
        },
      });

      console.log(`Completed generation: ${generationId} (Track ${randomIndex + 1})`);
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