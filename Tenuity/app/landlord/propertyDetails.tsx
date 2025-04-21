import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import Sidebar from "../components/sidebar"; // Adjust path if needed

const PropertyDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View className="flex-1 bg-white p-4">
      {/* ✅ Top Navigation Bar */}
      <View className="flex-row justify-between items-center mb-4 relative">
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/logo.png")}
          className="w-[100px] h-[100px]"
          resizeMode="contain"
        />

        <Link href="./profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* ✅ Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 📌 Property Details Content Goes Here */}
      <View className="mt-6">
        <Text className="text-2xl font-semibold">Property Details</Text>
        {/* Add actual property data and design layout here */}
      </View>
    </View>
  );
};

export default PropertyDetails;
