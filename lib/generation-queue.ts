import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

let generationQueue: Queue | null = null;

export function getGenerationQueue() {
  if (!generationQueue) {
    generationQueue = new Queue("generation-queue", { connection });
  }
  return generationQueue;
}