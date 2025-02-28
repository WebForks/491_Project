import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import "../global.css";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// If you need icons, you can install and import them from @expo/vector-icons,
// but here we’ll use simple text placeholders for demonstration.

export default function Dashboard() {
  const [selectedProperty1, setSelectedProperty1] = useState(false);
  const [selectedProperty2, setSelectedProperty2] = useState(false);
  const [selectedIssue1, setSelectedIssue1] = useState(false);
  const [selectedIssue2, setSelectedIssue2] = useState(false);

  return (
    <View className="flex-1 bg-white p-4">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          {/* Replace with an icon (e.g., Ionicons) if desired */}
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        <Link href="/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-xl mb-2">Properties</Text>

        {/* Property 1 */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setSelectedProperty1(!selectedProperty1)}
              className={`w-5 h-5 rounded-full border border-blue-300 mr-2 ${
                selectedProperty1 ? "bg-blue-500" : ""
              }`}
            />
            <Text className="text-lg">123 Sesame St. Long Beach, CA</Text>
          </View>
          <MaterialCommunityIcons name="message" size={28} color="#3ab7ff" />
        </View>

        {/* Property 2 */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setSelectedProperty2(!selectedProperty2)}
              className={`w-5 h-5 rounded-full border border-blue-300 mr-2 ${
                selectedProperty2 ? "bg-blue-500" : ""
              }`}
            />
            <Text className="text-lg">234 Cherry Ave. Long Beach, CA</Text>
          </View>
          <MaterialCommunityIcons name="message" size={28} color="#3ab7ff" />
        </View>

        {/* Add New Property */}
        <View className="flex-row items-center">
          <Ionicons name="add-outline" size={24} color="#3ab7ff" />
          <View>
            <Text className="font-semibold text-lg">New</Text>
            <Text className="text-gray-500 text-base">Add new property</Text>
          </View>
        </View>
      </View>

      {/* Maintenance Section */}
      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-xl mb-2">Maintenance</Text>

        {/* Maintenance Issue 1 */}
        <View className="flex-row items-center mb-3">
          <Pressable
            onPress={() => setSelectedIssue1(!selectedIssue1)}
            className="w-5 h-5 border border-blue-300 mr-2 flex justify-center items-center"
          >
            {selectedIssue1 && (
              <MaterialCommunityIcons name="check" size={16} color="blue" />
            )}
          </Pressable>
          <View>
            <Text className="font-semibold text-lg">Leaky Toilet</Text>
            <Text className="text-gray-500 text-base">
              234 Cherry Ave. Long Beach CA
            </Text>
          </View>
        </View>

        {/* Maintenance Issue 2 */}
        <View className="flex-row items-center">
          <Pressable
            onPress={() => setSelectedIssue2(!selectedIssue2)}
            className="w-5 h-5 border border-blue-300 mr-2 flex justify-center items-center"
          >
            {selectedIssue2 && (
              <MaterialCommunityIcons name="check" size={16} color="blue" />
            )}
          </Pressable>
          <View>
            <Text className="font-semibold text-lg">Broken Garage Door</Text>
            <Text className="text-gray-500 text-base">
              234 Cherry Ave. Long Beach CA
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Bar (e.g., Quick Actions) */}
      <View className="flex-row justify-around mt-auto">
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
          <MaterialIcons name="attach-money" size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
          <Ionicons name="documents" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
