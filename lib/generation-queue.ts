import { Queue } from "bullmq";
import { getRedisConnection } from "@/lib/redis";

export const generationQueueName = "music-generation";

export function getGenerationQueue() {
  return new Queue(generationQueueName, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 1000,
    },
  });
}
