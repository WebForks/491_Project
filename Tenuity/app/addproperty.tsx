import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import "../global.css";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function addproperty() {
  const [propertyName, setPropertyName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Function to handle image selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        
        <Link href="/dashboard" asChild>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Link>

        <Link href="/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

     
      {/* Property Name Input */}
      <Text className="text-lg">Address</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Full Address"
        value={propertyName}
        onChangeText={setPropertyName}
      />

      {/* Bedroom Count */}
      <Text className="text-lg">Bedroom Count</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Count"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Bathroom Count */}
      <Text className="text-lg">Bathrom Count</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Count"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Description Input */}
      <Text className="text-lg">Property Description</Text>
      <TextInput
        className="border border-blue-300 p-7 rounded mb-4"
        placeholder="Detailed Information"
        multiline
        value={description}
        onChangeText={setDescription}
      />


      {/* Image Upload */}
      <TouchableOpacity
        onPress={pickImage}
        className="flex-row items-center space-x-2"
      >
          <AntDesign name="plussquareo" size={15} color="black" />
          <Text className="text-gray-600 ">
          {image ? "  Change Images" : "  Attach Images"}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          className="w-full h-[200px] rounded-lg mb-4"
          resizeMode="cover"
        />
      )}

      {/* Tenant Name */}
      <Text className="text-lg">Tenant Name</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Full Name"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Tenant E,ao; */}
      <Text className="text-lg">Tenant Email</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Email"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Save Property Button */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex items-center">
          <Text className="text-white text-lg font-semibold">Add Property</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
