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
      <section className="hero">
        <div>
          <p className="eyebrow">{t("home.eyebrow")}</p>
          <h1>{t("home.title")}</h1>
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
        <div className="hero-panel">
          <div className="hero-stat">
            <strong>944+</strong>
            <span>{t("home.instagramCommunity")}</span>
          </div>
          <div className="hero-stat">
            <strong>{t("common.open")}</strong>
            <span>{t("home.openRegistrations")}</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>{t("home.upcomingEducations")}</h2>
          <Link to="/educations" className="text-link">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="card-grid">
          {educations.map((education) => (
            <EducationCard key={education.id} education={education} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>{t("home.latestAnnouncements")}</h2>
          <Link to="/announcements" className="text-link">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="card-grid">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </div>
  );
}
