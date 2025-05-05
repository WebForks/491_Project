import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { Link, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSidebar } from "./_layout";

const initialProperties = [
  { id: 1, name: "Property A", documents: ["Lease Agreement", "Tax Form"] },
  {
    id: 2,
    name: "Property B",
    documents: ["Rental Agreement", "Inspection Report"],
  },
];

export default function Documents() {
  const { toggleSidebar } = useSidebar();
  const [expandedProperty, setExpandedProperty] = useState<number | null>(null);
  const [properties, setProperties] = useState(initialProperties);
  const router = useRouter();

  const toggleExpand = (propertyId: number) => {
    setExpandedProperty(expandedProperty === propertyId ? null : propertyId);
  };

  const pickDocument = async (propertyId: number) => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.canceled || !result.assets?.length) return;

    // Get the file name
    const newDoc = result.assets[0].name;

    // Update the properties array
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === propertyId
          ? { ...property, documents: [...property.documents, newDoc] }
          : property,
      ),
    );
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="../landlord/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[100px] h-[100px]"
              resizeMode="contain"
            />
          </Pressable>
        </Link>
        <Link href="./profile-landlord" asChild>
          <TouchableOpacity>
            <AntDesign name="user" size={35} color="black" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold text-center mb-4">Documents</Text>

      {/* List of Properties */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-2">
            {/* Property Row */}
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
                <Link
                  href={{
                    pathname: "../landlord/propertyDetails",
                    params: { propertyId: item.id },
                  }}
                  asChild
                >
                  <Pressable>
                    <Text className="text-lg font-semibold text-blue-600 underline">
                      {item.name}
                    </Text>
                  </Pressable>
                </Link>
              </View>
              <Ionicons
                name={
                  expandedProperty === item.id
                    ? "chevron-down"
                    : "chevron-forward"
                }
                size={24}
                color="black"
              />
            </TouchableOpacity>

            {/* Blue Line Separator */}
            <View className="h-[1px] bg-blue-500 w-full" />

            {/* Dropdown Documents */}
            {expandedProperty === item.id && (
              <View className="p-3">
                {item.documents.map((doc, index) => (
                  <View
                    key={index}
                    className="flex-row items-center p-3 bg-blue-500 rounded-2xl my-2"
                  >
                    <FontAwesome
                      name="eye"
                      size={20}
                      color="white"
                      className="mr-2"
                    />
                    <Text className="text-base text-white">{doc}</Text>
                  </View>
                ))}
                {/* Add New Document Button */}
                <TouchableOpacity
                  className="flex-row items-center p-2 mt-2"
                  onPress={() => pickDocument(item.id)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="blue"
                    className="mr-2"
                  />
                  <Text className="text-blue-500">Add New Document</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
