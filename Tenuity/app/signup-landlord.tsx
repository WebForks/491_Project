import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from "react-native";
import "../global.css";

export default function SignupLandlord() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Change this to "export default function Register" instead of const after backend is implemented
  const Register = () => {
    // Handle backend of the registration
  };

  return (
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
          <Text className="text-left text-lg mb-1">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
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
          <Text className="text-left text-sm mb-1">8 characters minimum, uppercase letter, lowercase letter, and special character (e.g., !, @, #, $)</Text>
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

        <TouchableOpacity
          onPress={Register}
          className="bg-[#38B6FF] w-full py-4 rounded-2xl items-center mb-4"
        >
          <Text className="text-white font-bold text-lg">Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}