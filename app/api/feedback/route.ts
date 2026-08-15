import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

const feedbackTypes = new Set([
  "GENERAL",
  "GENERATION",
  "BUG",
  "FEATURE_REQUEST",
]);

function rating(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return Math.min(Math.max(Math.round(value), 1), 5);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const type = feedbackTypes.has(body.type) ? body.type : "GENERAL";

    const feedback = await prisma.betaFeedback.create({
      data: {
        userId: user.id,
        type,
        generationId:
          typeof body.generationId === "string" ? body.generationId : undefined,
        rating: rating(body.rating),
        musicQualityRating: rating(body.musicQualityRating),
        promptAccuracyRating: rating(body.promptAccuracyRating),
        easeOfUseRating: rating(body.easeOfUseRating),
        wouldUseAgain:
          typeof body.wouldUseAgain === "boolean" ? body.wouldUseAgain : undefined,
        message:
          typeof body.message === "string"
            ? body.message.trim().slice(0, 5000)
            : undefined,
      },
    });

    return Response.json({ feedback }, { status: 201 });
  } catch {
    return Response.json({ error: "Unable to save feedback." }, { status: 500 });
  }
}
