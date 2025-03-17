import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { supabase } from "../../utils/supabase";

export default function Dashboard() {
  const [properties, setProperties] = useState<
    { id: number; address: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Get the current logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        console.log("user", user);

        if (userError || !user) {
          console.error("Error fetching user:", userError?.message);
          return;
        }

        // Fetch properties where landlord_uuid matches the user's ID
        const { data, error } = await supabase
          .from("properties")
          .select("id, address")
          .eq("landlord_uuid", user.id);

        if (error) {
          console.error("Error fetching properties:", error.message);
        } else {
          setProperties(data || []);
        }
        console.log("properties", data);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
        <Link href="/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Properties Section */}
      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-xl mb-2">Properties</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3ab7ff" />
        ) : properties.length === 0 ? (
          <Text className="text-gray-500">No properties found.</Text>
        ) : (
          <FlatList
            data={properties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text className="text-lg">{item.address}</Text>
                </View>
                <MaterialCommunityIcons
                  name="message"
                  size={28}
                  color="#3ab7ff"
                />
              </View>
            )}
          />
        )}

        {/* Add New Property */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="add-outline" size={24} color="#3ab7ff" />
          <View>
            <Text className="font-semibold text-lg">New</Text>
            <Text className="text-gray-500 text-base">Add new property</Text>
          </View>
        </View>
      </View>

      {/* Maintenance Section */}
      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-xl mb-2">Maintenance</Text>
        <Text className="text-gray-500">No maintenance issues reported.</Text>
      </View>

      {/* Bottom Bar */}
      <View className="flex-row justify-around mt-auto">
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
          <MaterialIcons name="attach-money" size={50} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
          <Ionicons name="documents" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
