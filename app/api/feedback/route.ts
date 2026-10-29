import { NextResponse } from "next/server";
import { requireTenantId } from "@/lib/db/tenant";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Enforce tenant isolation
    const tenantId = await requireTenantId();
    
    const body = await req.json();
    const { 
      userId, 
      type, 
      generationId, 
      rating, 
      musicQualityRating, 
      promptAccuracyRating, 
      easeOfUseRating, 
      wouldUseAgain, 
      message 
    } = body;

    // 2. Create the feedback with the required tenantId
    const newFeedback = await prisma.betaFeedback.create({
      data: {
        tenantId,
        userId,
        type,
        generationId: generationId || null,
        rating,
        musicQualityRating,
        promptAccuracyRating,
        easeOfUseRating,
        wouldUseAgain,
        message,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    
    console.error("Feedback Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}