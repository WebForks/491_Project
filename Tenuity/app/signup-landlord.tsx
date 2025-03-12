/* TO DOS:
  - Make the footer white like the rest of the page
  - Figure out how to prevent the keyboard from covering the input fields
*/
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
} from "react-native";
import "../global.css";
import { Link } from "expo-router";
import { supabase } from "../utils/supabase";

export default function SignupLandlord() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Registers the user on the supabase.auth system
  const handleRegister = async () => {
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
      id: userId,
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
    }
  };

  return (
    <ScrollView>
      <SafeAreaView className="flex-1 bg-white p-4">
        {/* Header */}
        <View className="items-center mb-8">
          <Image
            source={require("../assets/images/logo.png")}
            className="w-[150px] h-[150px]"
            resizeMode="contain"
          />
        </View>

        {/* Signup Form */}
        <View className="border-2 border-[#38B6FF] rounded-lg p-4 mx-4">
          <View className="mb-4">
            <Text className="text-left text-lg mb-1">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="border-2 border-[#38B6FF] rounded-lg p-2"
              placeholder="Enter your name"
              placeholderTextColor="#888"
            />
          </View>

          <View className="mb-4">
            <Text className="text-left text-lg mb-1">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="border-2 border-[#38B6FF] rounded-lg p-2"
              placeholder="Enter your name"
              placeholderTextColor="#888"
            />
          </View>

          <View className="mb-4">
            <Text className="text-left text-lg mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="border-2 border-[#38B6FF] rounded-lg p-2"
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
          </View>

          <View className="mb-4">
            <Text className="text-left text-lg mb-1">Phone Number</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              className="border-2 border-[#38B6FF] rounded-lg p-2"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor="#888"
            />
          </View>

          <View className="mb-4">
            <Text className="text-left text-lg mb-1">Password</Text>
            <Text className="text-left text-sm mb-1">
              8 characters minimum, uppercase letter, lowercase letter, and
              special character (e.g., !, @, #, $)
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              className="border-2 border-[#38B6FF] rounded-lg p-2"
              placeholder="Enter your password"
              secureTextEntry
              placeholderTextColor="#888"
            />
          </View>

          <View className="mb-4">
            <Text className="text-left text-lg mb-1">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              className="border-2 border-[#38B6FF] rounded-lg p-2"
              placeholder="Confirm your password"
              secureTextEntry
              placeholderTextColor="#888"
            />
          </View>
          <Link href="" asChild>
            <TouchableOpacity
              onPress={handleRegister}
              className="bg-[#38B6FF] w-full py-4 rounded-2xl items-center mb-4"
            >
              <Text className="text-white font-bold text-lg">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

