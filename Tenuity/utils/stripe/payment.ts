import { supabase } from "@/utils/supabase";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

export async function handleRentPayment() {
  try {
    // 1. Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 2. Get user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.id) throw new Error("User not logged in");

    const userId = userData.user.id;

    // 3. Get landlord ID from tenant record
    const { data: tenantData, error: tenantError } = await supabase
      .from("Tenants")
      .select("landlord_id")
      .eq("user_id", userId)
      .single();

    if (tenantError || !tenantData?.landlord_id) {
      throw new Error("Unable to find your assigned landlord.");
    }

    const landlordUserId = tenantData.landlord_id;
    const amountInCents = 50000;

    // 4. Get landlord's Stripe account ID
    const { data, error } = await supabase
      .from("Landlords")
      .select("stripe_account_id")
      .eq("user_id", landlordUserId)
      .single();

    if (error || !data?.stripe_account_id) {
      throw new Error("Could not find landlord’s Stripe account.");
    }

    // 5. Create Stripe Checkout session
    const sessionRes = await fetch(
      "https://tedyjfkbdwhziszwjmgl.supabase.co/functions/v1/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          landlordStripeId: data.stripe_account_id,
          amountInCents,
          landlordUserId,
        }),
      },
    );

    const result = await sessionRes.json();
    console.log("Result:", result);

    if (!result.url) throw new Error("Unable to initiate payment.");

    await WebBrowser.openBrowserAsync(result.url);
  } catch (err: any) {
    console.error("Payment error:", err.message);
    Alert.alert("Error", err.message || "Something went wrong.");
  }
}
