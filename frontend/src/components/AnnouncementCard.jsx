import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAnnouncementImage } from "../constants/demoImages";
import { formatDate } from "../utils/i18nHelpers";

const tones = ["blue", "pink", "yellow", "red"];

export default function AnnouncementCard({ announcement, tone = 0 }) {
  const { t } = useTranslation();
  const published = formatDate(announcement.published_at || announcement.created_at, {
    dateStyle: "medium",
  });
  const toneClass = tones[tone % tones.length];
  const image = getAnnouncementImage(announcement, tone);

  return (
    <article className={`card announcement-card card-tone-${toneClass}`}>
      <div className="card-tear" />
      <Link to={`/announcements/${announcement.slug}`} className="card-image card-image-compact">
        <img src={image} alt="" loading="lazy" />
      </Link>
      <p className="card-date">{published}</p>
      <h3>{announcement.title}</h3>
      <p>{announcement.summary}</p>
      <Link to={`/announcements/${announcement.slug}`} className="text-link text-link-tilt">
        {t("common.readMore")}
      </Link>
    </article>
  );
}
