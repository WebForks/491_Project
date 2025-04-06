import React, { useState, useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import "../../global.css";
import { useSidebar } from "./_layout";
import { supabase } from "../../utils/supabase";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";

export default function ProfileLandlord() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();

  const [landlord, setLandlord] = useState<any>(null);
  const [profileImage, setProfileImage] = useState(
    require("../../assets/images/react-logo.png")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch landlord details on component mount
  useEffect(() => {
    const fetchLandlordData = async () => {
      try {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Error fetching user:", userError?.message);
          return;
        }

        const { data, error } = await supabase
          .from("Landlords")
          .select("*")
          .eq("user_id", user.user.id)
          .single();

        if (error) {
          console.error("Error fetching landlord data:", error.message);
        } else {
          setLandlord(data);
          if (data.profile_pic_path) {
            setProfileImage({ uri: data.profile_pic_path });
          }
        }
      } catch (error) {
        console.error("Error fetching landlord data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandlordData();
  }, []);

  const uploadProfilePicture = async (uri: string) => {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error fetching user:", userError?.message);
        return;
      }
  
      console.log("Uploading file from URI:", uri);
  
      // Fetch the current profile picture path from the database
      const { data: landlordData, error: landlordError } = await supabase
        .from("Landlords")
        .select("profile_pic_path")
        .eq("user_id", user.user.id)
        .single();
  
      if (landlordError) {
        console.error("Error fetching landlord data:", landlordError.message);
        return;
      }
  
      const oldProfilePicPath = landlordData?.profile_pic_path;
  
      if (oldProfilePicPath) {
        const oldFileName = oldProfilePicPath.split("/").slice(-2).join("/"); // Extract the relative path
        console.log("Old file name to delete:", oldFileName);
      
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from("profile-pictures")
            .remove([oldFileName]);
      
          if (deleteError) {
            console.error("Error deleting old profile picture:", deleteError.message);
            return;
          }
      
          console.log("Old profile picture deleted successfully");
        } else {
          console.error("Could not extract file name from old profile picture path");
        }
      }
  
      // Read the file as Base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Convert Base64 to a Blob using the Buffer polyfill
      const blob = Buffer.from(base64, "base64");
  
      // Generate a unique file name
      const fileName = `profile-pictures/${user.user.id}-${Date.now()}.jpg`;
  
      // Upload the new profile picture to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, blob, { upsert: true });
  
      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError.message);
        return;
      }
  
      console.log("New profile picture uploaded successfully:", data);
  
      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("Error fetching public URL");
        return;
      }
  
      console.log("Public URL of uploaded file:", publicUrlData.publicUrl);
  
      // Update the profile picture path in the database
      const { error: updateError } = await supabase
        .from("Landlords")
        .update({ profile_pic_path: publicUrlData.publicUrl })
        .eq("user_id", user.user.id);
  
      if (updateError) {
        console.error("Error updating profile picture in database:", updateError.message);
      } else {
        console.log("Profile picture updated successfully!");
        setProfileImage({ uri: publicUrlData.publicUrl });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Change profile picture
  const changeProfilePicture = () => {
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Choose from Gallery", onPress: pickImage },
        { text: "Take Photo", onPress: takePhoto },
      ],
      { cancelable: true }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadProfilePicture(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadProfilePicture(result.assets[0].uri);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("./dashboard")}>
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-[100px] h-[100px]"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("./profile-landlord")}>
          <AntDesign name="user" size={35} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View className="w-full max-w-sm border-2 border-[#38B6FF] rounded-lg p-4 mb-4 items-center mx-auto">
        {/* First Name and Last Name Fields */}
        <View className="flex-row justify-center items-center w-full mb-4">
          <Text className="text-lg font-semibold mr-2">
            {landlord.first_name || "First Name"}
          </Text>
          <Text className="text-lg font-semibold">
            {landlord.last_name || "Last Name"}
          </Text>
        </View>

        {/* Profile Picture */}
        <TouchableOpacity onPress={changeProfilePicture}>
          <View className="relative">
            <Image
              source={profileImage}
              className="w-[150px] h-[150px] mb-2 rounded-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-0 right-0 bg-white p-1 rounded-full">
              <MaterialIcons name="edit" size={20} color="#38B6FF" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Navigation Links */}
      <TouchableOpacity
        onPress={() => router.push("./(auth)/change-email")}
        className="bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto"
      >
        <Text className="text-white font-bold text-lg">Change Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("./(auth)/reset-password")}
        className="bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto"
      >
        <Text className="text-white font-bold text-lg">Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#38B6FF] w-[90%] py-4 rounded-2xl items-center mb-4 mx-auto">
        <Text className="text-white font-bold text-lg">
          Payment Preferences
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("./(auth)/sign-in")}
        className="bg-red-500 w-[90%] py-4 rounded-2xl items-center mx-auto"
      >
        <Text className="text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View className="items-center mt-8">
        <Text className="text-gray-500">Copyright @ Tenuity 2025</Text>
      </View>
    </SafeAreaView>
  );
}