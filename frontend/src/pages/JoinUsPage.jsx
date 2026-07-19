import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import FormField from "../components/FormField";
import PageHero from "../components/PageHero";
import { translateApiError, translateInterestArea } from "../utils/i18nHelpers";

const interestAreaValues = ["Education", "Workshop", "Technology", "Culture", "Volunteer"];

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  interest_area: "Education",
  message: "",
  portfolio_url: "",
};

export default function JoinUsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await api.submitJoinApplication(form);
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  return (
    <div className="page-readable split-page">
      <PageHero
        label={t("joinUs.eyebrow")}
        title={t("joinUs.title")}
        subtitle={t("joinUs.copy")}
        tone="pink"
      />
      <section className="join-features">
        <ul className="feature-list">
          <li>{t("joinUs.feature1")}</li>
          <li>{t("joinUs.feature2")}</li>
          <li>{t("joinUs.feature3")}</li>
        </ul>
      </section>
      <section className="panel">
        {submitted ? (
          <div className="alert alert-success">{t("joinUs.success")}</div>
        ) : (
          <form className="stack-form" onSubmit={handleSubmit}>
            <FormField
              label={t("forms.fullName")}
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <FormField
              label={t("auth.email")}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <FormField
              label={t("forms.phone")}
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <FormField
              label={t("forms.interestArea")}
              name="interest_area"
              as="select"
              value={form.interest_area}
              onChange={handleChange}
              options={interestAreaValues.map((value) => ({
                value,
                label: translateInterestArea(t, value),
              }))}
            />
            <FormField
              label={t("forms.portfolioUrl")}
              name="portfolio_url"
              value={form.portfolio_url}
              onChange={handleChange}
            />
            <FormField
              label={t("forms.aboutYou")}
              name="message"
              as="textarea"
              value={form.message}
              onChange={handleChange}
              required
            />
            {error && <div className="alert alert-error">{error}</div>}
            <button type="submit" className="btn btn-primary">
              {t("joinUs.submit")}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
