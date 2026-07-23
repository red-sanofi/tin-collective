import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import LanguageToggle from "../../src/components/LanguageToggle";
import LoadingView from "../../src/components/LoadingView";
import {
  ErrorBanner,
  Screen,
  ScreenHeader,
  SuccessBanner,
} from "../../src/components/Screen";
import { useAuth } from "../../src/context/AuthContext";
import { colors, spacing } from "../../src/theme";
import {
  formatDateTime,
  translateApiError,
  translateRegistrationStatus,
  unwrapList,
} from "../../src/utils/format";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, loading, logout, refreshUser, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const locale = i18n.language === "en" ? "en-US" : "tr-TR";

  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .myRegistrations()
      .then((data) => setRegistrations(unwrapList(data)))
      .catch(() => setRegistrations([]));
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user) return;
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      bio: user.bio || "",
      phone: user.phone || "",
    });
  }, [user]);

  async function handleSave() {
    setMessage("");
    setError("");
    try {
      await api.updateMe(form);
      await refreshUser();
      setMessage(t("profile.updated"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  if (loading) {
    return <LoadingView label={t("common.loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <Screen>
        <LanguageToggle />
        <ScreenHeader title={t("profile.guestTitle")} subtitle={t("profile.guestCopy")} />
        <Button label={t("auth.loginButton")} onPress={() => router.push("/login")} />
        <Button
          label={t("auth.registerButton")}
          variant="secondary"
          onPress={() => router.push("/register")}
          style={styles.secondaryButton}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <LanguageToggle />
      <ScreenHeader
        title={t("profile.title")}
        subtitle={user?.username ? `@${user.username}` : undefined}
      />
      <SuccessBanner message={message} />
      <ErrorBanner message={error} />

      <Input
        label={t("auth.firstName")}
        value={form.first_name}
        onChangeText={(value) => setForm((current) => ({ ...current, first_name: value }))}
      />
      <Input
        label={t("auth.lastName")}
        value={form.last_name}
        onChangeText={(value) => setForm((current) => ({ ...current, last_name: value }))}
      />
      <Input
        label={t("profile.phone")}
        value={form.phone}
        onChangeText={(value) => setForm((current) => ({ ...current, phone: value }))}
        keyboardType="phone-pad"
      />
      <Input
        label={t("profile.bio")}
        value={form.bio}
        onChangeText={(value) => setForm((current) => ({ ...current, bio: value }))}
        multiline
      />
      <Button label={t("common.save")} onPress={handleSave} />

      <Text style={styles.sectionTitle}>{t("profile.registrationsTitle")}</Text>
      {registrations.length === 0 ? (
        <Text style={styles.empty}>{t("profile.noRegistrations")}</Text>
      ) : (
        registrations.map((registration) => (
          <View key={registration.id} style={styles.registrationCard}>
            <Text style={styles.registrationTitle}>{registration.education_title}</Text>
            <Text style={styles.registrationMeta}>
              {formatDateTime(registration.education_start_at, locale)}
            </Text>
            <Text style={styles.registrationStatus}>
              {translateRegistrationStatus(t, registration.status)}
            </Text>
          </View>
        ))
      )}

      <Button
        label={t("auth.logout")}
        variant="secondary"
        onPress={logout}
        style={styles.secondaryButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  secondaryButton: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
  },
  empty: {
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  registrationCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.soft,
  },
  registrationTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  registrationMeta: {
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  registrationStatus: {
    color: colors.accent,
    fontWeight: "600",
  },
});
