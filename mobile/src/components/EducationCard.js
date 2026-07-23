import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, radius, spacing } from "../theme";
import { formatDateTime, translateCategory } from "../utils/format";

export default function EducationCard({ education, onPress }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "tr-TR";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.tagRow}>
        <Text style={styles.tag}>{translateCategory(t, education.category)}</Text>
        {education.is_full ? <Text style={styles.full}>{t("educations.full")}</Text> : null}
      </View>
      <Text style={styles.title}>{education.title}</Text>
      {education.summary ? <Text style={styles.summary}>{education.summary}</Text> : null}
      <Text style={styles.meta}>{formatDateTime(education.start_at, locale)}</Text>
      {education.location ? <Text style={styles.meta}>{education.location}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  tag: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  full: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
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
  meta: {
    color: colors.muted,
    fontSize: 14,
  },
});
