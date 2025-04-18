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

export default function ChangeEmail() {
  // first time the email is entered
  const [newEmail, setNewEmail] = useState("");
  // Email confirmation
  const [confirmEmail, setConfirmEmail] = useState("");

  const [errors, setErrors] = useState({
    newEmail: "",
    confirmEmail: "",
  });

  const validateNewEmail = () => {
    if (!/^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)$/.test(newEmail)) {
      setErrors((prev) => ({
        ...prev,
        newEmail: "Email must end with @gmail.com, @yahoo.com, @outlook.com, or @hotmail.com.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, newEmail: "" }));
    }
  };

  const validateConfirmEmail = () => {
    if (newEmail !== confirmEmail) {
      setErrors((prev) => ({
        ...prev,
        confirmEmail: "Emails do not match.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmEmail: "" }));
    }
  };

  async function changeEmail() {
    // Validate the new email and confirm email before proceeding
    validateNewEmail();
    validateConfirmEmail();

    if (errors.newEmail || errors.confirmEmail) {
      Alert.alert("Error", "Please fix the highlighted fields before proceeding.");
      return;
    }

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
              <View className="items-center mb-8">
                <Image
                  source={require("../../../assets/images/logo.png")}
                  className="w-[100px] h-[100px] mb-2"
                  resizeMode="contain"
                />
              </View>

              {/* Form Container */}
              <View className="w-full max-w-sm border-2 border-blue-300 rounded-lg p-4">
                <Text className="text-base font-semibold mb-2">Enter New Email</Text>

                {/* New Email Field */}
                <TextInput
                  placeholder="New Email"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  onBlur={validateNewEmail}
                  className={`border-2 ${
                    errors.newEmail ? "border-red-500" : "border-blue-300"
                  } rounded p-3 mb-1`}
                />
                {errors.newEmail ? (
                  <Text className="text-red-500 mb-3">{errors.newEmail}</Text>
                ) : null}

                {/* Repeat New Email Field */}
                <TextInput
                  placeholder="Repeat New Email"
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  onBlur={validateConfirmEmail}
                  className={`border-2 ${
                    errors.confirmEmail ? "border-red-500" : "border-blue-300"
                  } rounded p-3 mb-1`}
                />
                {errors.confirmEmail ? (
                  <Text className="text-red-500 mb-3">{errors.confirmEmail}</Text>
                ) : null}

                {/* Change Email Button */}
                <TouchableOpacity
                  onPress={changeEmail}
                  className="bg-blue-500 w-full py-3 rounded items-center"
                >
                  <Text className="text-white font-bold">Change Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

