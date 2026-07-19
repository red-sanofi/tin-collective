import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import { formatDate, translateApiError } from "../utils/i18nHelpers";

export default function AnnouncementDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAnnouncement(slug)
      .then(setAnnouncement)
      .catch((err) => setError(translateApiError(t, err)));
  }, [slug, t]);

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!announcement) {
    return <div className="loading-block">{t("announcements.loadingDetail")}</div>;
  }

  const published = formatDate(announcement.published_at || announcement.created_at, {
    dateStyle: "long",
  });

  return (
    <article className="detail-page detail-magazine">
      <Link to="/announcements" className="text-link">
        {t("announcements.back")}
      </Link>
      <p className="card-date">{published}</p>
      <h1>{announcement.title}</h1>
      <p className="detail-summary">{announcement.summary}</p>
      <div className="detail-body">{announcement.body}</div>
    </article>
  );
}
