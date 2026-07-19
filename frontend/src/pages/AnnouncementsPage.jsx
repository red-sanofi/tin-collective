import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import AnnouncementCard from "../components/AnnouncementCard";
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
    <div className="page-chaos">
      <header className="page-header page-header-chaos">
        <p className="stamp-label">{t("announcements.eyebrow")}</p>
        <h1 className="page-title-slant">{t("announcements.title")}</h1>
      </header>
      {loading && <div className="loading-block">{t("announcements.loading")}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="announcement-stack">
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            tone={index % 4}
            scatter={index}
          />
        ))}
      </div>
    </div>
  );
}
