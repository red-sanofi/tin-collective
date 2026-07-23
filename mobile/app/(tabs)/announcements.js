import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { api } from "../../src/api/client";
import AnnouncementCard from "../../src/components/AnnouncementCard";
import EmptyState from "../../src/components/EmptyState";
import { ErrorBanner, Screen, ScreenHeader } from "../../src/components/Screen";
import LoadingView from "../../src/components/LoadingView";
import { translateApiError, unwrapList } from "../../src/utils/format";

export default function AnnouncementsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(unwrapList(data));
      } catch (err) {
        setError(translateApiError(t, err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  if (loading) {
    return <LoadingView label={t("announcements.loading")} />;
  }

  return (
    <Screen>
      <ScreenHeader title={t("announcements.title")} subtitle={t("announcements.subtitle")} />
      <ErrorBanner message={error} />
      {announcements.length === 0 ? (
        <EmptyState title={t("announcements.empty")} />
      ) : (
        announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onPress={() => router.push(`/announcements/${announcement.slug}`)}
          />
        ))
      )}
    </Screen>
  );
}
