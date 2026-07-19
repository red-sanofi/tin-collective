import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import EducationCard from "../components/EducationCard";
import { translateApiError } from "../utils/i18nHelpers";

const categoryOptions = ["Workshop", "Technology", "Culture"];

export default function EducationsPage() {
  const { t } = useTranslation();
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
        setError(translateApiError(t, err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, t]);

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="eyebrow">{t("educations.eyebrow")}</p>
          <h1>{t("educations.title")}</h1>
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">{t("educations.allCategories")}</option>
          {categoryOptions.map((option) => (
            <option key={option} value={option}>
              {t(`categories.${option}`)}
            </option>
          ))}
        </select>
      </header>

      {loading && <div className="loading-block">{t("educations.loading")}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card-grid">
        {educations.map((education, index) => (
          <EducationCard key={education.id} education={education} tone={index % 4} />
        ))}
      </div>
    </div>
  );
}
