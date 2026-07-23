import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import AnnouncementCard from "../../src/components/AnnouncementCard";
import Button from "../../src/components/Button";
import EducationCard from "../../src/components/EducationCard";
import LanguageToggle from "../../src/components/LanguageToggle";
import { ErrorBanner, Screen, ScreenHeader, SectionTitle } from "../../src/components/Screen";
import LoadingView from "../../src/components/LoadingView";
import { colors, spacing } from "../../src/theme";
import { translateApiError, unwrapList } from "../../src/utils/format";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [educations, setEducations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [educationData, announcementData] = await Promise.all([
          api.getEducations(),
          api.getAnnouncements(),
        ]);
        setEducations(unwrapList(educationData).slice(0, 3));
        setAnnouncements(unwrapList(announcementData).slice(0, 3));
      } catch (err) {
        setError(translateApiError(t, err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  if (loading) {
    return <LoadingView label={t("common.loading")} />;
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
      </View>
      <LanguageToggle />
      <ScreenHeader
        eyebrow={t("home.eyebrow")}
        title={t("home.title")}
        subtitle={t("home.subtitle")}
      />
      <ErrorBanner message={error} />
      <Button label={t("home.joinCta")} onPress={() => router.push("/join-us")} />

      <SectionTitle
        title={t("home.workshopsTitle")}
        actionLabel={t("common.viewAll")}
        onAction={() => router.push("/(tabs)/educations")}
      />
      {educations.map((education) => (
        <EducationCard
          key={education.id}
          education={education}
          onPress={() => router.push(`/educations/${education.slug}`)}
        />
      ))}

      <SectionTitle
        title={t("home.journalTitle")}
        actionLabel={t("common.viewAll")}
        onAction={() => router.push("/(tabs)/announcements")}
      />
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          onPress={() => router.push(`/announcements/${announcement.slug}`)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
  },
});
