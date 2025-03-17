// tenuity/apps/forgot-password.tsx
import { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Link } from "expo-router";
import "../../../global.css";
import { supabase } from "@/utils/supabase";

// If you're using expo-router Link component, you can import it:
// import { Link } from "expo-router";

export default function ForgotPassword() {
  // Variable to hold the user entered email address
  const [email, setEmail] = useState("");

  // Sends email password reset request to user's email
  async function handleResetPassword() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "exp://localhost:8081/reset-password",
    });

    if (error) {
      // Keep this only for testing
      Alert.alert("Error:", error.message);
    } else {
      Alert.alert("Password reset email has been sent!");
    }
  }

  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {/* Logo & Title */}
      <View className="items-center mb-8">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-[170px] h-[170px] mb-2"
          resizeMode="contain"
        />
      </View>

      {/* Heading & Description */}
      <Text className="text-lg font-semibold mb-1">Forgot password?</Text>
      <Text className="text-base text-center mb-6">
        Enter your email to be sent a link to recover your password.
      </Text>

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

        {/* Submit Button */}
        <Link href="" asChild>
          <TouchableOpacity
            onPress={handleResetPassword}
            className="bg-blue-500 w-full py-3 rounded items-center mb-4"
          >
            <Text className="text-white font-bold">Submit</Text>
          </TouchableOpacity>
        </Link>

        {/* Login & Create Account */}
        <TouchableOpacity className="mb-2">
          <Text className="text-blue-500 text-center">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
