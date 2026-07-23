import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import Button from "../../src/components/Button";
import LoadingView from "../../src/components/LoadingView";
import {
  ErrorBanner,
  Screen,
  SuccessBanner,
} from "../../src/components/Screen";
import { useAuth } from "../../src/context/AuthContext";
import { colors, spacing } from "../../src/theme";
import {
  formatDateTime,
  translateApiError,
  translateCategory,
  translateDeliveryMode,
} from "../../src/utils/format";

export default function EducationDetailScreen() {
  const { slug } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [education, setEducation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const locale = i18n.language === "en" ? "en-US" : "tr-TR";

  async function loadEducation() {
    const data = await api.getEducation(slug);
    setEducation(data);
  }

  useEffect(() => {
    loadEducation().catch((err) => setError(translateApiError(t, err)));
  }, [slug, t]);

  async function handleRegister() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.registerForEducation(slug);
      setMessage(t("educations.registrationSuccess"));
      await loadEducation();
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  async function handleCancel() {
    setError("");
    setMessage("");
    try {
      await api.cancelEducationRegistration(slug);
      setMessage(t("educations.registrationCancelled"));
      await loadEducation();
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  if (!education) {
    return <LoadingView label={t("educations.loading")} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: education.title }} />
      <Screen>
        <Text style={styles.tag}>{translateCategory(t, education.category)}</Text>
        <Text style={styles.title}>{education.title}</Text>
        {education.summary ? <Text style={styles.summary}>{education.summary}</Text> : null}
        <Text style={styles.meta}>
          {t("educations.when")}: {formatDateTime(education.start_at, locale)}
        </Text>
        {education.location ? (
          <Text style={styles.meta}>
            {t("educations.where")}: {education.location}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          {t("educations.mode")}: {translateDeliveryMode(t, education.delivery_mode)}
        </Text>
        <Text style={styles.meta}>
          {t("educations.capacity")}: {education.registration_count}/{education.capacity}
        </Text>
        {education.description ? <Text style={styles.body}>{education.description}</Text> : null}

        <SuccessBanner message={message} />
        <ErrorBanner message={error} />

        {!isAuthenticated ? (
          <Button label={t("educations.loginToRegister")} onPress={() => router.push("/login")} />
        ) : education.is_registered ? (
          <Button label={t("educations.cancelRegistration")} variant="secondary" onPress={handleCancel} />
        ) : (
          <Button
            label={t("educations.register")}
            onPress={handleRegister}
            disabled={education.is_full}
          />
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  tag: {
    color: colors.accent,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  summary: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  meta: {
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
});
