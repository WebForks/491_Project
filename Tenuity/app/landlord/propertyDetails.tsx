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
  const [editingRent, setEditingRent] = useState(false);
  const [newRentAmount, setNewRentAmount] = useState("");
  const [emailError, setEmailError] = useState(false);

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

    if (!newTenantEmail.trim()) {
      Alert.alert("Error", "Please enter tenant email");
      setEmailError(true); // Highlight email input field
      return;
    }
  
    try {
      console.log('Adding tenant...'); 
      setAddingTenant(true);  // Set addingTenant to true when starting the process
  
      // Step 1: Validate tenant email
      const trimmedEmail = newTenantEmail.trim();
      const { data: tenantData, error: tenantError } = await supabase
        .from("Tenants")
        .select("user_id, email") // Only select user_id and email
        .eq("email", trimmedEmail) // Match the email exactly
        .single();
  
      if (tenantError || !tenantData) {
        setEmailError(true); // Highlight email input field
        Alert.alert("Error", "No tenant registered with that email.");
        return;
      }
  
      // Step 2: Update the property with tenant information
      const { error } = await supabase
        .from("Properties")
        .update({
          tenant_uuid: tenantData.user_id,
          tenant_name: newTenantName, 
          tenant_email: tenantData.email, 
        })
        .eq("id", property.id);
  
      if (error) throw error;
  
      // Success logic
      Alert.alert("Success", "Tenant added successfully!");

      // Reset fields
      setNewTenantName("");
      setNewTenantEmail("");
      await fetchProperty();  // Refresh property data
      setAddingTenant(false); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding tenant:", error);
      Alert.alert("Failed to add tenant");
    }
  };
  
  const handleUpdateRent = async () => {
    if (!newRentAmount || isNaN(Number(newRentAmount))) {
      Alert.alert("Invalid Input", "Please enter a valid rent amount.");
      return;
    }
  
    try {
      const { error } = await supabase
        .from("Properties")
        .update({ rent: parseFloat(newRentAmount) })
        .eq("id", property.id);
  
      if (error) throw error;
  
      Alert.alert("Success", "Rent updated successfully.");
      setEditingRent(false);
      setNewRentAmount("");
      await fetchProperty();
    } catch (error) {
      console.error("Error updating rent:", error);
      Alert.alert("Error", "Failed to update rent.");
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
              <View className="pt-2">
                <Text className="text-lg font-semibold text-green-700">
                  Rent: ${property.rent.toLocaleString()}
                </Text>
                <TouchableOpacity
                  onPress={() => setEditingRent(true)}
                  className="mt-2 bg-yellow-500 px-4 py-2 rounded"
                >
                  <Text className="text-white text-center font-semibold">Change Rent</Text>
                </TouchableOpacity>
              </View>
            )}


            
          </View>
        ) : (
          <Text className="text-red-500">Property not found.</Text>
        )}
      </ScrollView>
      {/* Message Button */}
      <View className="items-end mt-4">
              <Link href="./tenantlist" asChild>
                <TouchableOpacity className="bg-blue-500 w-14 h-14 rounded-md absolute bottom-12 right-4 items-center justify-center shadow">
                  <MaterialIcons name="message" size={28} color="white" />
                </TouchableOpacity>
              </Link>
            </View>
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
            
            <Text className="text-lg mb-1">Tenant Email*</Text>
            <TextInput
              className={`border p-3 rounded mb-2 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter tenant email"
              value={newTenantEmail}
              onChangeText={(text) => {
                setNewTenantEmail(text);
                setEmailError(false); // Reset error state on input change
              }}
              keyboardType="email-address"
            />
            {/* Error message for invalid tenant email */}
            {emailError && (
              <Text className="text-red-500 text-sm mb-4">
                No tenant registered with that email.
              </Text>
            )}
            
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
      {/* Edit Rent Modal */}
      <Modal
        visible={editingRent}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingRent(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white p-6 rounded-lg w-full max-w-md">
            <Text className="text-xl font-bold mb-4">Update Rent</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded mb-6"
              placeholder="Enter new rent amount"
              value={newRentAmount}
              onChangeText={setNewRentAmount}
              keyboardType="numeric"
            />
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setEditingRent(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateRent}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default PropertyDetails;