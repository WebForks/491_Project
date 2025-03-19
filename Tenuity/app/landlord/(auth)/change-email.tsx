// tenuity/apps/landlord/(auth)/change-email.tsx
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

export default function ChangeEmail() {
  // first time the email is entered
  const [newEmail, setNewEmail] = useState("");
  // Email confirmation
  const [confirmEmail, setConfirmEmail] = useState("");

  // Changes the users Email upon clicking "change email"
  async function changeEmail() {
    // First need to do a check to make sure the two emails are the same
    if (newEmail === confirmEmail) {
      // Also need to make sure that the emails follow the pre-defined schema
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        console.log("Error while changing email:", error);
        Alert.alert("Error while changing email!");
      } else {
        Alert.alert("Successfully changed email!");
        console.log("Successfully changed email!");
        // navigating to the dashboard -- assuming user changed email from profile screen
        router.navigate("../dashboard");
        // in that case the user should be directed back to the login screen
      }
    } else {
      // Alert on phone -- for testing purposes only!
      Alert.alert("Emails Don't Match!");
      // Terminal error
      console.log("Emails Don't Match!");
    }
  }

  return (
    <View className="flex-1 bg-white px-4 justify-center items-center">
      {/* Logo & Title */}
      <View className="items-center mb-8">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="w-[100px] h-[100px] mb-2"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold">Tenuity</Text>
      </View>

      {/* Form Container */}
      <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">Enter New Email</Text>

        {/* New Email Field */}
        <TextInput
          placeholder="New Email"
          value={newEmail}
          onChangeText={setNewEmail}
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-3"
        />

        {/* Repeat New Email Field */}
        <TextInput
          placeholder="Repeat New Email"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
          secureTextEntry
          className="border border-blue-300 rounded p-3 mb-4"
        />

        {/* Change Email Button */}
        <TouchableOpacity
          onPress={changeEmail}
          className="bg-blue-500 w-full py-3 rounded items-center"
        >
          <Text className="text-white font-bold">Change Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}