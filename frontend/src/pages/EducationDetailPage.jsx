import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import {
  formatDateTime,
  translateApiError,
  translateCategory,
  translateDeliveryMode,
} from "../utils/i18nHelpers";

export default function EducationDetailPage() {
  const { t } = useTranslation();
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
    loadEducation().catch((err) => setError(translateApiError(t, err)));
  }, [slug, t]);

  async function handleRegister() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setError("");
    setMessage("");
    try {
      await api.registerForEducation(slug);
      setMessage(t("educations.registrationSuccess"));
      await loadEducation();
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  async function handleCancel() {
    setError("");
    setMessage("");
    try {
      await api.cancelEducationRegistration(slug);
      setMessage(t("educations.registrationCancelled"));
      await loadEducation();
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  if (!education) {
    return <div className="loading-block">{t("educations.loadingDetail")}</div>;
  }

  const startDate = formatDateTime(education.start_at, {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <article className="detail-page detail-magazine">
      <Link to="/educations" className="text-link">
        {t("educations.back")}
      </Link>
      <div className="detail-header">
        <span className="card-tag">{translateCategory(t, education.category)}</span>
        <h1>{education.title}</h1>
        <p>{education.summary}</p>
      </div>
      <div className="detail-meta">
        <p>
          <strong>{t("educations.when")}:</strong> {startDate}
        </p>
        <p>
          <strong>{t("educations.mode")}:</strong>{" "}
          {translateDeliveryMode(t, education.delivery_mode)}
        </p>
        {education.location && (
          <p>
            <strong>{t("educations.location")}:</strong> {education.location}
          </p>
        )}
        <p>
          <strong>{t("educations.capacity")}:</strong> {education.registration_count}/
          {education.capacity}
        </p>
      </div>
      <div className="detail-body">{education.description}</div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="detail-actions">
        {education.is_registered ? (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            {t("educations.cancelRegistration")}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRegister}
            disabled={education.is_full}
          >
            {education.is_full ? t("educations.waitlistOnly") : t("educations.register")}
          </button>
        )}
      </div>
    </article>
  );
}
