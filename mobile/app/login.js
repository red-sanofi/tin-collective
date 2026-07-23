import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import { ErrorBanner, Screen, ScreenHeader } from "../../src/components/Screen";
import { useAuth } from "../../src/context/AuthContext";
import { colors, spacing } from "../../src/theme";
import { translateApiError } from "../../src/utils/format";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      await login({ username, password });
      router.replace("/(tabs)/profile");
    } catch (err) {
      setError(translateApiError(t, err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t("auth.loginTitle") }} />
      <Screen>
        <ScreenHeader title={t("auth.loginTitle")} />
        <Input label={t("auth.username")} value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Input
          label={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <ErrorBanner message={error} />
        <Button label={t("auth.loginButton")} onPress={handleSubmit} disabled={loading} />
        <Pressable onPress={() => router.push("/register")} style={styles.linkWrap}>
          <Text style={styles.link}>
            {t("auth.noAccount")} {t("auth.goRegister")}
          </Text>
        </Pressable>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  linkWrap: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  link: {
    color: colors.accent,
    fontWeight: "600",
  },
});
