import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/i18nHelpers";

export default function AnnouncementCard({ announcement }) {
  const { t } = useTranslation();
  const published = formatDate(announcement.published_at || announcement.created_at, {
    dateStyle: "medium",
  });

  return (
    <article className="card announcement-card">
      <p className="card-date">{published}</p>
      <h3>{announcement.title}</h3>
      <p>{announcement.summary}</p>
      <Link to={`/announcements/${announcement.slug}`} className="text-link">
        {t("common.readMore")}
      </Link>
    </article>
  );
}
