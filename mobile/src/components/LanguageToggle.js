import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { setStoredLanguage } from "../api/storage";
import { colors, spacing } from "../theme";

export default function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "tr";

  async function switchLanguage(language) {
    await setStoredLanguage(language);
    i18n.changeLanguage(language);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("language.label")}</Text>
      <View style={styles.row}>
        {["tr", "en"].map((language) => (
          <Pressable
            key={language}
            style={[styles.chip, current === language && styles.chipActive]}
            onPress={() => switchLanguage(language)}
          >
            <Text style={[styles.chipText, current === language && styles.chipTextActive]}>
              {t(`language.${language}`)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.muted,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.ink,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.accent,
  },
});
