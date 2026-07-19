import { Link } from "react-router-dom";

export default function AnnouncementCard({ announcement }) {
  const published = announcement.published_at
    ? new Date(announcement.published_at).toLocaleDateString("tr-TR")
    : new Date(announcement.created_at).toLocaleDateString("tr-TR");

  return (
    <article className="card announcement-card">
      <p className="card-date">{published}</p>
      <h3>{announcement.title}</h3>
      <p>{announcement.summary}</p>
      <Link to={`/announcements/${announcement.slug}`} className="text-link">
        Read more
      </Link>
    </article>
  );
}
