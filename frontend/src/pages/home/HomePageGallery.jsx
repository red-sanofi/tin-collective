import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import GalleryWorkshopCard from "../../components/GalleryWorkshopCard";
import SocialFeed from "../../components/SocialFeed";
import { getFeaturedHeroImage } from "../../constants/demoImages";
import { formatCompactDate } from "../../utils/i18nHelpers";

export default function HomePageGallery() {
  const { t } = useTranslation();
  const [educations, setEducations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function load() {
      const [educationData, announcementData] = await Promise.all([
        api.getEducations(),
        api.getAnnouncements(),
      ]);
      setEducations((educationData.results || educationData).slice(0, 4));
      setAnnouncements((announcementData.results || announcementData).slice(0, 6));
    }
    load().catch(console.error);
  }, []);

  const featured = educations[0];
  const upcoming = educations.slice(0, 4);

  return (
    <div className="home-page home-gallery">
      {featured && (
        <section className="gallery-feature-hero">
          <div className="gallery-feature-media">
            <img src={getFeaturedHeroImage()} alt="" />
          </div>
          <div className="gallery-feature-copy">
            <p className="gallery-feature-kicker">{t("themes.gallery.heroKicker")}</p>
            <h1>{featured.title}</h1>
            <p>{featured.summary}</p>
            <Link to={`/educations/${featured.slug}`} className="gallery-btn gallery-btn-primary">
              {t("themes.gallery.explore")}
            </Link>
          </div>
        </section>
      )}

      <section className="gallery-section">
        <div className="gallery-section-head">
          <h2>{t("themes.gallery.workshopsTitle")}</h2>
          <Link to="/educations">{t("common.viewAll")}</Link>
        </div>
        <div className="gallery-workshop-list">
          {upcoming.map((education, index) => (
            <GalleryWorkshopCard key={education.id} education={education} index={index} featured={index === 0} />
          ))}
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="gallery-section gallery-section-journal">
          <div className="gallery-section-head">
            <h2>{t("themes.gallery.journalTitle")}</h2>
            <Link to="/announcements">{t("common.viewAll")}</Link>
          </div>
          <div className="gallery-journal-list">
            {announcements.map((announcement) => {
              const { day, month } = formatCompactDate(
                announcement.published_at || announcement.created_at,
              );
              return (
                <Link
                  key={announcement.id}
                  to={`/announcements/${announcement.slug}`}
                  className="gallery-journal-item"
                >
                  <div className="gallery-journal-date">
                    <strong>{day}</strong>
                    <span>{month}</span>
                  </div>
                  <div className="gallery-journal-body">
                    <h3>{announcement.title}</h3>
                    <p>{announcement.summary}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <SocialFeed className="gallery-section" />
    </div>
  );
}
