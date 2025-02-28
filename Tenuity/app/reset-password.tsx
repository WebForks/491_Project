// tenuity/apps/reset-password.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

export default function ResetPassword() {
  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {/* Logo & Title */}
      <View className="items-center mb-8">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[100px] h-[100px] mb-2"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold">Tenuity</Text>
      </View>

      {/* Form Container */}
      <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">Enter New Password</Text>

        {/* New Password Field */}
        <TextInput
          placeholder="New Password"
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-3"
        />

        {/* Repeat New Password Field */}
        <TextInput
          placeholder="Repeat New Password"
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-4"
        />

        {/* Reset Password Button */}
        <TouchableOpacity className="bg-blue-500 w-full py-3 rounded items-center">
          <Text className="text-white font-bold">Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
