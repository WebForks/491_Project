// Tenuity/app/index.tsx (or App.tsx if you're not using file-based routing)
import React, { useState, useEffect } from "react";
import {
  Alert,
  AppState,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import "../global.css";
import { supabase } from "../utils/supabase";

export default function App() {
  const [isLandlord, setIsLandlord] = useState(true);

  // Variables used for facilitating signin logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Start/stop auto-refresh based on app state
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      if (state == "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    return () => listener.remove();
  }, []);

  // Signing in
  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed :(", error.message);
    } else {
      // Keep this only for testing
      Alert.alert("Success", "You are signed in!");
      // Navigating the user to their respective dashboard once they login
      router.navigate("./landlord/dashboard");
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white items-center justify-center px-4">
      {/* Logo & Title */}
      <View className="items-center mb-8">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[170px] h-[170px] mb-1"
          resizeMode="contain"
        />
      </View>

      {/* Form Container */}
      <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
        {/* Email Field */}
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-blue-300 rounded p-3 mb-3"
          value={email}
          onChangeText={setEmail}
        />
        {/* Password Field */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-4"
          value={password}
          onChangeText={setPassword}
        />

        {/* Sign In Button */}
        <TouchableOpacity
          className="bg-blue-500 w-full py-3 rounded items-center mb-4"
          onPress={signIn}
        >
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>

        {/* Forgot Password & Create Account */}
        <TouchableOpacity className="mb-2">
          <Link href="./landlord/(auth)/forgot-password">
            <Text className="text-blue-500 text-center">Forgot password?</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity className="mb-4">
          <Link href="./landlord/(auth)/signup-landlord">
            <Text className="text-blue-500 text-center">Create Account</Text>
          </Link>
        </TouchableOpacity>

        {/* Landlord/Tenant Toggle */}
        <View className="flex-row justify-center">
          <TouchableOpacity
            onPress={() => setIsLandlord(true)}
            className={`px-4 py-2 rounded-l ${
              isLandlord ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text
              className={`font-bold ${
                isLandlord ? "text-white" : "text-black"
              }`}
            >
              LL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsLandlord(false)}
            className={`px-4 py-2 rounded-r ${
              !isLandlord ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text
              className={`font-bold ${
                !isLandlord ? "text-white" : "text-black"
              }`}
            >
              TE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
