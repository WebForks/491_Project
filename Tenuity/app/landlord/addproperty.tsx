import React, { useState } from "react";
import {
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import "../../global.css";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout";

export default function AddProperty() {
  const [address, setAddress] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [bathroomCount, setBathroomCount] = useState("");
  const [description, setDescription] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tenantRent, setTenantRent] = useState("");
  const [emailError, setEmailError] = useState(false);
  const { toggleSidebar } = useSidebar();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Image selection failed. Please try again.");
    }
  };

  const handleAddProperty = async () => {
    if (!address || !bedroomCount || !bathroomCount || !description || !tenantRent || !tenantEmail) {
      Alert.alert("Please fill in all the required fields.");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Validate tenant email
      const { data: tenantData, error: tenantError } = await supabase
        .from("Tenants")
        .select("user_id")
        .eq("email", tenantEmail)
        .single();

      if (tenantError || !tenantData) {
        setEmailError(true); // Highlight the email input field
        Alert.alert("Error", "No tenant found with the provided email.");
        setIsLoading(false);
        return;
      }

      setEmailError(false); // Reset email error state if validation passes
      const tenantUuid = tenantData.user_id;

      // Step 2: Get landlord UUID
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const landlordUuid = user?.id;
      if (!landlordUuid) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      let imageUrl = null;

      if (image) {
        const fileExt = image.split(".").pop() || "jpg";
        const fileName = `Properties/${Date.now()}-${address}.${fileExt}`;
        const contentType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;

        // Convert image URI to Blob and upload
        const response = await fetch(image);
        const blob = await response.blob();

        if (blob.size === 0) {
          Alert.alert("Error", "Image upload failed. The selected image is invalid or corrupted.");
          return;
        }

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(fileName, blob, {
            cacheControl: "3600",
            upsert: false,
            contentType,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        if (publicUrlData) {
          imageUrl = publicUrlData.publicUrl;
        }
      }

      const { error } = await supabase.from("Properties").insert([
        {
          landlord_uuid: landlordUuid,
          tenant_uuid: tenantUuid,
          address,
          bedroom_count: bedroomCount,
          bathroom_count: bathroomCount,
          description,
          tenant_name: tenantName,
          tenant_email: tenantEmail,
          rent: tenantRent,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      Alert.alert("Property successfully added!");

      setAddress("");
      setBedroomCount("");
      setBathroomCount("");
      setDescription("");
      setTenantName("");
      setTenantEmail("");
      setImage(null);
      setTenantRent("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>

        <Link href="../landlord/dashboard" asChild>
          <TouchableOpacity>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Link>

        <Link href="../landlord/profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      <Text className="text-lg">Address</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Full Address"
        value={address}
        onChangeText={setAddress}
      />

      <Text className="text-lg">Bedroom Count</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Count"
        value={bedroomCount}
        onChangeText={setBedroomCount}
      />

      <Text className="text-lg">Bathroom Count</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Count"
        value={bathroomCount}
        onChangeText={setBathroomCount}
      />

      <Text className="text-lg">Property Description</Text>
      <TextInput
        className="border border-blue-300 p-7 rounded mb-4"
        placeholder="Detailed Information"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity onPress={pickImage} className="flex-row items-center space-x-2 mb-4">
        <AntDesign name="plussquareo" size={15} color="black" />
        <Text className="text-gray-600">{image ? "Change Image" : "Attach Image"}</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          className="w-full h-[200px] rounded-lg mb-4"
          resizeMode="cover"
        />
      )}

      <Text className="text-lg">Tenant Name</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="Full Name"
        value={tenantName}
        onChangeText={setTenantName}
      />

      <Text className="text-lg">Tenant Email</Text>
      <TextInput
        className={`border p-3 rounded mb-4 ${
          emailError ? "border-red-500" : "border-blue-300"
        }`}
        placeholder="Email"
        value={tenantEmail}
        onChangeText={(text) => {
          setTenantEmail(text);
          setEmailError(false); // Reset error state on input change
        }}
      />
      {emailError && (
        <Text className="text-red-500 text-sm mb-4">
          No tenant registered with that email.
        </Text>
      )}

      <Text className="text-lg">Rent Amount</Text>
      <TextInput
        className="border border-blue-300 p-3 rounded mb-4"
        placeholder="($)"
        value={tenantRent}
        onChangeText={setTenantRent}
      />

      <TouchableOpacity
        className={`bg-blue-500 p-4 rounded-lg flex items-center mb-8 ${
          isLoading ? "opacity-50" : ""
        }`}
        onPress={handleAddProperty}
        disabled={isLoading}
      >
        <Text className="text-white text-lg font-semibold">
          {isLoading ? "Saving..." : "Add Property"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
