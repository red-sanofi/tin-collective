import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import AnnouncementCard from "../components/AnnouncementCard";
import EducationCard from "../components/EducationCard";

export default function HomePage() {
  const { t } = useTranslation();
  const [educations, setEducations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function load() {
      const [educationData, announcementData] = await Promise.all([
        api.getEducations(),
        api.getAnnouncements(),
      ]);
      setEducations((educationData.results || educationData).slice(0, 3));
      setAnnouncements((announcementData.results || announcementData).slice(0, 2));
    }
    load().catch(console.error);
  }, []);

  return (
    <div className="home-page">
      <section className="hero poster-hero">
        <div className="hero-content">
          <p className="eyebrow">{t("home.eyebrow")}</p>
          <h1>
            <span className="hero-line">{t("home.title")}</span>
          </h1>
          <p className="hero-copy">{t("home.copy")}</p>
          <div className="hero-actions">
            <Link to="/educations" className="btn btn-primary">
              {t("home.browseEducations")}
            </Link>
            <Link to="/join-us" className="btn btn-secondary">
              {t("home.joinCollective")}
            </Link>
          </div>
        </div>
        <div className="hero-collage" aria-hidden="true">
          <div className="collage-block collage-red">
            <span>944+</span>
            <small>{t("home.instagramCommunity")}</small>
          </div>
          <div className="collage-block collage-blue">
            <span>SINEMA</span>
          </div>
          <div className="collage-block collage-yellow">
            <span>{t("common.open")}</span>
            <small>{t("home.openRegistrations")}</small>
          </div>
          <div className="collage-block collage-pink">
            <span>AI</span>
            <small>WORKSHOP</small>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("educations.eyebrow")}</p>
            <h2>{t("home.upcomingEducations")}</h2>
          </div>
          <Link to="/educations" className="text-link">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="card-grid">
          {educations.map((education, index) => (
            <EducationCard key={education.id} education={education} tone={index % 4} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("announcements.eyebrow")}</p>
            <h2>{t("home.latestAnnouncements")}</h2>
          </div>
          <Link to="/announcements" className="text-link">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="card-grid">
          {announcements.map((announcement, index) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} tone={index % 4} />
          ))}
        </div>
      </section>
    </div>
  );
}
