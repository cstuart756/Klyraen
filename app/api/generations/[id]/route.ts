import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireTenantId } from "@/lib/db/tenant";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // <--- Next.js 15+ signature
) {
  try {
    const { id } = await context.params; // <--- Await the params
    const tenantId = await requireTenantId();
    const { userId: clerkId } = await auth();

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const generation = await prisma.generation.findFirst({
      where: { 
        id: id, // <--- Use the awaited id
        userId: user.id,
        tenantId: tenantId 
      },
      include: {
        song: true,
      },
    });

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    return NextResponse.json(generation);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("Fetch Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}