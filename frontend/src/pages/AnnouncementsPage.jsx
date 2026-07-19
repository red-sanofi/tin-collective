import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import AnnouncementCard from "../components/AnnouncementCard";
import ArtGrid from "../components/ArtGrid";
import PageHero from "../components/PageHero";
import { translateApiError } from "../utils/i18nHelpers";

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAnnouncements()
      .then((data) => setAnnouncements(data.results || data))
      .catch((err) => setError(translateApiError(t, err)))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <div className="page-readable">
      <PageHero
        label={t("announcements.eyebrow")}
        title={t("announcements.title")}
        subtitle={t("announcements.subtitle")}
        tone="pink"
      />

      {loading && <div className="loading-block">{t("announcements.loading")}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <ArtGrid>
        {announcements.map((announcement, index) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} tone={index % 4} />
        ))}
      </ArtGrid>
    </div>
  );
}
