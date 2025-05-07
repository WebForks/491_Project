import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Pressable, Image } from "react-native";
import { useSidebar } from "./_layout";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { supabase } from "../../utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewType = "income" | "expenses" | "taxes";
type TimeframeType = "month" | "lastMonth" | "ytd";

const FinancialDashboard = () => {
  const { toggleSidebar } = useSidebar();
  const [timeframe, setTimeframe] = useState<TimeframeType>("month");
  const [view, setView] = useState<ViewType>("income");
  const [financialData, setFinancialData] = useState({
    income: { month: 0, lastMonth: 0, ytd: 0 },
    expenses: { month: 0, lastMonth: 0, ytd: 0 },
    taxes: { month: 0, lastMonth: 0, ytd: 0 },
  });

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0);
    const startOfYear = new Date(currentYear, 0, 1);

    // Get all properties with tenants and rent
    const { data: properties } = await supabase
      .from("Properties")
      .select("rent, tenant_uuid, created_at");

    const getMonthlyIncome = (startDate: Date) => {
      return (
        properties?.reduce((acc, prop) => {
          const createdAt = new Date(prop.created_at);
          if (
            createdAt.getTime() <=
            new Date(
              startDate.getFullYear(),
              startDate.getMonth() + 1,
              0,
            ).getTime()
          ) {
            return acc + (prop.rent || 0);
          }
          return acc;
        }, 0) || 0
      );
    };

    const incomeMonth = getMonthlyIncome(startOfMonth);
    const incomeLastMonth = getMonthlyIncome(startOfLastMonth);
    const incomeYTD =
      properties?.reduce((acc, prop) => {
        const createdAt = new Date(prop.created_at);
        if (createdAt <= now) {
          const monthsActive = Math.max(
            0,
            monthDiff(createdAt > startOfYear ? createdAt : startOfYear, now) +
              1,
          );
          return acc + monthsActive * (prop.rent || 0);
        }
        return acc;
      }, 0) || 0;

    // Get maintenance costs
    const { data: maintenance } = await supabase
      .from("Maintenance")
      .select("cost, created_at");

    const getExpenseInRange = (start: Date, end: Date) => {
      return (
        maintenance?.reduce((acc, item) => {
          const createdAt = new Date(item.created_at);
          if (createdAt >= start && createdAt <= end) {
            return acc + (item.cost || 0);
          }
          return acc;
        }, 0) || 0
      );
    };

    const expenseMonth = getExpenseInRange(startOfMonth, now);
    const expenseLastMonth = getExpenseInRange(
      startOfLastMonth,
      endOfLastMonth,
    );
    const expenseYTD = getExpenseInRange(startOfYear, now);

    setFinancialData({
      income: {
        month: incomeMonth,
        lastMonth: incomeLastMonth,
        ytd: incomeYTD,
      },
      expenses: {
        month: expenseMonth,
        lastMonth: expenseLastMonth,
        ytd: expenseYTD,
      },
      taxes: {
        month: incomeMonth * 0.1,
        lastMonth: incomeLastMonth * 0.1,
        ytd: incomeYTD * 0.1,
      },
    });
  };

  const monthDiff = (from: Date, to: Date) => {
    return (
      to.getFullYear() * 12 +
      to.getMonth() -
      (from.getFullYear() * 12 + from.getMonth())
    );
  };

  const value = financialData[view][timeframe];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Bar */}
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

      {/* Timeframe Toggle */}
      <View className="flex-row justify-between mb-6">
        {["month", "lastMonth", "ytd"].map((tf) => (
          <TouchableOpacity
            key={tf}
            onPress={() => setTimeframe(tf as TimeframeType)}
            className={`flex-1 justify-center items-center p-3 rounded-lg ${
              timeframe === tf ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                timeframe === tf ? "text-white" : "text-black"
              }`}
            >
              {tf === "month"
                ? "This Month"
                : tf === "lastMonth"
                  ? "Last Month"
                  : "YTD"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* View Toggle */}
      <View className="flex-row justify-between mb-6">
        {["income", "expenses", "taxes"].map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v as ViewType)}
            className={`flex-1 justify-center items-center p-3 rounded-lg ${
              view === v ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <MaterialIcons
              name={
                v === "income"
                  ? "attach-money"
                  : v === "expenses"
                    ? "money-off"
                    : "receipt"
              }
              size={24}
              color={
                v === "income" ? "green" : v === "expenses" ? "red" : "blue"
              }
            />
            <Text
              className={`text-lg font-semibold ${
                view === v ? "text-white" : "text-black"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display Value */}
      <View className="my-8 items-center">
        <Text className="text-4xl font-bold">${value.toLocaleString()}</Text>
        <Text className="text-gray-600 text-lg mt-2 capitalize">
          {view} (
          {timeframe === "ytd"
            ? "Year to Date"
            : timeframe === "month"
              ? "This Month"
              : "Last Month"}
          )
        </Text>
      </View>

      {/* Summary Section */}
      <View className="mt-8 space-y-4 p-4 bg-gray-100 rounded-lg shadow-lg">
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium text-gray-700">
            Gross Revenue
          </Text>
          <Text className="text-lg font-bold text-green-600">
            ${financialData.income.ytd.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium text-gray-700">
            Expense Cost
          </Text>
          <Text className="text-lg font-bold text-red-600">
            ${financialData.expenses.ytd.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-lg font-medium text-gray-700">Net Revenue</Text>
          <Text className="text-lg font-bold text-blue-600">
            $
            {(
              financialData.income.ytd -
              financialData.expenses.ytd -
              financialData.taxes.ytd
            ).toLocaleString()}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FinancialDashboard;
