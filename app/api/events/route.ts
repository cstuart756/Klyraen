import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

const allowedEvents = new Set([
  "CREATE_PAGE_VIEW",
  "PROMPT_STARTED",
  "STYLE_SELECTED",
  "GENERATE_CLICKED",
  "GENERATION_QUEUED",
  "GENERATION_COMPLETED",
  "TRACK_PLAYED",
  "TRACK_FAVOURITED",
  "FEEDBACK_SUBMITTED",
  "SECOND_GENERATION_STARTED",
]);

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    if (typeof body.event !== "string" || !allowedEvents.has(body.event)) {
      return Response.json({ error: "Invalid event." }, { status: 400 });
    }

    await prisma.productEvent.create({
      data: {
        userId: user.id,
        event: body.event,
        generationId:
          typeof body.generationId === "string" ? body.generationId : undefined,
        metadata:
          body.metadata && typeof body.metadata === "object"
            ? body.metadata
            : undefined,
      },
    });

    return Response.json({ recorded: true });
  } catch {
    return Response.json({ error: "Unable to record event." }, { status: 500 });
  }
}
