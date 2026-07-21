import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEducationImage } from "../constants/demoImages";
import {
  formatDateTime,
  translateCategory,
  translateDeliveryMode,
} from "../utils/i18nHelpers";

export default function GalleryWorkshopCard({ education, featured = false, index = 0 }) {
  const { t } = useTranslation();
  const startDate = formatDateTime(education.start_at, {
    dateStyle: "long",
    timeStyle: "short",
  });
  const image = getEducationImage(education, index);

  return (
    <article className={`gallery-workshop-card${featured ? " is-featured" : ""}`}>
      <Link to={`/educations/${education.slug}`} className="gallery-workshop-media">
        <img src={image} alt="" loading="lazy" />
      </Link>
      <div className="gallery-workshop-body">
        <p className="gallery-workshop-meta">
          {translateCategory(t, education.category)} · {translateDeliveryMode(t, education.delivery_mode)}
        </p>
        <h3>
          <Link to={`/educations/${education.slug}`}>{education.title}</Link>
        </h3>
        <p>{education.summary}</p>
        <ul className="gallery-workshop-details">
          <li>{startDate}</li>
          {education.location && <li>{education.location}</li>}
          <li>
            {t("educations.spotsLeft", {
              remaining: education.spots_remaining,
              capacity: education.capacity,
            })}
          </li>
        </ul>
        <Link to={`/educations/${education.slug}`} className="gallery-btn gallery-btn-outline">
          {t("themes.gallery.explore")}
        </Link>
      </div>
    </article>
  );
}
