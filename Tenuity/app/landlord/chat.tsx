import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import { useSidebar } from "./_layout";
import * as ImagePicker from "expo-image-picker";

import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChatScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [keyboardOffset] = useState(new Animated.Value(0));
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getUserId();
    fetchTenantDetails();
    fetchMessages();

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Messages" },
        () => fetchMessages()
      )
      .subscribe();

    const showSub = Keyboard.addListener("keyboardWillShow", (event) => {
      Animated.timing(keyboardOffset, {
        toValue: event.endCoordinates.height + 16,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(keyboardOffset, {
        toValue: 16,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });

    return () => {
      supabase.removeChannel(channel);
      showSub.remove();
      hideSub.remove();
    };
  }, [chatId]);

  const getUserId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) console.error("Error getting user:", error.message);
    else if (user) setUserId(user.id);
  };

  const fetchTenantDetails = async () => {
    if (!chatId) return;
    const { data, error } = await supabase
      .from("Tenants")
      .select("first_name, last_name, profile_pic_path")
      .eq("id", chatId)
      .single();

    if (error) console.error("Error fetching tenant info:", error.message);
    else setTenant(data);
  };

  const fetchMessages = async () => {
    if (!chatId) return;
    const { data, error } = await supabase
      .from("Messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) console.error("Error fetching messages:", error.message);
    else {
      setMessages(data || []);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !imageUri) || !userId) return;

    const { error } = await supabase.from("Messages").insert([
      {
        chat_id: chatId,
        author_id: userId,
        content: message.trim(),
        image_url: imageUri,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setMessage("");
      setImageUri(null);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderItem = ({ item }: any) => {
    const isOwnMessage = item.author_id === userId;

    return (
      <View
        style={{
          alignSelf: isOwnMessage ? "flex-end" : "flex-start",
          backgroundColor: isOwnMessage ? "#5C4DFF" : "white",
          borderRadius: 18,
          paddingVertical: 10,
          paddingHorizontal: 15,
          marginVertical: 4,
          marginHorizontal: 8,
          maxWidth: "75%",
        }}
      >
        {item.image_url && (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 5 }}
            resizeMode="cover"
          />
        )}
        {item.content ? (
          <Text style={{ color: isOwnMessage ? "white" : "black", fontSize: 16 }}>
            {item.content}
          </Text>
        ) : null}
        <Text
          style={{
            fontSize: 10,
            color: isOwnMessage ? "#e0e0ff" : "#999",
            marginTop: 6,
            textAlign: "right",
          }}
        >
          {new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f6ff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Top Header */}
        <View className="bg-white pt-10 pb-2 shadow-sm">
          <View className="flex-row justify-between items-center px-4">
            <TouchableOpacity onPress={toggleSidebar}>
              <Entypo name="menu" size={30} color="black" />
            </TouchableOpacity>
            <Link href="/landlord/dashboard" asChild>
              <TouchableOpacity>
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={{ width: 100, height: 100 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Link>
            <Link href="/landlord/profile-landlord" asChild>
              <TouchableOpacity>
                <AntDesign name="user" size={28} color="black" />
              </TouchableOpacity>
            </Link>
          </View>

          {tenant && (
            <View className="flex-row items-center px-4 pb-2 border-t border-gray-200">
              <TouchableOpacity onPress={() => router.back()} className="mr-2">
                <Ionicons name="arrow-back" size={22} color="black" />
              </TouchableOpacity>
              <Image
                source={{
                  uri: tenant.profile_pic_path || "https://i.pravatar.cc/150?u=default",
                }}
                style={{ width: 40, height: 40, borderRadius: 9999, marginRight: 10 }}
                resizeMode="cover"
              />
              <Text className="text-lg font-bold">
                {tenant.first_name} {tenant.last_name}
              </Text>
            </View>
          )}
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 160 }}
          className="px-2"
        />

        {/* Image Preview */}
        {imageUri && (
          <View className="absolute bottom-36 left-5 right-5 z-10 bg-white p-2 rounded-xl shadow-md">
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 180, borderRadius: 12 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setImageUri(null)}
              style={{
                position: "absolute",
                top: 5,
                right: 5,
                backgroundColor: "#00000088",
                borderRadius: 9999,
                padding: 4,
              }}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Animated Input */}
        <Animated.View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: keyboardOffset,
            backgroundColor: "white",
            borderRadius: 9999,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: "#ddd",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <TouchableOpacity onPress={pickImage}>
            <MaterialIcons name="attach-file" size={26} color="#555" />
          </TouchableOpacity>
          <TextInput
            style={{ flex: 1, marginHorizontal: 10 }}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#5C4DFF",
              padding: 10,
              borderRadius: 9999,
            }}
            onPress={sendMessage}
          >
            <Entypo name="paper-plane" size={20} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
