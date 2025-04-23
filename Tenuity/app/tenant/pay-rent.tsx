import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSidebar } from "./_layout";

export default function PayRent() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [amountDue, setAmountDue] = useState(1200); // Example amount due (hardcoded for now)
  const [paymentMethod, setPaymentMethod] = useState(""); // Placeholder for payment method. DELETE THIS IF NEEDED
  const [paymentDate, setPaymentDate] = useState(""); // Selected payment date
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Date picker visibility
  const [isChecked, setIsChecked] = useState(false); // Checkbox state
  const [isSubmitting, setIsSubmitting] = useState(false); // Submit button state

  const handlePayment = async () => {
    if (!isChecked) {
      Alert.alert("Error", "You must agree to the Terms of Service.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Error", "Please select a payment method.");
      return;
    }

    if (!paymentDate) {
      Alert.alert("Error", "Please select a payment date.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Placeholder for backend integration
      console.log("Processing payment...");
      console.log("Amount Due:", amountDue);
      console.log("Payment Method:", paymentMethod);
      console.log("Payment Date:", paymentDate);

      // Simulate a successful payment
      setTimeout(() => {
        Alert.alert("Success", "Your rent payment has been submitted!");
        router.push("./dashboard"); // Redirect to dashboard after payment
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Error", "Something went wrong while processing your payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDate = (_event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setPaymentDate(selectedDate.toLocaleDateString()); // Format the date
    }
    setDatePickerVisibility(false); // Close the date picker
  };

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
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./profile-tenant")}>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-center mb-6">Pay Rent</Text>

        {/* Amount Due */}
        <View className="mb-4 px-6">
          <Text className="text-xl font-bold mb-2">Amount Due:</Text>
          <Text className="text-lg text-gray-700">${amountDue}</Text>
        </View>

        {/* Payment Method */}
        <View className="mb-4 items-center">
          <TouchableOpacity
            onPress={() => router.push("./paymentPreferences")} // Placeholder for payment preferences page
            className="border border-[#38B6FF] p-3 rounded-lg mt-2 w-[90%]"
          >
            <Text className="text-gray-500">
              {paymentMethod || "Select or Add Payment Method"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment Date */}
        <View className="mb-4 items-center">
          <TouchableOpacity
            onPress={() => setDatePickerVisibility(!isDatePickerVisible)} // Toggle date picker visibility
            className="border border-[#38B6FF] p-3 rounded-lg mt-2 w-[90%] flex-row justify-between items-center"
          >
            <Text className="text-gray-500">
              {paymentDate || "Select Payment Date"}
            </Text>
            <AntDesign name="down" size={16} color="gray" />
          </TouchableOpacity>
          {isDatePickerVisible && (
            <View
              style={{
                backgroundColor: "white", // Ensure a white background for the picker
                borderRadius: 10, // Add rounded corners
                padding: 10, // Add padding around the picker
                marginTop: 10, // Add spacing below the date box
              }}
            >
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleConfirmDate}
                themeVariant="light" // Force light theme for better visibility
              />
            </View>
          )}
        </View>

        {/* Terms of Service */}
        <View className="flex-row items-center mb-4 px-6">
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? "#38B6FF" : undefined}
          />
          <Text className="text-gray-700 ml-2">
            Pay Rent and Agree to Tenuity Terms of Service
          </Text>
        </View>

        {/* Submit Payment */}
        <TouchableOpacity
          onPress={handlePayment}
          disabled={!isChecked || isSubmitting}
          className={`bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto ${
            isChecked && !isSubmitting ? "" : "opacity-50"
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {isSubmitting ? "Processing..." : "Submit Payment"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}