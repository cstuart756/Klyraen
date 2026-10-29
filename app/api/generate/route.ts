import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { requireTenantId } from "@/lib/db/tenant";
import { prisma } from "@/lib/prisma";
import { getGenerationQueue } from "@/lib/queue"; // <--- Updated import

export async function POST(req: Request) {
  try {
    // 1. Lock down the route (throws 401/403 if unauthorized or no workspace)
    const tenantId = await requireTenantId();
    
    // 2. Get the current user's Clerk ID
    const { userId: clerkId } = await auth();
    
    // 3. Find the user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId! },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    // 4. Parse the request body
    const body = await req.json();
    const { prompt, style } = body;

    if (!prompt || prompt.length < 10) {
      return NextResponse.json({ error: "Prompt must be at least 10 characters" }, { status: 400 });
    }

    // 5. Save the generation to Postgres
    const generation = await prisma.generation.create({
      data: {
        tenantId: tenantId,
        userId: user.id,
        prompt: prompt,
        status: "QUEUED", // Will be picked up by the worker
      },
    });

    // 6. Add the job to the Redis queue (Lazy loaded)
    const queue = getGenerationQueue();
    await queue.add("generate-song", {
      generationId: generation.id,
    });

    // 7. Return the new generation record to the frontend
    return NextResponse.json(generation, { status: 201 });

  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    
    console.error("Generation API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}