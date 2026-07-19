import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import ArtisanWorkshopCard from "../../components/ArtisanWorkshopCard";
import { useAuth } from "../../context/AuthContext";

export default function HomePageArtisan() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [educations, setEducations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function load() {
      const [educationData, announcementData] = await Promise.all([
        api.getEducations(),
        api.getAnnouncements(),
      ]);
      setEducations((educationData.results || educationData).slice(0, 3));
      setAnnouncements((announcementData.results || announcementData).slice(0, 3));
    }
    load().catch(console.error);
  }, []);

  return (
    <div className="home-page home-artisan">
      <section className="artisan-hero">
        <img
          className="artisan-hero-image"
          src="/images/artisan-hero.png"
          alt={t("themes.artisan.heroAlt")}
        />
        <div className="artisan-hero-overlay" />
        <div className="artisan-hero-content">
          <div className="artisan-hero-badges">
            <Link to={user ? "/profile" : "/login"} className="artisan-circle-btn">
              {user ? t("themes.artisan.memberProfile") : t("themes.artisan.memberLogin")}
            </Link>
            <Link to="/educations" className="artisan-circle-btn artisan-circle-btn-accent">
              {t("themes.artisan.explore")}
            </Link>
          </div>

          <div className="artisan-hero-copy">
            <p className="artisan-hero-kicker">{t("themes.artisan.heroKicker")}</p>
            <h1>{t("themes.artisan.heroTitle")}</h1>
            <p>{t("themes.artisan.heroSubtitle")}</p>
          </div>
        </div>
      </section>

      <section className="artisan-section">
        <div className="artisan-section-head">
          <h2>{t("themes.artisan.workshopsTitle")}</h2>
          <Link to="/educations" className="artisan-section-link">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="artisan-workshop-grid">
          {educations.map((education) => (
            <ArtisanWorkshopCard key={education.id} education={education} />
          ))}
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="artisan-section artisan-section-muted">
          <div className="artisan-section-head">
            <h2>{t("themes.artisan.announcementsTitle")}</h2>
            <Link to="/announcements" className="artisan-section-link">
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="artisan-announcement-list">
            {announcements.map((announcement) => (
              <Link
                key={announcement.id}
                to={`/announcements/${announcement.slug}`}
                className="artisan-announcement-item"
              >
                <strong>{announcement.title}</strong>
                <span>{announcement.summary}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
