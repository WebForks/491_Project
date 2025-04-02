import React, { useState } from "react";
import { View, Alert, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Link } from "expo-router";
import "../../global.css";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../utils/supabase"; 

export default function addproperty() {
  const [propertyName, setPropertyName] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [bathroomCount, setBathroomCount] = useState("");
  const [description, setDescription] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddProperty = async () => {
    if (!propertyName || !bedroomCount || !bathroomCount || !description) {
      Alert.alert("Please fill in all the required fields.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError) throw userError;
  
      const landlord_id = user?.id;
  
      if (!landlord_id) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
  
      let imageUrl = null;
  
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
  
        if (blob.size === 0) {
          Alert.alert("Error", "Image upload failed. The selected image is invalid or corrupted.");
          return;
        }
  
        const fileExt = image.split(".").pop();
        const fileName = `properties/${Date.now()}-${propertyName}.${fileExt}`;
        const filePath = fileName;
  
        const { data, error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, blob, {
            cacheControl: "3600",
            upsert: false,
            contentType: blob.type || "image/jpeg",
          });
  
        if (uploadError) throw uploadError;
  
        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);
  
        if (publicUrlData) imageUrl = publicUrlData.publicUrl;
      }
  
      const { error } = await supabase.from("properties").insert([
        {
          landlord_id,
          property_name: propertyName,
          bedroom_count: bedroomCount,
          bathroom_count: bathroomCount,
          description,
          tenant_name: tenantName,
          tenant_email: tenantEmail,
          image_url: imageUrl,
        },
      ]);
  
      if (error) throw error;
  
      Alert.alert("Property successfully added!");
  
      // Reset form
      setPropertyName("");
      setBedroomCount("");
      setBathroomCount("");
      setDescription("");
      setTenantName("");
      setTenantEmail("");
      setImage(null);
  
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        
        <Link href="./dashboard" asChild>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Link>

        <Link href="./profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      <Text className="text-lg">Address</Text>
      <TextInput className="border border-blue-300 p-3 rounded mb-4" placeholder="Full Address" value={propertyName} onChangeText={setPropertyName} />

      <Text className="text-lg">Bedroom Count</Text>
      <TextInput className="border border-blue-300 p-3 rounded mb-4" placeholder="Count" value={bedroomCount} onChangeText={setBedroomCount} />

      <Text className="text-lg">Bathroom Count</Text>
      <TextInput className="border border-blue-300 p-3 rounded mb-4" placeholder="Count" value={bathroomCount} onChangeText={setBathroomCount} />

      <Text className="text-lg">Property Description</Text>
      <TextInput className="border border-blue-300 p-7 rounded mb-4" placeholder="Detailed Information" multiline value={description} onChangeText={setDescription} />

      <TouchableOpacity onPress={pickImage} className="flex-row items-center space-x-2 mb-4">
        <AntDesign name="plussquareo" size={15} color="black" />
        <Text className="text-gray-600">{image ? "Change Image" : "Attach Image"}</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} className="w-full h-[200px] rounded-lg mb-4" resizeMode="cover" />
      )}

      <Text className="text-lg">Tenant Name</Text>
      <TextInput className="border border-blue-300 p-3 rounded mb-4" placeholder="Full Name" value={tenantName} onChangeText={setTenantName} />

      <Text className="text-lg">Tenant Email</Text>
      <TextInput className="border border-blue-300 p-3 rounded mb-4" placeholder="Email" value={tenantEmail} onChangeText={setTenantEmail} />

      <TouchableOpacity
        className={`bg-blue-500 p-4 rounded-lg flex items-center mb-8 ${isLoading ? "opacity-50" : ""}`}
        onPress={handleAddProperty}
        disabled={isLoading}
      >
        <Text className="text-white text-lg font-semibold">{isLoading ? "Saving..." : "Add Property"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
