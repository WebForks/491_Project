import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarAnimation = React.useRef(new Animated.Value(-screenWidth * 0.75)).current;

  React.useEffect(() => {
    Animated.timing(sidebarAnimation, {
      toValue: isOpen ? 0 : -screenWidth * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <>
      {/* Blur Background */}
      {isOpen && (
        <BlurView
          intensity={50}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        >
          <TouchableOpacity
            style={styles.blurBackground}
            onPress={onClose}
          />
        </BlurView>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarAnimation }] },
        ]}
      >
        <View style={styles.sidebarContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Entypo name="cross" size={30} color="black" />
          </TouchableOpacity>

          {/* Sidebar Items */}
          <View style={styles.menuItems}>
            <Link href="./dashboard" asChild>
              <TouchableOpacity style={styles.menuItem}>
                <Entypo name="home" size={24} color="black" />
                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.menuItem}>
              <MaterialIcons name="attach-money" size={24} color="black" />
              <Text style={styles.menuText}>Financial Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="chatbubble-outline" size={24} color="black" />
              <Text style={styles.menuText}>Messaging</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <MaterialCommunityIcons name="wrench-outline" size={24} color="black" />
              <Text style={styles.menuText}>Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="document-text-outline" size={24} color="black" />
              <Text style={styles.menuText}>Documents</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: screenWidth * 0.75,
    backgroundColor: "#f8f8f8",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
  },
  blurBackground: {
    flex: 1,
  },
});