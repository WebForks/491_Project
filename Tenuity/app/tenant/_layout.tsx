import React, { useState, createContext, useContext } from "react";
import { Stack } from "expo-router";
import Sidebar from "../components/sidebar";

// Create a context to share the toggleSidebar function
const SidebarContext = createContext({
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ toggleSidebar }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userType="tenant" // Pass userType as "tenant"
      />

      {/* Main Content */}
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SidebarContext.Provider>
  );
}