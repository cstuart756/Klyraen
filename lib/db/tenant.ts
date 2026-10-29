import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

export class TenantAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "TenantAuthError";
    this.status = status;
  }
}

export async function requireTenantId(): Promise<string> {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    throw new TenantAuthError("Unauthenticated", 401);
  }

  // 1. Ensure User exists in our database (self-healing)
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@placeholder.com`;
    
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: email,
      }
    });
  }

  // 2. If the user is in a Clerk Organization, use it!
  if (orgId) {
    const membership = await prisma.membership.findFirst({
      where: { tenantId: orgId, user: { clerkId: userId } },
      select: { tenantId: true },
    });
    if (membership) return membership.tenantId;
  }

  // 3. Otherwise, auto-provision a default workspace for them
  let personalTenant = await prisma.tenant.findFirst({
    where: { memberships: { some: { userId: user.id, role: 'owner' } } }
  });

  if (!personalTenant) {
    personalTenant = await prisma.tenant.create({
      data: {
        name: 'Personal Workspace',
        slug: `workspace-${userId.substring(0, 8)}`,
        memberships: {
          create: { userId: user.id, role: 'owner' }
        }
      }
    });
  }

  return personalTenant.id;
}