import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo"; // For the hamburger menu
import AntDesign from "@expo/vector-icons/AntDesign"; // For the profile icon
import { useSidebar } from "./_layout"; // Import the useSidebar hook
import { handleRentPayment } from "@/utils/stripe/payment";
import { supabase } from "../../utils/supabase";

export default function PayRent() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [rentAmount, setRentAmount] = useState<number | null>(null);
  const [rentDueDate, setRentDueDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentDetails = async () => {
      try {
        // Get the current user's UUID (tenant_uuid)
        const {
          data: { user },
          error: sessionError,
        } = await supabase.auth.getUser();

        if (sessionError || !user) {
          console.error("Session error:", sessionError);
          Alert.alert(
            "Error",
            "Failed to retrieve user session. Please log in again.",
          );
          return;
        }

        const tenantUuid = user.id; // Tenant's UUID
        console.log("Tenant UUID:", tenantUuid);

        // Fetch tenant details
        const { data: tenantData, error: tenantError } = await supabase
          .from("Tenants")
          .select("created_at, last_payment_date")
          .eq("user_id", tenantUuid)
          .single();

        if (tenantError) {
          console.error("Tenant data error:", tenantError);
          Alert.alert(
            "Error",
            "Failed to retrieve tenant details. Please try again.",
          );
          return;
        }

        const { created_at, last_payment_date } = tenantData;

        // Calculate the next rent due date
        const accountCreationDate = new Date(created_at);
        const lastPaymentDate = last_payment_date
          ? new Date(last_payment_date)
          : null;
        const today = new Date();

        let nextDueDate;
        if (lastPaymentDate) {
          nextDueDate = new Date(lastPaymentDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Add one month to the last payment date
        } else {
          nextDueDate = accountCreationDate; // Use account creation date if no payment has been made
        }

        console.log("Next Due Date:", nextDueDate);

        // Fetch rent amount from the Properties table
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("Properties")
          .select("rent, tenant_uuid");

        if (propertiesError) {
          console.error("Property data error:", propertiesError);
          Alert.alert(
            "Error",
            "Failed to retrieve rent amount. Please try again.",
          );
          return;
        }

        // Filter the data in the application
        const property = propertiesData.find(
          (property) => property.tenant_uuid?.toString() === tenantUuid,
        );

        if (!property) {
          Alert.alert("Error", "No property found for the current tenant.");
          return;
        }

        console.log("Rent Amount:", property.rent);

        setRentAmount(property.rent || 0); // Set the rent amount
        setRentDueDate(nextDueDate); // Set the rent due date
      } catch (error) {
        console.error("Error fetching rent details:", error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentDetails();
  }, []);

  const local_handleRentPayment = async () => {
    try {
      if (!rentAmount || !rentDueDate) {
        Alert.alert("Error", "Rent details are not available.");
        return;
      }

      // Simulate payment processing
      console.log(`Processing payment of $${rentAmount}`);

      // Update the last payment date to today
      const today = new Date();
      const nextDueDate = new Date(today);
      nextDueDate.setMonth(nextDueDate.getMonth() + 1); // Add one month to today's date

      const { error: updateError } = await supabase
        .from("Tenants")
        .update({ last_payment_date: today.toISOString().split("T")[0] })
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (updateError) {
        console.error("Error updating last payment date:", updateError);
        Alert.alert(
          "Error",
          "Failed to update payment details. Please try again.",
        );
        return;
      }

      setRentDueDate(nextDueDate); // Update the state
      await handleRentPayment();
      Alert.alert(
        "Success",
        `Payment successful! Your next payment is due on ${nextDueDate.toDateString()}.`,
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Error", "Failed to process payment. Please try again.");
    }
  };

  const today = new Date();
  const isPastDue = rentDueDate && today > rentDueDate;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={toggleSidebar}>
            <Entypo name="menu" size={35} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./dashboard")}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./profile-tenant")}>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Pay Rent
        </Text>

        {/* Rent Details */}
        <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : isPastDue ? (
            <Text style={{ fontSize: 16, color: "red" }}>
              You have a past due balance of ${rentAmount?.toFixed(2)}. Please
              pay immediately.
            </Text>
          ) : rentAmount !== null && rentDueDate !== null ? (
            <Text style={{ fontSize: 16, color: "gray" }}>
              Your next payment of ${rentAmount.toFixed(2)} is due on{" "}
              {rentDueDate.toDateString()}.
            </Text>
          ) : (
            <Text style={{ fontSize: 16, color: "gray" }}>
              Unable to fetch rent details. Please try again later.
            </Text>
          )}
        </View>

        {/* Pay with Stripe Button */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity
            onPress={local_handleRentPayment}
            style={{
              backgroundColor: "#6772E5",
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: "90%",
              alignItems: "center",
            }}
            disabled={loading || rentAmount === null}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Pay with Stripe
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

