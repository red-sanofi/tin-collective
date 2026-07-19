import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { translateApiError, translateRegistrationStatus } from "../utils/i18nHelpers";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.myRegistrations().then(setRegistrations).catch(console.error);
  }, []);

  useEffect(() => {
    setForm({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
    });
  }, [user]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.updateMe(form);
      await refreshUser();
      setMessage(t("profile.updated"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  return (
    <div className="page-chaos profile-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t("profile.eyebrow")}</p>
          <h1>{t("profile.welcome", { username: user.username })}</h1>
        </div>
      </header>

      <div className="profile-grid">
        <section className="panel">
          <h2>{t("profile.yourDetails")}</h2>
          <form className="stack-form" onSubmit={handleSubmit}>
            <FormField
              label={t("auth.firstName")}
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />
            <FormField
              label={t("auth.lastName")}
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />
            <FormField
              label={t("profile.phone")}
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <FormField
              label={t("profile.bio")}
              name="bio"
              as="textarea"
              value={form.bio}
              onChange={handleChange}
            />
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary">
              {t("profile.saveProfile")}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>{t("profile.yourRegistrations")}</h2>
          {registrations.length === 0 ? (
            <p>{t("profile.noRegistrations")}</p>
          ) : (
            <ul className="registration-list">
              {registrations.map((registration) => (
                <li key={registration.id}>
                  <div>
                    <strong>{registration.education_title}</strong>
                    <p>{translateRegistrationStatus(t, registration.status)}</p>
                  </div>
                  <Link to={`/educations/${registration.education_slug}`} className="text-link">
                    {t("common.view")}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
