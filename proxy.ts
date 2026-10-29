import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // Use native path matching instead of the deprecated createRouteMatcher
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/studio') || 
                           req.nextUrl.pathname.startsWith('/api');

  if (isProtectedRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};