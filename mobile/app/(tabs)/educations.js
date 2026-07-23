import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import EducationCard from "../../src/components/EducationCard";
import EmptyState from "../../src/components/EmptyState";
import { ErrorBanner, Screen, ScreenHeader } from "../../src/components/Screen";
import LoadingView from "../../src/components/LoadingView";
import { colors, radius, spacing } from "../../src/theme";
import { translateApiError, unwrapList } from "../../src/utils/format";

const categories = ["", "Workshop", "Technology", "Culture"];

export default function EducationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [educations, setEducations] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const query = category ? `?category=${encodeURIComponent(category)}` : "";
        const data = await api.getEducations(query);
        setEducations(unwrapList(data));
      } catch (err) {
        setError(translateApiError(t, err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, t]);

  if (loading) {
    return <LoadingView label={t("educations.loading")} />;
  }

  return (
    <Screen>
      <ScreenHeader title={t("educations.title")} subtitle={t("educations.subtitle")} />
      <View style={styles.filters}>
        {categories.map((value) => {
          const active = category === value;
          const label = value ? t(`categories.${value}`) : t("educations.allCategories");
          return (
            <Pressable
              key={value || "all"}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategory(value)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <ErrorBanner message={error} />
      {educations.length === 0 ? (
        <EmptyState title={t("educations.empty")} />
      ) : (
        educations.map((education) => (
          <EducationCard
            key={education.id}
            education={education}
            onPress={() => router.push(`/educations/${education.slug}`)}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
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
