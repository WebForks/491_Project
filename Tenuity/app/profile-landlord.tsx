import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import "../global.css";

export default function ProfileLandlord() {
  return (
    <View className="flex-1 bg-white p-4">
      {/* Profile Header */}
      <View className="items-center mb-8">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[100px] h-[100px] mb-2"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold">Landlord Profile</Text>
      </View>

      {/* Profile Details */}
      <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4 mb-4 items-center mx-auto">
        <Text className="text-lg font-semibold mb-2">John Doe</Text>
        <Image
          source={require("../assets/images/icon.png")}
          className="w-[150px] h-[150px] mb-2 rounded-full"
          resizeMode="cover"
        />
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity className="bg-blue-500 w-full py-3 rounded items-center mb-4">
        <Text className="text-white font-bold">Edit Profile</Text>
      </TouchableOpacity>

      {/* Navigation Links */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity className="bg-gray-300 w-full py-3 rounded items-center mb-2">
          <Text className="text-black font-bold">Back to Dashboard</Text>
        </TouchableOpacity>
      </Link>
      <Link href="" asChild>
        <TouchableOpacity className="bg-red-500 w-full py-3 rounded items-center">
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </Link>
    
    {/* Footer */}
    <View className="items-center mt-8">
        <Text className="text-gray-500">Copyright @ Tenuity 2025</Text>
      </View>
    </View>
  );
}