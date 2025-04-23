import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import Sidebar from "../components/sidebar"; // Adjust path if needed
import { supabase } from "../../utils/supabase";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import MaterialIcons for check/uncheck icons

const PropertyDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useLocalSearchParams(); // Get property ID from route params

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("Properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
      } else {
        setProperty(data);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  return (
    <View className="flex-1 bg-white p-4">
      {/* ✅ Top Navigation Bar */}
      <View className="flex-row justify-between items-center mb-4 relative">
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>

        <Image
          source={require("../../assets/images/logo.png")}
          className="w-[100px] h-[100px]"
          resizeMode="contain"
        />

        <Link href="./profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* 📌 Property Details */}
      <ScrollView className="mt-6">
        <Text className="text-2xl font-semibold mb-4">Property Details</Text>

        {loading ? (
          <Text className="text-gray-500">Loading...</Text>
        ) : property ? (
          <View className="border border-blue-500 bg-blue-100/30 rounded-xl p-4 space-y-4">
            {/* Address */}
            <Text className="text-xl font-bold">{property.address}</Text>

            {/* First Image */}
            {property.image_url && (
              <Image
                source={{ uri: property.image_url }}
                className="w-full h-48 rounded-xl"
                resizeMode="cover"
              />
            )}

            {/* Bedroom / Bathroom */}
            <View className="flex-row justify-between">
              <Text className="text-lg pt-2">
                {property.bedroom_count} bed, {property.bathroom_count} bath
              </Text>
            </View>

            {/* Tenant Name */}
            {property.tenant_name && (
              <Text className="text-md text-gray-700">
                {property.tenant_name}
              </Text>
            )}

            {/* Description */}
            {property.description && (
              <Text className="text-base text-gray-800 pt-2 leading-relaxed">
                {property.description}
              </Text>
            )}

            {/* Rent */}
            {property.rent && (
              <Text className="text-lg font-semibold text-green-700 pt-2">
                Rent: ${property.rent.toLocaleString()}
              </Text>
            )}
            <View className="items-end mt-20">
              <Link href="./tenantlist" asChild>
                <TouchableOpacity className="bg-blue-500 w-14 h-14 rounded-md absolute bottom-4 right-4 items-center justify-center shadow">
                  <MaterialIcons name="message" size={28} color="white" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ) : (
          <Text className="text-red-500">Property not found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PropertyDetails;
