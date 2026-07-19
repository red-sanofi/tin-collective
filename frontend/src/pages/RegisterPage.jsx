import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { translateApiError } from "../utils/i18nHelpers";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/profile");
    } catch (err) {
      setError(translateApiError(t, err));
    }
  }

  return (
    <div className="auth-page panel auth-panel-chaos">
      <h1>{t("auth.registerTitle")}</h1>
      <form className="stack-form" onSubmit={handleSubmit}>
        <FormField
          label={t("auth.username")}
          name="username"
          value={form.username}
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
          label={t("auth.password")}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <FormField
          label={t("auth.confirmPassword")}
          name="password_confirm"
          type="password"
          value={form.password_confirm}
          onChange={handleChange}
          required
        />
        {error && <div className="alert alert-error">{error}</div>}
        <button type="submit" className="btn btn-primary">
          {t("auth.registerButton")}
        </button>
      </form>
      <p>
        {t("auth.haveAccount")} <Link to="/login">{t("nav.login")}</Link>
      </p>
    </div>
  );
}
