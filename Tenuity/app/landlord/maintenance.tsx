import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import MaterialIcons for check/uncheck icons

interface Maintenance {
  id: number;
  title: string;
  description?: string;
  address: string;
  completed: boolean;
  image_url?: string[]; // Assuming your Supabase data stores multiple image URLs
}

export default function MaintenanceDetails() {
  const { id } = useLocalSearchParams();
  const { toggleSidebar } = useSidebar();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(maintenance?.completed || false);

  useEffect(() => {
    const fetchMaintenance = async () => {
      const { data, error } = await supabase
        .from("Maintenance")
        .select("id, title, description, address, completed, image_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching maintenance:", error.message);
      } else {
        setMaintenance(data);
        setIsChecked(data.completed); // Update the checkbox state
      }

      setLoading(false);
    };

    if (id) fetchMaintenance();
  }, [id]);

  // Function to fetch image URL from Supabase Storage
  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from("maintenance-pictures") // Replace with your bucket name
      .getPublicUrl(imagePath);

    return data.publicUrl || "";
  };

  // Function to mark the maintenance as completed when checkbox is checked
  const handleCheckBoxChange = async () => {
    if (maintenance) {
      const { error } = await supabase
        .from("Maintenance")
        .update({ completed: !isChecked }) // Toggle completion status
        .eq("id", maintenance.id);

      if (error) {
        console.error("Error updating maintenance:", error.message);
      } else {
        // Refresh the data after updating
        setMaintenance((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
        setIsChecked(!isChecked); // Toggle the checkbox state
      }
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="../landlord/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[120px] h-[120px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
        <Link href="./profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3ab7ff" />
      ) : maintenance ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Title */}
          <Text className="text-3xl font-semibold mb-4 text-gray-900">{maintenance.title}</Text>
          
          {/* Address */}
          <View className="mb-3">
            <Text className="text-lg text-gray-700">Address</Text>
            <Text className="text-base text-gray-600">{maintenance.address}</Text>
          </View>
          
          {/* Status */}
          <View className="mb-3">
            <Text className="text-lg text-gray-700">Status</Text>
            <Text className={`text-base ${maintenance.completed ? 'text-green-500' : 'text-red-500'}`}>
              {maintenance.completed ? "Completed" : "Pending"}
            </Text>
          </View>
          
          {/* Description */}
          <View className="mb-5">
            <Text className="text-lg text-gray-700">Description</Text>
            <Text className="text-base text-gray-600">
              {maintenance.description || "No description provided."}
            </Text>
          </View>

          {/* Images Section */}
          <View>
            <Text className="text-lg font-semibold text-gray-700 mb-3">Images</Text>
            {maintenance.image_url && maintenance.image_url.length > 0 ? (
              maintenance.image_url.map((imagePath, index) => {
                const imageUrl = getImageUrl(imagePath); // Fetch image URL

                return (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={{ width: "100%", height: 250, marginBottom: 15, borderRadius: 10 }}
                    resizeMode="cover"
                  />
                );
              })
            ) : (
              <Text className="text-base text-gray-600">No images available for this maintenance.</Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <Text className="text-red-500 text-center">Maintenance not found.</Text>
      )}

      {/* Buttons Row */}
      <View className="flex-row justify-between mt-">
        {/* Custom Checkbox for Marking as Done */}
        <TouchableOpacity
          onPress={handleCheckBoxChange}
          className="w-[48%] flex-row items-center justify-center bg-gray-100 p-4 rounded-lg"
        >
          <MaterialIcons
            name={isChecked ? "check-box" : "check-box-outline-blank"}
            size={30}
            color={isChecked ? "green" : "gray"}
          />
          <Text className="ml-3 text-lg text-gray-700">Mark as Done</Text>
        </TouchableOpacity>

        {/* Message Icon */}
        <Link href="./tenantlist" asChild>
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg w-[48%] flex-row items-center justify-center">
            <MaterialIcons name="message" size={30} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
