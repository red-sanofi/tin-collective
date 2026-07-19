import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDate } from "../utils/i18nHelpers";

const tones = ["blue", "pink", "yellow", "red"];

export default function AnnouncementCard({ announcement, tone = 0 }) {
  const { t } = useTranslation();
  const published = formatDate(announcement.published_at || announcement.created_at, {
    dateStyle: "medium",
  });
  const toneClass = tones[tone % tones.length];

  return (
    <article className={`card announcement-card card-tone-${toneClass}`}>
      <div className="card-topline" />
      <p className="card-date">{published}</p>
      <h3>{announcement.title}</h3>
      <p>{announcement.summary}</p>
      <Link to={`/announcements/${announcement.slug}`} className="text-link">
        {t("common.readMore")}
      </Link>
    </article>
  );
}
