import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../utils/supabase";
import { Link } from "expo-router";

export default function PropertyDetails() {
  const { propertyId } = useLocalSearchParams(); // Retrieve propertyId from URL
  const [property, setProperty] = useState<any>(null); // Property data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("Properties")
          .select("id, address, bedroom_count, bathroom_count, description, image_url")
          .eq("id", propertyId)
          .single();

        if (error) throw error;

        setProperty(data);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#3ab7ff" />;
  }

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-semibold">{property?.address}</Text>
      {property?.image_url && (
        <Image
          source={{ uri: property.image_url }}
          className="w-full h-[300px] rounded-lg mt-4"
          resizeMode="cover"
        />
      )}
      <Text className="mt-4">Description: {property?.description}</Text>
      <Text className="mt-2">Bedrooms: {property?.bedroom_count}</Text>
      <Text className="mt-2">Bathrooms: {property?.bathroom_count}</Text>
    </ScrollView>
  );
}
