import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo"; // For the hamburger menu
import AntDesign from "@expo/vector-icons/AntDesign"; // For the profile icon
import { useSidebar } from "./_layout"; // Import the useSidebar hook
import { handleRentPayment } from "@/utils/stripe/payment";

export default function PayRent() {
  const { toggleSidebar } = useSidebar(); 
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          {/* Hamburger Menu */}
          <TouchableOpacity onPress={toggleSidebar}>
            <Entypo name="menu" size={35} color="black" />
          </TouchableOpacity>

          {/* Logo */}
          <TouchableOpacity onPress={() => router.push("./dashboard")}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Profile Icon */}
          <TouchableOpacity onPress={() => router.push("./profile-tenant")}>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>
          Pay Rent
        </Text>

        {/* Amount Due */} 
        <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>Amount Due:</Text>
          <Text style={{ fontSize: 16, color: "gray" }}>$500</Text> {/* Example amount. We need to replace with actual data */}
        </View>

        {/* Pay with Stripe Button */}
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <TouchableOpacity
            onPress={handleRentPayment}
            style={{
              backgroundColor: "#6772E5",
              paddingVertical: 16,
              paddingHorizontal: 24,
              borderRadius: 8,
              width: "90%",
              alignItems: "center",
            }}
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