import { getCurrentUser } from "@/lib/current-user";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const generation = await prisma.generation.findFirst({
      where: { id, userId: user.id },
      select: {
        id: true,
        prompt: true,
        status: true,
        model: true,
        errorMessage: true,
        completedAt: true,
        audioStorageKey: true,
      },
    });

    if (!generation) {
      return Response.json({ error: "Generation not found." }, { status: 404 });
    }

    return Response.json({ generation });
  } catch {
    return Response.json({ error: "Unable to load generation." }, { status: 500 });
  }
}
