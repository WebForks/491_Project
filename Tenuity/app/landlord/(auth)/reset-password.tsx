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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";

export default function ResetPassword() {
  // first time the password is entered
  const [newPassword, setNewPassword] = useState("");
  // password confirmation
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Validate the new password
  const validateNewPassword = () => {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/.test(
        newPassword,
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character (e.g., !, @, #, $, -, _).",
      }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  // Validate that the passwords match
  const validateConfirmPassword = () => {
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Changes the user's password upon clicking "Reset Password"
  async function changePassword() {
    // Validate both fields before proceeding
    validateNewPassword();
    validateConfirmPassword();

    if (errors.newPassword || errors.confirmPassword) {
      Alert.alert(
        "Error",
        "Please fix the highlighted fields before proceeding.",
      );
      return;
    }

    // Proceed with password change
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log("Error while changing password:", error);
      Alert.alert("Error while changing password!");
    } else {
      Alert.alert("Successfully changed password!");
      console.log("Successfully changed password!");
      // navigating to the dashboard -- assuming user changed password from profile screen
      router.navigate("../dashboard");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 justify-center items-center px-4">
              {/* Logo & Title */}
              <TouchableOpacity
                className="items-center mb-8"
                onPress={() => router.navigate("/landlord/dashboard")}
              >
                <Image
                  source={require("../../../assets/images/logo.png")}
                  className="w-[100px] h-[100px] mb-2"
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Form Container */}
              <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
                <Text className="text-base font-semibold mb-2">
                  Enter New Password
                </Text>

                {/* New Password Field */}
                <Text className="text-left text-sm mb-2 text-gray-500">
                  Password must be at least 8 characters long, include an
                  uppercase letter, a lowercase letter, a number, and a special
                  character (e.g., !, @, #, $, -, _).
                </Text>
                <TextInput
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onBlur={validateNewPassword}
                  secureTextEntry
                  className={`border-2 ${
                    errors.newPassword ? "border-red-500" : "border-blue-300"
                  } rounded p-3 mb-1`}
                />
                {errors.newPassword ? (
                  <Text className="text-red-500 mb-3">
                    {errors.newPassword}
                  </Text>
                ) : null}

                {/* Repeat New Password Field */}
                <TextInput
                  placeholder="Repeat New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={validateConfirmPassword}
                  secureTextEntry
                  className={`border-2 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-blue-300"
                  } rounded p-3 mb-1`}
                />
                {errors.confirmPassword ? (
                  <Text className="text-red-500 mb-3">
                    {errors.confirmPassword}
                  </Text>
                ) : null}

                {/* Reset Password Button */}
                <TouchableOpacity
                  onPress={changePassword}
                  className="bg-blue-500 w-full py-3 rounded items-center"
                >
                  <Text className="text-white font-bold">Reset Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
