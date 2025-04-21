import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { supabase } from "@/utils/supabase";
import * as WebBrowser from "expo-web-browser";

export default function RegisterPayment() {
  const [loading, setLoading] = useState(false);

  const handleStripeRegistration = async () => {
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 1. Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      Alert.alert("Error", "User must be logged in.");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;
    const userEmail = userData.user.email;

    console.log(userEmail);

    // 2. Call Edge Function to create Stripe account
    try {
      const response = await fetch(
        "https://tedyjfkbdwhziszwjmgl.supabase.co/functions/v1/create-stripe-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ email: userEmail }),
        },
      );

      const result = await response.json();
      console.log("Full Result:", result);
      console.log("Account ID:", result.accountId);
      console.log("Result URL:", result.url);

      if (!result.accountId || !result.url) {
        throw new Error("Missing account ID or onboarding link.");
      }

      const { accountId, url } = result;

      // 4. Save the Stripe account ID to the Landlords table
      const { error: updateError } = await supabase
        .from("Landlords")
        .update({ stripe_account_id: accountId })
        .eq("user_id", userId);

      console.log("Update Error:", updateError);

      if (updateError) {
        console.error("Failed to save stripe_account_id:", updateError);
        Alert.alert("Error", "Could not save Stripe account ID.");
        setLoading(false);
        return;
      }

      // 5. Open onboarding link
      await WebBrowser.openBrowserAsync(url);
    } catch (err) {
      console.error("Stripe onboarding failed:", err);
      Alert.alert("Error", "Something went wrong during onboarding.");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center px-6">
            <Text className="text-2xl font-bold mb-4">
              Register for Payouts
            </Text>

            <TouchableOpacity
              onPress={handleStripeRegistration}
              className="bg-blue-500 w-full py-3 rounded-xl items-center"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">
                  Start Stripe Onboarding
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
