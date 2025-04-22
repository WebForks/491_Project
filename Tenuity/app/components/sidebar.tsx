import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "landlord" | "tenant"; // Accept userType as a prop
}

export default function Sidebar({ isOpen, onClose, userType }: SidebarProps) {
  const router = useRouter();
  const sidebarAnimation = React.useRef(new Animated.Value(-screenWidth * 0.75)).current;

  // Handle swipe gestures
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Start responding to gestures if the user swipes horizontally
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        // Move the sidebar as the user swipes
        if (gestureState.dx < 0) {
          sidebarAnimation.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Close the sidebar if the swipe is significant
        if (gestureState.dx < -50) {
          closeSidebar();
        } else {
          openSidebar();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    if (isOpen) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }, [isOpen]);

  const openSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = (callback?: () => void) => {
    Animated.timing(sidebarAnimation, {
      toValue: -screenWidth * 0.75,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      if (callback) callback();
    });
  };

  const navigateTo = (path: string) => {
    closeSidebar(() => {
      router.push(path as any); // 🛠️ cast to any to bypass the strict type check
    });
  };

  // Define menu items based on userType
  const menuItems =
    userType === "landlord"
      ? [
          { label: "Home", icon: <Entypo name="home" size={24} color="black" />, path: "./dashboard" },
          {
            label: "Financial Dashboard",
            icon: <MaterialIcons name="attach-money" size={24} color="black" />,
            path: "./financialDashboard",
          },
          {
            label: "Messaging",
            icon: <Ionicons name="chatbubble-outline" size={24} color="black" />,
            path: "./tenantlist",
          },
          {
            label: "Documents",
            icon: <Ionicons name="document-text-outline" size={24} color="black" />,
            path: "./documents",
          },
        ]
      : [
          { label: "Home", icon: <Entypo name="home" size={24} color="black" />, path: "./dashboard" },
          {
            label: "Maintenance",
            icon: <MaterialIcons name="build" size={24} color="black" />,
            path: "./maintenance",
          },
          {
            label: "Messaging",
            icon: <Ionicons name="chatbubble-outline" size={24} color="black" />,
            path: "./tenantChat",
          },
          {
            label: "Documents",
            icon: <Ionicons name="document-text-outline" size={24} color="black" />,
            path: "./tnDocuments",
          },
        ];

  return (
    <>
      {/* Blur Background */}
      {isOpen && (
        <BlurView
          intensity={50}
          tint="dark"
          style={[StyleSheet.absoluteFillObject, styles.blurBackground]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject} // Ensure it covers the entire screen
            onPress={() => closeSidebar()} // Close sidebar when tapping outside
          />
        </BlurView>
      )}

      {/* Sidebar */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarAnimation }] },
        ]}
      >
        <View style={styles.sidebarContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={() => closeSidebar()} style={styles.closeButton}>
            <Entypo name="cross" size={30} color="black" />
          </TouchableOpacity>

          {/* Sidebar Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigateTo(item.path)}
              >
                {item.icon}
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
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
    marginRight: 10,
    marginTop: 40,
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
    zIndex: 5,
  },
});