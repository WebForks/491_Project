import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";

export default function PayRent() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user?.id) {
      Alert.alert("Error", "User not logged in.");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // Get landlord ID from tenant record
    const { data: tenantData, error: tenantError } = await supabase
      .from("Tenants")
      .select("landlord_id")
      .eq("user_id", userId)
      .single();

    if (tenantError || !tenantData?.landlord_id) {
      Alert.alert("Error", "Unable to find your assigned landlord.");
      setLoading(false);
      return;
    }

    const landlordUserId = tenantData.landlord_id;
    const amountInCents = 50000;

    // Get landlord's Stripe ID
    const { data, error } = await supabase
      .from("Landlords")
      .select("stripe_account_id")
      .eq("user_id", landlordUserId)
      .single();

    console.log(data);

    console.log(error);

    console.log("Landlord Stripe Account ID:", data.stripe_account_id);

    if (error || !data?.stripe_account_id) {
      Alert.alert("Error", "Could not find landlord’s Stripe account.");
      setLoading(false);
      return;
    }

    // Create Stripe Checkout session
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

    if (!result.url) {
      Alert.alert("Error", "Unable to initiate payment.");
      setLoading(false);
      return;
    }

    await WebBrowser.openBrowserAsync(result.url);
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6">Pay Rent</Text>
      <TouchableOpacity
        onPress={handlePay}
        className="bg-blue-500 py-3 px-8 rounded-xl"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Pay $500</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
