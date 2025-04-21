import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "npm:stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const account = await stripe.accounts.create({
      type: "express",
      email: email.toLowerCase(),
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: "https://example.com/return",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });

    return new Response(
      JSON.stringify({ accountId: account.id, url: accountLink.url }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
