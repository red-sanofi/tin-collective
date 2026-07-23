import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../src/context/AuthContext";
import "../src/i18n";
import { colors } from "../src/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="educations/[slug]" options={{ title: "" }} />
        <Stack.Screen name="announcements/[slug]" options={{ title: "" }} />
        <Stack.Screen name="login" options={{ title: "" }} />
        <Stack.Screen name="register" options={{ title: "" }} />
        <Stack.Screen name="join-us" options={{ title: "" }} />
      </Stack>
    </AuthProvider>
  );
}
