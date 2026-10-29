import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // Only protect the UI routes. Let the API routes handle their own 401 JSON responses.
  const isProtectedPage = req.nextUrl.pathname.startsWith('/studio') || 
                          req.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedPage) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};