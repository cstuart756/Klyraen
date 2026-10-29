import { Queue } from "bullmq";
import IORedis from "ioredis";

let queueInstance: Queue | null = null;

export function getGenerationQueue(): Queue {
  if (!queueInstance) {
    // This connection is only created when a request hits the API
    const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: null,
    });
    
    queueInstance = new Queue("generation-queue", { connection });
  }
  return queueInstance;
}