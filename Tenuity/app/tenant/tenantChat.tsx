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
import { useRouter, Link } from "expo-router";
import { supabase } from "../../utils/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [landlord, setLandlord] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const landlordId = "55d26cd6-b542-4818-af5b-02e1967f1ac1";

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    let cleanup: () => void;
    const init = async () => {
      if (userId) {
        await fetchMessages();
        await fetchLandlordDetails();

        const channel = supabase
          .channel("tenant-chat")
          .on("postgres_changes", { event: "*", schema: "public", table: "Messages" }, fetchMessages)
          .subscribe();

        cleanup = () => supabase.removeChannel(channel);
      }
    };

    init();

    const showListener = Keyboard.addListener("keyboardDidShow", () =>
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150)
    );

    return () => {
      if (cleanup) cleanup();
      showListener.remove();
    };
  }, [userId]);

  const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) setUserId(user.id);
  };

  const fetchLandlordDetails = async () => {
    const { data, error } = await supabase
      .from("Landlords")
      .select("first_name, last_name, profile_pic_path")
      .eq("user_id", landlordId)
      .single();
    if (!error && data) setLandlord(data);
  };

  const fetchMessages = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("Messages")
      .select("*")
      .or(`author_id.eq.${userId},recipient_id.eq.${userId}`)
      .order("created_at", { ascending: true });
    if (!error && data) setMessages(data);
  };

  const sendMessage = async () => {
    if ((!message.trim() && !imageUri) || !userId) return;

    let imageUrl = null;
    if (imageUri) imageUrl = await uploadImageToSupabase(imageUri);

    const { error } = await supabase.from("Messages").insert([{
      author_id: userId,
      recipient_id: landlordId,
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

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  const renderItem = ({ item, index }: any) => {
    const isOwn = item.author_id === userId;
    const currentDate = new Date(item.created_at).toDateString();
    const prevDate = index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;
    const showDate = index === 0 || currentDate !== prevDate;

    return (
      <View>
        {showDate && (
          <Text style={{ alignSelf: "center", color: "#999", marginVertical: 6, fontSize: 12 }}>
            {formatDateLabel(item.created_at)}
          </Text>
        )}
        <View style={{
          alignSelf: isOwn ? "flex-end" : "flex-start",
          backgroundColor: isOwn ? "#5C4DFF" : "#ECECEC",
          borderRadius: 18,
          padding: 10,
          marginVertical: 4,
          maxWidth: "75%",
          shadowColor: "#000",
          shadowOpacity: 0.04,
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 2,
        }}>
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={{ width: 220, height: 220, borderRadius: 10, marginBottom: 6 }}
              resizeMode="cover"
            />
          )}
          {!!item.content && (
            <Text style={{ color: isOwn ? "white" : "black", fontSize: 16 }}>
              {item.content}
            </Text>
          )}
          <Text style={{
            fontSize: 10,
            color: isOwn ? "#dfe6ff" : "#888",
            alignSelf: "flex-end",
            marginTop: 4
          }}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f6ff" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
              backgroundColor: "white",
              paddingTop: 50,
              paddingBottom: 10,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 }}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={26} color="black" />
                </TouchableOpacity>
                <Image source={require("../../assets/images/logo.png")} style={{ width: 100, height: 50 }} resizeMode="contain" />
                <Link href="./profile-tenant" asChild>
                  <TouchableOpacity>
                    <AntDesign name="user" size={26} color="black" />
                  </TouchableOpacity>
                </Link>
              </View>
              {landlord && (
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 10 }}>
                  <Image source={{ uri: landlord.profile_pic_path || "https://i.pravatar.cc/150?u=default" }} style={{ width: 40, height: 40, borderRadius: 9999, marginRight: 10 }} />
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>{landlord.first_name} {landlord.last_name}</Text>
                </View>
              )}
            </View>

            {/* Message List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 300)}
            />

            {/* Image Preview */}
            {imageUri && (
              <View style={{ padding: 10, backgroundColor: "#fff", alignItems: "center", borderTopWidth: 1, borderColor: "#eee" }}>
                <Image source={{ uri: imageUri }} style={{ width: 120, height: 120, borderRadius: 12, marginBottom: 6 }} resizeMode="cover" />
                <Text style={{ color: "#555" }}>Preview</Text>
              </View>
            )}

            {/* Input */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
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
                  paddingVertical: 10,
                  fontSize: 16,
                  backgroundColor: "#fff",
                  marginRight: 10,
                }}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />

              <TouchableOpacity onPress={sendMessage}>
                <Ionicons name="send" size={28} color="#5C4DFF" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
