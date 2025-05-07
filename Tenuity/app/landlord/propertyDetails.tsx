import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, TextInput, Modal } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../utils/supabase";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

const PropertyDetails = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [removingTenant, setRemovingTenant] = useState(false);
  const [addingTenant, setAddingTenant] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantEmail, setNewTenantEmail] = useState("");

  const { id } = useLocalSearchParams();

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

  useEffect(() => {
    fetchProperty();
  }, [id]);

  
  const handleRemoveTenant = async () => {
    if (!property?.id) {
      Alert.alert("Error", "Property information is missing");
      return;
    }
  
    try {
      setRemovingTenant(true);
  
      const { error } = await supabase
        .from("Properties")
        .update({
          tenant_name: null,
          tenant_email: null,
        })
        .eq("id", property.id);
  
      if (error) throw error;
  
      Alert.alert("Success", "Tenant removed successfully.");
      await fetchProperty(); // Refresh state
    } finally {
      setRemovingTenant(false);
    }
  };
  

  const handleAddTenant = async () => {
    console.log('handleAddTenant triggered');
    
    if (!newTenantName.trim()) {
      Alert.alert("Error", "Please enter tenant name");
      return;
    }
  
    try {
      console.log('Adding tenant...');  
      setAddingTenant(true);  // Set addingTenant to true when starting the process
  
      const { error } = await supabase
        .from("Properties")
        .update({
          tenant_name: newTenantName.trim(),
          tenant_email: newTenantEmail.trim() || null,
        })
        .eq("id", property.id);
  
      if (error) throw error;
  
      // Success logic
      Alert.alert("Success", "Tenant added successfully!");
      
      // Reset fields
      setNewTenantName("");
      setNewTenantEmail("");
      
      await fetchProperty();  // Refresh property data
  
    } catch (error) {
      console.error("Error adding tenant:", error);
      let errorMessage = "Failed to add tenant";
      
      // Handle error message types
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      console.log('Process complete, setting addingTenant to false');
      setAddingTenant(false);  // Set addingTenant back to false when done
    }
  };
  
  
  

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Top Navigation Bar */}
      <View className="flex-row justify-between items-center mb-4 relative">
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/landlord/dashboard")}>
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[100px] h-[100px]"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Link href="./profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Property Details */}
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

            {/* Tenant Section */}
            <View className="mt-4">
              {property.tenant_name ? (
                <>
                  <Text className="text-lg font-semibold">Current Tenant:</Text>
                  <View className="bg-white p-3 rounded-lg mt-2">
                    <Text className="text-md text-gray-700">
                      Name: {property.tenant_name}
                    </Text>
                    {property.tenant_email && (
                      <Text className="text-md text-gray-700 mt-1">
                        Email: {property.tenant_email}
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={handleRemoveTenant}
                      disabled={removingTenant}
                      className={`bg-red-500 p-3 rounded-lg mt-3 flex-row items-center justify-center ${
                        removingTenant ? 'opacity-50' : ''
                      }`}
                    >
                      <MaterialIcons name="person-remove" size={20} color="white" />
                      <Text className="text-white ml-2">
                        {removingTenant ? "Removing..." : "Remove Tenant"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-lg font-semibold">No Tenant Assigned</Text>
                  <TouchableOpacity
                    onPress={() => setAddingTenant(true)}
                    className="bg-green-500 p-3 rounded-lg mt-2 flex-row items-center justify-center"
                  >
                    <MaterialIcons name="person-add" size={20} color="white" />
                    <Text className="text-white ml-2">Add Tenant</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

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

            {/* Message Button */}
            <View className="items-end mt-4">
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

      {/* Add Tenant Modal */}
      <Modal
        visible={addingTenant}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddingTenant(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white p-6 rounded-lg w-full max-w-md">
            <Text className="text-xl font-bold mb-4">Add New Tenant</Text>
            
            <Text className="text-lg mb-1">Tenant Name*</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded mb-4"
              placeholder="Enter tenant name"
              value={newTenantName}
              onChangeText={setNewTenantName}
            />
            
            <Text className="text-lg mb-1">Tenant Email</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded mb-6"
              placeholder="Enter tenant email"
              value={newTenantEmail}
              onChangeText={setNewTenantEmail}
              keyboardType="email-address"
            />
            
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setAddingTenant(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleAddTenant}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                <Text className="text-white">Add Tenant</Text>
              </TouchableOpacity>



            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PropertyDetails;