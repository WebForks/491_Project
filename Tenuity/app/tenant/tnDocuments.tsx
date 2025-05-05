import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { supabase } from "../../utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

type Document = {
  id: number;
  name: string;
  property_id: number;
  file_url: string;
  path: string;
  description: string;
  created_at: string;
};

export default function TenantDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expandedDocument, setExpandedDocument] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const toggleExpand = (documentId: number) => {
    setExpandedDocument(expandedDocument === documentId ? null : documentId);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Documents").select("*");

    if (error) {
      console.error("Error fetching documents:", error.message);
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };

  const viewDocument = (file_url: string) => {
    if (file_url) {
      Linking.openURL(file_url);
    } else {
      console.warn("No file URL provided.");
    }
  };

  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "*/*", // Change to "application/pdf" if you want to limit to PDFs
        multiple: false,
      });

      if (result.canceled || !result.assets?.[0]) return;

      setUploading(true);
      const file = result.assets[0];
      const fileUri = file.uri;
      const fileName = `documents/${Date.now()}-${file.name}`;

      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBuffer = Buffer.from(fileBase64, "base64");

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, fileBuffer, { upsert: true });

      if (uploadError) {
        console.error("Upload failed (storage):", uploadError.message);
        Alert.alert("Upload Failed (storage)", uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("documents")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        Alert.alert("Error", "Could not get public URL.");
        return;
      }

      const { error: insertError } = await supabase.from("Documents").insert([
        {
          name: file.name || "Untitled",
          description: "Uploaded via mobile app",
          file_url: publicUrl,
          path: fileName,
          property_id: 1, // 🔧 Update this to match the tenant's actual property_id
        },
      ]);

      if (insertError) {
        console.error("Insert failed:", insertError.message);
        Alert.alert("Insert Failed", insertError.message);
      } else {
        Alert.alert("Success", "Document uploaded!");
        fetchDocuments(); // Refresh list
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "Unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        {/* Centered Logo */}
        <View className="flex-1 justify-center items-center">
          <Link href="../landlord/dashboard" asChild>
            <Pressable>
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
            </Pressable>
          </Link>
        </View>

        {/* Profile Icon */}
        <View className="absolute top-4 right-4">
          <Link href="./profile-tenant" asChild>
            <TouchableOpacity>
              <AntDesign name="user" size={35} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <Text className="text-3xl font-bold text-center mb-4">Documents</Text>

      <TouchableOpacity
        onPress={uploadDocument}
        disabled={uploading}
        className="bg-green-600 py-3 px-6 rounded-xl mb-4 items-center self-center"
      >
        <Text className="text-white font-bold text-lg">
          {uploading ? "Uploading..." : "+ Add Document"}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-2">
              <TouchableOpacity
                className="flex-row items-center justify-between p-3"
                onPress={() => toggleExpand(item.id)}
              >
                <View className="flex-row items-center">
                  <Ionicons name="folder-outline" size={24} color="black" />
                  <Text className="ml-2 text-lg font-semibold">
                    {item.name}
                  </Text>
                </View>
                <Ionicons
                  name={
                    expandedDocument === item.id
                      ? "chevron-down"
                      : "chevron-forward"
                  }
                  size={24}
                  color="black"
                />
              </TouchableOpacity>

              <View className="h-[1px] bg-blue-500 w-full" />

              {expandedDocument === item.id && (
                <View className="p-3">
                  <Text className="text-sm text-gray-700 mb-2">
                    Property ID: {item.property_id}
                  </Text>
                  <Text className="text-sm text-gray-500 italic">
                    {item.description}
                  </Text>

                  <TouchableOpacity
                    onPress={() => viewDocument(item.file_url)}
                    className="flex-row items-center p-2 mt-3"
                  >
                    <Ionicons name="eye" size={20} color="blue" />
                    <Text className="ml-2 text-blue-500">View Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
