import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import { useSidebar } from "./_layout";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // Import MaterialIcons for check/uncheck icons

type ViewType = "income" | "expenses" | "taxes";
type TimeframeType = "month" | "lastMonth" | "ytd";

const FinancialDashboard = () => {
  const { toggleSidebar } = useSidebar();
  const navigation = useNavigation();

  const [timeframe, setTimeframe] = useState<TimeframeType>("month");
  const [view, setView] = useState<ViewType>("income");

  const dataMap: Record<ViewType, Record<TimeframeType, number>> = {
    income: {
      month: 5000,
      lastMonth: 4800,
      ytd: 30000,
    },
    expenses: {
      month: 2000,
      lastMonth: 2200,
      ytd: 12000,
    },
    taxes: {
      month: 500,
      lastMonth: 550,
      ytd: 3000,
    },
  };

  const value = dataMap[view][timeframe];

  return (
    <View className="flex-1 bg-white p-6">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={toggleSidebar}>
          <Entypo name="menu" size={35} color="black" />
        </TouchableOpacity>
        <Link href="../landlord/dashboard" asChild>
          <Pressable>
            <Image
              source={require("../../assets/images/logo.png")}
              className="w-[120px] h-[120px]"
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

      {/* Timeframe Toggle */}
      <View className="flex-row justify-between mb-6">
        {[
          { label: "This Month", value: "month" },
          { label: "Last Month", value: "lastMonth" },
          { label: "YTD", value: "ytd" },
        ].map(({ label, value: tf }) => (
          <TouchableOpacity
            key={tf}
            onPress={() => setTimeframe(tf as TimeframeType)}
            className={`flex-1 justify-center items-center p-3 rounded-lg ${
              timeframe === tf ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            <Text className={`text-lg font-semibold ${timeframe === tf ? "text-white" : "text-black"}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* View Toggle */}
      <View className="flex-row justify-between mb-6">
        {[
          { label: "Income", value: "income", icon: <MaterialIcons name="attach-money" size={24} color="green" /> },
          { label: "Expenses", value: "expenses", icon: <MaterialIcons name="money-off" size={24} color="red" /> },
          { label: "Taxes", value: "taxes", icon: <MaterialIcons name="receipt" size={24} color="blue" /> },
        ].map(({ label, value: v, icon }) => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v as ViewType)}
            className={`flex-1 justify-center items-center p-3 rounded-lg ${
              view === v ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {icon}
            <Text className={`text-lg font-semibold ${view === v ? "text-white" : "text-black"}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* "Chart" placeholder */}
      <View className="my-8 items-center">
        <Text className="text-4xl font-bold">
          ${value.toLocaleString()}
        </Text>
        <Text className="text-gray-600 text-lg mt-2 capitalize">
          {view} ({timeframe === "ytd" ? "Year to Date" : timeframe === "month" ? "This Month" : "Last Month"})
        </Text>
      </View>

      {/* Summary Section */}
      <View className="mt-8 space-y-4 p-4 bg-gray-100 rounded-lg shadow-lg">
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium text-gray-700">Gross Revenue</Text>
          <Text className="text-lg font-bold text-green-600">$30,000</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium text-gray-700">Expense Cost</Text>
          <Text className="text-lg font-bold text-red-600">$12,000</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium text-gray-700">Net Revenue</Text>
          <Text className="text-lg font-bold text-blue-600">$18,000</Text>
        </View>
      </View>
    </View>
  );
};

export default FinancialDashboard;
