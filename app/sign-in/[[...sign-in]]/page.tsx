import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="studio-shell">
        <section className="studio-card studio-create-card">
          <p className="eyebrow">Authentication</p>
          <h1>Clerk is not connected yet.</h1>
          <p className="beta-lede">
            Add the real Clerk publishable and secret keys to the local environment
            before signing in.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-shell">
      <SignIn routing="path" path="/sign-in" forceRedirectUrl="/studio" />
    </main>
  );
}
