import { Pressable, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius, spacing } from "../theme";
import { formatDateTime } from "../utils/format";

export default function AnnouncementCard({ announcement, onPress }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "tr-TR";
  const date = announcement.published_at || announcement.created_at;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.date}>{formatDateTime(date, locale)}</Text>
      <Text style={styles.title}>{announcement.title}</Text>
      {announcement.summary ? <Text style={styles.summary}>{announcement.summary}</Text> : null}
      <Text style={styles.link}>{t("common.viewDetails")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.soft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  date: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  summary: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  link: {
    color: colors.accent,
    fontWeight: "600",
  },
});
