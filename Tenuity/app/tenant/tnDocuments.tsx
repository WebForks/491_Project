import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const initialDocuments = [
  { id: 1, name: "Lease Agreement", property: "Property A" },
  { id: 2, name: "Rent Payment Receipt", property: "Property B" },
];

export default function TenantDocuments() {
  const [expandedDocument, setExpandedDocument] = useState<number | null>(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const router = useRouter();

  const toggleExpand = (documentId: number) => {
    setExpandedDocument(expandedDocument === documentId ? null : documentId);
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        {/* Centered Logo */}
        <View className="flex-1 justify-center items-center">
          <Link href="./dashboard" asChild>
            <Pressable>
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
            </Pressable>
          </Link>
        </View>

        {/* Profile Icon Positioned to the Top-Right */}
        <View className="absolute top-4 right-4">
          <Link href="./profile-tenant" asChild>
            <TouchableOpacity>
              <AntDesign name="user" size={35} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold text-center mb-4">Documents</Text>

      {/* List of Documents */}
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-2">
            {/* Document Row */}
            <TouchableOpacity
              className="flex-row items-center justify-between p-3"
              onPress={() => toggleExpand(item.id)}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="folder-outline"
                  size={24}
                  color="black"
                  className="mr-2"
                />
                <Text className="text-lg font-semibold">{item.name}</Text>
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

            {/* Blue Line Separator */}
            <View className="h-[1px] bg-blue-500 w-full" />

            {/* Dropdown Document Details */}
            {expandedDocument === item.id && (
              <View className="p-3">
                <Text className="text-sm text-gray-700">
                  Property: {item.property}
                </Text>
                {/* Add functionality for document actions here */}
                <TouchableOpacity className="flex-row items-center p-2 mt-2">
                  <Ionicons
                    name="eye"
                    size={20}
                    color="blue"
                    className="mr-2"
                  />
                  <Text className="text-blue-500">View Document</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
