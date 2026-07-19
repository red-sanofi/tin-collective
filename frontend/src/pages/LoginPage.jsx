import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/profile");
    } catch {
      setError(t("auth.invalidCredentials"));
    }
  }

  return (
    <div className="auth-page panel">
      <h1>{t("auth.loginTitle")}</h1>
      <form className="stack-form" onSubmit={handleSubmit}>
        <FormField
          label={t("auth.username")}
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <FormField
          label={t("auth.password")}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="alert alert-error">{error}</div>}
        <button type="submit" className="btn btn-primary">
          {t("auth.loginButton")}
        </button>
      </form>
      <p>
        {t("auth.needAccount")} <Link to="/register">{t("nav.signup")}</Link>
      </p>
    </div>
  );
}
