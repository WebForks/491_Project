import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../utils/supabase";

interface Document {
  name: string;
  url: string;
}

export default function TenantDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("Documents") // your bucket name
        .list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (error) throw error;

      const docsWithUrls = await Promise.all(
        data
          .filter((item) => item.name && !item.name.endsWith("/")) // folders end with "/"
          .map(async (item) => {
            const { data: signedUrlData } = await supabase.storage
              .from("Documents")
              .createSignedUrl(item.name, 60 * 60); // 1 hour

            return {
              name: item.name,
              url: signedUrlData?.signedUrl || "",
            };
          })
      );

      setDocuments(docsWithUrls);
    } catch (error: any) {
      console.error("Error fetching documents:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-3xl font-bold text-center mb-4">Documents</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.url)}
              className="bg-blue-500 rounded-xl p-4 flex-row items-center mb-3"
            >
              <Ionicons name="eye" size={24} color="white" className="mr-4" />
              <Text className="text-white text-lg font-semibold">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
