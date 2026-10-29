import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma"; // Adjust this path if your Prisma client is exported from a different file (e.g., "@/lib/prisma")

/**
 * Enforces tenant isolation. Every API route that touches tenant data
 * MUST call this first.
 */
export async function requireTenantId(): Promise<string> {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    throw new Response("Unauthenticated", { status: 401 });
  }

  // For MVP, we assume every user has an active Clerk Organization 
  // that maps to their Klyraen Tenant ID.
  if (!orgId) {
    throw new Response("No active workspace. Please select or create one.", { status: 403 });
  }

  // Verify the user actually has a membership in this tenant
  const membership = await prisma.membership.findFirst({
    where: {
      tenantId: orgId,
      user: { clerkId: userId },
    },
    select: { tenantId: true },
  });

  if (!membership) {
    throw new Response("Forbidden: You do not have access to this workspace", { status: 403 });
  }

  return membership.tenantId;
}