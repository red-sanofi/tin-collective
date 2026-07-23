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

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.replace("/(tabs)/profile");
    } catch (err) {
      setError(translateApiError(t, err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: t("auth.registerTitle") }} />
      <Screen>
        <ScreenHeader title={t("auth.registerTitle")} />
        <Input
          label={t("auth.username")}
          value={form.username}
          onChangeText={(value) => updateField("username", value)}
          autoCapitalize="none"
        />
        <Input
          label={t("auth.email")}
          value={form.email}
          onChangeText={(value) => updateField("email", value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label={t("auth.password")}
          value={form.password}
          onChangeText={(value) => updateField("password", value)}
          secureTextEntry
          autoCapitalize="none"
        />
        <Input
          label={t("auth.firstName")}
          value={form.first_name}
          onChangeText={(value) => updateField("first_name", value)}
        />
        <Input
          label={t("auth.lastName")}
          value={form.last_name}
          onChangeText={(value) => updateField("last_name", value)}
        />
        <ErrorBanner message={error} />
        <Button label={t("auth.registerButton")} onPress={handleSubmit} disabled={loading} />
        <Pressable onPress={() => router.push("/login")} style={styles.linkWrap}>
          <Text style={styles.link}>
            {t("auth.hasAccount")} {t("auth.goLogin")}
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
