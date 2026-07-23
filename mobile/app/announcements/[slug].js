import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import LoadingView from "../../src/components/LoadingView";
import { ErrorBanner, Screen } from "../../src/components/Screen";
import { colors, spacing } from "../../src/theme";
import { formatDateTime, translateApiError } from "../../src/utils/format";

export default function AnnouncementDetailScreen() {
  const { slug } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState("");
  const locale = i18n.language === "en" ? "en-US" : "tr-TR";

  useEffect(() => {
    api
      .getAnnouncement(slug)
      .then(setAnnouncement)
      .catch((err) => setError(translateApiError(t, err)));
  }, [slug, t]);

  if (!announcement) {
    return <LoadingView label={t("announcements.loading")} />;
  }

  const date = announcement.published_at || announcement.created_at;

  return (
    <>
      <Stack.Screen options={{ title: announcement.title }} />
      <Screen>
        <Text style={styles.date}>{formatDateTime(date, locale)}</Text>
        <Text style={styles.title}>{announcement.title}</Text>
        {announcement.summary ? <Text style={styles.summary}>{announcement.summary}</Text> : null}
        <ErrorBanner message={error} />
        {announcement.body ? <Text style={styles.body}>{announcement.body}</Text> : null}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  date: {
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  summary: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  body: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 26,
  },
});
