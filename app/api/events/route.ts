import { NextResponse } from "next/server";
import { requireTenantId } from "@/lib/db/tenant";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Enforce tenant isolation (throws 401/403 if invalid)
    const tenantId = await requireTenantId();
    
    const body = await req.json();
    const { userId, event, generationId, metadata } = body;

    // 2. Create the event with the required tenantId
    const newEvent = await prisma.productEvent.create({
      data: {
        tenantId,
        userId,
        event,
        generationId: generationId || null,
        metadata: metadata || {},
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    // Handle our custom Response errors from requireTenantId
    if (error instanceof Response) return error;
    
    console.error("Event Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}