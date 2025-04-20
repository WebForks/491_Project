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
import "../../../global.css";
import { useRouter } from "expo-router";
import { supabase } from "../../../utils/supabase";

export default function SignupLandlord() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const validateFirstName = () => {
    if (!/^[a-zA-Z]{1,50}$/.test(firstName)) {
      setErrors((prev) => ({
        ...prev,
        firstName:
          "First name must only contain letters and be up to 50 characters.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const validateLastName = () => {
    if (!/^[a-zA-Z]{1,50}$/.test(lastName)) {
      setErrors((prev) => ({
        ...prev,
        lastName:
          "Last name must only contain letters and be up to 50 characters.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };

  const validateEmail = () => {
    if (
      !/^[^\s@]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/.test(email)
    ) {
      setErrors((prev) => ({
        ...prev,
        email:
          "Email must end with @gmail.com, @yahoo.com, @outlook.com. or @hotmail.com",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePhoneNumber = () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Phone number must be exactly 10 digits.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phoneNumber: "" }));
    }
  };

  const validatePassword = () => {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{8,}$/.test(
        password,
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Registers the user on the supabase.auth system
  const handleRegister = async () => {
    validateFirstName();
    validateLastName();
    validateEmail();
    validatePhoneNumber();
    validatePassword();
    validateConfirmPassword();

    if (
      errors.firstName ||
      errors.lastName ||
      errors.email ||
      errors.phoneNumber ||
      errors.password ||
      errors.confirmPassword
    ) {
      Alert.alert(
        "Error",
        "Please fix the highlighted fields before registering.",
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.log("Error while creating user:", error);
    } else if (data) {
      console.log("Successfully created user!");
      const userEmail = data.user.email;
      const userId = data.user.id;
      addUserToLandlords(userEmail, userId);
    }
  };

  // Add authenticated users to the landlords table
  const addUserToLandlords = async (userEmail, userId) => {
    const { data, error } = await supabase.from("Landlords").insert({
      user_id: userId,
      email: userEmail,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
    });

    if (error) {
      console.log("Error while adding user to Landlords:", error);
    } else {
      console.log("User successfully has been added to Landlords table!", data);
      Alert.alert("Successfully created account!");
      router.navigate("../dashboard");
    }
  };

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
                source={require("../../../assets/images/logo.png")}
                className="w-[150px] h-[150px]"
                resizeMode="contain"
              />
            </View>

            {/* Signup Form */}
            <View className="border-2 border-[#38B6FF] rounded-lg p-4 mx-4">
              {/* First Name */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">First Name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  onBlur={validateFirstName}
                  className={`border-2 ${
                    errors.firstName ? "border-red-500" : "border-[#38B6FF]"
                  } rounded-lg p-2`}
                  placeholder="Enter your first name"
                  placeholderTextColor="#888"
                />
                {errors.firstName ? (
                  <Text className="text-red-500">{errors.firstName}</Text>
                ) : null}
              </View>

              {/* Last Name */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Last Name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  onBlur={validateLastName}
                  className={`border-2 ${
                    errors.lastName ? "border-red-500" : "border-[#38B6FF]"
                  } rounded-lg p-2`}
                  placeholder="Enter your last name"
                  placeholderTextColor="#888"
                />
                {errors.lastName ? (
                  <Text className="text-red-500">{errors.lastName}</Text>
                ) : null}
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onBlur={validateEmail}
                  className={`border-2 ${
                    errors.email ? "border-red-500" : "border-[#38B6FF]"
                  } rounded-lg p-2`}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  placeholderTextColor="#888"
                />
                {errors.email ? (
                  <Text className="text-red-500">{errors.email}</Text>
                ) : null}
              </View>

              {/* Phone Number */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Phone Number</Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onBlur={validatePhoneNumber}
                  className={`border-2 ${
                    errors.phoneNumber ? "border-red-500" : "border-[#38B6FF]"
                  } rounded-lg p-2`}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor="#890"
                />
                {errors.phoneNumber ? (
                  <Text className="text-red-500">{errors.phoneNumber}</Text>
                ) : null}
              </View>

              {/* Password */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Password</Text>
                <Text className="text-left text-sm mb-1">
                  8 characters minimum, uppercase letter, lowercase letter, and
                  special character (e.g., !, @, #, $, -)
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onBlur={validatePassword}
                  className={`border-2 ${
                    errors.password ? "border-red-500" : "border-[#38B6FF]"
                  } rounded-lg p-2`}
                  placeholder="Enter your password"
                  secureTextEntry
                  placeholderTextColor="#888"
                />
                {errors.password ? (
                  <Text className="text-red-500">{errors.password}</Text>
                ) : null}
              </View>

              {/* Confirm Password */}
              <View className="mb-4">
                <Text className="text-left text-lg mb-1">Confirm Password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={validateConfirmPassword}
                  className={`border-2 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#38B6FF]"
                  } rounded-lg p-2`}
                  placeholder="Confirm your password"
                  secureTextEntry
                  placeholderTextColor="#888"
                />
                {errors.confirmPassword ? (
                  <Text className="text-red-500">{errors.confirmPassword}</Text>
                ) : null}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                className="bg-[#38B6FF] w-full py-4 rounded-2xl items-center mb-4"
              >
                <Text className="text-white font-bold text-lg">Register</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

