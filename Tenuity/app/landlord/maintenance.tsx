import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Maintenance {
  id: number;
  title: string;
  description?: string;
  address: string;
  completed: boolean;
  image_url?: string;
}

export default function MaintenanceDetails() {
  const { id } = useLocalSearchParams();
  const { toggleSidebar } = useSidebar();
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

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
        setIsChecked(data.completed);
      }

      setLoading(false);
    };

    if (id) fetchMaintenance();
  }, [id]);

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from("maintenance-pictures")
      .getPublicUrl(imagePath);

    return data.publicUrl || "";
  };

  const handleCheckBoxChange = async () => {
    if (maintenance) {
      const { error } = await supabase
        .from("Maintenance")
        .update({ completed: !isChecked })
        .eq("id", maintenance.id);

      if (error) {
        console.error("Error updating maintenance:", error.message);
      } else {
        setMaintenance((prev) =>
          prev ? { ...prev, completed: !prev.completed } : null
        );
        setIsChecked(!isChecked);
      }
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-10 pb-5">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={30} color="black" />
        </TouchableOpacity>
        <Link href="../landlord/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[110px] h-[110px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
        <Link href="../landlord/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={30} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3ab7ff" />
      ) : maintenance ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-3">
            {maintenance.title}
          </Text>

          {/* Info Card */}
          <View className="bg-gray-50 rounded-2xl p-4 shadow-sm mb-6">
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Address</Text>
              <Text className="text-base text-gray-800">
                {maintenance.address}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Status</Text>
              <Text
                className={`text-base font-medium ${
                  isChecked ? "text-green-600" : "text-orange-500"
                }`}
              >
                {isChecked ? "Completed" : "Pending"}
              </Text>
            </View>

            <View>
              <Text className="text-sm text-gray-500 mb-1">Description</Text>
              <Text className="text-base text-gray-700">
                {maintenance.description || "No description provided."}
              </Text>
            </View>
          </View>

          {/* Images Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Images</Text>
            {maintenance.image_url ? (
              <Image
                source={{ uri: maintenance.image_url }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 16,
                  marginBottom: 15,
                }}
                resizeMode="cover"
              />
            ) : (
              <Text className="text-gray-600">No images uploaded.</Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <Text className="text-red-500 text-center">Maintenance not found.</Text>
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-3">
        <TouchableOpacity
          onPress={handleCheckBoxChange}
          className="w-[48%] flex-row items-center justify-center bg-gray-100 p-4 rounded-2xl"
        >
          <MaterialIcons
            name={isChecked ? "check-box" : "check-box-outline-blank"}
            size={28}
            color={isChecked ? "green" : "gray"}
          />
          <Text className="ml-3 text-base font-medium text-gray-700">
            Mark as Done
          </Text>
        </TouchableOpacity>

        <Link href="../landlord/tenantlist" asChild>
          <TouchableOpacity className="w-[48%] bg-blue-600 p-4 rounded-2xl flex-row items-center justify-center">
            <MaterialIcons name="message" size={28} color="white" />
            <Text className="ml-2 text-white font-medium text-base">
              Message
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
