import { useEffect, useState } from "react";
import { api } from "../api/client";
import AnnouncementCard from "../components/AnnouncementCard";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAnnouncements()
      .then((data) => setAnnouncements(data.results || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <header className="page-header">
        <p className="eyebrow">Announcements</p>
        <h1>News, open calls, and community updates</h1>
      </header>
      {loading && <div className="loading-block">Loading announcements...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card-grid">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>
    </div>
  );
}
