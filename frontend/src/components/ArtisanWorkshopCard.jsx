import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatDateTime,
  translateCategory,
  translateDeliveryMode,
} from "../utils/i18nHelpers";

const categoryImages = {
  Workshop: "/images/artisan-hero.png",
  Technology: "/images/artisan-hero.png",
  Culture: "/images/artisan-hero.png",
};

export default function ArtisanWorkshopCard({ education }) {
  const { t } = useTranslation();
  const startDate = formatDateTime(education.start_at, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const image = categoryImages[education.category] || categoryImages.Workshop;

  return (
    <article className="artisan-workshop-card">
      <div className="artisan-workshop-media">
        <img src={image} alt="" loading="lazy" />
      </div>
      <div className="artisan-workshop-body">
        <p className="artisan-workshop-category">{translateCategory(t, education.category)}</p>
        <h3>{education.title}</h3>
        <p>{education.summary}</p>
        <ul className="artisan-workshop-meta">
          <li>{startDate}</li>
          <li>{translateDeliveryMode(t, education.delivery_mode)}</li>
        </ul>
        <Link to={`/educations/${education.slug}`} className="artisan-workshop-cta">
          {education.is_registered ? t("educations.registered") : t("educations.register")}
        </Link>
      </div>
    </article>
  );
}
