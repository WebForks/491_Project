import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TenantDashboard() {
  const userName = "Danny"; // Placeholder name

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <View className="w-8 h-8">
          {/* Logo placeholder */}
          <View className="w-full h-full bg-[#4A9DFF]" />
        </View>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View className="p-4">
        <View className="bg-[#4A9DFF] rounded-lg p-4">
          <Text className="text-white text-2xl font-bold">
            Hello {userName}!
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around px-4 py-2">
        <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
          <Ionicons name="cash-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
          <Ionicons name="folder-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
          <Ionicons name="chatbubble-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Maintenance Section */}
      <View className="p-4">
        <View className="bg-white rounded-lg p-4 border border-gray-200">
          <Text className="text-lg font-semibold mb-4">Maintenance</Text>

          {/* Maintenance Item */}
          <View className="flex-row items-center mb-3">
            <View className="w-4 h-4 border border-[#4A9DFF] rounded mr-2" />
            <Text>Leaky Toilet</Text>
          </View>

          {/* New Request Button */}
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="add-circle-outline" size={20} color="#4A9DFF" />
            <Text className="text-[#4A9DFF] ml-2">New Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
