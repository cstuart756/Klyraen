import { NextResponse } from "next/server";
import { requireTenantId, TenantAuthError } from "@/lib/db/tenant";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const tenantId = await requireTenantId();
    
    // Get the tenant to check for an existing Stripe customer ID
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { subscription: true }
    });

    if (!tenant) throw new Error("Tenant not found");

    let stripeCustomerId = tenant.subscription?.stripeCustomerId;

    // If no Stripe customer exists, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        metadata: { tenantId: tenant.id },
      });
      stripeCustomerId = customer.id;

      // Save the new customer ID
      await prisma.subscription.upsert({
        where: { tenantId: tenant.id },
        create: { tenantId: tenant.id, stripeCustomerId, plan: "free", status: "active" },
        update: { stripeCustomerId },
      });
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          // Replace this with your actual Stripe Price ID for the Pro plan
          price: process.env.STRIPE_PRICE_PRO_ID || "price_mock_123", 
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    if (error instanceof TenantAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}