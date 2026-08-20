import { getCurrentUser } from "@/lib/current-user";
import { getGenerationQueue } from "@/lib/generation-queue";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (prompt.length < 3 || prompt.length > 2000) {
      return Response.json({ error: "Prompt must be between 3 and 2000 characters." }, { status: 400 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        prompt,
        provider: process.env.MUSIC_GENERATION_PROVIDER ?? "stable-audio",
      },
    });

    await getGenerationQueue().add("generate", { generationId: generation.id });

    return Response.json({ generationId: generation.id, status: generation.status }, { status: 202 });
  } catch (error) {
    console.error("Generation queue failed:", error);
    const detail =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Unable to queue generation.";
    return Response.json({ error: detail }, { status: 500 });
  }
}
