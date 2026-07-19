import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function EducationDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [education, setEducation] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadEducation() {
    const data = await api.getEducation(slug);
    setEducation(data);
  }

  useEffect(() => {
    loadEducation().catch((err) => setError(err.message));
  }, [slug]);

  async function handleRegister() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.registerForEducation(slug);
      setMessage("Registration successful.");
      await loadEducation();
    } catch (err) {
      setError(err.data?.detail || err.message);
    }
  }

  async function handleCancel() {
    setError("");
    setMessage("");
    try {
      await api.cancelEducationRegistration(slug);
      setMessage("Registration cancelled.");
      await loadEducation();
    } catch (err) {
      setError(err.data?.detail || err.message);
    }
  }

  if (!education) {
    return <div className="loading-block">Loading education...</div>;
  }

  const startDate = new Date(education.start_at).toLocaleString("tr-TR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <article className="detail-page">
      <Link to="/educations" className="text-link">
        Back to educations
      </Link>
      <div className="detail-header">
        <span className="card-tag">{education.category}</span>
        <h1>{education.title}</h1>
        <p>{education.summary}</p>
      </div>
      <div className="detail-meta">
        <p>
          <strong>When:</strong> {startDate}
        </p>
        <p>
          <strong>Mode:</strong> {education.delivery_mode.replace("_", " ")}
        </p>
        {education.location && (
          <p>
            <strong>Location:</strong> {education.location}
          </p>
        )}
        <p>
          <strong>Capacity:</strong> {education.registration_count}/{education.capacity}
        </p>
      </div>
      <div className="detail-body">{education.description}</div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-actions">
        {education.is_registered ? (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel registration
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRegister}
            disabled={education.is_full}
          >
            {education.is_full ? "Waitlist only" : "Register"}
          </button>
        )}
      </div>
    </article>
  );
}
