import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import FormField from "../components/FormField";
import PageHero from "../components/PageHero";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../constants/themes";
import { translateApiError } from "../utils/i18nHelpers";

const emptyEducation = {
  title: "",
  summary: "",
  description: "",
  category: "Workshop",
  delivery_mode: "online",
  location: "",
  start_at: "",
  end_at: "",
  capacity: 20,
  is_published: true,
};

const emptyAnnouncement = {
  title: "",
  summary: "",
  body: "",
  is_published: true,
  published_at: "",
};

export default function AdminPage() {
  const { t } = useTranslation();
  const { applySiteDefaultTheme } = useTheme();
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement);
  const [defaultTheme, setDefaultTheme] = useState("gallery");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getSiteSettings()
      .then((settings) => setDefaultTheme(settings.default_theme || "gallery"))
      .catch(() => {});
  }, []);

  function handleEducationChange(event) {
    const { name, value, type, checked } = event.target;
    setEducationForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleAnnouncementChange(event) {
    const { name, value, type, checked } = event.target;
    setAnnouncementForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function createEducation(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createEducation({
        ...educationForm,
        capacity: Number(educationForm.capacity),
        end_at: educationForm.end_at || null,
      });
      setEducationForm(emptyEducation);
      setMessage(t("admin.educationCreated"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  async function createAnnouncement(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createAnnouncement({
        ...announcementForm,
        published_at: announcementForm.published_at || null,
      });
      setAnnouncementForm(emptyAnnouncement);
      setMessage(t("admin.announcementCreated"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  async function saveDefaultTheme(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const settings = await api.updateSiteSettings({ default_theme: defaultTheme });
      applySiteDefaultTheme(settings);
      setMessage(t("admin.defaultThemeSaved"));
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  const deliveryModeOptions = [
    { value: "online", label: t("deliveryMode.online") },
    { value: "in_person", label: t("deliveryMode.in_person") },
    { value: "hybrid", label: t("deliveryMode.hybrid") },
  ];

  const themeOptions = Object.values(THEMES).map((item) => ({
    value: item.id,
    label: t(item.labelKey),
  }));

  return (
    <div className="page-readable">
      <PageHero label={t("admin.eyebrow")} title={t("admin.title")} tone="yellow" />

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <section className="panel admin-theme-panel">
        <h2>{t("admin.defaultThemeTitle")}</h2>
        <p className="admin-theme-copy">{t("admin.defaultThemeCopy")}</p>
        <form className="stack-form admin-theme-form" onSubmit={saveDefaultTheme}>
          <FormField
            label={t("admin.defaultThemeLabel")}
            name="default_theme"
            as="select"
            value={defaultTheme}
            onChange={(event) => setDefaultTheme(event.target.value)}
            options={themeOptions}
          />
          <button type="submit" className="btn btn-primary">
            {t("admin.saveDefaultTheme")}
          </button>
        </form>
      </section>

      <div className="admin-grid">
        <section className="panel">
          <h2>{t("admin.newEducation")}</h2>
          <form className="stack-form" onSubmit={createEducation}>
            <FormField
              label={t("admin.titleField")}
              name="title"
              value={educationForm.title}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label={t("admin.summary")}
              name="summary"
              value={educationForm.summary}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label={t("admin.description")}
              name="description"
              as="textarea"
              value={educationForm.description}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label={t("admin.category")}
              name="category"
              value={educationForm.category}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label={t("admin.deliveryMode")}
              name="delivery_mode"
              as="select"
              value={educationForm.delivery_mode}
              onChange={handleEducationChange}
              options={deliveryModeOptions}
            />
            <FormField
              label={t("admin.location")}
              name="location"
              value={educationForm.location}
              onChange={handleEducationChange}
            />
            <FormField
              label={t("admin.startAt")}
              name="start_at"
              type="datetime-local"
              value={educationForm.start_at}
              onChange={handleEducationChange}
              required
            />
            <FormField
              label={t("admin.endAt")}
              name="end_at"
              type="datetime-local"
              value={educationForm.end_at}
              onChange={handleEducationChange}
            />
            <FormField
              label={t("admin.capacity")}
              name="capacity"
              type="number"
              value={educationForm.capacity}
              onChange={handleEducationChange}
              required
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="is_published"
                checked={educationForm.is_published}
                onChange={handleEducationChange}
              />
              {t("admin.published")}
            </label>
            <button type="submit" className="btn btn-primary">
              {t("admin.createEducation")}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>{t("admin.newAnnouncement")}</h2>
          <form className="stack-form" onSubmit={createAnnouncement}>
            <FormField
              label={t("admin.titleField")}
              name="title"
              value={announcementForm.title}
              onChange={handleAnnouncementChange}
              required
            />
            <FormField
              label={t("admin.summary")}
              name="summary"
              value={announcementForm.summary}
              onChange={handleAnnouncementChange}
              required
            />
            <FormField
              label={t("admin.body")}
              name="body"
              as="textarea"
              value={announcementForm.body}
              onChange={handleAnnouncementChange}
              required
            />
            <FormField
              label={t("admin.publishedAt")}
              name="published_at"
              type="datetime-local"
              value={announcementForm.published_at}
              onChange={handleAnnouncementChange}
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="is_published"
                checked={announcementForm.is_published}
                onChange={handleAnnouncementChange}
              />
              {t("admin.published")}
            </label>
            <button type="submit" className="btn btn-primary">
              {t("admin.createAnnouncement")}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
