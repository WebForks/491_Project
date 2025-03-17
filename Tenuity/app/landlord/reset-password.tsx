// tenuity/apps/reset-password.tsx
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default function ResetPassword() {
  // first time the password is entered
  const [newPassword, setNewPassword] = useState("");
  // password confirmation
  const [confirmPassword, setConfirmPassword] = useState("");

  // Changes the users password upon clicking "Reset Password"
  async function changePassword() {
    // First need to do a check to make sure the two passwords are the same
    if (newPassword === confirmPassword) {
      // Also need to make sure that the passwords follow the pre-defined schema
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.log("Error while changing password:", error);
        Alert.alert("Error while changing password!");
      } else {
        Alert.alert("Successfull changed password!");
        console.log("Successfull changed password!");
        // navigating to the dashboard -- assuming user changed password from profile screen
        router.navigate("/profile-landlord");
        // There needs to be a check if the user came here from a "forgot password" email
        // in that case the user should be directed back to the login screen
      }
    } else {
      // Alert on phone -- for testing purposes only!
      Alert.alert("Passwords Don't Match!");
      // Terminal error
      console.log("Passwords Don't Match!");
    }
  }

  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {/* Logo & Title */}
      <View className="items-center mb-8">
        <Image
          source={require("../../assets/images/logo.png")}
          className="w-[100px] h-[100px] mb-2"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold">Tenuity</Text>
      </View>

      {/* Form Container */}
      <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">Enter New Password</Text>

        {/* New Password Field */}
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-3"
        />

        {/* Repeat New Password Field */}
        <TextInput
          placeholder="Repeat New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-4"
        />

        {/* Reset Password Button */}
        <TouchableOpacity
          onPress={changePassword}
          className="bg-blue-500 w-full py-3 rounded items-center"
        >
          <Text className="text-white font-bold">Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
