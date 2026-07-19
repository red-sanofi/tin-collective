import { useEffect, useState } from "react";
import { api } from "../api/client";
import EducationCard from "../components/EducationCard";

export default function EducationsPage() {
  const [educations, setEducations] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const query = category ? `?category=${encodeURIComponent(category)}` : "";
        const data = await api.getEducations(query);
        setEducations(data.results || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">Educations</p>
          <h1>Register for workshops and learning sessions</h1>
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          <option value="Workshop">Workshop</option>
          <option value="Technology">Technology</option>
          <option value="Culture">Culture</option>
        </select>
      </header>

      {loading && <div className="loading-block">Loading educations...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card-grid">
        {educations.map((education) => (
          <EducationCard key={education.id} education={education} />
        ))}
      </div>
    </div>
  );
}
