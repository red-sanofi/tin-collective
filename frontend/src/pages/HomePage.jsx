import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import AnnouncementCard from "../components/AnnouncementCard";
import EducationCard from "../components/EducationCard";

export default function HomePage() {
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
          <p className="eyebrow">Collective learning platform</p>
          <h1>Workshops, culture, and open calls — together.</h1>
          <p className="hero-copy">
            Tin Kolektif brings people together for hands-on educations from chocolate
            workshops to AI, cinema readings, and community announcements.
          </p>
          <div className="hero-actions">
            <Link to="/educations" className="btn btn-primary">
              Browse educations
            </Link>
            <Link to="/join-us" className="btn btn-secondary">
              Join the collective
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-stat">
            <strong>944+</strong>
            <span>community on Instagram</span>
          </div>
          <div className="hero-stat">
            <strong>Open</strong>
            <span>registrations for upcoming sessions</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Upcoming educations</h2>
          <Link to="/educations" className="text-link">
            View all
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
          <h2>Latest announcements</h2>
          <Link to="/announcements" className="text-link">
            View all
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
