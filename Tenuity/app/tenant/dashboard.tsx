import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout"; // tenant's layout file

interface MaintenanceRequest {
  title: string;
}

export default function TenantDashboard() {
  const { toggleSidebar } = useSidebar(); // Use the tenant's sidebar context
  const [userName, setUserName] = useState<string>("");
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      // Get the current user's session
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError) throw sessionError;

      if (user) {
        // Query the Tenants table to get the user's name and fetch maintenance requests
        const { data: tenantData, error: tenantError } = await supabase
          .from("Tenants")
          .select("first_name, last_name, id")
          .eq("user_id", user.id)
          .single();

        if (tenantError) throw tenantError;

        if (tenantData) {
          setUserName(`${tenantData.first_name} ${tenantData.last_name}`);
          
          //console.log(tenantData);
          //console.log(user.id);

          // Fetch maintenance requests for this tenant
          const { data: maintenanceData, error: maintenanceError } =
            await supabase
              .from("Maintenance")
              .select("title")
              .eq("tenant_uuid", user.id)
              .eq("completed", false);

          if (maintenanceError) throw maintenanceError;

          if (maintenanceData) {
            setMaintenanceRequests(maintenanceData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 relative">
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>

          {/* Centered Logo */}
          <View className="flex-1 justify-center items-center">
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[50px] h-[50px]"
              resizeMode="contain"
            />
          </View>

          {/* Profile Icon */}
          <Link href="./profile-tenant" asChild>
            <TouchableOpacity>
              <AntDesign name="user" size={35} color="black" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Greeting */}
        <View className="p-4">
          <View className="bg-[#4A9DFF] rounded-lg p-4">
            <Text className="text-white text-2xl font-bold">
              Hello {userName}!
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-around px-4 py-2">
          <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
            <Ionicons name="cash-outline" size={24} color="white" />
          </TouchableOpacity>
          <Link href="./tnDocuments" asChild>
            <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
              <Ionicons name="folder-outline" size={24} color="white" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
            <Ionicons name="chatbubble-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Maintenance Section */}
        <View className="p-4">
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <Text className="text-lg font-semibold mb-4">Maintenance</Text>

            {/* Maintenance Items */}
            {maintenanceRequests.length > 0 ? (
              maintenanceRequests.map((request, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <Text className="text-base">{request.title}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500 italic">
                No pending maintenance requests
              </Text>
            )}

            {/* New Request Button */}
            <TouchableOpacity className="flex-row items-center mt-3">
              <Ionicons name="add-circle-outline" size={20} color="#4A9DFF" />
              <Text className="text-[#4A9DFF] ml-2">New Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
