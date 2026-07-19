import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function AnnouncementDetailPage() {
  const { slug } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAnnouncement(slug)
      .then(setAnnouncement)
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!announcement) {
    return <div className="loading-block">Loading announcement...</div>;
  }

  const published = announcement.published_at
    ? new Date(announcement.published_at).toLocaleDateString("tr-TR")
    : new Date(announcement.created_at).toLocaleDateString("tr-TR");

  return (
    <article className="detail-page">
      <Link to="/announcements" className="text-link">
        Back to announcements
      </Link>
      <p className="card-date">{published}</p>
      <h1>{announcement.title}</h1>
      <p className="detail-summary">{announcement.summary}</p>
      <div className="detail-body">{announcement.body}</div>
    </article>
  );
}
