import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEducationImage } from "../constants/demoImages";
import {
  formatDateTime,
  translateCategory,
  translateDeliveryMode,
} from "../utils/i18nHelpers";

const tones = ["red", "blue", "yellow", "pink"];

export default function EducationCard({ education, tone = 0 }) {
  const { t } = useTranslation();
  const startDate = formatDateTime(education.start_at, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const toneClass = tones[tone % tones.length];
  const image = getEducationImage(education, tone);

  return (
    <article className={`card education-card card-tone-${toneClass}`}>
      <div className="card-tear" />
      <Link to={`/educations/${education.slug}`} className="card-image">
        <img src={image} alt="" loading="lazy" />
      </Link>
      <div className="card-tag">{translateCategory(t, education.category)}</div>
      <h3>{education.title}</h3>
      <p>{education.summary}</p>
      <ul className="meta-list">
        <li>{startDate}</li>
        <li>{translateDeliveryMode(t, education.delivery_mode)}</li>
        <li>
          {t("educations.spotsLeft", {
            remaining: education.spots_remaining,
            capacity: education.capacity,
          })}
        </li>
      </ul>
      {education.is_registered && <span className="badge">{t("educations.registered")}</span>}
      <Link to={`/educations/${education.slug}`} className="btn btn-secondary btn-tape">
        {t("common.viewDetails")}
      </Link>
    </article>
  );
}
