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
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout"; // tenant's layout file
import { handleRentPayment } from "@/utils/stripe/payment";

interface MaintenanceRequest {
  title: string;
}

export default function TenantDashboard() {
  const router = useRouter();
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
      <ScrollView className="p-4">
        {/* Top Bar */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={toggleSidebar}>
            <Entypo name="menu" size={35} color="black" />
          </TouchableOpacity>

          {/* Logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[100px] h-[100px]"
            resizeMode="contain"
          />

          <Link href="./profile-tenant" asChild>
            <TouchableOpacity>
              <AntDesign name="user" size={35} color="black" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Greeting */}
        <View className="mb-4">
          <View className="bg-[#4A9DFF] rounded-lg p-4">
            <Text className="text-white text-2xl font-bold">
              Hello {userName}!
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-around px-4 py-2 mb-4">
          <TouchableOpacity
            className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center"
            onPress={handleRentPayment}
          >
            <Ionicons name="cash-outline" size={24} color="white" />
          </TouchableOpacity>
          <Link href="./tnDocuments" asChild>
            <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
              <Ionicons name="folder-outline" size={24} color="white" />
            </TouchableOpacity>
          </Link>
          <Link href="./tenantChat" asChild>
            <TouchableOpacity className="bg-[#4A9DFF] p-4 rounded-lg w-24 items-center">
              <Ionicons name="chatbubble-outline" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Maintenance Section */}
        <View className="border-2 border-blue-300 rounded-lg p-4 mb-4">
          <Text className="font-semibold text-xl mb-2">Maintenance</Text>

          {/* Maintenance Items */}
          {maintenanceRequests.length > 0 ? (
            maintenanceRequests.map((request, index) => (
              <View
                key={index}
                className="flex-row items-center gap-x-4 mb-3 bg-gray-100 p-3 rounded-lg"
              >
                <Text className="text-lg font-medium">{request.title}</Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500">
              No pending maintenance requests
            </Text>
          )}

          {/* New Request Button */}
          <TouchableOpacity className="flex-row items-center space-x-2 mt-3">
            <Ionicons name="add-outline" size={24} color="#3ab7ff" />
            <View>
              <Text className="font-semibold text-lg">New</Text>
              <Text className="text-gray-500 text-base">
                Add maintenance request
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
