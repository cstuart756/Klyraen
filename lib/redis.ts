import IORedis from "ioredis";

let connection: IORedis | undefined;

export function getRedisConnection() {
  if (connection) {
    return connection;
  }

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is not configured.");
  }

  connection = new IORedis(url, {
    maxRetriesPerRequest: null,
    tls: url.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
  });

  return connection;
}
