// tenuity/apps/forgot-password.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import "../global.css";

// If you're using expo-router Link component, you can import it:
// import { Link } from "expo-router";

export default function ForgotPassword() {
  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {/* Logo & Title */}
      <View className="items-center mb-8">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[170px] h-[170px] mb-2"
          resizeMode="contain"
        />
      </View>

      {/* Heading & Description */}
      <Text className="text-lg font-semibold mb-1">Forgot password?</Text>
      <Text className="text-base text-center mb-6">
        Enter your email to be sent a link to recover your password.
      </Text>

      {/* Form Container */}
      <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
        {/* Email Field */}
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-blue-300 rounded p-3 mb-3"
        />

        {/* Submit Button */}
        <TouchableOpacity className="bg-blue-500 w-full py-3 rounded items-center mb-4">
          <Text className="text-white font-bold">Submit</Text>
        </TouchableOpacity>

        {/* Login & Create Account */}
        <TouchableOpacity className="mb-2">
          <Text className="text-blue-500 text-center">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
