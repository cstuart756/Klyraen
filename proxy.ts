import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // Protect all app pages and API routes except the landing page, sign-in, and public assets
  const isPublicRoute = req.nextUrl.pathname === '/' || 
                        req.nextUrl.pathname.startsWith('/sign-in') || 
                        req.nextUrl.pathname.startsWith('/sign-up');

  if (!isPublicRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};