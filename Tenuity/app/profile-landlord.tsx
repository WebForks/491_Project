import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import "../global.css";

{
  /*TO DOS:
  - Add the ability to change profile picture
  - Add links to some of the pages
  - Connect to sidebar
  */
}

export default function ProfileLandlord() {
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>

        <Link href="/dashboard" asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Link>

        <Link href="/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Profile Details */}
      <View className="w-full max-w-sm border-2 border-[#38B6FF] rounded-lg p-4 mb-4 items-center mx-auto">
        <Text className="text-lg font-semibold mb-2">Jesse Pinkman</Text>
        <Image
          source={require("../assets/images/react-logo.png")}
          className="w-[150px] h-[150px] mb-2 rounded-full"
          resizeMode="cover"
        />
      </View>

      {/* Navigation Links */}
      <TouchableOpacity className="bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto">
        <Text className="text-white font-bold text-lg">Change Email</Text>
      </TouchableOpacity>

      <Link href="/reset-password" asChild>
        <TouchableOpacity className="bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto">
            <Text className="text-white font-bold text-lg">Change Password</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity className="bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto">
        <Text className="text-white font-bold text-lg">Payment Preferences</Text>
      </TouchableOpacity>

      <Link href="" asChild>
        <TouchableOpacity className="bg-red-500 w-[90%] py-4 rounded-2xl items-center mx-auto">
          <Text className="text-white font-bold text-lg">Logout</Text>
        </TouchableOpacity>
      </Link>

      {/* Footer */}
      <View className="items-center mt-8">
        <Text className="text-gray-500">Copyright @ Tenuity 2025</Text>
      </View>
    </SafeAreaView>
  );
}