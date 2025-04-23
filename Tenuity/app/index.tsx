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
// Testing
import * as Linking from "expo-linking";

export default function App() {
  // Variables used for facilitating signin logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // Used to determine which type of account is being signed in to
  const [isLandlord, setIsLandlord] = useState(true);

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

  async function checkRole() {
    const { data, error } = await supabase
      .from("Landlords")
      .select("id") // only select the ID to minimize data returned
      .eq("email", email.toLowerCase())
      .limit(1); // optimization: don't scan the whole table

    if (error) {
      console.error("Error querying:", error);
    } else if (data.length > 0) {
      return true;
    }
    return false;
  }

  // Signing in
  async function signIn() {
    // Testing Deep Linking
    const prefix = Linking.createURL("/");
    //
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed :(", error.message);
    } else {
      // Navigating the user to their respective dashboard once they login
      // Depending if they have the button toggled or not
      const isUserLandlord = await checkRole();
      if (isLandlord && isUserLandlord) {
        router.navigate("./landlord/dashboard");
        Alert.alert("Success", "You are signed in!");
      } else if (!isLandlord && !isUserLandlord) {
        router.navigate("/tenant/dashboard");
      } else {
        Alert.alert("Invalid account types!");
      }
    }
    setLoading(false);
  }

  function redirectToSignup() {
    if (isLandlord) {
      router.navigate("/landlord/(auth)/signup-landlord");
    } else {
      router.navigate("/tenant/(auth)/signup-tenant");
    }
  }

  function redirectToForgotPassword() {
    if (isLandlord) {
      router.navigate("/landlord/(auth)/forgot-password");
    } else {
      router.navigate("/tenant/(auth)/forgot-password");
    }
  }

  return (
    <View className="flex-1 bg-white items-center justify-center px-4">
      {/* Logo & Title */}
      <TouchableOpacity className="items-center mb-8">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[170px] h-[170px] mb-1"
          resizeMode="contain"
        />
      </TouchableOpacity>

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
        <TouchableOpacity className="mb-2" onPress={redirectToForgotPassword}>
          <Text className="text-blue-500 text-center">Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-4" onPress={redirectToSignup}>
          <Text className="text-blue-500 text-center">Create Account</Text>
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
