import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

// If you need icons, you can install and import them from @expo/vector-icons,
// but here we’ll use simple text placeholders for demonstration.

export default function Dashboard() {
  return (
    <View className="flex-1 bg-white p-4">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          {/* Replace with an icon (e.g., Ionicons) if desired */}
          <Text className="text-2xl">☰</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[60px] h-[60px]"
          resizeMode="contain"
        />
        <TouchableOpacity>
          {/* Placeholder for a profile or menu icon */}
          <Text className="text-2xl">◎</Text>
        </TouchableOpacity>
      </View>

      {/* Properties Section */}
      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-lg mb-2">Properties</Text>

        {/* Property 1 */}
        <View className="flex-row justify-between items-center mb-2">
          <Text>123 Sesame St. Long Beach, CA</Text>
          <TouchableOpacity className="w-5 h-5 border border-blue-300 rounded" />
        </View>

        {/* Property 2 */}
        <View className="flex-row justify-between items-center mb-2">
          <Text>234 Cherry Ave. Long Beach, CA</Text>
          <TouchableOpacity className="w-5 h-5 border border-blue-300 rounded" />
        </View>

        {/* Add New Property */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-semibold">New</Text>
            <Text className="text-gray-500">Add new property</Text>
          </View>
          <TouchableOpacity className="w-5 h-5 border border-blue-300 rounded" />
        </View>
      </View>

      {/* Maintenance Section */}
      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-lg mb-2">Maintenance</Text>

        {/* Maintenance Issue 1 */}
        <View className="mb-2">
          <Text className="font-semibold">Leaky Toilet</Text>
          <Text className="text-gray-500">234 Cherry Ave. Long Beach CA</Text>
        </View>

        {/* Maintenance Issue 2 */}
        <View>
          <Text className="font-semibold">Broken Garage Door</Text>
          <Text className="text-gray-500">234 Cherry Ave. Long Beach CA</Text>
        </View>
      </View>

      {/* Bottom Bar (e.g., Quick Actions) */}
      <View className="flex-row justify-around mt-auto">
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
          <Text className="text-white mr-2">📈</Text>
          {/* <Ionicons name="stats-chart" size={20} color="#fff" /> */}
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
          <Text className="text-white mr-2">✍</Text>
          {/* <Ionicons name="create" size={20} color="#fff" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}
