import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import "../../global.css";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout";

export default function Maintenance() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Image selection failed. Please try again.");
      console.error("ImagePicker error:", error);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `maintenance_${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from("maintenance-pictures")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("maintenance-pictures")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);
  
    console.log("Submit button clicked");
  
    // Validate form fields
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the maintenance request.");
      console.log("Validation failed: Title is missing");
      return;
    }
  
    if (!description.trim()) {
      Alert.alert(
        "Error",
        "Please enter a description for the maintenance request."
      );
      console.log("Validation failed: Description is missing");
      return;
    }
  
    if (!image) {
      Alert.alert("Error", "Please attach an image for the maintenance request.");
      console.log("Validation failed: Image is missing");
      return;
    }
  
    try {
      console.log("Submitting maintenance request...");
  
      // Step 1: Get the current user's UUID (tenant_uuid)
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();
  
      if (sessionError) {
        console.error("Session error:", sessionError);
        Alert.alert("Error", "Failed to retrieve user session. Please log in again.");
        return;
      }
  
      if (!user) {
        Alert.alert("Error", "User not found. Please log in again.");
        console.log("Validation failed: User not found");
        return;
      }
  
      const tenantUuid = user.id; // Dynamically retrieve tenant UUID
      console.log("Tenant UUID:", tenantUuid);
  
      // Step 2: Fetch landlord_id from Tenants table
      const { data: tenantData, error: tenantError } = await supabase
        .from("Tenants")
        .select("landlord_id") // Fetch landlord_id (landlord_uuid)
        .eq("user_id", tenantUuid)
        .single();
  
      if (tenantError) {
        console.error("Tenant data error:", tenantError);
        Alert.alert("Error", "Failed to retrieve tenant data. Please try again.");
        return;
      }
  
      const landlordUuid = tenantData?.landlord_id;
  
      if (!landlordUuid) {
        Alert.alert("Error", "Incomplete tenant data. Please contact support.");
        console.log("Validation failed: Incomplete tenant data");
        return;
      }
  
      console.log("Landlord UUID:", landlordUuid);
  
      // Use a default address for now
      const address = "Unknown Address";
  
      // Step 4: Upload the image
      console.log("Uploading image...");
      const uploadedImageUrl = await uploadImage(image);
      console.log("Image uploaded:", uploadedImageUrl);
  
      // Step 5: Insert the maintenance request into the database
      console.log("Inserting maintenance request...");
      const { data, error } = await supabase.from("Maintenance").insert([
        {
          title,
          description,
          image_url: uploadedImageUrl,
          tenant_uuid: tenantUuid,
          landlord_uuid: landlordUuid,
          address: address, // Use the default address
          completed: false,
          created_at: new Date().toISOString(),
        },
      ]);
  
      if (error) {
        console.error("Insert error:", error);
        Alert.alert("Error", "Failed to submit maintenance request. Please try again.");
        return;
      }
  
      console.log("Maintenance request inserted:", data);
  
      // Success feedback
      Alert.alert("Success", "Maintenance request submitted!");
      setTitle("");
      setDescription("");
      setImage(null);
      setFormSubmitted(false);
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Submission error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={toggleSidebar}>
            <Entypo name="menu" size={35} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./dashboard")}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./profile-tenant")}>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-center mb-6">
          Report an Issue
        </Text>

        {/* Maintenance Form */}
        <View className="space-y-4">
          <TextInput
            className="border p-3 rounded"
            style={{
              borderColor:
                formSubmitted && (!title.trim() || title.length > 50)
                  ? "red"
                  : "#38B6FF",
              borderWidth: 1,
            }}
            placeholder="Enter issue title (max 50 characters)"
            value={title}
            onChangeText={(text) => {
              if (text.length <= 50) {
                setTitle(text);
              }
            }}
          />
          {formSubmitted && title.length > 50 && (
            <Text className="text-red-500 text-sm">
              Title cannot exceed 50 characters.
            </Text>
          )}
          {formSubmitted && !title.trim() && (
            <Text className="text-red-500 text-sm">Title is required.</Text>
          )}

          <TextInput
            className="border p-3 rounded"
            style={{
              borderColor:
                formSubmitted && (!description.trim() || description.length > 250)
                  ? "red"
                  : "#38B6FF",
              borderWidth: 1,
            }}
            placeholder="Enter issue description (max 250 characters)"
            value={description}
            onChangeText={(text) => {
              if (text.length <= 250) {
                setDescription(text);
              }
            }}
            multiline
            numberOfLines={4}
          />
          {formSubmitted && description.length > 250 && (
            <Text className="text-red-500 text-sm">
              Description cannot exceed 250 characters.
            </Text>
          )}
          {formSubmitted && !description.trim() && (
            <Text className="text-red-500 text-sm">Description is required.</Text>
          )}

          <TouchableOpacity
            onPress={pickImage}
            className="flex-row items-center space-x-2"
          >
            <Ionicons name="camera-outline" size={24} color="#38B6FF" />
            <Text className="text-gray-600">
              {image ? "Change Image" : "Attach Image"}
            </Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 200, borderRadius: 8 }}
              resizeMode="cover"
            />
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-500 p-4 rounded-lg items-center"
          >
            <Text className="text-white font-bold text-lg">Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}