import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getStorageConfig() {
  const bucket = process.env.STORAGE_BUCKET;
  const region = process.env.STORAGE_REGION;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 storage configuration is incomplete.");
  }

  return { bucket, region, accessKeyId, secretAccessKey };
}

export function getStorageClient() {
  const config = getStorageConfig();
  return new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function putAudio(key: string, body: Uint8Array, contentType = "audio/mpeg") {
  const { bucket } = getStorageConfig();
  await getStorageClient().send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    ServerSideEncryption: "AES256",
  }));
  return key;
}

export async function getAudioUrl(key: string, expiresIn = 900) {
  const { bucket } = getStorageConfig();
  return getSignedUrl(
    getStorageClient(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn },
  );
}

export async function deleteAudio(key: string) {
  const { bucket } = getStorageConfig();
  await getStorageClient().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
