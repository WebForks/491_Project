import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "npm:stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  try {
    const { landlordStripeId, amountInCents, landlordUserId } =
      await req.json();

    if (!landlordStripeId || !amountInCents) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Rent Payment",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: "https://example.com/return",
      cancel_url: "https://example.com/return",
      payment_intent_data: {
        transfer_data: {
          destination: landlordStripeId,
        },
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
