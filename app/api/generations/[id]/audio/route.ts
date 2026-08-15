import { getCurrentUser } from "@/lib/current-user";
import { getAudioUrl } from "@/lib/storage";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const generation = await prisma.generation.findFirst({
      where: { id, userId: user.id, status: "COMPLETED" },
      select: { audioStorageKey: true },
    });

    if (!generation?.audioStorageKey) {
      return Response.json({ error: "Audio is not ready." }, { status: 404 });
    }

    return Response.redirect(await getAudioUrl(generation.audioStorageKey));
  } catch {
    return Response.json({ error: "Unable to load audio." }, { status: 500 });
  }
}
