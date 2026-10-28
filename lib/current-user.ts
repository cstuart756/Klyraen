import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Upsert ensures the user exists in our local DB when they sign in via Clerk
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: (await currentUser())?.emailAddresses[0]?.emailAddress || "unknown@test.com",
      credits: 100, // Give 100 beta credits on signup
    },
  });

  return user;
}