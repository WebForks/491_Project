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
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { useSidebar } from "./_layout";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

export default function ChatScreen() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getUserId();
    fetchTenantDetails();
  }, []);

  useEffect(() => {
    if (userId && chatId) {
      fetchMessages();
      const channel = supabase
        .channel("realtime-landlord-chat")
        .on("postgres_changes", { event: "*", schema: "public", table: "Messages" }, fetchMessages)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const keyboardListener = Keyboard.addListener("keyboardDidShow", () =>
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150)
    );

    return () => keyboardListener.remove();
  }, [userId, chatId]);

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
      .eq("user_id", chatId)
      .single();
    if (!error && data) setTenant(data);
  };

  const fetchMessages = async () => {
    if (!userId || !chatId) return;
    const { data, error } = await supabase
      .from("Messages")
      .select("*")
      .or(`and(author_id.eq.${userId},recipient_id.eq.${chatId}),and(author_id.eq.${chatId},recipient_id.eq.${userId})`)
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data);
  };

  const sendMessage = async () => {
    if ((!message.trim() && !imageUri) || !userId || !chatId) return;

    let imageUrl = null;
    if (imageUri) imageUrl = await uploadImageToSupabase(imageUri);

    const { error } = await supabase.from("Messages").insert([{
      author_id: userId,
      recipient_id: chatId,
      content: message.trim(),
      image_url: imageUrl,
    }]);

    if (!error) {
      setMessage("");
      setImageUri(null);
      fetchMessages();
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300);
    }
  };

  const uploadImageToSupabase = async (uri: string): Promise<string | null> => {
    if (!uri || !userId) return null;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const ext = uri.split(".").pop();
      const name = `chat-images/${userId}/${Date.now()}.${ext}`;
      const type = `image/${ext}`;
      const buffer = decode(base64);
      const { error: uploadError } = await supabase.storage.from("chat-images").upload(name, buffer, { contentType: type });
      if (uploadError) return null;
      const { data } = supabase.storage.from("chat-images").getPublicUrl(name);
      return data?.publicUrl ?? null;
    } catch {
      return null;
    }
  };

  const renderItem = ({ item }: any) => {
    const isOwn = item.author_id === userId;
    return (
      <View style={{
        alignSelf: isOwn ? "flex-end" : "flex-start",
        backgroundColor: isOwn ? "#4A9DFF" : "#EDEDED",
        borderRadius: 16,
        padding: 10,
        marginVertical: 4,
        maxWidth: "75%",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
      }}>
        {item.image_url && (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: 180, height: 180, borderRadius: 12, marginBottom: 6 }}
            resizeMode="cover"
          />
        )}
        {!!item.content && (
          <Text style={{ color: isOwn ? "white" : "black", fontSize: 15 }}>{item.content}</Text>
        )}
        <Text style={{
          fontSize: 10,
          color: isOwn ? "#d0e1ff" : "#888",
          alignSelf: "flex-end",
          marginTop: 4
        }}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f7fd" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
              backgroundColor: '#fff',
              paddingTop: 50,
              paddingBottom: 8,
              borderBottomWidth: 0.5,
              borderBottomColor: '#ddd',
              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={toggleSidebar}>
                  <Entypo name="menu" size={28} color="black" />
                </TouchableOpacity>
                <Link href="/landlord/dashboard" asChild>
                  <TouchableOpacity>
                    <Image
                      source={require('../../assets/images/logo.png')}
                      style={{ width: 110, height: 60 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </Link>
                <Link href="/landlord/profile-landlord" asChild>
                  <TouchableOpacity>
                    <AntDesign name="user" size={26} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
              {tenant && (
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 10 }}>
                  <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="black" style={{ marginRight: 10 }} />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: tenant.profile_pic_path || "https://i.pravatar.cc/150?u=default" }}
                    style={{ width: 38, height: 38, borderRadius: 9999, marginRight: 10 }}
                    resizeMode="cover"
                  />
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>{tenant.first_name} {tenant.last_name}</Text>
                </View>
              )}
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300)}
            />

            {/* Preview Image */}
            {imageUri && (
              <View style={{ padding: 10, backgroundColor: "#fff", alignItems: "center", borderTopWidth: 1, borderColor: "#eee" }}>
                <Image source={{ uri: imageUri }} style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 6 }} resizeMode="cover" />
                <Text style={{ color: "#555" }}>Image Preview</Text>
              </View>
            )}

            {/* Input */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              backgroundColor: "white",
              borderTopWidth: 1,
              borderColor: "#ddd",
            }}>
              <TouchableOpacity
                onPress={async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    quality: 0.7,
                  });
                  if (!result.canceled && result.assets.length > 0) {
                    setImageUri(result.assets[0].uri);
                  }
                }}
              >
                <Ionicons name="attach" size={28} color="gray" style={{ marginRight: 10 }} />
              </TouchableOpacity>

              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  fontSize: 15,
                  backgroundColor: "#fff",
                  marginRight: 10,
                }}
                placeholder="Type your message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />

              <TouchableOpacity onPress={sendMessage}>
                <Ionicons name="send" size={28} color="#4A9DFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
