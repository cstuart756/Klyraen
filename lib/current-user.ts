import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Adjust if your prisma client is exported elsewhere

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      // We fetch the email from Clerk's backend to ensure it's accurate
      email: (await currentUser())?.emailAddresses[0]?.emailAddress || "no-email@example.com",
      // NOTE: 'credits' was removed here because credits now belong to the Tenant model, not the User model.
    },
  });

  return user;
}