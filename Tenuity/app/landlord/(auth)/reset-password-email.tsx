import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { supabase } from "../../../utils/supabase";

export default function ResetPasswordScreen() {
  const { access_token } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (access_token) {
      // Optional: Auto-login with token
      supabase.auth
        .setSession({ access_token: access_token as string, refresh_token: "" })
        .then(({ error }) => {
          if (error) {
            Alert.alert("Error", error.message);
          }
        });
    }
  }, [access_token]);

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Password updated!");
      router.replace("/"); // Navigate home or login
    }
  };

  return (
    <View className="flex-1 justify-center items-center px-4">
      <Text className="text-xl font-bold mb-4">Reset your password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        onChangeText={setNewPassword}
        value={newPassword}
        className="w-full border rounded p-3 mb-4"
      />
      <Button title="Update Password" onPress={handlePasswordReset} />
    </View>
  );
}
