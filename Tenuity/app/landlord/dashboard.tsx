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
import Checkbox from "expo-checkbox"; // ✅ Import Expo Checkbox
import { Link, useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout";

export default function Dashboard() {
  const { toggleSidebar } = useSidebar();
  const [properties, setProperties] = useState<
    { id: number; address: string }[]
  >([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    { id: number; title: string; address: string; completed: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Get the current logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error fetching user:", userError?.message);
          return;
        }

        if (!isMounted) return;

        // Fetch properties where landlord_uuid matches the user's ID
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("Properties")
          .select("id, address")
          .eq("landlord_uuid", user.id);

        console.log("Properties Data:", propertiesData); // Log the fetched properties data

        if (propertiesError) {
          console.error("Error fetching properties:", propertiesError.message);
        } else {
          setProperties(propertiesData || []);
        }

        // Fetch maintenance requests where landlord_uuid matches user and completed = false
        const { data: maintenanceData, error: maintenanceError } =
          await supabase
            .from("Maintenance")
            .select("id, title, property_id, completed")
            .eq("landlord_uuid", user.id)
            .eq("completed", false);

        if (maintenanceError) {
          console.error(
            "Error fetching maintenance requests:",
            maintenanceError.message
          );
        } else {
          // Cross-reference maintenance requests with properties to get addresses
          const maintenanceWithAddresses = maintenanceData.map(
            (maintenance) => {
              const property = propertiesData?.find(
                (p) => p.id === maintenance.property_id
              );
              return {
                ...maintenance,
                address: property ? property.address : "Unknown Address",
              };
            }
          );

          setMaintenanceRequests(maintenanceWithAddresses);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to mark maintenance request as complete
  const markAsCompleted = async (id: number) => {
    const { error } = await supabase
      .from("Maintenance")
      .update({ completed: true })
      .eq("id", id);

    if (error) {
      console.error("Error updating maintenance:", error.message);
    } else {
      // Hide the task by removing it from state
      setMaintenanceRequests((prev) =>
        prev.filter((request) => request.id !== id)
      );
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="../landlord/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
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
              <Link
                href={{
                  pathname: "../landlord/propertyDetails",
                  params: { id: item.id, address: item.address },
                }}
                asChild
              >
                <Pressable className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <View className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white mr-2" />
                    <Text className="text-lg text-black font-medium">
                      {item.address}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="message"
                    size={28}
                    color="#3ab7ff"
                  />
                </Pressable>
              </Link>
            )}
          />
        )}

        {/* Add New Property */}
        <Link href="../landlord/addproperty" asChild>
          <TouchableOpacity className="flex-row items-center space-x-2">
            <Ionicons name="add-outline" size={24} color="#3ab7ff" />
            <View>
              <Text className="font-semibold text-lg">New</Text>
              <Text className="text-gray-500 text-base">Add new property</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Maintenance Section */}
      <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
        <Text className="font-semibold text-xl mb-2">Maintenance</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3ab7ff" />
        ) : maintenanceRequests.length === 0 ? (
          <Text className="text-gray-500">No maintenance issues reported.</Text>
        ) : (
          <FlatList
            data={maintenanceRequests}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="flex-row items-center gap-x-4 mb-2">
                {/* ✅ Checkbox on the left */}
                <Checkbox
                  value={checkedItems[item.id] || false}
                  onValueChange={(newValue) => {
                    setCheckedItems((prev) => ({
                      ...prev,
                      [item.id]: newValue,
                    }));
                    if (newValue) {
                      markAsCompleted(item.id);
                    }
                  }}
                  color={checkedItems[item.id] ? "green" : undefined}
                />
                {/* ✅ Text directly next to checkbox */}
                <View>
                  <Text className="text-lg font-semibold">{item.title}</Text>
                  <Text className="text-gray-600">{item.address}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Bottom Bar */}
      <View className="flex-row justify-around mt-auto">
        {/* Documents */}
        <Link href="./documents" asChild>
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
            <Ionicons name="documents" size={50} color="white" />
          </TouchableOpacity>
        </Link>
        {/* Messaging */}
        <Link href="./tenantlist" asChild>
          <TouchableOpacity className="bg-blue-500 p-4 rounded-lg flex-row items-center">
            <MaterialIcons name="message" size={50} color="white" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
