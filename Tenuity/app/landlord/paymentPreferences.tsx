import React, { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import "../../global.css";
import { useRouter } from "expo-router";
import { supabase } from "../../utils/supabase";

export default function SignupLandlord() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            {/* Header */}
            <View className="items-center mb-8">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-[150px] h-[150px]"
                resizeMode="contain"
              />
            </View>

            {/* Signup Form */}
            <View className="border-2 border-[#38B6FF] rounded-lg p-4 mx-4">
              {/* First Name */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">First Name</Text>
              </View>

              {/* Last Name */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Last Name</Text>
              </View>

              {/* Phone Number */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Phone Number</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
