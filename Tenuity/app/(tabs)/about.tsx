import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function AboutScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>About scree2</Text>
      <StatusBar style="auto" />
    </View>
  );
}
