import { Link } from "react-router-dom";

export default function EducationCard({ education }) {
  const startDate = new Date(education.start_at).toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article className="card education-card">
      <div className="card-tag">{education.category}</div>
      <h3>{education.title}</h3>
      <p>{education.summary}</p>
      <ul className="meta-list">
        <li>{startDate}</li>
        <li>{education.delivery_mode.replace("_", " ")}</li>
        <li>
          {education.spots_remaining} spots left / {education.capacity}
        </li>
      </ul>
      {education.is_registered && <span className="badge">Registered</span>}
      <Link to={`/educations/${education.slug}`} className="btn btn-secondary">
        View details
      </Link>
    </article>
  );
}
