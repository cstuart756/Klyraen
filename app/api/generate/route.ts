import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireTenantId, TenantAuthError } from "@/lib/db/tenant";
import { prisma } from "@/lib/prisma";
import { getGenerationQueue } from "@/lib/queue";

export async function POST(req: Request) {
  try {
    const tenantId = await requireTenantId();
    const { userId: clerkId } = await auth();
    
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { prompt } = body;

    if (!prompt || prompt.length < 10) {
      return NextResponse.json({ error: "Prompt must be at least 10 characters" }, { status: 400 });
    }

    const generation = await prisma.generation.create({
      data: {
        tenantId: tenantId,
        userId: user.id,
        prompt: prompt,
        status: "QUEUED",
      },
    });

    const queue = getGenerationQueue();
    await queue.add("generate-song", {
      generationId: generation.id,
    });

    return NextResponse.json(generation, { status: 201 });

  } catch (error: any) {
    if (error instanceof TenantAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    
    console.error("Generation API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}