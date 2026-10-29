import { NextResponse } from "next/server";
import { requireTenantId, TenantAuthError } from "@/lib/db/tenant";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const tenantId = await requireTenantId();

    const tracks = await prisma.generation.findMany({
      where: { 
        tenantId: tenantId,
        status: "COMPLETED" 
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 for now
    });

    return NextResponse.json(tracks);
  } catch (error: any) {
    if (error instanceof TenantAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}