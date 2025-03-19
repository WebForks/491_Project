import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="./landlord/dashboard.tsx"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="profile-landlord" options={{ headerShown: false }} />
      <Stack.Screen name="signup-landlord" options={{ headerShown: false }} />
      <Stack.Screen name="change-email" options={{ headerShown: false }} />
    </Stack>
  );
}
