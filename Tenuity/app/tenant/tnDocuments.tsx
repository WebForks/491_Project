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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { supabase } from "../../utils/supabase";

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
  const router = useRouter();

  const toggleExpand = (documentId: number) => {
    setExpandedDocument(expandedDocument === documentId ? null : documentId);
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Documents")
        .select("*");

      if (error) {
        console.error("Error fetching documents:", error.message);
      } else {
        setDocuments(data);
      }
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  const viewDocument = (file_url: string) => {
    if (file_url) {
      Linking.openURL(file_url); // Directly open the URL from the database
    } else {
      console.warn("No file URL provided.");
    }
  };
  

  return (
    <View className="flex-1 bg-white p-4">
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
                  <Text className="ml-2 text-lg font-semibold">{item.name}</Text>
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
    </View>
  );
}