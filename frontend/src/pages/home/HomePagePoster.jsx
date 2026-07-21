import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import AnnouncementCard from "../../components/AnnouncementCard";
import ArtGrid from "../../components/ArtGrid";
import EducationCard from "../../components/EducationCard";
import FragmentTitle from "../../components/FragmentTitle";
import SocialFeed from "../../components/SocialFeed";

export default function HomePagePoster() {
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
      setAnnouncements((announcementData.results || announcementData).slice(0, 4));
    }
    load().catch(console.error);
  }, []);

  const titleFragments = t("home.titleFragments", { returnObjects: true });

  return (
    <div className="home-page home-chaos">
      <section className="chaos-hero">
        <div className="chaos-hero-left">
          <p className="stamp-label">{t("home.eyebrow")}</p>
          <FragmentTitle fragments={Array.isArray(titleFragments) ? titleFragments : [t("home.title")]} />
          <p className="hero-copy tilt-copy">{t("home.copy")}</p>
          <div className="hero-actions skew-actions">
            <Link to="/educations" className="btn btn-primary btn-tape">
              {t("home.browseEducations")}
            </Link>
            <Link to="/join-us" className="btn btn-secondary btn-tape">
              {t("home.joinCollective")}
            </Link>
          </div>
        </div>

        <div className="chaos-orbit" aria-hidden="true">
          <div className="orbit-card orbit-red">
            <strong>944+</strong>
            <span>{t("home.instagramCommunity")}</span>
          </div>
          <div className="orbit-card orbit-blue">
            <strong>{t("home.collageSinema")}</strong>
          </div>
          <div className="orbit-card orbit-yellow">
            <strong>{t("common.open")}</strong>
            <span>{t("home.openRegistrations")}</span>
          </div>
          <div className="orbit-card orbit-pink">
            <strong>{t("home.collageAi")}</strong>
            <span>{t("home.collageWorkshop")}</span>
          </div>
          <div className="orbit-ring" />
        </div>
      </section>

      <section className="section-chaos">
        <div className="section-marker">
          <span className="section-index">01</span>
          <div>
            <p className="stamp-label">{t("educations.eyebrow")}</p>
            <h2>{t("home.upcomingEducations")}</h2>
          </div>
          <Link to="/educations" className="text-link text-link-tilt">
            {t("common.viewAll")}
          </Link>
        </div>
        <ArtGrid>
          {educations.map((education, index) => (
            <EducationCard key={education.id} education={education} tone={index % 4} />
          ))}
        </ArtGrid>
      </section>

      <section className="section-chaos section-chaos-alt">
        <div className="section-marker">
          <span className="section-index">02</span>
          <div>
            <p className="stamp-label">{t("announcements.eyebrow")}</p>
            <h2>{t("home.latestAnnouncements")}</h2>
          </div>
          <Link to="/announcements" className="text-link text-link-tilt">
            {t("common.viewAll")}
          </Link>
        </div>
        <ArtGrid>
          {announcements.map((announcement, index) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} tone={index % 4} />
          ))}
        </ArtGrid>
      </section>

      <SocialFeed className="section-chaos" />
    </div>
  );
}
